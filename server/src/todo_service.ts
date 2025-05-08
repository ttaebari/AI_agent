import {
  CreateTodoPayload,
  FindGoalPayload,
  FindTodoPayload,
  ITodo,
  RemoveTodoPayload,
  ToggleTodoPayload,
} from "./todo_types";

/**
 * Service for managing Todo items in-memory.
 * Provides methods to create, find, list, toggle, and remove Todos.
 */
export class TodoService {
  private static server_url: string = "http://localhost:3001";
  private static U_Id = 1;

  /**
   * Creates a name's new Todo item that name should do.
   * 명령의 포멧은 "'name'이 'content'를 'goal'까지 하기" 아니면 "'name'이 'content'를 'goal'에 하기입니다.
   * @param props - Object containing the content and goal of the Todo
   * goal은 YYYY-MM-DD 형식으로 입력해야 합니다. 만약 아니라면 YYYY-MM-DD 형식으로 바꾸기.
   * @returns The newly created Todo item
   */
  public async create(props: CreateTodoPayload): Promise<ITodo> {
    const todo: ITodo = {
      Uid: TodoService.U_Id++,
      name: props.name,
      content: props.content,
      completed: false,
      goal: props.goal,
    };

    // api
    try {
      const response = await fetch(`${TodoService.server_url}/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(todo),
      });

      if (!response.ok) {
        throw new Error("Failed to send Todo to server");
      }
    } catch (error) {
      console.error("Error sending Todo to server:", error);
    }

    return todo;
  }

  /**
   * Lists all Todo items.
   * @returns An array of all Todo items
   */
  public async GetAllTodolist(): Promise<ITodo[]> {
    const response = await fetch(`${TodoService.server_url}/todos`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch Todos from server");
    }
    const result = (await response.json()) as ITodo[];
    return result;
  }

  /**
   * Finds a specific Uid's Todo item.
   * @param props - Object containing the name that who should do the Todo
   * @returns The found Todo or null if not found
   */
  public async findByUid(props: FindTodoPayload): Promise<ITodo> {
    const Uid = props.Uid;
    const response = await fetch(`${TodoService.server_url}/todos/${Uid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to send Todo to server");
    }
    const result = (await response.json()) as ITodo;
    return result;
  }

  /**
   * 입력 포멧이 '목표 날짜가 'date' 이전인 todo 찾아줘' 형태야.
   * 날짜인 date가 목표 날짜보다 크거나 같은 걸 찾는 메소드
   * 날짜는 YYYY-MM-DD 형식으로 입력해야 합니다 아니라면 YYYY-MM-DD 형식으로 바꾸기.
   * @param props date를 포함 이 날짜보다 작거나 같은 Todo를 찾는 메소드
   */
  public async findByDate(props: FindGoalPayload): Promise<ITodo[]> {
    // date는 YYYY-MM-DD 형식으로 바뀌어야함.
    const date = props.goal;

    const response = await fetch(
      `${TodoService.server_url}/todos/filter?date=${date}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    if (!response.ok) {
      throw new Error("Failed to send Todo to server");
    }
    const result = (await response.json()) as ITodo[];
    return result;
  }

  /**
   * Toggles the completion status of a name's Todo item.
   * @throws Error if the Todo is not found
   */
  public async toggle(props: ToggleTodoPayload): Promise<ITodo[]> {
    const Uid = props.Uid;
    const response = await fetch(
      `${TodoService.server_url}/todos/${Uid}/toggle`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to update Todo on server");
    }

    const result = (await response.json()) as ITodo[];
    return result;
  }

  /**
   * Removes a Uid번째 Todo item.
   * @param props - Object containing Todo that name does to remove
   * @throws Error if the Todo is not found
   */
  public async remove(props: RemoveTodoPayload): Promise<void> {
    const Uid = props.Uid;
    const response = await fetch(`${TodoService.server_url}/todos/${Uid}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to remove Todo from server");
    }
  }

  /**
   * remove all Todo items.
   * @throws Error if the Todo is not found
   */
  public async removeAll(): Promise<void> {
    const response = await fetch(`${TodoService.server_url}/alltodos`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to remove all Todos from server");
    }
  }

  /**
   * Find the todo lists that has not completed.
   * @returns An array of completed Todo items
   */
  public async report(): Promise<ITodo[]> {
    const response = await fetch(`${TodoService.server_url}/todos/report`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to generate report");
    }
    const result = (await response.json()) as ITodo[];
    return result;
  }

  /**
   * 사용자가 할일 홈페이지 보여줘 라고 요청했을 때 쓰는 메소드
   * @returns 사용자가 할일 홈페이지 URL
   */
  public async goTodoPage(): Promise<string> {
    return "https://broanex.ncpworkplace.com/v/home/";
  }
}
