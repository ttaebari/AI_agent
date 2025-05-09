"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const PORT = 3001;
const prisma = new client_1.PrismaClient();
app.get("/", (req, res) => {
    res.sendFile("index.html", { root: "./public" });
});
// todo 생성
app.post("/todos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Uid: uid, name, content, completed, goal: goalstring } = req.body;
    const goal = goalstring ? new Date(goalstring) : new Date();
    if (!name || !content) {
        res.status(400).json({ error: "Invalid todo data" });
        return;
    }
    try {
        const todo = yield prisma.todolist.create({
            data: {
                uid,
                name,
                content,
                goaldate: goal,
                completed,
            },
        });
        res.status(201).json({ todo });
    }
    catch (err) {
        console.error("Prisma insert error:", err);
        res.status(500).json({ error: "Failed to create todo" });
    }
}));
// *message 저장
app.post("/message", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { users, roomid, type, role, text } = req.body;
    if (!users || !roomid || !type || !text) {
        res.status(400).json({ error: "Invalid request data" });
    }
    try {
        const message = yield prisma.messagelist.create({
            data: {
                users,
                roomid,
                type,
                role,
                text,
            },
        });
        res.status(201).json({ message });
    }
    catch (err) {
        console.error("Prisma insert error:", err);
        res.status(500).json({ error: "Failed to create message" });
    }
}));
// *room별 message 조회
app.get("/message/:roomid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const roomid = parseInt(req.params.roomid);
    try {
        const messages = yield prisma.messagelist.findMany({
            where: { roomid: roomid },
            select: { role: true, text: true },
            orderBy: { id: "asc" },
        });
        res.status(200).json(messages);
    }
    catch (err) {
        console.error("message 조회 실패:", err);
        res.status(500).json({ error: "Failed to fetch messages" });
    }
}));
// *room별 message 삭제
app.delete("/message/:roomid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const roomid = parseInt(req.params.roomid);
    try {
        yield prisma.messagelist.deleteMany({ where: { roomid: roomid } });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to delete messages" });
    }
}));
// *전체 todo 조회
app.get("/todos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todos = yield prisma.todolist.findMany();
        res.status(200).json(todos);
    }
    catch (err) {
        console.error("todo 조회 실패:", err);
        res.status(500).json({ error: "Failed to fetch todos" });
    }
}));
// *특정 날짜 이전의 todo 조회 api (Prisma 기반)
app.get("/todos/filter", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const date = req.query.date;
    if (!date) {
        res.status(400).json({ error: "Date is required" });
        return;
    }
    try {
        const todos = yield prisma.todolist.findMany({
            where: {
                goaldate: {
                    lt: new Date(date),
                },
            },
        });
        if (todos.length === 0) {
            res.status(404).json({ error: "No todos found before this date" });
            return;
        }
        res.status(200).json(todos);
    }
    catch (err) {
        console.error("Prisma date 조회 실패:", err);
        res.status(500).json({ error: "Failed to fetch todos" });
    }
}));
// *특정 todo 조회
app.get("/todos/:Uid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const todoUid = parseInt(req.params.Uid);
    try {
        const todo = yield prisma.todolist.findFirst({ where: { uid: todoUid } });
        if (!todo)
            res.status(404).json({ error: "Todo not found" });
        res.status(200).json(todo);
    }
    catch (err) {
        console.error("Uid 조회 실패:", err);
        res.status(500).json({ error: "Failed to fetch todo" });
    }
}));
// *특정 todo 삭제
app.delete("/todos/:Uid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const todoUid = parseInt(req.params.Uid);
    try {
        const todo = yield prisma.todolist.findFirst({ where: { uid: todoUid } });
        if (!todo)
            res.status(404).json({ error: "Todo not found" });
        yield prisma.todolist.delete({ where: { uid: todoUid } });
        res.status(200).json(todo);
    }
    catch (err) {
        console.error("삭제 실패:", err);
        res.status(500).json({ error: "Failed to delete todo" });
    }
}));
// *모든 todo 삭제
app.delete("/alltodos", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.todolist.deleteMany();
        res.status(200).json({ message: "All todos deleted successfully" });
    }
    catch (err) {
        console.error("모두 삭제 실패:", err);
        res.status(500).json({ error: "Failed to delete all todos" });
    }
}));
// *완료 여부 토글
app.patch("/todos/:Uid/toggle", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const todoUid = parseInt(req.params.Uid);
    try {
        const todo = yield prisma.todolist.findFirst({ where: { uid: todoUid } });
        if (!todo)
            res.status(404).json({ error: "Todo not found" });
        const updated = yield prisma.todolist.update({
            where: { uid: todoUid },
            data: { completed: !(todo === null || todo === void 0 ? void 0 : todo.completed) },
        });
        res.status(200).json(updated);
    }
    catch (err) {
        console.error("업데이트 실패:", err);
        res.status(500).json({ error: "Failed to update todo" });
    }
}));
// *미완료 목록 조회
app.get("/todos/report", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todos = yield prisma.todolist.findMany({ where: { completed: false } });
        if (todos.length === 0)
            res.status(404).json({ error: "No todos found" });
        res.status(200).json(todos);
    }
    catch (err) {
        console.error("조회 실패:", err);
        res.status(500).json({ error: "Failed to fetch todos" });
    }
}));
//*서버 실행
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
