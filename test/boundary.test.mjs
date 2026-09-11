import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const root = new URL('../', import.meta.url);

async function walk(dirUrl) {
  const entries = await readdir(dirUrl, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const child = new URL(`${entry.name}${entry.isDirectory() ? '/' : ''}`, dirUrl);
    if (entry.isDirectory()) files.push(...await walk(child));
    else files.push(child);
  }
  return files;
}

test('manifest stays bounded: no host permissions and only explicit browser capabilities', async () => {
  const manifest = JSON.parse(await readFile(new URL('manifest.json', root), 'utf8'));
  assert.equal(manifest.manifest_version, 3);
  assert.equal('host_permissions' in manifest, false);
  assert.deepEqual([...manifest.permissions].sort(), ['activeTab', 'downloads', 'scripting', 'storage']);
});

test('host source contains no OpenAI-specific selectors or provider names', async () => {
  const files = await walk(new URL('src/', root));
  const joined = (await Promise.all(files.map((file) => readFile(file, 'utf8')))).join('\n').toLowerCase();
  for (const forbidden of ['chatgpt', 'openai.com', 'chat.openai', 'conversation-turn', 'model-slug']) {
    assert.equal(joined.includes(forbidden), false, `found provider-specific token: ${forbidden}`);
  }
});

test('content bridge is event driven and contains no polling timers or synthetic click loop', async () => {
  const bridge = await readFile(new URL('src/content/bridge.js', root), 'utf8');
  assert.equal(/setInterval\s*\(/.test(bridge), false);
  assert.equal(/setTimeout\s*\(/.test(bridge), false);
  assert.equal(/\.click\s*\(/.test(bridge), false);
  assert.equal(/fetch\s*\(/.test(bridge), false);
  assert.equal(/XMLHttpRequest/.test(bridge), false);
  assert.equal(/MutationObserver/.test(bridge), false);
  assert.equal(/querySelector/.test(bridge), false);
  assert.equal(bridge.includes('addEventListener'), true);
});
