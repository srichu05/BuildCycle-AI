import React from 'react';
import { X, Sparkles, Cpu, Layers, ArrowRight, ShieldCheck, Mail, MapPin } from 'lucide-react';
import { API_BASE_URL } from '../../services/api';

interface OffcanvasDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAnalysis: () => void;
  onOpenAudit: () => void;
}

export const OffcanvasDrawer: React.FC<OffcanvasDrawerProps> = ({
  isOpen,
  onClose,
  onOpenAnalysis,
  onOpenAudit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#1c503a] text-white p-6 sm:p-8 flex flex-col justify-between shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
          <div>
            {/* Top close button and logo */}
            <div className="flex items-center justify-between pb-6 border-b border-emerald-800/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
                  <Layers className="w-6 h-6 text-[#dfb163]" />
                </div>
                <div>
                  <span className="text-xl font-bold tracking-tight text-white block">
                    BuildCycle <span className="text-[#dfb163]">AI</span>
                  </span>
                  <span className="text-[10px] text-emerald-300 tracking-wider uppercase block">
                    WasteVision Initiative
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                aria-label="Close menu"
                className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-emerald-900/40 transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mission Statement */}
            <div className="mt-6 space-y-4">
              <h4 className="text-lg font-semibold text-white">
                Smarter Decisions for a Circular Construction Industry
              </h4>
              <p className="text-sm text-emerald-100/80 leading-relaxed">
                BuildCycle AI applies computer vision to identify construction and demolition debris,
                quantify visible surface compositions, and unlock circular recovery pathways for contractors and recyclers.
              </p>
            </div>

            {/* Interactive Image Preview in Offcanvas */}
            <div className="mt-6 rounded-xl overflow-hidden border border-emerald-800/60 shadow-lg relative group">
              <img
                src="/assets/images/facility.jpg"
                alt="Automated Material Sorting Facility"
                className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3">
                <span className="text-xs font-medium text-emerald-200">
                  Sustainable Material Recovery & Automated Optical Sorting
                </span>
              </div>
            </div>

            {/* Backend Integration Contract Info */}
            <div className="mt-6 p-4 rounded-xl bg-emerald-900/40 border border-emerald-700/40 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#dfb163] uppercase tracking-wider">
                <Cpu className="w-4 h-4" />
                <span>Backend Architecture</span>
              </div>
              <p className="text-xs text-emerald-100/70">
                Prepared for FastAPI + YOLOv11 inference server:
              </p>
              <code className="text-[11px] block bg-slate-950/60 px-2 py-1 rounded text-emerald-300 font-mono truncate">
                POST {API_BASE_URL}/api/v1/analyses
              </code>
            </div>

            {/* Quick Navigation Links */}
            <div className="mt-6 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300/80">
                Explore Sections
              </span>
              <nav className="flex flex-col space-y-1 text-sm font-medium">
                <a
                  href="#hero"
                  onClick={onClose}
                  className="py-1.5 text-slate-200 hover:text-white transition-colors flex items-center justify-between"
                >
                  <span>Home</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                </a>
                <a
                  href="#about"
                  onClick={onClose}
                  className="py-1.5 text-slate-200 hover:text-white transition-colors flex items-center justify-between"
                >
                  <span>About Platform</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                </a>
                <a
                  href="#services"
                  onClick={onClose}
                  className="py-1.5 text-slate-200 hover:text-white transition-colors flex items-center justify-between"
                >
                  <span>What We Do — 8 Services</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                </a>
                <a
                  href="#process"
                  onClick={onClose}
                  className="py-1.5 text-slate-200 hover:text-white transition-colors flex items-center justify-between"
                >
                  <span>5-Step Workflow</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                </a>
                <a
                  href="#analysis-workspace"
                  onClick={() => {
                    onClose();
                    onOpenAnalysis();
                  }}
                  className="py-1.5 text-emerald-300 font-semibold hover:text-white transition-colors flex items-center justify-between"
                >
                  <span>Interactive Waste Analysis</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#dfb163]" />
                </a>
                <a
                  href="#insights"
                  onClick={onClose}
                  className="py-1.5 text-slate-200 hover:text-white transition-colors flex items-center justify-between"
                >
                  <span>Insights & Articles</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                </a>
              </nav>
            </div>
          </div>

          {/* Bottom Action */}
          <div className="pt-6 border-t border-emerald-800/60 space-y-3">
            <button
              onClick={() => {
                onClose();
                onOpenAnalysis();
              }}
              className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-lg cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch AI Waste Analysis</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenAudit();
              }}
              className="w-full py-2.5 px-4 rounded-xl border border-emerald-600/70 hover:bg-emerald-900/50 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#dfb163]" />
              <span>Request Debris Audit</span>
            </button>

            <div className="text-[11px] text-emerald-200/60 text-center space-y-1 pt-2">
              <div className="flex items-center justify-center gap-1.5">
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span>WasteVision Circular Innovation Lab</span>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <Mail className="w-3 h-3 text-emerald-400" />
                <span>contact@buildcycle.ai</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
