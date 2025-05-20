interface PaginationParams<Q = Record<string, unknown>> {
  // 分页参数
  current: number; // 当前页码 (从1开始)
  size: number; // 每页数量

  // 查询条件 (动态字段)
  query?: Q; // 可选查询条件对象

  // 排序参数 (可选)
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
}
export type { PaginationParams };
