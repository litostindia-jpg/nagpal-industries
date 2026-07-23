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
      } catch (err) {}
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

  return (
    <header
      className={`fixed z-50 transition-all duration-500 ease-in-out ${isScrolled
          ? "top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl bg-white shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-gray-100 py-1 px-8 rounded-full"
          : "top-0 left-0 right-0 w-full bg-transparent border-b border-[#eaddc7]/15 py-5 px-6"
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
            <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-6 transition-all duration-300 ${isDropdownOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-2"}`}>
              <div className="bg-white border border-[#eaddc7]/30 shadow-[0_20px_40px_rgba(0,0,0,0.1)] rounded-2xl p-6 w-[800px] flex gap-8 overflow-hidden relative z-50">
                
                {/* Left Side: Categories List */}
                <div className="w-1/3 border-r border-[#eaddc7]/30 pr-6 space-y-1">
                  <a href="/products" className="block px-4 py-2.5 text-[#1c1917] hover:bg-[#faf8f5] hover:text-[#b8965a] transition-colors font-black rounded-lg">
                    View All Products
                  </a>
                  {categories.map(cat => (
                    <a key={cat.id} href={`/products?category=${cat.slug}`} className="block px-4 py-2 text-[#57534e] hover:bg-[#faf8f5] hover:text-[#b8965a] transition-colors font-bold capitalize text-xs rounded-lg">
                      {cat.name}
                    </a>
                  ))}
                </div>

                {/* Right Side: Products Grid categorized */}
                <div className="w-2/3 grid grid-cols-2 gap-x-8 gap-y-6">
                  {categories.map(cat => {
                    const catProducts = products.filter(p => p.category?.slug === cat.slug).slice(0, 4); // Show top 4 per category
                    if (catProducts.length === 0) return null;
                    return (
                      <div key={cat.id} className="space-y-3">
                        <h4 className="text-[10px] font-black uppercase text-[#b8965a] tracking-widest border-b border-[#eaddc7]/30 pb-1">{cat.name}</h4>
                        <ul className="space-y-2">
                          {catProducts.map(prod => (
                            <li key={prod.id}>
                              <a href={`/products/${prod.slug}`} className="text-xs font-semibold text-[#57534e] hover:text-[#b8965a] transition-colors line-clamp-1">
                                {prod.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>

              </div>
            </div>
          </div>

          <a href="/blogs" className={`hover:text-[#b8965a] transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-[#b8965a] hover:after:w-full after:transition-all ${pathname.startsWith("/blogs") ? "text-[#b8965a] after:w-full" : "after:w-0"}`}>Blog</a>
          <a href="/contact" className={`hover:text-[#b8965a] transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-[#b8965a] hover:after:w-full after:transition-all ${pathname === "/contact" ? "text-[#b8965a] after:w-full" : "after:w-0"}`}>Contact</a>
        </nav>

        {/* Action buttons */}
        <div className="flex items-center gap-4">
          {/* <a
            href="/admin"
            className={`px-4 py-2 border rounded-full text-xs font-bold transition-all ${
              isScrolled 
                ? "border-black text-black hover:bg-black hover:text-white" 
                : "border-[#eaddc7] text-[#57534e] hover:border-[#b8965a] hover:bg-[#b8965a]/5"
            }`}
          >
            Admin Control
          </a> */}
          <a
            href="/contact"
            className={`hidden sm:inline-flex px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider active:scale-[0.98] transition-all ${isScrolled
                ? "bg-black text-white hover:bg-stone-900 shadow-md shadow-black/10"
                : "bg-[#b8965a] hover:bg-[#a08048] text-white shadow-md shadow-[#b8965a]/20 hover:shadow-[#b8965a]/30"
              }`}
          >
            Get a Quote
          </a>
        </div>
      </div>
    </header>
  );
}
