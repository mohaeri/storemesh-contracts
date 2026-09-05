import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('configuration contract exposes schemas, approval comparison and system timeouts',async()=>{const source=await readFile(new URL('../openapi/storemesh.yaml',import.meta.url),'utf8'),route=source.slice(source.indexOf('/api/configurations:'),source.indexOf('/api/configurations/{configurationId}'));for(const token of['proposedValues','currentActiveValues','SYSTEM_TIMEOUTS','CONFIGURATION_SCHEMA_INVALID'])assert.ok(route.includes(token),`missing ${token}`)});
