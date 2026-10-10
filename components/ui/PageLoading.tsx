/** Quiet placeholder shown while a detail page streams in after navigation. */
export function PageLoading() {
  return (
    <div aria-busy="true" className="mx-auto w-full max-w-3xl animate-pulse px-4 py-14 sm:px-6">
      <div className="h-4 w-24 rounded bg-ink-3" />
      <div className="mt-6 h-10 w-3/4 rounded bg-ink-3" />
      <div className="mt-8 space-y-3">
        <div className="h-4 rounded bg-ink-2" />
        <div className="h-4 rounded bg-ink-2" />
        <div className="h-4 w-2/3 rounded bg-ink-2" />
      </div>
    </div>
  );
}
