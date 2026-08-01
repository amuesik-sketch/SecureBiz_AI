import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboard } from "../services/scan";
import { getProfile } from "../services/profile";
import {
  ShieldCheck,
  AlertTriangle,
  Activity,
  Search,
  PieChart as PieIcon,
  TrendingUp,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

function Dashboard() {
  const [data, setData] = useState(null);

  const [profile, setProfile] = useState(null);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const dashboardResponse = await getDashboard();

        const profileResponse = await getProfile();

        setData(dashboardResponse.data);

        setProfile(profileResponse.data);
      } catch (error) {
        console.log(error);

        setError(error.response?.data?.message || "Dashboard failed");
      }
    };

    loadDashboard();
  }, []);

  if (error) {
    return (
      <div
        className="
      min-h-screen
      bg-slate-950
      text-white
      flex
      items-center
      justify-center
      p-6
      "
      >
        <div
          className="
        bg-red-900/40
        border
        border-red-700
        rounded-xl
        p-8
        "
        >
          <h1 className="text-2xl font-bold">Dashboard Error</h1>

          <p className="mt-3 text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
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
        Loading dashboard...
      </div>
    );
  }

  const scoreData = [...data.recentScans].reverse().map((scan, index) => ({
    name: `Scan ${index + 1}`,

    score: scan.score,
  }));

  const riskData = [
    {
      name: "Low",
      value: data.lowRisk,
    },

    {
      name: "Medium",
      value: data.mediumRisk,
    },

    {
      name: "High",
      value: data.highRisk,
    },
  ];

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
max-w-7xl
mx-auto
"
      >
        <h1
          className="
text-4xl
font-bold
"
        >
          Welcome back, {profile?.user?.name} 👋
        </h1>

        <p
          className="
text-slate-400
mt-2
"
        >
          Your security overview for today
        </p>

        <div
          className="
mt-5
inline-flex
items-center
gap-2
bg-emerald-500/10
border
border-emerald-500/30
px-4
py-2
rounded-full
text-emerald-400
"
        >
          <ShieldCheck size={18} />
          Account Active
        </div>

        {/* STAT CARDS */}

        <div
          className="
grid
grid-cols-1
sm:grid-cols-2
lg:grid-cols-5
gap-5
mt-10
"
        >
          <Card title="Total Scans" value={data.totalScans} icon={<Search />} />

          <Card
            title="Average Score"
            value={`${data.averageScore}%`}
            icon={<Activity />}
          />

          <Card
            title="Low Risk"
            value={data.lowRisk}
            color="text-emerald-400"
            icon={<ShieldCheck />}
          />

          <Card
            title="Medium Risk"
            value={data.mediumRisk}
            color="text-yellow-400"
            icon={<AlertTriangle />}
          />

          <Card
            title="High Risk"
            value={data.highRisk}
            color="text-red-400"
            icon={<AlertTriangle />}
          />
        </div>

        {/* CHARTS */}

        <div
          className="
grid
grid-cols-1
lg:grid-cols-2
gap-6
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
            <h2
              className="
text-xl
font-bold
flex
items-center
gap-2
"
            >
              <TrendingUp />
              Security Score Trend
            </h2>

            <div
              className="
h-64
md:h-72
mt-5
"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scoreData}>
                  <XAxis dataKey="name" />

                  <YAxis domain={[0, 100]} />

                  <Tooltip />

                  <Line type="monotone" dataKey="score" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
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
            <h2
              className="
text-xl
font-bold
flex
gap-2
items-center
"
            >
              <PieIcon />
              Risk Distribution
            </h2>

            <div
              className="
h-64
md:h-72
mt-5
"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={90}
                    label
                  >
                    {riskData.map((item, index) => (
                      <Cell
                        key={index}
                        fill={
                          index === 0
                            ? "#10b981"
                            : index === 1
                              ? "#eab308"
                              : "#ef4444"
                        }
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* RECENT SCANS */}

        <div className="mt-12">
          <h2
            className="
text-2xl
font-bold
"
          >
            Recent Scans
          </h2>

          {data.recentScans.length === 0 ? (
            <div
              className="
mt-5
bg-slate-900
rounded-xl
p-8
"
            >
              <p className="text-slate-400">No scans available yet.</p>

              <Link
                to="/scan"
                className="
text-emerald-400
inline-block
mt-3
"
              >
                Run your first scan →
              </Link>
            </div>
          ) : (
            <div
              className="
mt-5
space-y-5
"
            >
              {data.recentScans.map((scan) => (
                <div
                  key={scan.id}
                  className="
bg-slate-900
border
border-slate-800
rounded-xl
p-6
flex
flex-col
md:flex-row
md:justify-between
gap-5
"
                >
                  <div>
                    <h3
                      className="
font-bold
text-lg
break-all
"
                    >
                      {scan.website}
                    </h3>

                    <p
                      className="
text-slate-400
mt-2
"
                    >
                      {new Date(scan.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div
                    className="
md:text-right
"
                  >
                    <p
                      className="
text-3xl
font-bold
"
                    >
                      {scan.score}
                    </p>

                    <p
                      className={
                        scan.risk === "Low"
                          ? "text-emerald-400"
                          : scan.risk === "Medium"
                            ? "text-yellow-400"
                            : "text-red-400"
                      }
                    >
                      {scan.risk}
                    </p>

                    <Link
                      to={`/report/${scan.id}`}
                      className="
text-emerald-400
text-sm
mt-2
inline-block
"
                    >
                      View Report →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Card({ title, value, icon, color = "text-white" }) {
  return (
    <div
      className="
bg-slate-900
border
border-slate-800
rounded-xl
p-5
"
    >
      <div
        className="
flex
justify-between
items-center
"
      >
        <h2
          className="
text-slate-400
"
        >
          {title}
        </h2>

        <div
          className="
text-emerald-400
"
        >
          {icon}
        </div>
      </div>

      <p
        className={`
text-4xl
font-bold
mt-5
${color}
`}
      >
        {value}
      </p>
    </div>
  );
}

export default Dashboard;
