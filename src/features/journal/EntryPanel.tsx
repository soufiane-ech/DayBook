import { ArrowLeft, Trash2 } from 'lucide-react';
import { useState, type ReactNode } from 'react';

interface EntryPanelProps {
  onBack: () => void;
  onDelete: () => void;
  /** Shown beside the back button. */
  status?: ReactNode;
  /** Extra toolbar buttons, placed before the main action. */
  tools?: ReactNode;
  /** The panel's main action, placed last in the toolbar. */
  action: ReactNode;
  /** Fills the whole screen and quiets the toolbar for undisturbed writing. */
  focusMode?: boolean;
  children: ReactNode;
}

/** The surface shared by reading and editing, with a toolbar that stays put while the content scrolls. */
export function EntryPanel({ onBack, onDelete, status, tools, action, focusMode = false, children }: EntryPanelProps) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  return (
    <article
      className={`bg-card flex h-full flex-col ${
        focusMode ? 'animate-focus-in fixed inset-0 z-40' : 'animate-view-in'
      }`}
    >
      <div
        className={`text-ink-soft flex items-center gap-1.5 border-b px-3 py-2 text-sm transition duration-300 md:px-5 ${
          focusMode ? 'border-transparent opacity-50 hover:opacity-100 focus-within:opacity-100' : 'border-line'
        }`}
      >
        {!focusMode && (
          <button type="button" onClick={onBack} aria-label="Back to entries" className="icon-btn md:hidden">
            <ArrowLeft className="size-5" aria-hidden />
          </button>
        )}
        {status}
        <div className="ml-auto flex items-center gap-1">
          {/* Delete comes first because its label changes width, which must not move the buttons after it. */}
          {!focusMode && (
            <button
              type="button"
              onClick={() => (confirmingDelete ? onDelete() : setConfirmingDelete(true))}
              onBlur={() => setConfirmingDelete(false)}
              aria-label={confirmingDelete ? 'Confirm delete entry' : 'Delete entry'}
              className={`btn ${confirmingDelete ? 'bg-accent-soft text-accent' : 'btn-quiet'}`}
            >
              <Trash2 className="size-4" aria-hidden />
              <span className={confirmingDelete ? '' : 'hidden sm:inline'}>
                {confirmingDelete ? 'Delete?' : 'Delete'}
              </span>
            </button>
          )}
          {tools}
          {action}
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-7 md:px-10 md:py-10">
        <div className={`mx-auto ${focusMode ? 'max-w-[40rem] pt-[6vh]' : 'max-w-[42rem]'}`}>{children}</div>
      </div>
    </article>
  );
}
