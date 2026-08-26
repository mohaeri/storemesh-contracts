import test from 'node:test';
import assert from 'node:assert/strict';
import { assertCriticalOperationContracts,assertRouteParity,extractServerRoutes } from '../scripts/route-parity.mjs';

test('extracts direct, prefix, and regex pathname routes with methods',()=>{
  const source=`
    if(req.method==='GET'&&u.pathname==='/health') {}
    if(req.method==='GET'&&u.pathname.startsWith('/api/trace/')) {}
    if(req.method==='POST'&&/^\\/api\\/widgets\\/[^/]+\\/(approve|reject)$/.test( u.pathname )) {}
  `;
  assert.deepEqual(extractServerRoutes(source).map(x=>`${x.method} ${x.path}`),[
    'GET /health','GET /api/trace/{}','POST /api/widgets/{}/{}'
  ]);
});

test('an undocumented regex-matched route fails parity',()=>{
  const server=`if(req.method==='POST'&&/^\\/api\\/secret\\/[^/]+\\/bypass$/.test(u.pathname)) {}`;
  const openapi=`paths:\n  /api/other: {post: {responses: {}}}`;
  assert.throws(()=>assertRouteParity(server,openapi),/POST \/api\/secret\/{}\/bypass/);
});

test('critical transform contract cannot regress to child-producing wash or slice',()=>{
  assert.throws(()=>assertCriticalOperationContracts('  /api/transforms: {post: {summary: Transform parent batches}}'),/preserve WASH\/SLICE/);
});

test('critical sorting contract cannot omit physical output containers',()=>{const transform='  /api/transforms: {post: {summary: Apply identity-preserving WASH or SLICE; observation weights never replace inventory}}';assert.throws(()=>assertCriticalOperationContracts(`${transform}\n  /api/sorting: {post: {summary: Split a batch}}`),/sorting contract/);assert.doesNotThrow(()=>assertCriticalOperationContracts(`${transform}\n  /api/sorting: {post: {summary: Require a distinct empty physical output container and SORT_OUTPUT_CONTAINER_SCAN_REQUIRED}}`))});

test('customer shipment contract cannot lose Fresh Shipping Box assignment and scan support',()=>{const required='  /api/transforms: {post: {summary: Apply identity-preserving WASH or SLICE; observation weights never replace inventory}}\n  /api/sorting: {post: {summary: Require a distinct empty physical output container and SORT_OUTPUT_CONTAINER_SCAN_REQUIRED}}',base=`${required}\n  /api/shipments: {post: {summary: Create from cartons}}\n  /api/shipments/{shipmentId}/scans: {post: {summary: Scan cartons}}`;assert.throws(()=>assertCriticalOperationContracts(base),/Fresh Shipping Boxes/);const supported=`${required}\n  /api/shipments: {post: {summary: Create from Fresh Shipping Boxes}}\n  /api/shipments/{shipmentId}/scans: {post: {summary: Physically scan a Fresh Shipping Box}}`;assert.doesNotThrow(()=>assertCriticalOperationContracts(supported))});

test('Fresh Export contract cannot regress to a batch dropdown without a physical basket scan',()=>{const required='  /api/transforms: {post: {summary: Apply identity-preserving WASH or SLICE; observation weights never replace inventory}}\n  /api/sorting: {post: {summary: Require a distinct empty physical output container and SORT_OUTPUT_CONTAINER_SCAN_REQUIRED}}',base=`${required}\n  /api/fresh-net-lots: {post: {summary: Pack selected batch}}`;assert.throws(()=>assertCriticalOperationContracts(base),/scanned physical source container/);assert.doesNotThrow(()=>assertCriticalOperationContracts(`${required}\n  /api/fresh-net-lots: {post: {summary: Require a physically scanned BASKET or CRATE and CONTAINER_SCAN_REQUIRED}}`))});

test('customer shipment contract requires current eligibility validation at every physical transition',()=>{const required='  /api/transforms: {post: {summary: Apply identity-preserving WASH or SLICE; observation weights never replace inventory}}\n  /api/sorting: {post: {summary: Require a distinct empty physical output container and SORT_OUTPUT_CONTAINER_SCAN_REQUIRED}}',base=`${required}\n  /api/shipments: {post: {summary: Create from Fresh Shipping Boxes}}\n  /api/shipments/{shipmentId}/scans: {post: {summary: Physically scan a Fresh Shipping Box}}\n  /api/shipments/{shipmentId}/{action}: {post: {summary: Advance}}`;assert.throws(()=>assertCriticalOperationContracts(base),/latest APPROVED QC/);const eligibility='current status assignment hierarchy quarantine latest APPROVED QC lock genuine print and blocking exceptions';assert.doesNotThrow(()=>assertCriticalOperationContracts(`${required}\n  /api/shipments: {post: {summary: Create from Fresh Shipping Boxes with genuine completed printing latest APPROVED QC and no blocking exception}}\n  /api/shipments/{shipmentId}/scans: {post: {summary: revalidating ${eligibility} for a Fresh Shipping Box}}\n  /api/shipments/{shipmentId}/{action}: {post: {summary: revalidating ${eligibility}}}`))});

test('Fresh Shipping Box contract requires aggregate allocation validation and completed printing',()=>{const required='  /api/transforms: {post: {summary: Apply identity-preserving WASH or SLICE; observation weights never replace inventory}}\n  /api/sorting: {post: {summary: Require a distinct empty physical output container and SORT_OUTPUT_CONTAINER_SCAN_REQUIRED}}',incomplete=`${required}\n  /api/fresh-shipping-boxes: {post: {summary: Create READY_TO_SHIP box immediately}}`;assert.throws(()=>assertCriticalOperationContracts(incomplete),/aggregate net-lot allocations/);assert.doesNotThrow(()=>assertCriticalOperationContracts(`${required}\n  /api/fresh-shipping-boxes: {post: {summary: Create LABEL_PENDING after aggregating repeated allocations by netLotId; completePrint changes it to READY_TO_SHIP}}`))});
