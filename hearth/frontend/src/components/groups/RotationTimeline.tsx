interface RotationTimelineProps {
  members: string[];
  currentIndex: number;
}

const safeAddress = (value: unknown): string => {
  if (typeof value !== "string") {
    return "Unknown";
  }

  const trimmed = value.trim();
  return trimmed || "Unknown";
};

const compactAddress = (value: unknown): string => {
  const normalized = safeAddress(value);
  if (normalized === "Unknown") {
    return normalized;
  }
  if (normalized.length <= 10) {
    return normalized;
  }
  return `${normalized.slice(0, 5)}...${normalized.slice(-4)}`;
};

const RotationTimeline = ({ members, currentIndex }: RotationTimelineProps) => {
  const normalizedMembers = Array.isArray(members) ? members.map(safeAddress) : [];

  return (
    <div className="overflow-x-auto py-2">
      <div className="flex min-w-max items-center gap-3 px-1">
        {normalizedMembers.map((member, index) => {
          const isCurrent = index === currentIndex;
          return (
            <div key={`${member}-${index}`} className="flex items-center gap-3">
              <div
                className={`rounded-2xl border px-4 py-3 text-sm transition-all ${isCurrent ? "border-ember bg-wood text-cream shadow-[0_0_24px_rgba(232,116,60,0.40)]" : "border-warmgray/70 bg-white text-wood-soft shadow-sm"}`}
              >
                {isCurrent && <span className="mb-2 inline-flex rounded-full bg-amber px-2 py-0.5 text-[10px] font-bold text-wood">RECEIVING WARMTH</span>}
                <p className="font-semibold">Turn {index + 1}</p>
                <p className="mono text-xs">{compactAddress(member)}</p>
              </div>
              {index < normalizedMembers.length - 1 && <span className="text-xl text-ember/60">→</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RotationTimeline;
