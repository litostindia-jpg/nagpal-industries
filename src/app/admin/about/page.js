"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

function WysiwygEditor({ value, onChange }) {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCmd = (command, arg = null) => {
    document.execCommand(command, false, arg);
    handleInput();
  };

  return (
    <div className="border border-[#eaddc7] rounded-xl overflow-hidden bg-white">
      <div className="flex flex-wrap gap-1 bg-[#faf8f5] border-b border-[#eaddc7] p-2">
        <button
          type="button"
          onClick={() => execCmd("bold")}
          className="px-2.5 py-1 text-xs font-bold border border-[#eaddc7] bg-white rounded hover:bg-[#b8965a]/10 hover:text-[#b8965a] transition-all cursor-pointer"
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => execCmd("italic")}
          className="px-2.5 py-1 text-xs italic border border-[#eaddc7] bg-white rounded hover:bg-[#b8965a]/10 hover:text-[#b8965a] transition-all cursor-pointer"
        >
          Italic
        </button>
        <button
          type="button"
          onClick={() => {
            const url = prompt("Enter link URL:");
            if (url) execCmd("createLink", url);
          }}
          className="px-2.5 py-1 text-xs border border-[#eaddc7] bg-white rounded hover:bg-[#b8965a]/10 hover:text-[#b8965a] transition-all cursor-pointer"
        >
          Link
        </button>
        <button
          type="button"
          onClick={() => execCmd("insertUnorderedList")}
          className="px-2.5 py-1 text-xs border border-[#eaddc7] bg-white rounded hover:bg-[#b8965a]/10 hover:text-[#b8965a] transition-all cursor-pointer"
        >
          Bullets
        </button>
        <button
          type="button"
          onClick={() => execCmd("formatBlock", "<h3>")}
          className="px-2.5 py-1 text-xs font-bold border border-[#eaddc7] bg-white rounded hover:bg-[#b8965a]/10 hover:text-[#b8965a] transition-all cursor-pointer"
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => execCmd("formatBlock", "<p>")}
          className="px-2.5 py-1 text-xs border border-[#eaddc7] bg-white rounded hover:bg-[#b8965a]/10 hover:text-[#b8965a] transition-all cursor-pointer"
        >
          Paragraph
        </button>
        <button
          type="button"
          onClick={() => execCmd("removeFormat")}
          className="px-2.5 py-1 text-xs border border-rose-200 text-rose-600 bg-white rounded hover:bg-rose-50 transition-all cursor-pointer"
        >
          Clear
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="min-h-[160px] max-h-[300px] overflow-auto p-4 focus:outline-none text-[#1c1917] text-sm prose prose-sm max-w-none"
        placeholder="Write description here..."
      />
    </div>
  );
}

export default function AdminAbout() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoExists, setLogoExists] = useState(true);
  
  // Tab control: 'overview', 'why-choose-us', 'team', 'clients', 'testimonials', 'portfolio'
  const [activeTab, setActiveTab] = useState("overview");

  // Error/Success state
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  // ==========================================
  // 1. STATE FOR OVERVIEW
  // ==========================================
  const [aboutTitle, setAboutTitle] = useState("");
  const [aboutDescription, setAboutDescription] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [machinesInstalled, setMachinesInstalled] = useState("");
  const [aboutImageFile, setAboutImageFile] = useState(null);
  const [currentAboutImagePath, setCurrentAboutImagePath] = useState("");
  const [aboutVideoFile, setAboutVideoFile] = useState(null);
  const [currentAboutVideoPath, setCurrentAboutVideoPath] = useState("");
  const descTextareaRef = useRef(null);

  // ==========================================
  // 2. STATE FOR WHY CHOOSE US
  // ==========================================
  const [whyChooseUsList, setWhyChooseUsList] = useState([]);
  const [editingWhy, setEditingWhy] = useState(null); // id or null for new
  const [whyTitle, setWhyTitle] = useState("");
  const [whyDesc, setWhyDesc] = useState("");
  const [whyIcon, setWhyIcon] = useState("shield");

  // ==========================================
  // 3. STATE FOR OUR TEAM
  // ==========================================
  const [teamList, setTeamList] = useState([]);
  const [editingTeam, setEditingTeam] = useState(null);
  const [teamName, setTeamName] = useState("");
  const [teamRole, setTeamRole] = useState("");
  const [teamDesc, setTeamDesc] = useState("");
  const [teamImageFile, setTeamImageFile] = useState(null);
  const [currentTeamImagePath, setCurrentTeamImagePath] = useState("");

  // ==========================================
  // 4. STATE FOR CLIENTS
  // ==========================================
  const [clientsList, setClientsList] = useState([]);
  const [uploadingClients, setUploadingClients] = useState(false);

  // ==========================================
  // 5. STATE FOR TESTIMONIALS
  // ==========================================
  const [testimonialsList, setTestimonialsList] = useState([]);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [testimonialQuote, setTestimonialQuote] = useState("");
  const [testimonialAuthor, setTestimonialAuthor] = useState("");
  const [testimonialPosition, setTestimonialPosition] = useState("");
  const [testimonialCompany, setTestimonialCompany] = useState("");
  const [testimonialRating, setTestimonialRating] = useState(5);

  // ==========================================
  // 6. STATE FOR PORTFOLIO
  // ==========================================
  const [portfolioList, setPortfolioList] = useState([]);
  const [editingPortfolio, setEditingPortfolio] = useState(null);
  const [portfolioTitle, setPortfolioTitle] = useState("");
  const [portfolioDesc, setPortfolioDesc] = useState("");
  const [portfolioTag, setPortfolioTag] = useState("");
  const [portfolioImageFile, setPortfolioImageFile] = useState(null);
  const [currentPortfolioImagePath, setCurrentPortfolioImagePath] = useState("");

  // ==========================================
  // DATA FETCHING & AUTH
  // ==========================================
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

    const loadAllData = async () => {
      try {
        // Load settings (Overview)
        const settingsRes = await fetch(`${apiBaseUrl}/site-settings`, {
          headers: { "Authorization": `Bearer ${storedToken}` }
        });
        if (settingsRes.ok) {
          const s = await settingsRes.json();
          setAboutTitle(s.about_title || "");
          setAboutDescription(s.about_description || "");
          setExperienceYears(s.experience_years || "");
          setMachinesInstalled(s.machines_installed || "");
          setCurrentAboutImagePath(s.about_image || "");
          setCurrentAboutVideoPath(s.about_video || "");
        }

        // Load dynamic items
        const aboutAllRes = await fetch(`${apiBaseUrl}/about/all`);
        if (aboutAllRes.ok) {
          const data = await aboutAllRes.json();
          setWhyChooseUsList(data.why_choose_us || []);
          setTeamList(data.team || []);
          setClientsList(data.clients || []);
          setTestimonialsList(data.testimonials || []);
          setPortfolioList(data.portfolio || []);
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setErrorMessage("Data loading failed.");
        setLoading(false);
      }
    };

    loadAllData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    router.push("/admin");
  };

  const clearMessages = () => {
    setErrorMessage("");
    setSuccessMessage("");
  };

  // ==========================================
  // HANDLERS: OVERVIEW
  // ==========================================
  const handleSaveOverview = async (e) => {
    e.preventDefault();
    setSaving(true);
    clearMessages();

    try {
      const formData = new FormData();
      formData.append("about_title", aboutTitle);
      formData.append("about_description", aboutDescription);
      formData.append("experience_years", experienceYears);
      formData.append("machines_installed", machinesInstalled);
      
      // Keep existing non-modified values to avoid validation failure on backend
      formData.append("seo_meta_title", "Nagpal Natraj"); 
      formData.append("whatsapp_active", "1");

      if (aboutImageFile) {
        formData.append("about_image", aboutImageFile);
      }

      if (aboutVideoFile) {
        formData.append("about_video", aboutVideoFile);
      }

      const res = await fetch(`${apiBaseUrl}/site-settings`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Save failed");

      setSuccessMessage("Overview section updated successfully!");
      if (result.settings) {
        if (result.settings.about_image) {
          setCurrentAboutImagePath(result.settings.about_image);
        }
        if (result.settings.about_video) {
          setCurrentAboutVideoPath(result.settings.about_video);
        }
      }
      setAboutImageFile(null);
      setAboutVideoFile(null);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  const insertFormat = (tagOpen, tagClose = "") => {
    const textarea = descTextareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const replacement = tagClose === "" ? tagOpen + selected : tagOpen + selected + tagClose;
    const newValue = text.substring(0, start) + replacement + text.substring(end);
    setAboutDescription(newValue);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tagOpen.length, start + tagOpen.length + selected.length);
    }, 50);
  };

  // ==========================================
  // HANDLERS: WHY CHOOSE US
  // ==========================================
  const handleSaveWhy = async (e) => {
    e.preventDefault();
    setSaving(true);
    clearMessages();

    try {
      const res = await fetch(`${apiBaseUrl}/about/why-choose-us`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          id: editingWhy,
          title: whyTitle,
          description: whyDesc,
          icon: whyIcon
        })
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Save failed");

      setSuccessMessage("Strength item saved!");
      
      // Reload list
      const listRes = await fetch(`${apiBaseUrl}/about/all`);
      if (listRes.ok) {
        const data = await listRes.json();
        setWhyChooseUsList(data.why_choose_us || []);
      }

      // Reset Form
      setEditingWhy(null);
      setWhyTitle("");
      setWhyDesc("");
      setWhyIcon("shield");
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteWhy = async (id) => {
    if (!confirm("Are you sure?")) return;
    clearMessages();
    try {
      const res = await fetch(`${apiBaseUrl}/about/why-choose-us/${id}`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Delete failed");
      setSuccessMessage("Item deleted.");
      setWhyChooseUsList(whyChooseUsList.filter(i => i.id !== id));
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  // ==========================================
  // HANDLERS: OUR TEAM
  // ==========================================
  const handleSaveTeam = async (e) => {
    e.preventDefault();
    setSaving(true);
    clearMessages();

    try {
      const formData = new FormData();
      if (editingTeam) formData.append("id", editingTeam);
      formData.append("name", teamName);
      formData.append("role", teamRole);
      formData.append("description", teamDesc);

      if (teamImageFile) {
        formData.append("image", teamImageFile);
      }

      const res = await fetch(`${apiBaseUrl}/about/team`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Save failed");

      setSuccessMessage("Team member profiles updated!");
      
      const listRes = await fetch(`${apiBaseUrl}/about/all`);
      if (listRes.ok) {
        const data = await listRes.json();
        setTeamList(data.team || []);
      }

      // Reset
      setEditingTeam(null);
      setTeamName("");
      setTeamRole("");
      setTeamDesc("");
      setTeamImageFile(null);
      setCurrentTeamImagePath("");
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTeam = async (id) => {
    if (!confirm("Are you sure?")) return;
    clearMessages();
    try {
      const res = await fetch(`${apiBaseUrl}/about/team/${id}`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Delete failed");
      setSuccessMessage("Member deleted.");
      setTeamList(teamList.filter(i => i.id !== id));
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  // ==========================================
  // HANDLERS: CLIENT LOGOS (Multiple Images)
  // ==========================================
  const handleUploadClients = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingClients(true);
    clearMessages();

    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("images[]", files[i]);
      }

      const res = await fetch(`${apiBaseUrl}/about/clients`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Upload failed");

      setSuccessMessage(result.message);
      
      const listRes = await fetch(`${apiBaseUrl}/about/all`);
      if (listRes.ok) {
        const data = await listRes.json();
        setClientsList(data.clients || []);
      }
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setUploadingClients(false);
      e.target.value = ""; // clear selector
    }
  };

  const handleDeleteClient = async (id) => {
    if (!confirm("Delete this client logo?")) return;
    clearMessages();
    try {
      const res = await fetch(`${apiBaseUrl}/about/clients/${id}`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Delete failed");
      setSuccessMessage("Client logo deleted.");
      setClientsList(clientsList.filter(i => i.id !== id));
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  // ==========================================
  // HANDLERS: TESTIMONIALS
  // ==========================================
  const handleSaveTestimonial = async (e) => {
    e.preventDefault();
    setSaving(true);
    clearMessages();

    try {
      const res = await fetch(`${apiBaseUrl}/about/testimonials`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          id: editingTestimonial,
          quote: testimonialQuote,
          author: testimonialAuthor,
          position: testimonialPosition,
          company: testimonialCompany,
          rating: testimonialRating
        })
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Save failed");

      setSuccessMessage("Testimonial review saved!");
      
      const listRes = await fetch(`${apiBaseUrl}/about/all`);
      if (listRes.ok) {
        const data = await listRes.json();
        setTestimonialsList(data.testimonials || []);
      }

      setEditingTestimonial(null);
      setTestimonialQuote("");
      setTestimonialAuthor("");
      setTestimonialPosition("");
      setTestimonialCompany("");
      setTestimonialRating(5);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTestimonial = async (id) => {
    if (!confirm("Are you sure?")) return;
    clearMessages();
    try {
      const res = await fetch(`${apiBaseUrl}/about/testimonials/${id}`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Delete failed");
      setSuccessMessage("Testimonial deleted.");
      setTestimonialsList(testimonialsList.filter(i => i.id !== id));
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  // ==========================================
  // HANDLERS: PORTFOLIO
  // ==========================================
  const handleSavePortfolio = async (e) => {
    e.preventDefault();
    setSaving(true);
    clearMessages();

    try {
      const formData = new FormData();
      if (editingPortfolio) formData.append("id", editingPortfolio);
      formData.append("title", portfolioTitle);
      formData.append("description", portfolioDesc);
      formData.append("tag", portfolioTag);

      if (portfolioImageFile) {
        formData.append("image", portfolioImageFile);
      }

      const res = await fetch(`${apiBaseUrl}/about/portfolio`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Save failed");

      setSuccessMessage("Portfolio product saved successfully!");
      
      const listRes = await fetch(`${apiBaseUrl}/about/all`);
      if (listRes.ok) {
        const data = await listRes.json();
        setPortfolioList(data.portfolio || []);
      }

      setEditingPortfolio(null);
      setPortfolioTitle("");
      setPortfolioDesc("");
      setPortfolioTag("");
      setPortfolioImageFile(null);
      setCurrentPortfolioImagePath("");
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePortfolio = async (id) => {
    if (!confirm("Are you sure?")) return;
    clearMessages();
    try {
      const res = await fetch(`${apiBaseUrl}/about/portfolio/${id}`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Delete failed");
      setSuccessMessage("Portfolio product deleted.");
      setPortfolioList(portfolioList.filter(i => i.id !== id));
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-8 w-8 text-[#b8965a]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-zinc-400 text-sm">Loading About configs...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#1c1917] flex font-sans selection:bg-[#b8965a] selection:text-white">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-white/10 bg-[#1c1917] flex flex-col shrink-0">
        <div className="p-6 border-b border-white/10 flex items-center gap-3 text-white">
          <div className="h-9 w-9 rounded-xl border border-[#eaddc7] p-0.5 flex items-center justify-center bg-white">
            {logoExists ? (
              <img src="/logo.png" alt="Logo" className="h-full w-full object-contain" onError={() => setLogoExists(false)} />
            ) : (
              <div className="h-full w-full bg-[#b8965a]/10 rounded-xl flex items-center justify-center font-black text-[10px] text-[#b8965a]">N</div>
            )}
          </div>
          <div>
            <h2 className="font-bold tracking-tight text-sm uppercase">Nagpal Natraj</h2>
            <p className="text-[9px] text-[#b8965a] font-bold uppercase tracking-wider">Administrator</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5">
          <a href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#292524] text-zinc-400 hover:text-white text-sm font-semibold transition-all">
            Dashboard
          </a>
          <a href="/admin/home" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#292524] text-zinc-400 hover:text-white text-sm font-semibold transition-all">
            Home Page
          </a>
          <a href="/admin/about" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#b8965a]/10 text-[#b8965a] text-sm font-semibold border border-[#b8965a]/20 transition-all">
            About Us Page
          </a>
          <a href="/admin/categories" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#292524] text-zinc-400 hover:text-white text-sm font-semibold transition-all">
            Categories
          </a>
          <a href="/admin/products" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#292524] text-zinc-400 hover:text-white text-sm font-semibold transition-all">
            Products
          </a>
          
          <a href="/admin/blog-categories" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#292524] text-zinc-400 hover:text-white text-sm font-semibold transition-all">Blog Categories</a>
          <a href="/admin/blogs" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#292524] text-zinc-400 hover:text-white text-sm font-semibold transition-all">Blogs</a>
          <a href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#292524] text-zinc-400 hover:text-white text-sm font-semibold transition-all">
            Site Settings
          </a>
        </nav>

        <div className="p-4 border-t border-white/10 bg-[#1c1917]">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-[#292524] hover:bg-rose-950/30 border border-white/5 hover:border-rose-900/50 text-zinc-300 hover:text-rose-600 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer">
            Logout
          </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="flex-1 flex flex-col bg-white overflow-auto">
        <header className="h-16 border-b border-[#eaddc7]/40 px-8 flex items-center justify-between shrink-0 bg-white/90 backdrop-blur-md sticky top-0 z-40">
          <h1 className="text-sm font-bold text-[#1c1917] uppercase tracking-wider">About Us Sections Configurations</h1>
          <span className="text-xs font-mono bg-white border border-[#eaddc7] px-3 py-1 rounded-full text-zinc-500">
            Nagpal Natraj About Panel
          </span>
        </header>

        <div className="flex-1 p-8 max-w-[1400px] w-full mx-auto flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Vertical Form Tabs Selection */}
          <div className="w-full lg:w-64 shrink-0 flex flex-col space-y-2 sticky top-32">
            {[
              { id: "overview", label: "Overview Profile" },
              { id: "why-choose-us", label: "Why Choose Us" },
              { id: "team", label: "Our Team" },
              { id: "clients", label: "Our Clients" },
              { id: "testimonials", label: "Testimonials" },
              { id: "portfolio", label: "Portfolio Items" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  clearMessages();
                }}
                className={`text-left px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer transition-all ${
                  activeTab === tab.id
                    ? "bg-[#b8965a] text-white shadow-md shadow-[#b8965a]/20"
                    : "bg-white text-zinc-500 hover:bg-[#faf8f5] hover:text-[#1c1917] border border-[#eaddc7]/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 min-w-0 space-y-8">
            {/* Notifications */}
            {errorMessage && (
              <div className="p-4 rounded-2xl border border-rose-200 bg-rose-50 text-rose-700 text-sm">
                <span>{errorMessage}</span>
              </div>
            )}
            {successMessage && (
              <div className="p-4 rounded-2xl border border-teal-200 bg-teal-50 text-teal-700 text-sm">
                <span>{successMessage}</span>
              </div>
            )}

            {/* ========================================== */}
            {/* TAB: OVERVIEW */}
            {/* ========================================== */}
            {activeTab === "overview" && (
              <form onSubmit={handleSaveOverview} className="space-y-6">
              <div className="rounded-3xl border border-[#eaddc7]/50 bg-white p-8 space-y-6 shadow-sm">
                <div>
                  <h3 className="text-base font-bold text-[#1c1917]">Overview Configuration</h3>
                  <p className="text-xs text-[#57534e] mt-1">Configure company profiles details and main description tags.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-2">Title</label>
                      <input
                        type="text"
                        value={aboutTitle}
                        onChange={(e) => setAboutTitle(e.target.value)}
                        placeholder="Decades of Engineering Precision..."
                        className="w-full bg-white border border-[#eaddc7] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#b8965a] transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-2">Experience Display</label>
                        <input
                          type="text"
                          value={experienceYears}
                          onChange={(e) => setExperienceYears(e.target.value)}
                          placeholder="e.g. 70+ Years"
                          className="w-full bg-white border border-[#eaddc7] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#b8965a] transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-2">Machines Display</label>
                        <input
                          type="text"
                          value={machinesInstalled}
                          onChange={(e) => setMachinesInstalled(e.target.value)}
                          placeholder="e.g. 5000+"
                          className="w-full bg-white border border-[#eaddc7] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#b8965a] transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-2">Section Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setAboutImageFile(e.target.files[0])}
                        className="w-full text-xs text-[#57534e] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-[#eaddc7] file:text-[10px] file:font-semibold file:bg-[#faf8f5] cursor-pointer"
                      />
                      {currentAboutImagePath && (
                        <div className="mt-3 flex items-center gap-3">
                          <span className="text-[10px] text-zinc-400 truncate max-w-xs block">Active: {currentAboutImagePath.split('/').pop()}</span>
                          <a href={currentAboutImagePath} target="_blank" className="text-[9px] bg-[#faf8f5] border border-[#eaddc7] text-[#b8965a] px-2 py-0.5 rounded font-semibold">Preview</a>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-2">Section Video (Left Side Player)</label>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => setAboutVideoFile(e.target.files[0])}
                        className="w-full text-xs text-[#57534e] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-[#eaddc7] file:text-[10px] file:font-semibold file:bg-[#faf8f5] cursor-pointer"
                      />
                      {currentAboutVideoPath && (
                        <div className="mt-3 flex items-center gap-3">
                          <span className="text-[10px] text-zinc-400 truncate max-w-xs block">Active: {currentAboutVideoPath.split('/').pop()}</span>
                          <a href={currentAboutVideoPath} target="_blank" className="text-[9px] bg-[#faf8f5] border border-[#eaddc7] text-[#b8965a] px-2 py-0.5 rounded font-semibold">Preview</a>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-1.5">Description (CKEditor WYSIWYG)</label>
                      <WysiwygEditor
                        value={aboutDescription}
                        onChange={setAboutDescription}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end"><button type="submit" disabled={saving} className="px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#b8965a] hover:bg-[#a08048] text-white transition-all">{saving ? "Saving..." : "Save Overview"}</button></div>
            </form>
          )}

          {/* ========================================== */}
          {/* TAB: WHY CHOOSE US */}
          {/* ========================================== */}
          {activeTab === "why-choose-us" && (
            <div className="space-y-6">
              {/* Add/Edit Form */}
              <form onSubmit={handleSaveWhy} className="rounded-3xl border border-[#eaddc7]/50 bg-white p-8 space-y-4 shadow-sm">
                <h3 className="text-sm font-bold text-[#1c1917]">{editingWhy ? "Edit Strength Item" : "Create New Strength Point"}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-1.5">Title</label>
                    <input type="text" value={whyTitle} onChange={(e) => setWhyTitle(e.target.value)} placeholder="e.g. Custom Designs" required className="w-full bg-white border border-[#eaddc7] rounded-xl px-4 py-2 text-xs focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-1.5">Description</label>
                    <input type="text" value={whyDesc} onChange={(e) => setWhyDesc(e.target.value)} placeholder="Key features..." required className="w-full bg-white border border-[#eaddc7] rounded-xl px-4 py-2 text-xs focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-1.5">Icon Style</label>
                    <select value={whyIcon} onChange={(e) => setWhyIcon(e.target.value)} className="w-full bg-white border border-[#eaddc7] rounded-xl px-4 py-2 text-xs focus:outline-none">
                      <option value="shield">Shield Check (Quality)</option>
                      <option value="gear">Gears (Engineering)</option>
                      <option value="chip">Microchip (Automation)</option>
                      <option value="globe">Globe (Global Exports)</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  {editingWhy && <button type="button" onClick={() => { setEditingWhy(null); setWhyTitle(""); setWhyDesc(""); }} className="px-4 py-2 rounded-xl text-[10px] font-bold uppercase bg-stone-100 text-stone-700">Cancel</button>}
                  <button type="submit" disabled={saving} className="px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-[#b8965a] text-white hover:bg-[#a08048]">{saving ? "Saving..." : "Save Strength"}</button>
                </div>
              </form>

              {/* List */}
              <div className="bg-white border border-[#eaddc7]/50 rounded-3xl p-6 shadow-sm">
                <h4 className="text-xs font-bold text-[#1c1917] mb-4">Active Key Strengths</h4>
                <div className="divide-y divide-[#eaddc7]/30">
                  {whyChooseUsList.map(item => (
                    <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                      <div>
                        <h5 className="text-xs font-bold text-[#1c1917] flex items-center gap-1.5">
                          <span className="text-[10px] uppercase font-bold text-[#b8965a] bg-[#b8965a]/10 px-2 py-0.5 rounded">{item.icon}</span>
                          {item.title}
                        </h5>
                        <p className="text-[11px] text-[#57534e] mt-1">{item.description}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => { setEditingWhy(item.id); setWhyTitle(item.title); setWhyDesc(item.description); setWhyIcon(item.icon); }} className="px-3 py-1 border border-[#eaddc7] hover:border-[#b8965a] rounded text-[10px] font-bold">Edit</button>
                        <button onClick={() => handleDeleteWhy(item.id)} className="px-3 py-1 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded text-[10px] font-bold">Delete</button>
                      </div>
                    </div>
                  ))}
                  {whyChooseUsList.length === 0 && <p className="text-zinc-400 text-xs py-4 text-center">No strengths custom configurations added yet.</p>}
                </div>
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* TAB: OUR TEAM */}
          {/* ========================================== */}
          {activeTab === "team" && (
            <div className="space-y-6">
              {/* Form */}
              <form onSubmit={handleSaveTeam} className="rounded-3xl border border-[#eaddc7]/50 bg-white p-8 space-y-4 shadow-sm">
                <h3 className="text-sm font-bold text-[#1c1917]">{editingTeam ? "Edit Team Member" : "Create New Member Profile"}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-1.5">Name</label>
                    <input type="text" value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="Full Name" required className="w-full bg-white border border-[#eaddc7] rounded-xl px-4 py-2 text-xs focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-1.5">Role / Designation</label>
                    <input type="text" value={teamRole} onChange={(e) => setTeamRole(e.target.value)} placeholder="e.g. Managing Director" required className="w-full bg-white border border-[#eaddc7] rounded-xl px-4 py-2 text-xs focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-1.5">Profile Photo</label>
                    <input type="file" accept="image/*" onChange={(e) => setTeamImageFile(e.target.files[0])} className="w-full text-xs text-[#57534e]" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-1.5">Short Bio / Description</label>
                  <textarea rows="3" value={teamDesc} onChange={(e) => setTeamDesc(e.target.value)} placeholder="Brief background info..." className="w-full bg-white border border-[#eaddc7] rounded-xl px-4 py-2 text-xs focus:outline-none resize-none" />
                </div>
                <div className="flex justify-end gap-2">
                  {editingTeam && <button type="button" onClick={() => { setEditingTeam(null); setTeamName(""); setTeamRole(""); setTeamDesc(""); }} className="px-4 py-2 rounded-xl text-[10px] font-bold uppercase bg-stone-100 text-stone-700">Cancel</button>}
                  <button type="submit" disabled={saving} className="px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-[#b8965a] text-white hover:bg-[#a08048]">{saving ? "Saving..." : "Save Profile"}</button>
                </div>
              </form>

              {/* List */}
              <div className="bg-white border border-[#eaddc7]/50 rounded-3xl p-6 shadow-sm">
                <h4 className="text-xs font-bold text-[#1c1917] mb-4">Board Members</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {teamList.map(member => (
                    <div key={member.id} className="p-4 border border-[#eaddc7]/30 rounded-2xl flex items-center justify-between gap-4 bg-[#faf8f5]/40">
                      <div className="flex items-center gap-3">
                        <img src={member.image} alt={member.name} className="w-12 h-12 rounded-full object-cover border border-[#eaddc7]/40 shadow-sm" />
                        <div>
                          <h5 className="text-xs font-bold text-[#1c1917]">{member.name}</h5>
                          <span className="text-[9px] text-[#b8965a] uppercase font-bold tracking-wider">{member.role}</span>
                        </div>
                      </div>
                      <div className="flex gap-1.5">
                        <button onClick={() => { setEditingTeam(member.id); setTeamName(member.name); setTeamRole(member.role); setTeamDesc(member.description); setCurrentTeamImagePath(member.image); }} className="px-2 py-1 border border-[#eaddc7] rounded text-[9px] font-bold">Edit</button>
                        <button onClick={() => handleDeleteTeam(member.id)} className="px-2 py-1 border border-rose-200 text-rose-600 rounded text-[9px] font-bold">Delete</button>
                      </div>
                    </div>
                  ))}
                  {teamList.length === 0 && <p className="text-zinc-400 text-xs py-4 text-center col-span-2">No team profiles added yet.</p>}
                </div>
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* TAB: OUR CLIENTS */}
          {/* ========================================== */}
          {activeTab === "clients" && (
            <div className="space-y-6">
              <div className="rounded-3xl border border-[#eaddc7]/50 bg-white p-8 space-y-4 shadow-sm">
                <h3 className="text-sm font-bold text-[#1c1917]">Multiple Clients Logo Upload</h3>
                <p className="text-xs text-[#57534e]">Ek baar me multiple clients brand logos select karke upload kar sakte hain.</p>
                <div className="border-2 border-dashed border-[#eaddc7]/60 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 bg-[#faf8f5]/50">
                  <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <label className="bg-white border border-[#eaddc7] hover:border-[#b8965a] text-[#57534e] px-4 py-2 rounded-xl text-xs font-bold cursor-pointer uppercase tracking-wider transition-all">
                    {uploadingClients ? "Uploading..." : "Select Logo Images"}
                    <input type="file" multiple accept="image/*" disabled={uploadingClients} onChange={handleUploadClients} className="hidden" />
                  </label>
                  <span className="text-[10px] text-zinc-400">Supports PNG, JPG, JPEG, WEBP files up to 5MB</span>
                </div>
              </div>

              {/* List */}
              <div className="bg-white border border-[#eaddc7]/50 rounded-3xl p-6 shadow-sm">
                <h4 className="text-xs font-bold text-[#1c1917] mb-4">Active Client Trust Badges ({clientsList.length})</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {clientsList.map(client => (
                    <div key={client.id} className="p-4 border border-[#eaddc7]/30 rounded-2xl bg-[#faf8f5]/40 flex flex-col items-center justify-center gap-3 relative group">
                      <img src={client.image_path} alt="Client" className="h-10 w-auto object-contain" />
                      <button onClick={() => handleDeleteClient(client.id)} className="absolute top-2 right-2 bg-rose-50 text-rose-600 p-1 rounded-full border border-rose-100 hover:bg-rose-100 opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  {clientsList.length === 0 && <p className="text-zinc-400 text-xs py-4 text-center col-span-full">No client logos uploaded.</p>}
                </div>
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* TAB: TESTIMONIALS */}
          {/* ========================================== */}
          {activeTab === "testimonials" && (
            <div className="space-y-6">
              {/* Form */}
              <form onSubmit={handleSaveTestimonial} className="rounded-3xl border border-[#eaddc7]/50 bg-white p-8 space-y-4 shadow-sm">
                <h3 className="text-sm font-bold text-[#1c1917]">{editingTestimonial ? "Edit Review Card" : "Write Customer Review Quote"}</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-1.5">Author</label>
                    <input type="text" value={testimonialAuthor} onChange={(e) => setTestimonialAuthor(e.target.value)} placeholder="Client Name" required className="w-full bg-white border border-[#eaddc7] rounded-xl px-4 py-2 text-xs focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-1.5">Position / Designation</label>
                    <input type="text" value={testimonialPosition} onChange={(e) => setTestimonialPosition(e.target.value)} placeholder="e.g. VP Operations" required className="w-full bg-white border border-[#eaddc7] rounded-xl px-4 py-2 text-xs focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-1.5">Company Name</label>
                    <input type="text" value={testimonialCompany} onChange={(e) => setTestimonialCompany(e.target.value)} placeholder="Horizon Packs" required className="w-full bg-white border border-[#eaddc7] rounded-xl px-4 py-2 text-xs focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-1.5">Rating Rating (1-5)</label>
                    <select value={testimonialRating} onChange={(e) => setTestimonialRating(Number(e.target.value))} className="w-full bg-white border border-[#eaddc7] rounded-xl px-4 py-2 text-xs focus:outline-none">
                      <option value={5}>5 Stars ★★★★★</option>
                      <option value={4}>4 Stars ★★★★</option>
                      <option value={3}>3 Stars ★★★</option>
                      <option value={2}>2 Stars ★★</option>
                      <option value={1}>1 Star ★</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-1.5">Feedback Quote</label>
                  <textarea rows="3" value={testimonialQuote} onChange={(e) => setTestimonialQuote(e.target.value)} placeholder="Natraja slitterscorer scorer doubled our line speed output..." required className="w-full bg-white border border-[#eaddc7] rounded-xl px-4 py-2 text-xs focus:outline-none resize-none" />
                </div>
                <div className="flex justify-end gap-2">
                  {editingTestimonial && <button type="button" onClick={() => { setEditingTestimonial(null); setTestimonialQuote(""); setTestimonialAuthor(""); }} className="px-4 py-2 rounded-xl text-[10px] font-bold uppercase bg-stone-100 text-stone-700">Cancel</button>}
                  <button type="submit" disabled={saving} className="px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-[#b8965a] text-white hover:bg-[#a08048]">{saving ? "Saving..." : "Save Review"}</button>
                </div>
              </form>

              {/* List */}
              <div className="bg-white border border-[#eaddc7]/50 rounded-3xl p-6 shadow-sm">
                <h4 className="text-xs font-bold text-[#1c1917] mb-4">Customer Reviews</h4>
                <div className="divide-y divide-[#eaddc7]/30">
                  {testimonialsList.map(item => (
                    <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="text-xs font-bold text-[#1c1917]">{item.author}</h5>
                          <span className="text-[8px] font-extrabold uppercase bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded">{item.position} at {item.company}</span>
                        </div>
                        <p className="text-[11px] text-[#57534e] italic mt-1.5">"{item.quote}"</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => { setEditingTestimonial(item.id); setTestimonialAuthor(item.author); setTestimonialPosition(item.position); setTestimonialCompany(item.company); setTestimonialQuote(item.quote); setTestimonialRating(item.rating); }} className="px-3 py-1 border border-[#eaddc7] rounded text-[10px] font-bold">Edit</button>
                        <button onClick={() => handleDeleteTestimonial(item.id)} className="px-3 py-1 border border-rose-200 text-rose-600 rounded text-[10px] font-bold">Delete</button>
                      </div>
                    </div>
                  ))}
                  {testimonialsList.length === 0 && <p className="text-zinc-400 text-xs py-4 text-center">No reviews added yet.</p>}
                </div>
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* TAB: PORTFOLIO */}
          {/* ========================================== */}
          {activeTab === "portfolio" && (
            <div className="space-y-6">
              {/* Form */}
              <form onSubmit={handleSavePortfolio} className="rounded-3xl border border-[#eaddc7]/50 bg-white p-8 space-y-4 shadow-sm">
                <h3 className="text-sm font-bold text-[#1c1917]">{editingPortfolio ? "Edit Portfolio Product" : "Create New Product Entry"}</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-1.5">Title</label>
                    <input type="text" value={portfolioTitle} onChange={(e) => setPortfolioTitle(e.target.value)} placeholder="e.g. Partition Slotter" required className="w-full bg-white border border-[#eaddc7] rounded-xl px-4 py-2 text-xs focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-1.5">Category Tag</label>
                    <input type="text" value={portfolioTag} onChange={(e) => setPortfolioTag(e.target.value)} placeholder="e.g. Box Making" className="w-full bg-white border border-[#eaddc7] rounded-xl px-4 py-2 text-xs focus:outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-1.5">Product Image</label>
                    <input type="file" accept="image/*" onChange={(e) => setPortfolioImageFile(e.target.files[0])} className="w-full text-xs text-[#57534e]" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-1.5">Specifications / Description</label>
                  <textarea rows="3" value={portfolioDesc} onChange={(e) => setPortfolioDesc(e.target.value)} placeholder="Provide machine specs here..." required className="w-full bg-white border border-[#eaddc7] rounded-xl px-4 py-2 text-xs focus:outline-none resize-none" />
                </div>
                <div className="flex justify-end gap-2">
                  {editingPortfolio && <button type="button" onClick={() => { setEditingPortfolio(null); setPortfolioTitle(""); setPortfolioDesc(""); }} className="px-4 py-2 rounded-xl text-[10px] font-bold uppercase bg-stone-100 text-stone-700">Cancel</button>}
                  <button type="submit" disabled={saving} className="px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-[#b8965a] text-white hover:bg-[#a08048]">{saving ? "Saving..." : "Save Product"}</button>
                </div>
              </form>

              {/* List */}
              <div className="bg-white border border-[#eaddc7]/50 rounded-3xl p-6 shadow-sm">
                <h4 className="text-xs font-bold text-[#1c1917] mb-4">Product Catalog</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {portfolioList.map(project => (
                    <div key={project.id} className="rounded-2xl border border-[#eaddc7]/35 overflow-hidden flex flex-col justify-between bg-[#faf8f5]/30">
                      <div>
                        <div className="h-40 bg-zinc-100 flex items-center justify-center overflow-hidden relative">
                          <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-4 space-y-2">
                          <span className="text-[8px] font-bold uppercase bg-[#b8965a]/10 text-[#b8965a] border border-[#b8965a]/15 px-2 py-0.5 rounded">{project.tag || "Machinery"}</span>
                          <h5 className="text-xs font-black text-[#1c1917]">{project.title}</h5>
                          <p className="text-[10px] text-[#57534e] leading-relaxed">{project.description}</p>
                        </div>
                      </div>
                      <div className="p-4 border-t border-[#eaddc7]/20 flex gap-2 justify-end">
                        <button onClick={() => { setEditingPortfolio(project.id); setPortfolioTitle(project.title); setPortfolioDesc(project.description); setPortfolioTag(project.tag); setCurrentPortfolioImagePath(project.image); }} className="px-3 py-1 border border-[#eaddc7] rounded text-[9px] font-bold">Edit</button>
                        <button onClick={() => handleDeletePortfolio(project.id)} className="px-3 py-1 border border-rose-200 text-rose-600 rounded text-[9px] font-bold">Delete</button>
                      </div>
                    </div>
                  ))}
                  {portfolioList.length === 0 && <p className="text-zinc-400 text-xs py-4 text-center col-span-full">No products configuration added.</p>}
                </div>
              </div>
            </div>
          )}

          </div>
        </div>
      </main>
    </div>
  );
}
