"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const [logoExists, setLogoExists] = useState(true);
  const [logoUrl, setLogoUrl] = useState("/logo.png");
  const [isScrolled, setIsScrolled] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeHoverCategory, setActiveHoverCategory] = useState("all");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname() || "";

  useEffect(() => {
    const fetchSettingsAndCategories = async () => {
      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
        const [resSettings, resCats, resProds] = await Promise.all([
          fetch(`${apiBaseUrl}/site-settings`).catch(() => null),
          fetch(`${apiBaseUrl}/categories`).catch(() => null),
          fetch(`${apiBaseUrl}/products`).catch(() => null)
        ]);

        if (resSettings && resSettings.ok) {
          const data = await resSettings.json();
          if (data.site_logo) setLogoUrl(data.site_logo);
        }

        if (resCats && resCats.ok) {
          const cats = await resCats.json();
          setCategories(cats);
        }

        if (resProds && resProds.ok) {
          const prods = await resProds.json();
          setProducts(prods);
        }
      } catch (err) { }
    };
    fetchSettingsAndCategories();

    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className={`fixed z-50 transition-all duration-500 ease-in-out ${isScrolled
          ? "top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl bg-white shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-gray-100 py-1 px-8 rounded-full"
          : "top-0 left-0 right-0 w-full bg-transparent py-2 px-6"
          }`}
      >
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-8">

          {/* Brand Logo & Name */}
          <a href="#" className="flex items-center gap-4 group">
            <div
              className={`relative flex items-center justify-center transition-all duration-500 ${isScrolled ? "h-14" : "h-20 md:h-24"}`}
            >
              {logoExists ? (
                <img
                  src={logoUrl}
                  alt="Natraja"
                  className="h-full w-auto object-contain"
                  onError={() => setLogoExists(false)}
                />
              ) : (
                <div className="h-full aspect-square bg-[#b8965a]/10 rounded-xl flex items-center justify-center font-black text-transparent bg-clip-text bg-gradient-to-tr from-[#b8965a] to-[#d4b277] text-3xl">
                  N
                </div>
              )}
            </div>
            <div className="flex flex-col justify-center gap-0.5">
              <span className={`font-black uppercase tracking-wide text-[#b8965a] drop-shadow-sm transition-all duration-500 leading-none ${isScrolled ? "text-base" : "text-lg md:text-xl"}`}>
                Nagpal
              </span>
              <span className={`font-black uppercase tracking-wide text-[#b8965a] drop-shadow-sm transition-all duration-500 leading-none ${isScrolled ? "text-base" : "text-lg md:text-xl"}`}>
                Industries
              </span>
            </div>
          </a>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs uppercase font-extrabold tracking-wider transition-colors duration-300 text-black">
            <a href="/" className={`hover:text-[#b8965a] transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-[#b8965a] hover:after:w-full after:transition-all ${pathname === "/" ? "text-[#b8965a] after:w-full" : "after:w-0"}`}>Home</a>
            <a href="/about" className={`hover:text-[#b8965a] transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-[#b8965a] hover:after:w-full after:transition-all ${pathname.startsWith("/about") ? "text-[#b8965a] after:w-full" : "after:w-0"}`}>About Us</a>

            <div
              className="relative group"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <a href="/products" className={`hover:text-[#b8965a] transition-colors relative flex items-center gap-1.5 after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-[#b8965a] hover:after:w-full after:transition-all ${pathname.startsWith("/products") ? "text-[#b8965a] after:w-full" : "after:w-0"}`}>
                Products
                <svg className={`w-3 h-3 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </a>

              {/* Mega Menu Dropdown */}
              <div className={`absolute top-full left-1/2 -translate-x-1/2 xl:left-1/2 xl:-translate-x-1/2 lg:left-auto lg:right-[-150px] lg:translate-x-0 md:left-auto md:right-[-250px] md:translate-x-0 pt-6 transition-all duration-300 ${isDropdownOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-2"}`}>
                <div className="bg-white border border-[#eaddc7]/30 shadow-[0_30px_60px_rgba(0,0,0,0.12)] rounded-3xl p-0 w-[90vw] md:w-[700px] lg:w-[900px] flex overflow-hidden relative z-50">
                  
                  {/* Left Side: Categories List */}
                  <div className="w-[30%] bg-[#faf8f5] border-r border-[#eaddc7]/30 p-6 flex flex-col gap-1.5">
                    <h4 className="text-[11px] font-bold uppercase text-zinc-400 tracking-wider mb-2 px-3">Browse Categories</h4>
                    <a 
                      href="/products" 
                      onMouseEnter={() => setActiveHoverCategory("all")}
                      className={`block px-4 py-2.5 text-[13px] rounded-lg transition-all flex items-center justify-between ${activeHoverCategory === "all" ? "bg-white text-[#b8965a] font-bold shadow-sm" : "text-zinc-600 font-medium hover:bg-white/50"}`}
                    >
                      View All Products
                      {activeHoverCategory === "all" && <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>}
                    </a>
                    {categories.map(cat => (
                      <a 
                        key={cat.id} 
                        href={`/products?category=${cat.slug}`} 
                        onMouseEnter={() => setActiveHoverCategory(cat.slug)}
                        className={`block px-4 py-2.5 text-[13px] capitalize rounded-lg transition-all flex items-center justify-between ${activeHoverCategory === cat.slug ? "bg-white text-[#b8965a] font-bold shadow-sm" : "text-zinc-600 font-medium hover:bg-white/50"}`}
                      >
                        {cat.name}
                        {activeHoverCategory === cat.slug && <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>}
                      </a>
                    ))}
                  </div>

                  {/* Right Side: Products Display */}
                  <div className="w-[70%] p-8 bg-white flex flex-col">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-100">
                      <h4 className="text-[14px] font-black uppercase text-zinc-800 tracking-wide flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#b8965a]"></span>
                        {activeHoverCategory === "all" ? "Featured Products" : categories.find(c => c.slug === activeHoverCategory)?.name}
                      </h4>
                      <a href={activeHoverCategory === "all" ? "/products" : `/products?category=${activeHoverCategory}`} className="text-[11px] font-bold text-[#b8965a] uppercase tracking-wider hover:underline flex items-center gap-1 bg-[#faf8f5] px-3 py-1.5 rounded-full">
                        View All <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                      </a>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-x-8 gap-y-1 mt-2">
                      {(activeHoverCategory === "all" ? products : products.filter(p => p.category?.slug === activeHoverCategory))
                        .slice(0, 16)
                        .map(prod => (
                          <a key={prod.id} href={`/products/${prod.slug}`} className="group py-2 transition-colors">
                            <span className="text-[13px] font-bold text-[#1c1917] group-hover:text-[#b8965a] transition-colors line-clamp-1">
                              {prod.title}
                            </span>
                          </a>
                        ))}
                    </div>
                  </div>

                </div>
              </div>
            </div>

            <a href="/blogs" className={`hover:text-[#b8965a] transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-[#b8965a] hover:after:w-full after:transition-all ${pathname.startsWith("/blogs") ? "text-[#b8965a] after:w-full" : "after:w-0"}`}>Blog</a>
            <a href="/contact" className={`hover:text-[#b8965a] transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-[#b8965a] hover:after:w-full after:transition-all ${pathname === "/contact" ? "text-[#b8965a] after:w-full" : "after:w-0"}`}>Contact</a>
          </nav>

          {/* Action buttons */}
          <div className="flex items-center gap-4">
            <a
              href="/contact"
              className={`hidden sm:inline-flex px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider active:scale-[0.98] transition-all ${isScrolled
                ? "bg-black text-white hover:bg-stone-900 shadow-md shadow-black/10"
                : "bg-[#b8965a] hover:bg-[#a08048] text-white shadow-md shadow-[#b8965a]/20 hover:shadow-[#b8965a]/30"
                }`}
            >
              Get a Quote
            </a>

            {/* Mobile Menu Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-xl transition-all focus:outline-none cursor-pointer ${isScrolled
                ? "text-black hover:bg-stone-100"
                : "text-stone-800 hover:bg-black/5"
                }`}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Menu Drawer Content */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 shadow-2xl flex flex-col p-6 transition-transform duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-[#eaddc7]/30 pb-4 mb-6">
          <a href="#" className="flex items-center gap-3">
            <div className="h-10 relative flex items-center justify-center">
              {logoExists ? (
                <img
                  src={logoUrl}
                  alt="Natraja"
                  className="h-full w-auto object-contain"
                  onError={() => setLogoExists(false)}
                />
              ) : (
                <div className="h-full aspect-square bg-[#b8965a]/10 rounded-lg flex items-center justify-center font-black text-[#b8965a] text-lg">
                  N
                </div>
              )}
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-black uppercase tracking-wide text-[#b8965a] text-xs leading-none">
                Nagpal
              </span>
              <span className="font-black uppercase tracking-wide text-[#b8965a] text-xs leading-none mt-0.5">
                Industries
              </span>
            </div>
          </a>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1 rounded-lg text-stone-500 hover:text-black hover:bg-stone-100 transition-all cursor-pointer"
            aria-label="Close Menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer Links */}
        <nav className="flex flex-col gap-4 text-sm font-extrabold uppercase tracking-wider text-[#1c1917] overflow-y-auto flex-grow pr-1">
          <a
            href="/"
            className={`py-2 px-3 rounded-xl transition-all ${pathname === "/" ? "bg-[#b8965a]/15 text-[#b8965a]" : "hover:bg-[#faf8f5] hover:text-[#b8965a]"
              }`}
          >
            Home
          </a>
          <a
            href="/about"
            className={`py-2 px-3 rounded-xl transition-all ${pathname.startsWith("/about") ? "bg-[#b8965a]/15 text-[#b8965a]" : "hover:bg-[#faf8f5] hover:text-[#b8965a]"
              }`}
          >
            About Us
          </a>
          <a
            href="/products"
            className={`py-2 px-3 rounded-xl transition-all ${pathname.startsWith("/products") ? "bg-[#b8965a]/15 text-[#b8965a]" : "hover:bg-[#faf8f5] hover:text-[#b8965a]"
              }`}
          >
            Products
          </a>

          {/* Categories Sub-Menu in Mobile Menu */}
          {categories.length > 0 && (
            <div className="pl-4 border-l border-[#eaddc7]/50 flex flex-col gap-2.5 my-1">
              {categories.map((cat) => (
                <a
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className="text-xs font-bold text-stone-500 hover:text-[#b8965a] transition-all capitalize"
                >
                  {cat.name}
                </a>
              ))}
            </div>
          )}

          <a
            href="/blogs"
            className={`py-2 px-3 rounded-xl transition-all ${pathname.startsWith("/blogs") ? "bg-[#b8965a]/15 text-[#b8965a]" : "hover:bg-[#faf8f5] hover:text-[#b8965a]"
              }`}
          >
            Blog
          </a>
          <a
            href="/contact"
            className={`py-2 px-3 rounded-xl transition-all ${pathname === "/contact" ? "bg-[#b8965a]/15 text-[#b8965a]" : "hover:bg-[#faf8f5] hover:text-[#b8965a]"
              }`}
          >
            Contact
          </a>
        </nav>

        {/* Drawer Footer Buttons */}
        <div className="pt-6 border-t border-[#eaddc7]/30 mt-auto flex flex-col gap-3">
          <a
            href="/contact"
            className="w-full py-3.5 bg-[#b8965a] hover:bg-[#a08048] text-white rounded-xl text-center text-xs font-extrabold uppercase tracking-wider transition-colors shadow-md shadow-[#b8965a]/10"
          >
            Get a Quote
          </a>
        </div>
      </div>
    </>
  );
}
