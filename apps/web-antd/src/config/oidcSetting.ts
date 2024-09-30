import { useAppConfig } from '@vben/hooks';

import { WebStorageStateStore } from 'oidc-client-ts';

const { callbackURL, oidcAuthority } = useAppConfig(
  import.meta.env,
  import.meta.env.PROD,
);

export const oidcSetting: any = {
  authority: oidcAuthority,
  client_id: 'code_client',
  client_secret: 'secret',
  redirect_uri: callbackURL,
  response_type: 'code',
  scope: 'openid profile email',
  stateStore: new WebStorageStateStore({ store: window.localStorage }),
};
