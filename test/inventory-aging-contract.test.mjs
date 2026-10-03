import test from'node:test';
import assert from'node:assert/strict';
import{readFileSync}from'node:fs';
const spec=readFileSync(new URL('../openapi/storemesh.yaml',import.meta.url),'utf8');
test('inventory aging, operator work linkage and storage thresholds are published',()=>{for(const token of['agingDays','agingWarning','agingTaskId','agingTaskPriority','STORAGE_AGING_WARNING','STORAGE_OPERATOR task','STORAGE supports agingWarningDaysByZone','WAREHOUSE_MOVEMENT STORAGE YIELD_THRESHOLDS'])assert.match(spec,new RegExp(token))});
