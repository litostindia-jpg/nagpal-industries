"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ContactUs from "../../components/ContactUs";

function ProductsContent() {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category");

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory || "all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, prodsRes] = await Promise.all([
          fetch(`${apiBaseUrl}/categories`).catch(() => null),
          fetch(`${apiBaseUrl}/products`).catch(() => null)
        ]);
        if (catsRes && catsRes.ok) setCategories(await catsRes.json());
        if (prodsRes && prodsRes.ok) setProducts(await prodsRes.json());
      } catch (err) {
        console.error("Failed to load catalog data.", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [apiBaseUrl]);

  // Sync state with URL parameter if it changes
  useEffect(() => {
    if (urlCategory) {
      setSelectedCategory(urlCategory);
    }
  }, [urlCategory]);

  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "").substring(0, 80) + "...";
  };

  const filteredProducts = products.filter(prod => {
    const matchesCategory = selectedCategory === "all" || prod.category?.slug === selectedCategory;
    const matchesSearch = prod.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryCount = (slug) => {
    return products.filter(p => p.category?.slug === slug).length;
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1c1917] flex flex-col font-sans selection:bg-[#b8965a] selection:text-white">
      <Header />
      
      {/* Banner */}
      <div className="pt-32 pb-16 bg-white border-b border-[#eaddc7]/30 text-center px-6">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-[#1c1917]">Our Product Lines</h1>
        <p className="mt-4 text-sm text-[#57534e] max-w-2xl mx-auto font-medium">
          Explore our complete catalog of industrial corrugation machinery, featuring advanced technology, high-speed performance, and unparalleled durability.
        </p>
      </div>

      <div className="flex-1 max-w-[1400px] w-full mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-4 gap-12">
        
        {/* Sidebar Filters */}
        <aside className="lg:col-span-1 space-y-8">
          {/* Search Box */}
          <div className="bg-white rounded-2xl p-6 border border-[#eaddc7]/50 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-[#1c1917]">Search Catalog</h3>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search machinery..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#faf8f5] border border-[#eaddc7] rounded-xl px-4 py-3 pl-10 text-xs focus:outline-none focus:border-[#b8965a] transition-colors"
              />
              <svg className="w-4 h-4 text-[#57534e] absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Categories List */}
          <div className="bg-white rounded-2xl p-6 border border-[#eaddc7]/50 shadow-sm space-y-4 lg:sticky lg:top-32">
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-[#1c1917] border-b border-[#eaddc7]/40 pb-3">Categories</h3>
            
            {loading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            ) : (
              <ul className="space-y-1">
                <li>
                  <button 
                    onClick={() => setSelectedCategory("all")}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold transition-all flex justify-between items-center ${selectedCategory === "all" ? "bg-[#b8965a] text-white shadow-md shadow-[#b8965a]/20" : "text-[#57534e] hover:bg-[#faf8f5] hover:text-[#b8965a]"}`}
                  >
                    <span>All Products</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${selectedCategory === "all" ? "bg-white/20" : "bg-[#eaddc7]/30"}`}>{products.length}</span>
                  </button>
                </li>
                {categories.map(cat => {
                  const count = getCategoryCount(cat.slug);
                  if (count === 0) return null;
                  return (
                    <li key={cat.id}>
                      <button 
                        onClick={() => setSelectedCategory(cat.slug)}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold transition-all flex justify-between items-center ${selectedCategory === cat.slug ? "bg-[#b8965a] text-white shadow-md shadow-[#b8965a]/20" : "text-[#57534e] hover:bg-[#faf8f5] hover:text-[#b8965a]"}`}
                      >
                        <span className="capitalize">{cat.name}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${selectedCategory === cat.slug ? "bg-white/20" : "bg-[#eaddc7]/30"}`}>{count}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </aside>

        {/* Main Grid */}
        <div className="lg:col-span-3 space-y-6">
          
          <div className="flex justify-between items-center bg-white px-6 py-4 rounded-2xl border border-[#eaddc7]/50 shadow-sm">
            <h2 className="text-sm font-bold text-[#1c1917]">
              {loading ? "Loading products..." : `Showing ${filteredProducts.length} result${filteredProducts.length !== 1 ? 's' : ''}`}
              {selectedCategory !== "all" && !loading && (
                <span className="text-[#57534e] font-medium ml-2">
                  in <span className="text-[#b8965a] capitalize">{categories.find(c => c.slug === selectedCategory)?.name || selectedCategory}</span>
                </span>
              )}
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="bg-white rounded-2xl h-80 animate-pulse border border-[#eaddc7]/30"></div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map(prod => (
                <div
                  key={prod.id}
                  className="rounded-2xl border border-[#eaddc7]/40 bg-white overflow-hidden hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                >
                  <a href={`/products/${prod.slug}`} className="block relative">
                    <div className="h-56 w-full relative overflow-hidden bg-[#faf8f5] border-b border-[#eaddc7]/30">
                      {prod.images && prod.images.length > 0 ? (
                        <img
                          src={prod.images[0]}
                          alt={prod.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-semibold text-gray-400">
                          No Image
                        </div>
                      )}
                      
                      {/* Overlay View button */}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="bg-white/90 backdrop-blur-sm text-[#1c1917] text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">View Details</span>
                      </div>
                    </div>
                    
                    <div className="p-6 space-y-3">
                      {prod.category && (
                        <span className="text-[9px] font-black text-[#b8965a] uppercase tracking-widest bg-[#b8965a]/10 border border-[#b8965a]/15 px-2.5 py-1 rounded-full inline-block">
                          {prod.category.name}
                        </span>
                      )}
                      <h4 className="text-lg font-black text-[#1c1917] leading-tight line-clamp-2 group-hover:text-[#b8965a] transition-colors">{prod.title}</h4>
                      <p className="text-xs text-[#57534e] leading-relaxed font-medium line-clamp-2">{stripHtml(prod.description)}</p>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#eaddc7]/50 py-24 text-center space-y-4 shadow-sm">
              <svg className="w-16 h-16 text-[#eaddc7] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="text-lg font-bold text-[#1c1917]">No products found</h3>
              <p className="text-sm text-[#57534e]">Try adjusting your search query or selecting a different category.</p>
              <button 
                onClick={() => {setSearchQuery(""); setSelectedCategory("all");}}
                className="mt-4 px-6 py-2.5 bg-[#b8965a] text-white text-xs font-bold rounded-lg hover:bg-[#a08048] transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}

        </div>
      </div>

      <ContactUs />
      <Footer />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#faf8f5]"></div>}>
      <ProductsContent />
    </Suspense>
  );
}
