"use client";

import { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import AboutUs from "../../components/AboutUs";

export default function AboutPage() {
  const [bgImage, setBgImage] = useState("");
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
        const res = await fetch(`${apiBaseUrl}/site-settings`);
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
          if (data.bg_about_page) setBgImage(data.bg_about_page);
        }
      } catch (err) { }
    };
    fetchSettings();
  }, []);

  const parallaxStyle = bgImage ? {
    backgroundImage: `url(${bgImage})`,
    backgroundAttachment: 'fixed',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover'
  } : {};

  return (
    <div className="min-h-screen bg-[#faf8f5] selection:bg-[#b8965a] selection:text-white flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Parallax Banner Header */}
        <section className="relative pt-48 pb-32 flex items-center justify-center border-b border-[#eaddc7]/30" style={parallaxStyle}>
          {bgImage && <div className="absolute inset-0 bg-white/30 z-0"></div>}
          {!bgImage && <div className="absolute inset-0 bg-gradient-to-br from-[#faf8f5] to-[#eaddc7]/50 z-0"></div>}

          <div className="relative z-10 text-center px-6 max-w-4xl mx-auto space-y-4 md:space-y-6">
            <h1 className="text-3xl md:text-4xl lg:text-[44px] font-black text-[#1c1917] tracking-tight uppercase leading-tight drop-shadow-sm">
              {settings?.about_title || "Our Heritage & Legacy"}
            </h1>
            <p className="text-sm md:text-base text-[#292524] max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-sm">
              Discover the engineering prowess and decades of innovation behind Nagpal Natraj Industries. We've been shaping the corrugation industry since 1952.
            </p>
          </div>
        </section>

        {/* We can reuse the AboutUs component which already has the video and detailed layout */}
        <AboutUs isDetailedPage={true} />
      </main>

      <Footer />
    </div>
  );
}
