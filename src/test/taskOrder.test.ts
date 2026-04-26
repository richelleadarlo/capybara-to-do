import { describe, expect, it } from "vitest";
import { reorderTasks } from "@/components/capybara/taskOrder";
import type { Task } from "@/components/capybara/TaskItem";

const tasks: Task[] = [
  { id: "one", text: "First", completed: false },
  { id: "two", text: "Second", completed: false },
  { id: "three", text: "Third", completed: true },
];

describe("reorderTasks", () => {
  it("moves a task before the drop target", () => {
    expect(reorderTasks(tasks, "three", "one").map((task) => task.id)).toEqual([
      "three",
      "one",
      "two",
    ]);
  });

  it("returns the original array when ids are unchanged", () => {
    expect(reorderTasks(tasks, "two", "two")).toBe(tasks);
  });
});