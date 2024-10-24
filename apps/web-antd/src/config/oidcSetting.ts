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
  post_logout_redirect_uri: 'http://localhost:5666/',
  stateStore: new WebStorageStateStore({ store: window.localStorage }),
};
