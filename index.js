const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3000; // You can change the port as needed

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL database connection configuration
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '889dd791f47846ddb571e0b98b8b624b',
    port: 5432, // Change the port if necessary
});

// API endpoint to save a todo to the database
app.post('/api/todos', async (req, res) => {
    try {
        const { todo } = req.body;

        if (!todo) {
            return res.status(400).json({ error: 'Todo is required' });
        }

        const todoId = uuidv4();
        const query = 'INSERT INTO todos(id, todo) VALUES($1, $2) RETURNING *';
        const values = [todoId, todo];

        const result = await pool.query(query, values);

        const query1 = 'SELECT * FROM todos';
        const result1 = await pool.query(query1);

        res.status(201).json({ todo: result1.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// API endpoint to get all todos from the database
app.get('/api/todos', async (req, res) => {
    try {
        const query = 'SELECT * FROM todos';
        const result = await pool.query(query);

        res.status(200).json({ todos: result.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/api/todos', async (req, res) => {
    try {
        const query = 'DELETE FROM todos WHERE todo= $1';


        const query1 = 'SELECT * FROM todos';
        const result1 = await pool.query(query1);

        res.status(202).json({ todo: result1.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

})

// Start the Express server
app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});
