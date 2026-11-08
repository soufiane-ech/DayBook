import { useState, type FormEvent, type KeyboardEvent } from 'react';
import { TodoFields } from './TodoFields';
import type { Todo, TodoDraft } from './useTodos';

interface TodoEditorProps {
  todo: Todo;
  onSave: (draft: TodoDraft) => void;
  onCancel: () => void;
}

export function TodoEditor({ todo, onSave, onCancel }: TodoEditorProps) {
  const [draft, setDraft] = useState<TodoDraft>({
    title: todo.title,
    description: todo.description,
    dueDate: todo.dueDate,
    priority: todo.priority,
  });
  const title = draft.title.trim();

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (title) onSave({ ...draft, title, description: draft.description.trim() });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLFormElement>) {
    if (event.key === 'Escape') onCancel();
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) event.currentTarget.requestSubmit();
  }

  return (
    <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="animate-view-in w-full space-y-2">
      <input
        autoFocus
        value={draft.title}
        onChange={(event) => setDraft({ ...draft, title: event.target.value })}
        aria-label="Task title"
        placeholder="Task title"
        className="writing-field placeholder:text-ink-soft/70 w-full bg-transparent text-base font-medium"
      />
      <TodoFields draft={draft} onChange={(changes) => setDraft({ ...draft, ...changes })} />
      <div className="flex justify-end gap-1">
        <button type="button" onClick={onCancel} className="btn btn-quiet">
          Cancel
        </button>
        <button type="submit" disabled={!title} className="btn btn-primary">
          Save
        </button>
      </div>
    </form>
  );
}
