import { CheckCheck } from 'lucide-react';
import { useState } from 'react';
import { EmptyState } from '../../components/EmptyState';
import { formatLongDate } from '../../lib/date';
import { TodoFilters, type TodoFilter } from './TodoFilters';
import { TodoForm } from './TodoForm';
import { TodoItem } from './TodoItem';
import type { Todo, Todos } from './useTodos';

const MATCHES_FILTER: Record<TodoFilter, (todo: Todo) => boolean> = {
  all: () => true,
  active: (todo) => !todo.done,
  done: (todo) => todo.done,
};

const EMPTY_MESSAGES: Record<TodoFilter, { title: string; hint: string }> = {
  all: { title: 'A clear list', hint: 'Add the first thing you want to get done.' },
  active: { title: 'All caught up', hint: 'Nothing left to do right now.' },
  done: { title: 'Nothing finished yet', hint: 'Completed tasks will show up here.' },
};

export function TodoView({ todos: state }: { todos: Todos }) {
  const { todos, addTodo, toggleTodo, renameTodo, deleteTodo, clearCompleted } = state;
  const [filter, setFilter] = useState<TodoFilter>('all');

  const doneCount = todos.filter((todo) => todo.done).length;
  const visible = todos.filter(MATCHES_FILTER[filter]);
  const progress = todos.length === 0 ? 0 : (doneCount / todos.length) * 100;

  return (
    <div className="mx-auto max-w-2xl pb-6">
      <p className="text-ink-soft text-sm">{formatLongDate(new Date())}</p>
      <h1 className="font-serif text-2xl tracking-tight">Todo List</h1>

      <div className="mt-4 flex items-center gap-3">
        <div className="bg-line h-1.5 flex-1 overflow-hidden rounded-full">
          <div
            className="bg-accent h-full rounded-full transition-[width] duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-ink-soft text-sm tabular-nums">
          {doneCount} of {todos.length} done
        </span>
      </div>

      <TodoForm onAdd={addTodo} />

      <div className="mt-5 flex items-center justify-between gap-3">
        <TodoFilters value={filter} onChange={setFilter} />
        {doneCount > 0 && (
          <button
            type="button"
            onClick={clearCompleted}
            className="animate-item-in text-ink-soft hover:text-accent rounded-md text-sm whitespace-nowrap transition-colors"
          >
            Clear done
          </button>
        )}
      </div>

      {visible.length === 0 ? (
        <EmptyState Icon={CheckCheck} {...EMPTY_MESSAGES[filter]} />
      ) : (
        <ul className="mt-3 space-y-2">
          {visible.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={() => toggleTodo(todo.id)}
              onRename={(text) => renameTodo(todo.id, text)}
              onDelete={() => deleteTodo(todo.id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
