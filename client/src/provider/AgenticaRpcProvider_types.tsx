import { IAgenticaEventJson } from "@agentica/core";
import { IAgenticaRpcListener, IAgenticaRpcService } from "@agentica/rpc";
import { WebSocketConnector } from "tgrid";

export interface AgenticaRpcContextType {
    messages: IAgenticaEventJson[];
    conversate: (message: string) => Promise<void>;
    isConnected: boolean;
    isError: boolean;
    tryConnect: () => Promise<
        | WebSocketConnector<{ users: string; roomid: number }, IAgenticaRpcListener, IAgenticaRpcService<"chatgpt">>
        | undefined
    >;
}
