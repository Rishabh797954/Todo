import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import TodoItem from '../components/TodoItem';
import styles from '../styles/Home.module.css';
import buttonStyles from '../styles/LogoutButton.module.css';

const Home = () => {
  const router = useRouter();
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for authentication
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchTodos = async () => {
      try {
        const response = await fetch('/api/todos', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setTodos(Array.isArray(data) ? data : []);
        } else if (response.status === 401) {
          localStorage.removeItem('token');
          router.push('/login');
        }
      } catch (error) {
        console.error('Error fetching todos:', error);
        setTodos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, [router]);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: newTodo }),
      });

      if (response.ok) {
        const addedTodo = await response.json();
        setTodos([...todos, addedTodo]);
        setNewTodo('');
      } else if (response.status === 401) {
        router.push('/login');
      }
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (loading) {
    return <div className={styles.container}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <header className={buttonStyles.headerContainer}>
        <h1 className={buttonStyles.title}>Todo List</h1>
        <button 
          onClick={handleLogout} 
          className={buttonStyles.logoutButton}
        >
          Logout
        </button>
      </header>
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