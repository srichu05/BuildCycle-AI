import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import type { CompositionItem } from '../../types/analysis';

interface CompositionChartProps {
  composition: CompositionItem[];
}

export const CompositionChart: React.FC<CompositionChartProps> = ({ composition }) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-base font-bold text-[#1c503a]">
            Visible Material Distribution
          </h4>
          <p className="text-xs text-slate-500">
            Estimated surface area percentage from 2D pixel coverage
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
          Surface Ratio
        </span>
      </div>

      <div className="w-full h-56 sm:h-64 relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={composition}
              dataKey="percentage"
              nameKey="material"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              stroke="#ffffff"
              strokeWidth={2}
            >
              {composition.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as CompositionItem;
                  return (
                    <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-xl text-xs border border-slate-800">
                      <div className="font-bold flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: data.color }}
                        />
                        <span>{data.material}</span>
                      </div>
                      <div className="mt-1 text-emerald-400 font-mono font-bold text-sm">
                        {data.percentage}% visible coverage
                      </div>
                      <div className="text-[11px] text-slate-300 mt-0.5">
                        {data.estimated_visible_area}
                      </div>
                      <div className="text-[10px] text-[#dfb163] mt-1 italic">
                        {data.badge}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <span className="text-2xl font-black text-[#1c503a] leading-none">
            {composition.reduce((acc, curr) => acc + curr.percentage, 0)}%
          </span>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-1">
            Segmented
          </span>
        </div>
      </div>

      {/* Custom Legend */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        {composition.map((item) => (
          <div
            key={item.material}
            className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
          >
            <div className="flex items-center gap-2 truncate pr-2">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="font-medium text-slate-700 truncate">
                {item.material}
              </span>
            </div>
            <span className="font-mono font-bold text-slate-900">
              {item.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
