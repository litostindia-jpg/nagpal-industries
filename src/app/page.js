"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import HeroSlider from "../components/HeroSlider";
import AboutUs from "../components/AboutUs";
import WhyChooseUs from "../components/WhyChooseUs";
import Categories from "../components/Categories";
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
      <Categories />
      <Products />
      <Testimonials />

      {/* Plant Banner Image - Full Width */}
      <div className="w-full relative z-10 pt-12">
        <div className="w-full relative overflow-hidden shadow-xl border-y border-[#eaddc7]/30 group min-h-[300px]">
          <img 
            src={siteSettings.home_banner_image || "/plant-banner.jpg"} 
            alt={siteSettings.home_banner_heading || "Fully Automatic Corrugated Box Making Machine Plant"} 
            className="w-full h-full md:h-auto object-cover absolute md:relative inset-0" 
          />
          {(siteSettings.home_banner_heading || siteSettings.home_banner_description) && (
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-6 text-center transition-all duration-500 hover:bg-black/40">
              {siteSettings.home_banner_heading && (
                <h2 className="text-3xl md:text-5xl font-black text-white mb-4 drop-shadow-xl tracking-tight">
                  {siteSettings.home_banner_heading}
                </h2>
              )}
              {siteSettings.home_banner_description && (
                <p className="text-sm md:text-xl text-zinc-100 max-w-4xl drop-shadow-lg">
                  {siteSettings.home_banner_description}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <ContactUs />

      <Footer />
    </div>
  );
}
