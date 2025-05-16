import { EventRequest, EventResponse } from "./Types";

export class EventService {
  private accessToken: string;
  private server_url: string;

  constructor(accessToken: string, server_url: string) {
    this.server_url = server_url;
    this.accessToken = accessToken;
  }

  /**
   * 이벤트의 목록을 조회합니다.
   * @param search 조회할 이벤트의 검색 조건
   * @param search.yearMonth 조회할 이벤트의 연도와 월, YYYY-MM 형식
   * @returns 이벤트의 목록
   */
  public async listEvents(
    search: EventRequest.EventSearchRequest,
  ): Promise<EventResponse[]> {
    const params = new URLSearchParams({ yearMonth: search.yearMonth });
    const response = await fetch(
      `${this.server_url}/api/v1/events?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response.json();
  }

  /**
   * 특정 이벤트를 상세 조회합니다
   * @param id 조회할 이벤트의 ID
   * @returns 특정 id의 이벤트
   */
  public async retrieveEvent(id: EventRequest.EventId): Promise<EventResponse> {
    const eventid = encodeURIComponent(id.id);
    const response = await fetch(
      `${this.server_url}/api/v1/events/${eventid}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response.json();
  }

  /**
   * 이벤트를 생성해 추가합니다.
   * title, startDate, endDate, participants는 필수입니다.
   * @param props 추가할 이벤트의 데이터
   * @returns 추가된 이벤트
   */
  public async createEvent(
    props: EventRequest.EventCreateRequest,
  ): Promise<EventResponse> {
    const eventData = {
      title: props.title, //필수
      startDate: props.startDate, //필수
      endDate: props.endDate, //필수
      description: props.description, //선택
      participants: props.participants, //필수
    };
    const response = await fetch(`${this.server_url}/api/v1/events`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    });
    return response.json();
  }

  /**
   * 특정 이벤트를 수정합니다.
   * @param props 수정할 이벤트의 데이터
   * @param props.id 수정할 이벤트 ID
   * @returns 수정된 이벤트
   */
  public async updateEvent(
    props: EventRequest.EventUpdateRequest,
  ): Promise<EventResponse> {
    const eventData = {
      id: props.id, //event id(필수)
      title: props.title,
      start: props.start,
      end: props.end,
      description: props.description,
      added: props.added,
      removed: props.removed,
    };
    const response = await fetch(
      `${this.server_url}/api/v1/events/${eventData.id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      },
    );
    return response.json();
  }

  /**
   * 특정 이벤트를 삭제합니다.
   * @param id 삭제할 이벤트의 ID
   * @returns 삭제된 이벤트
   */
  public async deleteEvent(id: EventRequest.EventId): Promise<EventResponse> {
    const eventid = encodeURIComponent(id.id);
    const response = await fetch(
      `${this.server_url}/api/v1/events/${eventid}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response.json();
  }
}
