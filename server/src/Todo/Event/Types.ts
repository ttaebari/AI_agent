import { UserSimpleResponse } from "../../utils/type";

export type EventRequest =
  | EventRequest.EventSearchRequest
  | EventRequest.EventCreateRequest
  | EventRequest.EventUpdateRequest
  | EventRequest.EventId;
export declare namespace EventRequest {
  export interface Mapper {
    search: EventSearchRequest;
    create: EventCreateRequest;
    update: EventUpdateRequest;
    id: EventId;
  }

  /**
   * 이벤트를 조회할 때 필요한 정보
   */
  export type EventSearchRequest = {
    /**
     * YYYY-MM
     * 연도와 월
     */
    yearMonth: string;
  };

  /**
   * 이벤트의 참여하고 있는 유저 정보
   */
  export type EventParticipantCreateRequest = {
    /**
     * 참여한 유저의 ID
     */
    userId: number;
  };

  /**
   * 이벤트를 생성할 때 필요한 정보
   */
  export type EventCreateRequest = {
    /**
     * 이벤트의 제목
     */
    title: string;
    /**
     * date-time
     * 이벤트의 시작 날짜
     */
    startDate: string;
    /**
     * date-time
     * 이벤트의 종료 날짜
     */
    endDate: string;
    /**
     * 이벤트의 설명
     */
    description?: string | null;
    /**
     * 이벤트의 참여자 목록
     */
    participants: EventParticipantCreateRequest[];
  };

  /**
   * 이벤트의 참여자 삭제 요청 정보
   */
  export type EventParticipantDeleteRequest = {
    /**
     * UUID
     * 참여자의 ID
     */
    id: string;
  };

  /**
   * 이벤트를 수정할 때 필요한 정보
   */
  export type EventUpdateRequest = {
    /**
     * UUID
     * 수정할 이벤트의 ID
     */
    id: string;
    /**
     * 수정할 이벤트의 제목
     */
    title?: string;
    /**
     * date-time
     * 수정할 이벤트의 시작 날짜
     */
    start?: string;
    /**
     * date-time
     * 수정할 이벤트의 종료 날짜
     */
    end?: string;
    /**
     * 수정할 이벤트의 설명
     */
    description?: string | null;
    /**
     * 추가할 참여자 목록
     */
    added?: EventParticipantCreateRequest[];
    /**
     * 제거할 참여자 목록
     */
    removed?: EventParticipantDeleteRequest[];
  };

  /**
   * 이벤트의 ID
   */
  export type EventId = {
    /**
     * UUID
     * 이벤트의 ID
     */
    id: string;
  };
}

export type EventResponse =
  | EventResponse.EventResponse
  | EventResponse.EventParticipantResponse;
export declare namespace EventResponse {
  export interface EventResponse {
    id: string;
    title: string;
    start: string;
    end: string;
    description?: string;
    creator: UserSimpleResponse;
    participants: EventParticipantResponse[];
  }

  export interface EventParticipantResponse {
    id: string;
    user: UserSimpleResponse;
  }
}
