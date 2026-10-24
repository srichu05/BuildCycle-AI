import React from 'react';
import { Layers, Sparkles, Phone, Mail, MapPin, ArrowRight, ShieldCheck, GitBranch, Globe } from 'lucide-react';

interface FooterProps {
  onAnalyzeWaste: () => void;
  onRequestAudit: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onAnalyzeWaste, onRequestAudit }) => {
  return (
    <footer id="contact" className="bg-[#103424] text-white pt-16 sm:pt-20 border-t border-emerald-900/50 relative overflow-hidden">
      {/* Top Banner Row (inspired by Ecotrix footer-content-wrap) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 border-b border-emerald-800/60">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-3">
            <span className="text-xs font-bold text-[#dfb163] uppercase tracking-wider block">
              WasteVision Initiative
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              We Can Build a Circular Construction{' '}
              <span className="text-[#dfb163]">Future Together</span>
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/80 max-w-2xl leading-relaxed">
              BuildCycle AI transforms heavy demolition debris from an unsegregated landfill burden into certified circular resources, reducing virgin quarry extraction and lowering construction embodied carbon.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3">
            <button
              onClick={onAnalyzeWaste}
              className="w-full sm:w-auto white-btn text-xs sm:text-sm py-3 px-6 font-bold cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#097e51]" />
              <span>Launch Waste Analysis</span>
            </button>
            <button
              onClick={onRequestAudit}
              className="w-full sm:w-auto text-xs py-2.5 px-4 font-semibold text-emerald-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Request Job-Site Audit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main 4-Column Links Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Col 1: Brand & Parent Initiative (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
                <Layers className="w-6 h-6 text-[#dfb163]" />
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-tight leading-none block">
                  BuildCycle <span className="text-[#dfb163]">AI</span>
                </span>
                <span className="text-[10px] text-emerald-300 font-semibold uppercase tracking-wider block mt-0.5">
                  WasteVision Platform
                </span>
              </div>
            </div>

            <p className="text-xs text-emerald-100/70 leading-relaxed max-w-sm">
              AI-powered construction and demolition waste intelligence. Automated photographic material identification, visible composition segmentation, and circular secondary destination matching.
            </p>

            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/40 text-[11px] text-emerald-300 space-y-1">
              <div className="font-semibold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#dfb163]" />
                <span>Backend Architecture</span>
              </div>
              <p className="text-emerald-200/80">
                Designed for FastAPI, YOLOv11, OpenCV, and Neon PostgreSQL.
              </p>
            </div>
          </div>

          {/* Col 2: Navigation Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#dfb163]">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-emerald-100/80">
              <li>
                <a href="#hero" className="hover:text-white transition-colors">Home</a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors">About Us</a>
              </li>
              <li>
                <a href="#process" className="hover:text-white transition-colors">How It Works</a>
              </li>
              <li>
                <a href="#analysis-workspace" className="hover:text-white transition-colors flex items-center gap-1 text-emerald-300">
                  <Sparkles className="w-3 h-3 text-[#dfb163]" />
                  <span>AI Waste Analysis</span>
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">Recovery Solutions</a>
              </li>
              <li>
                <a href="#insights" className="hover:text-white transition-colors">Insights &amp; News</a>
              </li>
              <li>
                <a href="#quote" className="hover:text-white transition-colors">Site Assessment</a>
              </li>
            </ul>
          </div>

          {/* Col 3: Solution Streams (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#dfb163]">
              Recovery Streams
            </h4>
            <ul className="space-y-2 text-xs text-emerald-100/80">
              <li>
                <a href="#services" className="hover:text-white transition-colors">Concrete Rubble &amp; Sub-base</a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">Structural Steel Rebar &amp; Wire</a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">Reclaimed Facing Bricks</a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">Dimensional Framing Timber</a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">Rigid PVC Conduit &amp; Polymers</a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">Mixed Heterogeneous Debris</a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">Audit-Ready CSV Reports</a>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Location Placeholders (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#dfb163]">
              Project Contact
            </h4>
            <div className="space-y-2.5 text-xs text-emerald-100/80">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  WasteVision Circular Research Hub<br />
                  Sustainable Civil Engineering District<br />
                  United States / Global Initiative
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+1 (800) 458-WASTE</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>intelligence@buildcycle.ai</span>
              </div>
              <div className="pt-2 flex items-center gap-3 text-slate-300">
                <span className="p-2 rounded-lg bg-emerald-900/60 hover:text-white hover:bg-emerald-800 transition-colors cursor-pointer" title="GitHub Repository">
                  <GitBranch className="w-4 h-4" />
                </span>
                <span className="p-2 rounded-lg bg-emerald-900/60 hover:text-white hover:bg-emerald-800 transition-colors cursor-pointer" title="WasteVision Parent Initiative">
                  <Globe className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sustainability Closing & Copyright Strip */}
      <div className="bg-[#0b2419] py-6 border-t border-emerald-950 text-xs text-emerald-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <span>© {new Date().getFullYear()} </span>
            <strong className="text-white font-semibold">BuildCycle AI</strong>
            <span> — An initiative of </span>
            <strong className="text-emerald-300 font-semibold">WasteVision: AI for a Cleaner Future</strong>
            <span>. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <a href="#about" className="hover:text-white transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#about" className="hover:text-white transition-colors">Terms of Service</a>
            <span>•</span>
            <a href="#analysis-workspace" className="hover:text-white transition-colors">API Architecture</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
