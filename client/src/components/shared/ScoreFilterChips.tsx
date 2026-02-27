import { RiSortDesc, RiSortAsc } from "react-icons/ri";
import type { ScoreFilter, SortDirection } from "../../types";

interface ScoreFilterChipsProps {
  filter: ScoreFilter;
  onFilterChange: (filter: ScoreFilter) => void;
  sortDirection: SortDirection;
  onToggleSort: () => void;
}

const FILTERS: Array<{ label: string; value: ScoreFilter }> = [
  { label: "All", value: "all" },
  { label: "80+", value: "80+" },
  { label: "70\u201379", value: "70-79" },
  { label: "<70", value: "<70" },
];

export function ScoreFilterChips({
  filter,
  onFilterChange,
  sortDirection,
  onToggleSort,
}: ScoreFilterChipsProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {FILTERS.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => onFilterChange(value)}
          className={`px-3.5 py-[7px] rounded-lg text-[13px] font-medium transition-all cursor-pointer border ${
            filter === value
              ? "bg-linear-to-br from-brand to-[#6358E0] text-white border-transparent shadow-[0_2px_12px_rgba(124,111,255,0.3)] font-bold"
              : "bg-transparent text-ink3 border-edge hover:bg-layer"
          }`}
        >
          {label}
        </button>
      ))}

      <div className="w-px h-5 bg-edge mx-1" />

      <button
        onClick={onToggleSort}
        className="flex items-center gap-1.5 px-3 py-[7px] rounded-lg text-[13px] font-medium text-ink3 bg-transparent border border-edge cursor-pointer transition-all hover:bg-layer"
      >
        {sortDirection === "desc" ? <RiSortDesc size={14} /> : <RiSortAsc size={14} />}
        Score
      </button>
    </div>
  );
}
