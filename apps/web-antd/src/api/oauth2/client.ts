import type {
  ClientInfo,
  GenSecretParam,
  GenSecretResponse,
  GetSecretResponse,
} from '#/types/client';
import type { PageParams, PageResult } from '#/types/page';
import type { APIResult } from '#/types/result';

import { requestClient } from '#/api/request';

const apiURL: any = {
  Page: '/api/v1/oauth2/client/list',
  Get: '/api/v1/oauth2/client/',
  PUT: '/api/v1/oauth2/client',
  Delete: '/api/v1/oauth2/client/',
  GETSECRET: '/api/v1/oauth2/client/getsecret',
  DeleteSecret: '/api/v1/oauth2/client/deletesecret',
  GenerateSecret: '/api/v1/oauth2/client/generatesecret',
};

export async function getClientList(params: PageParams) {
  return requestClient.post<PageResult<ClientInfo>>(apiURL.Page, params);
}

export async function getClient(id: string) {
  return requestClient.get<ClientInfo>(apiURL.Get + id);
}
export async function delClient(id: string) {
  return requestClient.delete<ClientInfo>(apiURL.Delete + id);
}
export async function saveClient(info: ClientInfo) {
  return requestClient.put<ClientInfo>(apiURL.PUT, info);
}
export async function getSecrets(clientid: number) {
  return requestClient.get<GetSecretResponse>(apiURL.GETSECRET, {
    params: { clientid },
  });
}
export async function delSecret(id: number) {
  return requestClient.delete<APIResult>(apiURL.DeleteSecret, {
    params: {
      id,
    },
  });
}
export async function generateSecret(params: GenSecretParam) {
  return requestClient.post<GenSecretResponse>(apiURL.GenerateSecret, params);
}
