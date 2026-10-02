"use client";

export default function TaskItem({
  task,
  onToggle,
  onDelete,
}) {
  return (
    <div className="task-item">
      <label className="task-content">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() =>
            onToggle(
              task._id,
              !task.completed
            )
          }
        />

        <span
          className={
            task.completed
              ? "completed"
              : ""
          }
        >
          {task.title}
        </span>
      </label>

      <button
        type="button"
        className="delete-button"
        onClick={() =>
          onDelete(task._id)
        }
      >
        Delete
      </button>
    </div>
  );
}