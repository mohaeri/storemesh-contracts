import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('trace entry points and aggregation response shapes are published',async()=>{const yaml=await readFile(new URL('../openapi/storemesh.yaml',import.meta.url),'utf8');for(const token of['/api/trace/search','/api/trace/supplier/{supplierCode}','/api/trace/customer/{customerId}','/api/trace/{batchId}/recall','CODE_LOOKUP','SUPPLIER','CUSTOMER','RECALL','matchedObject','batchIds','supplierContributions','weightKg','stillInWarehouse','shippedToCustomers'])assert.match(yaml,new RegExp(token.replace(/[{}]/g,'\\$&')))});

test('recall contract explicitly remains read-only and separates warehouse from customer exposure',async()=>{const yaml=await readFile(new URL('../openapi/storemesh.yaml',import.meta.url),'utf8'),section=yaml.slice(yaml.indexOf('/api/trace/{batchId}/recall'),yaml.indexOf('/api/trace/{batchId}:'));assert.match(section,/Read-only recall analysis/);assert.match(section,/packages cartons shippingBoxes shipments customers/);assert.match(section,/stillInWarehouse and shippedToCustomers/)});
