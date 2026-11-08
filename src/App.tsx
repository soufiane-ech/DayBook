import { MobileHeader, MobileTabBar, SidebarNavigation } from './components/Navigation';
import { ToastProvider } from './components/ToastProvider';
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
  const counts = {
    journal: journal.entries.length,
    todos: todos.todos.filter((todo) => !todo.done).length,
  };

  return (
    <ToastProvider>
      <div className="flex h-dvh">
        <SidebarNavigation route={route} counts={counts} />
        <div className="flex min-w-0 flex-1 flex-col">
          <MobileHeader />
          <main className="min-h-0 flex-1 overflow-y-auto">
            <div key={route} className="animate-view-in h-full">
              {route === 'journal' ? <JournalView journal={journal} /> : <TodoView todos={todos} />}
            </div>
          </main>
          <MobileTabBar route={route} />
        </div>
      </div>
    </ToastProvider>
  );
}
