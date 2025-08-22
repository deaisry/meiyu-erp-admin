// 物料价格信息
interface MaterialPriceInfo {
  id?: number;
  materialId: string;
  priceConfirmDate: Date;
  materialName?: string;
  unit?: '1' | '2' | '3';
  unitPriceFree: number;
  unitPriceDuty: number;
  supplier?: string;
  customer?: string;
  currency?: '1' | '2' | '3';
  materialType?: string;
  unitWeightCustoms?: number;
  remark?: string;
  createBy?: string;
  updateBy?: string;
  createTime?: Date;
  updateTime?: Date;
  unitPrice?: number;
  rawType?: string;
}

export type { MaterialPriceInfo };
