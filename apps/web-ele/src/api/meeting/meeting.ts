/*
 * @Author: deaisry
 * @Date: 2025-06-02 16:52:38
 * @LastEditors: e deaisry@163.com
 * @LastEditTime: 2025-06-05 20:57:13
 * @FilePath: \meiyu-erp-admin\apps\web-ele\src\api\meeting\meeting.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import type {
  BaseResponseData,
  MeetingInfo,
  PaginationParams,
  PaginationResponse,
} from '@vben/types';

import { requestClient } from '#/api/request';

export async function fetchMeetingList(
  params: PaginationParams<PaginationResponse<MeetingInfo>>,
) {
  const response = await requestClient.post<PaginationResponse<MeetingInfo>>(
    '/meetingInfo/findList',
    params,
  );
  return response;
}

export async function submitMeetingInfo(data: MeetingInfo) {
  // participants打横用逗号隔开
  const processedData = { ...data };
  // 处理participants字段
  if (Array.isArray(processedData.participants)) {
    processedData.participants = processedData.participants
      .filter((item) => {
        // 过滤掉部门节点（以 dept_ 开头的值）
        const str = String(item);
        return !str.startsWith('dept_');
      })
      .map((item) => {
        // 提取员工姓名 (格式: 部门ID_员工姓名)
        const parts = String(item).split('_');
        // 取第一个下划线之后的所有部分
        return parts.slice(1).join('_');
      })
      .join('，'); // 使用中文逗号拼接
  }
  // 确保participants是字符串类型
  if (typeof processedData.participants !== 'string') {
    processedData.participants = '';
  }
  debugger;
  const response = await requestClient.post<BaseResponseData>(
    '/meetingInfo/insertOrUpdate',
    processedData,
  );
  return response;
}

export async function fetchMeetingDetail(data: string) {
  const param: MeetingInfo = { meetingId: data };
  const response = await requestClient.post<BaseResponseData>(
    '/meetingInfo/findById',
    param,
  );
  return response;
}
