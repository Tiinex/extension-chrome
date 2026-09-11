import test from 'node:test';
import assert from 'node:assert/strict';
import {
  applyObservation,
  completeDownloadRecord,
  decideDownload,
  emptyTabState,
  interruptedDownloadRecord,
  isDownloadUrlAllowed,
  isQualifiedPageDownloadSignal,
  pendingDownloadRecord,
  reduceBenchmark
} from '../src/shared/protocol.js';

test('benchmark records browser-observed play to finish elapsed time', () => {
  const started = reduceBenchmark(emptyTabState(), 'play', 1_000);
  const finished = reduceBenchmark(started, 'finish', 4_250);
  assert.equal(finished.benchmark.status, 'finished');
  assert.equal(finished.benchmark.startedAt, 1_000);
  assert.equal(finished.benchmark.finishedAt, 4_250);
  assert.equal(finished.benchmark.durationMs, 3_250);
});

test('finish without an observed play does not invent a benchmark', () => {
  const state = emptyTabState();
  assert.deepEqual(reduceBenchmark(state, 'finish', 4_250), state);
});

test('slow and safety states are stored only as explicit observations', () => {
  const slow = applyObservation(emptyTabState(), 'slow-run', 'page-event', 2_000);
  assert.deepEqual(slow.observation, { type: 'slow-run', source: 'page-event', observedAt: 2_000 });

  const safety = applyObservation(slow, 'safety-check', 'operator', 3_000);
  assert.deepEqual(safety.observation, { type: 'safety-check', source: 'operator', observedAt: 3_000 });

  assert.deepEqual(applyObservation(safety, 'hidden-model-state', 'page-event', 4_000), safety);
});

test('download dedupe uses exact case-sensitive package identity', () => {
  const records = {
    'Package-A': completeDownloadRecord(pendingDownloadRecord(null, 1_000), 2_000)
  };
  assert.equal(decideDownload(records, 'Package-A', 3_000).reason, 'already-downloaded');
  assert.equal(decideDownload(records, 'package-a', 3_000).allowed, true);
});

test('pending downloads block duplicates and interrupted downloads back off before retry', () => {
  const pending = pendingDownloadRecord(null, 10_000);
  let records = { x: pending };
  assert.equal(decideDownload(records, 'x', 10_001).reason, 'download-pending');

  const interrupted = interruptedDownloadRecord(pending, 11_000);
  records = { x: interrupted };
  assert.equal(decideDownload(records, 'x', interrupted.nextAllowedAt - 1).reason, 'cooldown');
  assert.equal(decideDownload(records, 'x', interrupted.nextAllowedAt).allowed, true);
});

test('download URLs are restricted to ordinary http(s)', () => {
  assert.equal(isDownloadUrlAllowed('https://example.com/a.zip'), true);
  assert.equal(isDownloadUrlAllowed('http://localhost/a.zip'), true);
  assert.equal(isDownloadUrlAllowed('javascript:alert(1)'), false);
  assert.equal(isDownloadUrlAllowed('file:///tmp/a.zip'), false);
});


test('automatic Handoff download requires opt-in plus a complete page-reported qualified signal', () => {
  const observation = { type: 'handoff-result', qualified: true, identity: 'result-1', url: 'https://example.com/result.zip' };
  assert.equal(isQualifiedPageDownloadSignal({ autoDownloadQualified: false }, observation), false);
  assert.equal(isQualifiedPageDownloadSignal({ autoDownloadQualified: true }, { ...observation, qualified: false }), false);
  assert.equal(isQualifiedPageDownloadSignal({ autoDownloadQualified: true }, { ...observation, identity: '' }), false);
  assert.equal(isQualifiedPageDownloadSignal({ autoDownloadQualified: true }, { ...observation, url: 'javascript:alert(1)' }), false);
  assert.equal(isQualifiedPageDownloadSignal({ autoDownloadQualified: true }, observation), true);
});
