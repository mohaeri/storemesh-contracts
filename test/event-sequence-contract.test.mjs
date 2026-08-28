import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const spec=fs.readFileSync(new URL('../openapi/storemesh.yaml',import.meta.url),'utf8');
test('site audit outbox and cloud event contract expose monotonic sequence',()=>{assert.match(spec,/Event:\n\s+type: object/);assert.match(spec,/sequence: \{type: integer, format: int64, minimum: 1/);assert.match(spec,/\/api\/audit:.*sequence/);assert.match(spec,/\/api\/outbox:.*sequence/)});
