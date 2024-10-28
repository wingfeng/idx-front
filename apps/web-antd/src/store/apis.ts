import type { PageParams } from '#/types/page';

import { delScope, getScopeList, saveAPI } from '#/api/oauth2/scope';

export async function GetAPIPage(params: PageParams) {
  return getScopeList(params);
  //  return result.data;
}

export async function SaveAPI(data: any) {
  return saveAPI(data);
}

export async function DeleteAPI(id: string) {
  return delScope(id);
}
