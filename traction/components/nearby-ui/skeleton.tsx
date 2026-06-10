export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

export function MemberCardSkeleton() {
  return (
    <div className="card p-4 flex items-center gap-3">
      <Skeleton className="w-10 h-10 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-48" />
      </div>
      <Skeleton className="h-5 w-16 rounded-full" />
    </div>
  );
}

export function MemberListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <MemberCardSkeleton />
      <MemberCardSkeleton />
      <MemberCardSkeleton />
      <MemberCardSkeleton />
      <MemberCardSkeleton />
      <MemberCardSkeleton />
    </div>
  );
}

export function MapSkeleton() {
  return (
    <div className="skeleton w-full h-[300px] md:h-[400px] rounded-2xl" />
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="w-20 h-20 rounded-full" />
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-56" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
}
