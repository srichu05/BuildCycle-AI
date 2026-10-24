import React, { useState, useEffect } from 'react';
import { Layers, Menu, X, Sparkles, ArrowRight } from 'lucide-react';
import { OffcanvasDrawer } from './OffcanvasDrawer';

interface HeaderProps {
  onOpenAnalysis: () => void;
  onOpenAudit: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAnalysis, onOpenAudit }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'About', href: '#about' },
    { label: 'How It Works', href: '#process' },
    { label: 'AI Waste Analysis', href: '#analysis-workspace', isHighlight: true },
    { label: 'Recovery Solutions', href: '#services' },
    { label: 'Insights', href: '#insights' },
    { label: 'Contact', href: '#quote' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md py-3 border-b border-emerald-950/10'
            : 'bg-white py-4 border-b border-slate-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <a href="#hero" className="flex items-center gap-3 group focus:outline-none">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#097e51] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-300">
                <Layers className="w-6 h-6 text-[#dfb163]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-[#1c503a] leading-tight">
                  BuildCycle <span className="text-[#097e51]">AI</span>
                </span>
                <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 tracking-wider uppercase">
                  WasteVision Platform
                </span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={`text-sm font-semibold transition-colors duration-200 ${
                    link.isHighlight
                      ? 'text-[#097e51] hover:text-[#1c503a] flex items-center gap-1.5'
                      : 'text-slate-700 hover:text-[#097e51]'
                  }`}
                >
                  {link.isHighlight && <Sparkles className="w-3.5 h-3.5 text-[#dfb163]" />}
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Header Right Actions */}
            <div className="flex items-center gap-3">
              {/* Prominent CTA */}
              <button
                onClick={onOpenAnalysis}
                className="theme-btn text-xs sm:text-sm py-2.5 px-4 sm:px-5 shadow-sm hover:shadow-md hidden sm:inline-flex cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#dfb163]" />
                <span>Analyze Construction Waste</span>
              </button>

              {/* Offcanvas Drawer Trigger (inspired by Ecotrix index-2 3-line trigger) */}
              <button
                onClick={() => setIsOffcanvasOpen(true)}
                aria-label="Open detailed platform menu"
                className="w-10 h-10 rounded-lg bg-[#f4f8f6] hover:bg-[#e6f4ee] text-[#1c503a] flex flex-col items-center justify-center gap-1.5 transition-colors border border-emerald-900/10 cursor-pointer"
              >
                <span className="w-5 h-0.5 bg-[#1c503a] rounded-full transition-all" />
                <span className="w-3.5 h-0.5 bg-[#097e51] rounded-full transition-all" />
                <span className="w-5 h-0.5 bg-[#1c503a] rounded-full transition-all" />
              </button>

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle mobile menu"
                className="lg:hidden p-2 text-slate-700 hover:text-[#097e51] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 mt-3 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`py-2 px-3 rounded-lg text-sm font-semibold flex items-center justify-between ${
                    link.isHighlight
                      ? 'bg-emerald-50 text-[#097e51]'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-[#097e51]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {link.isHighlight && <Sparkles className="w-4 h-4 text-[#dfb163]" />}
                    {link.label}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </a>
              ))}
            </nav>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAnalysis();
                }}
                className="w-full theme-btn py-3 text-sm justify-center cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#dfb163]" />
                <span>Analyze Construction Waste</span>
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAudit();
                }}
                className="w-full bordered-btn py-2.5 text-xs justify-center cursor-pointer"
              >
                <span>Request Site Assessment</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Offcanvas Drawer */}
      <OffcanvasDrawer
        isOpen={isOffcanvasOpen}
        onClose={() => setIsOffcanvasOpen(false)}
        onOpenAnalysis={onOpenAnalysis}
        onOpenAudit={onOpenAudit}
      />
    </>
  );
};
