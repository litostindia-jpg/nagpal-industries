"use client";

import { useState, useEffect, Suspense } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ContactUs from "../../components/ContactUs";

function CatalogsContent() {
  const [catalogs, setCatalogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/catalogs`);
        if (res.ok) {
          setCatalogs(await res.json());
        }
      } catch (err) {
        console.error("Failed to load catalogs data.", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalogs();
  }, [apiBaseUrl]);

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1c1917] flex flex-col font-sans selection:bg-[#b8965a] selection:text-white">
      <Header />
      
      {/* Banner */}
      <div className="pt-32 pb-16 bg-white border-b border-[#eaddc7]/30 text-center px-6">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-[#1c1917]">Our Catalogs</h1>
        <p className="mt-4 text-sm text-[#57534e] max-w-2xl mx-auto font-medium">
          View and download our latest machinery brochures, product specifications, and company catalogs.
        </p>
      </div>

      <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(n => (
              <div key={n} className="bg-white rounded-2xl h-48 animate-pulse border border-[#eaddc7]/30"></div>
            ))}
          </div>
        ) : catalogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {catalogs.map(catalog => (
              <a
                key={catalog.id}
                href={catalog.file_path}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-2xl border border-[#eaddc7]/50 p-8 shadow-sm hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center text-center space-y-4 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#faf8f5] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                
                <div className="w-16 h-16 bg-[#b8965a]/10 text-[#b8965a] rounded-full flex items-center justify-center relative z-10 group-hover:scale-110 group-hover:bg-[#b8965a] group-hover:text-white transition-all duration-300">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                
                <h3 className="text-xl font-black text-[#1c1917] relative z-10 group-hover:text-[#b8965a] transition-colors">{catalog.title}</h3>
                
                <span className="inline-flex items-center gap-2 text-xs font-bold text-[#57534e] uppercase tracking-wider relative z-10 group-hover:text-[#b8965a] transition-colors">
                  View PDF
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </a>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#eaddc7]/50 py-24 text-center space-y-4 shadow-sm max-w-2xl mx-auto">
            <svg className="w-16 h-16 text-[#eaddc7] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-black text-[#1c1917]">No Catalogs Available</h3>
            <p className="text-sm text-[#57534e]">Check back later for new brochures and catalogs.</p>
          </div>
        )}
      </div>

      <ContactUs />
      <Footer />
    </div>
  );
}

export default function CatalogsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#faf8f5]"></div>}>
      <CatalogsContent />
    </Suspense>
  );
}
