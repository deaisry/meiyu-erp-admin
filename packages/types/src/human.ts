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
  attendanceId: string | null;
  dept: string;
  cnName: string;
  sex: '0' | '1'; // 根据数据示例 0/1 表示性别
  idNbr: string;
  edu: string;
  nativePlace: string;
  ethnicGroup: string;
  isMarried: '0' | '1'; // 根据数据示例 0/1 表示婚否
  title: string;
  employeeType: string;
  enterDate: string;
  phone: string;
  address: string;
  birthday: string;
  createBy?: string | null;
  updateBy?: string | null;
  createTime: string;
  updateTime: string;
  pageNo?: number; // 分页参数（通常不需要在前端使用）
  pageSize?: number;
}export type {HumanInfo}
