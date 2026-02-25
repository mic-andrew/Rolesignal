import { RiSearchLine } from "react-icons/ri";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({ value, onChange, placeholder = "Search..." }: SearchInputProps) {
  return (
    <div className="flex items-center flex-1 gap-2.5 px-4 py-3 bg-layer2 border border-edge2 rounded-xl shadow-(--sh1)">
      <RiSearchLine size={16} className="text-ink3 shrink-0" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 text-sm text-ink bg-transparent border-none outline-none placeholder:text-ink3"
      />
    </div>
  );
}
