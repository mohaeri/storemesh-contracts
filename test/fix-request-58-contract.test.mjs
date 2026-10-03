import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

test('internal shipment cancellation contract requires reason and actor evidence',async()=>{
  const yaml=await readFile(new URL('../openapi/storemesh.yaml',import.meta.url),'utf8'),line=yaml.match(/^  \/api\/internal-shipments\/\{shipmentId\}\/\{action\}:.*$/m)?.[0]??'';
  for(const token of['sessionId','non-empty reason','INTERNAL_SHIPMENT_CANCEL_REASON_REQUIRED','cancellationReason','cancelledBy','cancelledSessionId','cancelledDeviceId'])assert.match(line,new RegExp(token));
});
