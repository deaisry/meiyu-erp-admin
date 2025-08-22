
import type { RouteRecordRaw } from 'vue-router';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ic:outline-people-alt',
      keepAlive: true,
      order: 2,
      title: $t('purchase.title'),
    },
    name: 'Purchase',
    path: '/purchase',
    children: [
      {
        path: 'material',
        name: 'Material',
        component: () => import('#/views/purchase/material/index.vue'),
        meta: {
          icon: 'lucide:user-square',
          title: $t('purchase.material'),
          order: 1, // 子菜单排序
        },
      },
      {
        path: 'order', // 相对路径（完整路径：/purchase/order）
        name: 'Order',
        meta: {
          icon: 'mdi:calendar-check', // 考勤日历图标
          title: $t('purchase.order'),
          order: 2,
        },
        component: () => import('#/views/purchase/order/index.vue'),
      },
    ],
  },
];

export default routes;
