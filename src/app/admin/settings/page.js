"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { Outfit } from "next/font/google";

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

export default function AdminSettings() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoExists, setLogoExists] = useState(true);
  
  // Tab control: 'about', 'social', 'seo', 'banner'
  const [activeTab, setActiveTab] = useState("about");

  // Form state
  const [aboutTitle, setAboutTitle] = useState("");
  const [aboutDescription, setAboutDescription] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [machinesInstalled, setMachinesInstalled] = useState("");
  const [socialFacebook, setSocialFacebook] = useState("");
  const [socialInstagram, setSocialInstagram] = useState("");
  const [socialLinkedin, setSocialLinkedin] = useState("");
  const [socialYoutube, setSocialYoutube] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [whatsappText, setWhatsappText] = useState("");
  const [whatsappActive, setWhatsappActive] = useState(true);
  const [companyAddress, setCompanyAddress] = useState("");
  const [googleMapIframe, setGoogleMapIframe] = useState("");
  const [contactEmails, setContactEmails] = useState([""]);
  const [contactPhones, setContactPhones] = useState([""]);
  const [seoMetaTitle, setSeoMetaTitle] = useState("");
  const [seoMetaDescription, setSeoMetaDescription] = useState("");
  const [seoFocusKeywords, setSeoFocusKeywords] = useState("");
  
  const [aboutImageFile, setAboutImageFile] = useState(null);
  const [currentAboutImagePath, setCurrentAboutImagePath] = useState("");
  const [aboutVideoFile, setAboutVideoFile] = useState(null);
  const [currentAboutVideoPath, setCurrentAboutVideoPath] = useState("");
  
  const [bgAboutSectionFile, setBgAboutSectionFile] = useState(null);
  const [currentBgAboutSection, setCurrentBgAboutSection] = useState("");
  const [bgProductsSectionFile, setBgProductsSectionFile] = useState(null);
  const [currentBgProductsSection, setCurrentBgProductsSection] = useState("");
  const [bgContactSectionFile, setBgContactSectionFile] = useState(null);
  const [currentBgContactSection, setCurrentBgContactSection] = useState("");
  const [bgFooterFile, setBgFooterFile] = useState(null);
  const [currentBgFooter, setCurrentBgFooter] = useState("");
  const [bgFooterMobileFile, setBgFooterMobileFile] = useState(null);
  const [currentBgFooterMobile, setCurrentBgFooterMobile] = useState("");
  const [bgAboutPageFile, setBgAboutPageFile] = useState(null);
  const [currentBgAboutPage, setCurrentBgAboutPage] = useState("");
  const [bgClientsSectionFile, setBgClientsSectionFile] = useState(null);
  const [currentBgClientsSection, setCurrentBgClientsSection] = useState("");
  const [bgTestimonialsSectionFile, setBgTestimonialsSectionFile] = useState(null);
  const [currentBgTestimonialsSection, setCurrentBgTestimonialsSection] = useState("");
  
  const [siteLogoFile, setSiteLogoFile] = useState(null);
  const [currentSiteLogo, setCurrentSiteLogo] = useState("");
  const [siteFaviconFile, setSiteFaviconFile] = useState(null);
  const [currentSiteFavicon, setCurrentSiteFavicon] = useState("");

  const [homeBannerHeading, setHomeBannerHeading] = useState("");
  const [homeBannerDescription, setHomeBannerDescription] = useState("");
  const [homeBannerImageFile, setHomeBannerImageFile] = useState(null);
  const [currentHomeBannerImage, setCurrentHomeBannerImage] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  const descTextareaRef = useRef(null);

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

    const fetchSettings = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/site-settings`, {
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${storedToken}`,
          },
        });

        if (!res.ok) throw new Error("Failed to load settings");
        const data = await res.json();
        
        setAboutTitle(data.about_title || "");
        setAboutDescription(data.about_description || "");
        setExperienceYears(data.experience_years || "");
        setMachinesInstalled(data.machines_installed || "");
        setSocialFacebook(data.social_facebook || "");
        setSocialInstagram(data.social_instagram || "");
        setSocialLinkedin(data.social_linkedin || "");
        setSocialYoutube(data.social_youtube || "");
        setWhatsappNumber(data.whatsapp_number || "");
        setWhatsappText(data.whatsapp_text || "");
        setWhatsappActive(data.whatsapp_active == "1" || data.whatsapp_active === true);
        setSeoMetaTitle(data.seo_meta_title || "");
        setSeoMetaDescription(data.seo_meta_description || "");
        setSeoFocusKeywords(data.seo_focus_keywords || "");
        setCompanyAddress(data.company_address || "");
        setGoogleMapIframe(data.google_map_iframe || "");
        setContactEmails(data.contact_email ? data.contact_email.split(",") : [""]);
        setContactPhones(data.contact_phone ? data.contact_phone.split(",") : [""]);
        setCurrentAboutImagePath(data.about_image || "");
        setCurrentAboutVideoPath(data.about_video || "");
        setCurrentBgAboutSection(data.bg_about_section || "");
        setCurrentBgProductsSection(data.bg_products_section || "");
        setCurrentBgContactSection(data.bg_contact_section || "");
        setCurrentBgFooter(data.bg_footer || "");
        setCurrentBgFooterMobile(data.bg_footer_mobile || "");
        setCurrentBgAboutPage(data.bg_about_page || "");
        setCurrentBgClientsSection(data.bg_clients_section || "");
        setCurrentBgTestimonialsSection(data.bg_testimonials_section || "");
        setCurrentSiteLogo(data.site_logo || "");
        setCurrentSiteFavicon(data.site_favicon || "");
        setHomeBannerHeading(data.home_banner_heading || "");
        setHomeBannerDescription(data.home_banner_description || "");
        setCurrentHomeBannerImage(data.home_banner_image || "");

        setLoading(false);
      } catch (err) {
        console.error(err);
        setErrorMessage("Could not load configurations.");
        setLoading(false);
      }
    };

    fetchSettings();
  }, [router]);

  // Insert HTML tags into description for custom CKEditor
  const insertFormat = (tagOpen, tagClose = "") => {
    const textarea = descTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    
    let replacement = "";
    if (tagClose === "") {
      // Single action like bullet point or header
      replacement = tagOpen + selected;
    } else {
      replacement = tagOpen + selected + tagClose;
    }

    const newValue = text.substring(0, start) + replacement + text.substring(end);
    setAboutDescription(newValue);
    
    // Focus back
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tagOpen.length, start + tagOpen.length + selected.length);
    }, 50);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const formData = new FormData();
      formData.append("about_title", aboutTitle || "");
      formData.append("about_description", aboutDescription || "");
      formData.append("experience_years", experienceYears || "");
      formData.append("machines_installed", machinesInstalled || "");
      formData.append("social_facebook", socialFacebook || "");
      formData.append("social_instagram", socialInstagram || "");
      formData.append("social_linkedin", socialLinkedin || "");
      formData.append("social_youtube", socialYoutube || "");
      formData.append("whatsapp_number", whatsappNumber || "");
      formData.append("whatsapp_text", whatsappText || "");
      formData.append("whatsapp_active", whatsappActive ? "1" : "0");
      formData.append("seo_meta_title", seoMetaTitle || "");
      formData.append("seo_meta_description", seoMetaDescription || "");
      formData.append("seo_focus_keywords", seoFocusKeywords || "");
      formData.append("company_address", companyAddress || "");
      formData.append("google_map_iframe", googleMapIframe || "");
      formData.append("home_banner_heading", homeBannerHeading || "");
      formData.append("home_banner_description", homeBannerDescription || "");
      formData.append("contact_email", contactEmails.filter(Boolean).join(","));
      formData.append("contact_phone", contactPhones.filter(Boolean).join(","));

      if (aboutImageFile) {
        formData.append("about_image", aboutImageFile);
      }

      if (aboutVideoFile) {
        formData.append("about_video", aboutVideoFile);
      }
      if (bgAboutSectionFile) formData.append("bg_about_section", bgAboutSectionFile);
      if (bgProductsSectionFile) formData.append("bg_products_section", bgProductsSectionFile);
      if (bgContactSectionFile) formData.append("bg_contact_section", bgContactSectionFile);
      if (bgFooterFile) formData.append("bg_footer", bgFooterFile);
      if (bgFooterMobileFile) formData.append("bg_footer_mobile", bgFooterMobileFile);
      if (bgAboutPageFile) formData.append("bg_about_page", bgAboutPageFile);
      if (bgClientsSectionFile) formData.append("bg_clients_section", bgClientsSectionFile);
      if (bgTestimonialsSectionFile) formData.append("bg_testimonials_section", bgTestimonialsSectionFile);
      if (siteLogoFile) formData.append("site_logo", siteLogoFile);
      if (siteFaviconFile) formData.append("site_favicon", siteFaviconFile);
      if (homeBannerImageFile) formData.append("home_banner_image", homeBannerImageFile);

      const res = await fetch(`${apiBaseUrl}/site-settings`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || "Failed to update configurations");
      }

      setSuccessMessage("CMS configurations updated successfully!");
      if (result.settings) {
        if (result.settings.about_image) {
          setCurrentAboutImagePath(result.settings.about_image);
        }
        if (result.settings.about_video) {
          setCurrentAboutVideoPath(result.settings.about_video);
        }
        if (result.settings.bg_about_section) setCurrentBgAboutSection(result.settings.bg_about_section);
        if (result.settings.bg_products_section) setCurrentBgProductsSection(result.settings.bg_products_section);
        if (result.settings.bg_contact_section) setCurrentBgContactSection(result.settings.bg_contact_section);
        if (result.settings.bg_footer) setCurrentBgFooter(result.settings.bg_footer);
        if (result.settings.bg_footer_mobile) setCurrentBgFooterMobile(result.settings.bg_footer_mobile);
        if (result.settings.bg_about_page) setCurrentBgAboutPage(result.settings.bg_about_page);
        if (result.settings.bg_clients_section) setCurrentBgClientsSection(result.settings.bg_clients_section);
        if (result.settings.bg_testimonials_section) setCurrentBgTestimonialsSection(result.settings.bg_testimonials_section);
        if (result.settings.site_logo) setCurrentSiteLogo(result.settings.site_logo);
        if (result.settings.site_favicon) setCurrentSiteFavicon(result.settings.site_favicon);
        if (result.settings.home_banner_image) setCurrentHomeBannerImage(result.settings.home_banner_image);
      }
      setAboutImageFile(null);
      setAboutVideoFile(null);
      setBgAboutSectionFile(null);
      setBgProductsSectionFile(null);
      setBgContactSectionFile(null);
      setBgFooterFile(null);
      setBgFooterMobileFile(null);
      setBgAboutPageFile(null);
      setBgClientsSectionFile(null);
      setBgTestimonialsSectionFile(null);
      setSiteLogoFile(null);
      setSiteFaviconFile(null);
      setHomeBannerImageFile(null);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setSaving(false);
    }
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
                src={currentSiteLogo || "/logo.png"}
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
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#b8965a]/10 text-[#b8965a] text-sm font-semibold border border-[#b8965a]/20 transition-all"
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
            <h1 className="text-sm font-bold text-[#1c1917] uppercase tracking-wider">CMS Settings Configuration</h1>
          </div>
          <span className="text-xs font-mono bg-white border border-[#eaddc7] px-3 py-1 rounded-full text-zinc-500">
            Nagpal Natraj General Settings
          </span>
        </header>

        <div className="flex-1 p-8 max-w-5xl w-full mx-auto space-y-8">
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

          {/* Form Tabs Selection */}
          <div className="flex border-b border-[#eaddc7]">
            <button
              onClick={() => setActiveTab("about")}
              className={`pb-4 px-6 font-bold text-xs uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
                activeTab === "about"
                  ? "border-[#b8965a] text-[#b8965a]"
                  : "border-transparent text-zinc-400 hover:text-zinc-600"
              }`}
            >
              General &amp; About Us
            </button>
            <button
              onClick={() => setActiveTab("identity")}
              className={`pb-4 px-6 font-bold text-xs uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
                activeTab === "identity"
                  ? "border-[#b8965a] text-[#b8965a]"
                  : "border-transparent text-zinc-400 hover:text-zinc-600"
              }`}
            >
              Site Identity
            </button>
            <button
              onClick={() => setActiveTab("banner")}
              className={`pb-4 px-6 font-bold text-xs uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
                activeTab === "banner"
                  ? "border-[#b8965a] text-[#b8965a]"
                  : "border-transparent text-zinc-400 hover:text-zinc-600"
              }`}
            >
              Promotional Banner
            </button>
            <button
              onClick={() => setActiveTab("social")}
              className={`pb-4 px-6 font-bold text-xs uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
                activeTab === "social"
                  ? "border-[#b8965a] text-[#b8965a]"
                  : "border-transparent text-zinc-400 hover:text-zinc-600"
              }`}
            >
              Social &amp; WhatsApp
            </button>
            <button
              onClick={() => setActiveTab("seo")}
              className={`pb-4 px-6 font-bold text-xs uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
                activeTab === "seo"
                  ? "border-[#b8965a] text-[#b8965a]"
                  : "border-transparent text-zinc-400 hover:text-zinc-600"
              }`}
            >
              SEO Optimization
            </button>
            <button
              onClick={() => setActiveTab("backgrounds")}
              className={`pb-4 px-6 font-bold text-xs uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
                activeTab === "backgrounds"
                  ? "border-[#b8965a] text-[#b8965a]"
                  : "border-transparent text-zinc-400 hover:text-zinc-600"
              }`}
            >
              Parallax Backgrounds
            </button>
          </div>

          {/* Settings Form */}
          <form onSubmit={handleSave} className="space-y-6">
            
            {activeTab === "about" && (
              /* ABOUT US TAB */
              <div className="rounded-3xl border border-[#eaddc7]/50 bg-white p-8 space-y-6 shadow-sm">
                <div>
                  <h3 className="text-base font-bold text-[#1c1917]">About Section Configuration</h3>
                  <p className="text-xs text-[#57534e] mt-1">Configure structural details for the homepage bio section.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-2">About Section Title</label>
                      <input
                        type="text"
                        value={aboutTitle}
                        onChange={(e) => setAboutTitle(e.target.value)}
                        placeholder="Decades of Engineering Precision..."
                        className="w-full bg-white border border-[#eaddc7] rounded-xl px-4 py-2.5 text-[#1c1917] text-sm focus:outline-none focus:border-[#b8965a] transition-all"
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
                          className="w-full bg-white border border-[#eaddc7] rounded-xl px-4 py-2.5 text-[#1c1917] text-sm focus:outline-none focus:border-[#b8965a] transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-2">Machines Display</label>
                        <input
                          type="text"
                          value={machinesInstalled}
                          onChange={(e) => setMachinesInstalled(e.target.value)}
                          placeholder="e.g. 5000+ Installed"
                          className="w-full bg-white border border-[#eaddc7] rounded-xl px-4 py-2.5 text-[#1c1917] text-sm focus:outline-none focus:border-[#b8965a] transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-2">Section Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setAboutImageFile(e.target.files[0])}
                        className="w-full text-xs text-[#57534e] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-[#eaddc7] file:text-[10px] file:font-semibold file:bg-[#faf8f5] file:text-[#57534e] hover:file:bg-[#faf8f5]/85 cursor-pointer file:cursor-pointer"
                      />
                      {currentAboutImagePath && (
                        <div className="mt-3 flex items-center gap-3">
                          <span className="text-[10px] text-zinc-400 truncate max-w-xs block">Active: {currentAboutImagePath.split('/').pop()}</span>
                          <a href={currentAboutImagePath} target="_blank" className="text-[9px] bg-[#faf8f5] border border-[#eaddc7] text-[#b8965a] px-2 py-0.5 rounded font-semibold hover:bg-white transition-all">Preview</a>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-2">Section Video (Left Side Player)</label>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => setAboutVideoFile(e.target.files[0])}
                        className="w-full text-xs text-[#57534e] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-[#eaddc7] file:text-[10px] file:font-semibold file:bg-[#faf8f5] file:text-[#57534e] hover:file:bg-[#faf8f5]/85 cursor-pointer file:cursor-pointer"
                      />
                      {currentAboutVideoPath && (
                        <div className="mt-3 flex items-center gap-3">
                          <span className="text-[10px] text-zinc-400 truncate max-w-xs block">Active: {currentAboutVideoPath.split('/').pop()}</span>
                          <a href={currentAboutVideoPath} target="_blank" className="text-[9px] bg-[#faf8f5] border border-[#eaddc7] text-[#b8965a] px-2 py-0.5 rounded font-semibold hover:bg-white transition-all">Preview</a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-1.5">About Section Description (CKEditor WYSIWYG)</label>
                      <WysiwygEditor
                        value={aboutDescription}
                        onChange={setAboutDescription}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-1.5">Company Physical Address</label>
                      <textarea
                        value={companyAddress}
                        onChange={(e) => setCompanyAddress(e.target.value)}
                        placeholder="Enter the full physical address for the footer..."
                        rows={3}
                        className="w-full text-xs text-[#1c1917] bg-[#faf8f5] border border-[#eaddc7] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#b8965a]/20 focus:border-[#b8965a] transition-all resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-1.5">Google Maps Embed iframe `src` URL</label>
                      <input
                        type="text"
                        value={googleMapIframe}
                        onChange={(e) => setGoogleMapIframe(e.target.value)}
                        placeholder="e.g. https://www.google.com/maps/embed?pb=..."
                        className="w-full text-xs text-[#1c1917] bg-[#faf8f5] border border-[#eaddc7] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#b8965a]/20 focus:border-[#b8965a] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-1.5">Contact / Sales Emails</label>
                      <div className="space-y-2">
                        {contactEmails.map((email, idx) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => {
                                const newEmails = [...contactEmails];
                                newEmails[idx] = e.target.value;
                                setContactEmails(newEmails);
                              }}
                              placeholder="e.g. sales@natrajmachinery.com"
                              className="flex-1 text-xs text-[#1c1917] bg-[#faf8f5] border border-[#eaddc7] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#b8965a]/20 focus:border-[#b8965a] transition-all"
                            />
                            {contactEmails.length > 1 && (
                              <button
                                type="button"
                                onClick={() => setContactEmails(contactEmails.filter((_, i) => i !== idx))}
                                className="px-3 py-3 text-xs bg-red-50 text-red-500 rounded-xl border border-red-100 hover:bg-red-100 transition-colors"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => setContactEmails([...contactEmails, ""])}
                          className="text-[10px] bg-[#faf8f5] border border-[#eaddc7] text-[#b8965a] px-3 py-1.5 rounded-lg font-bold hover:bg-white transition-all uppercase tracking-wider"
                        >
                          + Add Email
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-1.5">Contact / Sales Phone Numbers</label>
                      <div className="space-y-2">
                        {contactPhones.map((phone, idx) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <input
                              type="text"
                              value={phone}
                              onChange={(e) => {
                                const newPhones = [...contactPhones];
                                newPhones[idx] = e.target.value;
                                setContactPhones(newPhones);
                              }}
                              placeholder="e.g. +91 99999 88888"
                              className="flex-1 text-xs text-[#1c1917] bg-[#faf8f5] border border-[#eaddc7] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#b8965a]/20 focus:border-[#b8965a] transition-all"
                            />
                            {contactPhones.length > 1 && (
                              <button
                                type="button"
                                onClick={() => setContactPhones(contactPhones.filter((_, i) => i !== idx))}
                                className="px-3 py-3 text-xs bg-red-50 text-red-500 rounded-xl border border-red-100 hover:bg-red-100 transition-colors"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => setContactPhones([...contactPhones, ""])}
                          className="text-[10px] bg-[#faf8f5] border border-[#eaddc7] text-[#b8965a] px-3 py-1.5 rounded-lg font-bold hover:bg-white transition-all uppercase tracking-wider"
                        >
                          + Add Phone Number
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "identity" && (
              /* SITE IDENTITY TAB */
              <div className="rounded-3xl border border-[#eaddc7]/50 bg-white p-8 space-y-6 shadow-sm">
                <div>
                  <h3 className="text-base font-bold text-[#1c1917]">Site Identity Configuration</h3>
                  <p className="text-xs text-[#57534e] mt-1">Upload the global company logo and browser favicon.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Site Logo */}
                  <div>
                    <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-2">Global Site Logo</label>
                    <input
                      type="file" accept="image/*" onChange={(e) => setSiteLogoFile(e.target.files[0])}
                      className="w-full text-xs text-[#57534e] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-[#eaddc7] file:text-[10px] file:font-semibold file:bg-[#faf8f5] cursor-pointer"
                    />
                    {currentSiteLogo && (
                      <div className="mt-3 flex items-center gap-3">
                        <img src={currentSiteLogo} alt="Logo Preview" className="h-10 w-auto bg-gray-100 p-1 border rounded" />
                        <span className="text-[10px] text-zinc-400 truncate max-w-xs block">Active: {currentSiteLogo.split('/').pop()}</span>
                      </div>
                    )}
                  </div>

                  {/* Site Favicon */}
                  <div>
                    <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-2">Browser Favicon (.ico or .png)</label>
                    <input
                      type="file" accept="image/*" onChange={(e) => setSiteFaviconFile(e.target.files[0])}
                      className="w-full text-xs text-[#57534e] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-[#eaddc7] file:text-[10px] file:font-semibold file:bg-[#faf8f5] cursor-pointer"
                    />
                    {currentSiteFavicon && (
                      <div className="mt-3 flex items-center gap-3">
                        <img src={currentSiteFavicon} alt="Favicon Preview" className="h-8 w-8 bg-gray-100 p-1 border rounded" />
                        <span className="text-[10px] text-zinc-400 truncate max-w-xs block">Active: {currentSiteFavicon.split('/').pop()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "banner" && (
              /* PROMOTIONAL BANNER TAB */
              <div className="rounded-3xl border border-[#eaddc7]/50 bg-white p-8 space-y-6 shadow-sm">
                <div>
                  <h3 className="text-base font-bold text-[#1c1917]">Promotional Home Banner</h3>
                  <p className="text-xs text-[#57534e] mt-1">Manage the dynamic full-width banner on the home page.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-2">Banner Heading</label>
                      <input
                        type="text"
                        value={homeBannerHeading}
                        onChange={(e) => setHomeBannerHeading(e.target.value)}
                        placeholder="e.g. Special Offer..."
                        className="w-full bg-white border border-[#eaddc7] rounded-xl px-4 py-2.5 text-[#1c1917] text-sm focus:outline-none focus:border-[#b8965a] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-2">Banner Description</label>
                      <textarea
                        value={homeBannerDescription}
                        onChange={(e) => setHomeBannerDescription(e.target.value)}
                        placeholder="Short description..."
                        rows={4}
                        className="w-full text-xs text-[#1c1917] bg-[#faf8f5] border border-[#eaddc7] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#b8965a]/20 focus:border-[#b8965a] transition-all resize-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-2">Banner Image</label>
                    <input
                      type="file" accept="image/*" onChange={(e) => setHomeBannerImageFile(e.target.files[0])}
                      className="w-full text-xs text-[#57534e] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-[#eaddc7] file:text-[10px] file:font-semibold file:bg-[#faf8f5] cursor-pointer"
                    />
                    {currentHomeBannerImage && (
                      <div className="mt-3 flex items-center gap-3">
                        <img src={currentHomeBannerImage} alt="Banner Preview" className="h-16 w-auto bg-gray-100 p-1 border rounded" />
                        <span className="text-[10px] text-zinc-400 truncate max-w-xs block">Active: {currentHomeBannerImage.split('/').pop()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "social" && (
              /* SOCIALS & WHATSAPP TAB */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Social Profiles */}
                <div className="rounded-3xl border border-[#eaddc7]/50 bg-white p-8 space-y-5 shadow-sm">
                  <div>
                    <h3 className="text-base font-bold text-[#1c1917]">Social Profiles</h3>
                    <p className="text-xs text-[#57534e] mt-1">Configure company profiles links referenced in header/footers.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-2">Facebook URL</label>
                      <input
                        type="url"
                        value={socialFacebook}
                        onChange={(e) => setSocialFacebook(e.target.value)}
                        placeholder="https://facebook.com/..."
                        className="w-full bg-white border border-[#eaddc7] rounded-xl px-4 py-2 text-[#1c1917] text-sm focus:outline-none focus:border-[#b8965a] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-2">Instagram URL</label>
                      <input
                        type="url"
                        value={socialInstagram}
                        onChange={(e) => setSocialInstagram(e.target.value)}
                        placeholder="https://instagram.com/..."
                        className="w-full bg-white border border-[#eaddc7] rounded-xl px-4 py-2 text-[#1c1917] text-sm focus:outline-none focus:border-[#b8965a] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-2">LinkedIn URL</label>
                      <input
                        type="url"
                        value={socialLinkedin}
                        onChange={(e) => setSocialLinkedin(e.target.value)}
                        placeholder="https://linkedin.com/company/..."
                        className="w-full bg-white border border-[#eaddc7] rounded-xl px-4 py-2 text-[#1c1917] text-sm focus:outline-none focus:border-[#b8965a] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-2">YouTube Channel URL</label>
                      <input
                        type="url"
                        value={socialYoutube}
                        onChange={(e) => setSocialYoutube(e.target.value)}
                        placeholder="https://youtube.com/c/..."
                        className="w-full bg-white border border-[#eaddc7] rounded-xl px-4 py-2 text-[#1c1917] text-sm focus:outline-none focus:border-[#b8965a] transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* WhatsApp button */}
                <div className="rounded-3xl border border-[#eaddc7]/50 bg-white p-8 space-y-5 shadow-sm flex flex-col justify-between">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-base font-bold text-[#1c1917]">WhatsApp Widget</h3>
                      <p className="text-xs text-[#57534e] mt-1">Setup the floating chat widget on the website homepage.</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="whatsapp_active"
                        checked={whatsappActive}
                        onChange={(e) => setWhatsappActive(e.target.checked)}
                        className="h-4.5 w-4.5 accent-[#b8965a] cursor-pointer"
                      />
                      <label htmlFor="whatsapp_active" className="text-xs font-semibold text-[#1c1917] cursor-pointer">
                        Enable floating WhatsApp chat bubble
                      </label>
                    </div>

                    <div>
                      <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-2">WhatsApp Phone Number (with Country Code)</label>
                      <input
                        type="text"
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                        placeholder="e.g. 919999999999"
                        className="w-full bg-white border border-[#eaddc7] rounded-xl px-4 py-2 text-[#1c1917] text-sm focus:outline-none focus:border-[#b8965a] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-2">Default Pre-filled Chat Message</label>
                      <input
                        type="text"
                        value={whatsappText}
                        onChange={(e) => setWhatsappText(e.target.value)}
                        placeholder="Hi, I am interested in Natraja machinery."
                        className="w-full bg-white border border-[#eaddc7] rounded-xl px-4 py-2.5 text-[#1c1917] text-sm focus:outline-none focus:border-[#b8965a] transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "seo" && (
              /* SEO SETTINGS TAB */
              <div className="rounded-3xl border border-[#eaddc7]/50 bg-white p-8 space-y-6 shadow-sm">
                <div>
                  <h3 className="text-base font-bold text-[#1c1917]">SEO Metadata Settings</h3>
                  <p className="text-xs text-[#57534e] mt-1">Configure titles and descriptions for search index crawlers.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-2">Default Meta Title Tag</label>
                      <input
                        type="text"
                        value={seoMetaTitle}
                        onChange={(e) => setSeoMetaTitle(e.target.value)}
                        placeholder="Nagpal Natraj - Corrugating Machinery Company..."
                        className="w-full bg-white border border-[#eaddc7] rounded-xl px-4 py-2.5 text-[#1c1917] text-sm focus:outline-none focus:border-[#b8965a] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-2">Focus Keywords (comma-separated)</label>
                      <input
                        type="text"
                        value={seoFocusKeywords}
                        onChange={(e) => setSeoFocusKeywords(e.target.value)}
                        placeholder="corrugation machine, box making machinery, Natraja"
                        className="w-full bg-white border border-[#eaddc7] rounded-xl px-4 py-2.5 text-[#1c1917] text-sm focus:outline-none focus:border-[#b8965a] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-2">Meta Description Tag</label>
                    <textarea
                      rows="4"
                      value={seoMetaDescription}
                      onChange={(e) => setSeoMetaDescription(e.target.value)}
                      placeholder="Enter meta description used by search engine result cards..."
                      className="w-full bg-white border border-[#eaddc7] rounded-xl px-4 py-2.5 text-[#1c1917] text-sm focus:outline-none focus:border-[#b8965a] transition-all resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "backgrounds" && (
              <div className="rounded-3xl border border-[#eaddc7]/50 bg-white p-8 space-y-6 shadow-sm">
                <div>
                  <h3 className="text-base font-bold text-[#1c1917]">Parallax Sections Backgrounds</h3>
                  <p className="text-xs text-[#57534e] mt-1">Upload high-resolution images for section backgrounds. They will display with a 3D parallax scrolling effect.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Home About Section */}
                  <div>
                    <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-2">Homepage About Section</label>
                    <input
                      type="file" accept="image/*" onChange={(e) => setBgAboutSectionFile(e.target.files[0])}
                      className="w-full text-xs text-[#57534e] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-[#eaddc7] file:text-[10px] file:font-semibold file:bg-[#faf8f5] cursor-pointer"
                    />
                    {currentBgAboutSection && (
                      <div className="mt-3 flex items-center gap-3">
                        <span className="text-[10px] text-zinc-400 truncate max-w-xs block">Active: {currentBgAboutSection.split('/').pop()}</span>
                        <a href={currentBgAboutSection} target="_blank" className="text-[9px] bg-[#faf8f5] border border-[#eaddc7] text-[#b8965a] px-2 py-0.5 rounded font-semibold">Preview</a>
                      </div>
                    )}
                  </div>

                  {/* Home Products Section */}
                  <div>
                    <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-2">Homepage Products Section</label>
                    <input
                      type="file" accept="image/*" onChange={(e) => setBgProductsSectionFile(e.target.files[0])}
                      className="w-full text-xs text-[#57534e] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-[#eaddc7] file:text-[10px] file:font-semibold file:bg-[#faf8f5] cursor-pointer"
                    />
                    {currentBgProductsSection && (
                      <div className="mt-3 flex items-center gap-3">
                        <span className="text-[10px] text-zinc-400 truncate max-w-xs block">Active: {currentBgProductsSection.split('/').pop()}</span>
                        <a href={currentBgProductsSection} target="_blank" className="text-[9px] bg-[#faf8f5] border border-[#eaddc7] text-[#b8965a] px-2 py-0.5 rounded font-semibold">Preview</a>
                      </div>
                    )}
                  </div>

                  {/* Home Contact Section */}
                  <div>
                    <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-2">Homepage Contact Section</label>
                    <input
                      type="file" accept="image/*" onChange={(e) => setBgContactSectionFile(e.target.files[0])}
                      className="w-full text-xs text-[#57534e] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-[#eaddc7] file:text-[10px] file:font-semibold file:bg-[#faf8f5] cursor-pointer"
                    />
                    {currentBgContactSection && (
                      <div className="mt-3 flex items-center gap-3">
                        <span className="text-[10px] text-zinc-400 truncate max-w-xs block">Active: {currentBgContactSection.split('/').pop()}</span>
                        <a href={currentBgContactSection} target="_blank" className="text-[9px] bg-[#faf8f5] border border-[#eaddc7] text-[#b8965a] px-2 py-0.5 rounded font-semibold">Preview</a>
                      </div>
                    )}
                  </div>

                  {/* Footer Background */}
                  <div>
                    <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-2">Global Footer Background</label>
                    <input
                      type="file" accept="image/*" onChange={(e) => setBgFooterFile(e.target.files[0])}
                      className="w-full text-xs text-[#57534e] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-[#eaddc7] file:text-[10px] file:font-semibold file:bg-[#faf8f5] cursor-pointer"
                    />
                    {currentBgFooter && (
                      <div className="mt-3 flex items-center gap-3">
                        <span className="text-[10px] text-zinc-400 truncate max-w-xs block">Active: {currentBgFooter.split('/').pop()}</span>
                        <a href={currentBgFooter} target="_blank" className="text-[9px] bg-[#faf8f5] border border-[#eaddc7] text-[#b8965a] px-2 py-0.5 rounded font-semibold">Preview</a>
                      </div>
                    )}
                  </div>

                  {/* Footer Background Mobile */}
                  <div>
                    <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-2">Global Footer Background (Mobile Phone)</label>
                    <input
                      type="file" accept="image/*" onChange={(e) => setBgFooterMobileFile(e.target.files[0])}
                      className="w-full text-xs text-[#57534e] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-[#eaddc7] file:text-[10px] file:font-semibold file:bg-[#faf8f5] cursor-pointer"
                    />
                    {currentBgFooterMobile && (
                      <div className="mt-3 flex items-center gap-3">
                        <span className="text-[10px] text-zinc-400 truncate max-w-xs block">Active: {currentBgFooterMobile.split('/').pop()}</span>
                        <a href={currentBgFooterMobile} target="_blank" className="text-[9px] bg-[#faf8f5] border border-[#eaddc7] text-[#b8965a] px-2 py-0.5 rounded font-semibold">Preview</a>
                      </div>
                    )}
                  </div>

                  {/* About Us Page Header */}
                  <div>
                    <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-2">About Us Details Page Banner</label>
                    <input
                      type="file" accept="image/*" onChange={(e) => setBgAboutPageFile(e.target.files[0])}
                      className="w-full text-xs text-[#57534e] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-[#eaddc7] file:text-[10px] file:font-semibold file:bg-[#faf8f5] cursor-pointer"
                    />
                    {currentBgAboutPage && (
                      <div className="mt-3 flex items-center gap-3">
                        <span className="text-[10px] text-zinc-400 truncate max-w-xs block">Active: {currentBgAboutPage.split('/').pop()}</span>
                        <a href={currentBgAboutPage} target="_blank" className="text-[9px] bg-[#faf8f5] border border-[#eaddc7] text-[#b8965a] px-2 py-0.5 rounded font-semibold">Preview</a>
                      </div>
                    )}
                  </div>

                  {/* Clients Section Background */}
                  <div>
                    <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-2">Homepage Clients Section</label>
                    <input
                      type="file" accept="image/*" onChange={(e) => setBgClientsSectionFile(e.target.files[0])}
                      className="w-full text-xs text-[#57534e] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-[#eaddc7] file:text-[10px] file:font-semibold file:bg-[#faf8f5] cursor-pointer"
                    />
                    {currentBgClientsSection && (
                      <div className="mt-3 flex items-center gap-3">
                        <span className="text-[10px] text-zinc-400 truncate max-w-xs block">Active: {currentBgClientsSection.split('/').pop()}</span>
                        <a href={currentBgClientsSection} target="_blank" className="text-[9px] bg-[#faf8f5] border border-[#eaddc7] text-[#b8965a] px-2 py-0.5 rounded font-semibold">Preview</a>
                      </div>
                    )}
                  </div>

                  {/* Testimonials Section Background */}
                  <div>
                    <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-2">Homepage Testimonials Section</label>
                    <input
                      type="file" accept="image/*" onChange={(e) => setBgTestimonialsSectionFile(e.target.files[0])}
                      className="w-full text-xs text-[#57534e] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-[#eaddc7] file:text-[10px] file:font-semibold file:bg-[#faf8f5] cursor-pointer"
                    />
                    {currentBgTestimonialsSection && (
                      <div className="mt-3 flex items-center gap-3">
                        <span className="text-[10px] text-zinc-400 truncate max-w-xs block">Active: {currentBgTestimonialsSection.split('/').pop()}</span>
                        <a href={currentBgTestimonialsSection} target="_blank" className="text-[9px] bg-[#faf8f5] border border-[#eaddc7] text-[#b8965a] px-2 py-0.5 rounded font-semibold">Preview</a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#b8965a] hover:bg-[#a08048] text-white transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50 shadow-md shadow-[#b8965a]/15"
              >
                {saving ? "Saving Changes..." : "Save Configuration"}
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}
