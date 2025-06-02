// 会议信息
interface MeetingInfo {
  meetingId: string;
  meetingName: string;
  isConvene: '0' | '1'; // 0-女，1-男
  meetingTime: string; // ISO 日期格式
  meetingType: string;
  pariticipants: string;
  meetingPlace: string;
  comment: string;
  createBy: null | string;
  updateBy: null | string;
  createTime: string; // 日期时间格式
  updateTime: string; // 日期时间格式
  pageNo?: number; // 分页参数（可选）
  pageSize?: number;
}
export type { MeetingInfo };
