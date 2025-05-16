import express, { Response, Request } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;
const prisma = new PrismaClient();

app.get("/", (req: Request, res: Response) => {
    res.sendFile("index.html", { root: "./public" });
});

// todo 생성
app.post("/todos", async (req: Request, res: Response): Promise<void> => {
    const { Uid: uid, name, content, completed, goal: goalstring } = req.body;
    const goal = goalstring ? new Date(goalstring) : new Date();
    if (!name || !content) {
        res.status(400).json({ error: "Invalid todo data" });
        return;
    }

    try {
        const todo = await prisma.todolist.create({
            data: {
                uid,
                name,
                content,
                goaldate: goal,
                completed,
            },
        });
        res.status(201).json({ todo });
    } catch (err) {
        console.error("Prisma insert error:", err);
        res.status(500).json({ error: "Failed to create todo" });
    }
});

// *message 저장
app.post("/message", async (req: Request, res: Response): Promise<void> => {
    const { users, roomid, type, role, text } = req.body;
    if (!users || !roomid || !type || !text) {
        res.status(400).json({ error: "Invalid request data" });
    }

    try {
        const message = await prisma.messagelist.create({
            data: {
                users,
                roomid,
                type,
                role,
                text,
            },
        });
        res.status(201).json({ message });
    } catch (err) {
        console.error("Prisma insert error:", err);
        res.status(500).json({ error: "Failed to create message" });
    }
});

// *room별 message 조회
app.get("/message/:roomid", async (req: Request, res: Response): Promise<void> => {
    const roomid = parseInt(req.params.roomid);
    console.log("roomid", roomid);
    try {
        const messages = await prisma.messagelist.findMany({
            where: { roomid: roomid },
            select: { role: true, text: true },
            orderBy: { id: "asc" },
        });
        res.status(200).json(messages);
    } catch (err) {
        console.error("message 조회 실패:", err);
        res.status(500).json({ error: "Failed to fetch messages" });
    }
});

// *room별 message 삭제
app.delete("/message/:roomid", async (req: Request, res: Response): Promise<void> => {
    const roomid = parseInt(req.params.roomid);
    console.log("delete roomid", roomid);
    try {
        await prisma.messagelist.deleteMany({ where: { roomid: roomid } });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete messages" });
    }
});

// *room 생성
app.post("/room/:roomid", async (req: Request, res: Response): Promise<void> => {
    const roomid = parseInt(req.params.roomid);
    const { roomname } = req.body;
    if (!roomname) {
        res.status(400).json({ error: "Invalid room data" });
        return;
    }
    try {
        await prisma.roomlist.create({
            data: {
                roomid,
                roomname,
            },
        });
    } catch (err) {
        console.error("Prisma insert error:", err);
        res.status(500).json({ error: "Failed to create room" });
    }
});

// *room 이름 변경
app.patch("/room/:roomid", async (req: Request, res: Response): Promise<void> => {
    const roomid = parseInt(req.params.roomid);
    const { roomname } = req.body;
    if (!roomname) {
        res.status(400).json({ error: "Invalid room data" });
        return;
    }
    try {
        const room = await prisma.roomlist.update({
            where: { roomid: roomid },
            data: { roomname },
        });
        res.status(200).json({ room });
    } catch (err) {
        console.error("Prisma update error:", err);
        res.status(500).json({ error: "Failed to update room" });
    }
});

// *room별 message 삭제
app.delete("/room/:roomid", async (req: Request, res: Response): Promise<void> => {
    const roomid = parseInt(req.params.roomid);
    console.log("delete roomid", roomid);
    try {
        await prisma.roomlist.delete({ where: { roomid: roomid } });
        res.status(200).json({ message: "Room and messages deleted successfully" });
    } catch (err) {
        console.error("Failed to delete room and messages:", err);
        res.status(500).json({ error: "Failed to delete room and messages" });
    }
});

// *전체 todo 조회
app.get("/todos", async (req: Request, res: Response): Promise<void> => {
    try {
        const todos = await prisma.todolist.findMany();
        res.status(200).json(todos);
    } catch (err) {
        console.error("todo 조회 실패:", err);
        res.status(500).json({ error: "Failed to fetch todos" });
    }
});

// *특정 날짜 이전의 todo 조회 api (Prisma 기반)
app.get("/todos/filter", async (req: Request, res: Response): Promise<void> => {
    const date = req.query.date;

    if (!date) {
        res.status(400).json({ error: "Date is required" });
        return;
    }

    try {
        const todos = await prisma.todolist.findMany({
            where: {
                goaldate: {
                    lt: new Date(date as string),
                },
            },
        });

        if (todos.length === 0) {
            res.status(404).json({ error: "No todos found before this date" });
            return;
        }

        res.status(200).json(todos);
    } catch (err) {
        console.error("Prisma date 조회 실패:", err);
        res.status(500).json({ error: "Failed to fetch todos" });
    }
});

// *특정 todo 조회
app.get("/todos/:Uid", async (req: Request, res: Response): Promise<void> => {
    const todoUid = parseInt(req.params.Uid);
    try {
        const todo = await prisma.todolist.findFirst({ where: { uid: todoUid } });
        if (!todo) res.status(404).json({ error: "Todo not found" });
        res.status(200).json(todo);
    } catch (err) {
        console.error("Uid 조회 실패:", err);
        res.status(500).json({ error: "Failed to fetch todo" });
    }
});

// *특정 todo 삭제
app.delete("/todos/:Uid", async (req: Request, res: Response): Promise<void> => {
    const todoUid = parseInt(req.params.Uid);

    try {
        const todo = await prisma.todolist.findFirst({ where: { uid: todoUid } });
        if (!todo) res.status(404).json({ error: "Todo not found" });

        await prisma.todolist.delete({ where: { uid: todoUid } });
        res.status(200).json(todo);
    } catch (err) {
        console.error("삭제 실패:", err);
        res.status(500).json({ error: "Failed to delete todo" });
    }
});

// *모든 todo 삭제
app.delete("/alltodos", async (_req: Request, res: Response): Promise<void> => {
    try {
        await prisma.todolist.deleteMany();
        res.status(200).json({ message: "All todos deleted successfully" });
    } catch (err) {
        console.error("모두 삭제 실패:", err);
        res.status(500).json({ error: "Failed to delete all todos" });
    }
});

// *완료 여부 토글
app.patch("/todos/:Uid/toggle", async (req: Request, res: Response): Promise<void> => {
    const todoUid = parseInt(req.params.Uid);

    try {
        const todo = await prisma.todolist.findFirst({ where: { uid: todoUid } });
        if (!todo) res.status(404).json({ error: "Todo not found" });

        const updated = await prisma.todolist.update({
            where: { uid: todoUid },
            data: { completed: !todo?.completed },
        });

        res.status(200).json(updated);
    } catch (err) {
        console.error("업데이트 실패:", err);
        res.status(500).json({ error: "Failed to update todo" });
    }
});

// *미완료 목록 조회
app.get("/todos/report", async (_req: Request, res: Response): Promise<void> => {
    try {
        const todos = await prisma.todolist.findMany({ where: { completed: false } });
        if (todos.length === 0) res.status(404).json({ error: "No todos found" });
        res.status(200).json(todos);
    } catch (err) {
        console.error("조회 실패:", err);
        res.status(500).json({ error: "Failed to fetch todos" });
    }
});

//*서버 실행
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
