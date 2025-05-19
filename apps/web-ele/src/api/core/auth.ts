/*
 * @Author: deaisry
 * @Date: 2025-05-15 10:50:48
 * @LastEditors: e deaisry@163.com
 * @LastEditTime: 2025-05-19 11:48:15
 * @FilePath: \vue-vben-admin\apps\web-ele\src\api\core\auth.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import { baseRequestClient, requestClient } from '#/api/request';

export namespace AuthApi {
  /** 登录接口参数 */
  export interface LoginParams {
    passWord: string;
    username?: string;
    userId:string;
  }

  /** 登录接口返回值 */
  export interface LoginResult {
    state:number;
    message:string;
    accessToken:string;
    userId: string;
    success:boolean
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
  try {
    const response = await requestClient.post<AuthApi.LoginResult>('/userBasicInfo/login',data);
  return response;
  } catch (error) {
    throw error;
  }
  // return requestClient.post<AuthApi.LoginResult>('/userBasicInfo/login', data);
}

/**
 * 刷新accessToken
 */
export async function refreshTokenApi() {
  return baseRequestClient.post<AuthApi.RefreshTokenResult>('/userBasicInfo/refresh', {
    withCredentials: true,
  });
}

/**
 * 退出登录
 */
export async function logoutApi() {
  return baseRequestClient.post('/userBasicInfo/logout', {
    withCredentials: true,
  });
}

// /**
//  * 获取用户权限码
//  */
// export async function getAccessCodesApi() {
//   return requestClient.get<string[]>('/auth/codes');
// }
