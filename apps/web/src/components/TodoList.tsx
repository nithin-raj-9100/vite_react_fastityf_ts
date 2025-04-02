import React, { useState, useEffect } from "react";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

const API_URL = import.meta.env.VITE_API_URL || "/api";

export const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/todos`);

      if (!response.ok) {
        throw new Error(`Error fetching todos: ${response.statusText}`);
      }

      const data = await response.json();
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      console.error("Failed to fetch todos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTodoTitle.trim()) return;

    try {
      const response = await fetch(`${API_URL}/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newTodoTitle }),
      });

      if (!response.ok) {
        throw new Error(`Error adding todo: ${response.statusText}`);
      }

      const newTodo = await response.json();
      setTodos([...todos, newTodo]);
      setNewTodoTitle("");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      console.error("Failed to add todo:", err);
    }
  };

  const handleToggleComplete = async (todo: Todo) => {
    try {
      const response = await fetch(`${API_URL}/todos/${todo.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed: !todo.completed }),
      });

      if (!response.ok) {
        throw new Error(`Error updating todo: ${response.statusText}`);
      }

      const updatedTodo = await response.json();
      setTodos(todos.map((t) => (t.id === updatedTodo.id ? updatedTodo : t)));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      console.error("Failed to update todo:", err);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Error deleting todo: ${response.statusText}`);
      }

      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      console.error("Failed to delete todo:", err);
    }
  };

  if (loading && todos.length === 0) {
    return <div className="loading">Loading todos...</div>;
  }

  if (error && todos.length === 0) {
    return (
      <div className="error">
        <p>Error: {error}</p>
        <button onClick={fetchTodos}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="todo-list">
      <h2>Todo List</h2>

      <form onSubmit={handleAddTodo} className="add-todo-form">
        <input
          type="text"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          placeholder="Add a new todo..."
          className="todo-input"
        />
        <button type="submit" className="add-button">
          Add Todo
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      <ul className="todos">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className={`todo-item ${todo.completed ? "completed" : ""}`}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggleComplete(todo)}
              className="todo-checkbox"
            />
            <span className="todo-title">{todo.title}</span>
            <button
              onClick={() => handleDeleteTodo(todo.id)}
              className="delete-button"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
