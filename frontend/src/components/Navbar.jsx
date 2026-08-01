import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-5 bg-slate-950 text-white">
      <Link to="/" className="flex items-center gap-2">
        <Shield className="text-emerald-400" size={30} />

        <h1 className="text-xl font-bold">SecureBiz AI</h1>
      </Link>

      <div className="hidden md:flex items-center gap-6">
        <a href="#features" className="hover:text-emerald-400">
          Features
        </a>

        <a href="#how-it-works" className="hover:text-emerald-400">
          How It Works
        </a>

        <Link
          to="/login"
          className="border border-emerald-400 px-4 py-2 rounded-lg hover:bg-emerald-400 hover:text-slate-950 transition"
        >
          Login
        </Link>

        <Link
          to="/register"
          className="bg-emerald-500 px-4 py-2 rounded-lg hover:bg-emerald-600 transition"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
