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
  other = '0',
  weekly = '1',
  product = '2',
  quality = '3',
  supplier = '4',
  engineer = '5',
  management = '6',
}

export enum MeetingPlaceEnum{
  other = '0',
  kjpRoom = '1',
  floor2Room = '2',
}

export enum MeetingConveneEnum{
  notConvene = '0',
  isConvene = '1',
}

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
export const meetingTypeOptions = createEnumOptions(MeetingTypeEunm,{
  other:'其他会议',
  weekly:'每周工作总结会议',
  product:'生产/品质物料会议',
  quality:'品质改进小组会议',
  supplier:'每月供应商周期评审',
  engineer:'工程会议',
  management:'管理模式推行会议',
})

export const meetingPlaceOptions = createEnumOptions(MeetingPlaceEnum,{
  other : '其他',
  kjpRoom : '一楼会议室',
  floor2Room:'二楼会议室'
})

export const meetingConveneOptions = createEnumOptions(MeetingConveneEnum,{
  notConvene:'未召开',
  isConvene:'已召开'
})


export const departmentNameMap = Object.fromEntries(
  departmentOptions.map(opt => [opt.value, opt.label])
) as Record<`${DepartmentEnum}`, string>;
