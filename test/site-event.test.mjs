import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

test('published site-event contract is the v2 envelope produced by sites and accepted by cloud',async()=>{
  const schema=JSON.parse(await readFile(new URL('../events/site-event.schema.json',import.meta.url),'utf8'));
  assert.equal(schema.properties.schemaVersion.const,2);
  assert.deepEqual(schema.required.sort(),['entityId','entityType','id','occurredAt','payload','schemaVersion','site','type'].sort());
  assert.deepEqual(schema.properties.entityType.type,['string','null']);
  for(const field of['id','entityId'])assert.equal(schema.properties[field].format,'uuid');
  assert.equal(schema.properties.occurredAt.format,'date-time');
});
