import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const spec=fs.readFileSync(new URL('../openapi/storemesh.yaml',import.meta.url),'utf8');
test('task contract documents readable code and SLA fields',()=>{for(const field of['code','dueAt','expectedDurationMinutes','overdue'])assert.match(spec,new RegExp(field))});
