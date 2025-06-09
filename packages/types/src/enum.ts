export enum DepartmentEnum {
  BusinessDepartment = '2', // 业务部
  EngineeringDepartment = '8', // 工程部
  FinanceDepartment = '7', // 财务部
  GeneralOffice = '1', // 总经办
  InjectionMoldingDepartment = '6', // 注塑部
  MoldDepartment = '3', // 模具部
  ProcessingDepartment = '5', // 加工部
  ProcurementDepartment = '4', // 采购部
}

export enum GenderEnum {
  Female = '0',
  Male = '1',
}

export enum EmploymentTypeEnum {
  FullTime = '1',
  Temporary = '0',
}

export enum WorkStatusEnum {
  Incumbency = '1',
  Resignation = '0',
}

export enum MarryStatusEnum {
  isMarried = '1',
  unMarried = '0',
}

export enum EducationEnum {
  High = '3',
  Junior = '2',
  Master = '5',
  Primary = '1',
  Undergraduate = '4',
}

export enum MeetingTypeEunm {
  engineer = '5',
  management = '6',
  other = '0',
  product = '2',
  quality = '3',
  supplier = '4',
  weekly = '1',
}

export enum MeetingPlaceEnum {
  floor2Room = '2',
  kjpRoom = '1',
  other = '0',
}

export enum MeetingConveneEnum {
  isConvene = '1',
  notConvene = '0',
}

export enum ItemRelaTypeEnum {
  meeting = '1',
  nothing = '0',
  order = '2',
}

// 事项类型枚举
export enum ItemTypeEnum {
  MANAGEMENT = '6',
  MOLD = '4',
  PENDING = '0',
  PROCESSING = '3',
  PRODUCTION = '2',
  PURCHASE = '1',
  QUALITY = '5',
}

// 事项类型选项 事项类型，0-待定、1-采购、2-生产、3-加工、4-模具、5-品质、6-管理
export const itemTypeOptions = createEnumOptions(ItemTypeEnum, {
  PENDING: '待定',
  PURCHASE: '采购',
  PRODUCTION: '生产',
  PROCESSING: '加工',
  MOLD: '模具',
  QUALITY: '品质',
  MANAGEMENT: '管理',
});

// 跟进状态枚举
export enum FollowStatusEnum {
  COMPLETED = '2',
  FOLLOWING = '1',
  PENDING = '0',
}

// 跟进状态选项
export const followStatusOptions = createEnumOptions(FollowStatusEnum, {
  PENDING: '待跟进',
  FOLLOWING: '跟进中',
  COMPLETED: '已完成',
});

type EnumOption<T extends number | string> = {
  label: string;
  value: T;
};

type EnumOptionsConfig<T extends Record<string, any>> = {
  [K in keyof T]: EnumOption<T[K]>;
};

// 通用选项生成函数（带严格类型检查）
export function createEnumOptions<T extends Record<string, any>>(
  enumObj: T,
  labelMap: Record<keyof T, string>,
): EnumOption<T[keyof T]>[] {
  return Object.keys(enumObj)
    .filter((key) => Number.isNaN(Number(key))) // 过滤掉反向映射
    .map((key) => ({
      label: labelMap[key as keyof T],
      value: enumObj[key as keyof T],
    }));
}

// ------------------------- 选项配置 -------------------------
// 部门选项
export const departmentOptions = createEnumOptions(DepartmentEnum, {
  GeneralOffice: '总经办',
  BusinessDepartment: '业务部',
  MoldDepartment: '模具部',
  ProcurementDepartment: '采购部',
  ProcessingDepartment: '加工部',
  InjectionMoldingDepartment: '注塑部',
  FinanceDepartment: '财务部',
  EngineeringDepartment: '工程部',
});
export const itemRelaTypeOptions = createEnumOptions(ItemRelaTypeEnum, {
  nothing: '无关联',
  meeting: '会议关联',
  order: '订单关联',
});

// 性别选项
export const genderOptions = createEnumOptions(GenderEnum, {
  Male: '男',
  Female: '女',
});

// 用工类型选项
export const employmentTypeOptions = createEnumOptions(EmploymentTypeEnum, {
  FullTime: '正式工',
  Temporary: '临时工',
});

// 在职状态选项
export const workStatusOptions = createEnumOptions(WorkStatusEnum, {
  Incumbency: '在职',
  Resignation: '离职',
});

// 学历
export const educationOptions = createEnumOptions(EducationEnum, {
  Primary: '小学',
  Junior: '初中',
  High: '高中',
  Undergraduate: '本科',
  Master: '硕士',
});

// 学历
export const marryOptions = createEnumOptions(MarryStatusEnum, {
  isMarried: '已婚',
  unMarried: '未婚',
});

// 会议类型：0-其他会议、1-每周工作总结会议、2-生产/品质物料会议、3-品质改进小组会议、4-每月供应商周期评审、5-工程会议、6-管理模式推行会议
export const meetingTypeOptions = createEnumOptions(MeetingTypeEunm, {
  other: '其他会议',
  weekly: '每周工作总结会议',
  product: '生产/品质物料会议',
  quality: '品质改进小组会议',
  supplier: '每月供应商周期评审',
  engineer: '工程会议',
  management: '管理模式推行会议',
});

export const meetingPlaceOptions = createEnumOptions(MeetingPlaceEnum, {
  other: '其他',
  kjpRoom: '一楼会议室',
  floor2Room: '二楼会议室',
});

export const meetingConveneOptions = createEnumOptions(MeetingConveneEnum, {
  notConvene: '未召开',
  isConvene: '已召开',
});

export const departmentNameMap = Object.fromEntries(
  departmentOptions.map((opt) => [opt.value, opt.label]),
) as Record<`${DepartmentEnum}`, string>;
