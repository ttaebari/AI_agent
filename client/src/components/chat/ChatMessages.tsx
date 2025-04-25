import { IAgenticaEventJson } from "@agentica/core";
import { ChatMessage } from "./ChatMessage";

interface ChatMessagesProps {
  messages: IAgenticaEventJson[];
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  return (
    <>
      {messages.map((message, index) => (
        <ChatMessage
          key={index}
          message={{
            id: index.toString(),
            role: message.type === "text" ? message.role : "assistant",
            content:
              message.type === "text" || message.type === "describe"
                ? message.text
                : ""
          }}
        />
      ))}
    </>
  );
}
