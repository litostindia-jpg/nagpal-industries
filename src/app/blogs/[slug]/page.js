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
          setBlog(data);
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

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6 space-y-8">
          
          <div className="space-y-4 text-center">
            {blog.category && (
              <span className="text-xs font-bold uppercase text-[#b8965a] tracking-wider bg-[#b8965a]/10 px-3 py-1.5 rounded-full inline-block">
                {blog.category.name}
              </span>
            )}
            <h1 className="text-4xl md:text-5xl font-black leading-tight text-[#1c1917]">
              {blog.title}
            </h1>
          </div>

          {blog.image && (
            <div className="rounded-3xl overflow-hidden shadow-lg border border-[#eaddc7]/30">
              <img src={`http://localhost:8000${blog.image}`} alt={blog.title} className="w-full h-auto object-cover" />
            </div>
          )}

          <div 
            className="prose prose-zinc max-w-none text-[#292524] bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-[#eaddc7]/30 [&_p]:mb-4 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_a]:text-[#b8965a] [&_a]:underline"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

        </div>
      </main>

      <div className="border-t border-[#eaddc7]/30 bg-[#faf8f5]">
        <ContactUs />
      </div>

      <Footer />
    </div>
  );
}
