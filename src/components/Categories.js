"use client";

import { useState, useEffect } from "react";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/categories`);
        if (res.ok) {
          setCategories(await res.json());
        }
      } catch (err) {
        console.warn("Failed to load categories.", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [apiBaseUrl]);

  return (
    <section id="categories" className="py-24 relative bg-white">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="text-center mb-16 space-y-2">
          <span className="text-xs font-bold uppercase text-[#b8965a] tracking-wider">Explore By</span>
          <h3 className="text-3xl font-extrabold tracking-tight text-[#1c1917]">OUR CATEGORIES</h3>

          <div className="w-20 h-1.5 bg-[#b8965a] mx-auto rounded-full"></div>
          <p className="mt-6 text-sm max-w-2xl mx-auto text-[#57534e]">
            Browse our wide range of machinery categories. Click on a category to view the products inside.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-500 font-medium">Loading categories...</div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <a
                href={`/products?category=${cat.slug}`}
                key={cat.id}
                className="group rounded-2xl border border-[#eaddc7]/40 bg-[#faf8f5] overflow-hidden hover:shadow-xl hover:shadow-[#b8965a]/10 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-center items-center p-8 text-center"
              >
                <div className="w-20 h-20 mb-6 bg-white rounded-full flex items-center justify-center shadow-sm border border-[#eaddc7]/60 group-hover:bg-[#b8965a] transition-colors duration-300">
                  <svg className="w-10 h-10 text-[#b8965a] group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h4 className="text-lg font-extrabold text-[#1c1917] group-hover:text-[#b8965a] transition-colors">{cat.name}</h4>
                <p className="text-xs text-[#57534e] mt-3 font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                  View Products &rarr;
                </p>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500 font-medium">No categories found.</div>
        )}
      </div>
    </section>
  );
}
