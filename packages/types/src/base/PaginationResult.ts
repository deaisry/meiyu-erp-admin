interface PaginationResult<T> {
  records: T[];
  total: number;
  size: number;
  pages: number;
  current: number;
}
export type { PaginationResult };
