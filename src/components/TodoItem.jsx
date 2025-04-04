import React from 'react';
import styles from '../styles/TodoItem.module.css';

const TodoItem = ({ todo, onComplete, onDelete }) => {
  console.log(`TodoItem component rendered with todo:`, todo);
  
  const handleComplete = async () => {
    console.log(`Marking todo as completed:`, todo); 
    try {
      const response = await fetch('/api/todos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: todo.id, completed: true }),
      });

      if (response.ok) {
        console.log(`Todo with ID ${todo.id} marked as completed`);
        onComplete(todo.id); 
      } else {
        console.error('Failed to mark todo as completed');
      }
    } catch (error) {
      console.error('Error marking todo as completed:', error);
    } 
    
  };

  const handleDelete = async () => {
    console.log(`Deleting todo:`, todo); 
    try {
      const response = await fetch('/api/todos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: todo.id }),
      });

      if (response.ok) {
        console.log(`Todo with ID ${todo.id} deleted successfully`);
        onDelete(todo.id); 
      } else {
        console.error('Failed to delete todo');
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <li className={styles.todoItem}>
      <span className={`${styles.todoText} ${todo.completed ? styles.completed : ''}`}>
        {todo.title}
      </span>
      <div className={styles.buttonGroup}>
        <button
          className={styles.completeButton}
          onClick={handleComplete}
        >
          Done
        </button>
        <button
          className={styles.deleteButton}
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </li>
    
  );
};

export default TodoItem;