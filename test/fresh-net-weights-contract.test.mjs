import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

test('fresh-net-lots documents missing server-side allowed weights',async()=>{
  const contract=await readFile(new URL('../openapi/storemesh.yaml',import.meta.url),'utf8');
  const route=contract.slice(contract.indexOf('  /api/fresh-net-lots:'),contract.indexOf('\n  /api/fresh-shipping-boxes:'));
  assert.match(route,/FRESH_EXPORT_NET_WEIGHTS_NOT_CONFIGURED/);
  assert.doesNotMatch(route,/allowedWeightsKg/);
});
