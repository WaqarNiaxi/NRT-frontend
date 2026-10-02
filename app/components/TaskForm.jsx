"use client";

import { useState } from "react";

export default function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError("");
      setAdding(true);

      await onAddTask(title);

      setTitle("");
    } catch (error) {

      setError(
        error.message|| "Failed the task add"
      );
      debugger
    } finally {
      setAdding(false);
    }
  };

  return (
    <form
      className="task-form"
      onSubmit={handleSubmit}
    >
      <div className="input-wrapper">
        <input
          type="text"
          placeholder="Enter a new task..."
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
          }}
          disabled={adding}
        />

        <button
          type="submit"
          disabled={adding}
        >
          {adding ? "Adding..." : "Add"}
        </button>
      </div>

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}
    </form>
  );
}