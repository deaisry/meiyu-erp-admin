export function mapEnumValue<T extends string | number>(
  options: Array<{ value: T; label: string }>,
  value: T | undefined,
  defaultLabel: string = 'N/A'
): string {
  // 处理空值情况
  if (value === undefined || value === null) return defaultLabel

  // 查找匹配项
  const found = options.find(opt => opt.value === value)

  // 返回结果或默认值
  return found?.label ?? defaultLabel
}
