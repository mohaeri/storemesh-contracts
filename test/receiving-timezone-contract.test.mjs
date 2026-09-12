import test from'node:test';
import assert from'node:assert/strict';
import{readFileSync}from'node:fs';
const spec=readFileSync(new URL('../openapi/storemesh.yaml',import.meta.url),'utf8');
test('receiving hours require a DST-aware site timezone',()=>{for(const token of['IANA timezone','operatingHoursStart','operatingHoursEnd','RECEIVING_HOURS_TIMEZONE_REQUIRED'])assert.ok(spec.includes(token),token)});
