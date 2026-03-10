import { useState, useCallback, useEffect } from "react";
import Capybara from "@/components/capybara/Capybara";
import HappinessMeter from "@/components/capybara/HappinessMeter";
import TaskList from "@/components/capybara/TaskList";
import TaskInput from "@/components/capybara/TaskInput";
import type { Task } from "@/components/capybara/TaskItem";
import { RotateCcw } from "lucide-react";

/** Load tasks from localStorage */
const loadTasks = (): Task[] => {
  try {
    const stored = localStorage.getItem("capybara-tasks");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

/** Save tasks to localStorage */
const saveTasks = (tasks: Task[]) => {
  localStorage.setItem("capybara-tasks", JSON.stringify(tasks));
};

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [bouncing, setBouncing] = useState(false);
  const [pulsing, setPulsing] = useState(false);
  const [breathing, setBreathing] = useState(false);

  // Persist tasks whenever they change
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const happiness = tasks.length > 0
    ? tasks.filter((t) => t.completed).length / tasks.length
    : 0;

  const allDone = tasks.length > 0 && happiness === 1;

  const handleReset = useCallback(() => {
    setTasks([]);
    localStorage.removeItem("capybara-tasks");
  }, []);

  /** Add a new task */
  const handleAdd = useCallback((text: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      text,
      completed: false,
    };
    setTasks((prev) => [...prev, newTask]);
  }, []);

  /** Toggle task completion with animations */
  const handleToggle = useCallback((id: string) => {
    setTasks((prev) => {
      const task = prev.find((t) => t.id === id);
      // Trigger animations only when completing (not uncompleting)
      if (task && !task.completed) {
        setBouncing(true);
        setPulsing(true);
        setBreathing(true);
        setTimeout(() => setBouncing(false), 500);
        setTimeout(() => setPulsing(false), 400);
        setTimeout(() => setBreathing(false), 400);
      }
      return prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
    });
  }, []);

  /** Delete a task */
  const handleDelete = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pb-24 bg-background relative overflow-hidden">
      <h1 className="font-pixel fixed top-6 left-1/2 -translate-x-1/2 z-20 text-center text-sm sm:text-base tracking-tight">
        Capybara To-do ~
      </h1>

      {/* Grass / greenery at bottom */}
      <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-0">
        <svg viewBox="0 0 1200 120" className="w-full h-20 sm:h-28" preserveAspectRatio="none">
          <path d="M0,120 C50,80 100,100 150,70 C200,40 250,90 300,60 C350,30 400,80 450,50 C500,20 550,70 600,40 C650,10 700,60 750,30 C800,0 850,50 900,20 C950,-10 1000,40 1050,10 C1100,-20 1150,30 1200,0 L1200,120 Z" fill="hsl(120 30% 72%)" />
          <path d="M0,120 C60,90 120,110 180,85 C240,60 300,100 360,75 C420,50 480,90 540,65 C600,40 660,80 720,55 C780,30 840,70 900,45 C960,20 1020,60 1080,35 C1140,10 1180,50 1200,25 L1200,120 Z" fill="hsl(130 35% 62%)" />
          <path d="M0,120 C80,100 160,115 240,95 C320,75 400,110 480,90 C560,70 640,105 720,85 C800,65 880,100 960,80 C1040,60 1120,95 1200,75 L1200,120 Z" fill="hsl(140 40% 52%)" />
        </svg>
        {/* Little flowers */}
        <div className="absolute bottom-6 left-[15%] text-lg animate-pulse">🌸</div>
        <div className="absolute bottom-8 left-[40%] text-sm animate-pulse" style={{ animationDelay: '0.5s' }}>🌼</div>
        <div className="absolute bottom-5 left-[65%] text-lg animate-pulse" style={{ animationDelay: '1s' }}>🌷</div>
        <div className="absolute bottom-7 left-[85%] text-sm animate-pulse" style={{ animationDelay: '0.3s' }}>🍀</div>
      </div>

      <div
        className={`w-full max-w-5xl panel-glass rounded-3xl p-6 sm:p-8 shadow-lg border border-border/50 transition-transform relative z-10 ${
          breathing ? "animate-breathe" : ""
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-8 items-start">
          <div className="flex flex-col items-center gap-4 lg:sticky lg:top-8">
            <Capybara bouncing={bouncing} />
            <div className="w-full max-w-[260px]">
              <HappinessMeter happiness={happiness} pulsing={pulsing} />
            </div>
          </div>

          <div className="space-y-6">
            <TaskList tasks={tasks} onToggle={handleToggle} onDelete={handleDelete} />
            <TaskInput onAdd={handleAdd} />

            {/* Reset button — appears when all tasks are done */}
            {allDone && (
              <button
                onClick={handleReset}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-accent text-accent-foreground font-heading text-sm hover:opacity-90 transition-opacity animate-fade-in"
              >
                <RotateCcw className="w-4 h-4" />
                Fresh start! 🌿
              </button>
            )}
          </div>
        </div>
      </div>

      <footer className="fixed bottom-2 left-1/2 -translate-x-1/2 z-20 text-[10px] sm:text-xs text-foreground/70">
        <a
          href="https://richelleadarlo.space/"
          className="hover:text-foreground underline underline-offset-2"
          target="_blank"
          rel="noopener noreferrer"
        >
          © Richelle Adarlo
        </a>
      </footer>
    </div>
  );
};

export default Index;
