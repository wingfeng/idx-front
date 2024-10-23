import { requestClient } from '#/api/request';

const apiURL: any = {
  NewId: '/api/v1/system/common/newid',
};
declare type IdResult = {
  id: string;
};
export async function newId() {
  return requestClient.get<IdResult>(apiURL.NewId);
}
