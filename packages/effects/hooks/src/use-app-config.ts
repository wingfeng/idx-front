import type {
  ApplicationConfig,
  VbenAdminProAppConfigRaw,
} from '@vben/types/global';

/**
 * 由 vite-inject-app-config 注入的全局配置
 */
export function useAppConfig(
  env: Record<string, any>,
  isProduction: boolean,
): ApplicationConfig {
  // 生产环境下，直接使用 window._VBEN_ADMIN_PRO_APP_CONF_ 全局变量
  const config = isProduction
    ? window._VBEN_ADMIN_PRO_APP_CONF_
    : (env as VbenAdminProAppConfigRaw);

  const {
    VITE_GLOB_API_URL,
    VITE_GLOB_OIDC_CALLBACK_URL,
    VITE_GLOB_OIDC_AUTHORITY,
  } = config;

  return {
    apiURL: VITE_GLOB_API_URL,
    callbackURL: VITE_GLOB_OIDC_CALLBACK_URL,
    oidcAuthority: VITE_GLOB_OIDC_AUTHORITY,
  };
}
