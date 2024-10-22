import type { PageParams } from '#/types/page';

import {
  delUser,
  getUserList,
  resetPassword,
  saveUser,
} from '#/api/system/user';

export async function GetUserPage(params: PageParams) {
  return getUserList(params);
  //  return result.data;
}

export async function SaveUser(data: any) {
  return saveUser(data);
}

export async function DeleteUser(id: string) {
  return delUser(id);
}
export async function ResetPassword(Id: number) {
  return resetPassword(Id);
}
