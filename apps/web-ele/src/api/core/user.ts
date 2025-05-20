/*
 * @Author: deaisry
 * @Date: 2025-05-15 10:50:48
 * @LastEditors: e deaisry@163.com
 * @LastEditTime: 2025-05-19 18:00:31
 * @FilePath: \vue-vben-admin\apps\web-ele\src\api\core\user.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import type { UserInfo } from '@vben/types';

import { requestClient } from '#/api/request';
export namespace UserApi {
  export interface UserIdParam{
    userId:string;
  }
}
/**
 * 获取用户信息
 */
export async function getUserInfoApi() {
  return requestClient.get<UserInfo>('/userBasicInfo/info');
}
