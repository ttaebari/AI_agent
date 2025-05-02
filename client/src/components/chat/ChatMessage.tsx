import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { markdownComponents } from "./MarkdownComponents";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
}

interface ChatMessageProps {
    message: Message;
    messageHistory?: { usermessage: string; aimessage: string }[];
}

export function ChatMessage({ message, messageHistory }: ChatMessageProps) {
    const isUser = message.role === "user";
    if (message.role === "assistant") {
        console.log("Assistant message:", message.content);
    }
    return (
        <>
            {messageHistory &&
                messageHistory.length > 0 &&
                messageHistory.map((message, index) => (
                    <div key={index} className="flex flex-col gap-2 my-2">
                        {/* User Message - 오른쪽 정렬 */}
                        <div className="flex justify-end">
                            <div className="bg-white text-zinc-900 rounded= 2xl px-4 py-3 rounded-lg max-w-xs break-words text-sm">
                                {message.usermessage}
                            </div>
                        </div>

                        {/* AI Message - 왼쪽 정렬 */}
                        <div className="flex justify-start">
                            <div className="bg-zinc-700/50 text--100 rounded= 2xl px-4 py-3 rounded-lg max-w-xs break-words text-sm">
                                {message.aimessage}
                            </div>
                        </div>
                    </div>
                ))}
            <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        isUser ? "bg-white text-zinc-900" : "bg-zinc-700/50 text--100"
                    }`}
                >
                    {isUser ? (
                        <p className="text-sm whitespace-pre-wrap break-all">{message.content}</p>
                    ) : (
                        <div className="prose prose-sm prose-invert max-w-none [&_pre]:!p-0 [&_pre]:!m-0 [&_pre]:!bg-transparent">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeHighlight]}
                                components={markdownComponents}
                            >
                                {message.content}
                            </ReactMarkdown>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
