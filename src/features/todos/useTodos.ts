import { useCallback } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { createId } from '../../lib/id';

export interface Todo {
  id: string;
  text: string;
  done: boolean;
  createdAt: string;
}

export function useTodos() {
  const [todos, setTodos] = useLocalStorage<Todo[]>('daybook.todos', []);

  const addTodo = useCallback(
    (text: string) => {
      const todo: Todo = { id: createId(), text, done: false, createdAt: new Date().toISOString() };
      setTodos((current) => [todo, ...current]);
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

  const renameTodo = useCallback(
    (id: string, text: string) => {
      setTodos((current) => current.map((todo) => (todo.id === id ? { ...todo, text } : todo)));
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

  return { todos, addTodo, toggleTodo, renameTodo, deleteTodo, clearCompleted };
}

export type Todos = ReturnType<typeof useTodos>;
