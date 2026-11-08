import { useCallback } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { createId } from '../../lib/id';
import { DEFAULT_PRIORITY, findPriority, type PriorityId } from './priorities';

export interface Todo {
  id: string;
  title: string;
  description: string;
  /** A local 'YYYY-MM-DD' key, or null when the task has no deadline. */
  dueDate: string | null;
  priority: PriorityId;
  done: boolean;
  createdAt: string;
}

export type TodoDraft = Pick<Todo, 'title' | 'description' | 'dueDate' | 'priority'>;

type StoredTodo = Partial<Todo> & Pick<Todo, 'id' | 'createdAt'> & { text?: string };

/** Fills in fields missing from tasks saved by earlier versions of DayBook. */
function parseTodos(raw: unknown): Todo[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((stored: StoredTodo) => ({
    id: stored.id,
    title: stored.title ?? stored.text ?? '',
    description: stored.description ?? '',
    dueDate: stored.dueDate ?? null,
    priority: findPriority(stored.priority)?.id ?? DEFAULT_PRIORITY,
    done: Boolean(stored.done),
    createdAt: stored.createdAt,
  }));
}

export function useTodos() {
  const [todos, setTodos, saveFailed] = useLocalStorage<Todo[]>('daybook.todos', [], parseTodos);

  const addTodo = useCallback(
    (draft: TodoDraft): Todo => {
      const todo: Todo = { ...draft, id: createId(), done: false, createdAt: new Date().toISOString() };
      setTodos((current) => [todo, ...current]);
      return todo;
    },
    [setTodos],
  );

  const updateTodo = useCallback(
    (id: string, draft: TodoDraft) => {
      setTodos((current) => current.map((todo) => (todo.id === id ? { ...todo, ...draft } : todo)));
    },
    [setTodos],
  );

  const toggleTodo = useCallback(
    (id: string) => {
      setTodos((current) =>
        current.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo)),
      );
    },
    [setTodos],
  );

  const deleteTodo = useCallback(
    (id: string) => {
      setTodos((current) => current.filter((todo) => todo.id !== id));
    },
    [setTodos],
  );

  const clearCompleted = useCallback(() => {
    setTodos((current) => current.filter((todo) => !todo.done));
  }, [setTodos]);

  /** Puts back tasks that were just removed. */
  const restoreTodos = useCallback(
    (removed: Todo[]) => {
      setTodos((current) => [...current, ...removed]);
    },
    [setTodos],
  );

  return { todos, saveFailed, addTodo, updateTodo, toggleTodo, deleteTodo, clearCompleted, restoreTodos };
}

export type Todos = ReturnType<typeof useTodos>;
