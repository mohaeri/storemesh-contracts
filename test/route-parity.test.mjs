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
