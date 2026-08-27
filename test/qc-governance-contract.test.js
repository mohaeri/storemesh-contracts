import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

test('quarantine release contract requires explicit confirmed role attestation',async()=>{const text=await readFile(new URL('../openapi/storemesh.yaml',import.meta.url),'utf8'),section=text.slice(text.indexOf('/api/quality-checks/release:'),text.indexOf('/api/inventory-adjustments:'));assert.match(section,/required: \[batchId, reason, attestation\]/);assert.match(section,/required: \[confirmed, role\]/);assert.match(section,/confirmed: \{type: boolean, enum: \[true\]\}/)});
