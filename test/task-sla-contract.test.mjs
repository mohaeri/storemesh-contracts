import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const spec=fs.readFileSync(new URL('../openapi/storemesh.yaml',import.meta.url),'utf8');
test('task contract documents readable code and SLA fields',()=>{for(const field of['code','dueAt','expectedDurationMinutes','overdue'])assert.match(spec,new RegExp(field))});
test('manual task contract requires an active zone and bounded integer priority',()=>{const route=spec.slice(spec.indexOf('  /api/tasks:'),spec.indexOf('  /api/tasks/recommended:'));for(const token of['active master-data zone','priority integer from 1 through 100','MASTER_DATA_REFERENCE_INVALID','TASK_PRIORITY_INVALID'])assert.match(route,new RegExp(token))});
