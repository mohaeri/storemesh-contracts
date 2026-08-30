import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

test('QC contracts require session evidence and constrained checklist references',async()=>{
  const yaml=await readFile(new URL('../openapi/storemesh.yaml',import.meta.url),'utf8');
  const quality=yaml.slice(yaml.indexOf('  /api/quality-checks:'),yaml.indexOf('  /api/containers:'));
  for(const token of['sessionId','deviceId','SESSION_NOT_FOUND','QC_CHECKLIST_STAGE_MISMATCH'])assert.match(quality,new RegExp(token));
  const checklist=yaml.slice(yaml.indexOf('  /api/qc-checklists:'));
  for(const token of['QC_CHECKLIST_STAGE_INVALID','MASTER_DATA_REFERENCE_INVALID','FREEZE_DRYING','PACKAGING'])assert.match(checklist,new RegExp(token));
});
