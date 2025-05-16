import {
  ProjectId,
  ProjectMemberDelete,
  ProjectMemberResponse,
  ProjectMemberSave,
  ProjectResponse,
  ProjectSave,
  ProjectSearchRequest,
  ProjectTodoDetailedResponse,
  ProjectTodoSave,
  ProjectUpdate,
  TodoSearchRequest,
  TodoWorkResponse,
} from "./Types";

export class ProjectService {
  private accessToken: string;
  private server_url: string;

  constructor(accessToken: string, server_url: string) {
    this.server_url = server_url;
    this.accessToken = accessToken;
  }

  // /**
  //  * 전체 프로젝트의 목록을 조회합니다.
  //  * @param props 조회할 프로젝트의 검색 조건
  //  * @returns 프로젝트의 목록
  //  */
  // public async getProjects(
  //   props: ProjectSearchRequest,
  // ): Promise<ProjectResponse[]> {
  //   const queryParams = new URLSearchParams();

  //   if (props.name) queryParams.append("name", props.name);
  //   if (props.isPublic !== undefined)
  //     queryParams.append("isPublic", String(props.isPublic));
  //   if (props.completed !== undefined)
  //     queryParams.append("completed", String(props.completed));
  //   if (props.startDate) queryParams.append("startDate", props.startDate); // "YYYY-MM-DD"
  //   if (props.endDate) queryParams.append("endDate", props.endDate);
  //   const response = await fetch(
  //     `${this.server_url}/api/v1/projects?${queryParams.toString()}`,
  //     {
  //       method: "GET",
  //       headers: {
  //         Authorization: `Bearer ${this.accessToken}`,
  //         "Content-Type": "application/json",
  //       },
  //     },
  //   );
  //   return response.json();
  // }

  /**
   * 나의 프로젝트를 조회합니다.
   * @returns 나의 프로젝트
   */
  public async getMyProject(): Promise<ProjectResponse[]> {
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
   * name, isPublic, startDate, members는 필수입니다.
   * @param props 추가할 프로젝트의 데이터
   * @returns 생성후 추가된 프로젝트 ID
   */
  public async saveProject(props: ProjectSave): Promise<ProjectId> {
    const projectData = {
      name: props.name, // 필수
      description: props.description, //선택
      isPublic: props.isPublic, // 필수
      startDate: props.startDate, // 필수
      endDate: props.endDate, // 선택
      members: props.members, // 필수
    };
    const response = await fetch(`${this.server_url}/api/v1/projects`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projectData),
    });
    return response.json();
  }

  /**
   * 특정 프로젝트를 수정합니다.
   * @param props 수정할 프로젝트 데이터
   * @param props.id 수정할 프로젝트 ID
   * @returns 수정 성공 여부
   */
  public async updateProject(props: ProjectUpdate): Promise<boolean> {
    const projectData = {
      id: props.id,
      name: props.name,
      description: props.description,
      isPublic: props.isPublic,
      startDate: props.startDate,
      endDate: props.endDate,
    };
    const response = await fetch(
      `${this.server_url}/api/v1/projects/${projectData.id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      },
    );
    return response.ok;
  }

  // /**
  //  * 특정 프로젝트를 삭제합니다.
  //  * @param id 삭제할 프로젝트의 ID
  //  * @returns 삭제 성공 여부
  //  */
  // public async deleteProject(id: ProjectId): Promise<boolean> {
  //   const projectid = encodeURIComponent(id.id);
  //   const response = await fetch(
  //     `${this.server_url}/api/v1/projects/${projectid}`,
  //     {
  //       method: "DELETE",
  //       headers: {
  //         Authorization: `Bearer ${this.accessToken}`,
  //         "Content-Type": "application/json",
  //       },
  //     },
  //   );
  //   return response.ok;
  // }

  // /**
  //  * 특정 프로젝트를 완료 처리합니다.
  //  * @param id 완료 처리할 프로젝트의 ID
  //  * @returns 완료 처리 성공 여부
  //  */
  // public async completeProject(id: ProjectId): Promise<boolean> {
  //   const projectid = encodeURIComponent(id.id);
  //   const response = await fetch(
  //     `${this.server_url}/api/v1/projects/${projectid}/complete`,
  //     {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${this.accessToken}`,
  //         "Content-Type": "application/json",
  //       },
  //     },
  //   );
  //   return response.ok;
  // }

  /**
   * 특정 프로젝트의 멤버를 조회합니다.
   * @param id 조회할 프로젝트의 ID
   * @returns 프로젝트 멤버 목록
   */
  public async getMembers(id: ProjectId): Promise<ProjectMemberResponse[]> {
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
  public async addMembers(props: ProjectMemberSave): Promise<boolean> {
    const projectData = {
      id: props.id, // 프로젝트 ID
      user: props.user,
      role: props.role,
    };
    const response = await fetch(
      `${this.server_url}/api/v1/projects/${projectData.id}/members`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      },
    );
    return response.ok;
  }

  // /**
  //  * 특정 프로젝트의 멤버를 삭제합니다.
  //  * @param props 삭제할 프로젝트의 데이터
  //  * @param props.id 삭제할 프로젝트의 ID
  //  * @returns 삭제 성공 여부
  //  */
  // public async deleteMember(props: ProjectMemberDelete): Promise<boolean> {
  //   const projectData = {
  //     id: props.id, // 프로젝트 ID
  //     memberId: props.memberId,
  //   };
  //   const response = await fetch(
  //     `${this.server_url}/api/v1/projects/${projectData.id}/members/${projectData.memberId}`,
  //     {
  //       method: "DELETE",
  //       headers: {
  //         Authorization: `Bearer ${this.accessToken}`,
  //         "Content-Type": "application/json",
  //       },
  //     },
  //   );
  //   return response.ok;
  // }

  /**
   * 해당 프로젝트의 할일 목록을 조회합니다.
   * 예시) 특정 프로젝트의 내 할일 목록 조회해줘
   * @param props 조회할 프로젝트의 검색 조건
   * @param props.id 조회할 프로젝트의 ID
   * @returns 프로젝트 할일 목록
   */
  public async getAllTodos(
    props: TodoSearchRequest,
  ): Promise<ProjectTodoDetailedResponse[]> {
    const {
      id, // 프로젝트 ID
      status,
      type,
      priority,
      title,
      content,
      startDate,
      endDate,
      creator,
      members,
    } = props;

    const queryParams = new URLSearchParams();

    if (status !== null && status !== undefined)
      queryParams.append("status", status);
    if (type !== null && type !== undefined) queryParams.append("type", type);
    if (priority !== null && priority !== undefined)
      queryParams.append("priority", priority);
    if (title !== null && title !== undefined)
      queryParams.append("title", title);
    if (content !== null && content !== undefined)
      queryParams.append("content", content);
    if (startDate !== null && startDate !== undefined)
      queryParams.append("startDate", startDate);
    if (endDate !== null && endDate !== undefined)
      queryParams.append("endDate", endDate);
    if (creator !== null && creator !== undefined)
      queryParams.append("creator", creator.toString());
    if (members !== null && members !== undefined && members.length > 0) {
      members.forEach((member) =>
        queryParams.append("members", member.toString()),
      );
    }

    const url = `${this.server_url}/api/v1/projects/${id}/todos/all?${queryParams.toString()}`;

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
   * type, priority, title은 필수입니다.
   * @param props 추가할 할일의 데이터
   * @param props.id 추가할 프로젝트의 ID
   * @returns 생성후 추가 성공 여부
   */
  public async addTodo(props: ProjectTodoSave): Promise<boolean> {
    const todoData = {
      id: props.id, // 프로젝트 ID(필수)
      type: props.type, // 필수
      priority: props.priority, // 필수
      title: props.title, // 필수
      content: props.content, // 선택
      dueDate: props.dueDate, // 선택
      startDate: props.startDate, // 선택
      endDate: props.endDate, //선택
      members: props.members, // 선택
      parent: props.parent, //선택
      children: props.children, //선택
    };
    const response = await fetch(
      `${this.server_url}/api/v1/projects/${todoData.id}/todos`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(todoData),
      },
    );
    return response.ok;
  }

  // /**
  //  * 특정 프로젝트의 업데이트를 삭제합니다.
  //  * @param id 삭제 처리할 업데이트의 ID
  //  * @returns 삭제 처리 성공 여부
  //  */
  // public async getProjectUpdateDelete(id: ProjectId): Promise<ProjectId> {
  //   const projectid = encodeURIComponent(id.id);
  //   const response = await fetch(
  //     `${this.server_url}/api/v1/projects/${projectid}/delete`,
  //     {
  //       method: "DELETE",
  //       headers: {
  //         Authorization: `Bearer ${this.accessToken}`,
  //         "Content-Type": "application/json",
  //       },
  //     },
  //   );
  //   return response.json();
  // }

  // /**
  //  * 삭제된 프로젝트를 복구합니다.
  //  * @param id 복구할 프로젝트의 ID
  //  * @returns 복구한 프로젝트의 ID
  //  */
  // public async rollbackProject(id: ProjectId): Promise<ProjectId> {
  //   const projectid = encodeURIComponent(id.id);
  //   const response = await fetch(
  //     `${this.server_url}/api/v1/projects/${projectid}/rollback`,
  //     {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${this.accessToken}`,
  //         "Content-Type": "application/json",
  //       },
  //     },
  //   );
  //   return response.json();
  // }
}
