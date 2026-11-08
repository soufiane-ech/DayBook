import { CircleCheck } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { ToastContext, type ToastOptions } from '../hooks/useToast';

const VISIBLE_MS = 3000;
const VISIBLE_WITH_UNDO_MS = 6000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<(ToastOptions & { id: number }) | null>(null);
  const nextId = useRef(0);

  const show = useCallback((options: ToastOptions) => {
    nextId.current += 1;
    setToast({ ...options, id: nextId.current });
  }, []);

  const dismiss = useCallback(() => setToast(null), []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      {toast && <Toast key={toast.id} toast={toast} onDismiss={dismiss} />}
    </ToastContext.Provider>
  );
}

function Toast({ toast, onDismiss }: { toast: ToastOptions; onDismiss: () => void }) {
  const { message, undo } = toast;

  useEffect(() => {
    const timer = window.setTimeout(onDismiss, undo ? VISIBLE_WITH_UNDO_MS : VISIBLE_MS);
    return () => window.clearTimeout(timer);
  }, [onDismiss, undo]);

  return (
    // Sits above the tab bar on phones and in the corner on larger screens.
    <div className="pointer-events-none fixed inset-x-4 bottom-20 z-50 flex justify-center md:inset-x-6 md:bottom-6 md:justify-end">
      <div
        role="status"
        className="animate-view-in border-line bg-card shadow-lifted pointer-events-auto flex items-center gap-2.5 rounded-xl border py-2 pr-2 pl-3 text-sm"
      >
        <CircleCheck className="text-accent size-4 shrink-0" aria-hidden />
        <span className="py-1 pr-2">{message}</span>
        {undo && (
          <button
            type="button"
            onClick={() => {
              undo();
              onDismiss();
            }}
            className="btn btn-quiet text-accent hover:text-accent"
          >
            Undo
          </button>
        )}
      </div>
    </div>
  );
}
