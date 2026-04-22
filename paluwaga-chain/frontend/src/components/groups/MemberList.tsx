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
    return "Unknown member";
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return "Unknown member";
  }

  if (trimmed.length <= 14) {
    return trimmed;
  }

  return `${trimmed.slice(0, 8)}...${trimmed.slice(-6)}`;
};

const MemberList = ({ members }: MemberListProps) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-purple-100 bg-white/85 shadow-[0_12px_36px_rgba(124,58,237,0.10)]">
      <table className="min-w-full text-left text-sm text-slate-800">
        <thead className="bg-gradient-to-r from-[#efe4ff] to-[#f7f2ff] text-[#2a133f]">
          <tr>
            <th className="px-4 py-3">Member</th>
            <th className="px-4 py-3">Turn</th>
            <th className="px-4 py-3">Paid Status</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member, index) => (
            <tr key={`${member.address || "member"}-${index}`} className="border-t border-purple-100/80">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#3f0f7f]" />
                  <span className="mono text-xs">{shortAddress(member.address)}</span>
                </div>
              </td>
              <td className="px-4 py-3">{member.turn}</td>
              <td className="px-4 py-3">
                {member.hasPaid ? (
                  <span className="inline-flex items-center gap-2 font-semibold text-[#27AE60]">✓ Paid</span>
                ) : (
                  <span className="inline-flex items-center gap-2 font-semibold text-[#E74C3C]">✗ Not yet</span>
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
