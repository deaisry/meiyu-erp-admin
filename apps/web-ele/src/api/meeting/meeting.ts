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

