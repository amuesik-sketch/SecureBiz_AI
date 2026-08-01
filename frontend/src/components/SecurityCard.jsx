import { ShieldCheck, CheckCircle, AlertTriangle } from "lucide-react";

function SecurityCard() {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-md shadow-xl">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Security Score</h2>

        <ShieldCheck className="text-emerald-400" size={35} />
      </div>

      <div className="text-center mt-8">
        <h1 className="text-6xl font-bold text-emerald-400">87</h1>

        <p className="text-slate-400">out of 100</p>
      </div>

      <div className="mt-8 space-y-4">
        <div className="flex items-center gap-3">
          <CheckCircle className="text-emerald-400" />

          <span>HTTPS Enabled</span>
        </div>

        <div className="flex items-center gap-3">
          <CheckCircle className="text-emerald-400" />

          <span>SSL Certificate Valid</span>
        </div>

        <div className="flex items-center gap-3">
          <AlertTriangle className="text-yellow-400" />

          <span>Missing Security Headers</span>
        </div>

        <div className="flex items-center gap-3">
          <AlertTriangle className="text-yellow-400" />

          <span>Weak Password Policy</span>
        </div>
      </div>

      <div className="mt-8 bg-slate-800 rounded-xl p-4">
        <h3 className="font-semibold">AI Recommendation</h3>

        <p className="text-sm text-slate-400 mt-2">
          Enable Content Security Policy and improve authentication security.
        </p>
      </div>
    </div>
  );
}

export default SecurityCard;
