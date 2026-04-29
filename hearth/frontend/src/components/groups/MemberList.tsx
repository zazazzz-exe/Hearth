interface MemberItem {
  address: string;
  hasPaid: boolean;
  turn: number;
}

interface MemberListProps {
  members: MemberItem[];
}

const shortAddress = (value: unknown): string => {
  if (typeof value !== "string") {
    return "Unknown Keeper";
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return "Unknown Keeper";
  }

  if (trimmed.length <= 14) {
    return trimmed;
  }

  return `${trimmed.slice(0, 8)}...${trimmed.slice(-6)}`;
};

const MemberList = ({ members }: MemberListProps) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-warmgray/70 bg-white/90 shadow-card">
      <table className="min-w-full text-left text-sm text-wood">
        <thead className="bg-gradient-to-r from-amber-soft/50 to-cream-deep text-wood">
          <tr>
            <th className="px-4 py-3">Keeper</th>
            <th className="px-4 py-3">Turn</th>
            <th className="px-4 py-3">Tended</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member, index) => (
            <tr key={`${member.address || "member"}-${index}`} className="border-t border-warmgray/50">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-ember to-ember-deep" />
                  <span className="mono text-xs">{shortAddress(member.address)}</span>
                </div>
              </td>
              <td className="px-4 py-3">{member.turn}</td>
              <td className="px-4 py-3">
                {member.hasPaid ? (
                  <span className="inline-flex items-center gap-2 font-semibold text-success">✓ Tended</span>
                ) : (
                  <span className="inline-flex items-center gap-2 font-semibold text-error">✗ Pending</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MemberList;
