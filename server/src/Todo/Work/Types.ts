import { UserSimpleResponse, WorkStatus } from "../../utils/type";

export type WorkRequest =
  | WorkRequest.TodoWorkUpdateRequest
  | WorkRequest.WorkId;

export declare namespace WorkRequest {
  export interface WorkId {
    /** 작업의 UUID형태의 ID */
    id: string;
  }
  /**
   * 작업 수정시 요청 정보 형식
   */
  export interface TodoWorkUpdateRequest {
    /** 작업의 제목 */
    title?: string | null;
    /** 작업의 내용 */
    content?: string | null;
    /** 작업의 진행률 */
    percentage?: number | null;
    /** 작업 상태(대기, 진행중, 완료, 보류) */
    status?: WorkStatus | null;
  }
}

export type WorkResponse = WorkResponse.TodoWorkResponse;
export declare namespace WorkResponse {
  export interface TodoWorkResponse {
    id: string;
    createdAt: string;
    updatedAt?: string;
    user: UserSimpleResponse;
    title: string;
    content?: string;
    percentage: number;
    orders: number;
    status: WorkStatus;
    statusName: string;
    isSub?: boolean;
  }
}
