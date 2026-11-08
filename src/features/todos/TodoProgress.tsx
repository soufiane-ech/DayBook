interface TodoProgressProps {
  completed: number;
  total: number;
  overdue: number;
  dueToday: number;
}

function describeAttention(overdue: number, dueToday: number, remaining: number): string {
  const parts: string[] = [];
  if (overdue > 0) parts.push(`${overdue} overdue`);
  if (dueToday > 0) parts.push(`${dueToday} due today`);
  if (parts.length > 0) return parts.join(' · ');
  return remaining > 0 ? 'Nothing urgent right now' : 'Nothing left to do';
}

export function TodoProgress({ completed, total, overdue, dueToday }: TodoProgressProps) {
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="border-line bg-card rounded-2xl border p-4 shadow-sm">
      <div className="flex items-baseline justify-between">
        <span className="font-serif text-2xl tabular-nums">{percent}%</span>
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
        className="bg-line mt-2.5 h-1.5 overflow-hidden rounded-full"
      >
        <div
          className="bg-accent h-full rounded-full transition-[width] duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className={`mt-2.5 text-sm ${overdue > 0 ? 'text-accent font-medium' : 'text-ink-soft'}`}>
        {describeAttention(overdue, dueToday, total - completed)}
      </p>
    </div>
  );
}
