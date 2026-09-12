import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('sorting loss classification and aggregate report are published',async()=>{const source=await readFile(new URL('../openapi/storemesh.yaml',import.meta.url),'utf8');for(const token of['SORT_LOSS_REASON_REQUIRED','SORT_LOSS_REASON_INVALID','WASTE','DAMAGE','MOISTURE_LOSS','RESIDUAL_MATERIAL','MEASUREMENT_VARIANCE','/api/reports/sorting-loss','totalLossKg','eventCount'])assert.ok(source.includes(token),`missing ${token}`)});
