const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// ... existing code for routes will go here ...

// Get all todos
app.get('/todos', async (req, res) => {
    const result = await pool.query('SELECT * FROM todos');
    res.json(result.rows);
});

// Add a new todo
app.post('/todos', async (req, res) => {
    const { task } = req.body;
    const result = await pool.query('INSERT INTO todos (task) VALUES ($1) RETURNING *', [task]);
    res.json(result.rows[0]);
});

// Update a todo
app.put('/todos/:id', async (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;
    const result = await pool.query('UPDATE todos SET completed = $1 WHERE id = $2 RETURNING *', [completed, id]);
    res.json(result.rows[0]);
});

// Delete a todo
app.delete('/todos/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM todos WHERE id = $1', [id]);
    res.sendStatus(204);
});

// ... existing code for routes will go here ...

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
