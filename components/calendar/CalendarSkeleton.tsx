export function CalendarSkeleton() {
  return (
    <div className="w-full animate-pulse" aria-label="Loading calendar...">
      {/* Month header */}
      <div className="h-10 bg-surface rounded mb-4 w-48" />

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-6 bg-surface rounded" />
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={i} className="h-20 bg-surface rounded" />
        ))}
      </div>
    </div>
  )
}
