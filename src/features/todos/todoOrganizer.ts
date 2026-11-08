import { PRIORITIES, priorityRank } from './priorities';
import type { Todo } from './useTodos';

export const FILTERS = ['all', 'active', 'completed', 'today', 'upcoming'] as const;
export type TodoFilter = (typeof FILTERS)[number];

export const SORTS = ['due', 'priority'] as const;
export type TodoSort = (typeof SORTS)[number];

export interface TodoGroup {
  id: string;
  label: string;
  isAlert?: boolean;
  todos: Todo[];
}

const NO_DUE_DATE = '9999-99-99';

export function matchesFilter(todo: Todo, filter: TodoFilter, today: string): boolean {
  const { done, dueDate } = todo;
  switch (filter) {
    case 'all':
      return true;
    case 'active':
      return !done;
    case 'completed':
      return done;
    case 'today':
      // Overdue work counts as today's. Tasks finished today stay listed as a record of the day.
      return dueDate !== null && (done ? dueDate === today : dueDate <= today);
    case 'upcoming':
      return !done && dueDate !== null && dueDate > today;
  }
}

function compareDue(a: Todo, b: Todo): number {
  return (a.dueDate ?? NO_DUE_DATE).localeCompare(b.dueDate ?? NO_DUE_DATE);
}

function comparePriority(a: Todo, b: Todo): number {
  return priorityRank(a.priority) - priorityRank(b.priority);
}

function compareNewest(a: Todo, b: Todo): number {
  return b.createdAt.localeCompare(a.createdAt);
}

function comparerFor(sort: TodoSort) {
  return (a: Todo, b: Todo) =>
    sort === 'due'
      ? compareDue(a, b) || comparePriority(a, b) || compareNewest(a, b)
      : comparePriority(a, b) || compareDue(a, b) || compareNewest(a, b);
}

/** Splits tasks into labeled groups, most pressing first, with completed tasks always last. */
export function groupTodos(todos: Todo[], sort: TodoSort, today: string): TodoGroup[] {
  const compare = comparerFor(sort);
  const active = todos.filter((todo) => !todo.done).sort(compare);
  const completed = todos.filter((todo) => todo.done).sort(compare);

  const activeGroups: TodoGroup[] =
    sort === 'due'
      ? [
          {
            id: 'overdue',
            label: 'Overdue',
            isAlert: true,
            todos: active.filter((todo) => todo.dueDate !== null && todo.dueDate < today),
          },
          { id: 'today', label: 'Today', todos: active.filter((todo) => todo.dueDate === today) },
          {
            id: 'upcoming',
            label: 'Upcoming',
            todos: active.filter((todo) => todo.dueDate !== null && todo.dueDate > today),
          },
          { id: 'no-date', label: 'No due date', todos: active.filter((todo) => todo.dueDate === null) },
        ]
      : PRIORITIES.map((priority) => ({
          id: priority.id,
          label: `${priority.label} priority`,
          todos: active.filter((todo) => todo.priority === priority.id),
        }));

  return [...activeGroups, { id: 'completed', label: 'Completed', todos: completed }].filter(
    (group) => group.todos.length > 0,
  );
}
