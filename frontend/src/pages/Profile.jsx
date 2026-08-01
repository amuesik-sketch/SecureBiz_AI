import { useEffect, useState } from "react";
import { getProfile } from "../services/profile";

import {
  User,
  Mail,
  Calendar,
  ShieldCheck,
  Activity,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

function Profile() {
  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await getProfile();

        console.log(response.data);

        setProfile(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

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
        Loading profile...
      </div>
    );
  }

  if (!profile) {
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
        Profile unavailable
      </div>
    );
  }

  const user = profile.user;

  const stats = profile.statistics;

  return (
    <div
      className="
min-h-screen
bg-slate-950
text-white
p-5
md:p-8
"
    >
      <div
        className="
max-w-6xl
mx-auto
"
      >
        {/* HEADER */}

        <div
          className="
bg-slate-900
border
border-slate-800
rounded-2xl
p-8
flex
flex-col
md:flex-row
items-center
gap-6
"
        >
          <div
            className="
w-24
h-24
rounded-full
bg-emerald-500/20
flex
items-center
justify-center
"
          >
            <User size={50} className="text-emerald-400" />
          </div>

          <div>
            <h1
              className="
text-3xl
font-bold
"
            >
              {user.name}
            </h1>

            <p
              className="
text-slate-400
mt-2
"
            >
              SecureBiz AI Account
            </p>

            <div
              className="
flex
flex-col
sm:flex-row
gap-4
mt-4
text-slate-300
"
            >
              <div
                className="
flex
items-center
gap-2
"
              >
                <Mail size={18} className="text-emerald-400" />

                {user.email}
              </div>

              <div
                className="
flex
items-center
gap-2
"
              >
                <Calendar size={18} className="text-emerald-400" />
                Joined {user.joined}
              </div>
            </div>
          </div>
        </div>

        {/* STATISTICS */}

        <div
          className="
grid
grid-cols-1
sm:grid-cols-2
lg:grid-cols-4
gap-5
mt-8
"
        >
          <StatCard
            title="Total Scans"
            value={stats.totalScans}
            icon={<ShieldCheck />}
          />

          <StatCard
            title="Average Score"
            value={`${stats.averageScore}/100`}
            icon={<TrendingUp />}
          />

          <StatCard
            title="Low Risk"
            value={stats.lowRisk}
            color="text-emerald-400"
            icon={<ShieldCheck />}
          />

          <StatCard
            title="High Risk"
            value={stats.highRisk}
            color="text-red-400"
            icon={<AlertTriangle />}
          />
        </div>

        {/* SECURITY ACTIVITY */}

        <div
          className="
mt-8
grid
grid-cols-1
md:grid-cols-2
gap-6
"
        >
          <div
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
text-xl
font-bold
mb-6
"
            >
              Security Overview
            </h2>

            <div
              className="
space-y-5
"
            >
              <ActivityRow
                label="Average Security Score"
                value={`${stats.averageScore}%`}
              />

              <ActivityRow label="Medium Risk Scans" value={stats.mediumRisk} />

              <ActivityRow label="High Risk Scans" value={stats.highRisk} />
            </div>
          </div>

          <div
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
text-xl
font-bold
mb-6
"
            >
              Account Status
            </h2>

            <div
              className="
flex
items-center
gap-4
"
            >
              <div
                className="
w-14
h-14
rounded-xl
bg-emerald-500/20
flex
items-center
justify-center
"
              >
                <ShieldCheck className="text-emerald-400" size={30} />
              </div>

              <div>
                <p
                  className="
text-slate-400
"
                >
                  Status
                </p>

                <p
                  className="
text-emerald-400
font-bold
text-xl
"
                >
                  Active
                </p>
              </div>
            </div>

            <p
              className="
text-slate-400
mt-6
leading-7
"
            >
              Your SecureBiz AI account is actively monitoring your security
              assessments and storing your scan history.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color = "text-white" }) {
  return (
    <div
      className="
bg-slate-900
border
border-slate-800
rounded-xl
p-6
"
    >
      <div
        className="
flex
justify-between
items-center
"
      >
        <p
          className="
text-slate-400
"
        >
          {title}
        </p>

        <div
          className="
text-emerald-400
"
        >
          {icon}
        </div>
      </div>

      <h2
        className={`
text-4xl
font-bold
mt-5
${color}
`}
      >
        {value}
      </h2>
    </div>
  );
}

function ActivityRow({ label, value }) {
  return (
    <div
      className="
flex
justify-between
items-center
bg-slate-800
rounded-xl
p-4
"
    >
      <p className="text-slate-300">{label}</p>

      <p
        className="
font-bold
text-emerald-400
"
      >
        {value}
      </p>
    </div>
  );
}

export default Profile;
