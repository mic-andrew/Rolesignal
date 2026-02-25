interface LoadingSkeletonProps {
  rows?: number;
  variant?: "default" | "card" | "stat";
}

const HEIGHT_CLASSES = {
  default: "h-14",
  card: "h-24",
  stat: "h-20",
};

export function LoadingSkeleton({ rows = 3, variant = "default" }: LoadingSkeletonProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className={`${HEIGHT_CLASSES[variant]} rounded-xl animate-pulse bg-layer`}
          style={{ opacity: 1 - i * 0.15 }}
        />
      ))}
    </div>
  );
}
