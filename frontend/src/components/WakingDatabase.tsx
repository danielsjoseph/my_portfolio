export default function WakingDatabase() {
  return (
    <div className="flex flex-col items-center gap-2 py-8 text-center">
      <span className="animate-bounce text-4xl" style={{ animationDuration: "1.6s" }}>
        🥱
      </span>
      <p className="text-slate-500 dark:text-slate-400">Waking up database…</p>
      <p className="text-xs text-slate-400 dark:text-slate-500">
        First load can take a few seconds on the free tier
      </p>
    </div>
  );
}
