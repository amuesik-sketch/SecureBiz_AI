import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getScan } from "../services/scan";
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Globe,
  Cpu,
  Bug,
  Lightbulb,
  ArrowLeft,
} from "lucide-react";
import axios from "axios";
import { FileDown } from "lucide-react";
// Remove duplicate vulnerability titles
function normalizeTitle(title) {
  if (!title) return "";

  const lowered = title.toLowerCase().trim();

  const clean = lowered.replace(/[^a-z0-9]+/gi, " ").replace(/\bheader\b/g, "");

  return clean.replace(/\s+/g, " ").trim();
}

function dedupeByTitle(items) {
  if (!Array.isArray(items)) return [];

  const seen = new Set();

  const unique = [];

  for (const item of items) {
    const key = normalizeTitle(item.title);

    if (!key || seen.has(key)) continue;

    seen.add(key);

    unique.push(item);
  }

  return unique;
}

function dedupeStrings(items) {
  if (!Array.isArray(items)) return [];

  const seen = new Set();

  const unique = [];

  for (const item of items) {
    const key = item.trim().toLowerCase();

    if (!key || seen.has(key)) continue;

    seen.add(key);

    unique.push(item);
  }

  return unique;
}

function Report() {
  const { id } = useParams();

  const [scan, setScan] = useState(null);

  const [loading, setLoading] = useState(true);

  const downloadPDF = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/scans/${id}/pdf`,
        {
          responseType: "blob",

          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const file = new Blob([response.data], {
        type: "application/pdf",
      });

      const fileURL = URL.createObjectURL(file);

      const link = document.createElement("a");

      link.href = fileURL;

      link.download = "SecureBiz-AI-Security-Report.pdf";

      document.body.appendChild(link);

      link.click();

      link.remove();
    } catch (error) {
      console.log(error);

      alert("Unable to download PDF");
    }
  };
  useEffect(() => {
    const loadReport = async () => {
      try {
        const response = await getScan(id);

        setScan(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, [id]);

  if (loading) {
    return (
      <div
        className="
      min-h-screen bg-slate-950
      text-white flex items-center justify-center
      "
      >
        Loading report...
      </div>
    );
  }

  if (!scan) {
    return (
      <div
        className="
      min-h-screen bg-slate-950
      text-white flex items-center justify-center
      "
      >
        Report not found
      </div>
    );
  }

  const passed =
    scan.checks?.filter((item) => item.status === "Passed").length || 0;

  const warnings =
    scan.checks?.filter((item) => item.status === "Warning").length || 0;

  const vulnerabilities = dedupeByTitle(scan.vulnerabilities);

  const recommendations = dedupeStrings(scan.recommendations);

  const riskColor =
    scan.risk === "Low"
      ? "text-emerald-400"
      : scan.risk === "Medium"
        ? "text-yellow-400"
        : "text-red-400";

  return (
    <div
      className="
min-h-screen
bg-slate-950
text-white
px-8
py-12
"
    >
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold">Security Report</h1>

        <div
          className="
flex items-center gap-2
text-slate-400
mt-3
"
        >
          <Globe size={18} />

          {scan.website}
        </div>

        <button
          onClick={downloadPDF}
          className="
mt-5
flex
items-center
gap-2
bg-emerald-500
px-6
py-3
rounded-lg
font-semibold
hover:bg-emerald-600
"
        >
          <FileDown size={20} />
          Download PDF Report
        </button>

        {/* SCORE */}

        <div
          className="
mt-8
bg-slate-900
border border-slate-800
rounded-2xl
p-8
grid md:grid-cols-3
gap-6
text-center
"
        >
          <div>
            <p className="text-slate-400">Security Score</p>

            <p
              className="
text-6xl
font-bold
text-emerald-400
mt-3
"
            >
              {scan.score}
            </p>

            <p className="text-slate-400">/100</p>
          </div>

          <div>
            <p className="text-slate-400">Grade</p>

            <p
              className="
text-6xl
font-bold
text-blue-400
mt-3
"
            >
              {scan.grade || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-slate-400">Risk Level</p>

            <p
              className={`
text-4xl
font-bold
mt-8
${riskColor}
`}
            >
              {scan.risk}
            </p>
          </div>
        </div>

        {/* SUMMARY */}

        <div
          className="
grid md:grid-cols-3
gap-5
mt-8
"
        >
          <div className="bg-slate-900 p-6 rounded-xl">
            <p className="text-slate-400">Total Checks</p>

            <p className="text-4xl font-bold mt-3">
              {scan.checks?.length || 0}
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl">
            <p className="text-slate-400">Passed</p>

            <p
              className="
text-4xl
font-bold
text-emerald-400
mt-3
"
            >
              {passed}
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl">
            <p className="text-slate-400">Warnings</p>

            <p
              className="
text-4xl
font-bold
text-yellow-400
mt-3
"
            >
              {warnings}
            </p>
          </div>
        </div>

        {/* CHECKS */}

        <div
          className="
mt-10
bg-slate-900
rounded-2xl
p-8
"
        >
          <h2 className="text-2xl font-bold mb-6">Security Checks</h2>

          <div className="space-y-4">
            {scan.checks?.map((check, index) => (
              <div
                key={index}
                className="
flex justify-between
items-center
bg-slate-800
p-4
rounded-lg
"
              >
                <span>{check.name}</span>

                <div className="flex items-center gap-2">
                  {check.status === "Passed" ? (
                    <CheckCircle className="text-emerald-400" />
                  ) : check.status === "Failed" ? (
                    <XCircle className="text-red-400" />
                  ) : (
                    <AlertTriangle className="text-yellow-400" />
                  )}

                  <span>{check.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI REPORT */}

        <div
          className="
mt-10
bg-slate-900
rounded-2xl
p-8
"
        >
          <h2 className="text-2xl font-bold">AI Security Analysis</h2>

          <p
            className="
text-slate-400
mt-5
leading-7
"
          >
            {scan.ai_analysis
              ? scan.ai_analysis
              : "No AI analysis available for this scan."}{" "}
          </p>
        </div>

        {/* VULNERABILITIES */}

        <div
          className="
mt-10
bg-slate-900
rounded-2xl
p-8
"
        >
          <h2
            className="
text-2xl
font-bold
flex
gap-2
"
          >
            <Bug />
            Security Findings
          </h2>

          <div className="mt-5 space-y-4">
            {vulnerabilities.length > 0 ? (
              vulnerabilities.map((item, index) => (
                <div
                  key={index}
                  className="
bg-slate-800
rounded-xl
p-5
"
                >
                  <h3
                    className="
font-bold
text-red-400
"
                  >
                    {item.title}
                  </h3>

                  <p className="mt-2">
                    Severity:
                    <span className="font-bold">{item.severity}</span>
                  </p>

                  <p className="text-slate-400 mt-3">{item.impact}</p>

                  <p className="text-emerald-400 mt-3">
                    Fix:
                    {item.fix}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-emerald-400">No security findings detected.</p>
            )}
          </div>
        </div>

        {/* RECOMMENDATIONS */}

        <div
          className="
mt-10
bg-slate-900
rounded-2xl
p-8
"
        >
          <h2
            className="
text-2xl
font-bold
flex
gap-2
"
          >
            <Lightbulb />
            Recommendations
          </h2>

          <ul
            className="
mt-5
space-y-3
text-slate-400
"
          >
            {recommendations.length ? (
              recommendations.map((item, index) => (
                <li key={index}>• {item}</li>
              ))
            ) : (
              <li className="text-emerald-400">
                Excellent security configuration.
              </li>
            )}
          </ul>
        </div>

        {/* TECHNOLOGIES */}

        <div
          className="
mt-10
bg-slate-900
rounded-2xl
p-8
"
        >
          <h2
            className="
text-2xl
font-bold
flex
gap-2
"
          >
            <Cpu />
            Detected Technologies
          </h2>

          <div
            className="
flex
flex-wrap
gap-3
mt-5
"
          >
            {scan.technologies?.map((tech, index) => (
              <span
                key={index}
                className="
bg-slate-800
px-4
py-2
rounded-full
"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <Link
          to="/history"
          className="
inline-flex
items-center
gap-2
mt-8
text-emerald-400
"
        >
          <ArrowLeft size={18} />
          Back to History
        </Link>
      </div>
    </div>
  );
}

export default Report;
