const express = require("express");
const cors = require("cors");
const fs = require("fs").promises;
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "todos.json");

// Read todos from file
async function readTodos() {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return []; // If no file exists, return empty list
  }
}

// Write todos to file
async function writeTodos(todos) {
  await fs.writeFile(DATA_FILE, JSON.stringify(todos, null, 2));
}

// ROUTES

app.get("/", (req, res) => {
  res.json({ message: "To-Do API is running" });
});

// GET /todos
app.get("/todos", async (req, res) => {
  const todos = await readTodos();
  res.json(todos);
});

// POST /todos
app.post("/todos", async (req, res) => {
  const { title, completed = false } = req.body;

  if (!title) {
    return res.status(400).json({ error: "title is required" });
  }

  const todos = await readTodos();
  const newTodo = {
    id: todos.length ? todos[todos.length - 1].id + 1 : 1,
    title,
    completed,
  };

  todos.push(newTodo);
  await writeTodos(todos);

  res.status(201).json(newTodo);
});

// PUT /todos/:id
app.put("/todos/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { title, completed } = req.body;

  const todos = await readTodos();
  const todo = todos.find((t) => t.id === id);

  if (!todo) return res.status(404).json({ error: "Todo not found" });

  if (title !== undefined) todo.title = title;
  if (completed !== undefined) todo.completed = completed;

  await writeTodos(todos);
  res.json(todo);
});

// DELETE /todos/:id
app.delete("/todos/:id", async (req, res) => {
  const id = Number(req.params.id);

  let todos = await readTodos();
  const exists = todos.some((t) => t.id === id);

  if (!exists) return res.status(404).json({ error: "Todo not found" });

  todos = todos.filter((t) => t.id !== id);
  await writeTodos(todos);

  res.status(204).send();
});

// Start server
app.listen(PORT, () => console.log("Server running on port", PORT));
