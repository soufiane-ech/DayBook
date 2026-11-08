import { CircleAlert, Sparkles } from 'lucide-react';

interface TodoProgressProps {
  completed: number;
  total: number;
  overdue: number;
  dueToday: number;
}

function describeAttention(overdue: number, dueToday: number, remaining: number, total: number): string {
  const parts: string[] = [];
  if (overdue > 0) parts.push(`${overdue} overdue`);
  if (dueToday > 0) parts.push(`${dueToday} due today`);
  if (parts.length > 0) return parts.join(' · ');
  if (total === 0) return 'Add a task to get started';
  return remaining > 0 ? 'Nothing urgent right now' : 'Nothing left to do';
}

export function TodoProgress({ completed, total, overdue, dueToday }: TodoProgressProps) {
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  const Icon = overdue > 0 ? CircleAlert : Sparkles;

  return (
    <div className="panel p-4">
      <div className="flex items-baseline justify-between">
        <span className="font-serif text-3xl tabular-nums">{percent}%</span>
        <span className="text-ink-soft text-sm tabular-nums">
          {completed} of {total} completed
        </span>
      </div>
      <div
        role="progressbar"
        aria-label="Tasks completed"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        className="bg-line mt-3 h-1.5 overflow-hidden rounded-full"
      >
        <div
          className="bg-accent h-full rounded-full transition-[width] duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className={`mt-3 flex items-center gap-1.5 text-sm ${overdue > 0 ? 'text-accent font-medium' : 'text-ink-soft'}`}>
        <Icon className="size-4 shrink-0" aria-hidden />
        {describeAttention(overdue, dueToday, total - completed, total)}
      </p>
    </div>
  );
}
