import React from 'react';
import { Layers, ShieldCheck } from 'lucide-react';

interface MaterialCountCardsProps {
  materialCounts: Record<string, number>;
  onFilterClass?: (materialClass: string | null) => void;
  selectedClass?: string | null;
}

export const MaterialCountCards: React.FC<MaterialCountCardsProps> = ({
  materialCounts,
}) => {
  const countEntries = Object.entries(materialCounts);
  const totalCount = countEntries.reduce((sum, [, count]) => sum + count, 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-base font-bold text-[#1c503a] flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-600" />
          <span>Material Fraction Counts</span>
        </h4>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
          Total: {totalCount} Fragments
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {countEntries.map(([name, count]) => {
          return (
            <div
              key={name}
              className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <span className="text-[11px] font-medium text-slate-500 line-clamp-1">
                {name}
              </span>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-black text-[#1c503a]">
                  {count}
                </span>
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                  {Math.round((count / totalCount) * 100)}%
                </span>
              </div>
              <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                <span>Verified Class</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
