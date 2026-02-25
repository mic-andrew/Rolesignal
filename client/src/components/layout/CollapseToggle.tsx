import { RiMenuFoldLine, RiMenuUnfoldLine } from "react-icons/ri";

interface CollapseToggleProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function CollapseToggle({ collapsed, onToggle }: CollapseToggleProps) {
  if (collapsed) {
    return (
      <button
        onClick={onToggle}
        className="w-8 h-8 rounded-md flex items-center justify-center cursor-pointer bg-transparent border-none text-ink3 mx-auto mt-2.5 transition-all duration-150 hover:text-ink2 hover:bg-(--acg2)"
      >
        <RiMenuUnfoldLine size={16} />
      </button>
    );
  }
  return (
    <button
      onClick={onToggle}
      className="w-7 h-7 rounded-md flex items-center justify-center cursor-pointer bg-transparent border-none text-ink3 shrink-0 transition-all duration-150 hover:text-ink2 hover:bg-(--acg2)"
    >
      <RiMenuFoldLine size={16} />
    </button>
  );
}
