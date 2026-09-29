import React, { useState } from 'react';
import { PackagingSpecification, PackagingParameters } from '../types/packaging';
import { X, DollarSign, TrendingUp, Percent, ShieldCheck, Check } from 'lucide-react';

interface RoiCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  specification: PackagingSpecification;
  parameters: PackagingParameters;
}

export const RoiCalculatorModal: React.FC<RoiCalculatorModalProps> = ({
  isOpen,
  onClose,
  specification,
  parameters,
}) => {
  if (!isOpen) return null;

  const { economicAnalysis, shelfLifePrediction } = specification;
  const [batchVolumePacks, setBatchVolumePacks] = useState(10000);
  const [unitFoodWholesalePriceUSD, setUnitFoodWholesalePriceUSD] = useState(4.50);
  const [baselineSpoilageRatePercent, setBaselineSpoilageRatePercent] = useState(18); // 18% typical unoptimized spoilage
  const [circuPackSpoilageRatePercent, setCircuPackSpoilageRatePercent] = useState(4); // 4% with optimized MAP & barrier

  // Calculations
  const totalFoodBatchValue = batchVolumePacks * unitFoodWholesalePriceUSD;
  const baselineSpoilageDollars = totalFoodBatchValue * (baselineSpoilageRatePercent / 100);
  const circuPackSpoilageDollars = totalFoodBatchValue * (circuPackSpoilageRatePercent / 100);
  const netSpoilageSavingsDollars = baselineSpoilageDollars - circuPackSpoilageDollars;

  const packagingCostPerPack = economicAnalysis.estimatedMaterialCostPer1000PacksUSD / 1000;
  const totalPackagingInvestment = batchVolumePacks * packagingCostPerPack;
  const netFinancialBenefit = netSpoilageSavingsDollars - totalPackagingInvestment;
  const computedRoi = totalPackagingInvestment > 0 ? (netSpoilageSavingsDollars / totalPackagingInvestment) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-lg border border-slate-300 shadow-xl max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-5">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-slate-500">
              Economic Decision Support
            </span>
            <h3 className="text-xl font-bold text-slate-900">
              Food Waste Reduction & Packaging Cost ROI Calculator
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Modal"
            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Production Batch Volume (Packs)
            </label>
            <input
              type="number"
              min="100"
              step="500"
              value={batchVolumePacks}
              onChange={(e) => setBatchVolumePacks(Math.max(100, parseInt(e.target.value) || 0))}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded font-mono text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Wholesale Food Value Per Unit ($ USD)
            </label>
            <input
              type="number"
              min="0.2"
              step="0.25"
              value={unitFoodWholesalePriceUSD}
              onChange={(e) => setUnitFoodWholesalePriceUSD(Math.max(0.1, parseFloat(e.target.value) || 0))}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded font-mono text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Conventional Packaging Spoilage Rate (%)
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={baselineSpoilageRatePercent}
              onChange={(e) => setBaselineSpoilageRatePercent(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded font-mono text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              CircuPack Optimized Spoilage Rate (%)
            </label>
            <input
              type="number"
              min="0.5"
              max="20"
              value={circuPackSpoilageRatePercent}
              onChange={(e) => setCircuPackSpoilageRatePercent(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded font-mono text-slate-900"
            />
          </div>
        </div>

        {/* Calculated Financial Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded">
            <span className="text-[11px] font-mono text-slate-500 uppercase">Packaging Cost</span>
            <div className="text-xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
              ${totalPackagingInvestment.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <div className="text-[10px] font-mono text-slate-500 mt-0.5">
              ${packagingCostPerPack.toFixed(3)} / unit pack
            </div>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded">
            <span className="text-[11px] font-mono text-emerald-800 uppercase">Food Spoilage Prevented</span>
            <div className="text-xl font-bold font-mono text-emerald-950 mt-1 tabular-nums">
              ${netSpoilageSavingsDollars.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <div className="text-[10px] font-mono text-emerald-700 mt-0.5">
              Saved from retail dumpsters
            </div>
          </div>

          <div className="p-3 bg-slate-900 text-white rounded">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Return On Investment (ROI)</span>
            <div className="text-xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
              {computedRoi.toFixed(1)}x
            </div>
            <div className="text-[10px] font-mono text-slate-300 mt-0.5">
              Net: +${netFinancialBenefit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
          </div>
        </div>

        {/* Explanatory notes */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 leading-relaxed font-mono">
          <strong>Decision Insight: </strong>
          Investing ${totalPackagingInvestment.toFixed(0)} in precision barrier specifications yields ${netSpoilageSavingsDollars.toFixed(0)} in preserved inventory value for {parameters.customName}. Over {shelfLifePrediction.circuPackOptimizedDays} days of distribution, every dollar spent on high-performance circular packaging returns approximately ${computedRoi.toFixed(2)} in saved food wastage.
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
