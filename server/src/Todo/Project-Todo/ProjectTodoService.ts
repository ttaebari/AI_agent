import {
  ProjectTodoSave,
  ProjectTodoUpdate,
  TodoId,
  UserTodoSimpleResponse,
} from "./Types";

export class ProjectTodoService {
  private accessToken: string;
  private server_url: string;

  constructor(accessToken: string, server_url: string) {
    this.server_url = server_url;
    this.accessToken = accessToken;
  }

  /**
   * 특정 할일을 삭제합니다.
   * @param id 삭제할 할일 ID
   * @returns 할일 삭제 결과
   */
  public async deleteTodo(id: TodoId): Promise<boolean> {
    const todoid = encodeURIComponent(id.id);
    const response = await fetch(
      `${this.server_url}/api/v1/project-todos/${todoid}`,
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

  // /**
  //  * 특정 할일을 수정하는 메서드입니다.
  //  * @param props 수정할 할일 데이터
  //  * @param props.id 수정할 할일 ID
  //  * @returns 할일 수정 결과
  //  */
  // public async updateTodo(props: ProjectTodoUpdate): Promise<boolean> {
  //   const todoData = {
  //     id: props.id, //todo ID
  //     type: props.type,
  //     priority: props.priority,
  //     title: props.title,
  //     content: props.content,
  //     dueDate: props.dueDate,
  //     startDate: props.startDate,
  //     endDate: props.endDate,
  //   };
  //   const response = await fetch(
  //     `${this.server_url}/api/v1/project-todos/${todoData.id}`,
  //     {
  //       method: "PUT",
  //       headers: {
  //         Authorization: `Bearer ${this.accessToken}`,
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(todoData),
  //     },
  //   );
  //   return response.ok;
  // }

  /**
   * 특정 할일에 하위 할일를 추가합니다.
   * @param props 하위 할일 데이터
   * @param props.id 추가할 할일 ID
   * @returns 하위 할일 추가 결과
   */
  public async addSubTodoOnTodo(props: ProjectTodoSave): Promise<boolean> {
    const subTodoData = {
      id: props.id, //todo ID
      type: props.type,
      priority: props.priority,
      title: props.title,
      content: props.content,
      dueDate: props.dueDate,
      startDate: props.startDate,
      endDate: props.endDate,
      members: props.members,
      parent: props.parent,
      children: props.children,
    };
    const response = await fetch(
      `${this.server_url}/api/v1/project-todos/${subTodoData.id}/sub`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subTodoData),
      },
    );
    return response.ok;
  }

  /**
   * 특정 하위 할일를 삭제합니다.
   * @param id 삭제할 하위 할일 ID
   * @returns 하위 할일 삭제 결과
   */
  public async deleteSubTodo(id: TodoId): Promise<boolean> {
    const todoid = encodeURIComponent(id.id);
    const response = await fetch(
      `${this.server_url}/api/v1/project-todos/${todoid}/sub`,
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
   * 특정 할일에 유저를 배정합니다.
   * @param props 유저 배정 데이터
   * @param props.Tid 유저를 배정할 할일 ID
   * @returns 유저 배정 결과
   */
  public async addUserOnTodo(props: UserTodoSimpleResponse): Promise<boolean> {
    const userData = {
      Tid: props.Tid, //todo ID
      id: props.id, //user ID
      email: props.email,
      name: props.name,
    };
    const response = await fetch(
      `${this.server_url}/api/v1/project-todos/${userData.Tid}/works`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      },
    );
    return response.ok;
  }

  // /**
  //  * 특정 할일에 유저를 제거합니다.
  //  * @param props 제거할 유저 데이터
  //  * @param props.Tid 유저를 배정할 할일 ID
  //  * @returns 유저 제거 결과
  //  */
  // public async deleteUserOnTodo(
  //   props: UserTodoSimpleResponse,
  // ): Promise<boolean> {
  //   const userData = {
  //     Tid: props.Tid, //todo ID
  //     id: props.id, //user ID
  //     email: props.email,
  //     name: props.name,
  //   };
  //   const response = await fetch(
  //     `${this.server_url}/api/v1/project-todos/${userData.Tid}/works`,
  //     {
  //       method: "DELETE",
  //       headers: {
  //         Authorization: `Bearer ${this.accessToken}`,
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(userData),
  //     },
  //   );
  //   return response.ok;
  // }
}
