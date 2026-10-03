import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const spec=fs.readFileSync(new URL('../openapi/storemesh.yaml',import.meta.url),'utf8');

test('consumable delete and reasoned stock write-off are documented',()=>{
  for(const value of['/api/consumables/{id}/zero:','WRITE_OFF transaction','CONSUMABLE_WRITE_OFF_REASON_REQUIRED','CONSUMABLE_ALREADY_ZERO','CONSUMABLE_DELETE_STOCK_REMAINING','delete: {summary: Logically delete'])assert.ok(spec.includes(value),value);
});
