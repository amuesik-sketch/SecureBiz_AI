import { Shield, Globe, FileText } from "lucide-react";

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 hover:border-emerald-400 transition">
      <div className="mb-5 text-emerald-400">{icon}</div>

      <h3 className="text-xl font-bold mb-3">{title}</h3>

      <p className="text-slate-400">{description}</p>
    </div>
  );
}

export default FeatureCard;
