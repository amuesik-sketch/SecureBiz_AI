import { Search, Brain, FileCheck } from "lucide-react";

function HowItWorks() {
  const steps = [
    {
      icon: <Search size={40} />,
      title: "Enter Your Website",
      description:
        "Provide your business website URL and start a security analysis.",
    },

    {
      icon: <Brain size={40} />,
      title: "AI Security Analysis",
      description:
        "Our AI checks vulnerabilities, configurations, and security weaknesses.",
    },

    {
      icon: <FileCheck size={40} />,
      title: "Get Your Report",
      description:
        "Receive a simple security report with recommended improvements.",
    },
  ];

  return (
    <section className="px-8 py-20">
      <h2 className="text-4xl font-bold text-center">How SecureBiz AI Works</h2>

      <p className="text-center text-slate-400 mt-4">
        Protect your business in three simple steps.
      </p>

      <div className="grid md:grid-cols-3 gap-8 mt-12">
        {steps.map((step, index) => (
          <div
            key={index}
            className="bg-slate-900 border border-slate-700 rounded-2xl p-8 text-center"
          >
            <div className="flex justify-center text-emerald-400 mb-5">
              {step.icon}
            </div>

            <h3 className="text-xl font-bold mb-3">{step.title}</h3>

            <p className="text-slate-400">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;
