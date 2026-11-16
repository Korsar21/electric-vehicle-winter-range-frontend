import { readFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { generateApi } from 'swagger-typescript-api';
const input = JSON.parse(await readFile(resolve('../electric-vehicle-winter-range-backend/docs/swagger.json'),'utf8'));
input.paths = Object.fromEntries(Object.entries(input.paths).filter(([path]) => path.startsWith('/electric-car-loads')));
const names = {'get /electric-car-loads':'getElectricCarLoads','get /electric-car-loads/feed':'getElectricCarLoadFeed','get /electric-car-loads/draft':'getElectricCarLoadDraft','post /electric-car-loads':'createElectricCarLoadDraft','put /electric-car-loads/{id}':'publishElectricCarLoad','delete /electric-car-loads/{id}':'deleteElectricCarLoad','post /electric-car-loads/{id}/like':'setElectricCarLoadLike'};
for (const [path, methods] of Object.entries(input.paths)) for (const [method, operation] of Object.entries(methods)) if (names[`${method} ${path}`]) operation.operationId = names[`${method} ${path}`];
await mkdir(resolve('src/shared/api/generated'), {recursive:true});
await generateApi({output:resolve('src/shared/api/generated'),spec:input,httpClientType:'axios',generateClient:true});
