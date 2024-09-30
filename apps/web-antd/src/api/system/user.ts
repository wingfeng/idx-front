import type { PageParams, PageResult } from '#/types/page';
import type { APIResult } from '#/types/result';
import type { UserInfo } from '#/types/user';

import { requestClient } from '#/api/request';

const apiURL: any = {
  Page: '/api/v1/system/user/page',
  Get: '/api/v1/system/user/get',
  PUT: '/api/v1/system/user',
  Delete: '/api/v1/system/user/del',
  RESETPASSWORD: '/api/v1/system/user/resetpassword',
};

export async function getUserList(params: PageParams) {
  return requestClient.post<APIResult<PageResult<UserInfo>>>(
    apiURL.Page,
    params,
  );
}

export async function getUser(id: string) {
  return requestClient.get<APIResult<UserInfo>>(apiURL.Get, {
    params: { id },
  });
}
export async function delUser(id: string) {
  return requestClient.delete<APIResult<UserInfo>>(apiURL.Delete, {
    params: {
      id,
    },
  });
}
export async function saveUser(info: UserInfo) {
  return requestClient.put<APIResult<UserInfo>>(apiURL.PUT, info);
}

export async function resetPassword(username: string) {
  return requestClient.post<APIResult<string>>(apiURL.RESETPASSWORD, {
    username,
  });
}
