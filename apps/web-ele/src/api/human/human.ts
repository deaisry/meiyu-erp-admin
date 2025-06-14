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

export function processFormParams<T extends Record<string, any>>(
  formValues: T,
  fields: (keyof T)[]
): T {
  // 1. 创建原始对象的浅拷贝，避免修改原始对象
  const processedParams: T = { ...formValues };
  if(!fields) return processedParams;
  // 2. 遍历需要处理的字段
  fields.forEach(field => {
    // 3. 获取字段值
    const fieldValue = processedParams[field];

    // 4. 仅处理数组类型的值
    if (Array.isArray(fieldValue)) {
      // 5. 处理每个元素并生成新的数组
      const processedIds = fieldValue.map(item => {
        // 确保元素转换为字符串
        const strValue = String(item);

        // 尝试按 _ 分割
        const parts = strValue.split('_');

        // 如果包含 _ 分割符，取最后一个部分作为ID
        if (parts.length > 1) {
          return parts[parts.length - 1];
        }

        // 没有 _ 的情况下，尝试提取纯数字
        const digitsOnly = strValue.replaceAll(/\D/g, '');

        // 如果提取到数字就返回，否则返回原始字符串
        return digitsOnly || strValue;
      });

      // 6. 更新处理后的参数
      (processedParams as any)[field] = processedIds.join(',');
    }
  });

  // 7. 返回处理后的对象
  return processedParams;
}
