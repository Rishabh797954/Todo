import React, { useState, useEffect } from 'react';
import TodoItem from '../components/TodoItem';
import styles from '../styles/Home.module.css';

const Home = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch('/api/todos');
        const data = await response.json();
        setTodos(Array.isArray(data) ? data : []); // Ensure data is an array
      } catch (error) {
        console.error('Error fetching todos:', error);
        setTodos([]); // Fallback to an empty array on error
      }
    };

    fetchTodos();
  }, []);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTodo }),
      });

      if (response.ok) {
        const addedTodo = await response.json();
        setTodos([...todos, addedTodo]);
        setNewTodo(''); // Clear the input field
      } else {
        console.error('Failed to add todo');
      }
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Todo List</h1>
      <form className={styles.form} onSubmit={handleAddTodo}>
        <input
          className={styles.input}
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
        />
        <button className={styles.button} type="submit">
          Add Task
        </button>
      </form>
      <ul className={styles.todoList}>
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onComplete={(id) =>
              setTodos(
                todos.map((t) =>
                  t.id === id ? { ...t, completed: true } : t
                )
              )
            }
            onDelete={(id) =>
              setTodos(todos.filter((t) => t.id !== id))
            }
          />
        ))}
      </ul>
    </div>
  );
};

export default Home;