"use client";

import { useState, useEffect } from "react";

export default function Testimonials() {
  const [bgTestimonials, setBgTestimonials] = useState("");
  const [testimonials, setTestimonials] = useState([]);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  const fallbackTestimonials = [
    {
      quote: "NATRAJA machinery humare plant me 2014 se continuously heavy duty operation kar rahi hai. Durable cast frame ki wajah se 10 years me minimum maintenance rahi.",
      author: "Rakesh Kumar",
      position: "Senior Director",
      company: "Horizon Packs Group",
      rating: 5
    },
    {
      quote: "Natraja slitter scorer se corrugated boxes ki edge finishing aur cutting quality exceptional ho gayi. Material wastage nearly zero ho chuki hai.",
      author: "M. K. Al-Thani",
      position: "Technical Advisor",
      company: "Apex Container Systems (Gulf Operations)",
      rating: 5
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, aboutRes] = await Promise.all([
          fetch(`${apiBaseUrl}/site-settings`).catch(() => null),
          fetch(`${apiBaseUrl}/about/all`).catch(() => null)
        ]);

        if (settingsRes && settingsRes.ok) {
          const s = await settingsRes.json();
          if (s.bg_testimonials_section) setBgTestimonials(s.bg_testimonials_section);
        }

        if (aboutRes && aboutRes.ok) {
          const a = await aboutRes.json();
          if (a.testimonials && a.testimonials.length > 0) setTestimonials(a.testimonials);
        }
      } catch (err) {
        console.warn("Could not fetch testimonials", err);
      }
    };
    fetchData();
  }, [apiBaseUrl]);

  const activeTestimonials = testimonials.length > 0 ? testimonials : fallbackTestimonials;

  const parallaxTestimonialsStyle = bgTestimonials ? {
    backgroundImage: `url(${bgTestimonials})`,
    backgroundAttachment: 'fixed',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover'
  } : {};

  return (
    <section className="py-24 bg-zinc-50 relative" style={parallaxTestimonialsStyle}>
      {bgTestimonials && <div className="absolute inset-0 bg-zinc-50/80 z-0 pointer-events-none"></div>}
      <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase text-[#b8965a] tracking-wider">Testimonials</span>
            <h3 className="text-3xl font-extrabold tracking-tight text-[#1c1917]">Reviews from the Plant Floors</h3>
            <p className="text-xs text-[#57534e] font-medium leading-relaxed">
              See what our customers say about machine output precision, operations speed, and support response.
            </p>
          </div>
          
          <div className="relative">
            {/* Slider Container */}
            <div 
              id="testimonials-slider"
              className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 pt-4 hide-scroll-bar scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <style>{`
                .hide-scroll-bar::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              {activeTestimonials.map((review, idx) => (
                <div
                  key={idx}
                  className="snap-center shrink-0 w-[90%] md:w-[45%] lg:w-[31%] p-10 rounded-[32px] bg-white border border-zinc-100 shadow-xl shadow-zinc-200/40 relative flex flex-col justify-between transition-transform hover:-translate-y-1"
                >
                  <span className="absolute top-4 right-6 text-6xl text-[#b8965a]/10 font-serif leading-none select-none">“</span>
                  <div>
                    <div className="flex gap-1 mb-3 text-[#b8965a]">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <span key={i} className="text-xs">★</span>
                      ))}
                    </div>
                    <p className="text-xs md:text-sm italic text-[#57534e] leading-relaxed mb-6 font-medium relative z-10">
                      "{review.quote}"
                    </p>
                  </div>
                  <div className="flex items-center gap-4 border-t border-zinc-100 pt-5 mt-4">
                    <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-zinc-700 text-sm">
                      {review.author.charAt(0)}
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-zinc-900">{review.author}</h5>
                      <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
                        {review.position} &bull; {review.company}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Slider Controls */}
            {activeTestimonials.length > 1 && (
              <div className="flex justify-center gap-4 mt-2">
                <button 
                  onClick={() => {
                    document.getElementById('testimonials-slider').scrollBy({ left: -350, behavior: 'smooth' });
                  }}
                  className="w-12 h-12 rounded-full border border-zinc-200 bg-white text-zinc-600 hover:text-[#b8965a] hover:border-[#b8965a] hover:shadow-lg flex items-center justify-center transition-all focus:outline-none"
                  aria-label="Previous Testimonial"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button 
                  onClick={() => {
                    document.getElementById('testimonials-slider').scrollBy({ left: 350, behavior: 'smooth' });
                  }}
                  className="w-12 h-12 rounded-full border border-zinc-200 bg-white text-zinc-600 hover:text-[#b8965a] hover:border-[#b8965a] hover:shadow-lg flex items-center justify-center transition-all focus:outline-none"
                  aria-label="Next Testimonial"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            )}
          </div>
      </div>
    </section>
  );
}
