import { useAgenticaRpc } from "../../provider/AgenticaRpcProvider";
import { ChatInput } from "./ChatInput";
import { ChatMessages } from "./ChatMessages";
import { ChatStatus } from "./ChatStatus";
import { useEffect, useRef, useState } from "react";

export function Chat({ roomid, onChangeRoomid }: { roomid: number; onChangeRoomid: (roomid: number) => void }) {
    const { messages, conversate, isConnected, isError, tryConnect } = useAgenticaRpc();
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const hasMessage = messages.length > 0;
    const lastMessage = messages[messages.length - 1];
    const isLastMessageFromUser = lastMessage?.type === "text" && lastMessage?.role === "user";

    const [rooms, setRooms] = useState<{ id: number; name: string }[]>([{ id: 1, name: "Room 1" }]);
    const [editingRoomId, setEditingRoomId] = useState<number | null>(null);
    const [previousRoomNames, setPreviousRoomNames] = useState<Record<number, string>>({});
    const [messageHistory, setMessageHistory] = useState<{ role: string; text: string }[]>([]);
    const Server_URL = "http://localhost:3001";

    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    };

    const handleSendMessage = async (content: string) => {
        try {
            await conversate(content);
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    //룸 추가
    const addRoom = async () => {
        const newId = rooms.length > 0 ? Math.max(...rooms.map((r) => r.id)) + 1 : 1;
        await fetch(`${Server_URL}/room/${newId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                roomname: `Room ${newId}`,
            }),
        });
        setRooms((prev) => [...prev, { id: newId, name: `Room ${newId}` }]);
        onChangeRoomid(newId);
    };

    //룸 삭제
    const removeRoom = async (id: number) => {
        if (rooms.length === 1) return;
        await fetch(`${Server_URL}/room/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const updated = rooms.filter((room) => room.id !== id);
        setRooms(updated);
        if (roomid === id) {
            onChangeRoomid(updated[updated.length - 1].id);
        }
    };

    //룸 이름 변경
    const renameRoom = async (id: number, name: string) => {
        await fetch(`${Server_URL}/room/${id}`, {
            method: "patch",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                roomname: name,
            }),
        });
        setRooms((prev) => prev.map((room) => (room.id === id ? { ...room, name } : room)));
    };

    const handleFinishEditing = (roomId: number, currentName: string) => {
        if (!currentName.trim()) {
            const previousName = previousRoomNames[roomId];
            if (previousName) {
                renameRoom(roomId, previousName);
            }
        }
        setEditingRoomId(null);
        setPreviousRoomNames((prev) => {
            const updated = { ...prev };
            delete updated[roomId];
            return updated;
        });
    };

    useEffect(() => {
        async function fetchMessages() {
            try {
                console.log("check fetch", roomid);
                const res = await fetch(`${Server_URL}/message/${roomid}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const messages = await res.json();
                console.log("check fetch message ", messages);
                if (!res.ok) throw new Error("Failed to fetch messages");
                setMessageHistory(messages);
            } catch (error) {
                console.error("Error fetching messages:", error);
                setMessageHistory([]);
            }
        }
        if (roomid) fetchMessages();
    }, [roomid]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 min-w-0 relative">
            <div className="absolute top-4 left-4 right-4 flex gap-2 z-10 items-center">
                <div className="flex gap-2 flex-wrap">
                    {rooms.map((room) => (
                        <div key={room.id} className="relative">
                            <button
                                onClick={() => onChangeRoomid(room.id)}
                                className={`text-sm px-5 py-2 rounded-md border min-w-[100px] relative ${
                                    roomid === room.id ? "bg-blue-600 text-white" : "bg-zinc-200 text-black"
                                }`}
                            >
                                {editingRoomId === room.id ? (
                                    <input
                                        type="text"
                                        value={room.name}
                                        className="bg-transparent outline-none w-full text-sm text-center"
                                        autoFocus
                                        onChange={(e) => renameRoom(room.id, e.target.value)}
                                        onBlur={() => handleFinishEditing(room.id, room.name)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") handleFinishEditing(room.id, room.name);
                                        }}
                                    />
                                ) : (
                                    <span
                                        onDoubleClick={() => {
                                            setEditingRoomId(room.id);
                                            setPreviousRoomNames((prev) => ({
                                                ...prev,
                                                [room.id]: room.name,
                                            }));
                                        }}
                                    >
                                        {room.name}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={() => {
                                    removeRoom(room.id);
                                }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center hover:bg-red-700"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>

                <div className="ml-auto">
                    <button
                        onClick={addRoom}
                        className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-md"
                    >
                        + Add Room
                    </button>
                </div>
            </div>

            <div className="relative w-full h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)]">
                <div className="h-full flex flex-col bg-zinc-800/50 backdrop-blur-md rounded-2xl overflow-hidden border border-zinc-700/30">
                    <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
                        <ChatMessages messages={messages} messageHistory={messageHistory} roomid={roomid} />
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
