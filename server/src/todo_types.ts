/**
 * Represents a single Todo item.
 */
export interface ITodo {
  /** 구분을 위한 인덱스 */
  Uid: number;
  /** 할일을 하는 사람의 이름 */
  name: string;
  /** 실제로 해야할 일 */
  content: string;
  /** 완료했는지 여부 */
  completed: boolean;
  /** 할 일을 끝내야하는 목표 날짜 (날짜만 추출)*/
  goal: string;
}

/**
 * Payload for creating a new Todo item.
 */
export interface CreateTodoPayload {
  /** 할일을 만들 때 필수요소 **/
  name: string;
  content: string;
  goal: string;
}

/**
 * Payload for finding a specific Todo by its ID.
 */
export interface FindTodoPayload {
  /** Unique identifier for the Todo */
  Uid: number;
}

export interface FindGoalPayload {
  /** Goal date to search for */
  goal: string;
}

/**
 * Payload for toggling the completion status of a Todo.
 */
export interface ToggleTodoPayload {
  /** Unique identifier for the Todo */
  Uid: number;
}

/**
 * Payload for removing a specific Todo.
 */
export interface RemoveTodoPayload {
  /** Unique identifier for the Todo */
  Uid: number;
}
