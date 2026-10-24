import React from 'react';
import type { RecoveryRecommendation } from '../../types/analysis';
import { Sparkles, ArrowUpRight, Leaf, Building2 } from 'lucide-react';

interface RecoveryRecommendationsProps {
  recommendations: RecoveryRecommendation[];
}

export const RecoveryRecommendations: React.FC<RecoveryRecommendationsProps> = ({
  recommendations,
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h4 className="text-lg font-bold text-[#1c503a] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#dfb163]" />
            <span>Circular Recovery Recommendations</span>
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Suggested recycling streams, material grading and downstream secondary markets
          </p>
        </div>
        <span className="hidden sm:inline-flex text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
          Circular Pathways
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="p-4 rounded-xl border border-slate-200/80 bg-[#fafcfb] hover:bg-white hover:border-emerald-300 transition-all flex flex-col justify-between group shadow-2xs"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[11px] font-bold tracking-wide uppercase text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">
                    {rec.material}
                  </span>
                  <h5 className="text-sm font-bold text-slate-900 mt-2 group-hover:text-[#097e51] transition-colors flex items-center gap-1">
                    <span>{rec.pathway}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h5>
                </div>
                <div
                  className={`px-2 py-0.5 rounded text-xs font-bold ${
                    rec.recovery_grade === 'A'
                      ? 'bg-emerald-600 text-white'
                      : rec.recovery_grade === 'B'
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-600 text-white'
                  }`}
                  title={`Recovery Grade ${rec.recovery_grade}`}
                >
                  Grade {rec.recovery_grade}
                </div>
              </div>

              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                {rec.action}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-700">
                <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-medium text-slate-500">Destination:</span>
                <span className="font-semibold text-slate-800">{rec.target_industry}</span>
              </div>
              <div className="flex items-start gap-1.5 text-emerald-800 bg-emerald-50/70 p-2 rounded-lg">
                <Leaf className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-snug">{rec.environmental_benefit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
