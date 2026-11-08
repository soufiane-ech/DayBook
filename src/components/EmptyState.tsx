import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  Icon: LucideIcon;
  title: string;
  hint: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ Icon, title, hint, action }: EmptyStateProps) {
  return (
    <div className="animate-view-in flex flex-col items-center justify-center px-6 py-14 text-center">
      <span className="relative mb-5 grid size-16 place-items-center">
        <span aria-hidden className="bg-accent-soft absolute inset-0 rotate-6 rounded-2xl" />
        <span className="border-line bg-card text-accent shadow-soft relative grid size-14 place-items-center rounded-2xl border">
          <Icon className="size-6" aria-hidden />
        </span>
      </span>
      <p className="font-serif text-xl tracking-tight">{title}</p>
      <p className="text-ink-soft mt-1 max-w-xs text-sm leading-relaxed">{hint}</p>
      {action && (
        <button type="button" onClick={action.onClick} className="btn btn-primary mt-5">
          {action.label}
        </button>
      )}
    </div>
  );
}
