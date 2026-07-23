"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [logoExists, setLogoExists] = useState(true);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  // If already logged in, redirect to dashboard
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      router.push("/admin/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${apiBaseUrl}/admin/login`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid credentials. Please try again.");
      }

      localStorage.setItem("admin_token", data.token);
      localStorage.setItem("admin_user", JSON.stringify(data.user));

      router.push("/admin/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#1c1917] flex items-center justify-center font-sans selection:bg-[#b8965a] selection:text-white relative overflow-hidden">
      {/* Background decoration glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#b8965a]/5 blur-[120px]" />
      </div>

      <div className="w-full max-w-md p-6 relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 rounded-2xl border border-[#eaddc7] p-1 flex items-center justify-center bg-white shadow-sm mb-4">
            {logoExists ? (
              <img
                src="/logo.png"
                alt="Logo"
                className="h-full w-full object-contain"
                onError={() => setLogoExists(false)}
              />
            ) : (
              <div className="h-full w-full bg-[#b8965a]/10 rounded-xl flex items-center justify-center font-black text-transparent bg-clip-text bg-gradient-to-tr from-[#b8965a] to-[#d4b277]">
                N
              </div>
            )}
          </div>
          <h1 className="text-3xl font-black tracking-tight text-[#1c1917] uppercase">
            Nagpal Natraj
          </h1>
          <p className="text-xs text-[#b8965a] font-bold uppercase tracking-wider mt-1.5">Admin Portal Secure Login</p>
        </div>

        <div className="bg-white border border-[#eaddc7]/50 rounded-3xl p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#57534e] mb-2">
                Username or Email
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="e.g. admin"
                className="w-full bg-white border border-[#eaddc7] rounded-xl px-4 py-3 text-[#1c1917] placeholder-zinc-400 focus:outline-none focus:border-[#b8965a] focus:ring-1 focus:ring-[#b8965a]/20 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#57534e] mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-white border border-[#eaddc7] rounded-xl px-4 py-3 text-[#1c1917] placeholder-zinc-400 focus:outline-none focus:border-[#b8965a] focus:ring-1 focus:ring-[#b8965a]/20 transition-all text-sm"
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs flex items-center gap-2">
                <svg className="w-4 h-4 text-rose-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#b8965a] hover:bg-[#a08048] text-white py-3 rounded-xl font-bold transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer text-sm uppercase tracking-wider shadow-md shadow-[#b8965a]/15"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </>
              ) : (
                "Log In"
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#eaddc7]/30 text-center text-xs text-zinc-400">
            Default credentials: <span className="font-mono text-[#b8965a] font-bold">admin</span> / <span className="font-mono text-[#b8965a] font-bold">admin</span>
          </div>
        </div>
      </div>
    </div>
  );
}
