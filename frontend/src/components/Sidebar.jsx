import {
  LayoutDashboard,
  ScanLine,
  History,
  User,
  Settings,
  Shield,
  LogOut,
} from "lucide-react";

import { Link, useLocation, useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/scan", label: "Scan Website", icon: ScanLine },
  { to: "/history", label: "History", icon: History },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
];

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="w-72 min-h-screen bg-[#0F1424] border-r border-[#262F4A] text-white flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-4 px-8 py-9">
        <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 shadow-[0_0_24px_rgba(99,102,241,0.45)]">
          <Shield className="text-white" size={22} strokeWidth={2.25} />
        </div>

        <div className="leading-tight">
          <h1 className="text-lg font-bold tracking-tight">
            SecureBiz <span className="text-cyan-400">AI</span>
          </h1>
          <p className="text-xs text-[#8B93B0] tracking-wide mt-0.5">
            Security Dashboard
          </p>
        </div>
      </div>

      {/* Primary nav */}
      <nav className="flex-1 px-5 py-4">
        <p className="px-3 mb-4 text-xs font-semibold uppercase tracking-widest text-[#606A8C]">
          Menu
        </p>

        <div className="space-y-2">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
            const isActive =
              location.pathname === to ||
              location.pathname.startsWith(`${to}/`);

            return (
              <Link
                key={to}
                to={to}
                className={`group relative flex items-center gap-4 px-4 py-3.5 rounded-xl text-[15px] font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-500/90 to-cyan-500/80 text-white shadow-[0_4px_20px_rgba(56,189,248,0.35)]"
                    : "text-[#9AA3C4] hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.25 : 1.9}
                  className="shrink-0"
                />

                {label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Sign out */}
      <div className="px-5 py-7">
        <button
          onClick={logout}
          className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-[15px] font-medium w-full text-[#9AA3C4] hover:bg-red-500/10 hover:text-red-400 transition-colors duration-200"
        >
          <LogOut size={22} strokeWidth={1.9} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
