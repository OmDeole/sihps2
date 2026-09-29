import React from 'react';
import { PackagingParameters, StorageType, TransportationRisk, PackagingFormat, RespirationRateClass } from '../types/packaging';

interface ParameterFormProps {
  parameters: PackagingParameters;
  onChange: (newParams: PackagingParameters) => void;
  onReset: () => void;
}

export const ParameterForm: React.FC<ParameterFormProps> = ({
  parameters,
  onChange,
  onReset,
}) => {
  const updateField = <K extends keyof PackagingParameters>(field: K, value: PackagingParameters[K]) => {
    onChange({
      ...parameters,
      [field]: value,
    });
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-slate-500">
            Phase 02 / Environmental & Biochemical Calibration
          </span>
          <h3 className="text-lg font-bold text-slate-900">
            Packaging Engineering Input Parameters
          </h3>
        </div>
        <button
          onClick={onReset}
          className="text-xs font-medium text-slate-600 hover:text-slate-900 underline mt-2 sm:mt-0 text-left"
        >
          Reset to Baseline
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* 1. Food Matrix Physicochemical Properties */}
        <div className="space-y-3">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-700 font-semibold border-b border-slate-200 pb-1">
            01. Food Physicochemical Properties
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Commodity / Product Name
            </label>
            <input
              type="text"
              value={parameters.customName}
              onChange={(e) => updateField('customName', e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded font-medium text-slate-900 focus:border-slate-900"
            />
          </div>

          {/* Moisture Content */}
          <div className="flex items-center justify-between gap-2 p-2 bg-white rounded border border-slate-200">
            <label className="text-xs font-semibold text-slate-800 shrink-0">Moisture Content</label>
            <div className="flex items-center rounded border border-slate-300 bg-white overflow-hidden shadow-xs focus-within:border-slate-900">
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="99.9"
                value={parameters.moistureContent}
                onChange={(e) => updateField('moistureContent', parseFloat(e.target.value) || 0)}
                className="w-20 px-2 py-1 text-xs font-mono font-bold text-slate-900 text-right outline-none"
              />
              <span className="bg-slate-100 border-l border-slate-200 px-2.5 py-1 text-[11px] font-mono text-slate-600 shrink-0">
                % w/w
              </span>
            </div>
          </div>

          {/* Water Activity */}
          <div className="flex items-center justify-between gap-2 p-2 bg-white rounded border border-slate-200">
            <label className="text-xs font-semibold text-slate-800 shrink-0">Water Activity</label>
            <div className="flex items-center rounded border border-slate-300 bg-white overflow-hidden shadow-xs focus-within:border-slate-900">
              <input
                type="number"
                step="0.01"
                min="0.05"
                max="0.99"
                value={parameters.waterActivity}
                onChange={(e) => updateField('waterActivity', parseFloat(e.target.value) || 0)}
                className="w-20 px-2 py-1 text-xs font-mono font-bold text-slate-900 text-right outline-none"
              />
              <span className="bg-slate-100 border-l border-slate-200 px-2.5 py-1 text-[11px] font-mono text-slate-600 shrink-0">
                a_w
              </span>
            </div>
          </div>

          {/* Fat / Oil Content */}
          <div className="flex items-center justify-between gap-2 p-2 bg-white rounded border border-slate-200">
            <label className="text-xs font-semibold text-slate-800 shrink-0">Fat / Oil Content</label>
            <div className="flex items-center rounded border border-slate-300 bg-white overflow-hidden shadow-xs focus-within:border-slate-900">
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={parameters.fatContent}
                onChange={(e) => updateField('fatContent', parseFloat(e.target.value) || 0)}
                className="w-20 px-2 py-1 text-xs font-mono font-bold text-slate-900 text-right outline-none"
              />
              <span className="bg-slate-100 border-l border-slate-200 px-2.5 py-1 text-[11px] font-mono text-slate-600 shrink-0">
                % w/w
              </span>
            </div>
          </div>

          {/* Acidity (pH) */}
          <div className="flex items-center justify-between gap-2 p-2 bg-white rounded border border-slate-200">
            <label className="text-xs font-semibold text-slate-800 shrink-0">Acidity (pH Level)</label>
            <div className="flex items-center rounded border border-slate-300 bg-white overflow-hidden shadow-xs focus-within:border-slate-900">
              <input
                type="number"
                step="0.1"
                min="2.0"
                max="9.0"
                value={parameters.pH}
                onChange={(e) => updateField('pH', parseFloat(e.target.value) || 0)}
                className="w-20 px-2 py-1 text-xs font-mono font-bold text-slate-900 text-right outline-none"
              />
              <span className="bg-slate-100 border-l border-slate-200 px-2.5 py-1 text-[11px] font-mono text-slate-600 shrink-0">
                pH
              </span>
            </div>
          </div>
        </div>

        {/* 2. Respiration & Target Shelf-Life */}
        <div className="space-y-3">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-700 font-semibold border-b border-slate-200 pb-1">
            02. Respiration & Shelf-Life Goals
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Produce Respiration Class
            </label>
            <select
              value={parameters.respirationRateClass}
              onChange={(e) => {
                const cls = e.target.value as RespirationRateClass;
                let val = 0;
                if (cls === 'very_low') val = 5;
                if (cls === 'low') val = 15;
                if (cls === 'moderate') val = 35;
                if (cls === 'high') val = 65;
                if (cls === 'extremely_high') val = 120;
                onChange({
                  ...parameters,
                  respirationRateClass: cls,
                  respirationRateValue: val,
                });
              }}
              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded font-medium text-slate-900 focus:border-slate-900"
            >
              <option value="not_applicable">Not Applicable (Processed / Dry / Meat)</option>
              <option value="very_low">Very Low (Nuts, Dried, Dates &lt;5 mg CO₂/kg·h)</option>
              <option value="low">Low (Apples, Citrus, Onions ~10-20 mg CO₂/kg·h)</option>
              <option value="moderate">Moderate (Tomatoes, Peaches, Lettuce ~20-40 mg CO₂/kg·h)</option>
              <option value="high">High (Strawberries, Avocados ~40-80 mg CO₂/kg·h)</option>
              <option value="extremely_high">Extremely High (Spinach, Mushrooms, Broccoli &gt;80 mg CO₂/kg·h)</option>
            </select>
          </div>

          {/* Respiration Rate Value Box */}
          <div className="flex items-center justify-between gap-2 p-2 bg-white rounded border border-slate-200">
            <label className="text-xs font-semibold text-slate-800 shrink-0">Respiration (R_CO₂)</label>
            <div className="flex items-center rounded border border-slate-300 bg-white overflow-hidden shadow-xs focus-within:border-slate-900">
              <input
                type="number"
                step="1"
                min="0"
                max="250"
                value={parameters.respirationRateValue}
                onChange={(e) => updateField('respirationRateValue', parseInt(e.target.value, 10) || 0)}
                className="w-20 px-2 py-1 text-xs font-mono font-bold text-emerald-800 text-right outline-none"
              />
              <span className="bg-slate-100 border-l border-slate-200 px-2 py-1 text-[11px] font-mono text-slate-600 shrink-0">
                mg/kg·h
              </span>
            </div>
          </div>

          {/* Target Shelf Life Box */}
          <div className="flex items-center justify-between gap-2 p-2 bg-white rounded border border-slate-200">
            <label className="text-xs font-semibold text-slate-800 shrink-0">Target Shelf Life</label>
            <div className="flex items-center rounded border border-slate-300 bg-white overflow-hidden shadow-xs focus-within:border-slate-900">
              <input
                type="number"
                step="1"
                min="1"
                max="730"
                value={parameters.desiredShelfLifeDays}
                onChange={(e) => updateField('desiredShelfLifeDays', parseInt(e.target.value, 10) || 1)}
                className="w-20 px-2 py-1 text-xs font-mono font-bold text-slate-900 text-right outline-none"
              />
              <span className="bg-slate-100 border-l border-slate-200 px-2.5 py-1 text-[11px] font-mono text-slate-600 shrink-0">
                Days
              </span>
            </div>
          </div>

          {/* Pack Unit Net Weight Box */}
          <div className="flex items-center justify-between gap-2 p-2 bg-white rounded border border-slate-200">
            <label className="text-xs font-semibold text-slate-800 shrink-0">Pack Net Weight</label>
            <div className="flex items-center rounded border border-slate-300 bg-white overflow-hidden shadow-xs focus-within:border-slate-900">
              <input
                type="number"
                step="10"
                min="5"
                max="5000"
                value={parameters.packWeightGram}
                onChange={(e) => updateField('packWeightGram', parseInt(e.target.value, 10) || 10)}
                className="w-20 px-2 py-1 text-xs font-mono font-bold text-slate-900 text-right outline-none"
              />
              <span className="bg-slate-100 border-l border-slate-200 px-3 py-1 text-[11px] font-mono text-slate-600 shrink-0">
                g
              </span>
            </div>
          </div>
        </div>

        {/* 3. Storage, Transit & Packaging Format */}
        <div className="space-y-3">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-700 font-semibold border-b border-slate-200 pb-1">
            03. Storage & Distribution Environment
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Storage Regimen
            </label>
            <div className="grid grid-cols-3 gap-1">
              {(['ambient', 'chilled', 'frozen'] as StorageType[]).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => {
                    let temp = 20;
                    if (st === 'chilled') temp = 4;
                    if (st === 'frozen') temp = -18;
                    onChange({
                      ...parameters,
                      storageType: st,
                      storageTempC: temp,
                    });
                  }}
                  className={`py-1.5 px-2 text-xs font-mono rounded border transition-colors capitalize ${
                    parameters.storageType === st
                      ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                      : 'bg-white text-slate-700 border-slate-300 hover:border-slate-500'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Temperature Box */}
          <div className="flex items-center justify-between gap-2 p-2 bg-white rounded border border-slate-200">
            <label className="text-xs font-semibold text-slate-800 shrink-0">Temperature</label>
            <div className="flex items-center rounded border border-slate-300 bg-white overflow-hidden shadow-xs focus-within:border-slate-900">
              <input
                type="number"
                step="1"
                min="-30"
                max="55"
                value={parameters.storageTempC}
                onChange={(e) => updateField('storageTempC', parseInt(e.target.value, 10) || 0)}
                className="w-20 px-2 py-1 text-xs font-mono font-bold text-slate-900 text-right outline-none"
              />
              <span className="bg-slate-100 border-l border-slate-200 px-3 py-1 text-[11px] font-mono text-slate-600 shrink-0">
                °C
              </span>
            </div>
          </div>

          {/* Humidity Box */}
          <div className="flex items-center justify-between gap-2 p-2 bg-white rounded border border-slate-200">
            <label className="text-xs font-semibold text-slate-800 shrink-0">Ambient Humidity</label>
            <div className="flex items-center rounded border border-slate-300 bg-white overflow-hidden shadow-xs focus-within:border-slate-900">
              <input
                type="number"
                step="1"
                min="10"
                max="100"
                value={parameters.relativeHumidity}
                onChange={(e) => updateField('relativeHumidity', parseInt(e.target.value, 10) || 10)}
                className="w-20 px-2 py-1 text-xs font-mono font-bold text-slate-900 text-right outline-none"
              />
              <span className="bg-slate-100 border-l border-slate-200 px-2 py-1 text-[11px] font-mono text-slate-600 shrink-0">
                % RH
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Transportation Condition
            </label>
            <select
              value={parameters.transportationRisk}
              onChange={(e) => updateField('transportationRisk', e.target.value as TransportationRisk)}
              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded font-mono focus:border-slate-900 outline-none"
            >
              <option value="standard">Standard Domestic Road Freight (Mild)</option>
              <option value="high_vibration">Long-Haul Road / Rail Freight (High Vibration)</option>
              <option value="marine_humidity">Marine Container Export (90%+ RH & Saline)</option>
              <option value="cold_chain_intermittent">Cold Chain Intermittent Break Risk</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Target Packaging Format
            </label>
            <select
              value={parameters.packagingFormat}
              onChange={(e) => updateField('packagingFormat', e.target.value as PackagingFormat)}
              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded font-mono focus:border-slate-900 outline-none"
            >
              <option value="standup_pouch">Stand-Up Doypack Pouch (With/Without Zipper)</option>
              <option value="flat_pouch">3-Side / 4-Side Flat Pillow Pouch</option>
              <option value="tray_lidding">Thermoformed Barrier Tray + Top Lidding</option>
              <option value="flow_wrap">Horizontal Flow Wrap (HFFS)</option>
              <option value="vacuum_pack">Vacuum Skin Packaging (VSP)</option>
              <option value="rigid_container">Rigid Circular Container + Seal Membrane</option>
            </select>
          </div>
        </div>

      </div>
    </div>
  );
};
