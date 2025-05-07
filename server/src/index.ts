import {
  Agentica,
  AgenticaHistory,
  IAgenticaHistoryJson,
} from "@agentica/core";
import {
  AgenticaRpcService,
  IAgenticaRpcListener,
  IAgenticaRpcService,
} from "@agentica/rpc";
import OpenAI from "openai";
import { WebSocketServer } from "tgrid";
import typia, { Primitive } from "typia";

import { SGlobal } from "./SGlobal";
import { TodoService } from "./todo_service";
import { WeatherService } from "./weather_service";

const getPromptHistories = async (
  userid: string,
  roomNumber: number,
): Promise<Primitive<IAgenticaHistoryJson>[]> => {
  // GET PROMPT HISTORIES FROM DATABASE
  userid;
  roomNumber;
  return [];
};

const main = async (): Promise<void> => {
  if (SGlobal.env.OPENAI_API_KEY === undefined)
    console.error("env.OPENAI_API_KEY is not defined.");

  const server: WebSocketServer<
    { user: string; roomNumber: number },
    IAgenticaRpcService<"chatgpt">,
    IAgenticaRpcListener
  > = new WebSocketServer();
  await server.open(Number(SGlobal.env.PORT), async (acceptor) => {
    const header = acceptor.header;
    const { user, roomNumber } = header;
    const driver = acceptor.getDriver();

    // const url: URL = new URL(`http://localhost${acceptor.path}`);
    const agent: Agentica<"chatgpt"> = new Agentica({
      model: "chatgpt",
      vendor: {
        api: new OpenAI({ apiKey: SGlobal.env.OPENAI_API_KEY }),
        model: "gpt-4o-mini",
      },
      config: {
        locale: "ko",
      },
      controllers: [
        {
          protocol: "class",
          name: "To Do service",
          application: typia.llm.application<TodoService, "chatgpt">(),
          execute: new TodoService(),
        },
        {
          protocol: "class",
          name: "Weather service",
          application: typia.llm.application<WeatherService, "chatgpt">(),
          execute: new WeatherService(),
        },
      ],
      histories: await getPromptHistories(user, roomNumber),
    });
    const service: AgenticaRpcService<"chatgpt"> = new AgenticaRpcService({
      agent,
      listener: driver,
    });
    await acceptor.accept(service);
  });
};
main().catch(console.error);
