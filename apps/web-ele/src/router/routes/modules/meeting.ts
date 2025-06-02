/*
 * @Author: deaisry
 * @Date: 2025-06-02 10:35:18
 * @LastEditors: e deaisry@163.com
 * @LastEditTime: 2025-06-02 10:35:58
 * @FilePath: \meiyu-erp-admin\apps\web-ele\src\router\routes\modules\meeting.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import type { RouteRecordRaw } from 'vue-router';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ic:outline-people-alt', // 人事管理主菜单图标
      keepAlive: true,
      order: 6, // 菜单排序号（原order模块是1）
      title: $t('meeting.title'), // 需要语言包中有对应翻译
    },
    name: 'Meeting',
    path: '/meeting',
    component: () => import('#/views/meeting/index.vue'),
  },
];

export default routes;
