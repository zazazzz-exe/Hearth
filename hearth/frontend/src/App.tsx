import { useEffect } from "react";
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import CreateGroup from "./pages/CreateGroup";
import GroupDetail from "./pages/GroupDetail";
import Profile from "./pages/Profile";
import AuthPage from "./pages/AuthPage";
import ConnectWalletButton from "./components/wallet/ConnectWalletButton";
import AmberCursorGlow from "./components/ui/AmberCursorGlow";
import { useAuthStore } from "./store/authStore";

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace state={{ from: `${location.pathname}${location.search}` }} />;
  }

  return children;
};

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const isDashboard = location.pathname === "/dashboard";
  const isGroupDetail = location.pathname.startsWith("/group/");
  const isAuth = location.pathname === "/auth";
  const headerLabel = location.pathname === "/profile" ? "Profile" : location.pathname === "/create" ? "Kindle a Hearth" : "Your Hearths";

  useEffect(() => {
    const firstOpenHandled = sessionStorage.getItem("hearth-first-open");

    if (!firstOpenHandled) {
      sessionStorage.setItem("hearth-first-open", "1");

      if (location.pathname !== "/") {
        navigate("/", { replace: true });
      }
    }
  }, [location.pathname, navigate]);

  return (
    <div className="app-light min-h-screen bg-cream text-wood">
      <AmberCursorGlow />
      {!isHome && !isDashboard && !isGroupDetail && !isAuth && (
        <header className="sticky top-0 z-20 border-b border-warmgray/70 bg-cream/85 backdrop-blur-2xl">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/Hearth_LogoPure.png"
                alt="Hearth logo"
                className="h-10 w-10 rounded-xl object-cover"
              />
              <div>
                <p className="font-display text-lg font-bold text-wood">Hearth</p>
                <p className="text-xs text-wood-soft/70">{headerLabel}</p>
              </div>
            </Link>

            <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
              <Link to="/dashboard" className="text-wood-soft hover:text-ember">
                Your Hearths
              </Link>
              <Link to="/create" className="text-wood-soft hover:text-ember">
                Kindle a Hearth
              </Link>
              <Link to="/profile" className="text-wood-soft hover:text-ember">
                Profile
              </Link>
            </nav>

            <ConnectWalletButton />
          </div>
        </header>
      )}

      <main className={`page-shell ${isHome || isDashboard || isGroupDetail ? "" : "mx-auto w-full max-w-6xl px-4 py-8"}`}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route path="/create" element={<RequireAuth><CreateGroup /></RequireAuth>} />
          <Route
            path="/group/:id"
            element={
              <RequireAuth>
                <GroupDetail />
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
