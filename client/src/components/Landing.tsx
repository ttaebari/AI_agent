import { useEffect, useState } from "react";

export function Landing() {
    const [todos, setTodos] = useState<
        {
            uid: number;
            name: string;
            content: string;
            goaldate: Date;
            completed: boolean;
        }[]
    >([]);

    const Server_URL = "http://localhost:3001";

    async function fetchTodos() {
        try {
            const res = await fetch(`${Server_URL}/todos`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const todos = await res.json();
            if (!res.ok) {
                throw new Error("Failed to fetch todos");
            }
            setTodos(todos);
        } catch (error) {
            setTodos([]);
        }
    }

    useEffect(() => {
        fetchTodos();
    }, []);

    return (
        <section className=" flex-1 flex flex-col items-center justify-center p-8 relative">
            <div className=" space-y-8">
                <div className="space-y-4 text-center">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-100 to-white bg-clip-text text-transparent">
                        Todo List
                    </h1>

                    <div className="mt-6 max-w-3xl mx-auto">
                        {todos.length === 0 ? (
                            <p className="text-gray-400 text-center">할 일이 없습니다.</p>
                        ) : (
                            <table className="w-full table-auto border-collapse border border-white/20 text-white">
                                <thead>
                                    <tr>
                                        <th className="border border-white/20 p-2 text-left">Uid</th>
                                        <th className="border border-white/20 p-2 text-left">이름</th>
                                        <th className="border border-white/20 p-2 text-left">할 일</th>
                                        <th className="border border-white/20 p-2 text-left">목표 날짜</th>
                                        <th className="border border-white/20 p-2 text-left">완료 여부</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {todos.map((todo) => (
                                        <tr key={todo.uid}>
                                            <td className="border border-white/20 p-2">{todo.uid}</td>
                                            <td className="border border-white/20 p-2">{todo.name}</td>
                                            <td className="border border-white/20 p-2">{todo.content}</td>
                                            <td className="border border-white/20 p-2">
                                                {todo.goaldate ? todo.goaldate.toString().split("T")[0] : ""}까지
                                            </td>
                                            <td className="border border-white/20 p-2">
                                                <input type="checkbox" checked={todo.completed} onChange={() => {}} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    <button onClick={() => fetchTodos()} className="bg-blue-500 text-white px-4 py-2 rounded">
                        refresh
                    </button>
                </div>
            </div>
        </section>
    );
}
