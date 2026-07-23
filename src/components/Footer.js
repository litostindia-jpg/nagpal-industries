"use client";

import { useState, useEffect } from "react";

export default function Footer() {
  const [logoExists, setLogoExists] = useState(true);
  const [bgImage, setBgImage] = useState("");
  const [socials, setSocials] = useState({
    facebook: "",
    instagram: "",
    linkedin: "",
    youtube: "",
  });
  const [products, setProducts] = useState([]);
  const [catalogs, setCatalogs] = useState([]);
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [googleMapIframe, setGoogleMapIframe] = useState("");
  const [logoUrl, setLogoUrl] = useState("/logo.png");
  const [bgImageMobile, setBgImageMobile] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const [settingsRes, productsRes, catalogsRes] = await Promise.all([
          fetch(`${apiBaseUrl}/site-settings`),
          fetch(`${apiBaseUrl}/products`),
          fetch(`${apiBaseUrl}/catalogs`)
        ]);

        if (settingsRes.ok) {
          const data = await settingsRes.json();
          setSocials({
            facebook: data.social_facebook || "",
            instagram: data.social_instagram || "",
            linkedin: data.social_linkedin || "",
            youtube: data.social_youtube || "",
          });
          if (data.social_youtube) setSocials(prev => ({ ...prev, youtube: data.social_youtube }));
          if (data.site_logo) setLogoUrl(data.site_logo);
          if (data.company_address) setCompanyAddress(data.company_address);
          if (data.company_phone) setCompanyPhone(data.company_phone);
          if (data.company_email) setCompanyEmail(data.company_email);
          if (data.google_map_iframe) setGoogleMapIframe(data.google_map_iframe);
        }

        if (productsRes.ok) {
          const prods = await productsRes.json();
          setProducts(prods.slice(0, 5)); // Take top 5 products for footer
        }

        if (catalogsRes.ok) {
          const cats = await catalogsRes.json();
          setCatalogs(cats.slice(0, 5)); // Take top 5 catalogs for footer
        }
      } catch (err) {
        console.warn("Could not load footer data.", err);
      }
    };
    fetchFooterData();

    // Check resize for mobile swapping
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const activeBg = isMobile && bgImageMobile ? bgImageMobile : bgImage;

  const footerStyle = bgImage ? {
    backgroundImage: `url('${activeBg}')`,
    backgroundAttachment: 'local', // Fixed the zoom issue on high-res monitors
    backgroundPosition: 'top center',
    backgroundRepeat: 'repeat',
    backgroundSize: 'auto'
  } : {};

  return (
    <footer className="bg-[#faf8f5] pb-12 relative" style={footerStyle}>

      {/* Curved Shape Divider */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0]">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[50px] md:h-[80px]">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-[#0a0a0a]"></path>
        </svg>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 text-sm relative z-10 pt-20 md:pt-28">

        {/* Col 1: Branding */}
        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-2">
            {logoExists ? (
              <img
                src={logoUrl}
                alt="Logo"
                className="h-16 md:h-20 w-auto object-contain"
                onError={() => setLogoExists(false)}
              />
            ) : (
              <span className="font-extrabold text-[#b8965a] text-xl">NAGPAL INDUSTRIES</span>
            )}
          </div>
          <p className="text-[15px] font-semibold text-[#1c1917] leading-relaxed drop-shadow-sm">
            Your trusted partner for premium corrugated board machinery and plant systems across India. Engineering Power. Building Reliability.
          </p>
          <div className="flex items-center gap-4 pt-2">
            {socials.facebook && (
              <a href={socials.facebook} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-[#1c1917]/5 flex items-center justify-center text-[#1c1917] hover:bg-[#b8965a] hover:text-white transition-all shadow-sm border border-[#1c1917]/10 hover:border-transparent">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
              </a>
            )}
            {socials.instagram && (
              <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-[#1c1917]/5 flex items-center justify-center text-[#1c1917] hover:bg-[#b8965a] hover:text-white transition-all shadow-sm border border-[#1c1917]/10 hover:border-transparent">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
              </a>
            )}
            {socials.linkedin && (
              <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-[#1c1917]/5 flex items-center justify-center text-[#1c1917] hover:bg-[#b8965a] hover:text-white transition-all shadow-sm border border-[#1c1917]/10 hover:border-transparent">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" /></svg>
              </a>
            )}
            {socials.youtube && (
              <a href={socials.youtube} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-[#1c1917]/5 flex items-center justify-center text-[#1c1917] hover:bg-[#b8965a] hover:text-white transition-all shadow-sm border border-[#1c1917]/10 hover:border-transparent">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.498 5.814a3.016 3.016 0 0 0 2.122 2.136C4.495 20.5 12 20.5 12 20.5s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
              </a>
            )}
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div className="space-y-5 lg:pl-6">
          <h4 className="font-extrabold text-[19px] text-[#1c1917] tracking-wide">Quick Links</h4>
          <ul className="space-y-3.5 text-base font-medium text-[#1c1917]">
            <li><a href="/" className="hover:text-[#b8965a] transition-colors drop-shadow-sm">Home</a></li>
            <li><a href="/about" className="hover:text-[#b8965a] transition-colors drop-shadow-sm">About Us</a></li>
            <li><a href="/products" className="hover:text-[#b8965a] transition-colors drop-shadow-sm">Our Projects</a></li>
            <li><a href="/blogs" className="hover:text-[#b8965a] transition-colors drop-shadow-sm">Blogs</a></li>
            <li><a href="/contact" className="hover:text-[#b8965a] transition-colors drop-shadow-sm">Contact Us</a></li>
          </ul>
        </div>

        {/* Col 3: About Us */}
        <div className="space-y-5">
          <h4 className="font-extrabold text-[19px] text-[#1c1917] tracking-wide">About Us</h4>
          <ul className="space-y-3.5 text-base font-medium text-[#1c1917]">
            <li><a href="/about" className="hover:text-[#b8965a] transition-colors drop-shadow-sm">About Overview</a></li>
            <li><a href="/about#why-choose-us" className="hover:text-[#b8965a] transition-colors drop-shadow-sm">Why Choose Us</a></li>
            <li><a href="/#testimonials" className="hover:text-[#b8965a] transition-colors drop-shadow-sm">Testimonials</a></li>
            <li><a href="/about#client-reviews" className="hover:text-[#b8965a] transition-colors drop-shadow-sm">Client Reviews</a></li>
          </ul>
        </div>

        {/* Col 4: Our Services / Machinery */}
        <div className="space-y-5">
          <h4 className="font-extrabold text-[19px] text-[#1c1917] tracking-wide">Our Products</h4>
          <ul className="space-y-3.5 text-base font-medium text-[#1c1917]">
            {products.length > 0 ? (
              products.map((prod, idx) => (
                <li key={idx}><a href={`/products/${prod.slug}`} className="hover:text-[#b8965a] transition-colors drop-shadow-sm">{prod.title}</a></li>
              ))
            ) : (
              <li><a href="/products" className="hover:text-[#b8965a] transition-colors drop-shadow-sm">View All Machinery</a></li>
            )}
          </ul>
        </div>

        {/* Col 5: Corporate Office */}
        <div className="space-y-5">
          <h4 className="font-extrabold text-[19px] text-[#1c1917] tracking-wide flex items-center gap-2 uppercase">
            <svg className="w-5 h-5 text-[#b8965a]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            Corporate Office
          </h4>
          <div className="flex flex-col gap-3">
            {companyAddress && (
              <p className="text-[14px] font-bold text-[#44403c] whitespace-pre-line leading-relaxed drop-shadow-sm">
                {companyAddress}
              </p>
            )}
            <a href="/contact" className="text-[13px] font-extrabold text-[#1c1917] flex items-center gap-1.5 hover:text-[#b8965a] transition-colors">
              <svg className="w-4 h-4 text-[#b8965a]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              View on Map
            </a>
            {googleMapIframe && (
              <div
                className="w-full h-36 mt-2 rounded-xl overflow-hidden border-2 border-white shadow-lg [&>iframe]:w-full [&>iframe]:h-full"
                dangerouslySetInnerHTML={{ __html: googleMapIframe }}
              />
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 border-t border-[#eaddc7]/60 mt-16 pt-6 pb-6 flex flex-col items-center justify-center text-sm font-bold text-[#1c1917] relative z-10 drop-shadow-sm">
        <p>&copy; {new Date().getFullYear()} Nagpal Industries. All Rights Reserved.</p>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-50">
        <a href={`tel:${companyPhone || '+919999988888'}`} className="w-14 h-14 bg-[#3B82F6] rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
        </a>
        <a href={`https://wa.me/${companyPhone?.replace(/[^0-9]/g, '') || '919999988888'}`} target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform">
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
        </a>
        <a href={`mailto:${companyEmail || 'info@nagpalindustries.com'}`} className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-[#EA4335] shadow-xl border border-gray-100 hover:scale-110 transition-transform">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>
        </a>
      </div>
    </footer>
  );
}
