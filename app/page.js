"use client";

import { useCallback, useEffect, useState } from "react";
import api from "./lib/api";
import TaskForm from "./components/TaskForm";
import TaskItem from "./components/TaskItem";

const TASKS_ENDPOINT = "/tasks";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTasks = useCallback(async () => {
    const response = await api.get(TASKS_ENDPOINT);

    return response.data.data || [];
  }, []);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await fetchTasks();

        setTasks(data);
        setError("");
      } catch (error) {
        setError(error?.error || "Failed to fetch tasks.");
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [fetchTasks]);

  const addTask = async (title) => {
    try {
      setError("");

      const response = await api.post(TASKS_ENDPOINT, {
        title: title.trim(),
      });
      const newTask = response.data.data;

      setTasks((previousTasks) => [newTask, ...previousTasks]);
    } catch (error) {
      const message =
        error.response?.data?.error || "Failed to add task.";
      setError(message);
       throw new Error(message);
    }
  };

  const toggleTask = async (id, completed) => {
    try {
      setError("");

      const response = await api.patch(`${TASKS_ENDPOINT}/${id}`, {
        completed,
      });

      const updatedTask = response.data.data;

      setTasks((previousTasks) =>
        previousTasks.map((task) => (task._id === id ? updatedTask : task)),
      );
    } catch (error) {
      setError(error?.error || "Failed to update task.");
    }
  };

  const deleteTask = async (id) => {
    try {
      setError("");

      await api.delete(`${TASKS_ENDPOINT}/${id}`);

      setTasks((previousTasks) =>
        previousTasks.filter((task) => task._id !== id),
      );
    } catch (error) {
      setError(error?.error || "Failed to delete task.");
    }
  };

  return (
    <main className="page">
      <div className="container">
        <h1>Task Manager</h1>

        <p className="subtitle">Manage your tasks easily</p>

        <TaskForm onAddTask={addTask} />

        {error && (
          <div className="global-error" role="alert">
            {error}
          </div>
        )}

        {loading && <div className="loading">Loading...</div>}

        {!loading && tasks.length === 0 && (
          <div className="empty">No tasks found. Add your first task.</div>
        )}

        {!loading && tasks.length > 0 && (
          <div className="task-list">
            {tasks.map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                onToggle={toggleTask}
                onDelete={deleteTask}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
