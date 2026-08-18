import test from 'node:test';
import assert from 'node:assert/strict';
import { assertRouteParity,extractServerRoutes } from '../scripts/route-parity.mjs';

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
