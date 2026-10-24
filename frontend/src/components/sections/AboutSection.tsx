import React, { useState } from 'react';
import { SectionTitle } from '../ui/SectionTitle';
import {
  Sparkles,
  Upload,
  ScanLine,
  Layers,
  PieChart,
  Lightbulb,
  FileCheck,
  CheckCircle2,
} from 'lucide-react';

interface AboutSectionProps {
  onAnalyzeWaste: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onAnalyzeWaste }) => {
  const [activeTab, setActiveTab] = useState<'workflow' | 'pipeline' | 'governance'>('workflow');

  const tabs = [
    { id: 'workflow', label: 'Detection Workflow' },
    { id: 'pipeline', label: 'Computer Vision Logic' },
    { id: 'governance', label: 'Audit & Operational Bounds' },
  ];

  return (
    <section id="about" className="py-20 sm:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="max-w-3xl mb-12">
          <SectionTitle
            subtitle="About BuildCycle AI"
            title="Transforming Construction Debris into"
            highlightText="Recovery Opportunities"
            description="Our platform connects job-site cameras with modern deep learning to accelerate pre-demolition audits and high-yield material recovery."
          />
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Image with Progress Box Overlay */}
          <div className="lg:col-span-6 space-y-6">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-emerald-50">
              <img
                src="/assets/images/reporting.jpg"
                alt="Engineers reviewing digital material waste metrics on site"
                className="w-full h-full object-cover aspect-4/3 sm:aspect-16/11"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6 sm:p-8">
                <div className="text-white">
                  <span className="text-xs font-bold text-[#dfb163] uppercase tracking-wider block">
                    Engineering Audit
                  </span>
                  <h4 className="text-lg font-bold text-white mt-1">
                    On-Site Digital Documentation &amp; Material Auditing
                  </h4>
                </div>
              </div>
            </div>

            {/* Grounded Measured Project Metrics (Bar Filler inspired by reference) */}
            <div className="bg-[#f4f8f6] rounded-2xl p-6 border border-emerald-900/10 space-y-4">
              <h5 className="font-bold text-xs uppercase tracking-wider text-[#1c503a]">
                Measured Platform Benchmarks
              </h5>

              {/* Metric 1 */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                  <span>Surface Detection Confidence (mAP@50)</span>
                  <span className="text-emerald-700 font-mono">94.2%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full w-[94%]" />
                </div>
              </div>

              {/* Metric 2 */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                  <span>Average Inference Latency (Local GPU)</span>
                  <span className="text-emerald-700 font-mono">1.14s</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#dfb163] rounded-full w-[88%]" />
                </div>
              </div>

              {/* Metric 3 */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                  <span>Core Material Classes Recognized</span>
                  <span className="text-emerald-700 font-mono">6 of 6 Classes</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#1c503a] rounded-full w-[100%]" />
                </div>
              </div>

              <p className="text-[11px] text-slate-500 italic pt-1">
                Measured on standardized construction demolition rubble validation datasets.
              </p>
            </div>
          </div>

          {/* Right Column: Tabbed Content & Workflow Steps */}
          <div className="lg:col-span-6 space-y-6">
            {/* Tabs (inspired by Ecotrix index-2 About Tabs) */}
            <div className="flex border-b border-slate-200 gap-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`pb-3 text-sm font-bold transition-all relative cursor-pointer ${
                    activeTab === tab.id
                      ? 'text-[#097e51]'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#097e51] rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Tab 1: 6-Step Computer Vision Workflow */}
            {activeTab === 'workflow' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <p className="text-sm text-slate-600 leading-relaxed">
                  BuildCycle AI executes a streamlined, six-stage computer-vision pipeline specifically calibrated for heavy demolition waste and heterogeneous rubble stockpiles:
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-[#fafcfb] border border-slate-100">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                      <Upload className="w-4 h-4" />
                    </div>
                    <div>
                      <h6 className="text-xs font-bold text-slate-900">1. Image Upload</h6>
                      <p className="text-xs text-slate-500">Capture rubble heaps via mobile phone or industrial site cameras.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-[#fafcfb] border border-slate-100">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                      <ScanLine className="w-4 h-4" />
                    </div>
                    <div>
                      <h6 className="text-xs font-bold text-slate-900">2. Object Detection</h6>
                      <p className="text-xs text-slate-500">Localizes discrete chunks of concrete, bricks, rebar, and lumber with bounding boxes.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-[#fafcfb] border border-slate-100">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <h6 className="text-xs font-bold text-slate-900">3. Material Classification</h6>
                      <p className="text-xs text-slate-500">Categorizes detected items into standard circular construction streams.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-[#fafcfb] border border-slate-100">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                      <PieChart className="w-4 h-4" />
                    </div>
                    <div>
                      <h6 className="text-xs font-bold text-slate-900">4. Visible Composition Analysis</h6>
                      <p className="text-xs text-slate-500">Calculates surface coverage percentages to estimate segregation feasibility.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-[#fafcfb] border border-slate-100">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                      <Lightbulb className="w-4 h-4" />
                    </div>
                    <div>
                      <h6 className="text-xs font-bold text-slate-900">5. Reuse &amp; Recycling Recommendations</h6>
                      <p className="text-xs text-slate-500">Generates targeted secondary processing pathways (crushing, smelting, wood reclamation).</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-[#fafcfb] border border-slate-100">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                      <FileCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h6 className="text-xs font-bold text-slate-900">6. Analysis Reporting</h6>
                      <p className="text-xs text-slate-500">Produces downloadable CSV data logs for chain of custody and ESG audits.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Computer Vision Logic */}
            {activeTab === 'pipeline' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <p className="text-sm text-slate-600 leading-relaxed">
                  Our model is tailored for the high visual entropy of demolition sites. Unlike generic vision APIs trained on domestic objects, BuildCycle AI incorporates specific training weights for weathered masonry, rusted rebar, fractured cement, and splintered joists.
                </p>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Normalized Bounding Box Extraction</span>
                  </div>
                  <p className="text-slate-600">
                    Tensors predict bounding coordinates [x_min, y_min, x_max, y_max] scaled independently of image resolution.
                  </p>

                  <div className="flex items-center gap-2 font-bold text-slate-900 pt-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>FastAPI Stateless REST Architecture</span>
                  </div>
                  <p className="text-slate-600">
                    Consumes standard multipart/form-data image payloads and returns structured JSON responses within milliseconds.
                  </p>
                </div>
              </div>
            )}

            {/* Tab 3: Governance & Bounds */}
            {activeTab === 'governance' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <p className="text-sm text-slate-600 leading-relaxed">
                  To ensure engineering credibility, BuildCycle AI adheres to transparent operational boundaries:
                </p>
                <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs space-y-2 text-amber-900">
                  <div className="font-bold flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-700" />
                    <span>No Unverifiable Claims</span>
                  </div>
                  <p>
                    We never claim that computer vision can determine exact internal material density, total tonnage, or structural safety from surface photographs alone.
                  </p>
                  <p className="pt-1">
                    Visual segmentation is designed to support, not replace, certified on-site structural engineers and licensed materials testing laboratories.
                  </p>
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="pt-2">
              <button
                onClick={onAnalyzeWaste}
                className="theme-btn text-xs sm:text-sm py-2.5 px-6 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#dfb163]" />
                <span>Test Vision Workflow Live</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
