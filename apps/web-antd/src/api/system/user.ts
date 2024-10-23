import type { PageParams, PageResult } from '#/types/page';
import type { ResetPwdResponse, UserInfo } from '#/types/user';

import { requestClient } from '#/api/request';

const apiURL: any = {
  Page: '/api/v1/system/user/list',
  Get: '/api/v1/system/user/',
  PUT: '/api/v1/system/user',
  Delete: '/api/v1/system/user/',
  RESETPASSWORD: '/api/v1/system/user/resetpwd',
};

export async function getUserList(params: PageParams) {
  return requestClient.post<PageResult<UserInfo>>(apiURL.Page, params);
}

export async function getUser(id: string) {
  return requestClient.get<UserInfo>(apiURL.Get + id);
}
export async function delUser(id: string) {
  return requestClient.delete<UserInfo>(apiURL.Delete + id);
}
export async function saveUser(info: UserInfo) {
  return requestClient.put<UserInfo>(apiURL.PUT, info);
}

export async function resetPassword(Id: number) {
  return requestClient.post<ResetPwdResponse>(apiURL.RESETPASSWORD, {
    Id,
  });
}
