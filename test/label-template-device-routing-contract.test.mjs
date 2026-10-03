import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('contract publishes label dimensions and terminal-specific printer routing',async()=>{const source=await readFile(new URL('../openapi/storemesh.yaml',import.meta.url),'utf8');for(const token of['millimetre dimensions','DPI','orientation','positioned elements','terminal device or station','print point','strictRouting','labelTemplateSnapshot','workstationDeviceId','/api/containers/{containerId}/label','LABEL_ROUTE_NOT_CONFIGURED'])assert.match(source,new RegExp(token.replace(/[{}]/g,'\\$&')))});
