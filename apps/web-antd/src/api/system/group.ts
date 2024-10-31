import type { GroupInfo } from '#/types/group';
import type { PageParams, PageResult } from '#/types/page';
import type { UserInfo } from '#/types/user';

import { requestClient } from '#/api/request';

const apiURL: any = {
  Members: '/api/v1/system/group/{0}/members',

  Get: '/api/v1/system/group/',
  PUT: '/api/v1/system/group',
  Delete: '/api/v1/system/group/',
  Page: '/api/v1/system/group/list',
};
export async function getList(params: PageParams) {
  return requestClient.post<PageResult<GroupInfo>>(apiURL.Page, params);
}

export async function get(id: string) {
  return requestClient.get<GroupInfo>(apiURL.Get + id);
}
export async function del(id: string) {
  return requestClient.delete<GroupInfo>(apiURL.Delete + id);
}
export async function save(info: GroupInfo) {
  return requestClient.put<GroupInfo>(apiURL.PUT, info);
}
export async function getMembers(params: PageParams, id: number) {
  const url = apiURL.Members.replace('{0}', id);
  const p = {
    ...params,
    Id: id,
  };
  return requestClient.post<PageResult<UserInfo>>(url, p);
}
export async function addMembers(roleId: number, userIds: Array<bigint>) {
  const url = apiURL.Members.replace('{0}', roleId);
  return requestClient.put(url, {
    userIds,
  });
}
export async function deleteMembers(id: number, userIds: Array<bigint>) {
  const url = apiURL.Members.replace('{0}', id);
  return requestClient.delete(url, {
    params: {
      userIds,
    },
  });
}
