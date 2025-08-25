interface CustomerInfo{
  custId:string,
  custName:string,
  compAddr?:string,
  createBy?:string,
  updateBy?:string,
  createTime?:Date,
  updateTime?:Date
}

interface SupplierInfo {
  supplierId:string,
  supplierName:string,
  supplierType?:string,
  compAddr?:string,
  createBy?:string,
  updateBy?:string,
  createTime?:Date,
  updateTime?:Date
}


export type {CustomerInfo,SupplierInfo};
