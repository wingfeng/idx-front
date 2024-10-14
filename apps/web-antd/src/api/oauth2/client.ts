import type {
  ClientInfo,
  ClientSecretInfo,
  GenSecretParam,
} from '#/types/client';
import type { PageParams, PageResult } from '#/types/page';
import type { APIResult } from '#/types/result';

import { requestClient } from '#/api/request';

const apiURL: any = {
  Page: '/api/v1/oauth2/client/page',
  Get: '/api/v1/oauth2/client/get',
  PUT: '/api/v1/oauth2/client',
  Delete: '/api/v1/oauth2/client/del',
  GETSECRET: '/api/v1/oauth2/client/getsecret',
  DeleteSecret: '/api/v1/oauth2/client/delsecret',
  GenerateSecret: '/api/v1/oauth2/client/generatesecret',
};

export async function getClientList(params: PageParams) {
  return requestClient.post<APIResult<PageResult<ClientInfo>>>(
    apiURL.Page,
    params,
  );
}

export async function getClient(id: string) {
  return requestClient.get<APIResult<ClientInfo>>(apiURL.Get, {
    params: { id },
  });
}
export async function delClient(id: string) {
  return requestClient.delete<APIResult<ClientInfo>>(apiURL.Delete, {
    params: {
      id,
    },
  });
}
export async function saveClient(info: ClientInfo) {
  return requestClient.put<APIResult<ClientInfo>>(apiURL.PUT, info);
}
export async function getSecrets(clientid: number) {
  return requestClient.get<APIResult<Array<ClientSecretInfo>>>(
    apiURL.GETSECRET,
    {
      params: { clientid },
    },
  );
}
export async function delSecret(id: number) {
  return requestClient.delete<APIResult>(apiURL.DeleteSecret, {
    params: {
      id,
    },
  });
}
export async function generateSecret(params: GenSecretParam) {
  return requestClient.post<APIResult<ClientSecretInfo>>(
    apiURL.GenerateSecret,
    params,
  );
}
