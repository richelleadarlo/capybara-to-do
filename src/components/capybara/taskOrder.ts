import type { Task } from "./TaskItem";

export const reorderTasks = (tasks: Task[], fromId: string, toId: string) => {
  if (fromId === toId) {
    return tasks;
  }

  const fromIndex = tasks.findIndex((task) => task.id === fromId);
  const toIndex = tasks.findIndex((task) => task.id === toId);

  if (fromIndex === -1 || toIndex === -1) {
    return tasks;
  }

  const nextTasks = [...tasks];
  const [movedTask] = nextTasks.splice(fromIndex, 1);

  nextTasks.splice(toIndex, 0, movedTask);

  return nextTasks;
};