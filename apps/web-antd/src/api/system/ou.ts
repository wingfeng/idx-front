import type { OrgUnitInfo } from '#/types/orgUnit';
import type { APIResult } from '#/types/result';

import { requestClient } from '#/api/request';

const apiURL: any = {
  GetChildren: '/api/v1/system/orgunit/getchildren',
  Tree: '/api/v1/system/orgunit/tree',
  Get: '/api/v1/oauth2/api/get',
  PUT: '/api/v1/oauth2/api',
  Delete: '/api/v1/oauth2/api/del',
};

export const getOUChildren = async (
  parent: string,
): Promise<APIResult<Array<OrgUnitInfo>>> => {
  return await requestClient.get<APIResult<Array<OrgUnitInfo>>>(
    apiURL.GetChildren,
    {
      params: { parent },
    },
  );
};
export const getOUTree = async (
  parent: string,
): Promise<APIResult<Array<OrgUnitInfo>>> => {
  return await requestClient.get<APIResult<Array<OrgUnitInfo>>>(apiURL.Tree, {
    params: { parent },
  });
};
