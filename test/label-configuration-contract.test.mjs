import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('contract publishes fail-closed per-site LABEL fields and reprint rules',async()=>{const source=await readFile(new URL('../openapi/storemesh.yaml',import.meta.url),'utf8'),configuration=source.match(/^  \/api\/configurations:.*$/m)?.[0]??'',reprint=source.match(/^  \/api\/labels\/reprint:.*$/m)?.[0]??'';for(const token of['LABEL','fieldsByType','QR_TRACEABILITY','CONTAINER_TYPE','allowedReprintReasons','reprintApprovalByType','reprintThreshold','LABEL_CONFIGURATION_NOT_CONFIGURED'])assert.match(`${configuration} ${reprint}`,new RegExp(token))});
