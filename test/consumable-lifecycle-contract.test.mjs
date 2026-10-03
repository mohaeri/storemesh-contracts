import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const spec=fs.readFileSync(new URL('../openapi/storemesh.yaml',import.meta.url),'utf8');
test('consumable lifecycle routes and force protection are documented',()=>{for(const value of['/api/consumables/{id}:','/api/consumables/{id}/activate:','/api/consumables/{id}/deactivate:','CONSUMABLE_HAS_OPEN_EXCEPTION'])assert.ok(spec.includes(value))});
