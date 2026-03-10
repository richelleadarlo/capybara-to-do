import { useState } from "react";

interface TaskInputProps {
  onAdd: (text: string) => void;
}

/** Input field for adding new tasks */
const TaskInput = ({ onAdd }: TaskInputProps) => {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a task..."
        className="flex-1 px-4 py-3 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-accent/50 font-body text-sm"
      />
      <button
        type="submit"
        className="px-5 py-3 rounded-xl bg-accent text-accent-foreground font-heading text-sm hover:opacity-90 transition-opacity"
      >
        Add
      </button>
    </form>
  );
};

export default TaskInput;
