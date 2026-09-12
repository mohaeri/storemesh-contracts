import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('sorting contract publishes multi-input genealogy operator destinations and automatic washing routes',async()=>{const source=await readFile(new URL('../openapi/storemesh.yaml',import.meta.url),'utf8'),sorting=source.slice(source.indexOf('/api/sorting:'),source.indexOf('/api/configurations:'));for(const token of['one or more scanned input baskets','parentContributions','FRESH_EXPORT','DRYING','FREEZING','FREEZE_DRYING','QC','COLD_ROOM_CLEAN','COLD_ROOM_DIRTY','WASTE','WASHING','no initial Manager approval'])assert.ok(sorting.includes(token),token);assert.match(source,/Sorting Operator destination assignment/)});
