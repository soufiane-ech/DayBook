import { MOODS, type MoodId } from './moods';

interface MoodPickerProps {
  selected: MoodId[];
  onToggle: (mood: MoodId) => void;
  /** Shows emojis alone, for tight spaces such as the filter panel. */
  compact?: boolean;
}

export function MoodPicker({ selected, onToggle, compact = false }: MoodPickerProps) {
  return (
    <div className={`grid gap-1 ${compact ? 'grid-cols-8' : 'grid-cols-4 lg:grid-cols-8'}`}>
      {MOODS.map((mood) => {
        const isSelected = selected.includes(mood.id);
        return (
          <button
            key={mood.id}
            type="button"
            onClick={() => onToggle(mood.id)}
            aria-pressed={isSelected}
            aria-label={mood.label}
            title={mood.label}
            className={`flex flex-col items-center gap-1 rounded-lg border transition duration-200 hover:-translate-y-0.5 active:translate-y-0 ${
              compact ? 'py-1' : 'px-1 py-2'
            } ${isSelected ? 'border-accent/50 bg-accent-soft' : 'hover:bg-line/50 border-transparent'}`}
          >
            <span
              aria-hidden
              className={`leading-none transition-transform duration-200 ease-out ${
                compact ? 'text-lg' : 'text-2xl'
              } ${isSelected ? 'scale-110' : ''}`}
            >
              {mood.emoji}
            </span>
            {!compact && (
              <span className={`text-xs ${isSelected ? 'text-accent font-medium' : 'text-ink-soft'}`}>
                {mood.label}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
