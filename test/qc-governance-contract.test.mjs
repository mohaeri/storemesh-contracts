import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

test('quarantine release contract requires explicit confirmed role attestation',async()=>{const text=await readFile(new URL('../openapi/storemesh.yaml',import.meta.url),'utf8'),section=text.slice(text.indexOf('/api/quality-checks/release:'),text.indexOf('/api/inventory-adjustments:'));assert.match(section,/required: \[batchId, reason, attestation\]/);assert.match(section,/required: \[confirmed, role\]/);assert.match(section,/confirmed: \{type: boolean, enum: \[true\]\}/)});

test('exception contract exposes operator note and blocking batch severity semantics',async()=>{const text=await readFile(new URL('../openapi/storemesh.yaml',import.meta.url),'utf8'),line=text.match(/^  \/api\/exceptions:.*$/m)?.[0]??'';assert.match(line,/note: \{type: string, nullable: true\}/);assert.match(line,/HIGH or CRITICAL Batch exceptions block operations/)});

test('package contract documents per-site scale evidence and scan-first cartons',async()=>{const text=await readFile(new URL('../openapi/storemesh.yaml',import.meta.url),'utf8'),line=text.match(/^  \/api\/packages:.*$/m)?.[0]??'';assert.match(line,/site-required scale measurement/);assert.match(line,/CARTON must be an empty DRAFT/);assert.match(line,/childPackageIds preallocation is forbidden/);assert.match(line,/physical UNIT scans build its contents/)});

test('fresh export contract documents box termination and multi-source lots',async()=>{const text=await readFile(new URL('../openapi/storemesh.yaml',import.meta.url),'utf8');assert.match(text,/fresh-shipping-boxes\/\{id\}\/cancel/);assert.match(text,/fresh-shipping-boxes\/\{id\}\/damage/);assert.match(text,/sourceContributions/);assert.match(text,/sources \[\{batchId,count\}\]/)});
test('forward trace contract stops explicitly at an inter-site boundary',async()=>{const text=await readFile(new URL('../openapi/storemesh.yaml',import.meta.url),'utf8'),line=text.match(/^  \/api\/trace\/\{batchId\}\/forward:.*$/m)?.[0]??'';assert.match(line,/crossesTransferBoundary true/);assert.match(line,/destinationSite/);assert.match(line,/BATCH_FORWARD/)});
