import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('received internal transfer read shape publishes durable batchIds',async()=>{
  const contract=await readFile(new URL('../openapi/storemesh.yaml',import.meta.url),'utf8'),route=contract.match(/^  \/api\/internal-transfers:.*$/m)?.[0]??'';assert.match(route,/durable batchIds/);assert.match(route,/batchIds array/)
});
