export default function Exports() {
  return (
    <section id="exports" className="py-24 border-b border-[#eaddc7]/30 bg-[#faf8f5]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-6">
          <span className="text-xs font-bold uppercase text-[#b8965a] tracking-wider">Global Reach</span>
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#1c1917]">Exporting Corrugators Worldwide</h2>
          <p className="text-sm text-[#57534e] leading-relaxed">
            NATRAJA machines are actively running in production lines across more than 20 countries. 
            We customize mechanical configurations to match local voltage ratings, cargo dimensions, and safety regulations.
          </p>
          
          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="text-center p-3 rounded-xl bg-white border border-[#eaddc7]/50 shadow-sm">
              <span className="block text-lg font-bold text-[#b8965a]">Africa</span>
              <span className="text-[9px] text-[#57534e] font-bold uppercase mt-0.5 tracking-wider">Growing Network</span>
            </div>
            <div className="text-center p-3 rounded-xl bg-white border border-[#eaddc7]/50 shadow-sm">
              <span className="block text-lg font-bold text-[#b8965a]">Gulf</span>
              <span className="text-[9px] text-[#57534e] font-bold uppercase mt-0.5 tracking-wider">Major Markets</span>
            </div>
            <div className="text-center p-3 rounded-xl bg-white border border-[#eaddc7]/50 shadow-sm">
              <span className="block text-lg font-bold text-[#b8965a]">Asia</span>
              <span className="text-[9px] text-[#57534e] font-bold uppercase mt-0.5 tracking-wider">Domestic Leader</span>
            </div>
          </div>
        </div>

        <div className="relative border border-[#eaddc7]/40 bg-white rounded-3xl p-8 flex items-center justify-center min-h-[300px] shadow-sm">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#b8965a]/5 via-white/0 to-white" />
          <div className="text-center space-y-3 relative z-10">
            <div className="inline-flex h-12 w-12 rounded-full bg-[#b8965a]/10 border border-[#b8965a]/20 items-center justify-center text-[#b8965a] mb-2 font-mono font-bold">
              INT
            </div>
            <h4 className="font-extrabold text-sm text-[#1c1917]">ISO 9001:2015 Standards</h4>
            <p className="text-xs text-[#57534e] max-w-sm mx-auto leading-relaxed">
              Export seaworthy wooden box packing, rust prevention coatings, and shipping logistics handled directly from ICD ports in NCR, India.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
