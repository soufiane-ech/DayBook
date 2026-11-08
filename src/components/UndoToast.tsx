import { useEffect } from 'react';

const VISIBLE_MS = 6000;

interface UndoToastProps {
  message: string;
  onUndo: () => void;
  onDismiss: () => void;
}

export function UndoToast({ message, onUndo, onDismiss }: UndoToastProps) {
  useEffect(() => {
    const timer = window.setTimeout(onDismiss, VISIBLE_MS);
    return () => window.clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-4 z-20 flex justify-center">
      <div
        role="status"
        className="animate-view-in bg-ink text-paper pointer-events-auto flex items-center gap-4 rounded-full py-2 pr-2 pl-4 text-sm shadow-lg"
      >
        {message}
        <button
          type="button"
          onClick={onUndo}
          className="bg-paper/15 hover:bg-paper/25 rounded-full px-3 py-1 font-medium transition-colors duration-200"
        >
          Undo
        </button>
      </div>
    </div>
  );
}
