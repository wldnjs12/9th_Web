export default function SkeletonCard() {
    return (
      <div className="rounded-lg overflow-hidden bg-zinc-900/80 animate-pulse">
        <div className="h-64 bg-zinc-800/80" />
        <div className="p-3 space-y-2">
          <div className="h-4 w-3/4 bg-zinc-800/80 rounded" />
          <div className="h-3 w-1/2 bg-zinc-800/80 rounded" />
        </div>
      </div>
    );
  }
  