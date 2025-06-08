import type {
  BaseResponse,
  ItemInfo,
  ItemRelaInfo,
  OverviewPaginationResult,
  PaginationParams,
} from '@vben/types';

import { requestClient } from '../request';

export async function fetchItemList(
  params: PaginationParams<OverviewPaginationResult<ItemInfo>>,
) {
  const response = await requestClient.post<OverviewPaginationResult<ItemInfo>>(
    '/item/findList',
    params,
  );
  return response;
}

export async function submitItemInfo(params: ItemInfo) {
  const response = await requestClient.post<BaseResponse>(
    '/item/insertOrUpdate',
    params,
  );
  return response;
}

export async function deleteItemInfo(params: string) {
  const response = await requestClient.delete<BaseResponse>(
    `/item/deleteById${params}`,
  );
  return response;
}

export async function completeStep(itemIdParam: string, stepParam: number) {
  const param: ItemRelaInfo = { itemId: itemIdParam, step: stepParam };
  const response = await requestClient.post<BaseResponse>(
    `/item/completeStep`,
    param,
  );
  return response;
}

export async function assignItem(item: ItemInfo, data: []) {
  return null;
}
