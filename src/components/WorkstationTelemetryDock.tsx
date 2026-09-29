import React from 'react';
import { PackagingSpecification, OnboardingProfile } from '../types/packaging';
import { DollarSign, Sparkles } from 'lucide-react';

interface WorkstationTelemetryDockProps {
  specification: PackagingSpecification;
  onboardingProfile: OnboardingProfile;
  onOpenOnboarding: () => void;
  onOpenAudit: () => void;
  onOpenRoi: () => void;
  asMainView?: boolean;
}

export const WorkstationTelemetryDock: React.FC<WorkstationTelemetryDockProps> = ({
  specification,
  onboardingProfile,
  onOpenOnboarding,
  onOpenAudit,
  onOpenRoi,
  asMainView = false,
}) => {
  const { barrierSpecs, circularity, economicAnalysis, physicalSpecs } = specification;

  const content = (
    <div className="space-y-4 text-xs font-mono">
      {/* Diagnostic Enterprise Lockup */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded">
        <div className="flex items-center justify-between text-[10px] uppercase text-slate-500 mb-1">
          <span>Enterprise Diagnostic</span>
          <button
            onClick={onOpenOnboarding}
            className="text-slate-900 font-bold hover:underline"
          >
            {onboardingProfile.completed ? 'Edit' : 'Setup'}
          </button>
        </div>
        <div className="font-bold text-slate-900 font-sans text-xs truncate">
          {onboardingProfile.completed ? onboardingProfile.businessType : '10-Q Diagnostic Setup'}
        </div>
        <div className="text-[11px] text-slate-600 mt-1 space-y-0.5">
          <div>Scale: <span className="font-bold text-slate-800">{onboardingProfile.productionScale.split('(')[0]}</span></div>
          <div>Rev Tier: <span className="font-bold text-slate-800">{onboardingProfile.annualRevenue}</span></div>
        </div>
      </div>

      {/* Live Gauges */}
      <div className="space-y-2.5">
        <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-100 pb-1">
          Barrier Transmission Status
        </div>

        <div className="p-2.5 bg-slate-50 rounded border border-slate-100">
          <div className="text-[10px] text-slate-500">TARGET OTR (ASTM D3985)</div>
          <div className="text-xl font-bold text-slate-900 tabular-nums mt-0.5">
            {barrierSpecs.otr.target.toLocaleString()} <span className="text-[10px] font-normal text-slate-500">cc/m²·d</span>
          </div>
        </div>

        <div className="p-2.5 bg-slate-50 rounded border border-slate-100">
          <div className="text-[10px] text-slate-500">TARGET WVTR (ASTM F1249)</div>
          <div className="text-xl font-bold text-slate-900 tabular-nums mt-0.5">
            {barrierSpecs.wvtr.target.toLocaleString()} <span className="text-[10px] font-normal text-slate-500">g/m²·d</span>
          </div>
        </div>

        <div className="p-2.5 bg-slate-50 rounded border border-slate-100">
          <div className="text-[10px] text-slate-500">CIRCULARITY SCORE</div>
          <div className="text-xl font-bold text-emerald-800 tabular-nums mt-0.5">
            {circularity.circularityScore} <span className="text-[10px] font-normal text-slate-400">/ 100</span>
          </div>
        </div>

        <div className="p-2.5 bg-slate-900 text-white rounded">
          <div className="text-[10px] text-slate-400">PREVENTED SPOILAGE ROI</div>
          <div className="text-xl font-bold text-emerald-400 tabular-nums mt-0.5">
            {economicAnalysis.roiMultiplier}x
          </div>
          <div className="text-[10px] text-slate-300 mt-0.5">
            +${economicAnalysis.projectedFoodSpoilageLossSavedUSD.toLocaleString()} saved / 1k packs
          </div>
        </div>
      </div>

      {/* Visual Barrier Layer Schematic Card */}
      <div className="border border-slate-200 rounded p-2.5 bg-white">
        <div className="text-[10px] text-slate-500 uppercase font-semibold mb-1 flex items-center justify-between">
          <span>Film Cross-Section</span>
          <span>{physicalSpecs.filmThicknessTotalMicron} µm</span>
        </div>
        <div className="rounded overflow-hidden h-24 bg-slate-100 border border-slate-200">
          <img
            src="/src/assets/images/barrier_layers_diagram_1790320527765.jpg"
            alt="Barrier layer isometric diagram"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      </div>

      {/* Quick Command Actions */}
      <div className="pt-2 border-t border-slate-100 space-y-2">
        <button
          onClick={onOpenAudit}
          className="w-full py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold rounded flex items-center justify-center gap-1.5 transition-colors min-h-[38px]"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
          <span>AI Formulation Audit</span>
        </button>
        <button
          onClick={onOpenRoi}
          className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded flex items-center justify-center gap-1.5 transition-colors min-h-[38px]"
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Cost & ROI Calculator</span>
        </button>
      </div>
    </div>
  );

  if (asMainView) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-5 max-w-xl mx-auto">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-mono">
            Workstation Live Telemetry
          </h3>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>
        {content}
      </div>
    );
  }

  return (
    <aside className="hidden xl:flex w-72 border-l border-slate-200 bg-white flex-col h-full shrink-0 select-none">
      {/* Dock Header */}
      <div className="p-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
          Live Telemetry & Diagnostics
        </span>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {content}
      </div>
    </aside>
  );
};
