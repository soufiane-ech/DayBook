import { CalendarCheck, CalendarClock, CheckCheck, CircleCheck, ListTodo, Plus, type LucideIcon } from 'lucide-react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { EmptyState } from '../../components/EmptyState';
import { UndoToast } from '../../components/UndoToast';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { addDays, formatLongDate, toDateKey } from '../../lib/date';
import { TodoComposer } from './TodoComposer';
import { TodoFilters } from './TodoFilters';
import { TodoItem } from './TodoItem';
import { FILTERS, groupTodos, matchesFilter, SORTS, type TodoFilter, type TodoSort } from './todoOrganizer';
import { TodoProgress } from './TodoProgress';
import type { Todo, TodoDraft, Todos } from './useTodos';

interface ViewPreferences {
  filter: TodoFilter;
  sort: TodoSort;
}

const DEFAULT_PREFERENCES: ViewPreferences = { filter: 'all', sort: 'due' };

function parsePreferences(raw: unknown): ViewPreferences {
  const stored = (raw ?? {}) as Partial<ViewPreferences>;
  return {
    filter: FILTERS.find((filter) => filter === stored.filter) ?? DEFAULT_PREFERENCES.filter,
    sort: SORTS.find((sort) => sort === stored.sort) ?? DEFAULT_PREFERENCES.sort,
  };
}

const EMPTY_MESSAGES: Record<TodoFilter, { Icon: LucideIcon; title: string; hint: string }> = {
  all: { Icon: ListTodo, title: 'A clear list', hint: 'Add the first thing you want to get done.' },
  active: { Icon: CheckCheck, title: 'All caught up', hint: 'Nothing left to do right now.' },
  completed: { Icon: CircleCheck, title: 'Nothing finished yet', hint: 'Completed tasks will show up here.' },
  today: { Icon: CalendarCheck, title: 'Nothing due today', hint: 'Tasks due today and anything overdue will show up here.' },
  upcoming: { Icon: CalendarClock, title: 'Nothing coming up', hint: 'Tasks with a future due date will show up here.' },
};

const SORT_OPTIONS: { value: TodoSort; label: string }[] = [
  { value: 'due', label: 'Due date' },
  { value: 'priority', label: 'Priority' },
];

interface UndoState {
  /** Remounts the toast so its timer restarts. */
  key: number;
  message: string;
  removed: Todo[];
}

export function TodoView({ todos: state }: { todos: Todos }) {
  const { todos, addTodo, updateTodo, toggleTodo, deleteTodo, clearCompleted, restoreTodos } = state;
  const [preferences, setPreferences] = useLocalStorage<ViewPreferences>(
    'daybook.todos.view',
    DEFAULT_PREFERENCES,
    parsePreferences,
  );
  const { filter, sort } = preferences;
  const [undo, setUndo] = useState<UndoState | null>(null);
  const [refocusId, setRefocusId] = useState<string | null>(null);
  const composerInput = useRef<HTMLInputElement>(null);
  const today = toDateKey(new Date());

  const counts = useMemo(() => {
    const count = (option: TodoFilter) => todos.filter((todo) => matchesFilter(todo, option, today)).length;
    return {
      all: count('all'),
      active: count('active'),
      completed: count('completed'),
      today: count('today'),
      upcoming: count('upcoming'),
    };
  }, [todos, today]);

  const overdue = todos.filter((todo) => !todo.done && todo.dueDate !== null && todo.dueDate < today).length;
  const dueToday = todos.filter((todo) => !todo.done && todo.dueDate === today).length;

  const groups = useMemo(
    () => groupTodos(todos.filter((todo) => matchesFilter(todo, filter, today)), sort, today),
    [todos, filter, sort, today],
  );

  const presetDueDate = filter === 'today' ? today : filter === 'upcoming' ? addDays(today, 1) : null;

  function setFilter(next: TodoFilter) {
    setPreferences((current) => ({ ...current, filter: next }));
  }

  function setSort(next: TodoSort) {
    setPreferences((current) => ({ ...current, sort: next }));
  }

  function handleAdd(draft: TodoDraft) {
    const todo = addTodo(draft);
    // Otherwise the task just added would seem to vanish.
    if (!matchesFilter(todo, filter, today)) setFilter('all');
  }

  function handleDelete(todo: Todo) {
    deleteTodo(todo.id);
    setUndo({ key: Date.now(), message: 'Task deleted', removed: [todo] });
  }

  function handleClearCompleted() {
    const removed = todos.filter((todo) => todo.done);
    clearCompleted();
    setUndo({
      key: Date.now(),
      message: `${removed.length} completed ${removed.length === 1 ? 'task' : 'tasks'} cleared`,
      removed,
    });
  }

  const dismissUndo = useCallback(() => setUndo(null), []);

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-4 md:h-full md:grid-cols-[20rem_minmax(0,1fr)] md:grid-rows-[minmax(0,1fr)] md:gap-6">
      <aside className="-mx-1 space-y-3 px-1 pb-1 md:min-h-0 md:overflow-y-auto">
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-2xl tracking-tight">Todo List</h1>
          <button
            type="button"
            onClick={() => composerInput.current?.focus()}
            className="bg-ink text-paper flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium transition-transform duration-150 hover:-translate-y-px active:translate-y-0"
          >
            <Plus className="size-4" aria-hidden />
            New task
          </button>
        </div>
        <p className="text-ink-soft -mt-2 text-sm">{formatLongDate(new Date())}</p>
        <TodoProgress completed={counts.completed} total={counts.all} overdue={overdue} dueToday={dueToday} />
        <TodoFilters value={filter} counts={counts} onChange={setFilter} />
      </aside>

      <section className="-mx-1 px-1 pt-0.5 pb-20 md:min-h-0 md:overflow-y-auto">
        <TodoComposer inputRef={composerInput} presetDueDate={presetDueDate} onAdd={handleAdd} />

        <div className="mt-3 flex items-center justify-end gap-1 text-sm">
          <span className="text-ink-soft mr-1">Sort by</span>
          <div role="group" aria-label="Sort tasks" className="flex gap-1">
            {SORT_OPTIONS.map((option) => {
              const isActive = option.value === sort;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSort(option.value)}
                  aria-pressed={isActive}
                  className={`rounded-full px-3 py-1 transition-colors duration-200 ${
                    isActive ? 'bg-accent-soft text-accent font-medium' : 'text-ink-soft hover:text-ink'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {groups.length === 0 ? (
          <EmptyState {...EMPTY_MESSAGES[filter]} />
        ) : (
          <div className="mt-2 space-y-5">
            {groups.map((group) => (
              <section key={group.id} aria-label={group.label}>
                <div className="flex items-center justify-between px-1 pb-2">
                  <h2 className={`text-xs font-medium ${group.isAlert ? 'text-accent' : 'text-ink-soft'}`}>
                    {group.label} <span className="tabular-nums opacity-70">{group.todos.length}</span>
                  </h2>
                  {group.id === 'completed' && (
                    <button
                      type="button"
                      onClick={handleClearCompleted}
                      className="text-ink-soft hover:text-accent rounded-md text-xs font-medium transition-colors"
                    >
                      Clear completed
                    </button>
                  )}
                </div>
                <ul className="space-y-2">
                  {group.todos.map((todo) => (
                    <TodoItem
                      key={todo.id}
                      todo={todo}
                      today={today}
                      restoreFocus={todo.id === refocusId}
                      onToggle={(viaKeyboard) => {
                        setRefocusId(viaKeyboard ? todo.id : null);
                        toggleTodo(todo.id);
                      }}
                      onSave={(draft) => updateTodo(todo.id, draft)}
                      onDelete={() => handleDelete(todo)}
                    />
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </section>

      {undo && (
        <UndoToast
          key={undo.key}
          message={undo.message}
          onDismiss={dismissUndo}
          onUndo={() => {
            restoreTodos(undo.removed);
            setUndo(null);
          }}
        />
      )}
    </div>
  );
}
