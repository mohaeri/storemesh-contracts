import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('label reprint contract fixes reasons approval rules and identity preservation',async()=>{
  const yaml=await readFile(new URL('../openapi/storemesh.yaml',import.meta.url),'utf8'),section=yaml.slice(yaml.indexOf('/api/labels/reprint'),yaml.indexOf('/api/print-jobs/{jobId}/printer'));
  for(const token of['PRINTER_ERROR','PAPER_FINISHED','RIBBON_FINISHED','DAMAGED_LABEL','LOST_LABEL','POOR_PRINT_QUALITY','CUSTOMER_REQUEST','OTHER','reprintApprovalByType','override:approve','ORIGINAL_LABEL_MISSING'])assert.match(section,new RegExp(token));
  assert.match(section,/existing identity/i);
});

test('print contract distinguishes automatic and overridden printer routing',async()=>{
  const yaml=await readFile(new URL('../openapi/storemesh.yaml',import.meta.url),'utf8');
  for(const token of['defaultPrinterId','selectedPrinterId','printerOverride','/api/print-jobs/{jobId}/printer'])assert.match(yaml,new RegExp(token.replace(/[{}]/g,'\\$&')));
});
