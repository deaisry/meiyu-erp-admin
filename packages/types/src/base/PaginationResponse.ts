/*
 * @Author: deaisry
 * @Date: 2025-05-21 11:07:27
 * @LastEditors: e deaisry@163.com
 * @LastEditTime: 2025-05-21 11:30:36
 * @FilePath: \meiyu-erp-admin\packages\types\src\base\PaginationResponse.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import type { BaseResponse,PaginationResult } from '@vben/types';

interface PaginationResponse<T> extends BaseResponse{
  data: PaginationResult<T>
}
export type {PaginationResponse};

