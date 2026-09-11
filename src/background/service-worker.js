import {
  applyObservation,
  completeDownloadRecord,
  decideDownload,
  emptyTabState,
  interruptedDownloadRecord,
  isDownloadUrlAllowed,
  isQualifiedPageDownloadSignal,
  normalizePackageIdentity,
  pendingDownloadRecord,
  reduceBenchmark
} from '../shared/protocol.js';

const TAB_STATE_KEY = 'tabStateById';
const DOWNLOAD_RECORDS_KEY = 'handoffDownloadRecords';
const SETTINGS_KEY = 'operatorAidSettings';
const downloadIdentityById = new Map();

async function getSessionObject(key) {
  const result = await chrome.storage.session.get(key);
  return result[key] && typeof result[key] === 'object' ? result[key] : {};
}

async function getLocalObject(key) {
  const result = await chrome.storage.local.get(key);
  return result[key] && typeof result[key] === 'object' ? result[key] : {};
}

async function getTabState(tabId) {
  const states = await getSessionObject(TAB_STATE_KEY);
  return states[String(tabId)] || emptyTabState();
}

async function setTabState(tabId, state) {
  const states = await getSessionObject(TAB_STATE_KEY);
  states[String(tabId)] = state;
  await chrome.storage.session.set({ [TAB_STATE_KEY]: states });
  return state;
}

async function updateBenchmark(tabId, action) {
  const current = await getTabState(tabId);
  return setTabState(tabId, reduceBenchmark(current, action, Date.now()));
}

async function updateObservation(tabId, type, source) {
  const current = await getTabState(tabId);
  return setTabState(tabId, applyObservation(current, type, source, Date.now()));
}

async function setHandoffMessage(tabId, lastMessage) {
  const current = await getTabState(tabId);
  return setTabState(tabId, {
    ...current,
    handoff: { lastMessage }
  });
}

async function activeTabId() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) throw new Error('No active tab is available.');
  return tab.id;
}

async function armActiveTab() {
  const tabId = await activeTabId();
  await chrome.scripting.executeScript({
    target: { tabId },
    files: ['src/content/bridge.js']
  });
  return tabId;
}

async function currentSettings() {
  const values = await getLocalObject(SETTINGS_KEY);
  return {
    autoDownloadQualified: values.autoDownloadQualified === true
  };
}

async function updateSettings(patch) {
  const next = { ...(await currentSettings()), ...patch };
  await chrome.storage.local.set({ [SETTINGS_KEY]: next });
  return next;
}

async function performDownload({ tabId, identity, url, trigger }) {
  const exactIdentity = normalizePackageIdentity(identity);
  if (!exactIdentity) return { ok: false, reason: 'missing-identity' };
  if (!isDownloadUrlAllowed(url)) return { ok: false, reason: 'unsupported-url' };

  const records = await getLocalObject(DOWNLOAD_RECORDS_KEY);
  const decision = decideDownload(records, exactIdentity, Date.now());
  if (!decision.allowed) {
    await setHandoffMessage(tabId, `No download: ${decision.reason}.`);
    return { ok: false, ...decision };
  }

  const pending = pendingDownloadRecord(records[exactIdentity], Date.now());
  records[exactIdentity] = { ...pending, trigger, tabId };
  await chrome.storage.local.set({ [DOWNLOAD_RECORDS_KEY]: records });

  try {
    const downloadId = await chrome.downloads.download({ url, saveAs: false });
    records[exactIdentity] = { ...records[exactIdentity], downloadId };
    downloadIdentityById.set(downloadId, exactIdentity);
    await chrome.storage.local.set({ [DOWNLOAD_RECORDS_KEY]: records });
    await setHandoffMessage(tabId, `Download started once for identity “${exactIdentity}”.`);
    return { ok: true, downloadId, identity: exactIdentity };
  } catch (error) {
    records[exactIdentity] = interruptedDownloadRecord(records[exactIdentity], Date.now());
    await chrome.storage.local.set({ [DOWNLOAD_RECORDS_KEY]: records });
    await setHandoffMessage(tabId, `Download did not start; retry is backoff-limited. ${error.message}`);
    return { ok: false, reason: 'download-error', message: error.message };
  }
}

async function handlePageObservation(tabId, observation) {
  const type = observation?.type;
  if (type === 'play' || type === 'finish') {
    return { state: await updateBenchmark(tabId, type) };
  }
  if (type === 'slow-run' || type === 'safety-check' || type === 'delayed-run' || type === 'clear') {
    return { state: await updateObservation(tabId, type, 'page-event') };
  }
  if (type === 'handoff-result') {
    if (observation.qualified !== true) {
      await setHandoffMessage(tabId, 'Page result observed, but it did not report a qualified result; no download started.');
      return { ok: false, reason: 'page-result-not-qualified' };
    }
    const settings = await currentSettings();
    if (!settings.autoDownloadQualified) {
      await setHandoffMessage(tabId, 'Page-reported qualified result observed; automatic download is disabled.');
      return { ok: false, reason: 'automatic-download-disabled' };
    }
    if (!isQualifiedPageDownloadSignal(settings, observation)) {
      await setHandoffMessage(tabId, 'Page-reported result was incomplete or had an unsupported URL; no download started.');
      return { ok: false, reason: 'invalid-bounded-page-signal' };
    }
    return performDownload({
      tabId,
      identity: observation.identity,
      url: observation.url,
      trigger: 'bounded-page-signal'
    });
  }
  return { ok: false, reason: 'unsupported-observation' };
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    if (message?.kind === 'arm-active-tab') {
      return { ok: true, tabId: await armActiveTab() };
    }

    if (message?.kind === 'get-state') {
      const tabId = Number(message.tabId || await activeTabId());
      return {
        ok: true,
        tabId,
        state: await getTabState(tabId),
        settings: await currentSettings()
      };
    }

    if (message?.kind === 'benchmark-action') {
      const tabId = Number(message.tabId || await activeTabId());
      return { ok: true, state: await updateBenchmark(tabId, message.action) };
    }

    if (message?.kind === 'observation-action') {
      const tabId = Number(message.tabId || await activeTabId());
      return { ok: true, state: await updateObservation(tabId, message.observationType, 'operator') };
    }

    if (message?.kind === 'set-settings') {
      return { ok: true, settings: await updateSettings({ autoDownloadQualified: message.autoDownloadQualified === true }) };
    }

    if (message?.kind === 'download-once') {
      const tabId = Number(message.tabId || await activeTabId());
      return performDownload({
        tabId,
        identity: message.identity,
        url: message.url,
        trigger: 'explicit-operator-intent'
      });
    }

    if (message?.kind === 'page-observation' && sender.tab?.id) {
      return handlePageObservation(sender.tab.id, message.observation || {});
    }

    return { ok: false, reason: 'unsupported-message' };
  })().then(sendResponse).catch((error) => sendResponse({ ok: false, reason: 'exception', message: error.message }));
  return true;
});

chrome.downloads.onChanged.addListener(async (delta) => {
  if (!delta.state?.current || !Number.isInteger(delta.id)) return;
  const records = await getLocalObject(DOWNLOAD_RECORDS_KEY);
  let identity = downloadIdentityById.get(delta.id);

  if (!identity) {
    identity = Object.keys(records).find((key) => records[key]?.downloadId === delta.id);
  }
  if (!identity || !records[identity]) return;

  const tabId = records[identity].tabId;
  if (delta.state.current === 'complete') {
    records[identity] = completeDownloadRecord(records[identity], Date.now());
    if (Number.isInteger(tabId)) await setHandoffMessage(tabId, `Download completed for identity “${identity}”.`);
  } else if (delta.state.current === 'interrupted') {
    records[identity] = interruptedDownloadRecord(records[identity], Date.now());
    if (Number.isInteger(tabId)) {
      const retryAt = new Date(records[identity].nextAllowedAt).toLocaleTimeString();
      await setHandoffMessage(tabId, `Download interrupted; retry for “${identity}” is backoff-limited until ${retryAt}.`);
    }
  } else {
    return;
  }

  downloadIdentityById.delete(delta.id);
  await chrome.storage.local.set({ [DOWNLOAD_RECORDS_KEY]: records });
});
