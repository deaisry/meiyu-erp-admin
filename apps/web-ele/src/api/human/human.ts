/*
 * @Author: deaisry
 * @Date: 2025-05-20 15:25:06
 * @LastEditors: e deaisry@163.com
 * @LastEditTime: 2025-05-20 17:34:51
 * @FilePath: \vue-vben-admin\apps\web-ele\src\api\human\human.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import type { HumanInfo } from '@vben/types';
import type {PageResult} from '@vben/types';

import { requestClient } from '#/api/request';

export namespace HumanApi {
  export interface HumanParam{
    id?:string;
    cName?:string;
    dept?:string;
    sex?:string;
    title?:string;
    pageNo:number;
    pageSize:number;
  }
}


/**
 * 获取人事信息
 */
export async function getHumanInfo(params: HumanApi.HumanParam) {
  const response = requestClient.post<PageResult>('/human/findList',params);
  return response;
}
