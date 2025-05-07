import "highlight.js/styles/github-dark.css";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
}

interface ChatMessageProps {
    message: Message;
    messageHistory?: { usermessage: string; aimessage: string }[];
}

export function ChatMessageHistory({ messageHistory }: ChatMessageProps) {
    return (
        <>
            {messageHistory &&
                messageHistory.length > 0 &&
                messageHistory.map((message, index) => (
                    <div key={index} className="flex flex-col gap-2 my-2">
                        <div className="flex justify-end">
                            <div className="bg-white text-zinc-900 rounded= 2xl px-4 py-3 rounded-lg max-w-xs break-words text-sm">
                                {message.aimessage}
                            </div>
                        </div>

                        <div className="flex justify-start">
                            <div className="bg-zinc-700/50 text--100 rounded= 2xl px-4 py-3 rounded-lg max-w-xs break-words text-sm">
                                {message.usermessage}
                            </div>
                        </div>
                    </div>
                ))}
        </>
    );
}
