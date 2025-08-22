/*
 * @Author: deaisry
 * @Date: 2025-08-03 15:51:43
 * @LastEditors: e deaisry@163.com
 * @LastEditTime: 2025-08-11 10:49:55
 * @FilePath: \meiyu-erp-admin\apps\web-ele\src\api\human\attendance.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import type { AttendanceInfo,BaseResponse,PageResult,MonthPicker } from '@vben/types';
import { requestClient } from '#/api/request';

export async function fetchAttendanceList(info: AttendanceInfo) {
  return await requestClient.post<PageResult<AttendanceInfo>>(
    '/attendanceInfo/findList',
    info,
  );
}

export async function deleteAttendaceInfo(info: AttendanceInfo){
  const request =  requestClient.delete<BaseResponse>(`/attendanceInfo/deleteById/${info.id}`, info);
  return request;
}

export async function downloadAttendace(info: MonthPicker) {
  const response = await requestClient.post<Blob>(
    '/attendanceInfo/downloadAttendance',
    info,
    {
      responseType: 'blob',
    }
  );

  // 文件名拼接
  const fileName = `考勤数据_${info.startMonth}_到_${info.endMonth}.xlsx`;

  // 生成下载
  const blob = new Blob([response], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
}
