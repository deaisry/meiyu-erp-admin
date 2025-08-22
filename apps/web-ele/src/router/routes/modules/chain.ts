
import type { RouteRecordRaw } from 'vue-router';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'mdi:link-variant', // 链条连接图标，表示上下游关系
      order: 3,
      title: $t('chain.title'), // 需要语言包添加对应翻译
      keepAlive: true
    },
    name: 'Chain',
    path: '/chain',
    children: [
      {
        path: 'customer',
        name: 'CustomerManagement',
        component: () => import('#/views/chain/customer/index.vue'),
        meta: {
          icon: 'lucide:users', // 用户组图标
          title: $t('chain.customer'),
          order: 1
        }
      },
      {
        path: 'supplier',
        name: 'SupplierManagement',
        component: () => import('#/views/chain/supplier/index.vue'),
        meta: {
          icon: 'mdi:factory', // 工厂图标
          title: $t('chain.supplier'),
          order: 2
        }
      }
    ]
  }
];

export default routes;
