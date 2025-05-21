/*
 * @Author: deaisry
 * @Date: 2025-05-20 15:25:06
 * @LastEditors: e deaisry@163.com
 * @LastEditTime: 2025-05-21 11:27:58
 * @FilePath: \meiyu-erp-admin\apps\web-ele\src\api\human\human.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import type {
  HumanInfo,
  PaginationParams,
  PaginationResult,
  HumanApiResponse,
} from '@vben/types';

import { requestClient } from '#/api/request';


export async function fetchHumanList(
  params: PaginationParams<PaginationResult<HumanInfo>>,
) {
  debugger;
  // 合并分页参数和查询条件
  const requestParams = {
    current: params.current,
    size: params.size,
    ...params.query, // 展开查询条件
  };

  const response = await requestClient.post<HumanApiResponse>(
    '/human/findList',
    {
      params: requestParams,
    },
  );
  return response;
}
