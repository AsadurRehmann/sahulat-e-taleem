export function SkeletonCard() {
  return (
    <div className="skeleton-card animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 space-y-2">
          <div className="flex gap-2">
            <div className="skeleton-line w-20 h-6 rounded-full" />
            <div className="skeleton-line w-16 h-6 rounded-full" />
          </div>
          <div className="skeleton-line w-3/4 h-5" />
          <div className="skeleton-line w-1/2 h-4" />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2 mb-4">
        <div className="skeleton-line w-full" />
        <div className="skeleton-line w-4/5" />
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="flex items-center gap-2">
          <div className="skeleton-circle h-4 w-4" />
          <div className="skeleton-line w-24 h-4" />
        </div>
        <div className="flex items-center gap-2">
          <div className="skeleton-circle h-4 w-4" />
          <div className="skeleton-line w-20 h-4" />
        </div>
        <div className="flex items-center gap-2">
          <div className="skeleton-circle h-4 w-4" />
          <div className="skeleton-line w-16 h-4" />
        </div>
        <div className="flex items-center gap-2">
          <div className="skeleton-circle h-4 w-4" />
          <div className="skeleton-line w-24 h-4" />
        </div>
      </div>

      {/* Button */}
      <div className="skeleton-line w-full h-11 rounded-xl" />
    </div>
  );
}

export function SkeletonCardGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}