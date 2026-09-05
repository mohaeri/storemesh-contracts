import test from'node:test';
import assert from'node:assert/strict';
import{readFile}from'node:fs/promises';
import{assertRouteParity}from'../scripts/route-parity.mjs';

const [server,contract]=await Promise.all([
  readFile(new URL('../../storemesh-cloud/src/server.js',import.meta.url),'utf8'),
  readFile(new URL('../openapi/storemesh-cloud.yaml',import.meta.url),'utf8')
]);

test('cloud contract has parity with the real aggregator route source',()=>{
  assert.equal(assertRouteParity(server,contract),7);
});

test('cloud authentication and response shapes are published',()=>{
  for(const token of['X-Cloud-Report-Key','X-Site-Code','X-Site-Key','X-Site-Key-Id','CONNECTED, STALE, PENDING','accepted:','duplicates:','rejected:','checkpoint:','occurredAtFrom','occurredAtTo','nextCursor','object-history','occurredAt then event id'])assert.match(contract,new RegExp(token));
});
