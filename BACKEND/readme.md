# Simple To-Do CRUD API

A minimal REST API for managing to-do items, built with **Node.js + Express**.

Data is stored in a local JSON file (`todos.json`) — no database required.

---

## Features

- `GET /todos` → Get all todos
- `POST /todos` → Create a new todo
- `PUT /todos/:id` → Update an existing todo
- `DELETE /todos/:id` → Delete a todo
- Stores data in a local `todos.json` file
- Returns proper JSON responses and HTTP status codes
- Input validation (title required on create, types checked)
- `completed: boolean` field supported

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/todo-api.git
cd todo-api
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the server
```bash
node index.js
```
By default, the API runs at: http://localhost:3000
