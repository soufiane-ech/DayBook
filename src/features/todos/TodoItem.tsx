import { CalendarDays, Check, Flag, Pencil, X } from 'lucide-react';
import { useState, type AnimationEvent, type ChangeEvent } from 'react';
import { addDays, formatShortDate } from '../../lib/date';
import { findPriority } from './priorities';
import { TodoEditor } from './TodoEditor';
import type { Todo, TodoDraft } from './useTodos';

interface TodoItemProps {
  todo: Todo;
  today: string;
  /** Returns focus to this checkbox after a keyboard toggle moved the task. */
  restoreFocus: boolean;
  onToggle: (viaKeyboard: boolean) => void;
  onSave: (draft: TodoDraft) => void;
  onDelete: () => void;
}

function describeDue(dueDate: string, today: string, done: boolean) {
  const date = formatShortDate(dueDate, today);
  if (done) return { label: date, isOverdue: false };
  if (dueDate < today) return { label: `Overdue · ${date}`, isOverdue: true };
  if (dueDate === today) return { label: 'Today', isOverdue: false };
  if (dueDate === addDays(today, 1)) return { label: 'Tomorrow', isOverdue: false };
  return { label: date, isOverdue: false };
}

export function TodoItem({ todo, today, restoreFocus, onToggle, onSave, onDelete }: TodoItemProps) {
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [exit, setExit] = useState<{ run: () => void; isToggle: boolean } | null>(null);

  const priority = findPriority(todo.priority);
  const due = todo.dueDate ? describeDue(todo.dueDate, today, todo.done) : null;
  const isToggling = exit?.isToggle ?? false;
  const looksChecked = isToggling ? !todo.done : todo.done;

  function handleToggle(event: ChangeEvent<HTMLInputElement>) {
    if (exit) return;
    const viaKeyboard = event.target.matches(':focus-visible');
    setExit({ run: () => onToggle(viaKeyboard), isToggle: true });
  }

  function handleAnimationEnd(event: AnimationEvent<HTMLLIElement>) {
    if (event.target === event.currentTarget && event.animationName === 'item-out') exit?.run();
  }

  const entrance = exit ? (exit.isToggle ? 'animate-item-done' : 'animate-item-out') : 'animate-item-in';
  const surface = todo.done
    ? 'bg-line/30 border-transparent'
    : 'border-line bg-card shadow-sm hover:shadow-md';

  return (
    <li
      onAnimationEnd={handleAnimationEnd}
      className={`${entrance} ${surface} group relative flex items-start gap-3 overflow-hidden rounded-xl border py-3 pr-2.5 pl-4 transition-shadow duration-200`}
    >
      {!todo.done && !editing && priority && (
        <span aria-hidden className={`${priority.bar} absolute inset-y-0 left-0 w-1`} />
      )}

      {editing ? (
        <TodoEditor
          todo={todo}
          onCancel={() => setEditing(false)}
          onSave={(draft) => {
            onSave(draft);
            setEditing(false);
          }}
        />
      ) : (
        <>
          <label className="relative grid size-6 shrink-0 cursor-pointer place-items-center">
            <input
              type="checkbox"
              checked={looksChecked}
              onChange={handleToggle}
              autoFocus={restoreFocus}
              aria-label={`Mark "${todo.title}" as ${todo.done ? 'not done' : 'done'}`}
              className="peer sr-only"
            />
            <span className="border-ink-soft/40 hover:border-accent peer-checked:border-accent peer-checked:bg-accent peer-focus-visible:outline-accent size-5 rounded-full border-[1.5px] transition-colors duration-200 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2" />
            <Check
              aria-hidden
              strokeWidth={3}
              className={`text-paper absolute size-3 transition-transform duration-200 ease-out ${
                looksChecked ? 'scale-100' : 'scale-0'
              }`}
            />
          </label>

          <div className="min-w-0 flex-1">
            <p
              onDoubleClick={() => setEditing(true)}
              className={`leading-6 wrap-anywhere transition-colors duration-200 ${
                looksChecked ? 'text-ink-soft line-through' : 'font-medium'
              }`}
            >
              {todo.title}
            </p>

            {todo.description && (
              <button
                type="button"
                onClick={() => setExpanded((value) => !value)}
                aria-expanded={expanded}
                aria-label={`${expanded ? 'Collapse' : 'Expand'} details of "${todo.title}"`}
                className={`text-ink-soft mt-0.5 w-full rounded-md text-left text-sm leading-5 wrap-anywhere whitespace-pre-wrap ${
                  expanded ? 'block' : 'line-clamp-2'
                } ${todo.done ? 'opacity-70' : ''}`}
              >
                {todo.description}
              </button>
            )}

            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
              {due && (
                <span
                  className={`flex items-center gap-1 ${
                    due.isOverdue ? 'bg-accent-soft text-accent -mx-1.5 rounded-full px-1.5 py-0.5 font-medium' : 'text-ink-soft'
                  }`}
                >
                  <CalendarDays className="size-3.5" aria-hidden />
                  {due.label}
                </span>
              )}
              {priority && (
                <span className={`flex items-center gap-1 ${todo.done ? 'text-ink-soft' : priority.text}`}>
                  <Flag className="size-3.5" aria-hidden />
                  {priority.label}
                </span>
              )}
            </div>
          </div>

          {/* Always visible on touch screens, which have no hover. */}
          <div className="flex shrink-0 gap-0.5 transition-opacity duration-150 group-focus-within:opacity-100 group-hover:opacity-100 pointer-fine:opacity-0">
            <button
              type="button"
              onClick={() => setEditing(true)}
              aria-label={`Edit "${todo.title}"`}
              className="text-ink-soft hover:text-ink rounded-md p-1 transition-colors"
            >
              <Pencil className="size-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => setExit({ run: onDelete, isToggle: false })}
              aria-label={`Delete "${todo.title}"`}
              className="text-ink-soft hover:text-accent rounded-md p-1 transition-colors"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>
        </>
      )}
    </li>
  );
}
