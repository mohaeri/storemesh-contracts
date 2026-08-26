import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const canonical = path => path.replace(/\{[^}]+\}/g,'{}');
const key = ({method,path}) => `${method.toUpperCase()} ${canonical(path)}`;

function regexPath(source) {
  let path=source.replace(/^\^/,'').replace(/\$$/,'').replaceAll('\\/','/');
  path=path.replace(/\[\^\/\]\+/g,'{}');
  path=path.replace(/\((?:\\.|[^)])+\)[+*?]?/g,'{}');
  path=path.replace(/\\([.\-_])/g,'$1');
  if(!path.startsWith('/')||/[\[\]()+*?|^$\\]/.test(path))throw new Error(`Cannot safely convert pathname regex to an OpenAPI template: /${source}/`);
  return path;
}

export function extractServerRoutes(server) {
  const found=[];
  for(const match of server.matchAll(/req\.method\s*===\s*['"]([A-Z]+)['"]\s*&&\s*u\.pathname\s*===\s*['"]([^'"]+)['"]/g))found.push({method:match[1],path:match[2]});
  for(const match of server.matchAll(/req\.method\s*===\s*['"]([A-Z]+)['"]\s*&&\s*u\.pathname\.startsWith\(\s*['"]([^'"]+)['"]\s*\)/g))found.push({method:match[1],path:match[2].replace(/\/$/,'')+'/{}'});

  for(const pathnameTest of server.matchAll(/\.test\(\s*u\.pathname\s*\)/g)){
    const cursor=pathnameTest.index;
    const clauseStart=server.lastIndexOf('req.method',cursor);
    const clause=server.slice(clauseStart,cursor);
    const method=clause.match(/req\.method\s*===\s*['"]([A-Z]+)['"]/)?.[1];
    const separator=clause.lastIndexOf('&&');
    const literal=separator<0?'':clause.slice(separator+2).trim();
    const expression=literal.match(/^\/(.+)\/[dgimsuvy]*$/s);
    if(!method||!expression)throw new Error(`Unparseable pathname regex route near source offset ${cursor}; parity cannot be guaranteed`);
    found.push({method,path:regexPath(expression[1])});
  }
  return [...new Map(found.map(route=>[key(route),route])).values()];
}

export function extractOpenApiRoutes(openapi) {
  const found=[];
  for(const line of openapi.split(/\r?\n/)){
    const entry=line.match(/^  (\/[^:]+):\s*\{(.*)$/);if(!entry)continue;
    for(const method of entry[2].matchAll(/(?:^|[{,]\s*)(get|post|put|patch|delete|options|head|trace)\s*:/gi))found.push({method:method[1].toUpperCase(),path:entry[1]});
  }
  return found;
}

export function assertRouteParity(server,openapi) {
  const serverRoutes=extractServerRoutes(server),contractRoutes=extractOpenApiRoutes(openapi);
  const matches=(left,right)=>left.method===right.method&&canonical(left.path).split('/').length===canonical(right.path).split('/').length&&canonical(left.path).split('/').every((part,index)=>part==='{}'||canonical(right.path).split('/')[index]==='{}'||part===canonical(right.path).split('/')[index]);
  const undocumented=serverRoutes.filter(route=>!contractRoutes.some(contract=>matches(route,contract))).map(key);
  const stale=contractRoutes.filter(contract=>!serverRoutes.some(route=>matches(route,contract))).map(key);
  if(undocumented.length)throw new Error(`Server routes missing from OpenAPI: ${undocumented.join(', ')}`);
  if(stale.length)throw new Error(`OpenAPI routes missing from server: ${stale.join(', ')}`);
  return serverRoutes.length;
}

export function assertCriticalOperationContracts(openapi){
  const transform=openapi.match(/^  \/api\/transforms:.*$/m)?.[0]??'';
  if(!transform.includes('identity-preserving WASH or SLICE')||!transform.includes('observation weights never replace'))throw new Error('OpenAPI transform contract must preserve WASH/SLICE batch identity and authoritative inventory weight');
  const sorting=openapi.match(/^  \/api\/sorting:.*$/m)?.[0]??'';
  if(!sorting.includes('distinct empty physical output container')||!sorting.includes('SORT_OUTPUT_CONTAINER_SCAN_REQUIRED'))throw new Error('OpenAPI sorting contract must require a distinct scanned physical container for every output');
  const shipment=openapi.match(/^  \/api\/shipments:.*$/m)?.[0]??'',shipmentScan=openapi.match(/^  \/api\/shipments\/\{shipmentId\}\/scans:.*$/m)?.[0]??'',shipmentAction=openapi.match(/^  \/api\/shipments\/\{shipmentId\}\/\{action\}:.*$/m)?.[0]??'';
  if(shipment&&(!shipment.includes('Fresh Shipping Boxes')||!shipmentScan.includes('Fresh Shipping Box')))throw new Error('OpenAPI customer-shipment contract must include physically scanned Fresh Shipping Boxes');
  if(shipmentAction){
    for(const term of['latest APPROVED QC','genuine completed printing','no blocking exception'])if(!shipment.includes(term))throw new Error(`OpenAPI shipment creation must document ${term}`);
    for(const term of['revalidat','current status','QC','genuine print','blocking exceptions'])if(!shipmentScan.includes(term)||!shipmentAction.includes(term))throw new Error(`OpenAPI shipment scan and transitions must document ${term}`);
  }
  const freshNets=openapi.match(/^  \/api\/fresh-net-lots:.*$/m)?.[0]??'';
  if(freshNets&&(!freshNets.includes('physically scanned BASKET or CRATE')||!freshNets.includes('CONTAINER_SCAN_REQUIRED')))throw new Error('OpenAPI Fresh Export contract must require a scanned physical source container');
  const freshBoxes=openapi.match(/^  \/api\/fresh-shipping-boxes:.*$/m)?.[0]??'';
  if(freshBoxes&&(!freshBoxes.includes('aggregating repeated allocations by netLotId')||!freshBoxes.includes('LABEL_PENDING')||!freshBoxes.includes('completePrint')||!freshBoxes.includes('READY_TO_SHIP')))throw new Error('OpenAPI Fresh Shipping Box contract must aggregate net-lot allocations and require completed printing before shipment readiness');
}

async function main(){
  const serverPath=process.env.SITE_SERVER_SOURCE||resolve('..','storemesh-site-server','src','server.js');
  const [server,openapi]=await Promise.all([readFile(serverPath,'utf8'),readFile(resolve('openapi','storemesh.yaml'),'utf8')]);
  const count=assertRouteParity(server,openapi);
  assertCriticalOperationContracts(openapi);
  console.log(`OpenAPI/server parity verified for ${count} method + route templates`);
}

if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href)await main();
