import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const contract = await readFile(new URL('../openapi/storemesh.yaml', import.meta.url), 'utf8');

test('fresh shipping box draft confirm and cold-holding routes are contracted', () => {
  for (const route of [
    '/api/fresh-shipping-boxes/drafts',
    '/api/fresh-shipping-boxes/{id}/draft',
    '/api/fresh-shipping-boxes/{id}/confirm',
    '/api/fresh-shipping-boxes/{id}/cold-holding'
  ]) assert.match(contract, new RegExp(route.replace(/[{}]/g, '\\$&')));
});

test('fresh shipping box read lifecycle measurement configuration and label enrichment are documented', () => {
  for (const token of [
    'DRAFT LABEL_PENDING LABEL_PRINTED READY_TO_SHIP',
    'measuredWeightKg',
    'weightMeasurementId',
    'requireBoxScaleEvidence',
    'maxNetsPerBox',
    'maxWeightKgPerBox',
    'shipmentCode and customerCode'
  ]) assert.ok(contract.includes(token), `missing ${token}`);
});
