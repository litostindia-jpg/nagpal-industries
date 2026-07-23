export default function Services() {
  return (
    <section id="services" className="py-24 border-b border-[#eaddc7]/30 bg-white">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="space-y-4">
          <span className="text-xs font-bold uppercase text-[#b8965a] tracking-wider">End-to-End Solutions</span>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#1c1917]">Our Services &amp; Plant Integrations</h2>
          <p className="text-sm text-[#57534e] leading-relaxed">
            We do not just sell machines. We deliver complete production capabilities and technical support models to keep your facility operational.
          </p>
        </div>

        <div className="rounded-3xl border border-[#eaddc7]/40 p-8 space-y-4 hover:border-[#b8965a]/30 transition-colors bg-[#faf8f5]">
          <div className="h-10 w-10 rounded-xl bg-[#b8965a]/10 border border-[#b8965a]/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-[#b8965a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-[#1c1917]">Full Plant Layout &amp; Design</h3>
          <p className="text-xs text-[#57534e] leading-relaxed">
            Complete CAD drafting and floor planning layout integrations matching automatic 3/5-ply corrugator setups with optimal workflow feeds.
          </p>
        </div>

        <div className="rounded-3xl border border-[#eaddc7]/40 p-8 space-y-4 hover:border-[#b8965a]/30 transition-colors bg-[#faf8f5]">
          <div className="h-10 w-10 rounded-xl bg-[#b8965a]/10 border border-[#b8965a]/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-[#b8965a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-[#1c1917]">Commissioning &amp; Spares</h3>
          <p className="text-xs text-[#57534e] leading-relaxed">
            On-site machine assembly calibration, electrical commissioning, operator training, and supply catalogs for fluting rollers, knives, and spares.
          </p>
        </div>
      </div>
    </section>
  );
}
