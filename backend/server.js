const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "amr123", // Ensure this matches your MySQL password
  database: "todo_app",
});

// ✅ Fetch all columns
app.get("/columns", (req, res) => {
  db.query("SELECT * FROM columns", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ✅ Fetch all tasks
app.get("/tasks", (req, res) => {
  db.query("SELECT * FROM tasks", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ✅ Add a new column
app.post("/columns", (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Column name required" });

  db.query("INSERT INTO columns (name) VALUES (?)", [name], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, name });
  });
});

// ✅ Delete a column
app.delete("/columns/:id", (req, res) => {
  const columnId = req.params.id;
  db.query("DELETE FROM columns WHERE id = ?", [columnId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    db.query("DELETE FROM tasks WHERE column_id = ?", [columnId], () => {}); // Delete tasks inside column
    res.json({ success: true });
  });
});

// ✅ Add a task
app.post("/tasks", (req, res) => {
  const { title, columnId } = req.body;
  if (!title || !columnId) return res.status(400).json({ error: "Task title & column required" });

  db.query("INSERT INTO tasks (title, column_id) VALUES (?, ?)", [title, columnId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, title, column_id: columnId });
  });
});

// ✅ Delete a task
app.delete("/tasks/:id", (req, res) => {
  const taskId = req.params.id;
  db.query("DELETE FROM tasks WHERE id = ?", [taskId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// ✅ Move a task
app.post("/tasks/:id/move", (req, res) => {
  const taskId = req.params.id;
  const { newColumnId } = req.body;
  db.query("UPDATE tasks SET column_id = ? WHERE id = ?", [newColumnId, taskId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.listen(5000, () => {
  console.log("✅ Backend running on port 5000");
});
