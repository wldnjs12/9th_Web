export default function SkeletonComment() {
    return (
      <div className="flex gap-3 p-3 rounded-lg bg-zinc-900/80 animate-pulse">
        <div className="w-8 h-8 rounded-full bg-zinc-800/80" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-40 bg-zinc-800/80 rounded" />
          <div className="h-3 w-5/6 bg-zinc-800/80 rounded" />
        </div>
      </div>
    );
  }
  