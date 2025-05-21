interface BasePagination {
  total: number
  size: number
  current: number
  pages: number
  orders: any[] // 建议用更精确的类型替换
  optimizeCountSql: boolean
  hitCount: boolean
  countId: string | null
  maxLimit: number | null
  searchCount: boolean
}

export type {BasePagination}
