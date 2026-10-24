import React, { useState } from 'react';
import { SectionTitle } from '../ui/SectionTitle';
import { servicesData } from '../../data/servicesData';
import type { ServiceItem } from '../../data/servicesData';
import { Modal } from '../ui/Modal';
import {
  ArrowRight,
  Building2,
  Layers,
  Trees,
  Wrench,
  Package,
  Shuffle,
  FileSpreadsheet,
  Route,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface ServicesSectionProps {
  onAnalyzeWaste: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onAnalyzeWaste }) => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building2':
        return <Building2 className="w-5 h-5" />;
      case 'Layers':
        return <Layers className="w-5 h-5" />;
      case 'Trees':
        return <Trees className="w-5 h-5" />;
      case 'Wrench':
        return <Wrench className="w-5 h-5" />;
      case 'Package':
        return <Package className="w-5 h-5" />;
      case 'Shuffle':
        return <Shuffle className="w-5 h-5" />;
      case 'FileSpreadsheet':
        return <FileSpreadsheet className="w-5 h-5" />;
      case 'Route':
        return <Route className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <section id="services" className="py-20 sm:py-28 bg-[#f4f8f6] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 lg:mb-16">
          <SectionTitle
            subtitle="What We Do"
            title="AI-Powered Intelligence for"
            highlightText="Construction Waste"
            description="We deploy specialized computer vision pipelines across 8 key material streams to maximize sorting accuracy and circular resource recovery."
            className="mb-0"
          />

          <div className="hidden md:block shrink-0">
            <button
              onClick={onAnalyzeWaste}
              className="bordered-btn text-xs py-2.5 px-5 font-bold cursor-pointer hover:bg-emerald-800"
            >
              <span>Test All 8 Streams</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 8 Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {servicesData.map((service) => (
            <div
              key={service.id}
              onClick={() => setSelectedService(service)}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-emerald-400 transition-all duration-300 flex flex-col justify-between cursor-pointer transform hover:-translate-y-1.5"
            >
              <div>
                {/* Image Container with subtle zoom */}
                <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Icon badge */}
                  <div className="absolute top-3 left-3 w-10 h-10 rounded-xl bg-white/95 text-[#097e51] flex items-center justify-center shadow-md backdrop-blur-xs group-hover:bg-[#097e51] group-hover:text-white transition-colors duration-300">
                    {getIcon(service.iconName)}
                  </div>

                  {/* Circular Tag */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="text-[10px] font-bold text-white bg-slate-900/80 backdrop-blur-xs px-2.5 py-1 rounded-md tracking-wide uppercase inline-block">
                      {service.circularTag}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-2">
                  <h4 className="text-base font-bold text-[#1c503a] group-hover:text-[#097e51] transition-colors leading-snug">
                    {service.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                    {service.description}
                  </p>
                </div>
              </div>

              {/* Card Footer Link */}
              <div className="px-5 pb-5 pt-2 flex items-center justify-between text-xs font-bold text-[#097e51] border-t border-slate-100/80 group-hover:text-[#1c503a]">
                <span>Explore Recovery Specs</span>
                <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-[#097e51] group-hover:text-white transition-colors">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service Detail Modal */}
      {selectedService && (
        <Modal
          isOpen={!!selectedService}
          onClose={() => setSelectedService(null)}
          subtitle={selectedService.subtitle}
          title={selectedService.title}
        >
          <div className="space-y-6">
            <div className="rounded-xl overflow-hidden aspect-16/9 relative shadow-md">
              <img
                src={selectedService.image}
                alt={selectedService.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-semibold text-emerald-300">
                {selectedService.circularTag}
              </div>
            </div>

            <div>
              <h5 className="font-bold text-sm text-[#1c503a] mb-2">
                Operational Overview
              </h5>
              <p className="text-sm text-slate-600 leading-relaxed">
                {selectedService.description}
              </p>
            </div>

            <div className="bg-[#f4f8f6] p-4 rounded-xl space-y-2">
              <h5 className="font-bold text-xs uppercase tracking-wider text-emerald-800">
                Key Computer Vision Capabilities
              </h5>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {selectedService.bulletPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedService(null)}
                className="bordered-btn text-xs py-2 px-4 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedService(null);
                  onAnalyzeWaste();
                }}
                className="theme-btn text-xs py-2 px-4 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#dfb163]" />
                <span>Analyze with This Stream</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
};
