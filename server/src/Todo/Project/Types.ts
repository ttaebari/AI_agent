import {
  MemberRole,
  TodoPriority,
  TodoType,
  UserSimpleResponse,
  WorkStatus,
} from "../../utils/type";

/**
 * 프로젝트 요청 정보
 */
export type ProjectRequest =
  | ProjectRequest.ProjectSearchRequest
  | ProjectRequest.ProjectMemberDelete
  | ProjectRequest.ProjectMemberSave
  | ProjectRequest.ProjectSave
  | ProjectRequest.ProjectUpdate
  | ProjectRequest.ProjectId;
export declare namespace ProjectRequest {
  /**
   * 프로젝트 목록 조회시 줄 수 있는 옵션
   */
  export interface ProjectSearchRequest {
    /**
     * 프로젝트 이름
     */
    name?: string | null;
    /**
     * 프로젝트 공개여부
     */
    isPublic?: boolean | null;
    /**
     * 프로젝트 완료 여부
     */
    completed?: boolean | null;
    /**
     * date
     * 프로젝트 시작 날짜
     */
    startDate?: string | null;
    /**
     * date
     * 프로젝트 종료 날짜
     */
    endDate?: string | null;
  }

  /**
   * 프로젝트의 멤버 삭제 요청 형식
   */
  export interface ProjectMemberDelete {
    /**
     * 프로젝트의 삭제할 멤버 ID
     */
    memberId: number;
  }

  /**
   * 프로젝트에 있는 유저 정보 형식
   */
  export interface ProjectMemberSave {
    /**
     * 유저의  ID
     */
    id: number;
  }

  /**
   * 프로젝트 생성에 필요한 정보 형식
   */
  export interface ProjectSave {
    /**
     *  프로젝트의 이름
     */
    name: string;
    /**
     * 프로젝트의 설명
     */
    description?: string | null;
    /**
     * 프로젝트의 공개 여부
     */
    isPublic: boolean;
    /**
     * date
     * 프로젝트의 시작 날짜
     */
    startDate: string;
    /**
     * date
     * 프로젝트이 종료 날짜
     */
    endDate: string;
    /**
     * 프로젝트에 추가할 유저 정보
     */
    members: ProjectMemberSave[];
  }

  /**
   * 프로젝트 수정에 필요한 정보 형식
   */
  export interface ProjectUpdate {
    /**
     * 프로젝트의 이름
     */
    name?: string | null;
    /**
     * 프로젝트의 설명
     */
    description?: string | null;
    /**
     * 프로젝트의 공개 여부
     */
    isPublic?: boolean | null;
    /**
     * date
     * 프로젝트의 시작 날짜
     */
    startDate?: string | null;
    /**
     * date
     * 프로젝트이 종료 날짜
     */
    endDate?: string | null;
  }

  /**
   * 프로젝트를 조작할 때 필요한 프로젝트 id
   */
  export interface ProjectId {
    /**
     * UUID
     * 프로젝트의  ID
     */
    id: string;
  }
}

export type ProjectResponse =
  | ProjectResponse.ProjectResponse
  | ProjectResponse.ProjectMemberResponse
  | ProjectResponse.ProjectTodoDetailedResponse
  | ProjectResponse.ProjectTodoResponse
  | ProjectResponse.TodoWorkResponse;
export declare namespace ProjectResponse {
  export interface ProjectResponse {
    id: string;
    createdAt: string;
    updatedAt?: string;
    name: string;
    description?: string;
    isPublic: boolean;
    completed: boolean;
    startDate: string;
    endDate?: string;
    creator?: UserSimpleResponse;
  }

  export interface ProjectMemberResponse {
    id: number;
    user?: UserSimpleResponse;
    role: MemberRole;
    roleName: string;
  }

  export interface ProjectTodoDetailedResponse {
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
    works: TodoWorkResponse[];
    isRoot: boolean;
    project: ProjectResponse;
    parent?: ProjectTodoResponse;
    children: ProjectTodoDetailedResponse[];
  }

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
