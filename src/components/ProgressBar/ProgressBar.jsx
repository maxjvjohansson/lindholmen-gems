export default function ProgressBar({ value = 0, label, className }) {
  const clamped = Math.max(0, Math.min(100, Number(value) || 0));

  return (
    <div className={className}>
      {label ? (
        <div className="justify-start text-black text-2xl">{label}</div>
      ) : null}
      <div
        className="w-80 h-3 bg-zinc-300 rounded-[5px] inline-flex flex-col justify-start items-start gap-2.5 overflow-hidden"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clamped}
      >
        <div
          className="h-3 bg-stone-500 rounded-[5px]"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
