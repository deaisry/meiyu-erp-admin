// 员工部门信息接口
interface EmployeeDeptInfo {
  workId?: string;
  cnName?: string;
  dept?: string;
}

export type { EmployeeDeptInfo };

export type DepartmentEmployeesMap = {
  [dept: string]: EmployeeDeptInfo[];
};
