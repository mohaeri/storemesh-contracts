import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

test('password change, admin reset, logout semantics and username snapshots are published',async()=>{
  const api=await readFile(new URL('../openapi/storemesh.yaml',import.meta.url),'utf8'),event=JSON.parse(await readFile(new URL('../events/site-event.schema.json',import.meta.url),'utf8'));
  assert.match(api,/\/api\/auth\/password\/change/);assert.match(api,/currentPassword/);assert.match(api,/PASSWORD_CHANGED/);
  assert.match(api,/\/api\/users\/\{userId\}\/password\/reset/);assert.match(api,/PASSWORD_RESET/);assert.match(api,/supported logout operation/);
  assert.deepEqual(event.properties.actorUsername.type,['string','null']);
});
