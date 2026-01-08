import { Skeleton } from "../ui/skeleton";

const CommentSkeleton=()=> {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="size-10 rounded-full" />

      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>

        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
}

export default CommentSkeleton;