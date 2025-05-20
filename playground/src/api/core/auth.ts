/*
 * @Author: deaisry
 * @Date: 2025-05-15 10:50:49
 * @LastEditors: e deaisry@163.com
 * @LastEditTime: 2025-05-20 09:27:31
 * @FilePath: \vue-vben-admin\playground\src\api\core\auth.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
/*
 * @Author: deaisry
 * @Date: 2025-05-15 10:50:49
 * @LastEditors: e deaisry@163.com
 * @LastEditTime: 2025-05-16 09:07:08
 * @FilePath: \vue-vben-admin\playground\src\api\core\auth.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import { baseRequestClient, requestClient } from '#/api/request';

export namespace AuthApi {
  /** 登录接口参数 */
  export interface LoginParams {
    password?: string;
    username?: string;
  }

  /** 登录接口返回值 */
  export interface LoginResult {
    accessToken: string;
  }

  export interface RefreshTokenResult {
    data: string;
    status: number;
  }
}

/**
 * 登录
 */
export async function loginApi(data: AuthApi.LoginParams) {
  return requestClient.post<AuthApi.LoginResult>('/userBasicInfo/login', data, {
    withCredentials: true,
  });
}

/**
 * 刷新accessToken
 */
export async function refreshTokenApi() {
  return baseRequestClient.post<AuthApi.RefreshTokenResult>(
    '/auth/refresh',
    null,
    {
      withCredentials: true,
    },
  );
}

/**
 * 退出登录
 */
export async function logoutApi() {
  return baseRequestClient.post('/auth/logout', null, {
    withCredentials: true,
  });
}

/**
 * 获取用户权限码
 */
export async function getAccessCodesApi() {
  return requestClient.get<string[]>('/auth/codes');
}
