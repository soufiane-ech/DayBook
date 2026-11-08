import { Header } from './components/Header';
import { JournalView } from './features/journal/JournalView';
import { useJournal } from './features/journal/useJournal';
import { TodoView } from './features/todos/TodoView';
import { useTodos } from './features/todos/useTodos';
import { useHashRoute } from './hooks/useHashRoute';

export function App() {
  const route = useHashRoute();
  // Held here so state survives switching sections.
  const journal = useJournal();
  const todos = useTodos();

  return (
    <div className="flex h-dvh flex-col">
      <Header route={route} />
      <main className="min-h-0 flex-1 overflow-y-auto">
        <div key={route} className="animate-view-in mx-auto h-full w-full max-w-5xl px-4 pb-4 sm:px-6 sm:pb-6">
          {route === 'journal' ? <JournalView journal={journal} /> : <TodoView todos={todos} />}
        </div>
      </main>
    </div>
  );
}
