import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  Icon: LucideIcon;
  title: string;
  hint: string;
}

export function EmptyState({ Icon, title, hint }: EmptyStateProps) {
  return (
    <div className="animate-view-in flex flex-col items-center justify-center px-6 py-12 text-center">
      <span className="bg-accent-soft text-accent mb-3 grid size-11 place-items-center rounded-full">
        <Icon className="size-5" aria-hidden />
      </span>
      <p className="font-serif text-lg">{title}</p>
      <p className="text-ink-soft mt-1 text-sm">{hint}</p>
    </div>
  );
}
