import React from 'react';
import { Sparkles, ShieldCheck, PhoneCall, Mail } from 'lucide-react';

interface TopContactStripProps {
  onOpenAuditModal: () => void;
}

export const TopContactStrip: React.FC<TopContactStripProps> = ({ onOpenAuditModal }) => {
  return (
    <div className="bg-[#143d2c] text-white/90 text-xs py-2 px-4 border-b border-emerald-900/40">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Left: Parent Initiative & Tagline */}
        <div className="flex items-center gap-3 text-center sm:text-left flex-wrap justify-center sm:justify-start">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium border border-emerald-500/30">
            <Sparkles className="w-3 h-3 text-[#dfb163]" />
            WasteVision Initiative
          </span>
          <span className="hidden md:inline-block text-emerald-100/60">•</span>
          <span className="text-slate-200 tracking-wide">
            Turning Construction Waste into Reusable Resources.
          </span>
        </div>

        {/* Right: Fast contact info & audit link */}
        <div className="flex items-center gap-4 text-slate-300">
          <div className="hidden lg:flex items-center gap-1.5 hover:text-white transition-colors">
            <PhoneCall className="w-3.5 h-3.5 text-[#dfb163]" />
            <span>+1 (800) 458-WASTE</span>
          </div>
          <div className="hidden xl:flex items-center gap-1.5 hover:text-white transition-colors">
            <Mail className="w-3.5 h-3.5 text-emerald-400" />
            <span>intelligence@buildcycle.ai</span>
          </div>
          <button
            onClick={onOpenAuditModal}
            className="text-xs font-semibold text-[#dfb163] hover:text-white flex items-center gap-1 transition-colors underline-offset-4 hover:underline cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Request Site Assessment</span>
          </button>
        </div>
      </div>
    </div>
  );
};
