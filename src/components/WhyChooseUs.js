"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function WhyChooseUs({ className = "" }) {
  const [whyChooseUs, setWhyChooseUs] = useState([]);
  
  // Local Fallback Data
  const whyChooseUsData = [
    { title: "70+ Years Experience", description: "Pioneering the industry since 1952 with proven expertise.", icon: "gear" },
    { title: "Advanced Technology", description: "State-of-the-art machinery leveraging modern electronics.", icon: "chip" },
    { title: "Global Standards", description: "Uncompromising quality matching international benchmarks.", icon: "globe" },
    { title: "24/7 Support", description: "Dedicated after-sales support ensuring zero downtime.", icon: "support" }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
        const res = await fetch(`${apiBaseUrl}/about/all`);
        if (res.ok) {
          const data = await res.json();
          if (data.why_choose_us && data.why_choose_us.length > 0) {
            setWhyChooseUs(data.why_choose_us);
          }
        }
      } catch (err) {
        console.warn("Could not fetch Why Choose Us data.", err);
      }
    };
    fetchData();
  }, []);

  const activeData = whyChooseUs.length > 0 ? whyChooseUs : whyChooseUsData;

  const renderWhyIcon = (iconName) => {
    switch (iconName) {
      case "gear":
        return (
          <svg className="w-8 h-8 text-[#b8965a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case "chip":
        return (
          <svg className="w-8 h-8 text-[#b8965a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case "globe":
        return (
          <svg className="w-8 h-8 text-[#b8965a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8 text-[#b8965a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <section className={`pt-20 pb-10 bg-[#0a0a0a] relative overflow-hidden ${className}`}>
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#b8965a]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-[#b8965a]/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px" }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-2xl mx-auto mb-16 space-y-4"
        >
          <div className="flex items-center justify-center gap-4 mb-2">
            <span className="w-8 h-[1px] bg-[#b8965a]"></span>
            <span className="text-[11px] font-bold uppercase text-[#b8965a] tracking-[0.25em]">Why Choose Us</span>
            <span className="w-8 h-[1px] bg-[#b8965a]"></span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Engineering Excellence
          </h2>
          <p className="text-[15px] text-zinc-400 font-medium leading-relaxed">
            Machines designed for efficiency, durability, and precision performance to power your industrial needs.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "0px" }}
          className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6"
        >
          {activeData.map((item, idx) => (
            <motion.div 
              key={idx}
              variants={cardVariants}
              whileHover={{ y: -5, scale: 1.01 }}
              className="group relative p-5 rounded-3xl bg-white/5 border border-white/10 overflow-hidden backdrop-blur-sm transition-all duration-500 hover:border-[#b8965a]/40 hover:bg-white/10 hover:shadow-2xl hover:shadow-[#b8965a]/5"
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#b8965a]/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out origin-left" />
              
              <div className="flex flex-col gap-3 items-center text-center">
                <div className="w-16 h-16 shrink-0 rounded-2xl bg-gradient-to-br from-[#b8965a]/20 to-transparent flex items-center justify-center border border-[#b8965a]/20 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                  {renderWhyIcon(item.icon)}
                </div>
                <div className="space-y-3 pt-1">
                  <h3 className="text-lg md:text-xl font-bold text-white tracking-tight group-hover:text-[#b8965a] transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-[13px] text-zinc-400 leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
