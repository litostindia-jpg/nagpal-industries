"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import Products from "../../../components/Products";

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Inquiry form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/products?slug=${slug}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
          // Pre-fill inquiry form message
          setMessage(`Hi, I am interested in your "${data.title}". Please send me the price quote, technical specifications, and delivery terms.`);
        }
      } catch (err) {
        console.error("Failed to load product details.", err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate sending inquiry form
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setName("");
      setEmail("");
      setPhone("");
    }, 1200);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-[#b8965a]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex flex-col justify-between">
        <Header />
        <div className="max-w-7xl mx-auto px-6 py-32 text-center space-y-4">
          <h2 className="text-2xl font-black text-[#1c1917]">Product Not Found</h2>
          <p className="text-sm text-[#57534e]">The machine you are looking for might have been removed or renamed.</p>
          <a href="/products" className="inline-block px-6 py-3 bg-[#b8965a] text-white text-xs font-bold rounded-xl uppercase tracking-wider">
            Back to Machinery catalog
          </a>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1c1917] flex flex-col font-sans selection:bg-[#b8965a] selection:text-white">
      <Header />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Images Slider and Details Column */}
          <div className="lg:col-span-7 space-y-8">
            {/* Main Image View */}
            <div className="rounded-3xl overflow-hidden border border-[#eaddc7]/50 bg-white p-2 shadow-sm">
              <div className="h-[300px] md:h-[450px] rounded-2xl overflow-hidden bg-zinc-50 relative">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[activeImageIdx]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-zinc-400">No Image Uploaded</div>
                )}
              </div>
            </div>

            {/* Thumbnail Navigation */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`h-20 w-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      activeImageIdx === idx ? "border-[#b8965a]" : "border-[#eaddc7]/40 hover:border-[#b8965a]/50"
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Title & Category Box (Moved to Left Side) */}
            <div className="rounded-3xl border border-[#eaddc7]/50 bg-white p-6 md:p-8 space-y-4 shadow-sm">
              <span className="text-xs font-bold uppercase text-[#b8965a] tracking-wider block">
                {product.category?.name || "Machinery"}
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-[#1c1917] leading-tight">
                {product.title}
              </h1>
              
              {/* Specs points */}
              {product.details && product.details.length > 0 && (
                <div className="pt-4 border-t border-[#eaddc7]/30 space-y-6">
                  {product.details[0]?.heading !== undefined ? (
                    // New Nested Format
                    product.details.map((group, groupIdx) => (
                      <div key={groupIdx} className="space-y-3">
                        {group.heading && (
                          <h4 className="text-sm font-extrabold text-[#1c1917] bg-zinc-100 px-3 py-2 rounded-lg">
                            {group.heading}
                          </h4>
                        )}
                        <div className="space-y-2 px-1">
                          {group.items && group.items.map((detail, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm py-1 border-b border-zinc-50">
                              <span className="text-[#57534e] font-semibold">{detail.key}</span>
                              <span className="text-[#1c1917] font-bold font-mono text-right pl-4">{detail.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    // Old Flat Format Fallback
                    <div className="space-y-2">
                      {product.details.map((detail, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm py-1 border-b border-zinc-50">
                          <span className="text-[#57534e] font-semibold">{detail.key}</span>
                          <span className="text-[#1c1917] font-bold font-mono text-right pl-4">{detail.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Description Text */}
            <div className="rounded-3xl border border-[#eaddc7]/50 bg-white p-8 space-y-4 shadow-sm">
              <h3 className="text-lg font-extrabold text-[#1c1917] uppercase tracking-wider pb-3 border-b border-[#eaddc7]/30">
                Detailed Specifications
              </h3>
              <div 
                className="text-sm text-[#292524] leading-relaxed break-words overflow-hidden w-full [&_p]:mb-4 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_a]:text-[#b8965a] [&_a]:underline"
                dangerouslySetInnerHTML={{ __html: product.description || "<p>No description provided.</p>" }}
              />
            </div>

            {/* Video Player */}
            {product.video && (
              <div className="rounded-3xl border border-[#eaddc7]/50 bg-white p-8 space-y-4 shadow-sm">
                <h3 className="text-lg font-extrabold text-[#1c1917] uppercase tracking-wider pb-3 border-b border-[#eaddc7]/30">
                  Demo &amp; Working Video
                </h3>
                <div className="rounded-2xl overflow-hidden border border-[#eaddc7]/40 shadow-sm bg-black aspect-video">
                  <video controls className="w-full h-full">
                    <source src={product.video} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Info Column */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-28">
            <div className="rounded-3xl border border-[#eaddc7]/50 bg-[#faf8f5] p-8 space-y-6 shadow-sm">
              <div>
                <h3 className="text-lg font-bold text-[#1c1917]">Request Price Quote</h3>
                <p className="text-xs text-[#57534e] mt-1">Get immediate pricing and machine blueprints.</p>
              </div>

              {submitted ? (
                <div className="text-center py-6 space-y-3">
                  <div className="h-10 w-10 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 mx-auto">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-sm">Quote Requested Successfully</h4>
                  <p className="text-[11px] text-zinc-500 leading-relaxed">
                    Thank you. We have received your query for the "{product.title}". Our team will contact you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  <div>
                    <label className="block text-[9px] text-[#57534e] font-bold uppercase tracking-wider mb-1.5">Your Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full bg-white border border-[#eaddc7] rounded-xl px-4 py-3 text-[#1c1917] text-xs focus:outline-none focus:border-[#b8965a] transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] text-[#57534e] font-bold uppercase tracking-wider mb-1.5">Corporate Email</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@company.com"
                        className="w-full bg-white border border-[#eaddc7] rounded-xl px-4 py-3 text-[#1c1917] text-xs focus:outline-none focus:border-[#b8965a] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-[#57534e] font-bold uppercase tracking-wider mb-1.5">Phone Number</label>
                      <input
                        type="text"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91..."
                        className="w-full bg-white border border-[#eaddc7] rounded-xl px-4 py-3 text-[#1c1917] text-xs focus:outline-none focus:border-[#b8965a] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] text-[#57534e] font-bold uppercase tracking-wider mb-1.5">Inquiry Details</label>
                    <textarea
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      className="w-full bg-white border border-[#eaddc7] rounded-xl px-4 py-3 text-[#1c1917] text-xs focus:outline-none focus:border-[#b8965a] transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#b8965a] hover:bg-[#a08048] text-white text-xs font-bold py-3.5 rounded-xl uppercase tracking-wider transition-all disabled:opacity-50"
                  >
                    {submitting ? "Sending Query..." : "Submit Inquiry"}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </main>

      <div className="border-t border-[#eaddc7]/30 bg-[#faf8f5]">
        <Products />
      </div>

      <Footer />
    </div>
  );
}
