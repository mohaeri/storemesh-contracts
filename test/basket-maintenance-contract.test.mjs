import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

test('Option 3 basket maintenance threshold and supervisor warning are published',async()=>{
  const spec=await readFile(new URL('../openapi/storemesh.yaml',import.meta.url),'utf8');
  const configuration=spec.match(/^  \/api\/configurations:.*$/m)?.[0]??'';
  const exceptions=spec.match(/^  \/api\/exceptions:.*$/m)?.[0]??'';
  for(const token of['BASKET_MAINTENANCE','single positive-integer useThreshold'])assert.match(configuration,new RegExp(token));
  assert.match(exceptions,/supervisorOnly/);
});
