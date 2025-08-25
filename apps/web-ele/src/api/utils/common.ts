/*
 * @Author: deaisry
 * @Date: 2025-06-05 16:01:57
 * @LastEditors: e deaisry@163.com
 * @LastEditTime: 2025-08-25 16:30:10
 * @FilePath: \meiyu-erp-admin\apps\web-ele\src\api\utils\common.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import { requestClient } from '#/api/request';
import type { BaseResponseData,CustomerInfo,SupplierInfo } from '@vben/types';

/**
 * 客户下拉列表
 */
async function fetchCustList(){

  const response = await requestClient.get<BaseResponseData<string>>(`/custBasicInfo/nameList`);
  return response;
}

/**
 * 供应商下拉列表
 */
async function fetchSupplierList(){

  const response = await requestClient.get<BaseResponseData<string>>(`/supplier/nameList`);
  return response;
}

