import { useFreighter } from "../hooks/useFreighter";
import { useGroupStore } from "../store/groupStore";
import { useAuthStore } from "../store/authStore";

const Profile = () => {
  const { publicKey, network, isConnected } = useFreighter();
  const { groups, contributionHistory } = useGroupStore();
  const activeUser = useAuthStore((state) => state.activeUser);

  const totalContributed = contributionHistory.reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
  const totalReceived = groups.reduce((sum, group) => sum + Number(group.poolBalance || 0), 0);

  return (
    <section className="mx-auto max-w-5xl space-y-4 rounded-[28px] bg-[linear-gradient(165deg,#f3e8ff_0%,#f8f5ff_45%,#ede9fe_100%)] px-4 py-6 text-slate-900 md:px-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl font-extrabold">Profile</h1>
        {activeUser && <p className="text-lg font-semibold text-[#6d28d9]">{activeUser.name}</p>}
      </div>

      <div className="glass-soft rounded-3xl p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Account</p>
        {activeUser && <p className="mt-2 text-sm text-slate-700"><span className="font-semibold">Email:</span> {activeUser.email}</p>}
        <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-500">Wallet</p>
        <p className="mt-2 text-sm text-slate-700">
          {isConnected ? publicKey : "No wallet connected"}
        </p>
        <p className="mt-1 text-sm text-slate-600">Network: {network || "Unknown"}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="glass-soft interactive-card rounded-2xl p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Groups Joined</p>
          <p className="mt-2 text-3xl font-bold text-[#00C6FF]">{groups.length}</p>
        </article>
        <article className="glass-soft interactive-card rounded-2xl p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Total Contributed</p>
          <p className="mt-2 text-3xl font-bold text-[#F5A623]">{totalContributed} USDC</p>
        </article>
        <article className="glass-soft interactive-card rounded-2xl p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Total Received</p>
          <p className="mt-2 text-3xl font-bold text-[#27AE60]">{totalReceived} USDC</p>
        </article>
      </div>

      <div className="glass-soft rounded-2xl p-4">
        <p className="font-semibold text-[#2a133f]">Recent History</p>
        {contributionHistory.length === 0 ? (
          <p className="mt-2 text-sm text-slate-600">No contribution history yet.</p>
        ) : (
          <ul className="mt-2 space-y-2 text-sm text-slate-600">
            {contributionHistory.slice(0, 5).map((entry) => (
              <li key={entry.id}>
                {entry.amount} {entry.asset || "XLM"} sent to {entry.groupName} at {new Date(entry.createdAt).toLocaleString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default Profile;
