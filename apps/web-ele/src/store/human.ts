/*
 * @Author: deaisry
 * @Date: 2025-05-15 10:50:48
 * @LastEditors: e deaisry@163.com
 * @LastEditTime: 2025-05-19 18:01:04
 * @FilePath: \vue-vben-admin\apps\web-ele\src\store\auth.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import type { Recordable, HumanInfo } from '@vben/types';

import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { LOGIN_PATH } from '@vben/constants';
import { preferences } from '@vben/preferences';
import { resetAllStores, useAccessStore, useUserStore } from '@vben/stores';

import { ElNotification } from 'element-plus';
import { defineStore } from 'pinia';
import {getUserInfoApi, loginApi, logoutApi } from '#/api';
import { $t } from '#/locales';

