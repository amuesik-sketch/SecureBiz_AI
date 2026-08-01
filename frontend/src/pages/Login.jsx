import { Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginUser } from "../services/auth";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await loginUser(form);

      // save token

      localStorage.setItem("token", response.data.token);

      // save user

      localStorage.setItem("user", JSON.stringify(response.data.user));

      alert("Login successful");

      navigate("/dashboard");
    } catch (error) {
      console.log(error);

      alert("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8">
        <div className="flex justify-center items-center gap-2 mb-8">
          <Shield className="text-emerald-400" size={35} />

          <h1 className="text-2xl font-bold">SecureBiz AI</h1>
        </div>

        <h2 className="text-3xl font-bold text-center">Welcome Back</h2>

        <p className="text-center text-slate-400 mt-3">
          Login to your security dashboard
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <input
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
            className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700"
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value,
              })
            }
            className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700"
          />

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 py-3 rounded-lg font-semibold"
          >
            Login
          </button>
        </form>

        <p className="text-center text-slate-400 mt-6">
          Don't have an account?
          <Link to="/register" className="text-emerald-400 ml-2">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
