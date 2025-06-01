/*
 * @Author: deaisry
 * @Date: 2025-05-20 15:25:06
 * @LastEditors: e deaisry@163.com
 * @LastEditTime: 2025-05-29 16:11:00
 * @FilePath: \meiyu-erp-admin\apps\web-ele\src\api\human\human.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import type {
  BaseResponse,
  HumanInfo,
  OverviewPaginationResult,
  PaginationParams,
} from '@vben/types';

import { requestClient } from '#/api/request';

export async function fetchHumanList(
  params: PaginationParams<OverviewPaginationResult<HumanInfo>>,
) {
  const response = await requestClient.post<
    OverviewPaginationResult<HumanInfo>
  >('/human/findList', params);
  return response;
}

export async function submitHumanInfo(data: HumanInfo) {
  const response = await requestClient.post<BaseResponse>(
    '/human/insertOrUpdate',
    data,
  );
  return response;
}

export async function activeEmp(data: HumanInfo) {
  return await requestClient.post<BaseResponse>('/human/activeEmp', data);
}

export async function inactiveEmp(data: HumanInfo) {
  return await requestClient.post<BaseResponse>('/human/inactiveEmp', data);
}

export async function selectById(data: HumanInfo) {
  return await requestClient.post<BaseResponse>('/human/selectById', data);
}
