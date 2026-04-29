import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import HearthCard from "../components/groups/HearthCard";
import { useCountUp } from "../hooks/useCountUp";
import { useFreighter } from "../hooks/useFreighter";
import { useGroupState } from "../hooks/useGroupState";
import { useInViewAnimation } from "../hooks/useInViewAnimation";
import { useGroupStore, GroupSummary } from "../store/groupStore";
import { useAuthStore } from "../store/authStore";
import { fetchSharedGroups, joinSharedGroup } from "../services/groupService";

const toAddressString = (value: unknown): string => {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "address" in value) {
    const maybe = (value as { address?: unknown }).address;
    return typeof maybe === "string" ? maybe : "";
  }
  return "";
};

const getArray = (value: unknown): unknown[] => {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object" && "vec" in value) {
    const maybe = (value as { vec?: unknown }).vec;
    return Array.isArray(maybe) ? maybe : [];
  }
  return [];
};

const normalizeGroupState = (state: any, publicKey: string | null): GroupSummary[] => {
  if (!state || !publicKey) return [];

  const members = getArray(state.members ?? state.Members ?? state.member_list ?? state.memberList)
    .map(toAddressString)
    .filter(Boolean);

  if (!members.length) return [];

  const memberIndex = members.findIndex((member) => member === publicKey);
  if (memberIndex === -1) return [];

  const round = Number(state.round ?? 1);
  const rotationIndex = Number(state.rotation_index ?? state.rotationIndex ?? 0);
  const poolBalance = String(state.pool_balance ?? state.poolBalance ?? 0);
  const paidStatus = state.paid_status ?? state.paidStatus;
  const contributedMembers =
    paidStatus && typeof paidStatus === "object"
      ? members.filter((member) => Boolean((paidStatus as Record<string, boolean>)[member])).length
      : undefined;

  return [
    {
      id: "onchain-group",
      name: "Your Hearth",
      source: "live",
      yourTurn: memberIndex + 1,
      totalMembers: members.length,
      currentRound: Number.isNaN(round) ? 1 : round,
      totalRounds: members.length,
      poolBalance,
      contributedMembers,
      contributionAmount: String(state.contribution_amount ?? state.contributionAmount ?? "0"),
      rotationFrequencyDays: Number(state.rotation_interval_days ?? state.rotationIntervalDays ?? 7),
      hasPaid: Boolean((paidStatus as Record<string, boolean> | undefined)?.[publicKey]),
      status: contributedMembers === members.length ? "ready" : memberIndex + 1 === rotationIndex + 1 ? "your-turn" : "waiting",
      memberPreview: members.slice(0, 4),
      nextReleaseAt: new Date(Date.now() + (rotationIndex + 1) * 86400000).toISOString()
    }
  ];
};

const Dashboard = () => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const sidebarVisible = useInViewAnimation(sidebarRef);
  const navigate = useNavigate();
  const currentUserId = useAuthStore((state) => state.currentUserId);
  const { publicKey, disconnect } = useFreighter();
  const { data, isLoading, error } = useGroupState();
  const { groups, upsertGroups } = useGroupStore();
  const [activeTab, setActiveTab] = useState<"all" | "created">("all");
  const [sharedGroupsError, setSharedGroupsError] = useState<string | null>(null);
  const [joiningGroupId, setJoiningGroupId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleDisconnect = () => {
    const { signOut } = useAuthStore.getState();
    disconnect();
    signOut();
    navigate("/");
  };

  const liveGroups = useMemo(() => normalizeGroupState(data, publicKey), [data, publicKey]);

  useEffect(() => {
    upsertGroups(liveGroups);
  }, [liveGroups, upsertGroups]);

  useEffect(() => {
    let cancelled = false;

    const loadSharedGroups = async () => {
      try {
        const sharedGroups = await fetchSharedGroups();
        if (!cancelled) {
          upsertGroups(sharedGroups);
          setSharedGroupsError(null);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setSharedGroupsError(fetchError instanceof Error ? fetchError.message : "Unable to fetch shared Hearths.");
        }
      }
    };

    void loadSharedGroups();

    return () => {
      cancelled = true;
    };
  }, [upsertGroups]);

  const loadSharedGroups = async () => {
    try {
      setIsRefreshing(true);
      const sharedGroups = await fetchSharedGroups();
      upsertGroups(sharedGroups);
      setSharedGroupsError(null);
    } catch (fetchError) {
      setSharedGroupsError(fetchError instanceof Error ? fetchError.message : "Unable to fetch shared Hearths.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    if (!currentUserId) {
      navigate("/auth?redirect=/dashboard");
      return;
    }

    try {
      setJoiningGroupId(groupId);
      const updatedGroup = await joinSharedGroup(groupId, currentUserId);
      upsertGroups([updatedGroup]);
    } catch (joinError) {
      setSharedGroupsError(joinError instanceof Error ? joinError.message : "Unable to join Hearth.");
    } finally {
      setJoiningGroupId(null);
    }
  };

  const visibleGroups = useMemo(() => {
    let filtered = [...groups].sort((left, right) => {
      if (left.source === right.source) {
        return (right.createdAt || "").localeCompare(left.createdAt || "");
      }

      if (left.source === "created") return -1;
      if (right.source === "created") return 1;

      return 0;
    });

    if (activeTab === "created") {
      filtered = filtered.filter((group) => {
        if (group.source !== "created") {
          return false;
        }

        if (!currentUserId) {
          return false;
        }

        return group.creatorUserId === currentUserId || Boolean(group.memberUserIds?.includes(currentUserId));
      });
    }

    return filtered;
  }, [groups, activeTab, currentUserId]);

  const totalContributed = useCountUp(Number(data?.contribution_amount ?? 0) || 0, Boolean(data), 1200);
  const totalReceived = useCountUp(Number(data?.pool_balance ?? 0) || 0, Boolean(data), 1200);

  return (
    <div className="min-h-screen bg-[linear-gradient(165deg,#FAF3E7_0%,#FFFBF2_45%,#F0E5D0_100%)] text-wood">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside
          ref={sidebarRef}
          className={`glass-soft hidden w-[240px] shrink-0 border-r border-warmgray/70 px-5 py-6 lg:flex lg:flex-col ${
            sidebarVisible ? "visible" : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <img
              src="/Hearth_LogoPure.png"
              alt="Hearth logo"
              className="h-10 w-10 rounded-xl object-cover"
            />
            <div>
              <p className="font-display text-lg font-bold">Hearth</p>
              <p className="text-xs text-wood-soft/70">Your Hearths</p>
            </div>
          </div>

          <nav className="mt-10 space-y-2 text-sm">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`flex w-full items-center gap-3 rounded-xl border-l-4 px-4 py-3 transition ${
                activeTab === "all"
                  ? "border-ember bg-amber-soft/40 text-ember-deep"
                  : "border-transparent text-wood-soft hover:bg-amber-soft/30 hover:text-ember-deep"
              }`}
            >
              <span className="material-symbols-outlined text-base">grid_view</span>
              All Hearths
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("created")}
              className={`flex w-full items-center gap-3 rounded-xl border-l-4 px-4 py-3 transition ${
                activeTab === "created"
                  ? "border-ember bg-amber-soft/40 text-ember-deep"
                  : "border-transparent text-wood-soft hover:bg-amber-soft/30 hover:text-ember-deep"
              }`}
            >
              <span className="material-symbols-outlined text-base">bookmark</span>
              My Hearths
            </button>
            <Link
              to="/create"
              className="flex items-center gap-3 rounded-xl border-l-4 border-transparent px-4 py-3 text-wood-soft transition hover:bg-amber-soft/30 hover:text-ember-deep"
            >
              <span className="material-symbols-outlined text-base">local_fire_department</span>
              Kindle a Hearth
            </Link>
            <Link
              to="/profile"
              className="flex items-center gap-3 rounded-xl border-l-4 border-transparent px-4 py-3 text-wood-soft transition hover:bg-amber-soft/30 hover:text-ember-deep"
            >
              <span className="material-symbols-outlined text-base">person</span>
              Profile
            </Link>
            <button
              type="button"
              onClick={handleDisconnect}
              className="flex w-full items-center gap-3 rounded-xl border-l-4 border-transparent px-4 py-3 text-left text-wood-soft transition hover:bg-amber-soft/30 hover:text-ember-deep"
            >
              <span className="material-symbols-outlined text-base">logout</span>
              Step away
            </button>
          </nav>

          <div className="mt-auto rounded-2xl border border-warmgray/70 bg-white/70 p-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-wood-soft/70">Wallet Address</p>
            <p className="mono mt-2 break-all text-xs text-wood-soft">{publicKey || "Connect Freighter"}</p>
          </div>
        </aside>

        <main className="flex-1 px-5 py-6 lg:px-8">
          <header className="glass-soft mb-6 flex items-center justify-between rounded-[20px] px-5 py-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-wood-soft/70">
                {activeTab === "created" ? "My Hearths" : "All Hearths"}
              </p>
              <h1 className="font-display text-3xl font-bold">
                {activeTab === "created" ? "My Hearths" : "Your Hearths"}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/create" className="secondary-button hidden sm:inline-flex">
                Kindle a Hearth
              </Link>
              <button type="button" onClick={() => void loadSharedGroups()} className="primary-button" disabled={isRefreshing}>
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </header>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Tended", `USDC ${totalContributed}`],
              ["Warmth received", `USDC ${totalReceived}`],
              ["Active Hearths", String(visibleGroups.length)]
            ].map(([label, value]) => (
              <article key={label} className="glass-soft interactive-card p-5">
                <p className="text-[13px] uppercase tracking-[0.18em] text-wood-soft/70">{label}</p>
                <p className="mt-3 font-display text-3xl font-bold text-ember">{value}</p>
              </article>
            ))}
          </div>

          <section className="mt-6 space-y-4">
            {error && (
              <div className="rounded-2xl border border-error/30 bg-error/10 p-4 text-sm text-error">
                Couldn&rsquo;t load Hearth state: {error instanceof Error ? error.message : "Unknown error"}
              </div>
            )}
            {sharedGroupsError && (
              <div className="rounded-2xl border border-error/30 bg-error/10 p-4 text-sm text-error">
                Shared Hearths warning: {sharedGroupsError}
              </div>
            )}
            {isLoading && (
              <div className="rounded-2xl border border-warmgray/70 bg-white/70 p-4 text-sm text-wood-soft">
                Loading Hearth state...
              </div>
            )}
            {!isLoading && !error && visibleGroups.length === 0 && (
              <div className="rounded-2xl border border-warmgray/70 bg-white/70 p-4 text-sm text-wood-soft">
                {activeTab === "all"
                  ? "No Hearths yet. Kindle one from any account, then tap Refresh."
                  : "You haven&rsquo;t kindled or joined any Hearths yet."}
              </div>
            )}
          </section>

          <section className="mt-6 grid gap-4 md:grid-cols-2">
            {visibleGroups.map((group, index) => (
              <div key={group.id} className={`animate-on-scroll visible stagger-${Math.min(index + 1, 5)}`}>
                <HearthCard
                  group={group}
                  currentUserId={currentUserId}
                  onJoin={handleJoinGroup}
                  joinLoadingId={joiningGroupId}
                />
              </div>
            ))}
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
