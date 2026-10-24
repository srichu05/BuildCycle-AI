import React from 'react';
import { SectionTitle } from '../ui/SectionTitle';
import { processSteps } from '../../data/processData';
import {
  UploadCloud,
  ScanLine,
  PieChart,
  Lightbulb,
  Download,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface ProcessSectionProps {
  onAnalyzeWaste: () => void;
}

export const ProcessSection: React.FC<ProcessSectionProps> = ({ onAnalyzeWaste }) => {
  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case 'UploadCloud':
        return <UploadCloud className="w-6 h-6" />;
      case 'ScanLine':
        return <ScanLine className="w-6 h-6" />;
      case 'PieChart':
        return <PieChart className="w-6 h-6" />;
      case 'Lightbulb':
        return <Lightbulb className="w-6 h-6" />;
      case 'Download':
        return <Download className="w-6 h-6" />;
      default:
        return <Sparkles className="w-6 h-6" />;
    }
  };

  return (
    <section id="process" className="py-20 sm:py-28 bg-[#fafcfb] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <SectionTitle
            subtitle="Our Process"
            title="From Collection to Recovery,"
            highlightText="Every Step Simplified"
            description="Our 5-step visual workflow turns raw job-site debris photos into structured material intelligence and actionable secondary market pathways."
            className="mb-0"
          />

          <div className="hidden md:block shrink-0">
            <button
              onClick={onAnalyzeWaste}
              className="theme-btn text-xs py-2.5 px-5 font-bold cursor-pointer"
            >
              <span>Try Step 1: Upload</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 5 Steps Process Grid with Visual Connectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative">
          {processSteps.map((step) => (
            <div
              key={step.stepNumber}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-emerald-400 transition-all duration-300 flex flex-col justify-between relative group"
            >
              <div>
                {/* Step Icon and Number Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#E5F0EC] text-[#097e51] flex items-center justify-center group-hover:bg-[#097e51] group-hover:text-white transition-colors duration-300 shadow-xs">
                    {getStepIcon(step.iconName)}
                  </div>
                  <span className="text-3xl font-black text-slate-300 group-hover:text-[#dfb163] transition-colors font-mono">
                    {step.stepNumber}
                  </span>
                </div>

                {/* Step Title & Description */}
                <h4 className="text-base font-bold text-[#1c503a] group-hover:text-[#097e51] transition-colors mb-2 leading-snug">
                  {step.title}
                </h4>

                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  {step.description}
                </p>
              </div>

              {/* Step Sub-details footer */}
              <div className="pt-3 border-t border-slate-100 text-[11px] text-emerald-800 font-medium">
                {step.details}
              </div>
            </div>
          ))}
        </div>

        {/* Process Visual Banner */}
        <div className="mt-12 rounded-3xl overflow-hidden border border-emerald-900/10 shadow-lg relative bg-[#1c503a] text-white p-8 sm:p-12">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-bold text-[#dfb163] uppercase tracking-wider block">
              FastAPI + TensorRT Integration Ready
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold">
              Ready to automate construction waste classification?
            </h3>
            <p className="text-sm text-emerald-100/80 leading-relaxed">
              Integrate BuildCycle AI into existing mobile inspection apps or weighbridge systems using our clean REST API contract.
            </p>
            <div className="pt-2 flex items-center gap-4">
              <button
                onClick={onAnalyzeWaste}
                className="white-btn text-xs sm:text-sm py-2.5 px-5 font-bold cursor-pointer"
              >
                <span>Launch Analysis Workspace</span>
                <ArrowRight className="w-4 h-4 text-[#097e51]" />
              </button>
            </div>
          </div>

          {/* Background image overlay */}
          <div className="absolute inset-y-0 right-0 w-full sm:w-1/2 opacity-20 sm:opacity-40 pointer-events-none">
            <img
              src="/assets/images/roadbase.jpg"
              alt="Road construction with recycled aggregate"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1c503a] via-[#1c503a]/80 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
};
