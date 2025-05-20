/*
 * @Author: deaisry
 * @Date: 2025-05-20 09:31:21
 * @LastEditors: e deaisry@163.com
 * @LastEditTime: 2025-05-20 11:11:31
 * @FilePath: \vue-vben-admin\apps\web-ele\src\router\routes\modules\order.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ic:baseline-view-in-ar',
      keepAlive: true,
      order: 1,
      title: $t('order.title'),
    },
    name: 'Order',
    path: '/order',
    children: [
        {
          meta:
            {
              icon:'ic:baseline-view-in-ar',
              order:1,
              title:$t('order.sale'),
            },
            name:'Sale',
            path:'/sale',
            component: () => import('#/views/order/sale/index.vue'),
        },
        {
          meta:
            {
              icon:'ic:baseline-view-in-ar',
              order:2,
              title:$t('order.product'),
            },
            name:'Product',
            path:'/product',
            children:[
              {
                name: 'PlasticOrder',
                path: '/order/plastic',
                component: () => import('#/views/order/product/plastic/index.vue'),
                meta: {
                  icon: 'lucide:book-open-text',
                  title: $t('order.plastic'),
                },
            },
            {
              name: 'MoldOrder',
              path: '/order/mold',
              component: () => import('#/views/order/product/mold/index.vue'),
              meta: {
                icon: 'mdi:github',
                title: 'order.mold',
              },
            },

            ]
        },
    ],
  },
];

export default routes;
