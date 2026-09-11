const $ = (selector) => document.querySelector(selector);

function formatTime(value) {
  return Number.isFinite(value) ? new Date(value).toLocaleTimeString() : '—';
}

function formatDuration(value) {
  if (!Number.isFinite(value)) return '—';
  if (value < 1000) return `${value} ms`;
  return `${(value / 1000).toFixed(2)} s`;
}

async function activeTabId() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) throw new Error('No active tab.');
  return tab.id;
}

async function send(message) {
  return chrome.runtime.sendMessage(message);
}

function render(state, settings) {
  const benchmark = state?.benchmark || {};
  $('#run-status').textContent = benchmark.status === 'running' ? 'Running' : benchmark.status === 'finished' ? 'Finished' : 'Idle';
  $('#started').textContent = formatTime(benchmark.startedAt);
  $('#finished').textContent = formatTime(benchmark.finishedAt);
  $('#elapsed').textContent = formatDuration(benchmark.durationMs);

  const observation = state?.observation;
  $('#observation-status').textContent = observation?.type || 'None';
  $('#observation-detail').textContent = observation
    ? `Observed ${observation.type} via ${observation.source} at ${formatTime(observation.observedAt)}. No hidden state is inferred.`
    : 'No observable condition recorded.';

  $('#handoff-status').textContent = state?.handoff?.lastMessage || 'No Handoff download activity yet.';
  $('#auto-download').checked = settings?.autoDownloadQualified === true;
}

async function refresh() {
  const tabId = await activeTabId();
  const response = await send({ kind: 'get-state', tabId });
  if (!response?.ok) throw new Error(response?.message || response?.reason || 'Unable to read state.');
  render(response.state, response.settings);
}

async function withStatus(work) {
  try {
    await work();
    await refresh();
  } catch (error) {
    $('#bridge-status').textContent = error.message;
  }
}

$('#arm').addEventListener('click', () => withStatus(async () => {
  const response = await send({ kind: 'arm-active-tab' });
  if (!response?.ok) throw new Error(response?.message || 'Unable to arm page.');
  $('#bridge-status').textContent = 'Page bridge armed. It listens only for Tiinex host-observation events.';
}));

for (const action of ['play', 'finish', 'reset']) {
  $(`#${action}`).addEventListener('click', () => withStatus(async () => {
    const tabId = await activeTabId();
    await send({ kind: 'benchmark-action', tabId, action });
  }));
}

for (const button of document.querySelectorAll('[data-observation]')) {
  button.addEventListener('click', () => withStatus(async () => {
    const tabId = await activeTabId();
    await send({ kind: 'observation-action', tabId, observationType: button.dataset.observation });
  }));
}

$('#auto-download').addEventListener('change', () => withStatus(async () => {
  await send({ kind: 'set-settings', autoDownloadQualified: $('#auto-download').checked });
}));

$('#download').addEventListener('click', () => withStatus(async () => {
  const tabId = await activeTabId();
  const response = await send({
    kind: 'download-once',
    tabId,
    identity: $('#package-identity').value,
    url: $('#package-url').value
  });
  if (!response?.ok && response?.reason === 'missing-identity') throw new Error('Enter the exact package identity first.');
  if (!response?.ok && response?.reason === 'unsupported-url') throw new Error('Use an http or https package URL.');
}));

refresh().catch((error) => { $('#bridge-status').textContent = error.message; });
