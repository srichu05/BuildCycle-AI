import React, { useState } from 'react';
import { SectionTitle } from '../ui/SectionTitle';
import { stakeholderScenarios } from '../../data/stakeholderData';
import { Quote, ChevronLeft, ChevronRight, HardHat, Info } from 'lucide-react';

export const StakeholderBenefitsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => {
    setCurrentIndex((prevIdx) => (prevIdx === 0 ? stakeholderScenarios.length - 1 : prevIdx - 1));
  };

  const next = () => {
    setCurrentIndex((prevIdx) => (prevIdx === stakeholderScenarios.length - 1 ? 0 : prevIdx + 1));
  };

  const current = stakeholderScenarios[currentIndex];

  return (
    <section className="py-20 sm:py-28 bg-[#f4f8f6] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 lg:mb-16">
          <SectionTitle
            subtitle="Project Benefits & Stakeholder Perspectives"
            title="Designed for Every Link in the"
            highlightText="Recovery Chain"
            description="Explore how automated computer vision addresses operational bottlenecks across demolition sites, recycling yards, and environmental audit workflows."
            className="mb-0"
          />

          {/* Carousel Arrows */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={prev}
              aria-label="Previous scenario"
              className="w-11 h-11 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-[#097e51] hover:text-white hover:border-[#097e51] transition-all flex items-center justify-center shadow-xs cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              aria-label="Next scenario"
              className="w-11 h-11 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-[#097e51] hover:text-white hover:border-[#097e51] transition-all flex items-center justify-center shadow-xs cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notice of Illustrative Stakeholder Scenarios */}
        <div className="mb-6 inline-flex items-center gap-2 text-xs text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
          <Info className="w-3.5 h-3.5 text-emerald-600" />
          <span>
            Illustrative stakeholder scenarios based on standard circular construction recovery workflows.
          </span>
        </div>

        {/* Featured Testimonial/Benefit Card (inspired by Ecotrix index-2 single-testimonial-wrap) */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-md relative overflow-hidden transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Large Quote & Content (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#097e51] flex items-center justify-center">
                <Quote className="w-6 h-6" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-2">
                  Theme: {current.theme}
                </span>
                <p className="text-lg sm:text-xl lg:text-2xl font-medium text-slate-800 leading-relaxed italic">
                  &ldquo;{current.quote}&rdquo;
                </p>
              </div>

              {/* Stakeholder Identity */}
              <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                <div
                  className={`w-12 h-12 rounded-full ${current.avatarBg} text-white flex items-center justify-center font-bold text-sm shadow-md`}
                >
                  <HardHat className="w-6 h-6 text-[#dfb163]" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#1c503a]">
                    {current.role}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {current.sector}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Key Benefit Metric Highlight (4 cols) */}
            <div className="lg:col-span-4 bg-[#f4f8f6] rounded-2xl p-6 border border-emerald-900/10 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1c503a] block">
                Operational Advantage
              </span>

              <div className="p-4 rounded-xl bg-white border border-slate-100">
                <span className="text-xs text-slate-500 block">
                  {current.metricsLabel}
                </span>
                <span className="text-2xl font-black text-[#097e51] font-mono block mt-1">
                  {current.metricsValue}
                </span>
              </div>

              <div className="text-xs text-slate-700 leading-relaxed">
                <strong className="text-slate-900 block mb-1">Impact:</strong>
                {current.keyBenefit}
              </div>

              {/* Scenario indicators */}
              <div className="flex gap-2 pt-2">
                {stakeholderScenarios.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    aria-label={`Go to scenario ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      i === currentIndex ? 'w-8 bg-[#097e51]' : 'w-2 bg-slate-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
