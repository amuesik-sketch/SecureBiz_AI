import Navbar from "../components/Navbar";
import SecurityCard from "../components/SecurityCard";
import FeatureCard from "../components/FeatureCard";
import HowItWorks from "../components/HowItWorks";
import Footer from "../components/Footer";

import {
  Shield,
  Globe,
  FileText,
  Brain,
  Lock,
  BarChart3,
  CheckCircle,
} from "lucide-react";

import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      {/* HERO SECTION */}

      <section className="px-8 py-24 text-center">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-400">
            <Shield size={18} />
            AI-Powered Cybersecurity Platform
          </div>

          <h1 className="mt-8 text-5xl md:text-7xl font-bold leading-tight">
            Protect Your Business
            <br />
            <span className="text-cyan-400">With AI Cybersecurity</span>
          </h1>

          <p className="mt-8 text-lg text-slate-400 max-w-3xl mx-auto">
            Scan websites. Detect vulnerabilities. Receive AI-powered security
            recommendations.
            <br />
            SecureBiz AI helps small businesses discover security risks before
            attackers do.
          </p>

          <div className="mt-10 flex justify-center gap-5 flex-wrap">
            <Link
              to="/scan"
              className="bg-cyan-500 text-slate-950 px-8 py-4 rounded-xl font-semibold hover:bg-cyan-400 transition"
            >
              Start Free Scan
            </Link>

            <Link
              to="/register"
              className="border border-cyan-400 px-8 py-4 rounded-xl hover:bg-cyan-400 hover:text-slate-950 transition"
            >
              Create Account
            </Link>
          </div>
        </div>

        <div className="mt-20 flex justify-center">
          <SecurityCard />
        </div>
      </section>

      {/* SECURITY STATISTICS */}

      <section className="px-8 py-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-6">
          <Stat number="10,000+" text="Websites Scanned" />

          <Stat number="50,000+" text="Vulnerabilities Found" />

          <Stat number="95%" text="Detection Accuracy" />

          <Stat number="24/7" text="Security Monitoring" />
        </div>
      </section>

      {/* FEATURES */}

      <section id="features" className="px-8 py-20">
        <h2 className="text-4xl font-bold text-center">
          Powerful Security Features
        </h2>

        <p className="text-center text-slate-400 mt-4">
          Everything your business needs to stay protected.
        </p>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 mt-12">
          <FeatureCard
            icon={<Brain size={40} />}
            title="AI Threat Detection"
            description="Analyze websites with AI and identify security weaknesses."
          />

          <FeatureCard
            icon={<Globe size={40} />}
            title="Website Security Scanner"
            description="Check HTTPS, security headers, cookies and vulnerabilities."
          />

          <FeatureCard
            icon={<FileText size={40} />}
            title="Security Reports"
            description="Get detailed reports with risks and recommended fixes."
          />
        </div>
      </section>

      {/* HOW IT WORKS */}

      <section id="how-it-works">
        <HowItWorks />
      </section>

      {/* TRUST SECTION */}

      <section className="px-8 py-20">
        <div className="max-w-5xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-10">
          <h2 className="text-3xl font-bold text-center">
            Built For Modern Business Security
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mt-10">
            <TrustItem icon={<Lock />} text="Secure Website Analysis" />

            <TrustItem icon={<BarChart3 />} text="Simple Risk Scoring" />

            <TrustItem icon={<CheckCircle />} text="Actionable Fixes" />
          </div>
        </div>
      </section>

      {/* SCREENSHOT PREVIEW SECTION */}

      <section className="px-8 py-20">
        <h2 className="text-4xl font-bold text-center">
          See Security Insights Instantly
        </h2>

        <p className="text-center text-slate-400 mt-4">
          Monitor scans, vulnerabilities and reports from one dashboard.
        </p>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 mt-12">
          <DashboardPreview
            title="Security Dashboard"
            icon={<BarChart3 size={35} />}
            description="Monitor your website security posture with clear scores, risk levels and security insights."
            items={[
              "Real-time security score",
              "Risk level assessment",
              "Scan history tracking",
            ]}
          />

          <DashboardPreview
            title="Vulnerability Report"
            icon={<Shield size={35} />}
            description="Understand security weaknesses with detailed vulnerability reports and impact analysis."
            items={[
              "OWASP-based findings",
              "Severity classification",
              "Recommended fixes",
            ]}
          />

          <DashboardPreview
            title="AI Recommendations"
            icon={<Brain size={35} />}
            description="Receive intelligent recommendations that help improve your website security."
            items={[
              "Actionable security advice",
              "Easy-to-understand solutions",
              "Business-focused protection",
            ]}
          />
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Stat({ number, text }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
      <h3 className="text-4xl font-bold text-cyan-400">{number}</h3>

      <p className="mt-2 text-slate-400">{text}</p>
    </div>
  );
}

function TrustItem({ icon, text }) {
  return (
    <div className="flex flex-col items-center text-center gap-3">
      <div className="text-cyan-400">{icon}</div>

      <p className="text-slate-300">{text}</p>
    </div>
  );
}

function DashboardPreview({ title, icon, description, items }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-cyan-400 transition">
      <div className="flex items-center gap-4 text-cyan-400 mb-6">
        <div className="p-3 bg-cyan-500/10 rounded-xl">{icon}</div>

        <h3 className="text-xl font-semibold text-white">{title}</h3>
      </div>

      <p className="text-slate-400 leading-relaxed mb-6">{description}</p>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 text-sm text-slate-300"
          >
            <CheckCircle size={18} className="text-cyan-400" />

            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Landing;
