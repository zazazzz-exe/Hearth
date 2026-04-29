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
    <section className="mx-auto max-w-5xl space-y-4 rounded-[28px] bg-[linear-gradient(165deg,#FAF3E7_0%,#FFFBF2_45%,#F0E5D0_100%)] px-4 py-6 text-wood md:px-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl font-bold">Profile</h1>
        {activeUser && <p className="text-lg font-semibold text-ember-deep">{activeUser.name}</p>}
      </div>

      <div className="glass-soft rounded-3xl p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-wood-soft/70">Account</p>
        {activeUser && <p className="mt-2 text-sm text-wood-soft"><span className="font-semibold">Email:</span> {activeUser.email}</p>}
        <p className="mt-3 text-xs uppercase tracking-[0.18em] text-wood-soft/70">Wallet</p>
        <p className="mt-2 text-sm text-wood-soft">
          {isConnected ? publicKey : "No wallet connected"}
        </p>
        <p className="mt-1 text-sm text-wood-soft">Network: {network || "Unknown"}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="glass-soft interactive-card p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-wood-soft/70">Hearths joined</p>
          <p className="mt-2 font-display text-3xl font-bold text-ember">{groups.length}</p>
        </article>
        <article className="glass-soft interactive-card p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-wood-soft/70">Tended</p>
          <p className="mt-2 font-display text-3xl font-bold text-amber">{totalContributed} USDC</p>
        </article>
        <article className="glass-soft interactive-card p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-wood-soft/70">Warmth received</p>
          <p className="mt-2 font-display text-3xl font-bold text-success">{totalReceived} USDC</p>
        </article>
      </div>

      <div className="glass-soft p-4">
        <p className="font-semibold text-wood">Recent Tendings</p>
        {contributionHistory.length === 0 ? (
          <p className="mt-2 text-sm text-wood-soft">No tending history yet.</p>
        ) : (
          <ul className="mt-2 space-y-2 text-sm text-wood-soft">
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
