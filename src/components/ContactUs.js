"use client";

import { useState, useEffect, useRef } from "react";

export default function ContactUs() {
  const [queryForm, setQueryForm] = useState({ name: "", email: "", phone: "", machine: "", message: "" });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submittingForm, setSubmittingForm] = useState(false);
  const [bgImage, setBgImage] = useState("");

  const [googleMapIframe, setGoogleMapIframe] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [contactEmails, setContactEmails] = useState([]);
  const [contactPhones, setContactPhones] = useState([]);

  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  // Fallback to ensure visibility even if observer fails
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
        const res = await fetch(`${apiBaseUrl}/site-settings`);
        if (res.ok) {
          const data = await res.json();
          if (data.google_map_iframe) setGoogleMapIframe(data.google_map_iframe);
          if (data.company_address) setCompanyAddress(data.company_address);
          setContactEmails(data.contact_email ? data.contact_email.split(",") : []);
          setContactPhones(data.contact_phone ? data.contact_phone.split(",") : []);
        }
      } catch (err) { }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmittingForm(true);

    setTimeout(() => {
      setSubmittingForm(false);
      setFormSubmitted(true);
      setQueryForm({ name: "", email: "", phone: "", machine: "", message: "" });
    }, 1200);
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="bg-[#0a0a0a] pt-20 pb-8 relative overflow-hidden"
    >
      <style>{`
        @keyframes nc-fade-up {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes nc-fade-left {
          from { opacity: 0; transform: translateX(-24px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes nc-fade-right {
          from { opacity: 0; transform: translateX(24px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes nc-flute-scroll {
          from { background-position-x: 0; }
          to { background-position-x: 160px; }
        }
        @keyframes nc-draw-check {
          from { stroke-dashoffset: 40; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes nc-pop {
          0% { transform: scale(0.6); opacity: 0; }
          60% { transform: scale(1.08); opacity: 1; }
          100% { transform: scale(1); }
        }
        @keyframes nc-spin {
          to { transform: rotate(360deg); }
        }
        .nc-reveal {
          opacity: 0;
        }
        .nc-reveal.nc-in {
          animation: nc-fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .nc-reveal-left.nc-in {
          animation: nc-fade-left 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .nc-reveal-right.nc-in {
          animation: nc-fade-right 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .nc-flute {
          background-image: repeating-linear-gradient(
            90deg,
            #b8965a 0px,
            #b8965a 2px,
            transparent 2px,
            transparent 18px
          );
          background-size: 160px 100%;
          animation: nc-flute-scroll 6s linear infinite;
        }
        .nc-submit-btn {
          position: relative;
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.3s ease;
        }
        .nc-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px -8px rgba(184, 150, 90, 0.45);
        }
        .nc-submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }
        .nc-spinner {
          animation: nc-spin 0.8s linear infinite;
        }
        .nc-check-circle {
          animation: nc-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .nc-check-path {
          stroke-dasharray: 40;
          stroke-dashoffset: 40;
          animation: nc-draw-check 0.5s 0.25s ease forwards;
        }
        .nc-map-container iframe {
          width: 100% !important;
          height: 100% !important;
          border: none !important;
        }
        @media (prefers-reduced-motion: reduce) {
          .nc-reveal, .nc-reveal-left, .nc-reveal-right, .nc-flute, .nc-spinner, .nc-check-circle, .nc-check-path {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      <div className="max-w-[1400px] mx-auto px-6 relative z-10 w-full">
        {/* Top Heading */}
        <div className={`text-center max-w-2xl mx-auto mb-12 nc-reveal ${visible ? "nc-in" : ""}`}>
          <span className="text-[11px] font-bold uppercase text-zinc-400 tracking-wider">Contact Us</span>
          <h2 className="text-3xl lg:text-[40px] font-bold text-white mt-3 mb-4 leading-tight tracking-tight">
            Get in Touch with Us
          </h2>
          <p className="text-[15px] text-zinc-400 leading-relaxed">
            We're here to help. Whether you're interested in learning more about our machinery or need support, we're happy to assist you.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Left Column: Info & Small Map */}
          <div className={`lg:w-[45%] flex-shrink-0 nc-reveal nc-reveal-left ${visible ? "nc-in" : ""}`}>

            <div className="pt-4 space-y-6">
              {contactPhones.length > 0 && (
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="text-zinc-200 font-medium flex flex-col justify-center min-h-[3rem] text-[15px]">
                    {contactPhones.map((phone, idx) => (
                      <div key={idx} className="leading-relaxed">{phone.trim()}</div>
                    ))}
                  </div>
                </div>
              )}
              
              {contactEmails.length > 0 && (
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-zinc-200 font-medium flex flex-col justify-center min-h-[3rem] text-[15px]">
                    {contactEmails.map((email, idx) => (
                      <div key={idx} className="leading-relaxed">{email.trim()}</div>
                    ))}
                  </div>
                </div>
              )}

              {companyAddress && (
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="text-zinc-200 font-medium flex flex-col justify-center min-h-[3rem] text-[15px] whitespace-pre-line">
                    {companyAddress}
                  </div>
                </div>
              )}
            </div>

            {/* Small Map */}
            {googleMapIframe && (
              <div className="mt-10 w-full h-64 rounded-3xl overflow-hidden relative border border-white/10 nc-map-container shadow-2xl">
                <div dangerouslySetInnerHTML={{ __html: googleMapIframe }} className="absolute inset-0 w-full h-full" />
              </div>
            )}
          </div>

          {/* Right Column: Form */}
          <div className={`lg:w-[55%] nc-reveal nc-reveal-right ${visible ? "nc-in" : ""}`}>
            {formSubmitted ? (
              <div className="flex flex-col items-center justify-center text-center space-y-5 py-12 bg-white/5 border border-white/10 rounded-3xl h-full">
              <div className="h-16 w-16 rounded-full bg-[#1c2921] border border-[#2d4033] flex items-center justify-center text-[#4ade80] mx-auto nc-check-circle">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path className="nc-check-path" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white">Query Received Successfully</h3>
              <p className="text-[15px] text-zinc-400 max-w-sm mx-auto">
                Thank you for reaching out. Our engineering sales team will review your requirements and get back to you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[13px] text-zinc-300">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={queryForm.name}
                    onChange={(e) => setQueryForm({ ...queryForm, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full bg-[#1e1e1e] border border-white/10 rounded-full px-5 py-3.5 text-white text-[14px] focus:outline-none focus:border-zinc-500 transition-colors placeholder:text-zinc-600"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[13px] text-zinc-300">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={queryForm.phone}
                    onChange={(e) => setQueryForm({ ...queryForm, phone: e.target.value })}
                    placeholder="+91 99999 00000"
                    className="w-full bg-[#1e1e1e] border border-white/10 rounded-full px-5 py-3.5 text-white text-[14px] focus:outline-none focus:border-zinc-500 transition-colors placeholder:text-zinc-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[13px] text-zinc-300">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={queryForm.email}
                  onChange={(e) => setQueryForm({ ...queryForm, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full bg-[#1e1e1e] border border-white/10 rounded-full px-5 py-3.5 text-white text-[14px] focus:outline-none focus:border-zinc-500 transition-colors placeholder:text-zinc-600"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[13px] text-zinc-300">
                  Which best describes your requirement?
                </label>
                <select
                  value={queryForm.machine}
                  onChange={(e) => setQueryForm({ ...queryForm, machine: e.target.value })}
                  required
                  className="w-full bg-[#1e1e1e] border border-white/10 rounded-full px-5 py-3.5 text-white text-[14px] focus:outline-none focus:border-zinc-500 transition-colors appearance-none cursor-pointer"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a1a1aa'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1.25rem center', backgroundSize: '1rem' }}
                >
                  <option value="" className="bg-[#1e1e1e]">Select one</option>
                  <option value="single-facer" className="bg-[#1e1e1e]">Fingerless Single Facer Corrugation</option>
                  <option value="rotary-slitter" className="bg-[#1e1e1e]">Thin Blade Slitter Scorer</option>
                  <option value="flexo-printer" className="bg-[#1e1e1e]">Flexo Printer Slotter</option>
                  <option value="pasting" className="bg-[#1e1e1e]">Sheet Pasting Machine</option>
                  <option value="plant-line" className="bg-[#1e1e1e]">Complete 3/5-Ply Plant Line Setup</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-[13px] text-zinc-300">
                  Message
                </label>
                <textarea
                  rows="5"
                  required
                  value={queryForm.message}
                  onChange={(e) => setQueryForm({ ...queryForm, message: e.target.value })}
                  placeholder="Write your message..."
                  className="w-full bg-[#1e1e1e] border border-white/10 rounded-3xl px-5 py-4 text-white text-[14px] focus:outline-none focus:border-zinc-500 transition-colors resize-none placeholder:text-zinc-600"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={submittingForm}
                  className="flex items-center justify-center gap-2 bg-[#1f3a2c] hover:bg-[#254736] border border-[#2d523f] text-[#4ade80] px-8 py-3 rounded-full cursor-pointer disabled:opacity-70 text-[14px] font-medium transition-colors"
                >
                  {submittingForm && (
                    <svg className="nc-spinner w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  )}
                  {submittingForm ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      </div>
    </section>
  );
}