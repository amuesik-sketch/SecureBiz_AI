import { useState } from "react";

import {
  ShieldCheck,
  AlertTriangle,
  Loader,
  Cpu,
  Bug,
  Lightbulb,
  CheckCircle,
  Circle,
} from "lucide-react";

import { createScan } from "../services/scan";

function Scan() {
  const [website, setWebsite] = useState("");

  const [scanning, setScanning] = useState(false);

  const [result, setResult] = useState(null);

  const [currentStep, setCurrentStep] = useState(0);

  const [progress, setProgress] = useState(0);

  const scanSteps = [
    "Connecting to website",

    "Checking HTTPS certificate",

    "Checking security headers",

    "Detecting technologies",

    "Running vulnerability analysis",

    "AI reviewing results",

    "Generating report",
  ];

  const startScan = async () => {
    if (!website) return;

    setScanning(true);

    setResult(null);

    setCurrentStep(0);

    setProgress(0);

    let step = 0;

    const interval = setInterval(() => {
      step++;

      if (step < scanSteps.length) {
        setCurrentStep(step);

        setProgress(Math.round(((step + 1) / scanSteps.length) * 100));
      }
    }, 1200);

    try {
      const response = await createScan(website);

      clearInterval(interval);

      setCurrentStep(scanSteps.length);

      setProgress(100);

      setTimeout(() => {
        setScanning(false);

        setResult(response.data);
      }, 800);
    } catch (error) {
      clearInterval(interval);

      console.log(error);

      alert(error.response?.data?.message || "Scan failed");

      setScanning(false);
    }
  };

  const riskColor = (risk) => {
    if (risk === "Low") return "text-emerald-400";

    if (risk === "Medium") return "text-yellow-400";

    return "text-red-400";
  };

  return (
    <div
      className="
min-h-screen
bg-slate-950
text-white
px-5
py-10
md:px-8
"
    >
      <div
        className="
max-w-5xl
mx-auto
"
      >
        <h1
          className="
text-4xl
font-bold
text-center
"
        >
          SecureBiz AI Scanner
        </h1>

        <p
          className="
text-center
text-slate-400
mt-3
"
        >
          Analyze your website security using AI-powered protection
        </p>

        <div
          className="
mt-10
flex
flex-col
md:flex-row
gap-3
"
        >
          <input
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://yourbusiness.com"
            className="
flex-1
px-5
py-4
bg-slate-900
border
border-slate-700
rounded-xl
outline-none
"
          />

          <button
            onClick={startScan}
            disabled={scanning}
            className="
bg-emerald-500
hover:bg-emerald-600
px-8
py-4
rounded-xl
font-bold
disabled:opacity-50
"
          >
            {scanning ? "Scanning..." : "Start Scan"}
          </button>
        </div>

        {scanning && (
          <div
            className="
mt-10
bg-slate-900
border
border-slate-800
rounded-2xl
p-8
"
          >
            <div
              className="
flex
items-center
gap-3
"
            >
              <ShieldCheck size={40} className="text-emerald-400" />

              <h2
                className="
text-2xl
font-bold
"
              >
                Security Scan Running
              </h2>
            </div>

            <div
              className="
mt-6
bg-slate-800
rounded-full
h-3
overflow-hidden
"
            >
              <div
                className="
bg-emerald-500
h-full
transition-all
duration-700
"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>

            <p
              className="
mt-3
text-right
text-emerald-400
font-bold
"
            >
              {progress}% Complete
            </p>

            <div
              className="
mt-8
space-y-4
"
            >
              {scanSteps.map((step, index) => (
                <div
                  key={step}
                  className="
flex
items-center
gap-4
"
                >
                  {index < currentStep ? (
                    <CheckCircle
                      className="
text-emerald-400
"
                    />
                  ) : index === currentStep ? (
                    <Loader
                      className="
text-yellow-400
animate-spin
"
                    />
                  ) : (
                    <Circle
                      className="
text-slate-600
"
                    />
                  )}

                  <span
                    className={
                      index <= currentStep ? "text-white" : "text-slate-500"
                    }
                  >
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {result && (
          <div
            className="
mt-10
space-y-6
"
          >
            <div
              className="
bg-slate-900
border
border-slate-800
rounded-2xl
p-8
text-center
"
            >
              <h2 className="text-xl">Security Score</h2>

              <p
                className="
text-6xl
font-bold
text-emerald-400
mt-4
"
              >
                {result.score}/100
              </p>

              <div
                className="
flex
justify-center
gap-8
mt-5
"
              >
                <p>
                  Grade:
                  <b className="ml-2">{result.grade}</b>
                </p>

                <p className={riskColor(result.risk)}>
                  Risk:
                  <b className="ml-2">{result.risk}</b>
                </p>
              </div>
            </div>

            <div
              className="
bg-slate-900
rounded-2xl
p-8
"
            >
              <h2
                className="
text-2xl
font-bold
mb-5
"
              >
                Security Checks
              </h2>

              {result.checks?.map((check, index) => (
                <div
                  key={index}
                  className="
flex
gap-3
items-center
mb-4
"
                >
                  {check.status === "Passed" ? (
                    <ShieldCheck className="text-emerald-400" />
                  ) : (
                    <AlertTriangle className="text-yellow-400" />
                  )}

                  <span>
                    {check.name} - {check.status}
                  </span>
                </div>
              ))}
            </div>

            <div
              className="
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
                Vulnerabilities
              </h2>

              {result.vulnerabilities?.length > 0 ? (
                result.vulnerabilities.map((v, index) => (
                  <div
                    key={index}
                    className="
      mt-6
      border
      border-slate-700
      rounded-xl
      p-6
      bg-slate-800/50
      "
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold">{v.title}</h3>

                      <span
                        className={`
          px-3
          py-1
          rounded-full
          text-sm
          font-bold

          ${
            v.severity === "High"
              ? "bg-red-500/20 text-red-400"
              : v.severity === "Medium"
                ? "bg-yellow-500/20 text-yellow-400"
                : "bg-emerald-500/20 text-emerald-400"
          }
          `}
                      >
                        {v.severity} Risk
                      </span>
                    </div>

                    <div className="mt-5">
                      <h4 className="font-semibold text-red-400">Impact</h4>

                      <p className="text-slate-300 mt-2">{v.impact}</p>
                    </div>

                    <div className="mt-5">
                      <h4 className="font-semibold text-emerald-400">
                        Recommended Fix
                      </h4>

                      <p className="text-slate-300 mt-2">{v.fix}</p>
                    </div>

                    <div className="mt-5">
                      <h4 className="font-semibold text-blue-400">Reference</h4>

                      <p className="text-slate-400 mt-2">
                        OWASP Secure Headers Project
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-emerald-400 mt-5">
                  No vulnerabilities detected.
                </p>
              )}
            </div>

            <div
              className="
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
                Technologies
              </h2>

              <div
                className="
flex
flex-wrap
gap-3
mt-5
"
              >
                {result.technologies?.map((tech, index) => (
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

            <div
              className="
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
                {result.recommendations?.map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>

            <div
              className="
bg-slate-900
rounded-2xl
p-8
"
            >
              <h2 className="text-2xl font-bold">AI Security Analysis</h2>

              <p
                className="
mt-5
text-slate-400
leading-7
"
              >
                {result.ai_analysis}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Scan;
