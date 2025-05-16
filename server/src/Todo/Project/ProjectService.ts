import { WithProjectId } from "../../utils/type";
import { ProjectTodoRequest } from "../Project-Todo/Types";
import { ProjectRequest, ProjectResponse } from "./Types";

export class ProjectService {
  constructor(
    private accessToken: string,
    private server_url: string,
  ) {}

  /**
   * 전체 프로젝트의 목록을 조회합니다.
   * @param props 조회할 프로젝트의 검색 조건
   * @returns 프로젝트의 목록
   */
  public async getProjects(
    props: ProjectRequest.ProjectSearchRequest,
  ): Promise<ProjectResponse[]> {
    const queryParams = new URLSearchParams();

    Object.entries(props).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    const response = await fetch(
      `${this.server_url}/api/v1/projects?${queryParams.toString()}`,
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
   * 나의 프로젝트를 조회합니다.
   * @returns 나의 프로젝트
   */
  public async getMyProject(): Promise<ProjectResponse.ProjectResponse[]> {
    const response = await fetch(`${this.server_url}/api/v1/projects/my`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.json();
  }

  /**
   * 프로젝트를 생성해 추가합니다.
   *
   * @param props 추가할 프로젝트의 데이터
   * @returns 생성후 추가된 프로젝트 ID
   */
  public async saveProject(props: ProjectRequest.ProjectSave): Promise<string> {
    const response = await fetch(`${this.server_url}/api/v1/projects`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...props,
        isPublic: props.isPublic || true,
        members: props.members.map((member) => ({
          user: {
            id: member.id,
          },
          role: "MEMBER",
        })),
      }),
    });
    return response.json();
  }

  /**
   * 특정 프로젝트를 수정합니다.
   * @param props 수정할 프로젝트 데이터
   * @param props.id 수정할 프로젝트 ID
   * @returns 수정 성공 여부
   */
  public async updateProject(
    props: WithProjectId<ProjectRequest.ProjectUpdate>,
  ): Promise<boolean> {
    const { projectId, ...rest } = props;
    const response = await fetch(
      `${this.server_url}/api/v1/projects/${projectId}`,
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

  /**
   * 특정 프로젝트를 삭제합니다.
   * @param id 삭제할 프로젝트의 ID
   * @returns 삭제 성공 여부
   */
  public async deleteProject(id: ProjectRequest.ProjectId): Promise<boolean> {
    const projectid = encodeURIComponent(id.id);
    const response = await fetch(
      `${this.server_url}/api/v1/projects/${projectid}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response.ok;
  }

  /**
   * 특정 프로젝트를 완료 처리합니다.
   * @param id 완료 처리할 프로젝트의 ID
   * @returns 완료 처리 성공 여부
   */
  public async completeProject(id: ProjectRequest.ProjectId): Promise<boolean> {
    const projectid = encodeURIComponent(id.id);
    const response = await fetch(
      `${this.server_url}/api/v1/projects/${projectid}/complete`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response.ok;
  }

  /**
   * 특정 프로젝트의 멤버를 조회합니다.
   * @param id 조회할 프로젝트의 ID
   * @returns 프로젝트 멤버 목록
   */
  public async getMembers(
    id: ProjectRequest.ProjectId,
  ): Promise<ProjectResponse.ProjectMemberResponse[]> {
    const projectid = encodeURIComponent(id.id);
    const response = await fetch(
      `${this.server_url}/api/v1/projects/${projectid}/members`,
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
   * 특정 프로젝트에 멤버를 추가합니다.
   * 존재하는 프로젝트에 멤버를 추가할 때 사용합니다.
   * @param props 추가할 프로젝트의 데이터
   * @param props.id 추가할 프로젝트의 ID
   * @returns 추가 성공 여부
   */
  public async addMembers(
    props: WithProjectId<ProjectRequest.ProjectMemberSave>,
  ): Promise<boolean> {
    const body = {
      projectId: props.projectId,
      user: {
        id: props.id,
      },
      role: "MEMBER",
    };
    const { projectId, ...rest } = body;
    const response = await fetch(
      `${this.server_url}/api/v1/projects/${projectId}/members`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rest),
      },
    );
    return response.ok;
  }

  /**
   * 특정 프로젝트의 멤버를 삭제합니다.
   * @param props 삭제할 프로젝트의 데이터
   * @param props.id 삭제할 프로젝트의 ID
   * @returns 삭제 성공 여부
   */
  public async deleteMember(
    props: WithProjectId<ProjectRequest.ProjectMemberDelete>,
  ): Promise<boolean> {
    const { projectId, memberId } = props;
    const response = await fetch(
      `${this.server_url}/api/v1/projects/${projectId}/members/${memberId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response.ok;
  }

  /**
   * 해당 프로젝트 내의 할일 목록을 조회합니다.
   * @param props 조회할 프로젝트의 검색 조건
   * @param props.id 조회할 프로젝트의 ID
   * @returns 프로젝트 할일 목록
   */
  public async getAllTodos(
    props: WithProjectId<ProjectTodoRequest.ProjectTodoSearchRequest>,
  ): Promise<ProjectResponse.ProjectTodoDetailedResponse[]> {
    const { projectId, members, ...rest } = props;
    const queryParams = new URLSearchParams();

    Object.entries(rest).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    if (Array.isArray(members) && members.length > 0) {
      members.forEach((member) =>
        queryParams.append("members", member.toString()),
      );
    }

    const url = `${this.server_url}/api/v1/projects/${projectId}/todos/all?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
      },
    });

    return response.json();
  }

  /**
   * 특정 프로젝트의 할일을 생성해 추가합니다.
   * @param props 추가할 할일의 데이터
   * @param props.id 추가할 프로젝트의 ID
   * @returns 생성후 추가 성공 여부
   */
  public async addTodo(
    props: WithProjectId<ProjectTodoRequest.ProjectTodoSave>,
  ): Promise<boolean> {
    const { projectId, ...rest } = props;

    const response = await fetch(
      `${this.server_url}/api/v1/projects/${projectId}/todos`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...rest,
          endDate: rest.dueDate,
        }),
      },
    );
    return response.ok;
  }

  /**
   * 특정 프로젝트의 업데이트를 삭제합니다.
   * @param id 삭제 처리할 업데이트의 ID
   * @returns 삭제 처리 성공 여부
   */
  public async getProjectUpdateDelete(
    id: ProjectRequest.ProjectId,
  ): Promise<string> {
    const projectid = encodeURIComponent(id.id);
    const response = await fetch(
      `${this.server_url}/api/v1/projects/${projectid}/delete`,
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

  /**
   * 삭제된 프로젝트를 복구합니다.
   * @param id 복구할 프로젝트의 ID
   * @returns 복구한 프로젝트의 ID
   */
  public async rollbackProject(id: ProjectRequest.ProjectId): Promise<string> {
    const projectid = encodeURIComponent(id.id);
    const response = await fetch(
      `${this.server_url}/api/v1/projects/${projectid}/rollback`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response.json();
  }
}
