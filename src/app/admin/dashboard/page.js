"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoExists, setLogoExists] = useState(true);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  useEffect(() => {
    const storedToken = localStorage.getItem("admin_token");
    const storedUser = localStorage.getItem("admin_user");

    if (!storedToken) {
      router.push("/admin");
      return;
    }

    setToken(storedToken);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const verifyToken = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/admin/me`, {
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${storedToken}`,
          },
        });

        if (!res.ok) {
          throw new Error("Session expired");
        }

        const userData = await res.json();
        setUser(userData);
        localStorage.setItem("admin_user", JSON.stringify(userData));
        setLoading(false);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
        router.push("/admin");
      }
    };

    verifyToken();
  }, [router]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch(`${apiBaseUrl}/admin/logout`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      setLoggingOut(false);
      router.push("/admin");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-[#1c1917] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-8 w-8 text-[#b8965a]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-zinc-400 text-sm">Verifying session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#1c1917] flex font-sans selection:bg-[#b8965a] selection:text-white">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-white/10 bg-[#1c1917] flex flex-col shrink-0">
        {/* Brand */}
        <div className="p-6 border-b border-white/10 flex items-center gap-3 text-white">
          <div className="h-9 w-9 rounded-xl border border-[#eaddc7] p-0.5 flex items-center justify-center bg-white">
            {logoExists ? (
              <img
                src="/logo.png"
                alt="Logo"
                className="h-full w-full object-contain"
                onError={() => setLogoExists(false)}
              />
            ) : (
              <div className="h-full w-full bg-[#b8965a]/10 rounded-xl flex items-center justify-center font-black text-[10px] text-transparent bg-clip-text bg-gradient-to-tr from-[#b8965a] to-[#d4b277]">
                N
              </div>
            )}
          </div>
          <div>
            <h2 className="font-bold tracking-tight text-sm uppercase">Nagpal Natraj</h2>
            <p className="text-[9px] text-[#b8965a] font-bold uppercase tracking-wider">Administrator</p>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          <a
            href="/admin/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#b8965a]/10 text-[#b8965a] text-sm font-semibold border border-[#b8965a]/20 transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
            </svg>
            Dashboard
          </a>

          <a
            href="/admin/home"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#292524] text-zinc-400 hover:text-white text-sm font-semibold border border-transparent transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home Page
          </a>

          <a
            href="/admin/about"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#292524] text-zinc-400 hover:text-white text-sm font-semibold border border-transparent transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            About Us Page
          </a>

          <a
            href="/admin/categories"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#292524] text-zinc-400 hover:text-white text-sm font-semibold border border-transparent transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Categories
          </a>

          <a
            href="/admin/products"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#292524] text-zinc-400 hover:text-white text-sm font-semibold border border-transparent transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Products
          </a>

          
          <a href="/admin/blog-categories" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#292524] text-zinc-400 hover:text-white text-sm font-semibold transition-all">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Blog Categories
          </a>
          <a href="/admin/blogs" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#292524] text-zinc-400 hover:text-white text-sm font-semibold transition-all">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
            </svg>
            Blogs
          </a>
          <a
            href="/admin/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#292524] text-zinc-400 hover:text-white text-sm font-semibold border border-transparent transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Site Settings
          </a>
        </nav>

        {/* User Info / Logout */}
        <div className="p-4 border-t border-white/10 bg-[#1c1917]">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-8 w-8 rounded-lg bg-[#b8965a]/10 border border-[#b8965a]/25 flex items-center justify-center font-bold text-[#b8965a] uppercase font-mono text-xs shrink-0">
                {user?.name?.[0] || "A"}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white truncate">{user?.name || "Admin User"}</div>
                <div className="text-[10px] text-zinc-500 truncate font-mono">@{user?.username || "admin"}</div>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center justify-center gap-2 bg-[#292524] hover:bg-rose-950/30 border border-white/5 hover:border-rose-900/50 text-zinc-300 hover:text-rose-600 py-2.5 rounded-xl text-xs font-semibold transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          >
            {loggingOut ? "Logging out..." : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col bg-white overflow-auto">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-[#eaddc7]/40 px-8 flex items-center justify-between shrink-0 bg-white/90 backdrop-blur-md sticky top-0 z-40">
          <div>
            <h1 className="text-sm font-bold text-[#1c1917] uppercase tracking-wider">Dashboard Overview</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-[10px] font-mono bg-white border border-[#eaddc7] px-3 py-1.5 rounded-full text-[#b8965a]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#b8965a] animate-pulse"></span>
              Secure Session Active
            </span>
          </div>
        </header>

        {/* Dashboard Panels */}
        <div className="flex-1 p-8 max-w-5xl w-full mx-auto space-y-8">
          
          {/* Welcome Banner */}
          <div className="relative rounded-3xl border border-[#eaddc7]/50 bg-white p-8 overflow-hidden shadow-sm">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-[100%] -right-[50%] w-[300px] h-[300px] rounded-full bg-[#b8965a]/5 blur-[80px]" />
            </div>
            <div className="relative z-10 max-w-xl">
              <h2 className="text-2xl font-black text-[#1c1917] mb-2">Welcome back, {user?.name}!</h2>
              <p className="text-xs text-[#57534e] leading-relaxed">
                You have successfully authenticated using the credentials <code className="text-[#b8965a] font-semibold font-mono bg-[#faf8f5] px-1.5 py-0.5 rounded border border-[#eaddc7]">username: {user?.username}</code>. 
                Use the sidebar navigation to manage different website sections.
              </p>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-[#eaddc7]/40 bg-white p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Database Status</span>
                <span className="h-2 w-2 rounded-full bg-teal-500"></span>
              </div>
              <div>
                <div className="text-2xl font-bold">Connected</div>
                <p className="text-[10px] text-zinc-400 mt-1">Host: 127.0.0.1 (MySQL)</p>
              </div>
            </div>

            <div className="rounded-2xl border border-[#eaddc7]/40 bg-white p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Active Admin</span>
                <svg className="w-4 h-4 text-[#b8965a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold truncate">{user?.name}</div>
                <p className="text-[10px] text-zinc-400 mt-1 truncate">{user?.email}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-[#eaddc7]/40 bg-white p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Authentication Mode</span>
                <svg className="w-4 h-4 text-[#b8965a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#b8965a]">Sanctum Token</div>
                <p className="text-[10px] text-zinc-400 mt-1">Bearer Auth Session</p>
              </div>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
