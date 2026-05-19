export function Logo({ size = 28 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="mark rounded-[8px] flex items-center justify-center text-white font-bold"
        style={{ width: size, height: size, fontSize: size * 0.45 }}
      >
        A
      </div>
      <span className="font-bold tracking-tight text-ink-900 text-[17px]">AutomatizIA</span>
    </div>
  );
}
