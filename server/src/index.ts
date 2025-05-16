import { Agentica, IAgenticaHistoryJson } from "@agentica/core";
import {
  AgenticaRpcService,
  IAgenticaRpcListener,
  IAgenticaRpcService,
} from "@agentica/rpc";
import OpenAI from "openai";
import { WebSocketServer } from "tgrid";
import typia, { Primitive } from "typia";

import { SGlobal } from "./SGlobal";
import { EventService } from "./Todo/Event/EventService";
import { ProjectTodoService } from "./Todo/Project-Todo/ProjectTodoService";
import { ProjectService } from "./Todo/Project/ProjectService";
import { WorkService } from "./Todo/Work/WorkService";
import { UserService } from "./Todo/user/UserService";
import { COMMON_PROMPT } from "./prompts/common";
import { TODO_PROMPT } from "./prompts/todo";
import { TodoService } from "./todo_service";
import { WeatherService } from "./weather_service";

const getPromptHistories = async (
  userid: string,
  roomNumber: number,
): Promise<Primitive<IAgenticaHistoryJson>[]> => {
  // GET PROMPT HISTORIES FROM DATABASE
  userid;
  roomNumber;
  console.log(roomNumber);
  return [];
};

const SERVER_URLS = {
  TODO_MANAGMENT_APP: `https://todo-api.neulgo.com`,
};

const main = async (): Promise<void> => {
  if (SGlobal.env.OPENAI_API_KEY === undefined)
    console.error("env.OPENAI_API_KEY is not defined.");

  const server: WebSocketServer<
    { users: string; roomid: number },
    IAgenticaRpcService<"chatgpt">,
    IAgenticaRpcListener
  > = new WebSocketServer();
  await server.open(Number(SGlobal.env.PORT), async (acceptor) => {
    const header = acceptor.header;
    const { users, roomid } = header;
    const driver = acceptor.getDriver();
    console.log("user and roomNumber", users, roomid);
    const accessToken = SGlobal.env.ACCESS_TOKEN;
    // const url: URL = new URL(`http://localhost${acceptor.path}`);
    const agent: Agentica<"chatgpt"> = new Agentica({
      model: "chatgpt",
      config: {
        locale: "ko",
        executor: {},
        systemPrompt: {
          common(_) {
            return `
              ${COMMON_PROMPT}
              ${TODO_PROMPT}
            `;
          },
        },
      },
      vendor: {
        api: new OpenAI({ apiKey: SGlobal.env.OPENAI_API_KEY }),
        model: "gpt-4o-mini",
      },
      controllers: [
        // {
        //   protocol: "class",
        //   name: "To Do service",
        //   application: typia.llm.application<TodoService, "chatgpt">(),
        //   execute: new TodoService(),
        // },
        // {
        //   protocol: "class",
        //   name: "Weather service",
        //   application: typia.llm.application<WeatherService, "chatgpt">(),
        //   execute: new WeatherService(),
        // },
        {
          protocol: "class",
          name: "이벤트 처리 관련 클래스",
          application: typia.llm.application<EventService, "chatgpt">(),
          execute: new EventService(
            accessToken,
            SERVER_URLS.TODO_MANAGMENT_APP,
          ),
        },
        {
          protocol: "class",
          name: "프로젝트 처리 관련 & 프로젝트 할일 추가 조회 클래스",
          application: typia.llm.application<ProjectService, "chatgpt">(),
          execute: new ProjectService(
            accessToken,
            SERVER_URLS.TODO_MANAGMENT_APP,
          ),
        },
        {
          protocol: "class",
          name: "할일과 하위할일 수정 삭제 관련 클래스",
          application: typia.llm.application<ProjectTodoService, "chatgpt">(),
          execute: new ProjectTodoService(
            accessToken,
            SERVER_URLS.TODO_MANAGMENT_APP,
          ),
        },
        {
          protocol: "class",
          name: "작업 수정 관련 클래스",
          application: typia.llm.application<WorkService, "chatgpt">(),
          execute: new WorkService(accessToken, SERVER_URLS.TODO_MANAGMENT_APP),
        },
        {
          protocol: "class",
          name: "유저 조회 관련 클래스",
          application: typia.llm.application<UserService, "chatgpt">(),
          execute: new UserService(accessToken, SERVER_URLS.TODO_MANAGMENT_APP),
        },
      ],
      histories: await getPromptHistories(users, roomid),
    });
    const service: AgenticaRpcService<"chatgpt"> = new AgenticaRpcService({
      agent,
      listener: driver,
    });
    await acceptor.accept(service);
  });
};
main().catch(console.error);
