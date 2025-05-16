/**
 * 이벤트를 조회할 때 필요한 정보
 */
export interface EventSearchRequest {
  /** 조회할 이벤트의 연도와 월, YYYY-MM 형식 */
  yearMonth: string;
}

/**
 * 이벤트를 생성할 때 필요한 정보
 */
export interface EventCreateRequest {
  /** 생성할 이벤트의 제목 */
  title: string;
  /** 생성할 이벤트의 시작 날짜 */
  startDate: string;
  /** 생성할 이벤트의 종료 날짜 */
  endDate: string;
  /** 생성할 이벤트의 설명 */
  description?: string;
  /** 생성할 이벤트의 참여자 목록 */
  participants: EventParticipantCreateRequest[];
}

/**
 * 이벤트의 참여하고 있는 유저 정보
 */
export interface EventParticipantCreateRequest {
  /** 참여한 유저의 ID */
  userId: number;
}

/**
 * 이벤트의 참여자 삭제 요청 정보
 */
export interface EventParticipantDeleteRequest {
  /** 삭제할 참여자의 UUID형태의 ID */
  id: string;
}

/**
 * 이벤트를 수정할 때 필요한 정보
 */
export interface EventUpdateRequest {
  /** 수정할 이벤트의 UUID형태의 ID */
  id: string;
  /** 이벤트의 수정할 제목 */
  title?: string;
  /** 이벤트의 수정할 시작 날짜 */
  start?: string;
  /** 이벤트의 수정할 종료 날짜 */
  end?: string;
  /** 이벤트의 수정할 설명 */
  description?: string;
  /** 수정할 이벤트의 추가할 참여자 목록 */
  added?: EventParticipantCreateRequest[];
  /** 수정할 이벤트의 삭제할 참여자 목록 */
  removed?: EventParticipantDeleteRequest[];
}

/**
 * 이벤트의 상세 조회 응답 정보
 */
export interface EventResponse {
  /** 이벤트의 UUID형태의 ID */
  id: string;
  /** 이벤트의 제목 */
  title: string;
  /** 이벤트의 시작 날짜 */
  start: string;
  /** 이벤트의 종료 날짜 */
  end: string;
  /** 이벤트의 설명 */
  description?: string;
  /** 이벤트를 만든 사람 */
  creator: UserSimpleResponse;
  /** 이벤트의 참여자 */
  participants: EventParticipantResponse[];
}

/**
 * 이벤트 참여자 응답 정보
 */
export interface EventParticipantResponse {
  /** 참여자의 UUID형태의 ID */
  id: string;
  /** 유저의 정보 */
  user: UserSimpleResponse;
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
 * 이벤트를 조작할 때 필요한 이벤트 id 정보
 */
export interface EventId {
  /** 이벤트의 UUID형태의 ID */
  id: string;
}
