import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'oui:app-management',
      order: 9999,
      title: 'Manage',
    },
    name: 'OAuth2',
    path: '/oauth2-admin',

    children: [
      {
        name: 'Clients',
        path: 'clientlist',
        component: () => import('#/views/oauth2/clients/ClientList.vue'),
        meta: {
          icon: 'mdi:application-brackets-outline',
          title: 'Clients',
        },
      },
      {
        name: 'APIs',
        path: 'apis',
        component: () => import('#/views/oauth2/apis/APIList.vue'),
        meta: {
          icon: 'lucide:code-2',

          title: 'APIs',
        },
      },
      {
        name: 'Organization Unit',
        path: 'ou',
        component: () => import('#/views/oauth2/users/OUList.vue'),
        meta: {
          icon: 'clarity:organization-line',

          title: 'Organization Unit',
        },
      },
      {
        name: 'Groups',
        path: 'Groups',
        component: () => import('#/views/oauth2/users/GroupList.vue'),
        meta: {
          title: 'Groups',
          icon: 'lucide:users-2',
        },
      },
      {
        name: 'Users',
        path: 'users',
        component: () => import('#/views/oauth2/users/UserList.vue'),
        meta: {
          icon: 'mdi:user',
          title: 'Users',
        },
      },
    ],
  },
];

export default routes;
