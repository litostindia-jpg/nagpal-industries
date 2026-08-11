"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import ContactUs from "../../../components/ContactUs";

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/blogs?slug=${slug}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setBlog(data.length > 0 ? data[0] : null);
          } else {
            setBlog(data);
          }
        }
      } catch (err) {
        console.error("Failed to load blog details.", err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlog();
    }
  }, [slug]);

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

  if (!blog) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex flex-col justify-between">
        <Header />
        <div className="max-w-7xl mx-auto px-6 py-32 text-center space-y-4">
          <h2 className="text-2xl font-black text-[#1c1917]">Blog Not Found</h2>
          <p className="text-sm text-[#57534e]">The article you are looking for might have been removed or renamed.</p>
          <a href="/blogs" className="inline-block px-6 py-3 bg-[#b8965a] text-white text-xs font-bold rounded-xl uppercase tracking-wider">
            Back to Blogs
          </a>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1c1917] flex flex-col font-sans selection:bg-[#b8965a] selection:text-white">
      <Header />

      {/* Hero Banner Section */}
      <div className="relative pt-24 lg:pt-32 pb-12 bg-white border-b border-[#eaddc7]/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Title & Info */}
            <div className="space-y-6">
              {blog.category && (
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#b8965a] bg-[#b8965a]/10 px-3 py-1.5 rounded-full inline-block">
                  {blog.category.name}
                </span>
              )}
              <h1 className="text-4xl md:text-5xl lg:text-5xl font-black leading-tight text-[#1c1917] tracking-tight">
                {blog.title}
              </h1>
              {/* Fake Meta Info (Date, Author) for professional look */}
              <div className="flex items-center gap-4 text-sm font-medium text-zinc-500 pt-2">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  {new Date(blog.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </div>
                <div className="w-1 h-1 rounded-full bg-zinc-300"></div>
                <div>Nagpal Industries</div>
              </div>
            </div>
            
            {/* Banner Image */}
            {blog.image && (
              <div className="rounded-3xl overflow-hidden shadow-xl border border-zinc-100 h-[350px] lg:h-[450px]">
                <img src={`${apiBaseUrl.replace('/api', '')}${blog.image}`} alt={blog.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            )}
          </div>
        </div>
      </div>

      <main className="flex-1 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16">
            
            {/* Main Content Column (70%) */}
            <div className="lg:w-[65%]">
              <div 
                className="prose prose-zinc prose-lg max-w-none text-[#292524] bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-[#eaddc7]/30 [&_p]:mb-6 [&_h1]:text-3xl [&_h1]:font-black [&_h1]:mb-6 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-4 [&_h2]:mt-10 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-6 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-6 [&_a]:text-[#b8965a] [&_a]:underline hover:[&_a]:text-[#8a7042] [&_img]:rounded-2xl [&_img]:shadow-md [&_img]:my-8 [&_img]:border [&_img]:border-zinc-100"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </div>
            
            {/* Sticky Sidebar (30%) */}
            <aside className="lg:w-[35%]">
              <div className="sticky top-24 space-y-8">
                
                {/* Contact CTA */}
                <div className="bg-[#1c1917] p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#b8965a]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                  <h3 className="text-xl font-bold mb-3 relative z-10">Need a Corrugated Box Machine?</h3>
                  <p className="text-sm text-zinc-400 mb-6 relative z-10 leading-relaxed">
                    Get expert advice and the best quotes for high-quality packaging machinery tailored to your plant's needs.
                  </p>
                  <a href="#contact" className="block w-full text-center bg-[#b8965a] hover:bg-[#a6864e] text-white px-6 py-3.5 rounded-xl text-sm font-bold tracking-wide uppercase transition-colors relative z-10">
                    Get a Free Quote
                  </a>
                </div>
                
                {/* Related Links / Categories Widget */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#eaddc7]/30">
                  <h3 className="text-lg font-bold text-[#1c1917] mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#b8965a]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Quick Links
                  </h3>
                  <ul className="space-y-3">
                    <li><a href="/products" className="text-zinc-600 hover:text-[#b8965a] font-medium text-sm flex items-center justify-between group">Our Products <span className="transform group-hover:translate-x-1 transition-transform">→</span></a></li>
                    <li><a href="/about" className="text-zinc-600 hover:text-[#b8965a] font-medium text-sm flex items-center justify-between group">About Us <span className="transform group-hover:translate-x-1 transition-transform">→</span></a></li>
                    <li><a href="/contact" className="text-zinc-600 hover:text-[#b8965a] font-medium text-sm flex items-center justify-between group">Contact Us <span className="transform group-hover:translate-x-1 transition-transform">→</span></a></li>
                  </ul>
                </div>

              </div>
            </aside>
            
          </div>
        </div>
      </main>

      {/* Main Contact Form Section */}
      <div className="bg-[#faf8f5]">
        <ContactUs />
      </div>

      <Footer />
    </div>
  );
}
