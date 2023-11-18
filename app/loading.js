import {Skeleton} from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto my-5">
      <Skeleton className="h-[500px] w-full rounded" />
      <div className="mt-3 flex items-center justify-between gap-3">
        <Skeleton className="h-[200px] w-1/2" />
        <Skeleton className="h-[200px] w-1/2" />
      </div>
    </div>
  );
}
