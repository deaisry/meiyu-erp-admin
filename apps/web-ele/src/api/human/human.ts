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
  return await requestClient.post<OverviewPaginationResult<HumanInfo>>(
    '/human/findList',
    params,
  );
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

// 定义员工姓名映射类型
export type EmployeeNameMap = Record<string, string>;

// 全局员工映射
export const employeeNameMap: EmployeeNameMap = {};

export const loadEmployeeData = async (): Promise<void> => {
  try {
    // 1. 检查缓存是否存在
    const cachedData = localStorage.getItem('employeeData');
    const cacheTime = localStorage.getItem('employeeDataCacheTime');

    // 缓存有效期（1小时）
    const cacheValid =
      cacheTime && Date.now() - Number(cacheTime) < 1 * 60 * 60 * 1000;

    if (cachedData && cacheValid) {
      // 使用缓存数据
      const data: EmployeeNameMap = JSON.parse(cachedData);
      // 填充employeeNameMap
      Object.entries(data).forEach(([key, value]) => {
        employeeNameMap[key] = value;
      });
      console.log('使用缓存的员工数据');
      return;
    }

    // 2. 没有有效缓存，请求API
    const response = await selectDeptMem();
    if (response.state === 200 && response.data) {
      // 先清空当前映射
      Object.keys(employeeNameMap).forEach(
        (key) => delete employeeNameMap[key],
      );

      // 更新内存映射
      Object.values(response.data).forEach((deptEmployees) => {
        deptEmployees.forEach((emp) => {
          // 两种格式的键都存储，以便后续查询
          employeeNameMap[emp.workId] = emp.cnName;
          // 如果员工数据中有部门ID，也可以存储部门ID_工号的组合
          if (emp.dept) {
            employeeNameMap[`${emp.dept}_${emp.workId}`] = emp.cnName;
          }
        });
      });

      // 3. 更新缓存
      localStorage.setItem('employeeData', JSON.stringify(employeeNameMap));
      localStorage.setItem('employeeDataCacheTime', Date.now().toString());
      console.log('员工数据已缓存');
    }
  } catch (error) {
    console.error('加载员工数据失败', error);
    // 可选：尝试从缓存中恢复，这里我们不做处理，因为已经在上面的缓存中处理了
  }
};

export const getEmployeeName = (key: string): string => {
  return employeeNameMap[key] || key;
};

export const getEmployeeNames = (keys: string | string[]): string => {
  if (typeof keys === 'string') {
    keys = keys.split(',').map((k) => k.trim());
  }
  return keys.map((k) => getEmployeeName(k)).join(', ');
};
