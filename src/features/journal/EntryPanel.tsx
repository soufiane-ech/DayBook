import { ArrowLeft, Trash2 } from 'lucide-react';
import { useState, type ReactNode } from 'react';

interface EntryPanelProps {
  onBack: () => void;
  onDelete: () => void;
  /** Shown beside the back button. */
  status?: ReactNode;
  /** The panel's main action, placed last in the toolbar. */
  action: ReactNode;
  children: ReactNode;
}

/** The card shared by reading and editing, with a toolbar that stays put while the content scrolls. */
export function EntryPanel({ onBack, onDelete, status, action, children }: EntryPanelProps) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  return (
    <article className="animate-view-in border-line bg-card flex h-full flex-col overflow-hidden rounded-2xl border shadow-sm">
      <div className="border-line text-ink-soft flex items-center gap-2 border-b px-3 py-2.5 text-sm md:px-5">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to entries"
          className="hover:text-ink rounded-md p-1 transition-colors md:hidden"
        >
          <ArrowLeft className="size-5" aria-hidden />
        </button>
        {status}
        <button
          type="button"
          onClick={() => (confirmingDelete ? onDelete() : setConfirmingDelete(true))}
          onBlur={() => setConfirmingDelete(false)}
          aria-label={confirmingDelete ? 'Confirm delete entry' : 'Delete entry'}
          className={`ml-auto flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5 transition-colors duration-200 ${
            confirmingDelete ? 'bg-accent-soft text-accent font-medium' : 'hover:text-accent'
          }`}
        >
          <Trash2 className="size-4" aria-hidden />
          <span className={confirmingDelete ? '' : 'hidden sm:inline'}>
            {confirmingDelete ? 'Delete?' : 'Delete'}
          </span>
        </button>
        {action}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 md:px-8 md:py-7">
        <div className="mx-auto max-w-[38rem]">{children}</div>
      </div>
    </article>
  );
}

export const PRIMARY_ACTION_CLASS =
  'bg-ink text-paper flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-transform duration-150 hover:-translate-y-px active:translate-y-0';
