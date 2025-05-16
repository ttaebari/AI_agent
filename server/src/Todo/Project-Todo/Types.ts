/**
 * 프로젝트의 할일 생성에 필요한 정보 형식
 */
export interface ProjectTodoSave {
  /** 프로젝트의 UUID형태의 ID */
  id: string;
  /** 할일의 타입(작업,이슈) */
  type: TodoType;
  /** 할일의 작업 상태(대기, 진행중, 완료, 보류) */
  priority: TodoPriority;
  /** 할일 제목 */
  title: string;
  /** 할일의 내용 */
  content?: string;
  /** 할일 시작 날짜 */
  startDate?: string;
  /** 할일의 진행 기간*/
  dueDate?: string;
  /** 할일의 종료 날짜 */
  endDate?: string;
  /** 할일의 유저 */
  members: UserSimpleResponse[];
  /**상위 할 일의 UUID형태의 ID */
  parent?: string;
  /** 하위 할일 정보 */
  children?: ProjectTodoSave[];
}

/**
 * 할일 수정에 필요한 정보 형식
 */
export interface ProjectTodoUpdate {
  /** 할일의 UUID형태의 ID */
  id: string;
  /** 할일의 타입(작업,이슈) */
  type?: TodoType;
  /** 할일의 우선순위(낮음, 보통 , 높음, 긴급) */
  priority?: TodoPriority;
  /** 할일의 제목 */
  title?: string;
  /** 할일의 내용 */
  content?: string;
  /** 할일의 시작 날짜 */
  startDate?: string;
  /** 할일의 진행 기간*/
  dueDate?: string;
  /** 할일의 종료 날짜 */
  endDate?: string;
}

/**
 * 프로젝트의 응답 정보 형식
 */
export interface ProjectResponse {
  /** 프로젝트의 UUID형태의 ID */
  id: string;
  /** 프로젝트의 생성 날짜 */
  createdAt: string;
  /** 프로젝트의 수정 날짜 */
  updatedAt?: string;
  /** 프로젝트의 이름 */
  name: string;
  /** 프로젝트의 설명 */
  description?: string;
  /** 프로젝트의 공개 여부 */
  isPublic: boolean;
  /** 프로젝트의 완료 여부 */
  completed: boolean;
  /** 프로젝트의 시작 날짜 */
  startDate: string;
  /** 프로젝트의 종료 날짜 */
  endDate?: string;
  /** 프로젝트의 생성자 */
  creator?: UserSimpleResponse;
}

/**
 * 할일 응답 정보 형식
 */
export interface ProjectTodoResponse {
  /** 할일의 UUID형태의 ID */
  id: string;
  /** 할일의 생성 날짜 */
  createdAt: string;
  /** 할일의 수정 날짜 */
  updatedAt?: string;
  /** 할일의 타입(작업,이슈) */
  type: TodoType;
  /** 할일의 타입 이름 */
  typeName: string;
  /** 할일의 작업 상태(대기, 진행중, 완료, 보류) */
  status: WorkStatus;
  /** 할일의 작업 상태 이름 */
  statusName: string;
  /** 할일의 우선순위(낮음, 보통, 높음, 긴급) */
  priority: TodoPriority;
  /** 할일의 우선순위 이름 */
  priorityName: string;
  /** 할일의 제목 */
  title: string;
  /** 할일의 내용 */
  content?: string;
  /** 할일의 시작 날짜 */
  startDate?: string;
  /** 할일의 진행 기간*/
  dueDate?: string;
  /** 할일의 종료 날짜 */
  endDate?: string;
  /** 할일의 생성자 */
  creator?: UserSimpleResponse;
}

/**
 * 프로젝트의 작업 조회에 응답 정보 형식
 */
export interface TodoWorkResponse {
  /** 프로젝트 UUID형태의 ID */
  id: string;
  /** 작업의 생성 날짜 */
  createdAt: string;
  /** 작업의 수정 날짜 */
  updatedAt?: string;
  /** 작업을 하는 유저 */
  user: UserSimpleResponse;
  /** 작업의 제목 */
  title: string;
  /** 작업의 내용 */
  content?: string;
  /** 작업의 진행률 */
  percentage: number;
  /** 작업의 순서 */
  orders: number;
  /** 작업 상태(대기, 진행중, 완료, 보류) */
  status: WorkStatus;
  /** 작업 상태 이름 */
  statusName: string;
  isSub?: boolean;
}
/**
 * 할일에 조작에 유저의 정보
 */
export interface UserTodoSimpleResponse {
  /** 유저가 있는 할일의 UUID형태의 ID */
  Tid: string;
  /** 유저의 ID */
  id: number;
  /** 유저의 이메일 */
  email?: string;
  /** 유저의 이름 */
  name?: string;
}

/**
 * 유저의 정보
 */
export interface UserSimpleResponse {
  /** 유저의 ID */
  id: number;
  /** 유저의 이메일 */
  email?: string;
  /** 유저의 이름 */
  name?: string;
}

/**
 * 관리자 : ADMIN
 * 맴버 : MEMBER
 */
export type MemberRole = "ADMIN" | "MEMBER";
export const MemberRoleInfo: Record<MemberRole, { displayName: string }> = {
  ADMIN: { displayName: "관리자" },
  MEMBER: { displayName: "맴버" },
};

/**
 * TASK : 할일
 * ISSUE : 이슈
 */
export type TodoType = "TASK" | "ISSUE";
export const TodoTypeInfo: Record<TodoType, { displayName: string }> = {
  TASK: { displayName: "할일" },
  ISSUE: { displayName: "이슈" },
};

/**
 * LOW : 낮음
 * MEDIUM : 보통
 * HIGH : 높음
 * CRITICAL : 긴급
 */
export type TodoPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export const TodoPriorityInfo: Record<TodoPriority, { displayName: string }> = {
  LOW: { displayName: "낮음" },
  MEDIUM: { displayName: "보통" },
  HIGH: { displayName: "높음" },
  CRITICAL: { displayName: "긴급" },
};

/**
 * waiting : 해야 할 일
 * in_progress : 진행중
 * completed : 완료
 * cancelled : 보류
 */
export type WorkStatus = "WAITING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
export const WorkStatusInfo: Record<
  WorkStatus,
  { displayName: string; color: string }
> = {
  WAITING: { displayName: "대기", color: "#E2E8F0" },
  IN_PROGRESS: { displayName: "진행중", color: "#3B82F6" },
  COMPLETED: { displayName: "완료", color: "#22C55E" },
  CANCELLED: { displayName: "보류", color: "#94A3B8" },
};

export interface TodoId {
  /** 할일의 UUID형태의 ID */
  id: string;
}
