import type { PaginationResponse } from "./PaginationResponse";

interface OverviewPaginationResult<T> extends PaginationResponse<T>{
  list: [];
}

export type {OverviewPaginationResult};
