import { WithTodoId } from "../../utils/type";
import { ProjectTodoRequest, ProjectTodoResponse } from "./Types";

export class ProjectTodoService {
  constructor(
    private accessToken: string,
    private server_url: string,
  ) {}

  /**
   * 특정 할일을 삭제합니다.
   * @param id 삭제할 할일 ID
   * @returns 할일 삭제 결과
   */
  public async deleteTodo(id: ProjectTodoRequest.TodoId): Promise<boolean> {
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

  /**
   * 특정 할일을 수정하는 메서드입니다.
   * @param props 수정할 할일 데이터
   * @param props.id 수정할 할일 ID
   * @returns 할일 수정 결과
   */
  public async updateTodo(
    props: WithTodoId<ProjectTodoRequest.ProjectTodoUpdate>,
  ): Promise<boolean> {
    const { todoId, ...rest } = props;
    const response = await fetch(
      `${this.server_url}/api/v1/project-todos/${todoId}`,
      {
        method: "PUT",
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
   * 특정 할일에 하위 할일를 추가합니다.
   * @param props 하위 할일 데이터
   * @param props.id 추가할 할일 ID
   * @returns 하위 할일 추가 결과
   */
  public async addSubTodoOnTodo(
    props: WithTodoId<ProjectTodoRequest.ProjectTodoSave>,
  ): Promise<boolean> {
    const { todoId, ...rest } = props;
    const response = await fetch(
      `${this.server_url}/api/v1/project-todos/${todoId}/sub`,
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
   * 특정 하위 할일를 삭제합니다.
   * @param id 삭제할 하위 할일 ID
   * @returns 하위 할일 삭제 결과
   */
  public async deleteSubTodo(id: ProjectTodoRequest.TodoId): Promise<boolean> {
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
}
