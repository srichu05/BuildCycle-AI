import React, { useState } from 'react';
import { SectionTitle } from '../ui/SectionTitle';
import { insightsData } from '../../data/insightsData';
import type { InsightArticle } from '../../data/insightsData';
import { Modal } from '../ui/Modal';
import { ArrowRight, Calendar, Clock, BookOpen, CheckCircle2 } from 'lucide-react';

export const InsightsSection: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<InsightArticle | null>(null);

  return (
    <section id="insights" className="py-20 sm:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Intro Card (inspired by Ecotrix index-2 blog intro wrap) */}
          <div className="lg:col-span-4 bg-[#f4f8f6] rounded-3xl p-8 border border-emerald-900/10 space-y-6 lg:sticky lg:top-28">
            <SectionTitle
              subtitle="Latest Insights"
              title="Circular Waste"
              highlightText="Knowledge & Guides"
              description="Stay informed with practical engineering guides, segregation best practices, and technological developments in circular construction."
              className="mb-0"
            />

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>Industry Focus</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Articles grounded in real-world demolition challenges, regulatory recycling quotas, and computer vision feasibility.
              </p>
            </div>
          </div>

          {/* Right Column: 4 Articles 2x2 Grid */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {insightsData.map((article) => (
                <div
                  key={article.id}
                  onClick={() => setSelectedArticle(article)}
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-emerald-400 transition-all duration-300 flex flex-col justify-between cursor-pointer transform hover:-translate-y-1"
                >
                  <div>
                    {/* Article Thumbnail */}
                    <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] font-bold text-[#097e51] uppercase tracking-wide shadow-2xs">
                        {article.category}
                      </div>
                    </div>

                    {/* Metadata & Title */}
                    <div className="p-5 space-y-2.5">
                      <div className="flex items-center gap-3 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{article.date}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{article.readTime}</span>
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-[#1c503a] group-hover:text-[#097e51] transition-colors leading-snug">
                        {article.title}
                      </h4>

                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                        {article.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* Read More Footer */}
                  <div className="px-5 pb-5 pt-2 flex items-center justify-between text-xs font-bold text-[#097e51] border-t border-slate-100 group-hover:text-[#1c503a]">
                    <span>Read Full Guide</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Article Detail Reader Modal */}
      {selectedArticle && (
        <Modal
          isOpen={!!selectedArticle}
          onClose={() => setSelectedArticle(null)}
          subtitle={`${selectedArticle.category} • ${selectedArticle.date} • ${selectedArticle.readTime}`}
          title={selectedArticle.title}
          maxWidth="4xl"
        >
          <div className="space-y-6">
            <div className="rounded-xl overflow-hidden aspect-16/9 relative shadow-md">
              <img
                src={selectedArticle.image}
                alt={selectedArticle.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Key Takeaways Box */}
            <div className="bg-[#f4f8f6] p-5 rounded-2xl border border-emerald-900/10 space-y-2.5">
              <h5 className="font-bold text-xs uppercase tracking-wider text-[#1c503a]">
                Key Takeaways
              </h5>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {selectedArticle.keyTakeaways.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Body Text */}
            <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
              {selectedArticle.content.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="theme-btn text-xs py-2 px-6 cursor-pointer"
              >
                Close Article
              </button>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
};
