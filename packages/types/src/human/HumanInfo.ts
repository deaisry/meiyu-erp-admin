/*
 * @Author: deaisry
 * @Date: 2025-05-20 15:25:46
 * @LastEditors: e deaisry@163.com
 * @LastEditTime: 2025-05-20 17:48:01
 * @FilePath: \vue-vben-admin\packages\types\src\human.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
// 人事信息主体
interface HumanInfo {
  id: string;
  attendanceId: null | string;
  dept: string;
  cnName: string;
  sex: '0' | '1'; // 0-女，1-男
  idNbr: string;
  edu: string;
  nativePlace: string;
  ethnicGroup: string;
  isMarried: '0' | '1'; // 0-未婚，1-已婚
  title: string;
  employeeType: string;
  enterDate: string; // ISO 日期格式
  phone: string;
  address: string;
  birthday: string; // ISO 日期格式
  createBy: null | string;
  updateBy: null | string;
  createTime: string; // 日期时间格式
  updateTime: string; // 日期时间格式
  pageNo?: number; // 分页参数（可选）
  pageSize?: number;
}
export type { HumanInfo };

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
