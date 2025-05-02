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
const db_1 = require("./db");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)()); // CORS 설정
app.use(express_1.default.json());
const PORT = 3001;
app.get("/", (req, res) => {
    res.sendFile("index.html", { root: "./public" });
});
//DB 업데이트 api
app.post("/todos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const todo = req.body;
    if (!todo || !todo.name || !todo.content) {
        res.status(400).json({ error: "Invalid todo data" });
    }
    yield db_1.pool.query(`INSERT INTO todolist (Uid, name, content, goal, completed)
        VALUES ($1, $2, $3, $4, $5)`, [todo.Uid, todo.name, todo.content, todo.goal, todo.completed]);
    res.status(201).json({ todo });
}));
app.post("/message", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const messages = req.body;
    if (!messages.user || !messages.roomNumber || !messages.user_text || !messages.Ai_text) {
        res.status(400).json({ error: "Invalid request data" });
    }
    yield db_1.pool.query(`INSERT INTO messagelist (name, RoomId, UserMessage, AiMessage)
         VALUES ($1, $2, $3 , $4)`, [messages.user, messages.roomNumber, messages.user_text, messages.Ai_text]);
    res.status(201).json({ message: "Message saved successfully" });
}));
app.get("/message/:roomNumber", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const roomNumber = req.params.roomNumber;
    console.log("roomNumber api!!!", roomNumber);
    try {
        const result = yield db_1.pool.query(`SELECT UserMessage, AiMessage FROM messagelist WHERE RoomId = $1`, [
            roomNumber,
        ]);
        res.status(200).json(result.rows);
    }
    catch (err) {
        console.error("message DB 조회 실패:", err);
        res.status(500).json({ error: "Failed to fetch messages" });
    }
}));
//DB 조회 api
app.get("/todos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.pool.query("SELECT * FROM todolist");
        res.status(200).json(result.rows);
    }
    catch (err) {
        console.error("DB 조회 실패:", err);
        res.status(500).json({ error: "Failed to fetch todos" });
    }
}));
//특정 날짜 이전의 todo 조회 api
app.get("/todos/filter", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const date = req.query.date;
    console.log("date", date);
    try {
        const result = yield db_1.pool.query("SELECT * FROM todolist WHERE TO_DATE(goal, 'YYYY-MM-DD') < TO_DATE($1, 'YYYY-MM-DD')", [date]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: "No todos found before this date" });
        }
        res.status(200).json(result.rows);
    }
    catch (err) {
        console.error("date DB 조회 실패:", err);
        res.status(500).json({ error: "Failed to fetch todos" });
    }
}));
//특정 todo 조회 api
app.get("/todos/:Uid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const todoUid = req.params.Uid;
    console.log("todoUid", todoUid);
    try {
        const result = yield db_1.pool.query("SELECT * FROM todolist WHERE Uid = $1", [todoUid]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: "Todo not found" });
        }
        res.status(200).json(result.rows[0]);
    }
    catch (err) {
        console.error("Uid DB 조회 실패:", err);
        res.status(500).json({ error: "Failed to fetch todo" });
    }
}));
//특정 todo 삭제 api
app.delete("/todos/:Uid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const todoUid = req.params.Uid;
    try {
        const row = yield db_1.pool.query("SELECT * FROM todolist WHERE Uid = $1", [todoUid]);
        const result = yield db_1.pool.query("DELETE FROM todolist WHERE Uid = $1", [todoUid]);
        if (result.rowCount === 0) {
            res.status(404).json({ error: "Todo not found" });
        }
        res.status(200).json(row.rows[0]);
    }
    catch (err) {
        console.error("DB 삭제 실패:", err);
        res.status(500).json({ error: "Failed to delete todo" });
    }
}));
app.delete("/alltodos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_1.pool.query("TRUNCATE TABLE todolist");
        res.status(200).json({ message: "All todos deleted successfully" });
    }
    catch (err) {
        console.error("DB 삭제 실패:", err);
        res.status(500).json({ error: "Failed to delete all todos" });
    }
}));
//todo 완료여부 수정 api
app.patch("/todos/:Uid/toggle", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const todoUid = req.params.Uid;
    try {
        const row = yield db_1.pool.query("SELECT * FROM todolist WHERE Uid = $1", [todoUid]);
        if (row.rowCount === 0) {
            res.status(404).json({ error: "Todo not found" });
        }
        const result = yield db_1.pool.query("UPDATE todolist SET completed = NOT completed WHERE Uid = $1", [todoUid]);
        if (result.rowCount === 0) {
            res.status(500).json({ error: "Todo update failed" });
        }
        res.status(200).json({
            Uid: row.rows[0].Uid,
            name: row.rows[0].name,
            content: row.rows[0].content,
            goal: row.rows[0].goal,
            completed: !row.rows[0].completed,
        });
    }
    catch (err) {
        console.error("DB 업데이트 실패:", err);
        res.status(500).json({ error: "Failed to update todo" });
    }
}));
//todo 미완료 목록 조회 api
app.get("/todos/report", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.pool.query("SELECT * FROM todolist where completed = FALSE");
        if (result.rows.length === 0) {
            res.status(404).json({ error: "No todos found" });
        }
        res.status(200).json(result.rows);
    }
    catch (err) {
        console.error("DB 조회 실패:", err);
        res.status(500).json({ error: "Failed to fetch todos" });
    }
}));
// 서버 실행
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
