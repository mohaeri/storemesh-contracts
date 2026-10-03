import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('audit contract publishes opt-in normalized archive history', async () => {
  const spec = await readFile(new URL('../openapi/storemesh.yaml', import.meta.url), 'utf8');
  const route = spec.match(/^  \/api\/audit:.*$/m)?.[0] ?? '';
  assert.match(route, /includeArchived/);
  assert.match(route, /default: false/);
  assert.match(route, /same Event envelope shape/);
});
