"use client";

import { useState, useEffect } from "react";
import WhyChooseUs from "./WhyChooseUs";

export default function AboutUs({ isDetailedPage = false, children }) {
  const [aboutData, setAboutData] = useState({
    about_title: "Decades of Engineering Precision",
    about_description: "<p>Nagpal Industries (Natraj Group) is an ISO 9001 certified pioneer in manufacturing robust corrugating machinery. Based out of Faridabad, India, we have been delivering highly customized automated plant setups for corrugated paper boxes across the globe.</p>",
    experience_years: "70+ Years",
    machines_installed: "5000+",
    about_image: "",
    about_video: "",
    bg_about_section: "",
  });

  const [whyChooseUs, setWhyChooseUs] = useState([]);
  const [team, setTeam] = useState([]);
  const [clients, setClients] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [portfolio, setPortfolio] = useState([]);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  // Fallbacks
  const whyChooseUsData = [
    {
      title: "Custom Engineering Profiles",
      description: "Hum har machinery layout ko aapke factory space aur dynamic carton box specification ke according structure aur scale karte hain.",
      icon: "gear"
    },
    {
      title: "Advanced PLC Automation",
      description: "Natraja machines high-speed automated counters, touch-screen dashboards, aur paper waste management systems ke sath aati hain.",
      icon: "chip"
    },
    {
      title: "Heavy Rigid Cast Frames",
      description: "Hum vibration-damped high-grade cast bodies integrate karte hain taaki operations smooth aur low-maintenance rahein.",
      icon: "shield"
    },
    {
      title: "Global Export Support",
      description: "Natraja brand 1952 se Asia, Middle East, Europe aur Africa me robust machine delivery aur technical backup support deta aaya hai.",
      icon: "globe"
    }
  ];

  const teamData = [
    {
      name: "Sh. Baldev Raj Nagpal",
      role: "Founder & Industry Visionary",
      description: "Unhone 1952 me brand NATRAJA ki neev rakhi aur India me high-precision corrugation engineering lines ki shuruat ki.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
    },
    {
      name: "Mr. Vivek Nagpal",
      role: "Managing Director",
      description: "Natraja corporate setup ko control aur guide karte hain. Global trade expansion aur brand standards ko ensure karna inka focus hai.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop"
    },
    {
      name: "Mr. Akshay Nagpal",
      role: "Technical Director",
      description: "High-speed automatic setups, mechanical upgrades, aur technology R&D departments ko lead karte hain.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop"
    }
  ];

  const clientsData = [
    { name: "Tata Packaging", initials: "TP", image_path: "" },
    { name: "Oji India Paper", initials: "OI", image_path: "" },
    { name: "Horizon Packs", initials: "HP", image_path: "" },
    { name: "Amber Gulf Packaging", initials: "AG", image_path: "" },
    { name: "Supershine Boxes", initials: "SB", image_path: "" },
    { name: "Adani Wilmar Packaging", initials: "AW", image_path: "" }
  ];

  const testimonialsData = [
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

  const portfolioData = [
    {
      title: "Automatic Corrugation Line",
      description: "Fully automatic high-speed corrugating board production plant, steam heated rollers aur digital cut-off scoring system ke sath.",
      tag: "Main Production",
      image: "/corrugation_line.png"
    },
    {
      title: "Partition Slotter Machine",
      description: "Cardboard boxes partitions aur slots cutting machine, safety mesh guard aur high-speed variable motors integration ke sath.",
      tag: "Custom Slotting",
      image: "/partition_slotter.png"
    },
    {
      title: "Rotary Sheet Cutter & Creaser",
      description: "High precision rotary board scoring aur size cutting machinery, digital belt control beds ke sath.",
      tag: "Carton Finishing",
      image: "/sheet_cutter.png"
    },
    {
      title: "Arm Box Stitching Machine",
      description: "Heavy-duty wire stapling and stitching setup, double-layer box production lines ke liye optimal speed output deta hai.",
      tag: "Stapling Setup",
      image: "/box_stitcher.png"
    },
    {
      title: "Sheet Pasting Machine",
      description: "Glue coating & pasting rollers, balanced chrome layered application ke liye design kiya gaya industrial standard system.",
      tag: "Lamination & Glue",
      image: "/sheet_paster.png"
    }
  ];

  useEffect(() => {
    const fetchAllAboutData = async () => {
      try {
        const settingsRes = await fetch(`${apiBaseUrl}/site-settings`);
        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          setAboutData({
            about_title: settingsData.about_title || "Decades of Engineering Precision",
            about_description: settingsData.about_description || "",
            experience_years: settingsData.experience_years || "70+ Years",
            machines_installed: settingsData.machines_installed || "5000+",
            about_image: settingsData.about_image || "",
            about_video: settingsData.about_video || "",
            bg_about_section: settingsData.bg_about_section || "",
          });
        }

        const aboutAllRes = await fetch(`${apiBaseUrl}/about/all`);
        if (aboutAllRes.ok) {
          const data = await aboutAllRes.json();
          if (data.why_choose_us && data.why_choose_us.length > 0) setWhyChooseUs(data.why_choose_us);
          if (data.team && data.team.length > 0) setTeam(data.team);
          if (data.clients && data.clients.length > 0) setClients(data.clients);
          if (data.testimonials && data.testimonials.length > 0) setTestimonials(data.testimonials);
          if (data.portfolio && data.portfolio.length > 0) setPortfolio(data.portfolio);
        }
      } catch (err) {
        console.warn("Could not fetch about listings from backend. Using local fallbacks.", err);
      }
    };
    fetchAllAboutData();
  }, []);

  const activeWhyChooseUs = whyChooseUs.length > 0 ? whyChooseUs : whyChooseUsData;
  const activeTeam = team.length > 0 ? team : teamData;
  const activeClients = clients.length > 0 ? clients : clientsData;
  const activeTestimonials = testimonials.length > 0 ? testimonials : testimonialsData;
  const activePortfolio = portfolio.length > 0 ? portfolio : portfolioData;

  const renderWhyIcon = (iconName) => {
    switch (iconName) {
      case "gear":
        return (
          <svg className="w-6 h-6 text-[#b8965a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case "chip":
        return (
          <svg className="w-6 h-6 text-[#b8965a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case "globe":
        return (
          <svg className="w-6 h-6 text-[#b8965a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h2m-4-7a7.5 7.5 0 11-7.5 7.5 7.5 0 017.5-7.5z" />
          </svg>
        );
      case "shield":
      default:
        return (
          <svg className="w-6 h-6 text-[#b8965a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        );
    }
  };

  const parallaxStyle = aboutData.bg_about_section ? {
    backgroundImage: `url('${aboutData.bg_about_section}')`,
    backgroundAttachment: 'fixed',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover'
  } : {};

  const parallaxClientsStyle = aboutData.bg_clients_section ? {
    backgroundImage: `url(${aboutData.bg_clients_section})`,
    backgroundAttachment: 'fixed',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover'
  } : {};

  const parallaxTestimonialsStyle = aboutData.bg_testimonials_section ? {
    backgroundImage: `url(${aboutData.bg_testimonials_section})`,
    backgroundAttachment: 'fixed',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover'
  } : {};

  return (
    <>
    <section id="about" className="py-24 border-b border-[#eaddc7]/30 bg-white relative" style={parallaxStyle}>
      {aboutData.bg_about_section && <div className="absolute inset-0 bg-white/40 z-0 pointer-events-none"></div>}
      <div className="max-w-7xl mx-auto px-6 space-y-24 relative z-10">

        {/* SECTION 1: OVERVIEW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column: Autoplay Video Player or Fallback Image */}
          <div className="relative rounded-3xl border border-[#eaddc7]/40 overflow-hidden shadow-lg bg-[#faf8f5] aspect-video lg:aspect-[4/3] flex items-center justify-center">
            {aboutData.about_video ? (
              <video
                src={aboutData.about_video}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover absolute inset-0"
              />
            ) : aboutData.about_image ? (
              <img
                src={aboutData.about_image}
                alt="Nagpal Natraj factory floor machinery"
                className="w-full h-full object-cover absolute inset-0"
              />
            ) : (
              <div className="p-8 text-center text-xs text-zinc-400">
                No video or image asset uploaded. Configure it in Admin settings.
              </div>
            )}
          </div>

          {/* Right Column: Dynamic Overview & Stats (Moved from Left Side) */}
          <div className="space-y-7 flex flex-col justify-center">
            <div className="space-y-2">
              <div className="flex items-center gap-3 self-start">
                <span className="text-xs font-black uppercase text-[#b8965a] tracking-wider">About Us</span>
                <span className="h-4 w-[2px] bg-[#b8965a]/30"></span>
                <span className="text-[10px] font-bold text-[#b8965a] uppercase tracking-widest bg-[#b8965a]/10 px-3.5 py-1 rounded-full border border-[#b8965a]/20 inline-block">
                  Legacy Since 1952
                </span>
              </div>
              
              <h3 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#1c1917]">
                {aboutData.about_title || "Why Choose NATRAJA Machines?"}
              </h3>
            </div>

            {/* CKEditor description */}
            <div
              className="text-sm text-[#57534e] leading-relaxed space-y-3 prose prose-stone max-w-none font-medium"
              dangerouslySetInnerHTML={{ __html: aboutData.about_description }}
            />

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-[#eaddc7]/30">
              <div className="p-5 rounded-2xl bg-[#faf8f5] border border-[#eaddc7]/50 shadow-sm hover:border-[#b8965a] transition-all">
                <div className="text-2xl font-black text-[#b8965a]">{aboutData.experience_years}</div>
                <div className="text-[9px] text-[#57534e] font-bold uppercase mt-1.5 tracking-wider">Industrial Experience</div>
              </div>
              <div className="p-5 rounded-2xl bg-[#faf8f5] border border-[#eaddc7]/50 shadow-sm hover:border-[#b8965a] transition-all">
                <div className="text-2xl font-black text-[#b8965a]">{aboutData.machines_installed}</div>
                <div className="text-[9px] text-[#57534e] font-bold uppercase mt-1.5 tracking-wider">Machines Installed</div>
              </div>
            </div>
          </div>
        </div>



        {/* SECTION 3: OUR TEAM */}
        {isDetailedPage && (
          <div className="border-t border-[#eaddc7]/30 pt-20">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-bold uppercase text-[#b8965a] tracking-wider">Our Team</span>
            <h3 className="text-3xl font-extrabold tracking-tight text-[#1c1917]">Leadership & Engineering</h3>
            <p className="text-xs text-[#57534e] font-medium leading-relaxed">
              Decades of experience in delivering robust corrugated box machinery designs worldwide.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {activeTeam.map((member, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-[#faf8f5] border border-[#eaddc7]/30 hover:bg-white hover:border-[#b8965a] hover:shadow-lg hover:shadow-black/5 transition-all duration-300 flex flex-col items-center text-center"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-20 h-20 rounded-full object-cover border border-[#eaddc7]/65 shadow-md mb-4"
                />
                <h4 className="text-base font-black text-[#1c1917]">{member.name}</h4>
                <span className="text-[9px] font-bold text-[#b8965a] uppercase tracking-widest mt-0.5 mb-3 bg-[#b8965a]/10 px-3 py-1 rounded-full border border-[#b8965a]/15">
                  {member.role}
                </span>
                <p className="text-xs text-[#57534e] leading-relaxed font-medium">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
        )}

        {children}

      </div>
    </section>

    {/* SECTION 4: OUR CLIENTS */}
    <section className="py-24 border-b border-[#eaddc7]/30 bg-[#faf8f5] relative" style={parallaxClientsStyle}>
      {aboutData.bg_clients_section && <div className="absolute inset-0 bg-[#faf8f5]/40 z-0 pointer-events-none"></div>}
      <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-bold uppercase text-[#b8965a] tracking-wider">Our Clients</span>
            <h3 className="text-3xl font-extrabold tracking-tight text-[#1c1917]">Trusted By Enterprise Leaders</h3>
            <p className="text-xs text-[#57534e] font-medium leading-relaxed">
              A quick overview of key box packaging clients running brand NATRAJA machinery lines.
            </p>
          </div>
          <style>{`
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-33.3333%); }
            }
            .animate-marquee {
              animation: marquee 25s linear infinite;
              display: flex;
              width: max-content;
            }
            .animate-marquee:hover {
              animation-play-state: paused;
            }
          `}</style>
          
          <div className="overflow-hidden w-full relative">
            <div className="animate-marquee gap-16 py-4">
              {/* Triple the array for seamless infinite scrolling */}
              {[...activeClients, ...activeClients, ...activeClients].map((client, idx) => (
                <div 
                  key={idx}
                  className="flex flex-col items-center justify-center transition-all w-36 md:w-48 shrink-0 group"
                >
                  {client.image_path && (
                    <img
                      src={client.image_path}
                      alt={client.name || "Client"}
                      className="h-20 md:h-28 w-auto object-contain transition-transform duration-500 hover:scale-110"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
      </div>
    </section>

    {/* SECTION 6: PORTFOLIO */}
    {isDetailedPage && (
      <section className="py-24 border-b border-[#eaddc7]/30 bg-white">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
              <span className="text-xs font-bold uppercase text-[#b8965a] tracking-wider">Portfolio</span>
              <h3 className="text-3xl font-extrabold tracking-tight text-[#1c1917]">Our Product Lines</h3>
              <p className="text-xs text-[#57534e] font-medium leading-relaxed">
                Explore our diverse portfolio of corrugating plants, paper slitters, rotary slotters, and box assembly setups.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activePortfolio.map((project, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#eaddc7]/40 bg-white overflow-hidden hover:shadow-lg hover:shadow-black/5 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="h-48 w-full relative overflow-hidden bg-[#faf8f5] border-b border-[#eaddc7]/30">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    <div className="p-5 space-y-2">
                      <span className="text-[8px] font-bold text-[#b8965a] uppercase tracking-wider bg-[#b8965a]/10 border border-[#b8965a]/15 px-2 py-0.5 rounded-full inline-block">
                        {project.tag}
                      </span>
                      <h4 className="text-base font-extrabold text-[#1c1917]">{project.title}</h4>
                      <p className="text-xs text-[#57534e] leading-relaxed font-medium">{project.description}</p>
                    </div>
                  </div>
                  <div className="p-5 pt-0">
                    <a
                      href="/contact"
                      className="text-[10px] font-bold uppercase tracking-wider text-[#b8965a] hover:text-black flex items-center gap-1.5 transition-colors"
                    >
                      Request Specs
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
        </div>
      </section>
    )}


    {/* SECTION 2: WHY CHOOSE US */}
    {isDetailedPage && (
      <WhyChooseUs />
    )}

    </>
  );
}
