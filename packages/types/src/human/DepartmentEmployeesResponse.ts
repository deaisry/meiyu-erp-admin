import type { BaseResponse } from '../base/BaseResponse';
import type { DepartmentEmployeesMap } from './HumanInfo';

interface DepartmentEmployeesResponse extends BaseResponse {
  data: DepartmentEmployeesMap;
}

export type { DepartmentEmployeesResponse };
