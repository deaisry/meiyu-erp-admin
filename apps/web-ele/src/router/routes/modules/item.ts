import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ic:outline-people-alt', // 人事管理主菜单图标
      keepAlive: true,
      order: 5, // 菜单排序号（原order模块是1）
      title: $t('item.title'), // 需要语言包中有对应翻译
    },
    name: 'Item',
    path: '/item',
    component: () => import('#/views/item/index.vue'),
  },
  {
    path: '/item/add',
    name: 'ItemAdd',
    component: () => import('#/views/item/add.vue'),
    meta: {
      title: '新增事项',
      hideInMenu: true,
    },
  },
  {
    path: '/item/detail/:itemId',
    name: 'ItemDetail',
    component: () => import('#/views/item/detail.vue'),
    meta: {
      title: '事项详情',
      hideInMenu: true,
    },
  },
];

export default routes;
