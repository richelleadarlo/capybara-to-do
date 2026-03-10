import TaskItem, { type Task } from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

/** Scrollable task list container */
const TaskList = ({ tasks, onToggle, onDelete }: TaskListProps) => {
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
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TaskList;
