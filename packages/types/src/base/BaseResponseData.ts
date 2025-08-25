import type { BaseResponse } from '@vben/types';

interface BaseResponseData<T> extends BaseResponse{
  data: T[]
}
export type {BaseResponseData};
