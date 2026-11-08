import { CalendarCheck, CalendarClock, CheckCheck, CircleCheck, ListTodo, Plus, TriangleAlert, type LucideIcon } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { EmptyState } from '../../components/EmptyState';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useToast } from '../../hooks/useToast';
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

const VIEW_TITLES: Record<TodoFilter, string> = {
  all: 'All tasks',
  active: 'Active tasks',
  completed: 'Finished tasks',
  today: 'Due today',
  upcoming: 'Coming up',
};

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

export function TodoView({ todos: state }: { todos: Todos }) {
  const { todos, saveFailed, addTodo, updateTodo, toggleTodo, deleteTodo, clearCompleted, restoreTodos } = state;
  const showToast = useToast();
  const [preferences, setPreferences] = useLocalStorage<ViewPreferences>(
    'daybook.todos.view',
    DEFAULT_PREFERENCES,
    parsePreferences,
  );
  const { filter, sort } = preferences;
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
    if (matchesFilter(todo, filter, today)) {
      showToast({ message: 'Task added' });
    } else {
      setFilter('all');
      showToast({ message: 'Task added, showing all tasks' });
    }
  }

  function handleSave(todo: Todo, draft: TodoDraft) {
    updateTodo(todo.id, draft);
    showToast({ message: 'Task updated' });
  }

  function handleDelete(todo: Todo) {
    deleteTodo(todo.id);
    showToast({ message: 'Task deleted', undo: () => restoreTodos([todo]) });
  }

  function handleClearCompleted() {
    const removed = todos.filter((todo) => todo.done);
    clearCompleted();
    showToast({
      message: `${removed.length} completed ${removed.length === 1 ? 'task' : 'tasks'} cleared`,
      undo: () => restoreTodos(removed),
    });
  }

  const focusComposer = () => composerInput.current?.focus();

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] md:h-full md:grid-cols-[17rem_minmax(0,1fr)] md:grid-rows-[minmax(0,1fr)] lg:grid-cols-[19rem_minmax(0,1fr)]">
      <aside className="md:bg-sunken border-line space-y-3 p-4 md:min-h-0 md:overflow-y-auto md:border-r">
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-2xl tracking-tight">Todo List</h1>
          <button type="button" onClick={focusComposer} className="btn btn-primary">
            <Plus className="size-4" aria-hidden />
            New task
          </button>
        </div>
        <p className="text-ink-soft -mt-2 text-sm">{formatLongDate(new Date())}</p>
        <TodoProgress completed={counts.completed} total={counts.all} overdue={overdue} dueToday={dueToday} />
        <TodoFilters value={filter} counts={counts} onChange={setFilter} />
      </aside>

      <section className="px-4 pb-20 md:min-h-0 md:overflow-y-auto md:px-8 md:pt-6 md:pb-20 lg:px-12">
        <div className="mx-auto max-w-3xl">
          {saveFailed && (
            <p role="alert" className="bg-accent-soft text-accent mb-3 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium">
              <TriangleAlert className="size-4 shrink-0" aria-hidden />
              Couldn't save your latest change. Your browser storage may be full.
            </p>
          )}

          <div className="mb-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
            <p className="font-serif text-xl tracking-tight">{VIEW_TITLES[filter]}</p>
            <div className="flex items-center gap-1 text-sm">
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
                      className={`chip ${isActive ? 'chip-on' : 'bg-transparent'}`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <TodoComposer inputRef={composerInput} presetDueDate={presetDueDate} onAdd={handleAdd} />

          {groups.length === 0 ? (
            <EmptyState
              {...EMPTY_MESSAGES[filter]}
              action={filter === 'all' ? { label: 'Add your first task', onClick: focusComposer } : undefined}
            />
          ) : (
            <div className="mt-5 space-y-6">
              {groups.map((group) => (
                <section key={group.id} aria-label={group.label}>
                  <div className="flex items-center justify-between px-1 pb-2">
                    <h2 className={`text-[0.8125rem] font-semibold ${group.isAlert ? 'text-accent' : 'text-ink-soft'}`}>
                      {group.label} <span className="font-normal tabular-nums opacity-70">{group.todos.length}</span>
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
                        onSave={(draft) => handleSave(todo, draft)}
                        onDelete={() => handleDelete(todo)}
                      />
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
