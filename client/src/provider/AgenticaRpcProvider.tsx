import { IAgenticaEventJson } from "@agentica/core";
import { IAgenticaRpcListener, IAgenticaRpcService } from "@agentica/rpc";
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from "react";
import { Driver, WebSocketConnector } from "tgrid";
import { AgenticaRpcContextType } from "./AgenticaRpcProvider_types";

const AgenticaRpcContext = createContext<AgenticaRpcContextType | null>(null);

export function AgenticaRpcProvider({
    children,
    users = "taeho",
    roomid = 1,
}: PropsWithChildren<{ users?: string; roomid?: number }>) {
    const [messages, setMessages] = useState<IAgenticaEventJson[]>([]);
    const [isError, setIsError] = useState(false);
    const [driver, setDriver] = useState<Driver<IAgenticaRpcService<"chatgpt">, false> | null>(null);
    const [connector, setConnector] = useState<WebSocketConnector<any, any, any> | null>(null);

    const pushMessage = useCallback(
        async (message: IAgenticaEventJson) => setMessages((prev) => [...prev, message]),
        []
    );

    const tryConnect = useCallback(async () => {
        try {
            setIsError(false);
            const conn = new WebSocketConnector<
                { users: string; roomid: number },
                IAgenticaRpcListener,
                IAgenticaRpcService<"chatgpt">
            >(
                { users, roomid },
                {
                    describe: pushMessage,
                    text: pushMessage,
                    initialize: async (evt) => {
                        console.log("initialize evt", evt);
                    },
                    select: async (evt) => {
                        console.log("select evt", evt);
                        const reason = evt.selection.reason;
                        const operation = evt.selection.operation.function;
                        alert(`\"${reason}\"의 이유로 \"${operation}\" 함수 선택`);
                    },
                    cancel: async (evt) => {
                        console.log("cancel evt", evt);
                    },
                    call: async (evt) => {
                        console.log("call evt", evt);
                        if (evt.operation.function === "create") {
                            return {
                                ...evt.arguments,
                                name: evt.arguments.name + "씨",
                            };
                        }
                        return null;
                    },
                    execute: async (evt) => {
                        console.log("execute evt", evt);
                    },
                }
            );

            await conn.connect(import.meta.env.VITE_AGENTICA_WS_URL);
            const drv = conn.getDriver();
            setDriver(drv);
            setConnector(conn);
            return conn;
        } catch (e) {
            console.error(e);
            setIsError(true);
            return undefined;
        }
    }, [users, roomid, pushMessage]);

    const conversate = useCallback(
        async (message: string) => {
            if (!driver) {
                console.error("Driver is not connected.");
                return;
            }
            try {
                await driver.conversate(message);
            } catch (e) {
                console.error(e);
                setIsError(true);
            }
        },
        [driver]
    );

    const isConnected = !!driver;

    useEffect(() => {
        setMessages([]);
        (async () => {
            if (connector) {
                await connector.close();
                setDriver(null);
                setConnector(null);
            }

            tryConnect();
        })();
    }, [roomid]);

    return (
        <AgenticaRpcContext.Provider value={{ messages, conversate, isConnected, isError, tryConnect }}>
            {children}
        </AgenticaRpcContext.Provider>
    );
}

export function useAgenticaRpc() {
    const context = useContext(AgenticaRpcContext);
    if (!context) {
        throw new Error("useAgenticaRpc must be used within AgenticaRpcProvider");
    }
    return context;
}
