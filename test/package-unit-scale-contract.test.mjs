import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

test('UNIT packages require captured per-unit scale evidence',async()=>{
  const spec=await readFile(new URL('../openapi/storemesh.yaml',import.meta.url),'utf8');
  const route=spec.match(/^  \/api\/packages:.*$/m)?.[0]??'';
  for(const token of['mandatory per-UNIT measurementId','PACKAGE_UNIT','PACKAGE_MEASUREMENT_REQUIRED','client item weight never substitutes'])assert.match(route,new RegExp(token));
});
