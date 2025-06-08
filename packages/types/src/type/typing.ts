/*
 * @Author: deaisry
 * @Date: 2025-05-15 10:50:48
 * @LastEditors: e deaisry@163.com
 * @LastEditTime: 2025-05-29 11:21:17
 * @FilePath: \meiyu-erp-admin\packages\effects\common-ui\src\ui\dashboard\typing.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import type { Component } from 'vue';

interface AnalysisOverviewItem {
  icon: Component | string;
  title: string;
  totalTitle: string;
  totalValue: number;
  value: number;
}

interface DeptOverviewItem {
  dept: string;
  cnt: number;
}

interface FollowOverviewItem {
  status: string;
  cnt: number;
}

interface WorkbenchProjectItem {
  color?: string;
  content: string;
  date: string;
  group: string;
  icon: Component | string;
  title: string;
  url?: string;
}

interface WorkbenchTrendItem {
  avatar: string;
  content: string;
  date: string;
  title: string;
}

interface WorkbenchTodoItem {
  completed: boolean;
  content: string;
  date: string;
  title: string;
}

interface WorkbenchQuickNavItem {
  color?: string;
  icon: Component | string;
  title: string;
  url?: string;
}

export type {
  AnalysisOverviewItem,
  DeptOverviewItem,
  FollowOverviewItem,
  WorkbenchProjectItem,
  WorkbenchQuickNavItem,
  WorkbenchTodoItem,
  WorkbenchTrendItem,
};
