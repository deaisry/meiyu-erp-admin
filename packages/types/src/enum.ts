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
  Primary = 1,
  Junior,
  High,
  Undergraduate,
  Master,
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
    .filter((key) => isNaN(Number(key))) // 过滤掉反向映射
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
  isMarried:'已婚',
  unMarried:'未婚',
});
