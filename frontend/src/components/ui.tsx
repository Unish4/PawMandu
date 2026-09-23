import { Search } from "lucide-react";

interface SearchInputProps {
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
}

export function SearchInput({
  placeholder,
  value,
  onChange,
}: SearchInputProps) {
  return (
    <div className="relative">
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
      />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full h-10 pl-9 pr-3 rounded-[var(--radius-md)] border border-[var(--color-border)]
          text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]
          focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)]"
      />
    </div>
  );
}
