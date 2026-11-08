/** Listed from most to least urgent, which is also the sort order. */
export const PRIORITIES = [
  { id: 'high', label: 'High', text: 'text-priority-high', ring: 'border-priority-high' },
  { id: 'medium', label: 'Medium', text: 'text-priority-medium', ring: 'border-priority-medium' },
  { id: 'low', label: 'Low', text: 'text-priority-low', ring: 'border-priority-low' },
] as const;

export type Priority = (typeof PRIORITIES)[number];
export type PriorityId = Priority['id'];

export const DEFAULT_PRIORITY: PriorityId = 'medium';

export function findPriority(id: unknown): Priority | undefined {
  return PRIORITIES.find((priority) => priority.id === id);
}

export function priorityRank(id: PriorityId): number {
  return PRIORITIES.findIndex((priority) => priority.id === id);
}
