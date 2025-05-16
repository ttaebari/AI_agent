import { WithWorkId } from "../../utils/type";
import { ProjectRequest } from "../Project/Types";
import { WorkRequest, WorkResponse } from "./Types";

export class WorkService {
  constructor(
    private accessToken: string,
    private server_url: string,
  ) {}

  /**
   * 해당 프로젝트에 내에 나의 작업을 조회합니다.
   * @param id 조회할 프로젝트 ID
   * @returns 나의 작업
   */
  public async getMyWorksInProject(
    props: ProjectRequest.ProjectId,
  ): Promise<WorkResponse.TodoWorkResponse[]> {
    const projectid = encodeURIComponent(props.id);
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
  public async updateWork(
    props: WithWorkId<WorkRequest.TodoWorkUpdateRequest>,
  ): Promise<boolean> {
    const { workId, ...rest } = props;
    const response = await fetch(
      `${this.server_url}/api/v1/todo-works/${workId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rest),
      },
    );
    return response.ok;
  }
}
