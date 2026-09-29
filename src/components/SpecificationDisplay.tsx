import React from 'react';
import { PackagingSpecification } from '../types/packaging';
import { Shield, Layers, Gauge, Activity, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

interface SpecificationDisplayProps {
  specification: PackagingSpecification;
  onOpenAudit: () => void;
  onOpenRoi: () => void;
}

export const SpecificationDisplay: React.FC<SpecificationDisplayProps> = ({
  specification,
  onOpenAudit,
  onOpenRoi,
}) => {
  const {
    primaryRecommendation,
    barrierSpecs,
    physicalSpecs,
    mapRequirements,
    circularity,
  } = specification;

  return (
    <div className="space-y-6">
      
      {/* 1. Primary Recommendation Workstation Banner (Clean, Compact, High-Legibility) */}
      <div className="bg-slate-900 text-white rounded-lg p-5 border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-slate-400">
              <span className="text-emerald-400 font-bold">RECOMMENDED SUBSTRATE</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>ID: {specification.id}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{circularity.recyclabilityClass}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {primaryRecommendation.materialName}
            </h2>

            <p className="text-xs font-mono text-emerald-300">
              {primaryRecommendation.structureDescription}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-slate-300">
              <div>
                <span className="text-slate-500">Gauge: </span>
                <span className="text-white font-bold">{physicalSpecs.filmThicknessTotalMicron} µm</span>
              </div>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <div>
                <span className="text-slate-500">Seal Range: </span>
                <span className="text-white">{physicalSpecs.sealTemperatureRange}</span>
              </div>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <div>
                <span className="text-slate-500">Clarity: </span>
                <span className="text-white">{physicalSpecs.opticalClarity}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
            <button
              onClick={onOpenAudit}
              className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold rounded transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>AI Technical Audit</span>
            </button>
            <button
              onClick={onOpenRoi}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded border border-slate-700 transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>Economic ROI</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Scientific Barrier & Permeability Specification Cards */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-800 font-bold">
            Barrier Transmission & Permeability (ASTM / ISO Standards)
          </h3>
          <span className="text-[11px] font-mono text-slate-500">
            Calibration: 23°C, 0% RH (OTR) · 38°C, 90% RH (WVTR)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* OTR Card */}
          <div className="border border-slate-200 bg-white p-4 rounded-lg flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 text-xs font-mono mb-2">
                <span className="font-bold text-slate-700 text-[11px]">OXYGEN TRANSMISSION (OTR)</span>
                <span className="text-[10px] text-slate-400 shrink-0">ASTM D3985</span>
              </div>

              <div className="mt-1">
                <div className="text-3xl font-bold font-mono text-slate-900 tabular-nums tracking-tight">
                  {barrierSpecs.otr.target.toLocaleString()}
                </div>
                <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                  cc / (m² · 24h · 1 atm)
                </div>
              </div>

              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                {barrierSpecs.otr.rationale}
              </p>
            </div>

            <div className="mt-4 pt-2.5 border-t border-slate-100 text-[11px] font-mono text-slate-600 flex items-center justify-between">
              <span className="text-slate-400">Tolerance Window:</span>
              <span className="font-semibold text-slate-800">{barrierSpecs.otr.min.toLocaleString()} – {barrierSpecs.otr.max.toLocaleString()}</span>
            </div>
          </div>

          {/* WVTR Card */}
          <div className="border border-slate-200 bg-white p-4 rounded-lg flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 text-xs font-mono mb-2">
                <span className="font-bold text-slate-700 text-[11px]">WATER VAPOR (WVTR)</span>
                <span className="text-[10px] text-slate-400 shrink-0">ASTM F1249</span>
              </div>

              <div className="mt-1">
                <div className="text-3xl font-bold font-mono text-slate-900 tabular-nums tracking-tight">
                  {barrierSpecs.wvtr.target.toLocaleString()}
                </div>
                <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                  g / (m² · 24h at 90% RH)
                </div>
              </div>

              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                {barrierSpecs.wvtr.rationale}
              </p>
            </div>

            <div className="mt-4 pt-2.5 border-t border-slate-100 text-[11px] font-mono text-slate-600 flex items-center justify-between">
              <span className="text-slate-400">Tolerance Window:</span>
              <span className="font-semibold text-slate-800">{barrierSpecs.wvtr.min} – {barrierSpecs.wvtr.max}</span>
            </div>
          </div>

          {/* CO2TR & Permselectivity Card */}
          <div className="border border-slate-200 bg-white p-4 rounded-lg flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 text-xs font-mono mb-2">
                <span className="font-bold text-slate-700 text-[11px]">CO₂ TRANSMISSION (β)</span>
                <span className="text-[10px] text-slate-400 shrink-0">ISO 15105-1</span>
              </div>

              <div className="mt-1">
                <div className="text-3xl font-bold font-mono text-slate-900 tabular-nums tracking-tight">
                  {barrierSpecs.co2tr.target.toLocaleString()}
                </div>
                <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                  cc / (m² · 24h · 1 atm)
                </div>
              </div>

              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                Permselectivity β (CO₂TR / OTR) = <strong className="text-slate-900">{barrierSpecs.co2tr.permselectivityBeta}</strong>. {barrierSpecs.co2tr.rationale}
              </p>
            </div>

            <div className="mt-4 pt-2.5 border-t border-slate-100 text-[11px] font-mono text-slate-600 flex items-center justify-between">
              <span className="text-slate-400">Gas Flux Mode:</span>
              <span className="font-semibold text-slate-800">Controlled Steady-State</span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Physical Specs & Mechanical Strength */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Layer Breakdown Architecture */}
        <div className="border border-slate-200 bg-white rounded-lg p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-700" />
              <h4 className="text-sm font-bold text-slate-900">
                Laminate Layer Architecture ({physicalSpecs.filmThicknessTotalMicron} µm Total Gauge)
              </h4>
            </div>
            <span className="text-xs font-mono text-slate-500">Outer to Food Contact</span>
          </div>

          <div className="space-y-3">
            {primaryRecommendation.layerBreakdown.map((layer) => (
              <div key={layer.layerOrder} className="p-3 bg-slate-50 rounded border border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-slate-900">
                    Layer 0{layer.layerOrder}: {layer.material}
                  </span>
                  <span className="font-mono font-bold text-slate-900 tabular-nums bg-white px-2 py-0.5 rounded border border-slate-200">
                    {layer.thicknessMicron} µm
                  </span>
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  {layer.purpose}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <h5 className="text-xs font-semibold text-slate-800 mb-1.5">Key Performance Advantages:</h5>
            <ul className="space-y-1">
              {primaryRecommendation.keyAdvantages.map((adv, i) => (
                <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{adv}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Physical & Mechanical Strength Table */}
        <div className="border border-slate-200 bg-white rounded-lg p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-slate-700" />
              <h4 className="text-sm font-bold text-slate-900">
                Sealability & Mechanical Durability Specifications
              </h4>
            </div>
            <span className="text-xs font-mono text-slate-500">ISO / ASTM</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs font-mono">
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-slate-600">Heat Seal Temperature Window</span>
              <span className="font-bold text-slate-900">{physicalSpecs.sealTemperatureRange}</span>
            </div>
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-slate-600">Hot Tack Strength</span>
              <span className="font-bold text-slate-900">{physicalSpecs.hotTackStrength}</span>
            </div>
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-slate-600">Seal Integrity Under Contamination</span>
              <span className="font-bold text-slate-900">{physicalSpecs.sealIntegrityContamination} Resistance</span>
            </div>
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-slate-600">Tensile Strength (MD/TD)</span>
              <span className="font-bold text-slate-900">{physicalSpecs.tensileStrengthMpa} MPa</span>
            </div>
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-slate-600">Puncture Resistance (Slow Rate)</span>
              <span className="font-bold text-slate-900">{physicalSpecs.punctureResistanceN} Newtons</span>
            </div>
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-slate-600">Dart Drop Impact (F50)</span>
              <span className="font-bold text-slate-900">{physicalSpecs.dartDropG} grams</span>
            </div>
          </div>

          {/* Visual Barrier Cross Section */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs text-slate-500 font-mono mb-2">
              <span>BARRIER LAYER CALIBRATION SCHEMATIC</span>
              <span>VERIFIED</span>
            </div>
            <div className="relative rounded overflow-hidden border border-slate-200 bg-slate-100 h-32 flex items-center justify-center">
              <img
                src="/src/assets/images/barrier_layers_diagram_1790320527765.jpg"
                alt="Barrier layer cross-section diagram showing OTR, WVTR, and seal layers"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback container per Zero-Broken-Image Policy
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>
        </div>

      </div>

      {/* 4. Modified Atmosphere Packaging (MAP) & Breathable Micro-perforation */}
      {mapRequirements.applicable && (
        <div className="border border-slate-200 bg-white rounded-lg p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 mb-4 gap-2">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-500">
                Atmosphere Control Protocol
              </span>
              <h4 className="text-base font-bold text-slate-900">
                Modified Atmosphere Packaging (MAP) & Equilibrium Gas Specifications
              </h4>
            </div>
            <span className="text-xs font-mono bg-slate-100 text-slate-800 px-2.5 py-1 rounded">
              Gas Flush Ratio: {mapRequirements.gasToProductVolumeRatio}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            
            {/* O2 flush */}
            <div className="p-3 bg-slate-50 rounded border border-slate-200 text-center">
              <div className="text-[11px] font-mono uppercase text-slate-500">Oxygen (O₂) Flush</div>
              <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
                {mapRequirements.initialGasComposition.o2Percent}%
              </div>
              <div className="text-[11px] text-slate-600 mt-1">
                {mapRequirements.initialGasComposition.o2Percent > 50
                  ? 'High O₂ bloom for red meat'
                  : mapRequirements.initialGasComposition.o2Percent < 1
                  ? 'Ultra-low O₂ inert protection'
                  : 'Low O₂ produce respiration retarding'}
              </div>
            </div>

            {/* CO2 flush */}
            <div className="p-3 bg-slate-50 rounded border border-slate-200 text-center">
              <div className="text-[11px] font-mono uppercase text-slate-500">Carbon Dioxide (CO₂) Flush</div>
              <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
                {mapRequirements.initialGasComposition.co2Percent}%
              </div>
              <div className="text-[11px] text-slate-600 mt-1">
                Bacteriostatic & fungistatic mold inhibitor
              </div>
            </div>

            {/* N2 flush */}
            <div className="p-3 bg-slate-50 rounded border border-slate-200 text-center">
              <div className="text-[11px] font-mono uppercase text-slate-500">Nitrogen (N₂) Filler</div>
              <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
                {mapRequirements.initialGasComposition.n2Percent}%
              </div>
              <div className="text-[11px] text-slate-600 mt-1">
                Inert gas balancing cushion & pillow volume
              </div>
            </div>

          </div>

          <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs text-slate-700 leading-relaxed">
            <span className="font-semibold text-slate-900">Atmospheric Preservation Rationale: </span>
            {mapRequirements.preservativeGasRationale}
          </div>

          {/* Micro-perforation section if required for fresh produce */}
          {mapRequirements.perforationRequired && mapRequirements.microPerforationDetail && (
            <div className="mt-4 p-4 border border-emerald-200 bg-emerald-50/60 rounded">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider font-mono">
                  Engineered Laser Micro-Perforations Required for High Respiration Produce
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono mt-2">
                <div>
                  <span className="text-slate-500">Hole Density: </span>
                  <span className="font-bold text-slate-900">{mapRequirements.microPerforationDetail.holeCountPerM2} holes / m²</span>
                </div>
                <div>
                  <span className="text-slate-500">Aperture Diameter: </span>
                  <span className="font-bold text-slate-900">{mapRequirements.microPerforationDetail.holeDiameterMicron} µm (Laser drilled)</span>
                </div>
                <div>
                  <span className="text-slate-500">Gas Balance: </span>
                  <span className="font-bold text-slate-900">{mapRequirements.microPerforationDetail.targetOxygenUptakeBalance}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
