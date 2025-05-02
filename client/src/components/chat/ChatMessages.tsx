import { IAgenticaEventJson } from "@agentica/core";
import { ChatMessage } from "./ChatMessage";
import { ChatMessageHistory } from "./ChatMessageHistory";
import { useState } from "react";

interface ChatMessagesProps {
    messages: IAgenticaEventJson[];
    messageHistory: { usermessage: string; aimessage: string }[];
}

export function ChatMessages({ messages, messageHistory }: ChatMessagesProps) {
    console.log("!!");
    const [roomNumber] = useState(+localStorage.getItem("roomNumber")!);

    return (
        <>
            <ChatMessageHistory
                key={`history-${roomNumber}`}
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
