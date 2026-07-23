"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function CatalogsAdmin() {
  const [catalogs, setCatalogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [logoExists, setLogoExists] = useState(true);
  const [user, setUser] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const router = useRouter();
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  const fetchCatalogs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiBaseUrl}/catalogs`);
      if (res.ok) {
        setCatalogs(await res.json());
      }
    } catch (error) {
      toast.error("Failed to load catalogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin");
      return;
    }
    
    // Fetch User
    fetch(`${apiBaseUrl}/admin/me`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.user) setUser(data.user);
      })
      .catch(() => {});

    fetchCatalogs();
  }, [router, apiBaseUrl]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const token = localStorage.getItem("admin_token");
      await fetch(`${apiBaseUrl}/admin/logout`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
    } catch (err) {}
    
    localStorage.removeItem("admin_token");
    toast.success("Logged out successfully");
    router.push("/admin");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !file) {
      toast.error("Please provide a title and select a file.");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("file", file);

      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${apiBaseUrl}/catalogs`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      if (res.ok) {
        toast.success("Catalog uploaded successfully!");
        setTitle("");
        setFile(null);
        e.target.reset();
        fetchCatalogs();
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to upload catalog");
      }
    } catch (err) {
      toast.error("Error uploading catalog");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this catalog?")) return;

    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${apiBaseUrl}/catalogs/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.ok) {
        toast.success("Catalog deleted");
        fetchCatalogs();
      } else {
        toast.error("Failed to delete");
      }
    } catch (err) {
      toast.error("Error deleting catalog");
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#1c1917] flex font-sans selection:bg-[#b8965a] selection:text-white">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-white/10 bg-[#1c1917] flex flex-col shrink-0">
        <div className="p-6 border-b border-white/10 flex items-center gap-3 text-white">
          <div className="h-9 w-9 rounded-xl border border-[#eaddc7] p-0.5 flex items-center justify-center bg-white">
            {logoExists ? (
              <img src="/logo.png" alt="Logo" className="h-full w-full object-contain" onError={() => setLogoExists(false)} />
            ) : (
              <div className="h-full w-full bg-[#b8965a]/10 rounded-xl flex items-center justify-center font-black text-[10px] text-transparent bg-clip-text bg-gradient-to-tr from-[#b8965a] to-[#d4b277]">N</div>
            )}
          </div>
          <div>
            <h2 className="font-bold tracking-tight text-sm uppercase">Nagpal Natraj</h2>
            <p className="text-[9px] text-[#b8965a] font-bold uppercase tracking-wider">Administrator</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <a href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#292524] text-zinc-400 hover:text-white text-sm font-semibold border border-transparent transition-all">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
            </svg>
            Dashboard
          </a>
          <a href="/admin/home" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#292524] text-zinc-400 hover:text-white text-sm font-semibold border border-transparent transition-all">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home Page
          </a>
          <a href="/admin/about" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#292524] text-zinc-400 hover:text-white text-sm font-semibold border border-transparent transition-all">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            About Us Page
          </a>
          <a href="/admin/categories" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#292524] text-zinc-400 hover:text-white text-sm font-semibold border border-transparent transition-all">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Categories
          </a>
          <a href="/admin/products" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#292524] text-zinc-400 hover:text-white text-sm font-semibold border border-transparent transition-all">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Products
          </a>
          <a href="/admin/catalogs" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#b8965a]/10 text-[#b8965a] text-sm font-semibold border border-[#b8965a]/20 transition-all">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Catalogs
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
            href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#292524] text-zinc-400 hover:text-white text-sm font-semibold border border-transparent transition-all">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Site Settings
          </a>
        </nav>

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
          
          <button onClick={handleLogout} disabled={loggingOut} className="w-full flex items-center justify-center gap-2 bg-[#292524] hover:bg-rose-950/30 border border-white/5 hover:border-rose-900/50 text-zinc-300 hover:text-rose-600 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer">
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col bg-white min-w-0 overflow-y-auto">
        <div className="p-8 lg:p-12 space-y-8 max-w-[1200px] w-full mx-auto">
          
          <div>
            <h1 className="text-3xl font-black text-[#1c1917] tracking-tight">Manage Catalogs</h1>
            <p className="text-[#57534e] mt-2">Upload and manage PDF brochures, catalogs, or other documents.</p>
          </div>

          <div className="bg-[#faf8f5] rounded-2xl p-6 border border-[#eaddc7]/30">
            <h2 className="text-xl font-bold text-[#1c1917] mb-6">Upload New Catalog</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#57534e]">Title / Name</label>
                  <input 
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., 2026 Machinery Catalog"
                    className="w-full bg-white border border-[#eaddc7] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#b8965a]"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#57534e]">Document File (PDF, Image)</label>
                  <input 
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="w-full bg-white border border-[#eaddc7] rounded-xl px-4 py-2.5 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#faf8f5] file:text-[#b8965a] hover:file:bg-[#eaddc7]/30"
                    required
                    accept=".pdf,.doc,.docx,.jpg,.png"
                  />
                </div>
              </div>
              
              <button 
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-[#b8965a] text-white text-xs font-bold rounded-xl uppercase tracking-wider hover:bg-[#a08048] transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Uploading..." : "Upload Catalog"}
              </button>
            </form>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#1c1917]">Uploaded Catalogs</h2>
            
            {loading ? (
              <p className="text-sm text-[#57534e]">Loading catalogs...</p>
            ) : catalogs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {catalogs.map(catalog => (
                  <div key={catalog.id} className="bg-white border border-[#eaddc7]/50 rounded-2xl p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center shrink-0">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-[#1c1917] text-sm line-clamp-1">{catalog.title}</h4>
                        <a href={catalog.file_path} target="_blank" rel="noopener noreferrer" className="text-[10px] text-[#b8965a] uppercase font-bold tracking-wider hover:underline">View File</a>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDelete(catalog.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Catalog"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-[#faf8f5] rounded-2xl border border-dashed border-[#eaddc7]">
                <p className="text-sm text-[#57534e]">No catalogs uploaded yet.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
