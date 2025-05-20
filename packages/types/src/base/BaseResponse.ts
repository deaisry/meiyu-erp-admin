// 基础响应接口
interface BaseResponse<T> {
  state: number;
  message: string;
  success: boolean;
  data?: T;
}
export type { BaseResponse };
