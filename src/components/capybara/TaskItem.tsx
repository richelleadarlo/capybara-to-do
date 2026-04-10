import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";

export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
}

/** Single task row with checkbox, edit mode, and delete on hover */
const TaskItem = ({ task, onToggle, onDelete, onEdit }: TaskItemProps) => {
  const [hovered, setHovered] = useState(false);
  const [sparkle, setSparkle] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!editing) {
      setEditText(task.text);
    }
  }, [task.text, editing]);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const handleToggle = () => {
    if (!task.completed) {
      setSparkle(true);
      setTimeout(() => setSparkle(false), 800);
    }
    onToggle(task.id);
  };

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = editText.trim();
    if (!trimmed) return;

    if (trimmed !== task.text) {
      onEdit(task.id, trimmed);
    }
    setEditing(false);
  };

  const handleCancel = () => {
    setEditText(task.text);
    setEditing(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      handleCancel();
    }
  };

  return (
    <div
      className="relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-secondary/60 group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Sparkle particle */}
      {sparkle && (
        <span className="absolute left-6 top-1 text-accent animate-sparkle pointer-events-none text-lg">
          ✦
        </span>
      )}

      {/* Checkbox */}
      <button
        onClick={handleToggle}
        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors shrink-0 ${
          task.completed
            ? "bg-accent border-accent"
            : "border-muted-foreground/40 hover:border-accent"
        }`}
        aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
      >
        {task.completed && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-foreground" />
          </svg>
        )}
      </button>

      {editing ? (
        <form onSubmit={handleSave} className="flex-1 flex items-center gap-2">
          <input
            ref={inputRef}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
            aria-label="Edit task"
          />
          <button
            type="submit"
            className="rounded-xl bg-accent px-3 py-2 text-[11px] font-semibold text-accent-foreground hover:opacity-90 transition-opacity"
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-xl border border-border px-3 py-2 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
        </form>
      ) : (
        <>
          <span
            className={`flex-1 font-body text-sm transition-all duration-300 ${
              task.completed ? "line-through opacity-50" : ""
            }`}
          >
            {task.text}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditing(true)}
              className="rounded-2xl border border-border px-3 py-1 text-[11px] text-muted-foreground hover:border-accent hover:text-foreground transition-colors"
              aria-label="Edit task"
            >
              Edit
            </button>
            {task.completed && hovered && (
              <button
                onClick={() => onDelete(task.id)}
                className="text-muted-foreground/50 hover:text-destructive transition-colors text-xs"
                aria-label="Delete task"
              >
                ✕
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TaskItem;
