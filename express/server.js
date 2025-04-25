import express from "express";
import { pool } from "./db.js";
import cors from "cors";

const app = express();
app.use(cors()); // CORS 설정
app.use(express.json());

const PORT = 3001;

app.get("/", (req, res) => {
    res.sendFile("index.html", { root: "./public" });
});

//DB 업데이트 api
app.post("/todos", async (req, res) => {
    const todo = req.body;

    if (!todo || !todo.name || !todo.content) {
        return res.status(400).json({ error: "Invalid todo data" });
    }

    await pool.query(
        `INSERT INTO todolist (Uid, name, content, goal, completed)
         VALUES ($1, $2, $3, $4, $5)`,
        [todo.Uid, todo.name, todo.content, todo.goal, todo.completed]
    );

    res.status(201).json({ todo });
});

//DB 조회 api
app.get("/todos", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM todolist");

        res.status(200).json(result.rows);
    } catch (err) {
        console.error("DB 조회 실패:", err);
        res.status(500).json({ error: "Failed to fetch todos" });
    }
});

//특정 날짜 이전의 todo 조회 api
app.get("/todos/filter", async (req, res) => {
    const date = req.query.date;
    console.log("date", date);
    try {
        const result = await pool.query(
            "SELECT * FROM todolist WHERE TO_DATE(goal, 'YYYY-MM-DD') < TO_DATE($1, 'YYYY-MM-DD')",
            [date]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "No todos found before this date" });
        }

        res.status(200).json(result.rows);
    } catch (err) {
        console.error("date DB 조회 실패:", err);
        res.status(500).json({ error: "Failed to fetch todos" });
    }
});

//특정 todo 조회 api
app.get("/todos/:Uid", async (req, res) => {
    const todoUid = req.params.Uid;
    console.log("todoUid", todoUid);

    try {
        const result = await pool.query("SELECT * FROM todolist WHERE Uid = $1", [todoUid]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Todo not found" });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("Uid DB 조회 실패:", err);
        res.status(500).json({ error: "Failed to fetch todo" });
    }
});

//특정 todo 삭제 api
app.delete("/todos/:Uid", async (req, res) => {
    const todoUid = req.params.Uid;

    try {
        const row = await pool.query("SELECT * FROM todolist WHERE Uid = $1", [todoUid]);
        const result = await pool.query("DELETE FROM todolist WHERE Uid = $1", [todoUid]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Todo not found" });
        }

        res.status(200).json(row.rows[0]);
    } catch (err) {
        console.error("DB 삭제 실패:", err);
        res.status(500).json({ error: "Failed to delete todo" });
    }
});

app.delete("/alltodos", async (req, res) => {
    try {
        await pool.query("TRUNCATE TABLE todolist");

        res.status(200).json({ message: "All todos deleted successfully" });
    } catch (err) {
        console.error("DB 삭제 실패:", err);
        res.status(500).json({ error: "Failed to delete all todos" });
    }
});

//todo 완료여부 수정 api
app.patch("/todos/:Uid/toggle", async (req, res) => {
    const todoUid = req.params.Uid;

    try {
        const row = await pool.query("SELECT * FROM todolist WHERE Uid = $1", [todoUid]);
        if (row.rowCount === 0) {
            return res.status(404).json({ error: "Todo not found" });
        }

        const result = await pool.query("UPDATE todolist SET completed = NOT completed WHERE Uid = $1", [todoUid]);
        if (result.rowCount === 0) {
            return res.status(500).json({ error: "Todo update failed" });
        }

        res.status(200).json({
            Uid: row.rows[0].Uid,
            name: row.rows[0].name,
            content: row.rows[0].content,
            goal: row.rows[0].goal,
            completed: !row.rows[0].completed,
        });
    } catch (err) {
        console.error("DB 업데이트 실패:", err);
        res.status(500).json({ error: "Failed to update todo" });
    }
});

//todo 미완료 목록 조회 api
app.get("/todos/report", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM todolist where completed = FALSE");
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "No todos found" });
        }

        res.status(200).json(result.rows);
    } catch (err) {
        console.error("DB 조회 실패:", err);
        res.status(500).json({ error: "Failed to fetch todos" });
    }
});

// 서버 실행
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
