
const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = 3000;

// Connect to SQLite database
const db = new Database('tasks.db');

// Create table if it does not exist
db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        completed INTEGER DEFAULT 0
    )
`);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// READ: Get all tasks
app.get('/api/tasks', (req, res) => {
    const tasks = db.prepare('SELECT * FROM tasks').all();
    res.json(tasks);
});

// CREATE: Add a task
app.post('/api/tasks', (req, res) => {
    const title = req.body.title?.trim();

    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }

    const result = db.prepare(
        'INSERT INTO tasks (title) VALUES (?)'
    ).run(title);

    res.status(201).json({
        id: Number(result.lastInsertRowid),
        title,
        completed: 0
    });
});

// UPDATE: Edit a task
app.put('/api/tasks/:id', (req, res) => {
    const { title, completed } = req.body;
    const task = db.prepare(
        'SELECT * FROM tasks WHERE id = ?'
    ).get(req.params.id);

    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }

    const newTitle = title === undefined ? task.title : title.trim();
    const newCompleted = completed === undefined
        ? task.completed
        : (completed ? 1 : 0);

    if (!newTitle) {
        return res.status(400).json({ error: 'Title cannot be empty' });
    }

    db.prepare(`
        UPDATE tasks
        SET title = ?, completed = ?
        WHERE id = ?
    `).run(newTitle, newCompleted, req.params.id);

    res.json({
        id: task.id,
        title: newTitle,
        completed: newCompleted
    });
});

// DELETE: Remove a task
app.delete('/api/tasks/:id', (req, res) => {
    const result = db.prepare(
        'DELETE FROM tasks WHERE id = ?'
    ).run(req.params.id);

    if (result.changes === 0) {
        return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
});

// Start server
app.listen(PORT, () => {
    console.log(`NodeTask running at http://localhost:${PORT}`);
});
