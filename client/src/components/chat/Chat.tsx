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

    const [roomNumber, setRoomNumber] = useState(+localStorage.getItem("roomNumber")!);
    const [messageHistory, setMessageHistory] = useState<{ usermessage: string; aimessage: string }[]>([]);

    const Server_URL = "http://localhost:3001";
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

    console.log("roomNumber", roomNumber);

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
            <button
                onClick={() => {
                    localStorage.setItem("roomNumber", "1");
                    window.dispatchEvent(new CustomEvent("roomNumberChange", { detail: "1" }));
                    setRoomNumber(1);
                }}
                className={`px-4 py-2 h-[80px] text-black bg-blue-600 rounded ${
                    roomNumber === 1 ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
            >
                Room 1
            </button>
            <button
                onClick={() => {
                    localStorage.setItem("roomNumber", "2");
                    window.dispatchEvent(new CustomEvent("roomNumberChange", { detail: "2" }));
                    setRoomNumber(2);
                }}
                className={`px-4 py-2 h-[80px] text-black bg-blue-600 rounded ${
                    roomNumber === 2 ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
            >
                Room 2
            </button>
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
