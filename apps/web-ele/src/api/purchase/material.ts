import type {
  BaseResponseData,
  MaterialPriceInfo,
  OverviewPaginationResult,
  PaginationParams,
  BaseResponse,
  PaginationResponse,
} from '@vben/types';

import { requestClient } from '#/api/request';

export async function fetchMaterialInfo(
  params: PaginationParams<OverviewPaginationResult<BaseResponseData>>,
){
  return await requestClient.post<OverviewPaginationResult<MaterialPriceInfo>>(
    '/purchase/material/findList',
    params,
  )
};

/**
 * 单个新增物料
 * @param data 
 * @returns 
 */
export async function submitMaterialInfo(data: MaterialPriceInfo) {
  const response = await requestClient.post<BaseResponse>(
    '/purchase/material/insertOrUpdate',
    data,
  );
  return response;
}
