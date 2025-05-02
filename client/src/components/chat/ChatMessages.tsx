import { IAgenticaEventJson } from "@agentica/core";
import { ChatMessage } from "./ChatMessage";
import { ChatMessageHistory } from "./ChatMessageHistory";

interface ChatMessagesProps {
    messages: IAgenticaEventJson[];
    messageHistory: { usermessage: string; aimessage: string }[];
}

export function ChatMessages({ messages, messageHistory }: ChatMessagesProps) {
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
