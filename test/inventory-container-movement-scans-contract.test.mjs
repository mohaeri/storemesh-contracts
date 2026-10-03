import test from'node:test';
import assert from'node:assert/strict';
import{readFile}from'node:fs/promises';

test('container movement contract publishes physical scans and configurable destination enforcement',async()=>{const spec=await readFile(new URL('../openapi/storemesh.yaml',import.meta.url),'utf8'),move=spec.match(/^  \/api\/containers\/\{containerId\}\/\{action\}:.*$/m)?.[0]??'',config=spec.match(/^  \/api\/configurations:.*$/m)?.[0]??'';for(const token of['scannedContainerId','destinationZoneCode','WAREHOUSE_MOVEMENT','requireDestinationScan','CONTAINER_SCAN_REQUIRED','CONTAINER_SCAN_MISMATCH','MOVEMENT_DESTINATION_SCAN_REQUIRED'])assert.match(`${move} ${config}`,new RegExp(token))});
