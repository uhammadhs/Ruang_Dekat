export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-slate-200 ${className}`} />;
}

export function CardSkeleton() {
  return (
    <div className="space-y-4 rounded-3xl border border-slate-100 bg-white p-5">
      <div className="flex items-start gap-3">
        <Skeleton className="size-12 shrink-0 rounded-2xl" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-48 w-full" />
    </div>
  );
}

export function FeedSkeleton() {
  return (
    <div className="mx-auto max-w-3xl space-y-4 px-4 py-5 lg:px-6">
      {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-3xl space-y-5 px-4 py-5 pb-28 lg:px-6">
      <div className="overflow-hidden rounded-3xl border border-slate-100">
        <Skeleton className="h-32 w-full rounded-none" />
        <div className="p-5 sm:p-7">
          <Skeleton className="-mt-16 size-24 rounded-[2rem]" />
          <Skeleton className="mt-3 h-6 w-40" />
          <Skeleton className="mt-1 h-4 w-24" />
        </div>
      </div>
    </div>
  );
}

export function PostDetailSkeleton() {
  return (
    <div className="mx-auto max-w-3xl space-y-4 px-4 py-5 lg:px-6">
      <CardSkeleton />
    </div>
  );
}
