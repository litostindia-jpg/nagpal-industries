"use client";

import { useState, useEffect } from "react";

export default function Products() {
  const [bgImage, setBgImage] = useState("");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Enquiry Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [enquiryProduct, setEnquiryProduct] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [loading, setLoading] = useState(true);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [settingsRes, catsRes, prodsRes] = await Promise.all([
          fetch(`${apiBaseUrl}/site-settings`).catch(() => null),
          fetch(`${apiBaseUrl}/categories`).catch(() => null),
          fetch(`${apiBaseUrl}/products`).catch(() => null)
        ]);

        if (settingsRes && settingsRes.ok) {
          const settings = await settingsRes.json();
          if (settings.bg_products_section) setBgImage(settings.bg_products_section);
        }
        if (catsRes && catsRes.ok) setCategories(await catsRes.json());
        if (prodsRes && prodsRes.ok) setProducts(await prodsRes.json());
      } catch (err) {
        console.warn("Failed to load catalog data.", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [apiBaseUrl]);

  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "").substring(0, 100) + "...";
  };

  const filteredProducts = selectedCategory === "all"
    ? products
    : products.filter(prod => prod.category?.slug === selectedCategory);

  const sectionStyle = {
    backgroundColor: '#faf8f5'
  };

  const openEnquiry = (prod) => {
    setEnquiryProduct(prod);
    setIsModalOpen(true);
    setSubmitSuccess(false);
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  const handleEnquirySubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
      }, 2000);
    }, 1000);
  };

  return (
    <>
      <section id="products" className="py-24 relative" style={sectionStyle}>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          <div className="text-center mb-16 space-y-2">
            <span className="text-xs font-bold uppercase text-[#b8965a] tracking-wider">Catalog</span>
            <h3 className="text-3xl font-extrabold tracking-tight text-[#1c1917]">OUR PRODUCTS</h3>

            <div className="w-20 h-1.5 bg-[#b8965a] mx-auto rounded-full"></div>
            <p className="mt-6 text-sm max-w-2xl mx-auto text-[#57534e]">
              Discover our premium range of highly realistic and durable machinery designed for maximum operational speed and export performance.
            </p>
          </div>

          {/* Category Tabs */}
          {categories.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                  selectedCategory === "all"
                    ? "bg-[#b8965a] text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                All Products
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                    selectedCategory === cat.slug
                      ? "bg-[#b8965a] text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                className="rounded-2xl border border-[#eaddc7]/40 bg-white overflow-hidden hover:shadow-lg hover:shadow-black/5 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="h-48 w-full relative overflow-hidden bg-[#faf8f5] border-b border-[#eaddc7]/30">
                    {prod.images && prod.images.length > 0 ? (
                      <img
                        src={prod.images[0]}
                        alt={prod.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-semibold text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="p-5 space-y-2">
                    {prod.category && (
                      <span className="text-[8px] font-bold text-[#b8965a] uppercase tracking-wider bg-[#b8965a]/10 border border-[#b8965a]/15 px-2 py-0.5 rounded-full inline-block">
                        {prod.category.name}
                      </span>
                    )}
                    <h4 className="text-base font-extrabold text-[#1c1917] line-clamp-1">{prod.title}</h4>
                    <p className="text-xs text-[#57534e] leading-relaxed font-medium line-clamp-3">{stripHtml(prod.description)}</p>
                  </div>
                </div>
                <div className="p-5 pt-0 mt-auto flex gap-3">
                  <button
                    onClick={() => openEnquiry(prod)}
                    className="flex-1 py-2.5 px-3 border border-[#b8965a] text-[#b8965a] hover:bg-[#b8965a] hover:text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition-colors"
                  >
                    Enquiry
                  </button>
                  <a
                    href={`/products/${prod.slug}`}
                    className="flex-1 py-2.5 px-3 bg-[#1c1917] hover:bg-black text-white text-[10px] font-bold uppercase tracking-wider rounded-xl text-center transition-colors"
                  >
                    View Details
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enquiry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900">Product Enquiry</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="h-8 w-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 transition-colors"
              >
                &times;
              </button>
            </div>
            
            <div className="p-6">
              {submitSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Enquiry Sent!</h4>
                  <p className="text-sm text-gray-500">We will get back to you shortly regarding {enquiryProduct?.title}.</p>
                </div>
              ) : (
                <form onSubmit={handleEnquirySubmit} className="space-y-4">
                  <div className="bg-gray-50 p-3 rounded-xl mb-4 border border-gray-100">
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Enquiring about</p>
                    <p className="text-sm font-semibold text-gray-900 line-clamp-1">{enquiryProduct?.title}</p>
                  </div>
                  
                  <div>
                    <input type="text" required placeholder="Your Name" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div>
                    <input type="email" required placeholder="Email Address" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div>
                    <input type="tel" required placeholder="Phone Number" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                  <div>
                    <textarea required placeholder="Message" rows="3" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all resize-none" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}></textarea>
                  </div>
                  
                  <button type="submit" disabled={isSubmitting} className="w-full bg-[#b8965a] hover:bg-[#a08048] text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-70 mt-2">
                    {isSubmitting ? "Sending..." : "Submit Enquiry"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
