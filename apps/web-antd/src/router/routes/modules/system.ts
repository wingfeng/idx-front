import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'oui:app-management',
      order: 9999,
      title: 'System',
    },
    name: 'system',
    path: '/system',

    children: [
      {
        name: 'Organization Unit',
        path: 'ou',
        component: () => import('#/views/system/user/OUList.vue'),
        meta: {
          icon: 'clarity:organization-line',

          title: 'Organization Unit',
        },
      },
      {
        name: 'Roles',
        path: 'roles',
        component: () => import('#/views/system/role/RoleList.vue'),
        meta: {
          title: 'Roles',
          icon: 'lucide:users-2',
        },
      },
      {
        name: 'Groups',
        path: 'Groups',
        component: () => import('#/views/system/user/GroupList.vue'),
        meta: {
          title: 'Groups',
          icon: 'lucide:users-2',
        },
      },
      {
        name: 'Users',
        path: 'users',
        component: () => import('#/views/system/user/UserList.vue'),
        meta: {
          icon: 'mdi:user',
          title: 'Users',
        },
      },
    ],
  },
];

export default routes;
