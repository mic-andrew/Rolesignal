interface MeetButtonProps {
  icon: React.ComponentType<{ size: number }>;
  toggled?: boolean;
  danger?: boolean;
  label?: string;
  onClick?: () => void;
}

export function MeetButton({
  icon: Icon,
  toggled = false,
  danger = false,
  label,
  onClick,
}: MeetButtonProps) {
  const bgClass = danger
    ? "bg-[#EA4335]"
    : toggled
      ? "bg-[#3C4043]"
      : "bg-white/[0.08]";

  const sizeClass = danger
    ? "w-14 h-12 rounded-3xl"
    : "w-12 h-12 rounded-full";

  return (
    <button
      onClick={onClick}
      title={label}
      className={`relative group flex items-center justify-center cursor-pointer border-0 transition-colors duration-200 text-[#E8EAED] ${sizeClass} ${bgClass}`}
    >
      <Icon size={20} />
      {label && (
        <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[11px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-[#9AA0A6]">
          {label}
        </span>
      )}
    </button>
  );
}
