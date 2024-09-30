import type { APIResult } from '#/types/result';

import { requestClient } from '#/api/request';

const apiURL: any = {
  NewId: '/api/v1/system/utils/newid',
};
declare type IdResult = {
  id: number;
};
export async function newId() {
  return requestClient.get<APIResult<IdResult>>(apiURL.NewId);
}
