import test from 'node:test';
import assert from 'node:assert/strict';
import { assertCriticalOperationContracts,assertRouteParity,extractOpenApiRoutes,extractServerRoutes } from '../scripts/route-parity.mjs';

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

test('extracts both inline and standard multiline OpenAPI operations',()=>{
  const openapi=`paths:
  /api/inline: {get: {responses: {}}}
  /api/multiline:
    post:
      requestBody:
        required: true
      responses:
        '200': {description: ok}`;
  assert.deepEqual(extractOpenApiRoutes(openapi).map(x=>`${x.method} ${x.path}`),[
    'GET /api/inline','POST /api/multiline'
  ]);
});

test('critical transform contract cannot regress to child-producing wash or slice',()=>{
  assert.throws(()=>assertCriticalOperationContracts('  /api/transforms: {post: {summary: Transform parent batches}}'),/preserve WASH\/SLICE/);
});

test('critical sorting contract cannot omit physical output containers',()=>{const transform='  /api/transforms: {post: {summary: Apply identity-preserving WASH or SLICE; observation weights never replace inventory}}';assert.throws(()=>assertCriticalOperationContracts(`${transform}\n  /api/sorting: {post: {summary: Split a batch}}`),/sorting contract/);assert.doesNotThrow(()=>assertCriticalOperationContracts(`${transform}\n  /api/sorting: {post: {summary: Require a distinct empty physical output container and SORT_OUTPUT_CONTAINER_SCAN_REQUIRED}}`))});

test('customer shipment contract cannot lose Fresh Shipping Box assignment and scan support',()=>{const required='  /api/transforms: {post: {summary: Apply identity-preserving WASH or SLICE; observation weights never replace inventory}}\n  /api/sorting: {post: {summary: Require a distinct empty physical output container and SORT_OUTPUT_CONTAINER_SCAN_REQUIRED}}',base=`${required}\n  /api/shipments: {post: {summary: Create from cartons}}\n  /api/shipments/{shipmentId}/scans: {post: {summary: Scan cartons}}`;assert.throws(()=>assertCriticalOperationContracts(base),/Fresh Shipping Boxes/);const supported=`${required}\n  /api/shipments: {post: {summary: Create from Fresh Shipping Boxes}}\n  /api/shipments/{shipmentId}/scans: {post: {summary: Physically scan a Fresh Shipping Box}}`;assert.doesNotThrow(()=>assertCriticalOperationContracts(supported))});

test('Fresh Export contract cannot regress to a batch dropdown without a physical basket scan',()=>{const required='  /api/transforms: {post: {summary: Apply identity-preserving WASH or SLICE; observation weights never replace inventory}}\n  /api/sorting: {post: {summary: Require a distinct empty physical output container and SORT_OUTPUT_CONTAINER_SCAN_REQUIRED}}',base=`${required}\n  /api/fresh-net-lots: {post: {summary: Pack selected batch}}`;assert.throws(()=>assertCriticalOperationContracts(base),/scanned physical source container/);assert.doesNotThrow(()=>assertCriticalOperationContracts(`${required}\n  /api/fresh-net-lots: {post: {summary: Require a physically scanned BASKET or CRATE and CONTAINER_SCAN_REQUIRED}}`))});

test('customer shipment contract requires current eligibility validation at every physical transition',()=>{const required='  /api/transforms: {post: {summary: Apply identity-preserving WASH or SLICE; observation weights never replace inventory}}\n  /api/sorting: {post: {summary: Require a distinct empty physical output container and SORT_OUTPUT_CONTAINER_SCAN_REQUIRED}}',base=`${required}\n  /api/shipments: {post: {summary: Create from Fresh Shipping Boxes}}\n  /api/shipments/{shipmentId}/scans: {post: {summary: Physically scan a Fresh Shipping Box}}\n  /api/shipments/{shipmentId}/{action}: {post: {summary: Advance}}`;assert.throws(()=>assertCriticalOperationContracts(base),/latest APPROVED QC/);const eligibility='current status assignment hierarchy quarantine latest APPROVED QC lock genuine print and blocking exceptions';assert.doesNotThrow(()=>assertCriticalOperationContracts(`${required}\n  /api/shipments: {post: {summary: Create from Fresh Shipping Boxes with genuine completed printing latest APPROVED QC and no blocking exception}}\n  /api/shipments/{shipmentId}/scans: {post: {summary: revalidating ${eligibility} for a Fresh Shipping Box}}\n  /api/shipments/{shipmentId}/{action}: {post: {summary: revalidating ${eligibility}}}`))});

test('Fresh Shipping Box contract requires aggregate allocation validation and completed printing',()=>{const required='  /api/transforms: {post: {summary: Apply identity-preserving WASH or SLICE; observation weights never replace inventory}}\n  /api/sorting: {post: {summary: Require a distinct empty physical output container and SORT_OUTPUT_CONTAINER_SCAN_REQUIRED}}',incomplete=`${required}\n  /api/fresh-shipping-boxes: {post: {summary: Create READY_TO_SHIP box immediately}}`;assert.throws(()=>assertCriticalOperationContracts(incomplete),/aggregate net-lot allocations/);assert.doesNotThrow(()=>assertCriticalOperationContracts(`${required}\n  /api/fresh-shipping-boxes: {post: {summary: Create LABEL_PENDING after aggregating repeated allocations by netLotId; completePrint changes it to READY_TO_SHIP}}`))});

test('print action contract documents reason threshold and exception resolution',()=>{const required='  /api/transforms: {post: {summary: Apply identity-preserving WASH or SLICE; observation weights never replace inventory}}\n  /api/sorting: {post: {summary: Require a distinct empty physical output container and SORT_OUTPUT_CONTAINER_SCAN_REQUIRED}}',incomplete=`${required}\n  /api/print-jobs/{jobId}/{action}: {post: {summary: retry}}`;assert.throws(()=>assertCriticalOperationContracts(incomplete),/print retry contract/);assert.doesNotThrow(()=>assertCriticalOperationContracts(`${required}\n  /api/print-jobs/{jobId}/{action}: {post: {summary: retry requires a non-empty reason, uses active PRINTING configuration, and resolves matching label-failure exceptions}}`))});

test('consumable contract documents threshold evaluation and replenishment resolution',()=>{const required='  /api/transforms: {post: {summary: Apply identity-preserving WASH or SLICE; observation weights never replace inventory}}\n  /api/sorting: {post: {summary: Require a distinct empty physical output container and SORT_OUTPUT_CONTAINER_SCAN_REQUIRED}}',bad=`${required}\n  /api/consumables: {post: {summary: create}}\n  /api/consumables/{consumableId}/receive: {post: {summary: receive}}`;assert.throws(()=>assertCriticalOperationContracts(bad),/consumable contract/);const good=`${required}\n  /api/consumables: {post: {summary: immediately evaluate its reorder threshold}}\n  /api/consumables/{consumableId}/receive: {post: {summary: auto-resolve its reorder exception}}`;assert.doesNotThrow(()=>assertCriticalOperationContracts(good))});

test('movement contract rejects contained Batch moves and documents contextual cascade rows',()=>{const required='  /api/transforms: {post: {summary: Apply identity-preserving WASH or SLICE; observation weights never replace inventory}}\n  /api/sorting: {post: {summary: Require a distinct empty physical output container and SORT_OUTPUT_CONTAINER_SCAN_REQUIRED}}',bad=`${required}\n  /api/movements: {post: {summary: move any batch}}\n  /api/containers/{containerId}/{action}: {post: {summary: move}}`;assert.throws(()=>assertCriticalOperationContracts(bad),/movement contract/);const good=`${required}\n  /api/movements: {post: {summary: free-standing Batch BATCH_MOVE_REQUIRES_CONTAINER_MOVE quantity unit user object type movement type}}\n  /api/containers/{containerId}/{action}: {post: {summary: CONTAINER row and BATCH cascade rows}}`;assert.doesNotThrow(()=>assertCriticalOperationContracts(good))});

test('inter-site transfer contract cannot trust client identity state or destination',()=>{const required='  /api/transforms: {post: {summary: Apply identity-preserving WASH or SLICE; observation weights never replace inventory}}\n  /api/sorting: {post: {summary: Require a distinct empty physical output container and SORT_OUTPUT_CONTAINER_SCAN_REQUIRED}}',bad=`${required}\n  /api/internal-shipments: {post: {summary: Create anywhere}}\n  /api/internal-shipments/{shipmentId}/{action}: {post: {summary: Flip status}}\n  /api/internal-transfers/receive: {post: {summary: Receive body}}`;assert.throws(()=>assertCriticalOperationContracts(bad),/creation must reject/);const good=`${required}\n  /api/internal-shipments: {post: {summary: distinct active catalog site and unique eligible top-level packages}}\n  /api/internal-shipments/{shipmentId}/{action}: {post: {summary: active session and vehicle latest APPROVED QC completed print cancel releases reserved packages}}\n  /api/internal-transfers/receive: {post: {summary: unique package scans available empty RECEIVING container and receivedBy is derived from the authenticated session}}`;assert.doesNotThrow(()=>assertCriticalOperationContracts(good))});

test('task contracts cannot regress to JWT-wide eligibility or blended work lists',()=>{const required='  /api/transforms: {post: {summary: Apply identity-preserving WASH or SLICE; observation weights never replace inventory}}\n  /api/sorting: {post: {summary: Require a distinct empty physical output container and SORT_OUTPUT_CONTAINER_SCAN_REQUIRED}}',bad=`${required}\n  /api/tasks: {get: {summary: all eligible tasks}}\n  /api/tasks/{taskId}/claim: {post: {summary: claim with JWT roles}}\n  /api/tasks/recommended: {get: {summary: recommend}}`;assert.throws(()=>assertCriticalOperationContracts(bad),/task listing must separate/);const good=`${required}\n  /api/tasks: {get: {summary: separate available and mine by selected session role plus operationType}}\n  /api/tasks/{taskId}/claim: {post: {summary: selectedRole device and station never the JWT full role set SESSION_ACTOR_MISMATCH}}\n  /api/tasks/recommended: {get: {summary: active session selectedRole}}`;assert.doesNotThrow(()=>assertCriticalOperationContracts(good))});
