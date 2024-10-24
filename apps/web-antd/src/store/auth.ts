import type { LoginAndRegisterParams } from '@vben/common-ui';
import type { UserInfo } from '@vben/types';

import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { DEFAULT_HOME_PATH } from '@vben/constants';
import { resetAllStores, useAccessStore, useUserStore } from '@vben/stores';

import { notification } from 'ant-design-vue';
import { UserManager } from 'oidc-client-ts';
import { defineStore } from 'pinia';

import { getAccessCodesApi, loginApi } from '#/api';
import { oidcSetting } from '#/config/oidcSetting';
import { $t } from '#/locales';

export const useAuthStore = defineStore('auth', () => {
  const accessStore = useAccessStore();
  const userStore = useUserStore();
  const router = useRouter();

  const loginLoading = ref(false);

  /**
   * 异步处理登录操作
   * Asynchronously handle the login process
   * @param params 登录表单数据
   */
  async function authLogin(
    params: LoginAndRegisterParams,
    onSuccess?: () => Promise<void> | void,
  ) {
    // 异步处理用户登录操作并获取 accessToken
    let userInfo: null | UserInfo = null;
    try {
      loginLoading.value = true;
      const { accessToken } = await loginApi(params);

      // 如果成功获取到 accessToken
      if (accessToken) {
        accessStore.setAccessToken(accessToken);

        // 获取用户信息并存储到 accessStore 中
        const [fetchUserInfoResult, accessCodes] = await Promise.all([
          fetchUserInfo(),
          getAccessCodesApi(),
        ]);

        userInfo = fetchUserInfoResult;

        userStore.setUserInfo(userInfo);
        accessStore.setAccessCodes(accessCodes);

        if (accessStore.loginExpired) {
          accessStore.setLoginExpired(false);
        } else {
          onSuccess
            ? await onSuccess?.()
            : await router.push(userInfo.homePath || DEFAULT_HOME_PATH);
        }

        if (userInfo?.realName) {
          notification.success({
            description: `${$t('authentication.loginSuccessDesc')}:${userInfo?.realName}`,
            duration: 3,
            message: $t('authentication.loginSuccess'),
          });
        }
      }
    } finally {
      loginLoading.value = false;
    }

    return {
      userInfo,
    };
  }

  async function logout(redirect: boolean = true) {
    //   await logoutApi();
    resetAllStores();
    accessStore.setLoginExpired(false);
    if (redirect === true) {
      console.log(`logout${redirect}`);
    }
    const um = new UserManager(oidcSetting);
    um.signoutRedirect();
    // 回登陆页带上当前路由地址
    // await router.replace({
    //   path: LOGIN_PATH,
    //   query: redirect
    //     ? {
    //         redirect: encodeURIComponent(router.currentRoute.value.fullPath),
    //       }
    //     : {},
    // });
  }

  async function fetchUserInfo() {
    console.log('fetch user info by oidc');
    const um = new UserManager(oidcSetting);
    const user = await um.getUser();
    let userInfo: null | UserInfo = null;
    if (!user) {
      return;
    }
    userInfo = {
      userId: user.profile.sub,
      userName: user.profile.preferred_username,
      email: user.profile.email,
      roles: user.profile.roles,
      //      avatar: `${user.profile.sub}.png`,
    };
    userStore.setUserInfo(userInfo);
    return userInfo;
  }

  function $reset() {
    loginLoading.value = false;
  }

  return {
    $reset,
    authLogin,
    fetchUserInfo,
    loginLoading,
    logout,
  };
});
