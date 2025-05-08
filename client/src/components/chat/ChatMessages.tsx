import { IAgenticaEventJson } from "@agentica/core";
import { ChatMessage } from "./ChatMessage";
import { ChatMessageHistory } from "./ChatMessageHistory";
import { useEffect } from "react";

interface ChatMessagesProps {
    messages: IAgenticaEventJson[];
    messageHistory: { UserMessage: string; AiMessage: string }[];
    roomNumber: number;
}

export function ChatMessages({ messages, messageHistory, roomNumber }: ChatMessagesProps) {
    const Server_URL = "http://localhost:3001";
    console.log("messages", messages);

    let user_text = "";
    let ai_text = "";

    useEffect(() => {
        if (messages.length > 0 && messages.length % 2 === 0) {
            console.log(messages);
            const UserMessage = messages[messages.length - 2];
            UserMessage.type === "text" ? (user_text = UserMessage.text) : (user_text = "");
            const AiMessage = messages[messages.length - 1];
            AiMessage.type === "text" || AiMessage.type === "describe" ? (ai_text = AiMessage.text) : (ai_text = "");
        }

        const sendMessage = async () => {
            try {
                const res = await fetch(`${Server_URL}/message`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        user: "taeho",
                        roomNumber: roomNumber,
                        user_text: user_text,
                        ai_text: ai_text,
                    }),
                });
                if (!res.ok) {
                    throw new Error("Failed to send message to server");
                }
            } catch (error) {
                console.error("Error sending message to server:", error);
            }
        };
        if (user_text.length > 0 && ai_text.length > 0) {
            console.log("user_text", user_text);
            console.log("ai_text", ai_text);
            sendMessage();
        }
    }, [messages]);

    return (
        <>
            <ChatMessageHistory
                key={0}
                message={{
                    id: "0",
                    role: "assistant",
                    content: "",
                }}
                messageHistory={messageHistory}
            />
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
