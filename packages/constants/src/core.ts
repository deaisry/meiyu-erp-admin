/*
 * @Author: deaisry
 * @Date: 2025-05-15 10:50:48
 * @LastEditors: e deaisry@163.com
 * @LastEditTime: 2025-05-15 15:37:52
 * @FilePath: \vue-vben-admin\packages\constants\src\core.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
/**
 * @zh_CN 登录页面 url 地址
 */
export const LOGIN_PATH = '/userBasicInfo/login';

export interface LanguageOption {
  label: string;
  value: 'en-US' | 'zh-CN';
}

/**
 * Supported languages
 */
export const SUPPORT_LANGUAGES: LanguageOption[] = [
  {
    label: '简体中文',
    value: 'zh-CN',
  },
  {
    label: 'English',
    value: 'en-US',
  },
];
