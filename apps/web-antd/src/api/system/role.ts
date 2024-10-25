import type { PageParams, PageResult } from '#/types/page';
import type { RoleInfo } from '#/types/role';
import type { UserInfo } from '#/types/user';

import { requestClient } from '#/api/request';

const apiURL: any = {
  GetMembers: '/api/v1/system/role/{0}/members',
  Get: '/api/v1/system/role/',
  PUT: '/api/v1/system/role',
  Delete: '/api/v1/system/role/',
  Page: '/api/v1/system/role/list',
};
export async function getRoleList(params: PageParams) {
  return requestClient.post<PageResult<RoleInfo>>(apiURL.Page, params);
}
export async function getRoleMembers(params: PageParams, id: string) {
  const p = {
    ...params,
    Id: id,
  };
  return requestClient.post<PageResult<UserInfo>>(apiURL.GetMembers, p);
}
export async function getRole(id: string) {
  return requestClient.get<RoleInfo>(apiURL.Get + id);
}
export async function delRole(id: string) {
  return requestClient.delete<RoleInfo>(apiURL.Delete + id);
}
export async function saveRole(info: RoleInfo) {
  return requestClient.put<RoleInfo>(apiURL.PUT, info);
}
