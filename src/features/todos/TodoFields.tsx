import { addDays, toDateKey } from '../../lib/date';
import { PRIORITIES } from './priorities';
import type { TodoDraft } from './useTodos';

interface TodoFieldsProps {
  draft: TodoDraft;
  onChange: (changes: Partial<TodoDraft>) => void;
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
          <span className="section-label">Due date</span>
          <div className="flex flex-wrap items-center gap-1.5">
            <input
              type="date"
              value={draft.dueDate ?? ''}
              onChange={(event) => onChange({ dueDate: event.target.value || null })}
              aria-label="Due date"
              className="field text-ink-soft min-w-0 py-1 text-sm"
            />
            {shortcuts.map(({ label, date }) => {
              const isSelected = draft.dueDate === date;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => onChange({ dueDate: isSelected ? null : date })}
                  aria-pressed={isSelected}
                  className={`chip ${isSelected ? 'chip-on' : ''}`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div role="group" aria-label="Priority">
          <span className="section-label">Priority</span>
          <div className="flex gap-1.5">
            {PRIORITIES.map((priority) => {
              const isSelected = draft.priority === priority.id;
              return (
                <button
                  key={priority.id}
                  type="button"
                  onClick={() => onChange({ priority: priority.id })}
                  aria-pressed={isSelected}
                  className={`chip ${isSelected ? 'chip-on' : ''}`}
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
