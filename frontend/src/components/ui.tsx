import { Search } from "lucide-react";

export function SearchInput({ placeholder }: { placeholder: string }) {
  return (
    <div className="relative">
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
      />
      <input
        type="text"
        placeholder={placeholder}
        className="w-full h-10 pl-9 pr-3 rounded-[var(--radius-md)] border border-[var(--color-border)]
          text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]
          focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)]"
      />
    </div>
  );
}
