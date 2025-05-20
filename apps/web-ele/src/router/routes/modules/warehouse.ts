/*
 * @FilePath: \vue-vben-admin\apps\web-ele\src\router\routes\modules\warehouse.ts
 */
import type { RouteRecordRaw } from 'vue-router';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'mdi:warehouse', // 仓库图标
      order: 4, // 排序在订单(1)、人事(2)、上下游(3)之后
      title: $t('warehouse.title'),
      keepAlive: true
    },
    name: 'Warehouse',
    path: '/warehouse',
    children: [
      {
        path: 'inventory', // 二级菜单路径（完整路径：/warehouse/inventory）
        name: 'Inventory',
        meta: {
          icon: 'mdi:archive', // 库存图标
          title: $t('warehouse.inventory'),
          order: 1
        },
        children: [ // 三级菜单
          {
            path: 'finished', // 成品库存（完整路径：/warehouse/inventory/finished）
            name: 'FinishedInventory',
            component: () => import('#/views/warehouse/inventory/finished/index.vue'),
            meta: {
              icon: 'mdi:package-variant',
              title: $t('warehouse.finished')
            }
          },
          {
            path: 'material', // 物料库存（完整路径：/warehouse/inventory/material）
            name: 'MaterialInventory',
            component: () => import('#/views/warehouse/inventory/material/index.vue'),
            meta: {
              icon: 'mdi:palette',
              title: $t('warehouse.material')
            }
          }
        ]
      },
      {
        path: 'delivery', // 送货管理（完整路径：/warehouse/delivery）
        name: 'DeliveryManagement',
        component: () => import('#/views/warehouse/delivery/index.vue'),
        meta: {
          icon: 'mdi:truck-delivery', // 送货卡车图标
          title: $t('warehouse.delivery'),
          order: 2
        }
      }
    ]
  }
];

export default routes;
