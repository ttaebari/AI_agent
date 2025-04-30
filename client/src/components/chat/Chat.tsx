import { useAgenticaRpc } from "../../provider/AgenticaRpcProvider";
import { ChatInput } from "./ChatInput";
import { ChatMessages } from "./ChatMessages";
import { ChatStatus } from "./ChatStatus";
import { useEffect, useRef, useState } from "react";

export function Chat() {
    const { messages, conversate, isConnected, isError, tryConnect } = useAgenticaRpc();
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const hasMessage = messages.length > 0;
    const lastMessage = messages[messages.length - 1];
    const isLastMessageFromUser = lastMessage?.type === "text" && lastMessage?.role === "user";

    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    };

    console.log("??");

    const roomNumber = +localStorage.getItem("roomNumber")!;
    const [messageHistory, setMessageHistory] = useState<{ usermessage: string; aimessage: string }[]>([]);

    const Server_URL = "http://localhost:3001";
    console.log("roomNumber", roomNumber);
    useEffect(() => {
        async function fetchMessages() {
            try {
                const res = await fetch(`${Server_URL}/message/${roomNumber}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const messages = await res.json();
                if (!res.ok) {
                    throw new Error("Failed to fetch messages");
                }
                setMessageHistory(messages);
            } catch (error) {
                console.error("Error fetching messages:", error);
                setMessageHistory([]);
            }
        }
        if (roomNumber) {
            fetchMessages();
            console.log("useEffect", roomNumber);
        }
    }, [roomNumber]);
    console.log("message_", messageHistory);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (content: string) => {
        try {
            await conversate(content);
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 min-w-0">
            <div className="relative w-full h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)]">
                <div className="h-full flex flex-col bg-zinc-800/50 backdrop-blur-md rounded-2xl overflow-hidden border border-zinc-700/30">
                    <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
                        <ChatMessages messages={messages} messageHistory={messageHistory} />
                        <ChatStatus
                            isError={isError}
                            isConnected={isConnected}
                            hasMessages={hasMessage}
                            onRetryConnect={tryConnect}
                            isWsUrlConfigured={import.meta.env.VITE_AGENTICA_WS_URL !== ""}
                        />
                    </div>

                    <div className="p-4">
                        <ChatInput
                            onSendMessage={handleSendMessage}
                            disabled={!isConnected || isError || isLastMessageFromUser}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
