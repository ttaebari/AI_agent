export type WithKey<T, K extends string, V = string> = T & {
  [P in K]: V;
};

/**
 * 프로젝트 ID
 */
export type WithProjectId<T> = WithKey<T, "projectId", string>;

/**
 * 할일 ID
 */
export type WithTodoId<T> = WithKey<T, "todoId", string>;

/**
 * 작업 ID
 */
export type WithWorkId<T> = WithKey<T, "workId", string>;

/**
 * 유저 정보
 */
export interface UserSimpleResponse {
  id: number;
  email?: string | null;
  name?: string | null;
}

/**
 * 관리자 : ADMIN
 * 맴버 : MEMBER
 */
export type MemberRole = "ADMIN" | "MEMBER";

/**
 * TASK : 할일
 * ISSUE : 이슈
 */
export type TodoType = "TASK" | "ISSUE";

/**
 * LOW : 낮음
 * MEDIUM : 보통
 * HIGH : 높음
 * CRITICAL : 긴급
 */
export type TodoPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

/**
 * waiting : 해야 할 일
 * in_progress : 진행중
 * completed : 완료
 * cancelled : 보류
 */
export type WorkStatus = "WAITING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
