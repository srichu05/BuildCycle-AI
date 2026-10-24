import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, FileCheck } from 'lucide-react';

interface PrimaryCtaSectionProps {
  onAnalyzeWaste: () => void;
  onRequestAudit: () => void;
}

export const PrimaryCtaSection: React.FC<PrimaryCtaSectionProps> = ({
  onAnalyzeWaste,
  onRequestAudit,
}) => {
  return (
    <section className="py-20 sm:py-28 bg-[#1c503a] text-white relative overflow-hidden">
      {/* Background Image Texture */}
      <div className="absolute inset-0 z-0 opacity-15">
        <img
          src="/assets/images/hero.jpg"
          alt="Construction material recovery background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#1c503a] mix-blend-multiply" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#dfb163] text-xs font-bold tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>WasteVision Initiative</span>
        </div>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
          Every Construction Site{' '}
          <span className="text-[#dfb163] relative inline-block">
            Can Recover More
            <svg
              className="absolute -bottom-2 left-0 w-full h-2.5 text-emerald-400 opacity-80"
              viewBox="0 0 100 12"
              preserveAspectRatio="none"
            >
              <path
                d="M0 8 Q 50 1, 100 8"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h2>

        <p className="text-base sm:text-lg text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
          Start with a photograph. Discover the materials in your construction waste and explore potential recovery pathways.
        </p>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onAnalyzeWaste}
            className="white-btn text-sm sm:text-base py-3.5 px-8 font-bold shadow-xl cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#097e51]" />
            <span>Start Waste Analysis</span>
          </button>

          <button
            onClick={onRequestAudit}
            className="theme-btn text-sm sm:text-base py-3.5 px-8 font-bold border-white/30 cursor-pointer"
          >
            <span>Request Site Assessment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="pt-8 flex flex-wrap items-center justify-center gap-8 text-xs text-emerald-200/80">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#dfb163]" />
            <span>Non-Destructive Photographic Scanning</span>
          </div>
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <span>Instant CSV Data Export</span>
          </div>
        </div>
      </div>
    </section>
  );
};
