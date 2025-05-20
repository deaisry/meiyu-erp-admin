/*
 * @Author: deaisry
 * @Date: 2025-05-20 15:25:06
 * @LastEditors: e deaisry@163.com
 * @LastEditTime: 2025-05-20 17:34:51
 * @FilePath: \vue-vben-admin\apps\web-ele\src\api\human\human.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import type {
  HumanInfo,
  PaginationParams,
  PaginationResult,
} from '@vben/types';

import { requestClient } from '#/api/request';

// export namespace HumanApi {
//   export interface HumanParam {
//     id?: string;
//     cName?: string;
//     dept?: string;
//     sex?: string;
//     title?: string;
//     pageNo: number;
//     pageSize: number;
//   }
// }

interface HumanQueryParams {
  dept?: string;
  name?: string;
  isMarried?: '0' | '1';
}

/**
 * 获取人事信息
 */
// export async function getHumanInfo(params: HumanApi.HumanParam) {
//   const response = requestClient.post<PageResult<any>>(
//     '/human/findList',
//     params,
//   );
//   return response;
// }

export async function fetchHumanList(
  params: PaginationParams<PaginationResult<HumanInfo>>,
) {
  // 合并分页参数和查询条件
  const requestParams = {
    current: params.current,
    size: params.size,
    ...params.query, // 展开查询条件
  };

  const response = await requestClient.post<PaginationResult<HumanInfo>>(
    '/human/findList',
    {
      params: requestParams,
    },
  );
  return response;
}
