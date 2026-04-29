import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useGroupStore } from "../store/groupStore";
import { createSharedGroup } from "../services/groupService";

const CreateGroup = () => {
  const navigate = useNavigate();
  const [hearthName, setHearthName] = useState("");
  const [members, setMembers] = useState<string[]>([""]);
  const [contribution, setContribution] = useState("10");
  const [frequency, setFrequency] = useState("7");
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const currentUserId = useAuthStore((state) => state.currentUserId);
  const upsertGroups = useGroupStore((state) => state.upsertGroups);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateGroup = async () => {
    const trimmedName = hearthName.trim();
    const validMembers = members.map((member) => member.trim()).filter(Boolean);
    const seasonDays = Number(frequency);

    if (!trimmedName) {
      setFormError("Hearth name is required.");
      return;
    }

    if (validMembers.length < 2) {
      setFormError("Add at least two Keepers.");
      return;
    }

    if (!Number.isFinite(seasonDays) || seasonDays < 1) {
      setFormError("Season length must be at least 1 day.");
      return;
    }

    if (!currentUserId) {
      setFormError("Sign in before kindling a Hearth.");
      return;
    }

    setFormError(null);

    try {
      setIsSubmitting(true);
      const createdGroup = await createSharedGroup({
        name: trimmedName,
        members: validMembers,
        contributionAmount: contribution,
        rotationFrequencyDays: seasonDays,
        creatorUserId: currentUserId
      });

      upsertGroups([createdGroup]);
      navigate("/dashboard", { state: { createdGroupId: createdGroup.id } });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Couldn&rsquo;t kindle the Hearth right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center px-4 py-10 text-wood">
        <div className="glass-soft max-w-xl rounded-[28px] p-8 text-center">
          <p className="text-xs uppercase tracking-[0.18em] text-wood-soft/70">Sign in needed</p>
          <h1 className="mt-3 font-display text-4xl font-bold">Sign in before kindling a Hearth</h1>
          <p className="mt-4 text-sm leading-relaxed text-wood-soft">
            Make an account or sign in first, then connect your Freighter wallet to kindle the Hearth.
          </p>
          <Link to="/auth?redirect=/create" className="primary-button mt-6 inline-flex justify-center">
            Go to Sign In
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl rounded-[28px] bg-[linear-gradient(165deg,#FAF3E7_0%,#FFFBF2_45%,#F0E5D0_100%)] px-4 py-6 text-wood md:px-6">
      <h1 className="font-display text-4xl font-bold">Kindle a Hearth</h1>
      <p className="mt-2 text-sm text-wood-soft">Set the rules. Choose who, how much, how often.</p>

      <form className="glass-soft mt-6 space-y-4 rounded-3xl p-6 text-wood backdrop-blur-xl">
        <label className="block text-sm font-semibold text-wood-soft">
          Hearth Name
          <input
            value={hearthName}
            onChange={(e) => setHearthName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-warmgray/70 bg-white/85 px-3 py-2 text-wood outline-none focus:border-ember"
            placeholder="e.g. Family Hearth — Manila"
          />
        </label>

        <div>
          <p className="text-sm font-semibold text-wood-soft">Keepers (wallet addresses)</p>
          <div className="mt-2 space-y-2">
            {members.map((member, index) => (
              <input
                key={`${index}-${member}`}
                value={member}
                onChange={(e) => {
                  const next = [...members];
                  next[index] = e.target.value;
                  setMembers(next);
                }}
                className="w-full rounded-xl border border-warmgray/70 bg-white/85 px-3 py-2 text-wood outline-none focus:border-ember"
                placeholder="G..."
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => setMembers((prev) => [...prev, ""])}
            className="mt-2 rounded-full border border-ember px-3 py-1 text-xs font-semibold text-ember"
          >
            Add Keeper
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-sm font-semibold text-wood-soft">
            Tending amount (USDC)
            <input
              type="number"
              min="1"
              value={contribution}
              onChange={(e) => setContribution(e.target.value)}
              className="mt-1 w-full rounded-xl border border-warmgray/70 bg-white/85 px-3 py-2 text-wood outline-none focus:border-ember"
            />
          </label>

          <label className="text-sm font-semibold text-wood-soft">
            Season length (days)
            <input
              type="number"
              min="1"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="mt-1 w-full rounded-xl border border-warmgray/70 bg-white/85 px-3 py-2 text-wood outline-none focus:border-ember"
            />
          </label>
        </div>

        {formError && <p className="rounded-2xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">{formError}</p>}

        <button
          type="button"
          onClick={() => void handleCreateGroup()}
          disabled={isSubmitting}
          className="primary-button rounded-full px-6 py-3 text-sm font-bold text-cream disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Kindling..." : "Kindle Hearth"}
        </button>
      </form>
    </section>
  );
};

export default CreateGroup;
