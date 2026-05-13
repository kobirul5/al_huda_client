import { Loader2 } from "lucide-react";

function HadithCardSkeleton() {
  return (
    <div className="mb-6 rounded-xl border border-border bg-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="h-10 w-10 rounded-full bg-primary/10" />
        <div className="flex gap-2">
          <div className="h-8 w-8 rounded-full bg-muted" />
          <div className="h-8 w-8 rounded-full bg-muted" />
          <div className="h-8 w-8 rounded-full bg-muted" />
        </div>
      </div>
      <div className="space-y-5">
        <div className="ml-auto h-8 w-3/4 rounded bg-muted" />
        <div className="ml-auto h-8 w-1/2 rounded bg-muted" />
        <div className="rounded-lg border-l-4 border-primary/30 bg-primary/5 p-4">
          <div className="mb-3 h-3 w-20 rounded bg-primary/20" />
          <div className="h-5 w-full rounded bg-muted" />
          <div className="mt-3 h-5 w-4/5 rounded bg-muted" />
        </div>
        <div className="rounded-lg border-l-4 border-border bg-muted/30 p-4">
          <div className="mb-3 h-3 w-20 rounded bg-muted" />
          <div className="h-4 w-full rounded bg-muted" />
          <div className="mt-3 h-4 w-2/3 rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}

export default function HadithBookLoading() {
  return (
    <>
          <div className="mb-8 flex flex-col items-center justify-center text-center">
            <div className="mb-4 flex items-center gap-3 rounded-full border border-primary/10 bg-primary/5 px-5 py-2 text-primary">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm font-semibold">Loading hadith collection</span>
            </div>
            <div className="h-10 w-64 rounded bg-muted" />
            <div className="mt-4 h-4 w-80 max-w-full rounded bg-muted" />
            <div className="mt-4 h-1.5 w-24 rounded-full bg-primary" />
          </div>

          <div className="animate-pulse">
            {Array.from({ length: 4 }).map((_, index) => (
              <HadithCardSkeleton key={index} />
            ))}
          </div>
    </>
  );
}
