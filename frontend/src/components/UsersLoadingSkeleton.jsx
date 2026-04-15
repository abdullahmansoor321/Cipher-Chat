function UsersLoadingSkeleton() {
  return (
    <div className="px-2 py-1 space-y-1">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-3 py-3 rounded-xl">
          {/* Avatar */}
          <div className="size-11 rounded-xl bg-white/[0.04] animate-pulse flex-shrink-0" />
          {/* Text lines */}
          <div className="flex-1 space-y-2">
            <div
              className="h-3 rounded-full bg-white/[0.04] animate-pulse"
              style={{ width: `${55 + (i % 3) * 15}%` }}
            />
            <div className="h-2 rounded-full bg-white/[0.03] animate-pulse w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}
export default UsersLoadingSkeleton;
