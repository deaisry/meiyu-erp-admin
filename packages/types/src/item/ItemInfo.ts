import type { ItemRelaInfo } from './ItemRelaInfo';

interface ItemInfo {
  itemId?: string;
  comment?: string;
  completeTime: string;
  dept?: string;
  followStatus?: string;
  follower?: string;
  itemName?: string;
  itemType?: string;
  progress?: number;
  realType?: string;
  relaId?: string;
  relaInfoList?: ItemRelaInfo[];
  createBy: null | string;
  updateBy: null | string;
  createTime: string; // 日期时间格式
  updateTime: string; // 日期时间格式
  pageNo?: number; // 分页参数（可选）
  pageSize?: number;
}
export type { ItemInfo };
