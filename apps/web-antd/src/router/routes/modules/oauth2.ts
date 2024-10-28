import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'oui:app-management',
      order: 9999,
      title: 'oAuth2',
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
        name: 'Scopes',
        path: 'scopes',
        component: () => import('#/views/oauth2/scope/ScopeList.vue'),
        meta: {
          icon: 'lucide:code-2',

          title: 'Scopes',
        },
      },
    ],
  },
];

export default routes;
