import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const spec=await readFile(new URL('../openapi/storemesh.yaml',import.meta.url),'utf8');

test('inventory contract exposes complete contributing harvest-period provenance',()=>{assert.match(spec,/harvestPeriods as the complete deduplicated array of contributing periods/)});
test('cycle contract distinguishes mandatory FREEZE scans from scan-optional FREEZE_DRY and DRY input',()=>{assert.match(spec,/Create FREEZE from scanned physical trays/);assert.match(spec,/FREEZE_DRY and DRY from batchIds plus total inputWeightKg without mandatory per-carrier scans/)});
test('cycle contract fails closed without active station-machine configuration',()=>{const route=spec.match(/^  \/api\/cycles:.*$/m)?.[0]??'';assert.match(route,/ACTIVE STATION_MACHINES configuration is mandatory/);assert.match(route,/STATION_MACHINES_NOT_CONFIGURED/)});
