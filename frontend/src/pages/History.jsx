import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getScans } from "../services/scan";
import {
  Eye,
  Download,
  ShieldCheck,
  Search,
  Globe,
  Calendar,
} from "lucide-react";

import { deleteScan } from "../services/scan";
import { Trash2 } from "lucide-react";

function History() {
  const [scans, setScans] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [riskFilter, setRiskFilter] = useState("All");

  useEffect(() => {
    const loadScans = async () => {
      try {
        const response = await getScans();

        setScans(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    loadScans();
  }, []);

  const filteredScans = scans.filter((scan) => {
    const matchesSearch = scan.website
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesRisk = riskFilter === "All" || scan.risk === riskFilter;

    return matchesSearch && matchesRisk;
  });

  const riskStyle = (risk) => {
    if (risk === "Low") return "bg-emerald-500/20 text-emerald-400";

    if (risk === "Medium") return "bg-yellow-500/20 text-yellow-400";

    return "bg-red-500/20 text-red-400";
  };

  const downloadPDF = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://securebiz-ai.onrender.com/api/scans/${id}/pdf`,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/pdf",
          },
        },
      );

      if (!response.ok) {
        const errorText = await response.text();

        console.log(errorText);

        throw new Error("PDF download failed");
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = "SecureBiz-AI-Security-Report.pdf";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);

      alert("Could not download PDF");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this scan?",
    );

    if (!confirmDelete) return;

    try {
      await deleteScan(id);

      setScans(scans.filter((scan) => scan.id !== id));
    } catch (error) {
      console.log(error);

      alert("Could not delete scan");
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
        Loading scan history...
      </div>
    );
  }

  return (
    <div
      className="
      min-h-screen
      bg-slate-950
      text-white
      p-6 md:p-8
      "
    >
      <div
        className="
        max-w-7xl
        mx-auto
        "
      >
        {/* HEADER */}

        <div className="flex items-center gap-3">
          <ShieldCheck size={40} className="text-emerald-400" />

          <h1
            className="
            text-3xl
            md:text-4xl
            font-bold
            "
          >
            Scan History
          </h1>
        </div>

        <p
          className="
          text-slate-400
          mt-3
          "
        >
          View your previous security assessments.
        </p>

        {/* SEARCH */}

        <div
          className="
          mt-8
          flex
          flex-col
          md:flex-row
          gap-4
          "
        >
          <div
            className="
            flex
            items-center
            bg-slate-900
            border
            border-slate-800
            rounded-xl
            px-4
            flex-1
            "
          >
            <Search size={20} className="text-slate-400" />

            <input
              type="text"
              placeholder="Search website..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
              bg-transparent
              outline-none
              px-4
              py-3
              w-full
              "
            />
          </div>

          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="
            bg-slate-900
            border
            border-slate-800
            rounded-xl
            px-5
            py-3
            "
          >
            <option>All</option>

            <option>Low</option>

            <option>Medium</option>

            <option>High</option>
          </select>
        </div>

        {filteredScans.length === 0 ? (
          <div
            className="
              mt-10
              bg-slate-900
              rounded-xl
              p-8
              "
          >
            <p className="text-slate-400">No scans available.</p>
          </div>
        ) : (
          <>
            {/* DESKTOP TABLE */}

            <div
              className="
            hidden
            md:block
            mt-10
            bg-slate-900
            border
            border-slate-800
            rounded-2xl
            overflow-hidden
            "
            >
              <table className="w-full">
                <thead className="bg-slate-800">
                  <tr>
                    <th className="p-5 text-left">Website</th>

                    <th className="p-5">Score</th>

                    <th className="p-5">Grade</th>

                    <th className="p-5">Risk</th>

                    <th className="p-5">Date</th>

                    <th className="p-5">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredScans.map((scan) => (
                    <tr
                      key={scan.id}
                      className="
          border-t
          border-slate-800
          hover:bg-slate-800/40
          "
                    >
                      <td className="p-5 font-semibold">{scan.website}</td>

                      <td
                        className="
          p-5
          text-center
          text-3xl
          font-bold
          text-emerald-400
          "
                      >
                        {scan.score}

                        <span className="text-slate-400 text-base">/100</span>
                      </td>

                      <td className="p-5 text-center">
                        <span
                          className="
          bg-blue-500/20
          text-blue-400
          px-4
          py-2
          rounded-full
          font-bold
          "
                        >
                          {scan.grade || "N/A"}
                        </span>
                      </td>

                      <td className="p-5 text-center">
                        <span
                          className={`
          px-4
          py-2
          rounded-full
          font-bold
          ${riskStyle(scan.risk)}
          `}
                        >
                          {scan.risk}
                        </span>
                      </td>

                      <td
                        className="
          p-5
          text-center
          text-slate-400
          "
                      >
                        {new Date(scan.created_at).toLocaleDateString()}
                      </td>

                      <td className="p-5">
                        <div
                          className="
    flex
    gap-3
    justify-center
    flex-wrap
    "
                        >
                          <Link
                            to={`/report/${scan.id}`}
                            className="
      bg-emerald-500
      hover:bg-emerald-600
      px-4
      py-2
      rounded-lg
      flex
      items-center
      gap-2
      font-semibold
      "
                          >
                            <Eye size={16} />
                            View Report
                          </Link>

                          <button
                            onClick={() => downloadPDF(scan.id)}
                            className="
      bg-blue-500
      hover:bg-blue-600
      px-4
      py-2
      rounded-lg
      flex
      items-center
      gap-2
      font-semibold
      "
                          >
                            <Download size={16} />
                            PDF
                          </button>

                          <button
                            onClick={() => handleDelete(scan.id)}
                            className="
      bg-red-500
      hover:bg-red-600
      px-4
      py-2
      rounded-lg
      flex
      items-center
      gap-2
      font-semibold
      "
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE CARDS */}

            <div
              className="
          md:hidden
          mt-8
          space-y-5
          "
            >
              {filteredScans.map((scan) => (
                <div
                  key={scan.id}
                  className="
          bg-slate-900
          border
          border-slate-800
          rounded-2xl
          p-6
          "
                >
                  <div className="flex gap-3 items-center">
                    <Globe className="text-emerald-400" />

                    <h2 className="font-bold break-all">{scan.website}</h2>
                  </div>

                  <div
                    className="
          grid
          grid-cols-2
          gap-4
          mt-6
          "
                  >
                    <div>
                      <p className="text-slate-400">Score</p>

                      <p
                        className="
          text-3xl
          font-bold
          text-emerald-400
          "
                      >
                        {scan.score}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-400">Grade</p>

                      <p className="text-blue-400 font-bold text-xl">
                        {scan.grade || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <span
                      className={`
          px-4
          py-2
          rounded-full
          font-bold
          ${riskStyle(scan.risk)}
          `}
                    >
                      {scan.risk}
                    </span>
                  </div>

                  <p
                    className="
          text-slate-400
          mt-5
          flex
          gap-2
          "
                  >
                    <Calendar size={18} />

                    {new Date(scan.created_at).toLocaleDateString()}
                  </p>

                  <div
                    className="
          flex
          gap-3
          mt-6
          "
                  >
                    <Link
                      to={`/report/${scan.id}`}
                      className="
          flex-1
          bg-emerald-500
          text-center
          py-3
          rounded-lg
          "
                    >
                      View
                    </Link>

                    <button
                      onClick={() => downloadPDF(scan.id)}
                      className="
          flex-1
          bg-blue-500
          rounded-lg
          "
                    >
                      PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default History;
