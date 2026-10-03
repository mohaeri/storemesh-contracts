import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('internal transfer delivery requires a signed destination receipt and documents timeout reconciliation',async()=>{
  const yaml=await readFile(new URL('../openapi/storemesh.yaml',import.meta.url),'utf8');
  const transition=yaml.match(/^  \/api\/internal-shipments\/\{shipmentId\}\/\{action\}:.*$/m)?.[0]??'';
  const receive=yaml.match(/^  \/api\/internal-transfers\/receive:.*$/m)?.[0]??'';
  for(const token of ['DELIVER','deliveryAcknowledgment','sourceSite','destinationSite','shipmentCode','manifestNonce','packageCodes','TRANSFER_RECEIPT_REQUIRED','TRANSFER_RECEIPT_SIGNATURE_INVALID','TRANSFER_RECEIPT_MISMATCH'])assert.match(transition,new RegExp(token));
  for(const token of ['signed deliveryAcknowledgment','internalTransferReceiptTimeoutMs','INTERNAL_TRANSFER_RECEIPT_OVERDUE','DISPATCHED','operator-visible'])assert.match(receive,new RegExp(token));
});
