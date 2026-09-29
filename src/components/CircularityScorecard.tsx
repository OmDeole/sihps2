import React, { useState } from 'react';
import { PackagingSpecification } from '../types/packaging';
import { RefreshCw, Leaf, Check, ArrowRightLeft, Sparkles, Scale } from 'lucide-react';

interface CircularityScorecardProps {
  specification: PackagingSpecification;
  onSwapToAlternative: () => void;
}

export const CircularityScorecard: React.FC<CircularityScorecardProps> = ({
  specification,
  onSwapToAlternative,
}) => {
  const { circularity, circularAlternative } = specification;
  const [swapped, setSwapped] = useState(false);

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-200 gap-3">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-slate-500">
            Circular Economy & LCA Performance
          </span>
          <h3 className="text-xl font-bold text-slate-900">
            Sustainability Scorecard & Recyclability Verification
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs font-mono text-slate-500">CIRCULARITY RATING</div>
            <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {circularity.circularityScore}<span className="text-xs text-slate-400"> / 100</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        
        {/* Metric 1: Recyclability Classification */}
        <div className="p-4 bg-slate-50 rounded border border-slate-100">
          <span className="text-xs font-mono text-slate-500 uppercase">Recyclability Stream</span>
          <div className="text-base font-bold text-slate-900 mt-1">
            {circularity.recyclabilityClass}
          </div>
          <div className="text-xs text-slate-600 mt-1 leading-snug">
            {circularity.recyclabilityStream}
          </div>
        </div>

        {/* Metric 2: Carbon Footprint */}
        <div className="p-4 bg-slate-50 rounded border border-slate-100">
          <span className="text-xs font-mono text-slate-500 uppercase">Embodied Carbon</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {circularity.carbonFootprintKgCO2ePer1000Packs}
            </span>
            <span className="text-xs font-mono text-slate-500">kg CO₂e/1k</span>
          </div>
          <div className="text-xs text-emerald-800 font-mono mt-1 font-semibold">
            ↓ {circularity.carbonReductionPercent}% vs Multi-Laminate
          </div>
        </div>

        {/* Metric 3: Mono-Material Purity */}
        <div className="p-4 bg-slate-50 rounded border border-slate-100">
          <span className="text-xs font-mono text-slate-500 uppercase">Mono-Polymer Purity</span>
          <div className="text-base font-bold text-slate-900 mt-1">
            ≥ 95% Pure PE/PP
          </div>
          <div className="text-xs text-slate-600 mt-1 leading-snug">
            CEFLEX & RecyClass compliant without cross-contamination.
          </div>
        </div>

        {/* Metric 4: PCR Viability */}
        <div className="p-4 bg-slate-50 rounded border border-slate-100">
          <span className="text-xs font-mono text-slate-500 uppercase">PCR Content Viable</span>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {circularity.pcrContentViablePercent}%
          </div>
          <div className="text-xs text-slate-600 mt-1 leading-snug">
            Chemically-recycled food-contact grade resins viable.
          </div>
        </div>

      </div>

      {/* Badges and Principles of Circular Economy (Zero pill standard: clean typography) */}
      <div className="flex flex-wrap items-center gap-y-2 gap-x-6 py-3 border-y border-slate-100 text-xs font-mono text-slate-600 mb-6">
        <span className="font-semibold text-slate-900">Compliance & Principles:</span>
        {circularity.circularityBadges.map((badge, idx) => (
          <span key={idx} className="flex items-center gap-1.5 text-slate-800">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>{badge}</span>
          </span>
        ))}
        <span className="text-slate-400">·</span>
        <span className="text-slate-600">End of Life: {circularity.endOfLifePathway}</span>
      </div>

      {/* Sustainable Circular Alternative Swap Spotlight */}
      <div className="p-4 rounded border border-slate-200 bg-slate-50/80">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-700" />
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-900 font-bold">
                1-Click Circular Alternative Swap
              </span>
            </div>
            <h4 className="text-base font-bold text-slate-900 mt-1">
              {circularAlternative.materialName}
            </h4>
            <p className="text-xs font-mono text-slate-600 mt-0.5">
              {circularAlternative.structureDescription}
            </p>
            <div className="mt-2 text-xs text-slate-600 leading-relaxed max-w-2xl">
              <strong>Trade-off Analysis: </strong>{circularAlternative.tradeOffNotes}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="text-right text-xs font-mono">
              <span className="text-slate-500">Circularity Score: </span>
              <span className="font-bold text-emerald-700">{circularAlternative.circularityScore} / 100</span>
            </div>
            <button
              onClick={() => {
                setSwapped(true);
                onSwapToAlternative();
              }}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>{swapped ? 'Alternative Applied' : 'Swap to Bio-Alternative'}</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
