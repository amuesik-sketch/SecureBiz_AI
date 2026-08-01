import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Lock,
  Save,
  ShieldCheck,
  Activity,
  FileSearch,
  Award,
  AlertTriangle,
} from "lucide-react";

import { getProfile, updateProfile, changePassword } from "../services/profile";

function Settings() {
  const [loading, setLoading] = useState(true);

  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
  });

  const [statistics, setStatistics] = useState(null);

  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await getProfile();

        setProfileForm({
          name: response.data.user.name,

          email: response.data.user.email,
        });

        setStatistics(response.data.statistics);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    setMessage("");

    setError("");

    try {
      const response = await updateProfile(profileForm);

      setMessage(response.data.message);
    } catch (error) {
      setError(error.response?.data?.message || "Profile update failed");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    setMessage("");

    setError("");

    try {
      const response = await changePassword(passwordForm);

      setMessage(response.data.message);

      setPasswordForm({
        current_password: "",
        password: "",
        password_confirmation: "",
      });
    } catch (error) {
      setError(error.response?.data?.message || "Password update failed");
    }
  };

  if (loading) {
    return (
      <div
        className="
      min-h-screen
      bg-slate-950
      text-white
      flex
      items-center
      justify-center
      "
      >
        Loading settings...
      </div>
    );
  }

  return (
    <div
      className="
min-h-screen
bg-slate-950
text-white
p-6
md:p-10
"
    >
      <div
        className="
max-w-6xl
mx-auto
"
      >
        <div
          className="
flex
items-center
gap-3
"
        >
          <ShieldCheck size={42} className="text-emerald-400" />

          <h1
            className="
text-4xl
font-bold
"
          >
            Settings
          </h1>
        </div>

        <p
          className="
text-slate-400
mt-3
"
        >
          Manage your SecureBiz AI account.
        </p>

        {message && (
          <div
            className="
mt-6
bg-emerald-500/20
border
border-emerald-500
text-emerald-400
p-4
rounded-xl
"
          >
            {message}
          </div>
        )}

        {error && (
          <div
            className="
mt-6
bg-red-500/20
border
border-red-500
text-red-400
p-4
rounded-xl
"
          >
            {error}
          </div>
        )}

        {/* SECURITY STATS */}

        <div
          className="
grid
grid-cols-1
sm:grid-cols-2
lg:grid-cols-4
gap-5
mt-10
"
        >
          <div
            className="
bg-slate-900
border
border-slate-800
rounded-2xl
p-6
"
          >
            <FileSearch className="text-emerald-400" />

            <p className="text-slate-400 mt-4">Total Scans</p>

            <h2
              className="
text-3xl
font-bold
"
            >
              {statistics?.totalScans || 0}
            </h2>
          </div>

          <div
            className="
bg-slate-900
border
border-slate-800
rounded-2xl
p-6
"
          >
            <Award className="text-blue-400" />

            <p className="text-slate-400 mt-4">Average Score</p>

            <h2
              className="
text-3xl
font-bold
"
            >
              {statistics?.averageScore || 0}
            </h2>
          </div>

          <div
            className="
bg-slate-900
border
border-slate-800
rounded-2xl
p-6
"
          >
            <ShieldCheck className="text-emerald-400" />

            <p className="text-slate-400 mt-4">Account Status</p>

            <h2
              className="
text-emerald-400
font-bold
text-xl
"
            >
              Active
            </h2>
          </div>

          <div
            className="
bg-slate-900
border
border-slate-800
rounded-2xl
p-6
"
          >
            <AlertTriangle className="text-yellow-400" />

            <p className="text-slate-400 mt-4">High Risk Scans</p>

            <h2
              className="
text-3xl
font-bold
"
            >
              {statistics?.highRisk || 0}
            </h2>
          </div>
        </div>

        <div
          className="
grid
md:grid-cols-2
gap-6
mt-10
"
        >
          {/* PROFILE */}

          <form
            onSubmit={handleProfileUpdate}
            className="
bg-slate-900
border
border-slate-800
rounded-2xl
p-8
"
          >
            <h2
              className="
text-2xl
font-bold
mb-6
"
            >
              Account Information
            </h2>

            <div className="space-y-5">
              <div>
                <label className="text-slate-400">Name</label>

                <div
                  className="
flex
items-center
bg-slate-800
rounded-xl
mt-2
px-4
"
                >
                  <User className="text-emerald-400" />

                  <input
                    value={profileForm.name}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,

                        name: e.target.value,
                      })
                    }
                    className="
bg-transparent
outline-none
p-3
w-full
"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400">Email</label>

                <div
                  className="
flex
items-center
bg-slate-800
rounded-xl
mt-2
px-4
"
                >
                  <Mail className="text-emerald-400" />

                  <input
                    value={profileForm.email}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,

                        email: e.target.value,
                      })
                    }
                    className="
bg-transparent
outline-none
p-3
w-full
"
                  />
                </div>
              </div>

              <button
                className="
bg-emerald-500
hover:bg-emerald-600
px-5
py-3
rounded-xl
flex
items-center
gap-2
font-bold
"
              >
                <Save size={18} />
                Save Changes
              </button>
            </div>
          </form>

          {/* PASSWORD */}

          <form
            onSubmit={handlePasswordChange}
            className="
bg-slate-900
border
border-slate-800
rounded-2xl
p-8
"
          >
            <h2
              className="
text-2xl
font-bold
mb-6
"
            >
              Change Password
            </h2>

            <div className="space-y-5">
              {[
                ["current_password", "Current Password"],
                ["password", "New Password"],
                ["password_confirmation", "Confirm Password"],
              ].map(([field, label]) => (
                <div key={field}>
                  <label className="text-slate-400">{label}</label>

                  <div
                    className="
flex
items-center
bg-slate-800
rounded-xl
mt-2
px-4
"
                  >
                    <Lock className="text-emerald-400" />

                    <input
                      type="password"
                      value={passwordForm[field]}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,

                          [field]: e.target.value,
                        })
                      }
                      className="
bg-transparent
outline-none
p-3
w-full
"
                    />
                  </div>
                </div>
              ))}

              <button
                className="
bg-blue-500
hover:bg-blue-600
px-5
py-3
rounded-xl
flex
items-center
gap-2
font-bold
"
              >
                <Lock size={18} />
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Settings;
