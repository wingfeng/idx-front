import type { RouteMeta as IRouteMeta } from '@vben-core/typings';

import 'vue-router';

declare module 'vue-router' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface RouteMeta extends IRouteMeta {}
}

export interface VbenAdminProAppConfigRaw {
  VITE_GLOB_API_URL: string;
  VITE_GLOB_OIDC_CALLBACK_URL: string;
  VITE_GLOB_OIDC_AUTHORITY: string;
}

export interface ApplicationConfig {
  apiURL: string;
  callbackURL: string;
  oidcAuthority: string;
}

declare global {
  interface Window {
    _VBEN_ADMIN_PRO_APP_CONF_: VbenAdminProAppConfigRaw;
  }
}
