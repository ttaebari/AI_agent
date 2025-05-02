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
import { Agent } from "http";
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

class CustomAgentica extends Agentica<"chatgpt"> {
  private user: string;
  private roomNumber: number;
  private static server_url: string = "http://localhost:3001";
  constructor(
    props: ConstructorParameters<typeof Agentica<"chatgpt">>[0],
    user: string,
    roomNumber: number,
  ) {
    super(props);
    this.user = user;
    this.roomNumber = roomNumber;
  }
  public setRoomNumber(roomNumber: number): number {
    console.log("setRoomNumber", roomNumber);
    this.roomNumber = roomNumber;
    console.log("settingRoomNumber", this.roomNumber);
    return this.roomNumber;
  }
  override async conversate(
    message: string,
  ): Promise<AgenticaHistory<"chatgpt">[]> {
    const user_text = message;
    console.log("[Agentica] 사용자가 보낸 질문: ", user_text);
    console.log("유저 이름 : ", this.user);
    console.log("방 번호 : ", this.roomNumber);

    const histories = await super.conversate(message);
    const history = histories.slice(1);
    console.log("[Agentica] 응답받은 message : \n", history);
    const des = history.find((m) => m.type === "describe" || m.type === "text");
    let Ai_text = "";
    if (des) {
      console.log("응답받은 message : \n", des.text);
      Ai_text = des.text;
    }

    try {
      const res = await fetch(`${CustomAgentica.server_url}/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: this.user,
          roomNumber: this.roomNumber,
          user_text: user_text,
          Ai_text: Ai_text,
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to send message to server");
      }
    } catch (error) {
      console.error("Error sending message to server:", error);
    }

    return histories;
  }
}

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
    console.log("user name : ", header.user);
    console.log("room number : ", header.roomNumber);
    const driver = acceptor.getDriver();

    // const url: URL = new URL(`http://localhost${acceptor.path}`);
    const agent: Agentica<"chatgpt"> = new CustomAgentica(
      {
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
      },
      user,
      roomNumber,
    );
    console.log("agent", agent);
    console.log("11");
    if (agent instanceof CustomAgentica) {
      console.log("agent is CustomAgentica");
      agent.setRoomNumber(header.roomNumber);
    }
    console.log("22");
    const service: AgenticaRpcService<"chatgpt"> = new AgenticaRpcService({
      agent,
      listener: driver,
    });
    await acceptor.accept(service);
  });
};
main().catch(console.error);
