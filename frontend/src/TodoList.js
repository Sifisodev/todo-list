import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const [task, setTask] = useState('');

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        const response = await axios.get('http://localhost:5000/todos');
        setTodos(response.data);
    };

    const addTodo = async () => {
        const response = await axios.post('http://localhost:5000/todos', { task });
        setTodos([...todos, response.data]);
        setTask('');
    };

    const toggleComplete = async (id, completed) => {
        const response = await axios.put(`http://localhost:5000/todos/${id}`, { completed: !completed });
        setTodos(todos.map(todo => (todo.id === id ? response.data : todo)));
    };

    const deleteTodo = async (id) => {
        await axios.delete(`http://localhost:5000/todos/${id}`);
        setTodos(todos.filter(todo => todo.id !== id));
    };

    return (
        <div>
            <h1>To-Do List</h1>
            <input
                type="text"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="Add a new task"
            />
            <button onClick={addTodo}>Add</button>
            <ul>
                {todos.map(todo => (
                    <li key={todo.id}>
                        <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                            {todo.task}
                        </span>
                        <button onClick={() => toggleComplete(todo.id, todo.completed)}>Toggle</button>
                        <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TodoList;
