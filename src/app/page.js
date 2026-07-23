"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import HeroSlider from "../components/HeroSlider";
import AboutUs from "../components/AboutUs";
import WhyChooseUs from "../components/WhyChooseUs";
import Products from "../components/Products";
import Testimonials from "../components/Testimonials";
import ContactUs from "../components/ContactUs";
import Footer from "../components/Footer";

export default function Home() {
  const [sliderSettings, setSliderSettings] = useState({
    active_type: "image",
    video_path: "",
    video_title: "Redefining Corrugated Box Machinery",
    video_content: "Established in 1952, manufacturing high-performance 3/5-ply automatic corrugated board and box making production lines.",
    video_button_text: "Explore Products",
    video_button_link: "#products",
  });
  const [slides, setSlides] = useState([]);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // Site Settings for SEO and WhatsApp
  const [siteSettings, setSiteSettings] = useState({
    seo_meta_title: "Nagpal Natraj - Corrugating Machinery Company",
    whatsapp_active: true,
    whatsapp_number: "919999999999",
    whatsapp_text: "Hi, I am interested in Natraja machinery.",
  });

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  const [loading, setLoading] = useState(true);

  // Fetch slider details and site settings from backend
  useEffect(() => {
    const fetchSliderData = async () => {
      try {
        const settingsRes = await fetch(`${apiBaseUrl}/slider/settings`);
        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          setSliderSettings(settingsData);
        }

        const slidesRes = await fetch(`${apiBaseUrl}/slider/images`);
        if (slidesRes.ok) {
          const slidesData = await slidesRes.json();
          setSlides(slidesData);
        }
      } catch (err) {
        console.warn("Backend API not reachable. Using fallback slider content.", err);
      }
    };

    const fetchSiteSettings = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/site-settings`);
        if (res.ok) {
          const data = await res.json();
          setSiteSettings(data);

          // Dynamically set page title in browser
          if (data.seo_meta_title) {
            document.title = data.seo_meta_title;
          }
        }
      } catch (err) {
        console.warn("Could not fetch site settings. Using defaults.", err);
      }
    };

    Promise.all([fetchSliderData(), fetchSiteSettings()]).finally(() => {
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1c1917] flex flex-col font-sans selection:bg-[#b8965a] selection:text-white scroll-smooth relative">
      {/* Ambient background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-[600px] h-[600px] rounded-full bg-[#b8965a]/3 blur-[150px]" />
        <div className="absolute top-[40%] right-[5%] w-[600px] h-[600px] rounded-full bg-[#b8965a]/3 blur-[150px]" />
      </div>

      <Header />

      <HeroSlider
        sliderSettings={sliderSettings}
        slides={slides}
        activeSlideIndex={activeSlideIndex}
        setActiveSlideIndex={setActiveSlideIndex}
        loading={loading}
      />

      <AboutUs />
      <WhyChooseUs className="border-b border-[#eaddc7]/30" />
      <Products />
      <Testimonials />

      <ContactUs />

      <Footer />

      {/* FLOATING WHATSAPP CHAT BUBBLE WIDGET */}
      {siteSettings.whatsapp_active && siteSettings.whatsapp_number && (
        <a
          href={`https://wa.me/${siteSettings.whatsapp_number}?text=${encodeURIComponent(siteSettings.whatsapp_text || "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-transform duration-300 group"
          title="Chat on WhatsApp"
        >
          {/* Pulsing indicator */}
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-30 pointer-events-none"></span>

          {/* WhatsApp icon */}
          <svg className="w-8 h-8 fill-current relative z-10" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.705 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>
      )}
    </div>
  );
}
