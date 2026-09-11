export const PAGE_EVENT_NAME = 'tiinex:host-observation';

export const OBSERVATION_TYPES = Object.freeze([
  'slow-run',
  'safety-check',
  'delayed-run'
]);

export const DOWNLOAD_COOLDOWN_MS = 15_000;
export const DOWNLOAD_MAX_BACKOFF_MS = 5 * 60_000;

export function emptyTabState() {
  return {
    benchmark: {
      status: 'idle',
      startedAt: null,
      finishedAt: null,
      durationMs: null
    },
    observation: null,
    handoff: {
      lastMessage: 'No Handoff download activity yet.'
    }
  };
}

export function reduceBenchmark(state, action, now = Date.now()) {
  const current = state || emptyTabState();
  const benchmark = current.benchmark || emptyTabState().benchmark;

  if (action === 'play') {
    return {
      ...current,
      benchmark: {
        status: 'running',
        startedAt: now,
        finishedAt: null,
        durationMs: null
      }
    };
  }

  if (action === 'finish') {
    if (benchmark.status !== 'running' || !Number.isFinite(benchmark.startedAt)) return current;
    return {
      ...current,
      benchmark: {
        status: 'finished',
        startedAt: benchmark.startedAt,
        finishedAt: now,
        durationMs: Math.max(0, now - benchmark.startedAt)
      }
    };
  }

  if (action === 'reset') {
    return {
      ...current,
      benchmark: emptyTabState().benchmark
    };
  }

  return current;
}

export function applyObservation(state, type, source, now = Date.now()) {
  const current = state || emptyTabState();
  if (type === 'clear') return { ...current, observation: null };
  if (!OBSERVATION_TYPES.includes(type)) return current;

  return {
    ...current,
    observation: {
      type,
      source: source === 'page-event' ? 'page-event' : 'operator',
      observedAt: now
    }
  };
}

export function normalizePackageIdentity(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export function isQualifiedPageDownloadSignal(settings, observation) {
  return settings?.autoDownloadQualified === true
    && observation?.type === 'handoff-result'
    && observation?.qualified === true
    && Boolean(normalizePackageIdentity(observation?.identity))
    && isDownloadUrlAllowed(observation?.url);
}

export function isDownloadUrlAllowed(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

export function computeBackoffMs(attemptCount) {
  const exponent = Math.max(0, Number(attemptCount || 1) - 1);
  return Math.min(DOWNLOAD_COOLDOWN_MS * (2 ** exponent), DOWNLOAD_MAX_BACKOFF_MS);
}

export function decideDownload(records, identity, now = Date.now()) {
  const exactIdentity = normalizePackageIdentity(identity);
  if (!exactIdentity) return { allowed: false, reason: 'missing-identity' };

  const record = records?.[exactIdentity];
  if (!record) return { allowed: true, reason: 'first-attempt', identity: exactIdentity };
  if (record.state === 'complete') return { allowed: false, reason: 'already-downloaded', record };
  if (record.state === 'pending') return { allowed: false, reason: 'download-pending', record };
  if (Number.isFinite(record.nextAllowedAt) && now < record.nextAllowedAt) {
    return { allowed: false, reason: 'cooldown', retryAt: record.nextAllowedAt, record };
  }

  return { allowed: true, reason: 'retry-allowed', identity: exactIdentity, record };
}

export function pendingDownloadRecord(previous, now = Date.now()) {
  const attemptCount = Number(previous?.attemptCount || 0) + 1;
  return {
    state: 'pending',
    attemptCount,
    attemptedAt: now,
    nextAllowedAt: now + computeBackoffMs(attemptCount),
    downloadId: null,
    completedAt: null,
    interruptedAt: null
  };
}

export function completeDownloadRecord(record, now = Date.now()) {
  return {
    ...record,
    state: 'complete',
    completedAt: now,
    nextAllowedAt: null
  };
}

export function interruptedDownloadRecord(record, now = Date.now()) {
  return {
    ...record,
    state: 'interrupted',
    interruptedAt: now,
    nextAllowedAt: Math.max(Number(record?.nextAllowedAt || 0), now + computeBackoffMs(record?.attemptCount || 1))
  };
}
