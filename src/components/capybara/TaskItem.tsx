import {
  useEffect,
  useRef,
  useState,
  type DragEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const formatTaskText = (value: string) => {
  const escaped = escapeHtml(value);
  const formatted = escaped
    .replace(/\*\*(.+?)\*\*/gs, "<strong>$1</strong>")
    .replace(/__(.+?)__/gs, "<u>$1</u>");

  return formatted
    .replace(/^ +/gm, (match) => "&nbsp;".repeat(match.length))
    .replace(/\n/g, "<br />");
};

export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

interface TaskItemProps {
  task: Task;
  isDragging: boolean;
  isDragOver: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onDragStart: (id: string) => void;
  onDragOver: (id: string) => void;
  onDrop: (id: string) => void;
  onDragEnd: () => void;
}

/** Single task row with checkbox, edit mode, and delete on hover */
const TaskItem = ({
  task,
  isDragging,
  isDragOver,
  onToggle,
  onDelete,
  onEdit,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: TaskItemProps) => {
  const [hovered, setHovered] = useState(false);
  const [sparkle, setSparkle] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const applyFormatting = (style: "bold" | "underline") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { value, selectionStart, selectionEnd } = textarea;
    if (selectionStart === null || selectionEnd === null) return;
    if (selectionStart === selectionEnd) return;

    let updatedText = value;
    let newEnd = selectionEnd;

    if (style === "bold") {
      const selected = value.slice(selectionStart, selectionEnd);
      updatedText = `${value.slice(0, selectionStart)}**${selected}**${value.slice(selectionEnd)}`;
      newEnd = selectionEnd + 4;
    } else if (style === "underline") {
      const selected = value.slice(selectionStart, selectionEnd);
      updatedText = `${value.slice(0, selectionStart)}__${selected}__${value.slice(selectionEnd)}`;
      newEnd = selectionEnd + 4;
    }

    setEditText(updatedText);
    window.requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(selectionStart, newEnd);
    });
  };

  useEffect(() => {
    if (!editing) {
      setEditText(task.text);
    }
  }, [task.text, editing]);

  useEffect(() => {
    if (editing) {
      textareaRef.current?.focus();
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

    if (editText !== task.text) {
      onEdit(task.id, editText);
    }
    setEditing(false);
  };

  const handleCancel = () => {
    setEditText(task.text);
    setEditing(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      handleCancel();
    }
  };

  const handleDragStart = (event: DragEvent<HTMLDivElement>) => {
    if (editing) {
      event.preventDefault();
      return;
    }

    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", task.id);
    onDragStart(task.id);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    if (editing) {
      return;
    }

    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    onDragOver(task.id);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    if (editing) {
      return;
    }

    event.preventDefault();
    onDrop(task.id);
  };

  return (
    <div
      draggable={!editing}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragEnd={onDragEnd}
      className={`relative flex items-center gap-3 px-4 py-3 rounded-xl border border-transparent transition-all duration-300 group ${
        isDragging ? "scale-[0.99] opacity-60" : "hover:bg-secondary/60"
      } ${isDragOver ? "border-accent bg-secondary/70" : ""}`}
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

      {!editing && (
        <div
          className="flex shrink-0 cursor-grab select-none flex-col gap-0.5 text-muted-foreground/60 active:cursor-grabbing"
          aria-hidden="true"
        >
          <span className="block h-1 w-1 rounded-full bg-current" />
          <span className="block h-1 w-1 rounded-full bg-current" />
          <span className="block h-1 w-1 rounded-full bg-current" />
        </div>
      )}

      {editing ? (
        <form onSubmit={handleSave} className="flex-1 space-y-2">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => applyFormatting("bold")}
              className="rounded-2xl border border-border px-3 py-1 text-[11px] text-muted-foreground hover:border-accent hover:text-foreground transition-colors"
            >
              Bold
            </button>
            <button
              type="button"
              onClick={() => applyFormatting("underline")}
              className="rounded-2xl border border-border px-3 py-1 text-[11px] text-muted-foreground hover:border-accent hover:text-foreground transition-colors"
            >
              Underline
            </button>
          </div>
          <textarea
            ref={textareaRef}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full min-h-[84px] resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
            aria-label="Edit task"
          />
          <div className="flex flex-wrap items-center gap-2">
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
          </div>
        </form>
      ) : (
        <>
          <span
            className={`flex-1 font-body text-sm transition-all duration-300 ${
              task.completed ? "line-through opacity-50" : ""
            }`} 
            style={{ whiteSpace: "pre-wrap" }}
            dangerouslySetInnerHTML={{ __html: formatTaskText(task.text) }}
          />

          <div className="flex items-center gap-2">
            {hovered && (
              <button
                onClick={() => setEditing(true)}
                className="rounded-2xl border border-border px-3 py-1 text-[11px] text-muted-foreground hover:border-accent hover:text-foreground transition-colors"
                aria-label="Edit task"
              >
                Edit
              </button>
            )}
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
