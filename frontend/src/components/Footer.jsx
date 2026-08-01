function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 px-8 py-10">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        <div>
          <h2 className="text-white text-xl font-bold">SecureBiz AI</h2>

          <p className="mt-3">
            AI-powered cybersecurity protection for small businesses.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold">Product</h3>

          <ul className="mt-3 space-y-2">
            <li>Website Scanner</li>

            <li>AI Reports</li>

            <li>Security Dashboard</li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold">Company</h3>

          <ul className="mt-3 space-y-2">
            <li>About</li>

            <li>Contact</li>

            <li>Support</li>
          </ul>
        </div>
      </div>

      <div className="text-center mt-10 border-t border-slate-800 pt-5">
        © 2026 SecureBiz AI. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
