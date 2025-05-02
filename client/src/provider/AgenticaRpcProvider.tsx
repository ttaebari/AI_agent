import { IAgenticaEventJson } from "@agentica/core";
import { IAgenticaRpcListener, IAgenticaRpcService } from "@agentica/rpc";
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from "react";
import { Driver, WebSocketConnector } from "tgrid";
import { AgenticaRpcContextType } from "./AgenticaRpcProvider_types";

const AgenticaRpcContext = createContext<AgenticaRpcContextType | null>(null);

export function AgenticaRpcProvider({
    children,
    user = "taeho",
    roomNumber = 1,
}: PropsWithChildren<{ user?: string; roomNumber?: number }>) {
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
                { user: string; roomNumber: number },
                IAgenticaRpcListener,
                IAgenticaRpcService<"chatgpt">
            >(
                { user, roomNumber },
                {
                    describe: pushMessage,
                    text: pushMessage,
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
    }, [user, roomNumber, pushMessage]);

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
        console.log("roomNumber!!!!", roomNumber);
        (async () => {
            if (connector) {
                console.log("connector", connector);
                await connector.close();
                setDriver(null);
                setConnector(null);
            }

            tryConnect();
        })();
    }, [roomNumber, user]);

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
