import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('multi-parent MERGE publishes physical confirmation and supplier provenance',async()=>{
  const yaml=await readFile(new URL('../openapi/storemesh.yaml',import.meta.url),'utf8');
  const section=yaml.slice(yaml.indexOf('/api/transforms:'),yaml.indexOf('/api/cycles:'));
  for(const token of['multi-parent MERGE','containerId','scanned empty available BASKET or CRATE','SORTING','suppliers','supplierIds','supplierContributions','supplier and supplierId are null only for mixed-supplier output','MERGE_PHYSICAL_CONFIRMATION_REQUIRED'])assert.match(section,new RegExp(token));
});
