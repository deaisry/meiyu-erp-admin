/*
 * @Author: deaisry
 * @Date: 2025-06-02 16:52:38
 * @LastEditors: e deaisry@163.com
 * @LastEditTime: 2025-06-03 11:41:38
 * @FilePath: \meiyu-erp-admin\apps\web-ele\src\api\meeting\meeting.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import type {
  BaseResponse,
  MeetingInfo,
  PaginationResponse,
  PaginationParams,
} from '@vben/types';

import { requestClient } from '#/api/request';

export async function fetchMeetingList(
  params: PaginationParams<PaginationResponse<MeetingInfo>>,
) {
  const response = await requestClient.post<
    PaginationResponse<MeetingInfo>
  >('/meetingInfo/findList', params);
  return response;
}

export async function submitMeetingInfo(data: MeetingInfo) {
  const response = await requestClient.post<BaseResponse>(
    '/meetingInfo/insertOrUpdate',
    data,
  );
  return response;
}

