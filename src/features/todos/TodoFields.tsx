import { addDays, toDateKey } from '../../lib/date';
import { PRIORITIES } from './priorities';
import type { TodoDraft } from './useTodos';

interface TodoFieldsProps {
  draft: TodoDraft;
  onChange: (changes: Partial<TodoDraft>) => void;
}

const LABEL_CLASS = 'text-ink-soft mb-1.5 block text-xs font-medium';

function optionClass(isSelected: boolean): string {
  return `rounded-full px-2.5 py-1 text-sm transition-colors duration-200 ${
    isSelected ? 'bg-accent-soft text-accent font-medium' : 'bg-line/60 text-ink-soft hover:text-ink'
  }`;
}

/** The fields shared by adding and editing a task, everything but the title. */
export function TodoFields({ draft, onChange }: TodoFieldsProps) {
  const today = toDateKey(new Date());
  const shortcuts = [
    { label: 'Today', date: today },
    { label: 'Tomorrow', date: addDays(today, 1) },
  ];

  return (
    <div className="space-y-3">
      <div data-value={draft.description} className="autogrow min-h-12 text-sm leading-6">
        <textarea
          value={draft.description}
          onChange={(event) => onChange({ description: event.target.value })}
          placeholder="Add details (optional)"
          aria-label="Task description"
          className="writing-field placeholder:text-ink-soft/70 w-full bg-transparent"
        />
      </div>

      <div className="border-line flex flex-wrap gap-x-6 gap-y-3 border-t pt-3">
        <div className="min-w-0">
          <span className={LABEL_CLASS}>Due date</span>
          <div className="flex flex-wrap items-center gap-1.5">
            <input
              type="date"
              value={draft.dueDate ?? ''}
              onChange={(event) => onChange({ dueDate: event.target.value || null })}
              aria-label="Due date"
              className="border-line text-ink-soft hover:border-ink-soft/40 min-w-0 rounded-lg border bg-transparent px-2 py-1 text-sm transition-colors"
            />
            {shortcuts.map(({ label, date }) => {
              const isSelected = draft.dueDate === date;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => onChange({ dueDate: isSelected ? null : date })}
                  aria-pressed={isSelected}
                  className={optionClass(isSelected)}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div role="group" aria-label="Priority">
          <span className={LABEL_CLASS}>Priority</span>
          <div className="flex gap-1.5">
            {PRIORITIES.map((priority) => {
              const isSelected = draft.priority === priority.id;
              return (
                <button
                  key={priority.id}
                  type="button"
                  onClick={() => onChange({ priority: priority.id })}
                  aria-pressed={isSelected}
                  className={optionClass(isSelected)}
                >
                  {priority.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export const SAVE_BUTTON_CLASS =
  'bg-ink text-paper rounded-full px-3.5 py-1.5 text-sm font-medium transition duration-150 hover:-translate-y-px active:translate-y-0 disabled:translate-y-0 disabled:cursor-default disabled:opacity-30';

export const CANCEL_BUTTON_CLASS =
  'text-ink-soft hover:text-ink rounded-full px-3 py-1.5 text-sm transition-colors duration-200';
