import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface HeroSectionProps {
  onAnalyzeWaste: () => void;
  onExploreSolution: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onAnalyzeWaste,
  onExploreSolution,
}) => {
  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Background Photography with Deep Environmental Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/images/hero.jpg"
          alt="Sustainable Construction Waste Recovery Facility"
          className="w-full h-full object-cover object-center scale-105 animate-in fade-in duration-1000"
        />
        {/* Layered overlays matching the Ecotrix depth & contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#103424]/95 via-[#16422f]/85 to-[#0b2419]/70" />
        <div className="absolute inset-0 bg-radial at-top-left from-transparent via-transparent to-black/50" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-8 space-y-6">
            {/* Top Subtitle Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-semibold tracking-wider uppercase">
              <Sparkles className="w-4 h-4 text-[#dfb163] animate-pulse" />
              <span>WasteVision — AI for a Cleaner Future</span>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
              Turn Construction Waste Into{' '}
              <span className="text-[#dfb163] relative inline-block">
                Valuable Resources
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-emerald-400 opacity-90"
                  viewBox="0 0 100 12"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 9 Q 50 1, 100 9"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-xl text-emerald-50/90 leading-relaxed max-w-2xl font-normal">
              BuildCycle AI uses computer vision to identify construction debris, analyze visible
              material composition and discover smarter opportunities for reuse and recycling.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onAnalyzeWaste}
                className="theme-btn text-sm sm:text-base py-3.5 px-7 font-bold shadow-xl cursor-pointer"
              >
                <Sparkles className="w-5 h-5 text-[#dfb163]" />
                <span>Analyze Waste</span>
              </button>

              <button
                onClick={onExploreSolution}
                className="white-btn text-sm sm:text-base py-3.5 px-7 font-bold cursor-pointer"
              >
                <span>Explore Our Solution</span>
                <ArrowRight className="w-4 h-4 text-[#097e51]" />
              </button>
            </div>

            {/* Trust Markers / Operational Boundaries */}
            <div className="pt-6 border-t border-white/15 flex flex-wrap items-center gap-6 text-xs text-emerald-100/80">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#dfb163]" />
                <span>YOLOv11 Fine-Tuned for Rubble</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#dfb163]" />
                <span>FastAPI Backend Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Surface Visual Intelligence</span>
              </div>
            </div>
          </div>

          {/* Right Column: Floating Intelligence Card */}
          <div className="lg:col-span-4 hidden lg:block">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl space-y-5 text-white transform hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center justify-between border-b border-white/15 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/30 flex items-center justify-center text-emerald-300">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-emerald-200 block uppercase tracking-wider">
                      Live Detector
                    </span>
                    <span className="text-sm font-bold text-white block">
                      Rapid Visual Scan
                    </span>
                  </div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                  &lt;1.2s Latency
                </span>
              </div>

              {/* Mini Preview Thumbnail with Bounding Box Graphic */}
              <div className="relative rounded-xl overflow-hidden border border-white/15 aspect-16/10">
                <img
                  src="/assets/images/sample-rubble.jpg"
                  alt="Vision model detecting concrete and rebar"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-3 flex flex-col justify-end">
                  <div className="flex items-center gap-1.5 text-[11px] text-white font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Multi-Class Boundary Segmentation</span>
                  </div>
                </div>
              </div>

              {/* Core Metrics */}
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-xl font-black text-white block">6+</span>
                  <span className="text-[10px] text-emerald-200 font-medium">
                    Material Classes
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-xl font-black text-[#dfb163] block">CSV</span>
                  <span className="text-[10px] text-emerald-200 font-medium">
                    Audit Export
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-300 leading-normal italic text-center">
                Visual estimates assist with on-site sorting prior to transport.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Wave Transition */}
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-[#fafbf9] to-transparent pointer-events-none" />
    </section>
  );
};
