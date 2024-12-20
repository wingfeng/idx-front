import type { PageParams, PageResult } from '#/types/page';
import type { APIResult } from '#/types/result';
import type { ScopeInfo } from '#/types/scope';

import { requestClient } from '#/api/request';

const apiURL: any = {
  Page: '/api/v1/oauth2/scope/list',
  Get: '/api/v1/oauth2/scope/',
  PUT: '/api/v1/oauth2/scope',
  Delete: '/api/v1/oauth2/scope/',
};

export async function getScopeList(params: PageParams) {
  return requestClient.post<PageResult<ScopeInfo>>(apiURL.Page, params);
}

export async function getScope(id: string) {
  return requestClient.get<APIResult<ScopeInfo>>(apiURL.Get, {
    params: { id },
  });
}
export async function delScope(id: string) {
  return requestClient.delete<APIResult<ScopeInfo>>(apiURL.Delete + id);
}
export async function saveAPI(info: ScopeInfo) {
  return requestClient.put<APIResult<ScopeInfo>>(apiURL.PUT, info);
}
