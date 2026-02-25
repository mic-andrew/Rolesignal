import { RiSearchLine, RiNotification3Line } from "react-icons/ri";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header
      className="sticky top-0 z-20 flex items-center justify-between shrink-0 h-16 px-6 border-b border-edge bg-canvas/95 backdrop-blur-md"
    >
      <h1 className="text-xl font-extrabold tracking-[-0.03em] text-ink">{title}</h1>

      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-2 cursor-pointer py-[7px] px-4 bg-layer border border-edge rounded-lg text-xs text-ink3 font-medium"
        >
          <RiSearchLine size={16} />
          <span>Search...</span>
          <span
            className="py-px px-1.5 bg-edge rounded-[4px] text-[10px] font-semibold ml-2"
          >
            /
          </span>
        </div>

        <button
          className="relative cursor-pointer bg-transparent border-0 text-ink2 p-1.5"
          aria-label="Notifications"
        >
          <RiNotification3Line size={18} />
          <span
            className="absolute flex items-center justify-center text-white top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-danger text-[9px] font-bold border-2 border-canvas"
          >
            3
          </span>
        </button>
      </div>
    </header>
  );
}
