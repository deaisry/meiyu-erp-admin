import type { PaginationResponse, HumanInfo, DeptCount} from "@vben/types";

interface HumanApiResponse extends PaginationResponse<HumanInfo> {
  deptList: DeptCount[]
}
export type { HumanApiResponse };
