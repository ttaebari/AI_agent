import { IAgenticaEventJson } from "@agentica/core";
import { ChatMessage } from "./ChatMessage";
import { ChatMessageHistory } from "./ChatMessageHistory";
import { useEffect } from "react";

interface ChatMessagesProps {
    messages: IAgenticaEventJson[];
    messageHistory: { role: string; text: string }[];
    roomid: number;
}

export function ChatMessages({ messages, messageHistory, roomid }: ChatMessagesProps) {
    const Server_URL = "http://localhost:3001";
    console.log("messages", messages);

    useEffect(() => {
        const sendMessage = async () => {
            const Message = messages[messages.length - 1];
            const role = Message.type === "text" ? Message.role : "assistant";
            const type = Message.type;
            const text = Message.type === "text" || Message.type === "describe" ? Message.text : "";

            try {
                const res = await fetch(`${Server_URL}/message`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        users: "taeho",
                        roomid,
                        type,
                        role,
                        text,
                    }),
                });
                if (!res.ok) {
                    throw new Error("Failed to send message to server");
                }
            } catch (error) {
                console.error("Error sending message to server:", error);
            }
        };
        if (messages && messages.length > 0) {
            sendMessage();
        }
    }, [messages]);

    return (
        <>
            <ChatMessageHistory messageHistory={messageHistory} />
            {messages.map((message, index) => (
                <ChatMessage
                    key={index}
                    message={{
                        id: index.toString(),
                        role: message.type === "text" ? message.role : "assistant",
                        content: message.type === "text" || message.type === "describe" ? message.text : "",
                    }}
                />
            ))}
        </>
    );
}
