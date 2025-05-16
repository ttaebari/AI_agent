import {
  TodoPriority,
  TodoType,
  UserSimpleResponse,
  WorkStatus,
} from "../../utils/type";

export type ProjectTodoRequest =
  | ProjectTodoRequest.ProjectTodoSave
  | ProjectTodoRequest.ProjectTodoUpdate
  | ProjectTodoRequest.ProjectTodoSearchRequest
  | ProjectTodoRequest.TodoId;
export declare namespace ProjectTodoRequest {
  export interface TodoId {
    /**
     * UUID
     * 할일의 ID
     */
    id: string;
  }

  /**
   * 프로젝트의 할일 목록 조회시 줄 수 있는 옵션
   */
  export interface ProjectTodoSearchRequest {
    /**
     * 할일의 상태(대기, 진행중, 완료, 보류)
     */
    status?: WorkStatus | null;
    /**
     * 할일의 타입(작업,이슈)
     */
    type?: TodoType | null;
    /**
     * 할일의 우선순위(낮음, 보통, 높음, 긴급)
     */
    priority?: TodoPriority | null;
    /**
     * 할일의 제목
     */
    title?: string | null;
    /**
     * 할일의 내용
     */
    content?: string | null;
    /**
     * date-time
     * 할일의 시작 날짜
     */
    startDate?: string | null;
    /**
     * date-time
     * 할일의 종료 날짜
     */
    endDate?: string | null;
    /**
     * 할일의 생성자
     */
    creator?: number | null;
    /**
     * 할일의 작업자
     */
    members?: number[];
  }

  /**
   * 프로젝트의 할일 생성에 필요한 정보 형식
   */
  export interface ProjectTodoSave {
    /**
     * 할일의 타입(작업,이슈)
     */
    type: TodoType;
    /**
     * 할일의 우선순위(낮음, 보통 , 높음, 긴급)
     */
    priority: TodoPriority;
    /**
     * 할일 제목
     */
    title: string;
    /**
     * 할일의 내용
     */
    content?: string;
    /**
     * date-time
     * 할일의 진행 기간
     */
    dueDate: string; // endDate 까지 이걸로
    /**
     * date-time
     * 할일 시작 날짜
     */
    startDate: string;
    /**
     * 할일의 유저
     */
    members?: UserSimpleResponse[];
    /**
     * UUID
     * 상위 할 일의 ID
     */
    parent?: string | null;
    /**
     * 하위 할일 정보
     */
    children?: ProjectTodoSave[];
  }

  /**
   * 할일 수정에 필요한 정보 형식
   */
  export interface ProjectTodoUpdate {
    /**
     * 할일의 타입(작업,이슈)
     */
    type?: TodoType | null;
    /**
     * 할일의 우선순위(낮음, 보통 , 높음, 긴급)
     */
    priority?: TodoPriority | null;
    /**
     * 할일의 제목
     */
    title?: string | null;
    /**
     * 할일의 내용
     */
    content?: string | null;
    /**
     * 할일의 시작 날짜
     */
    startDate?: string | null;
    /**
     * 할일의 진행 기간
     */
    dueDate?: string | null;
  }
}

export declare namespace ProjectTodoResponse {
  export interface ProjectTodoResponse {
    id: string;
    createdAt: string;
    updatedAt?: string;
    type: TodoType;
    typeName: string;
    status: WorkStatus;
    statusName: string;
    priority: TodoPriority;
    priorityName: string;
    title: string;
    content?: string;
    startDate?: string;
    dueDate?: string;
    endDate?: string;
    creator?: UserSimpleResponse;
  }
}
