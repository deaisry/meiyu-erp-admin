import type {
  BaseResponse,
  DepartmentEmployeesResponse,
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

export async function selectDeptMem() {
  return await requestClient.get<DepartmentEmployeesResponse>(
    '/human/findDeptMem',
  );
}
