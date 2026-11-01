export default function Stars({ rate = 0, count }) {
  const full = Math.round(rate);
  return (
    <span className="flex items-center gap-1 text-sm">
      <span className="text-amber-400" aria-label={`${rate} out of 5`}>
        {"★".repeat(full)}<span className="text-slate-300">{"★".repeat(5 - full)}</span>
      </span>
      {count !== undefined && <span className="text-slate-500">({count})</span>}
    </span>
  );
}
