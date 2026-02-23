interface LoadingSkeletonProps {
  rows?: number;
}

export function LoadingSkeleton({ rows = 3 }: LoadingSkeletonProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-16 rounded-xl animate-pulse"
          style={{ background: "var(--color-layer)", opacity: 1 - i * 0.15 }}
        />
      ))}
    </div>
  );
}
