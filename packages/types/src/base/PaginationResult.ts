/*
 * @Author: deaisry
 * @Date: 2025-05-21 09:43:54
 * @LastEditors: e deaisry@163.com
 * @LastEditTime: 2025-05-21 11:09:31
 * @FilePath: \meiyu-erp-admin\packages\types\src\base\PaginationResult.ts
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
import type {BasePagination} from '@vben/types';

interface PaginationResult<T> extends BasePagination{
  records:T[],
}
export type { PaginationResult };
