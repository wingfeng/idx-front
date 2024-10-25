import type { OrgTreeResponse, OrgUnitInfo } from '#/types/orgUnit';

import { requestClient } from '#/api/request';

const apiURL: any = {
  GetChildren: '/api/v1/system/orgunit/getchildren',
  Tree: '/api/v1/system/ou/tree',
  Get: '/api/v1/oauth2/ou/',
  PUT: '/api/v1/oauth2/ou',
  Delete: '/api/v1/oauth2/ou/',
};

export const getOUChildren = async (
  parent: string,
): Promise<Array<OrgUnitInfo>> => {
  return await requestClient.get<Array<OrgUnitInfo>>(apiURL.GetChildren, {
    params: { parent },
  });
};
export const getOUTree = async (parent: string): Promise<OrgTreeResponse> => {
  return await requestClient.get<OrgTreeResponse>(apiURL.Tree, {
    params: { parent },
  });
};
