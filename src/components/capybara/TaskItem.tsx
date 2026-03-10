import { useState } from "react";

export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

/** Single task row with checkbox, text, and delete on hover */
const TaskItem = ({ task, onToggle, onDelete }: TaskItemProps) => {
  const [hovered, setHovered] = useState(false);
  const [sparkle, setSparkle] = useState(false);

  const handleToggle = () => {
    if (!task.completed) {
      setSparkle(true);
      setTimeout(() => setSparkle(false), 800);
    }
    onToggle(task.id);
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

      {/* Task text */}
      <span
        className={`flex-1 font-body text-sm transition-all duration-300 ${
          task.completed ? "line-through opacity-50" : ""
        }`}
      >
        {task.text}
      </span>

      {/* Delete — only visible on hover for completed tasks */}
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
  );
};

export default TaskItem;
