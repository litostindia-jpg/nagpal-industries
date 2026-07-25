"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

// Framer Motion variants -----------------------------------------------

// Background: cross-fade + subtle Ken Burns scale-down on entry
const bgVariants = {
  initial: { opacity: 0, scale: 1.05 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { opacity: { duration: 0.6, ease: "easeOut" }, scale: { duration: 1.2, ease: "easeOut" } },
  },
  exit: { opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } },
};

// Product image: 3D cube rotation transition in slow motion (no blur)
const productVariants = {
  initial: {
    opacity: 0,
    rotateY: 90,
    transformPerspective: 1200,
    z: -160,
    x: 180,
  },
  animate: {
    opacity: 1,
    rotateY: 0,
    transformPerspective: 1200,
    z: 0,
    x: 0,
    transition: {
      duration: 1.5,
      ease: [0.25, 1, 0.5, 1], // premium easeOutQuint
    },
  },
  exit: {
    opacity: 0,
    rotateY: -90,
    transformPerspective: 1200,
    z: -160,
    x: -180,
    transition: {
      duration: 1.3,
      ease: [0.25, 1, 0.5, 1],
    },
  },
};

// Ground shadow: fades / scales along with the product so it never looks static
const shadowVariants = {
  initial: { opacity: 0, scale: 0.85 },
  animate: { opacity: 0.8, scale: 1, transition: { duration: 0.5, ease: "easeOut", delay: 0.05 } },
  exit: { opacity: 0, scale: 0.85, transition: { duration: 0.3, ease: "easeIn" } },
};

// Text block: staggered fade + upward slide for title / paragraph / buttons
const textContainerVariants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
  exit: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
};

const textItemVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.25, ease: "easeIn" } },
};

export default function HeroSlider({ sliderSettings, slides, activeSlideIndex, setActiveSlideIndex, loading }) {
  if (loading) {
    return (
      <div className="relative w-full h-screen min-h-[600px] flex items-center justify-center bg-[#faf8f5] overflow-hidden">
        <div className="absolute inset-0 bg-[#eaddc7]/20 animate-pulse"></div>
        <div className="z-10 text-center space-y-6">
          <div className="w-64 h-12 bg-white/50 rounded-2xl mx-auto animate-pulse"></div>
          <div className="w-96 h-24 bg-white/50 rounded-2xl mx-auto animate-pulse"></div>
          <div className="w-40 h-10 bg-white/50 rounded-full mx-auto animate-pulse mt-8"></div>
        </div>
      </div>
    );
  }

  const activeSlides = slides.length > 0 ? slides : [];
  if (activeSlides.length === 0 && !loading) {
    return (
      <div className="relative w-full h-screen min-h-[600px] flex items-center justify-center bg-[#faf8f5] overflow-hidden">
        <h2 className="text-xl font-bold text-gray-500">No sliders found. Please add a slider from the Admin panel.</h2>
      </div>
    );
  }

  const currentSlide = activeSlides[activeSlideIndex] || activeSlides[0];
  const slideKey = currentSlide.id ?? activeSlideIndex;

  const currentBackground =
    sliderSettings.active_type === "image" ? currentSlide.image_background : null;
  const currentBackgroundMobile =
    sliderSettings.active_type === "image" ? (currentSlide.image_background_mobile || currentSlide.image_background) : null;
  const currentProduct =
    sliderSettings.active_type === "image" ? currentSlide.image_product : currentSlide.image_product;

  const fallbackProductSrc =
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600&auto=format&fit=crop";

  // Preload background + product images for the whole slide set so
  // transitions never reveal a blank / broken image mid-animation.
  useEffect(() => {
    activeSlides.forEach((slide) => {
      if (slide.image_background) {
        const img = new Image();
        img.src = slide.image_background;
      }
      if (slide.image_background_mobile) {
        const img = new Image();
        img.src = slide.image_background_mobile;
      }
      if (slide.image_product) {
        const img = new Image();
        img.src = slide.image_product;
      }
    });
  }, [activeSlides]);

  // Auto-play interval: rotates slides every 5.5 seconds (5500ms)
  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlideIndex((prevIndex) => (prevIndex + 1) % activeSlides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [activeSlides.length, setActiveSlideIndex]);

  return (
    <section className="relative h-[100vh] min-h-[500px] w-full bg-[#faf8f5] overflow-hidden border-b border-[#eaddc7]/30 pt-28 flex items-center select-none">
      {/* 1. CLEAN BACKGROUND LAYER */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {sliderSettings.active_type === "image" ? (
          <AnimatePresence mode="sync">
            {currentBackground && (
              <motion.img
                key={`bg-desktop-${slideKey}`}
                src={currentBackground}
                alt="background desktop"
                variants={bgVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="absolute inset-0 w-full h-full object-cover hidden md:block"
              />
            )}
            {currentBackgroundMobile && (
              <motion.img
                key={`bg-mobile-${slideKey}`}
                src={currentBackgroundMobile}
                alt="background mobile"
                variants={bgVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="absolute inset-0 w-full h-full object-cover block md:hidden"
              />
            )}
          </AnimatePresence>
        ) : (
          /* Premium light themed abstract background */
          <div className="absolute inset-0 bg-gradient-to-br from-[#faf8f5] via-[#f5f1ea] to-[#ebdcc7]/20 overflow-hidden">
            {/* Ambient gold glow */}
            <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#b8965a]/5 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-20%] w-[50%] h-[50%] rounded-full bg-[#b8965a]/3 blur-[100px] pointer-events-none" />

            {/* Glowing translucent diagonal squares (similar to reference image) */}
            <div className="absolute top-[5%] left-[-15%] w-[50%] h-[50%] bg-gradient-to-br from-white/40 to-transparent rotate-[35deg] rounded-[48px] border border-[#eaddc7]/30 backdrop-blur-[2px] shadow-2xl" />
            <div className="absolute top-[40%] left-[25%] w-[25%] h-[25%] bg-gradient-to-br from-white/30 to-transparent rotate-[45deg] rounded-[32px] border border-[#eaddc7]/30 backdrop-blur-[1px] shadow-xl" />
            <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-gradient-to-tr from-white/20 to-transparent rotate-[-20deg] rounded-[40px] border border-[#eaddc7]/30 backdrop-blur-[2px]" />
          </div>
        )}

        {/* Dynamic Video background if Video Mode is active */}
        {sliderSettings.active_type === "video" && sliderSettings.video_path && (
          <>
            <video
              key={sliderSettings.video_path}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-100"
            >
              <source src={sliderSettings.video_path} type="video/mp4" />
            </video>
            {/* Premium gradient overlay to keep text readable on the left and video clear/sharp on the right */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-transparent backdrop-blur-[5px] pointer-events-none z-[1]" />
          </>
        )}
      </div>

      <div className="max-w-7xl w-full mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch h-full relative z-10">
        {/* 2. TEXT AREA LAYOUT (LEFT SIDE) */}
        <div className="lg:col-span-6 flex flex-col justify-center py-16 pr-4 space-y-7 z-20">
          {/* Small Premium Badge (static, doesn't change per slide) */}
          <div className="flex items-center gap-2 self-start">
            <span className="h-1.5 w-1.5 rounded-full bg-[#b8965a]" />
            <span className={`text-[10px] font-bold uppercase tracking-[0.25em] px-3.5 py-1.5 rounded-full border backdrop-blur-sm transition-colors ${
              sliderSettings.active_type === "video" 
                ? "text-[#b8965a] bg-black/40 border-[#b8965a]/40" 
                : "text-[#b8965a] bg-[#b8965a]/10 border-[#b8965a]/25"
            }`}>
              {currentSlide.title || "NATRAJA MACHINERY SINCE 1952"}
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`text-static-${sliderSettings.active_type}`}
              variants={textContainerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col space-y-7"
            >
              {/* Dynamic Large Heading with Staggered Typewriter Reveal */}
              <motion.h1
                variants={{
                  initial: { opacity: 1 },
                  animate: { opacity: 1, transition: { staggerChildren: 0.03 } }, // Typewriter speed
                  exit: { opacity: 0, transition: { duration: 0.2 } }
                }}
                className={`text-[40px] md:text-6xl lg:text-[64px] font-black leading-[1.05] tracking-tight flex flex-wrap drop-shadow-sm ${playfair.className} ${
                  sliderSettings.active_type === "video" ? "text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]" : "text-[#1c1917]"
                }`}
              >
                {(sliderSettings.video_title || "Redefining Corrugated Box Machinery").split(" ").map((word, wIdx) => (
                  <span key={wIdx} className="inline-block mr-[12px] md:mr-[16px]">
                    {word.split("").map((char, cIdx) => (
                      <motion.span
                        key={cIdx}
                        variants={{
                          initial: { opacity: 0 },
                          animate: { opacity: 1, transition: { duration: 0.05 } },
                        }}
                      >
                        {char}
                      </motion.span>
                    ))}
                  </span>
                ))}
              </motion.h1>

              {/* Dynamic Paragraph with Staggered Word Reveal */}
              <motion.p
                variants={textItemVariants}
                className={`text-xs md:text-sm leading-relaxed max-w-lg flex flex-wrap ${
                  sliderSettings.active_type === "video" ? "text-white/95 font-semibold drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]" : "text-[#57534e] font-medium"
                }`}
              >
                {(sliderSettings.video_content || "High performance corrugation and packaging systems built to last.").split(" ").map((word, i) => (
                  <motion.span
                    key={`${word}-${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25, delay: 0.2 + i * 0.02 }}
                    className="mr-1.5"
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.p>

              {/* 3. BUTTONS BLOCK */}
              <motion.div
                variants={textItemVariants}
                className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
              >
                <a
                  href={sliderSettings.video_button_link || "/products"}
                  className="group relative px-8 py-4 bg-gradient-to-r from-[#b8965a] to-[#a08048] hover:from-[#1c1917] hover:to-[#2e2a27] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg active:scale-[0.98] transition-all duration-300 text-center flex items-center justify-center gap-2 overflow-hidden"
                >
                  {sliderSettings.video_button_text || "Explore Machinery"}
                  <svg
                    className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </a>

                <a
                  href="/contact"
                  className={`px-8 py-4 border rounded-xl font-bold text-xs uppercase tracking-wider active:scale-[0.98] transition-all duration-300 text-center backdrop-blur-sm shadow-sm flex items-center justify-center gap-2 ${
                    sliderSettings.active_type === "video" 
                      ? "bg-white/10 hover:bg-white/20 border-white/20 text-white hover:border-white/40" 
                      : "bg-white/70 hover:bg-white border-[#eaddc7] hover:border-[#b8965a] text-[#57534e] hover:text-[#b8965a]"
                  }`}
                >
                  Download Catalogue
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </a>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* 4. TRUST CRITERIA SECTION (static) */}
          <div className={`pt-6 border-t flex flex-wrap items-center gap-x-6 gap-y-3 text-[10px] font-bold uppercase tracking-wider ${
            sliderSettings.active_type === "video" ? "border-white/20 text-gray-300" : "border-[#eaddc7]/30 text-[#57534e]"
          }`}>
            <div className="flex items-center gap-1.5">
              <span className="text-[#b8965a] text-xs">★★★★★</span>
              <span>Trusted by 5000+ Plants</span>
            </div>
            <span className={`h-1.5 w-1.5 rounded-full hidden sm:inline ${sliderSettings.active_type === "video" ? "bg-white/20" : "bg-[#eaddc7]"}`} />
            <div>Exporting Worldwide</div>
            <span className={`h-1.5 w-1.5 rounded-full hidden sm:inline ${sliderSettings.active_type === "video" ? "bg-white/20" : "bg-[#eaddc7]"}`} />
            <div>ISO 9001 Certified</div>
          </div>
        </div>

        {/* 5. PRODUCTS STAGE (RIGHT SIDE) */}
        <div className="lg:col-span-6 hidden lg:flex items-center justify-center relative h-full z-20">
          <div className="relative w-full h-full min-h-[400px] flex items-center justify-center overflow-hidden perspective-[1200px]">
            <div className="relative group flex items-center justify-center w-full h-full">
              <AnimatePresence mode="popLayout">
                {currentProduct ? (
                  <motion.div
                    key={`product-${slideKey}`}
                    className="relative flex items-center justify-center"
                    style={{ 
                      willChange: "transform, opacity",
                      transformStyle: "preserve-3d",
                    }}
                    variants={productVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <motion.div
                      variants={shadowVariants}
                      className={`absolute -bottom-10 left-1/2 -translate-x-1/2 w-80 h-10 rounded-full filter blur-xl mix-blend-multiply pointer-events-none ${
                        sliderSettings.active_type === "video" ? "bg-black/40" : "bg-black/10"
                      }`}
                    />
                    <div className="relative overflow-hidden rounded-2xl flex items-center justify-center h-full w-full">
                      <img
                        src={currentProduct}
                        alt="Natraja Premium Machine"
                        className="max-h-[50vh] lg:max-h-[60vh] max-w-full w-auto object-contain filter drop-shadow-[0_30px_60px_rgba(0,0,0,0.15)] relative z-10 mx-auto"
                      />
                    </div>
                  </motion.div>
                ) : (
                  /* Fallback machine model rendering, animated the same way */
                  <motion.div
                    key={`product-fallback-${slideKey}`}
                    className="relative flex items-center justify-center"
                    style={{ 
                      willChange: "transform, opacity",
                      transformStyle: "preserve-3d",
                    }}
                    variants={productVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <motion.div
                      variants={shadowVariants}
                      className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-64 h-8 bg-black/15 rounded-full filter blur-lg mix-blend-multiply"
                    />
                    <img
                      src={fallbackProductSrc}
                      alt="Corrugator Line Render"
                      className="max-h-[460px] w-auto rounded-3xl object-cover filter drop-shadow-[0_20px_45px_rgba(184,150,90,0.1)] border border-[#eaddc7]"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Slide pagination dots */}
      {activeSlides.length > 1 && (
        <div className="absolute bottom-8 left-6 z-20 flex gap-2">
          {activeSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlideIndex(idx)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${idx === activeSlideIndex ? "w-6 bg-[#b8965a]" : "w-1.5 bg-[#eaddc7]"
                }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}