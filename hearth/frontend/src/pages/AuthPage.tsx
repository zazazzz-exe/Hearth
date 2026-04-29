import { FormEvent, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

type AuthMode = "sign-in" | "sign-up";

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { signIn, signUp, isAuthenticated } = useAuthStore();

  const [mode, setMode] = useState<AuthMode>((searchParams.get("mode") as AuthMode) || "sign-up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const redirectTo = (location.state as { from?: string } | null)?.from || searchParams.get("redirect") || "/dashboard";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTo]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    try {
      if (mode === "sign-up") {
        signUp({ name, email, password });
      } else {
        signIn({ email, password });
      }

      navigate(redirectTo, { replace: true });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Couldn&rsquo;t complete sign-in.");
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(165deg,#FAF3E7_0%,#FFFBF2_45%,#F0E5D0_100%)] px-4 py-10 text-wood">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1fr_0.95fr]">
        <section className="space-y-6">
          <Link to="/" className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-wood-soft">
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Back home
          </Link>
          <h1 className="font-display text-5xl font-bold leading-tight md:text-6xl">
            Sign in first,
            <br />
            then connect your wallet.
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-wood-soft">
            Create a local Hearth account to unlock wallet connection and Hearth kindling. Once you sign in, you can connect Freighter and start keeping the fire going.
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["Secure access", "Wallet actions stay behind your account."],
              ["Quick to start", "An account takes seconds."],
              ["Stays signed in", "Your session lives in this browser."]
            ].map(([title, description]) => (
              <div key={title} className="glass-soft p-4">
                <p className="font-semibold">{title}</p>
                <p className="mt-2 text-sm text-wood-soft">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-soft rounded-[28px] p-6 shadow-[0_30px_80px_rgba(58,36,24,0.12)] md:p-8">
          <div className="flex gap-2 rounded-full bg-cream/80 p-1 text-sm font-semibold">
            <button
              type="button"
              onClick={() => setMode("sign-up")}
              className={`flex-1 rounded-full px-4 py-3 transition ${mode === "sign-up" ? "bg-amber text-wood" : "text-wood-soft"}`}
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => setMode("sign-in")}
              className={`flex-1 rounded-full px-4 py-3 transition ${mode === "sign-in" ? "bg-ember text-cream" : "text-wood-soft"}`}
            >
              Sign In
            </button>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {mode === "sign-up" && (
              <label className="block text-sm font-semibold text-wood-soft">
                Full Name
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-warmgray/70 bg-white/85 px-4 py-3 text-wood outline-none transition placeholder:text-wood-soft/55 focus:border-ember"
                  placeholder="Juan Dela Cruz"
                />
              </label>
            )}

            <label className="block text-sm font-semibold text-wood-soft">
              Email Address
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-warmgray/70 bg-white/85 px-4 py-3 text-wood outline-none transition placeholder:text-wood-soft/55 focus:border-ember"
                placeholder="juan@example.com"
              />
            </label>

            <label className="block text-sm font-semibold text-wood-soft">
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-warmgray/70 bg-white/85 px-4 py-3 text-wood outline-none transition placeholder:text-wood-soft/55 focus:border-ember"
                placeholder="At least 6 characters"
              />
            </label>

            {error && <p className="rounded-2xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">{error}</p>}

            <button type="submit" className="primary-button w-full justify-center py-3 text-base">
              {mode === "sign-up" ? "Create Account" : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-wood-soft/80">
            {mode === "sign-up" ? "Already have an account?" : "Need an account?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "sign-up" ? "sign-in" : "sign-up")}
              className="font-semibold text-ember"
            >
              {mode === "sign-up" ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </section>
      </div>
    </div>
  );
};

export default AuthPage;
