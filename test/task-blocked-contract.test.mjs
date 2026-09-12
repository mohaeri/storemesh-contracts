import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const spec=fs.readFileSync(new URL('../openapi/storemesh.yaml',import.meta.url),'utf8');
test('task responses document BLOCKED state and exception linkage',()=>{assert.match(spec,/BLOCKED/);assert.match(spec,/blockedByExceptionId/);assert.match(spec,/blockingException type\/severity/)});
