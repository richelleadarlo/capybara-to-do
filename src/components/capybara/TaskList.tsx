import { useState } from "react";
import TaskItem, { type Task } from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onReorder: (fromId: string, toId: string) => void;
}

/** Scrollable task list container */
const TaskList = ({ tasks, onToggle, onDelete, onEdit, onReorder }: TaskListProps) => {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverTaskId, setDragOverTaskId] = useState<string | null>(null);

  const handleDragStart = (taskId: string) => {
    setDraggedTaskId(taskId);
    setDragOverTaskId(taskId);
  };

  const handleDragOver = (taskId: string) => {
    if (!draggedTaskId || draggedTaskId === taskId) {
      return;
    }

    setDragOverTaskId(taskId);
  };

  const resetDragState = () => {
    setDraggedTaskId(null);
    setDragOverTaskId(null);
  };

  const handleDrop = (taskId: string) => {
    if (!draggedTaskId || draggedTaskId === taskId) {
      resetDragState();
      return;
    }

    onReorder(draggedTaskId, taskId);
    resetDragState();
  };

  if (tasks.length === 0) {
    return (
      <p className="text-center text-muted-foreground text-sm py-8 font-heading">
        No tasks yet. Add one below ↓
      </p>
    );
  }

  return (
    <div className="max-h-[320px] overflow-y-auto space-y-1 pr-1">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          isDragging={draggedTaskId === task.id}
          isDragOver={dragOverTaskId === task.id && draggedTaskId !== task.id}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragEnd={resetDragState}
        />
      ))}
    </div>
  );
};

export default TaskList;
