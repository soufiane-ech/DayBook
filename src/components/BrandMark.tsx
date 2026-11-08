import { Bookmark } from 'lucide-react';

export function BrandMark() {
  return (
    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#c25a30] text-white shadow-sm">
      <Bookmark className="size-[1.05rem]" fill="currentColor" aria-hidden />
    </span>
  );
}
