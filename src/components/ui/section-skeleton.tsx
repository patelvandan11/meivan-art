export function SectionSkeleton({ className = "h-96" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-secondary/30 ${className}`}
      aria-hidden="true"
    />
  );
}
