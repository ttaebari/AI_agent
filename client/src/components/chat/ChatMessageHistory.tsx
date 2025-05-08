import { useState } from "react";
import "highlight.js/styles/github-dark.css";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
}

interface ChatMessageProps {
    message: Message;
    messageHistory?: { UserMessage: string; AiMessage: string }[];
}

export function ChatMessageHistory({ messageHistory }: ChatMessageProps) {
    const [showHistory, setShowHistory] = useState(false);

    return (
        <div className="my-4">
            {showHistory &&
                messageHistory &&
                messageHistory.map((message, index) => (
                    <div key={index} className="flex flex-col gap-2 my-2">
                        <div className="flex justify-end">
                            <div className="bg-white text-zinc-900 px-4 py-3 rounded-lg max-w-xs break-words text-sm">
                                {message.UserMessage}
                            </div>
                        </div>

                        <div className="flex justify-start">
                            <div className="bg-zinc-700/50 text-white px-4 py-3 rounded-lg max-w-xs break-words text-sm">
                                {message.AiMessage}
                            </div>
                        </div>
                    </div>
                ))}
            {messageHistory && messageHistory.length > 0 && (
                <div className="flex justify-center mb-4">
                    <button
                        onClick={() => setShowHistory((prev) => !prev)}
                        className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        {showHistory ? "이전 대화 숨기기" : "이전 대화 불러오기"}
                    </button>
                </div>
            )}
        </div>
    );
}
