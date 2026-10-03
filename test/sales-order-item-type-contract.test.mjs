import test from'node:test';
import assert from'node:assert/strict';
import{readFile}from'node:fs/promises';

test('sales-order contract rejects repeated package types',async()=>{const yaml=await readFile(new URL('../openapi/storemesh.yaml',import.meta.url),'utf8'),route=yaml.match(/^  \/api\/sales-orders:.*$/m)?.[0]??'';assert.match(route,/each packageType appearing at most once/);assert.match(route,/SALES_ORDER_ITEM_TYPE_DUPLICATE/)});
