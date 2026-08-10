export function LoadingScreen({ label }: { label: string }) {
  return (
    <div
      role="status"
      aria-label={`Loading ${label}`}
      className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 bg-[#0a0806]"
    >
      <p className="pixel-text text-xs text-gold">Loading {label}…</p>
      <div className="mc-slot h-4 w-64 overflow-hidden">
        <div className="loading-fill h-full bg-xp" />
      </div>
    </div>
  )
}
