/*
 * @Author: deaisry
 * @Date: 2025-05-20 17:44:55
 * @LastEditors: e deaisry@163.com
 * @LastEditTime: 2025-05-20 17:46:50
 * @FilePath: \vue-vben-admin\packages\types\src\PageResult.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
// 分页数据
interface PageResult<T> {
  records: T[];
  total: number;
  size: number;
  current: number;
  orders: any[];
  optimizeCountSql: boolean;
  hitCount: boolean;
  countId: string | null;
  maxLimit: number | null;
  searchCount: boolean;
  pages: number;
}
export type { PageResult };
