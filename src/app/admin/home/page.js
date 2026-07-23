"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminHomeSettings() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [savingSlide, setSavingSlide] = useState(false);
  const [logoExists, setLogoExists] = useState(true);

  // Settings state
  const [activeType, setActiveType] = useState("image");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoContent, setVideoContent] = useState("");
  const [videoButtonText, setVideoButtonText] = useState("");
  const [videoButtonLink, setVideoButtonLink] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [currentVideoPath, setCurrentVideoPath] = useState("");

  // Slides state
  const [slides, setSlides] = useState([]);
  const [slideId, setSlideId] = useState(null);
  const [slideTitle, setSlideTitle] = useState("");
  const [slideContent, setSlideContent] = useState("");
  const [slideButtonText, setSlideButtonText] = useState("");
  const [slideButtonLink, setSlideButtonLink] = useState("");
  const [slideSortOrder, setSlideSortOrder] = useState(0);
  const [bgImageFile, setBgImageFile] = useState(null);
  const [bgMobileImageFile, setBgMobileImageFile] = useState(null);
  const [prodImageFile, setProdImageFile] = useState(null);
  const [currentBgPath, setCurrentBgPath] = useState("");
  const [currentBgMobilePath, setCurrentBgMobilePath] = useState("");
  const [currentProdPath, setCurrentProdPath] = useState("");
  
  const [showSlideForm, setShowSlideForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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

    const fetchData = async () => {
      try {
        const headers = {
          "Accept": "application/json",
          "Authorization": `Bearer ${storedToken}`,
        };

        const settingsRes = await fetch(`${apiBaseUrl}/slider/settings`, { headers });
        if (!settingsRes.ok) throw new Error("Failed to load settings");
        const settingsData = await settingsRes.json();
        setActiveType(settingsData.active_type || "image");
        setVideoTitle(settingsData.video_title || "");
        setVideoContent(settingsData.video_content || "");
        setVideoButtonText(settingsData.video_button_text || "");
        setVideoButtonLink(settingsData.video_button_link || "");
        setCurrentVideoPath(settingsData.video_path || "");

        const slidesRes = await fetch(`${apiBaseUrl}/slider/images`, { headers });
        if (!slidesRes.ok) throw new Error("Failed to load slides");
        const slidesData = await slidesRes.json();
        setSlides(slidesData);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setErrorMessage("Could not load data. Session might be expired.");
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleSaveActiveMode = async () => {
    setSavingSettings(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const formData = new FormData();
      formData.append("active_type", activeType);
      formData.append("video_title", videoTitle || "");
      formData.append("video_content", videoContent || "");
      formData.append("video_button_text", videoButtonText || "");
      formData.append("video_button_link", videoButtonLink || "");

      const res = await fetch(`${apiBaseUrl}/slider/settings`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || "Failed to update slider mode");
      }

      setSuccessMessage(`Successfully updated active slider mode to: ${activeType === "video" ? "Video Slider" : "Image Slider"}`);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const formData = new FormData();
      formData.append("active_type", activeType);
      formData.append("video_title", videoTitle || "");
      formData.append("video_content", videoContent || "");
      formData.append("video_button_text", videoButtonText || "");
      formData.append("video_button_link", videoButtonLink || "");
      if (videoFile) {
        formData.append("video", videoFile);
      }

      const res = await fetch(`${apiBaseUrl}/slider/settings`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || "Failed to update settings");
      }

      setSuccessMessage("Global slider settings updated successfully!");
      if (result.settings && result.settings.video_path) {
        setCurrentVideoPath(result.settings.video_path);
      }
      setVideoFile(null);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSaveSlide = async (e) => {
    e.preventDefault();
    setSavingSlide(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const formData = new FormData();
      if (slideId) {
        formData.append("id", slideId);
      }
      formData.append("title", slideTitle || "");
      formData.append("content", slideContent || "");
      formData.append("button_text", slideButtonText || "");
      formData.append("button_link", slideButtonLink || "");
      formData.append("sort_order", slideSortOrder);

      if (bgImageFile) {
        formData.append("image_background", bgImageFile);
      }
      if (bgMobileImageFile) {
        formData.append("image_background_mobile", bgMobileImageFile);
      }
      if (prodImageFile) {
        formData.append("image_product", prodImageFile);
      }

      const res = await fetch(`${apiBaseUrl}/slider/images`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || "Failed to save slide");
      }

      setSuccessMessage(slideId ? "Slide updated successfully!" : "Slide created successfully!");
      resetSlideForm();
      
      const slidesRes = await fetch(`${apiBaseUrl}/slider/images`, {
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      const slidesData = await slidesRes.json();
      setSlides(slidesData);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setSavingSlide(false);
    }
  };

  const handleDeleteSlide = async (id) => {
    if (!confirm("Are you sure you want to delete this slide?")) return;

    setErrorMessage("");
    setSuccessMessage("");

    try {
      const res = await fetch(`${apiBaseUrl}/slider/images/${id}`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || "Failed to delete slide");
      }

      setSuccessMessage("Slide deleted successfully.");
      setSlides(slides.filter((slide) => slide.id !== id));
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const startEditSlide = (slide) => {
    setSlideId(slide.id);
    setSlideTitle(slide.title || "");
    setSlideContent(slide.content || "");
    setSlideButtonText(slide.button_text || "");
    setSlideButtonLink(slide.button_link || "");
    setSlideSortOrder(slide.sort_order || 0);
    setCurrentBgPath(slide.image_background || "");
    setCurrentBgMobilePath(slide.image_background_mobile || "");
    setCurrentProdPath(slide.image_product || "");
    setShowSlideForm(true);
  };

  const resetSlideForm = () => {
    setSlideId(null);
    setSlideTitle("");
    setSlideContent("");
    setSlideButtonText("");
    setSlideButtonLink("");
    setSlideSortOrder(0);
    setBgImageFile(null);
    setBgMobileImageFile(null);
    setProdImageFile(null);
    setCurrentBgPath("");
    setCurrentBgMobilePath("");
    setCurrentProdPath("");
    setShowSlideForm(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    router.push("/admin");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-[#1c1917] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-8 w-8 text-[#b8965a]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-zinc-400 text-sm">Loading config...</span>
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

        <nav className="flex-1 px-4 py-6 space-y-1.5">
          <a
            href="/admin/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#292524] text-zinc-400 hover:text-white text-sm font-semibold border border-transparent transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
            </svg>
            Dashboard
          </a>

          <a
            href="/admin/home"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#b8965a]/10 text-[#b8965a] text-sm font-semibold border border-[#b8965a]/20 transition-all"
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

        <div className="p-4 border-t border-white/10 bg-[#1c1917]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-[#292524] hover:bg-rose-950/30 border border-white/5 hover:border-rose-900/50 text-zinc-300 hover:text-rose-655 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="flex-1 flex flex-col bg-white overflow-auto">
        <header className="h-16 border-b border-[#eaddc7]/40 px-8 flex items-center justify-between shrink-0 bg-white/90 backdrop-blur-md sticky top-0 z-40">
          <div>
            <h1 className="text-sm font-bold text-[#1c1917] uppercase tracking-wider">Homepage Slider Settings</h1>
          </div>
          <span className="text-xs font-mono bg-white border border-[#eaddc7] px-3 py-1 rounded-full text-zinc-500">
            Nagpal Natraj Website Manager
          </span>
        </header>

        <div className="flex-1 p-8 max-w-5xl w-full mx-auto space-y-8">
          {/* Notifications */}
          {errorMessage && (
            <div className="p-4 rounded-2xl border border-rose-200 bg-rose-50 text-rose-700 text-sm flex items-start gap-3">
              <span>{errorMessage}</span>
            </div>
          )}
          {successMessage && (
            <div className="p-4 rounded-2xl border border-teal-200 bg-teal-50 text-teal-700 text-sm flex items-start gap-3">
              <span>{successMessage}</span>
            </div>
          )}

          {/* Active Mode Config */}
          <div className="rounded-3xl border border-[#eaddc7]/50 bg-white p-8 space-y-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-lg font-black text-[#1c1917]">Slider Mode Settings</h2>
                <p className="text-xs text-[#57534e] mt-1">
                  Choose which style is active on your homepage. Select one option and click Save.
                </p>
              </div>
              <button
                type="button"
                onClick={handleSaveActiveMode}
                disabled={savingSettings}
                className="px-6 py-3 bg-[#b8965a] hover:bg-[#a08048] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-[#b8965a]/15 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer text-center"
              >
                {savingSettings ? "Saving Mode..." : "Save Active Mode"}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
              <button
                type="button"
                onClick={() => setActiveType("image")}
                className={`py-4 rounded-2xl border text-sm font-semibold flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                  activeType === "image"
                    ? "bg-[#b8965a]/10 border-[#b8965a]/30 text-[#b8965a] shadow-sm shadow-[#b8965a]/5"
                    : "bg-white border-[#eaddc7] hover:border-zinc-400 text-[#57534e]"
                }`}
              >
                Image Slider (Max 6)
              </button>

              <button
                type="button"
                onClick={() => setActiveType("video")}
                className={`py-4 rounded-2xl border text-sm font-semibold flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                  activeType === "video"
                    ? "bg-[#b8965a]/10 border-[#b8965a]/30 text-[#b8965a] shadow-sm shadow-[#b8965a]/5"
                    : "bg-white border-[#eaddc7] hover:border-zinc-400 text-[#57534e]"
                }`}
              >
                Video Slider (Single)
              </button>
            </div>
          </div>

          {/* Video settings manager */}
          <div className="rounded-3xl border border-[#eaddc7]/50 bg-white p-8 space-y-6 shadow-sm">
            <div>
              <h3 className="text-base font-bold text-[#1c1917]">Video Slider Settings</h3>
              <p className="text-xs text-[#57534e] mt-1">Configure and upload the background video slide.</p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-2">Video Title</label>
                    <input
                      type="text"
                      value={videoTitle}
                      onChange={(e) => setVideoTitle(e.target.value)}
                      placeholder="Redefining Corrugated Box Machinery..."
                      className="w-full bg-white border border-[#eaddc7] rounded-xl px-4 py-2.5 text-[#1c1917] text-sm focus:outline-none focus:border-[#b8965a] transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-2">Video Button Text</label>
                    <input
                      type="text"
                      value={videoButtonText}
                      onChange={(e) => setVideoButtonText(e.target.value)}
                      placeholder="Explore Catalog"
                      className="w-full bg-white border border-[#eaddc7] rounded-xl px-4 py-2.5 text-[#1c1917] text-sm focus:outline-none focus:border-[#b8965a] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-2">Video Button Link</label>
                    <input
                      type="text"
                      value={videoButtonLink}
                      onChange={(e) => setVideoButtonLink(e.target.value)}
                      placeholder="#products"
                      className="w-full bg-white border border-[#eaddc7] rounded-xl px-4 py-2.5 text-[#1c1917] text-sm focus:outline-none focus:border-[#b8965a] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-2">Video Description Content</label>
                    <textarea
                      rows="4"
                      value={videoContent}
                      onChange={(e) => setVideoContent(e.target.value)}
                      placeholder="Provide details about the background video feature..."
                      className="w-full bg-white border border-[#eaddc7] rounded-xl px-4 py-2.5 text-[#1c1917] text-sm focus:outline-none focus:border-[#b8965a] transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-2">Upload Background Video (.mp4)</label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => setVideoFile(e.target.files[0])}
                      className="w-full text-xs text-[#57534e] file:mr-4 file:py-2 file:px-3 file:rounded-xl file:border file:border-[#eaddc7] file:text-[10px] file:font-semibold file:bg-[#faf8f5] file:text-[#57534e] hover:file:bg-[#faf8f5]/80 cursor-pointer file:cursor-pointer"
                    />
                    {currentVideoPath && (
                      <div className="mt-3 flex items-center gap-3">
                        <span className="text-xs text-[#b8965a] font-semibold font-mono truncate max-w-xs block">Active: {currentVideoPath.split('/').pop()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#b8965a] hover:bg-[#a08048] text-white transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50 shadow-md shadow-[#b8965a]/15"
                >
                  {savingSettings ? "Saving Settings..." : "Save Video Details"}
                </button>
              </div>
            </form>
          </div>

          {/* Image Carousel Slides Manager */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-[#eaddc7]/50 bg-white p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#eaddc7]/40 pb-4">
                <div>
                  <h3 className="text-base font-bold text-[#1c1917]">Image Slides ({slides.length} of 6)</h3>
                  <p className="text-xs text-[#57534e] mt-1">Add, update, or reorder up to 6 active image slides.</p>
                </div>
                {slides.length < 6 && !showSlideForm && (
                  <button
                    onClick={() => {
                      resetSlideForm();
                      setShowSlideForm(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#b8965a] text-white hover:bg-[#a08048] transition-all cursor-pointer"
                  >
                    Add New Slide
                  </button>
                )}
              </div>

              {/* Show slide form */}
              {showSlideForm && (
                <form onSubmit={handleSaveSlide} className="p-6 border border-[#eaddc7] rounded-2xl bg-[#faf8f5]/40 space-y-5">
                  <h4 className="text-sm font-bold text-[#1c1917]">{slideId ? "Edit Slide" : "Add Slide"} Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] text-[#57534e] font-bold mb-1.5 uppercase tracking-wide">Slide Title</label>
                        <input
                          type="text"
                          required
                          value={slideTitle}
                          onChange={(e) => setSlideTitle(e.target.value)}
                          placeholder="e.g. Fingerless Single Facer..."
                          className="w-full bg-white border border-[#eaddc7] rounded-xl px-4 py-2 text-[#1c1917] text-sm focus:outline-none focus:border-[#b8965a] transition-all"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] text-[#57534e] font-bold mb-1.5 uppercase tracking-wide">Button Text</label>
                          <input
                            type="text"
                            value={slideButtonText}
                            onChange={(e) => setSlideButtonText(e.target.value)}
                            placeholder="e.g. Specifications"
                            className="w-full bg-white border border-[#eaddc7] rounded-xl px-4 py-2 text-[#1c1917] text-sm focus:outline-none focus:border-[#b8965a] transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-[#57534e] font-bold mb-1.5 uppercase tracking-wide">Button Link</label>
                          <input
                            type="text"
                            value={slideButtonLink}
                            onChange={(e) => setSlideButtonLink(e.target.value)}
                            placeholder="e.g. #products"
                            className="w-full bg-white border border-[#eaddc7] rounded-xl px-4 py-2 text-[#1c1917] text-sm focus:outline-none focus:border-[#b8965a] transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] text-[#57534e] font-bold mb-1.5 uppercase tracking-wide">Desktop BG Image</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setBgImageFile(e.target.files[0])}
                            className="w-full text-xs text-[#57534e] file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border file:border-[#eaddc7] file:text-[9px] file:font-semibold file:bg-[#faf8f5] cursor-pointer"
                          />
                          {currentBgPath && (
                            <span className="text-[9px] text-zinc-400 block mt-1 truncate">Current: {currentBgPath.split('/').pop()}</span>
                          )}
                        </div>

                        <div>
                          <label className="block text-[10px] text-[#57534e] font-bold mb-1.5 uppercase tracking-wide">Mobile BG Image</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setBgMobileImageFile(e.target.files[0])}
                            className="w-full text-xs text-[#57534e] file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border file:border-[#eaddc7] file:text-[9px] file:font-semibold file:bg-[#faf8f5] cursor-pointer"
                          />
                          {currentBgMobilePath && (
                            <span className="text-[9px] text-zinc-400 block mt-1 truncate">Current: {currentBgMobilePath.split('/').pop()}</span>
                          )}
                        </div>

                        <div>
                          <label className="block text-[10px] text-[#57534e] font-bold mb-1.5 uppercase tracking-wide">Product PNG Image</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setProdImageFile(e.target.files[0])}
                            className="w-full text-xs text-[#57534e] file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border file:border-[#eaddc7] file:text-[9px] file:font-semibold file:bg-[#faf8f5] cursor-pointer"
                          />
                          {currentProdPath && (
                            <span className="text-[9px] text-zinc-400 block mt-1 truncate">Current: {currentProdPath.split('/').pop()}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] text-[#57534e] font-bold mb-1.5 uppercase tracking-wide">Slide Content Description</label>
                        <textarea
                          rows="4"
                          required
                          value={slideContent}
                          onChange={(e) => setSlideContent(e.target.value)}
                          placeholder="Provide dynamic descriptions about this slide..."
                          className="w-full bg-white border border-[#eaddc7] rounded-xl px-4 py-2.5 text-[#1c1917] text-sm focus:outline-none focus:border-[#b8965a] transition-all resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-[#57534e] font-bold mb-1.5 uppercase tracking-wide">Display Sort Order</label>
                        <input
                          type="number"
                          value={slideSortOrder}
                          onChange={(e) => setSlideSortOrder(parseInt(e.target.value) || 0)}
                          className="w-24 bg-white border border-[#eaddc7] rounded-xl px-4 py-2 text-[#1c1917] text-sm focus:outline-none focus:border-[#b8965a] transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={resetSlideForm}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-[#eaddc7] hover:bg-[#faf8f5] transition-all cursor-pointer text-[#57534e]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={savingSlide}
                      className="px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#b8965a] text-white hover:bg-[#a08048] transition-all cursor-pointer disabled:opacity-50 shadow-md shadow-[#b8965a]/15"
                    >
                      {savingSlide ? "Saving Slide..." : slideId ? "Save Slide Changes" : "Create Slide"}
                    </button>
                  </div>
                </form>
              )}

              {/* Slides Grid */}
              {slides.length === 0 ? (
                <div className="text-center py-12 text-zinc-400 text-sm border border-dashed border-[#eaddc7] rounded-2xl">
                  No slides found. Click &apos;Add New Slide&apos; to get started. (Max 6 slides)
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {slides.map((slide) => (
                    <div key={slide.id} className="border border-[#eaddc7] rounded-2xl bg-[#faf8f5]/30 overflow-hidden flex flex-col group hover:border-[#b8965a]/40 transition-all shadow-sm">
                      {/* Background Thumbnail preview */}
                      <div className="h-32 bg-[#faf8f5] relative flex items-center justify-center overflow-hidden">
                        {slide.image_background ? (
                          <img
                            src={slide.image_background}
                            alt="bg"
                            className="absolute inset-0 w-full h-full object-cover opacity-60 filter blur-[1px]"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-[#faf8f5]" />
                        )}
                        
                        {/* Product overlay image */}
                        {slide.image_product && (
                          <img
                            src={slide.image_product}
                            alt="product"
                            className="h-20 w-auto object-contain relative z-10 transition-transform group-hover:scale-105"
                          />
                        )}
                      </div>

                      {/* Slide card content */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-white">
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[9px] font-bold text-[#b8965a] bg-[#b8965a]/10 px-2.5 py-0.5 rounded-full border border-[#b8965a]/20">
                              Order: {slide.sort_order}
                            </span>
                          </div>
                          <h4 className="font-bold text-sm text-[#1c1917] mt-2 truncate">{slide.title || "Untitled Slide"}</h4>
                          <p className="text-xs text-zinc-400 line-clamp-2 mt-1">{slide.content || "No description provided."}</p>
                        </div>

                        <div className="flex items-center gap-2 pt-2 border-t border-[#eaddc7]/40">
                          <button
                            type="button"
                            onClick={() => startEditSlide(slide)}
                            className="flex-1 py-1.5 rounded-lg border border-[#eaddc7] bg-white text-[10px] text-[#57534e] hover:text-[#b8965a] hover:border-[#b8965a]/30 transition-all cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteSlide(slide.id)}
                            className="px-2.5 py-1.5 rounded-lg border border-[#eaddc7] hover:border-rose-200 hover:bg-rose-50 text-[10px] text-zinc-400 hover:text-rose-600 transition-all cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick instructions alert */}
          <div className="p-5 rounded-3xl border border-[#eaddc7]/50 bg-white shadow-sm flex items-start gap-4">
            <svg className="w-6 h-6 text-[#b8965a] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-[#1c1917] uppercase tracking-wide">Slider Instructions</h4>
              <p className="text-xs text-[#57534e] leading-relaxed">
                When uploading slides, make sure the <strong>Background Image</strong> is a high-resolution ambient image, 
                and the <strong>Product Image</strong> is a clean, transparent cutout of a corrugated box machine so it overlays correctly. 
                Only 6 slides can be registered. If you need to make changes, click Edit on a card to adjust it.
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
