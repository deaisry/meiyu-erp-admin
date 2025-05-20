/*
 * @Author: deaisry
 * @Date: 2025-05-20 09:31:21
 * @LastEditors: e deaisry@163.com
 * @LastEditTime: 2025-05-20 11:19:14
 * @FilePath: \vue-vben-admin\apps\web-ele\src\router\routes\modules\human.ts
 * @Description:
 */
import type { RouteRecordRaw } from 'vue-router';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ic:outline-people-alt', // 人事管理主菜单图标
      keepAlive: true,
      order: 2, // 菜单排序号（原order模块是1）
      title: $t('human.title'), // 需要语言包中有对应翻译
    },
    name: 'Human',
    path: '/human',
    children: [
      {
        path: 'info', // 相对路径（完整路径：/human/info）
        name: 'HumanInfo',
        component: () => import('#/views/human/info/index.vue'),
        meta: {
          icon: 'lucide:user-square', // 用户信息图标
          title: $t('human.info'),
          order: 1, // 子菜单排序
        },
      },
      {
        path: 'attendance', // 相对路径（完整路径：/human/attendance）
        name: 'Attendance',
        meta: {
          icon: 'mdi:calendar-check', // 考勤日历图标
          title: $t('human.attendance'),
          order: 2,
        },
        component: () => import('#/views/human/attendance/index.vue'),
      },
    ],
  },
];

export default routes;
