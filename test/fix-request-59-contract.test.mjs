import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

test('quarantine release contract documents conditional destination override reason and validation',async()=>{
  const yaml=await readFile(new URL('../openapi/storemesh.yaml',import.meta.url),'utf8'),section=yaml.slice(yaml.indexOf('/api/quality-checks/release:'),yaml.indexOf('/api/containers:'));
  for(const token of['conditionally requires a non-empty manager reason','RELEASE_DESTINATION_OVERRIDE_REASON_REQUIRED','RELEASE_DESTINATION_INVALID','pre-quarantine zone'])assert.match(section,new RegExp(token));
});
