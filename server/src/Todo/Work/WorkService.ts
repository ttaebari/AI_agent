import { ProjectId, TodoWorkResponse, TodoWorkUpdateRequest } from "./Types";

export class WorkService {
  private accessToken: string;
  private server_url: string;

  constructor(accessToken: string, server_url: string) {
    this.server_url = server_url;
    this.accessToken = accessToken;
  }

  /**
   * 해당 프로젝트에 내에 작업을 조회합니다.
   * @param id 조회할 프로젝트 ID
   * @returns 나의 작업
   */
  public async getMyWorksInProject(id: ProjectId): Promise<TodoWorkResponse[]> {
    const projectid = encodeURIComponent(id.id);
    const response = await fetch(
      `${this.server_url}/api/v1/projects/${projectid}/works`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );
    const data = await response.json();
    return data;
  }

  /**
   * 특정 작업을 수정합니다.
   * @param props 수정할 작업 데이터
   * @param props.id 수정할 작업 ID
   * @returns 작업 수정 결과
   */
  public async updateWork(props: TodoWorkUpdateRequest): Promise<boolean> {
    const todoData = {
      id: props.id,
      title: props.title,
      content: props.content,
      percentage: props.percentage,
      status: props.status,
    };
    const response = await fetch(
      `${this.server_url}/api/v1/todo-works/${todoData.id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(todoData),
      },
    );
    return response.ok;
  }
}
