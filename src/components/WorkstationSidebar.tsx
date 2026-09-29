import React, { useState } from 'react';
import { PackagingParameters, FoodCommodity, FoodCategory, StorageType, TransportationRisk, PackagingFormat, RespirationRateClass } from '../types/packaging';
import { FOOD_COMMODITIES } from '../data/foodCommodities';
import { Search, SlidersHorizontal, RotateCcw, ChevronDown, ChevronUp, X, Check } from 'lucide-react';

interface WorkstationSidebarProps {
  parameters: PackagingParameters;
  onChange: (newParams: PackagingParameters) => void;
  onSelectCommodity: (commodity: FoodCommodity) => void;
  onReset: () => void;
  onCloseMobile?: () => void;
}

export const WorkstationSidebar: React.FC<WorkstationSidebarProps> = ({
  parameters,
  onChange,
  onSelectCommodity,
  onReset,
  onCloseMobile,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | 'all'>('all');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [isFoodListOpen, setIsFoodListOpen] = useState(false);

  const filteredCommodities = FOOD_COMMODITIES.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const updateField = <K extends keyof PackagingParameters>(field: K, value: PackagingParameters[K]) => {
    onChange({
      ...parameters,
      [field]: value,
    });
  };

  return (
    <aside className="w-full sm:w-88 lg:w-96 border-r border-slate-200 bg-white flex flex-col h-full shrink-0 select-none">
      
      {/* Sidebar Header */}
      <div className="p-3 sm:p-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
            Control Console
          </span>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            Formulation & Environment
          </h2>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsCustomMode(!isCustomMode)}
            className={`p-1.5 rounded text-[11px] font-mono border transition-colors flex items-center gap-1 min-h-[32px] ${
              isCustomMode
                ? 'bg-slate-900 text-white border-slate-900 font-bold'
                : 'bg-white text-slate-700 border-slate-300 hover:border-slate-500'
            }`}
            title="Toggle Custom Formulation Manual Override"
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span className="hidden sm:inline">{isCustomMode ? 'Custom' : 'Preset'}</span>
          </button>
          
          <button
            onClick={onReset}
            className="p-1.5 rounded text-[11px] font-mono border border-slate-300 bg-white text-slate-600 hover:text-slate-900 min-h-[32px] min-w-[32px] flex items-center justify-center"
            title="Reset to default baseline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Close drawer button for mobile screens */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-200 min-h-[32px] min-w-[32px] flex items-center justify-center ml-1"
              aria-label="Close parameters drawer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Scrollable Parameters Form Body */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 text-xs font-sans">
        
        {/* 1. Commodity Selector Collapsible Area */}
        <div className="border border-slate-200 rounded bg-slate-50/60 p-2.5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-mono text-[10px] uppercase text-slate-500 font-semibold">Active Commodity</span>
            <button
              onClick={() => setIsFoodListOpen(!isFoodListOpen)}
              className="text-[11px] font-mono font-medium text-slate-700 hover:text-slate-900 flex items-center gap-1 py-0.5"
            >
              <span>{isFoodListOpen ? 'Close Library' : 'Switch Commodity'}</span>
              {isFoodListOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          <div className="font-bold text-sm text-slate-900 flex items-center justify-between">
            <span className="truncate">{parameters.customName}</span>
            <span className="text-[10px] font-mono uppercase text-slate-500 ml-2 shrink-0">
              {parameters.category.replace('_', ' ')}
            </span>
          </div>

          {/* Collapsible Food Database Selection Dropdown */}
          {isFoodListOpen && (
            <div className="mt-3 pt-3 border-t border-slate-200 space-y-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter 25+ food commodities..."
                  className="w-full pl-8 pr-2 py-1.5 text-xs bg-white border border-slate-300 rounded font-mono"
                />
              </div>

              <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded bg-white">
                {filteredCommodities.map((food) => (
                  <button
                    key={food.id}
                    onClick={() => {
                      onSelectCommodity(food);
                      setIsFoodListOpen(false);
                    }}
                    className={`w-full p-2.5 text-left hover:bg-slate-50 transition-colors flex items-center justify-between text-xs min-h-[38px] ${
                      parameters.commodityId === food.id ? 'bg-slate-100 font-bold' : ''
                    }`}
                  >
                    <span className="truncate text-slate-900">{food.name}</span>
                    <span className="text-[10px] font-mono text-slate-500 tabular-nums ml-1 shrink-0">
                      {food.standardMoisture}% H₂O
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 2. Physicochemical Properties (Clean Text Boxes with Units) */}
        <div className="space-y-2">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-200 pb-1 flex items-center justify-between">
            <span>01. Food Biochemical Matrix</span>
            <span className="text-[10px] font-mono text-slate-400">Direct Entry</span>
          </div>

          {/* Moisture Content */}
          <div className="flex items-center justify-between gap-2 p-2 bg-slate-50/80 rounded border border-slate-200">
            <label className="text-xs font-semibold text-slate-800 shrink-0">Moisture Content</label>
            <div className="flex items-center rounded border border-slate-300 bg-white overflow-hidden shadow-xs focus-within:border-slate-900 focus-within:ring-1 focus-within:ring-slate-900">
              <input
                type="number"
                inputMode="decimal"
                step="0.1"
                min="0.1"
                max="99.9"
                value={parameters.moistureContent}
                onChange={(e) => updateField('moistureContent', parseFloat(e.target.value) || 0)}
                className="w-18 sm:w-20 px-2 py-1.5 text-xs font-mono font-bold text-slate-900 text-right outline-none min-h-[32px]"
              />
              <span className="bg-slate-100 border-l border-slate-200 px-2 py-1.5 text-[11px] font-mono text-slate-600 select-none shrink-0 font-medium">
                % w/w
              </span>
            </div>
          </div>

          {/* Water Activity */}
          <div className="flex items-center justify-between gap-2 p-2 bg-slate-50/80 rounded border border-slate-200">
            <label className="text-xs font-semibold text-slate-800 shrink-0">Water Activity</label>
            <div className="flex items-center rounded border border-slate-300 bg-white overflow-hidden shadow-xs focus-within:border-slate-900 focus-within:ring-1 focus-within:ring-slate-900">
              <input
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0.05"
                max="0.99"
                value={parameters.waterActivity}
                onChange={(e) => updateField('waterActivity', parseFloat(e.target.value) || 0)}
                className="w-18 sm:w-20 px-2 py-1.5 text-xs font-mono font-bold text-slate-900 text-right outline-none min-h-[32px]"
              />
              <span className="bg-slate-100 border-l border-slate-200 px-2.5 py-1.5 text-[11px] font-mono text-slate-600 select-none shrink-0 font-medium">
                a_w
              </span>
            </div>
          </div>

          {/* Fat / Oil Content */}
          <div className="flex items-center justify-between gap-2 p-2 bg-slate-50/80 rounded border border-slate-200">
            <label className="text-xs font-semibold text-slate-800 shrink-0">Fat / Oil Content</label>
            <div className="flex items-center rounded border border-slate-300 bg-white overflow-hidden shadow-xs focus-within:border-slate-900 focus-within:ring-1 focus-within:ring-slate-900">
              <input
                type="number"
                inputMode="decimal"
                step="0.1"
                min="0"
                max="100"
                value={parameters.fatContent}
                onChange={(e) => updateField('fatContent', parseFloat(e.target.value) || 0)}
                className="w-18 sm:w-20 px-2 py-1.5 text-xs font-mono font-bold text-slate-900 text-right outline-none min-h-[32px]"
              />
              <span className="bg-slate-100 border-l border-slate-200 px-2 py-1.5 text-[11px] font-mono text-slate-600 select-none shrink-0 font-medium">
                % w/w
              </span>
            </div>
          </div>

          {/* Acidity (pH) */}
          <div className="flex items-center justify-between gap-2 p-2 bg-slate-50/80 rounded border border-slate-200">
            <label className="text-xs font-semibold text-slate-800 shrink-0">Acidity (pH Level)</label>
            <div className="flex items-center rounded border border-slate-300 bg-white overflow-hidden shadow-xs focus-within:border-slate-900 focus-within:ring-1 focus-within:ring-slate-900">
              <input
                type="number"
                inputMode="decimal"
                step="0.1"
                min="2.0"
                max="9.0"
                value={parameters.pH}
                onChange={(e) => updateField('pH', parseFloat(e.target.value) || 0)}
                className="w-18 sm:w-20 px-2 py-1.5 text-xs font-mono font-bold text-slate-900 text-right outline-none min-h-[32px]"
              />
              <span className="bg-slate-100 border-l border-slate-200 px-2.5 py-1.5 text-[11px] font-mono text-slate-600 select-none shrink-0 font-medium">
                pH
              </span>
            </div>
          </div>

          {/* Respiration Rate */}
          <div className="flex items-center justify-between gap-2 p-2 bg-slate-50/80 rounded border border-slate-200">
            <label className="text-xs font-semibold text-slate-800 shrink-0">Respiration (R_CO₂)</label>
            <div className="flex items-center rounded border border-slate-300 bg-white overflow-hidden shadow-xs focus-within:border-slate-900 focus-within:ring-1 focus-within:ring-slate-900">
              <input
                type="number"
                inputMode="numeric"
                step="1"
                min="0"
                max="250"
                value={parameters.respirationRateValue}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10) || 0;
                  let cls: RespirationRateClass = 'not_applicable';
                  if (val > 0 && val <= 10) cls = 'very_low';
                  else if (val > 10 && val <= 30) cls = 'low';
                  else if (val > 30 && val <= 60) cls = 'moderate';
                  else if (val > 60 && val <= 100) cls = 'high';
                  else if (val > 100) cls = 'extremely_high';
                  onChange({
                    ...parameters,
                    respirationRateValue: val,
                    respirationRateClass: cls,
                  });
                }}
                className="w-18 sm:w-20 px-2 py-1.5 text-xs font-mono font-bold text-emerald-800 text-right outline-none min-h-[32px]"
              />
              <span className="bg-slate-100 border-l border-slate-200 px-2 py-1.5 text-[11px] font-mono text-slate-600 select-none shrink-0 font-medium">
                mg/kg·h
              </span>
            </div>
          </div>
        </div>

        {/* 3. Shelf-Life Goal & Pack Volume (Clean Text Boxes with Units) */}
        <div className="space-y-2">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-200 pb-1">
            02. Shelf-Life & Commercial Batch
          </div>

          {/* Target Shelf Life */}
          <div className="flex items-center justify-between gap-2 p-2 bg-slate-50/80 rounded border border-slate-200">
            <label className="text-xs font-semibold text-slate-800 shrink-0">Target Shelf Life</label>
            <div className="flex items-center rounded border border-slate-300 bg-white overflow-hidden shadow-xs focus-within:border-slate-900 focus-within:ring-1 focus-within:ring-slate-900">
              <input
                type="number"
                inputMode="numeric"
                step="1"
                min="1"
                max="730"
                value={parameters.desiredShelfLifeDays}
                onChange={(e) => updateField('desiredShelfLifeDays', parseInt(e.target.value, 10) || 1)}
                className="w-18 sm:w-20 px-2 py-1.5 text-xs font-mono font-bold text-slate-900 text-right outline-none min-h-[32px]"
              />
              <span className="bg-slate-100 border-l border-slate-200 px-2.5 py-1.5 text-[11px] font-mono text-slate-600 select-none shrink-0 font-medium">
                Days
              </span>
            </div>
          </div>

          {/* Pack Unit Net Weight */}
          <div className="flex items-center justify-between gap-2 p-2 bg-slate-50/80 rounded border border-slate-200">
            <label className="text-xs font-semibold text-slate-800 shrink-0">Pack Net Weight</label>
            <div className="flex items-center rounded border border-slate-300 bg-white overflow-hidden shadow-xs focus-within:border-slate-900 focus-within:ring-1 focus-within:ring-slate-900">
              <input
                type="number"
                inputMode="numeric"
                step="10"
                min="5"
                max="5000"
                value={parameters.packWeightGram}
                onChange={(e) => updateField('packWeightGram', parseInt(e.target.value, 10) || 10)}
                className="w-18 sm:w-20 px-2 py-1.5 text-xs font-mono font-bold text-slate-900 text-right outline-none min-h-[32px]"
              />
              <span className="bg-slate-100 border-l border-slate-200 px-3 py-1.5 text-[11px] font-mono text-slate-600 select-none shrink-0 font-medium">
                g
              </span>
            </div>
          </div>
        </div>

        {/* 4. Storage & Logistics Regimen */}
        <div className="space-y-2">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-200 pb-1">
            03. Distribution Environment
          </div>

          <div>
            <span className="block text-slate-700 font-semibold mb-1 text-xs">Storage Regimen</span>
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
                  className={`py-1.5 text-xs font-mono rounded border transition-colors capitalize min-h-[34px] ${
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

          {/* Storage Temperature Box */}
          <div className="flex items-center justify-between gap-2 p-2 bg-slate-50/80 rounded border border-slate-200">
            <label className="text-xs font-semibold text-slate-800 shrink-0">Temperature</label>
            <div className="flex items-center rounded border border-slate-300 bg-white overflow-hidden shadow-xs focus-within:border-slate-900 focus-within:ring-1 focus-within:ring-slate-900">
              <input
                type="number"
                inputMode="decimal"
                step="1"
                min="-30"
                max="55"
                value={parameters.storageTempC}
                onChange={(e) => updateField('storageTempC', parseInt(e.target.value, 10) || 0)}
                className="w-18 sm:w-20 px-2 py-1.5 text-xs font-mono font-bold text-slate-900 text-right outline-none min-h-[32px]"
              />
              <span className="bg-slate-100 border-l border-slate-200 px-3 py-1.5 text-[11px] font-mono text-slate-600 select-none shrink-0 font-medium">
                °C
              </span>
            </div>
          </div>

          {/* Relative Humidity Box */}
          <div className="flex items-center justify-between gap-2 p-2 bg-slate-50/80 rounded border border-slate-200">
            <label className="text-xs font-semibold text-slate-800 shrink-0">Ambient Humidity</label>
            <div className="flex items-center rounded border border-slate-300 bg-white overflow-hidden shadow-xs focus-within:border-slate-900 focus-within:ring-1 focus-within:ring-slate-900">
              <input
                type="number"
                inputMode="numeric"
                step="1"
                min="10"
                max="100"
                value={parameters.relativeHumidity}
                onChange={(e) => updateField('relativeHumidity', parseInt(e.target.value, 10) || 10)}
                className="w-18 sm:w-20 px-2 py-1.5 text-xs font-mono font-bold text-slate-900 text-right outline-none min-h-[32px]"
              />
              <span className="bg-slate-100 border-l border-slate-200 px-2 py-1.5 text-[11px] font-mono text-slate-600 select-none shrink-0 font-medium">
                % RH
              </span>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1 text-xs">Transit Shock Condition</label>
            <select
              value={parameters.transportationRisk}
              onChange={(e) => updateField('transportationRisk', e.target.value as TransportationRisk)}
              className="w-full px-2 py-2 text-xs bg-white border border-slate-300 rounded font-mono shadow-xs focus:border-slate-900 outline-none min-h-[36px]"
            >
              <option value="standard">Standard Domestic (Low Vibration)</option>
              <option value="high_vibration">Long-Haul Rail/Road (High Vibration)</option>
              <option value="marine_humidity">Marine Freight (90%+ RH & Saline)</option>
              <option value="cold_chain_intermittent">Cold-Chain Intermittent Risk</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1 text-xs">Target Format</label>
            <select
              value={parameters.packagingFormat}
              onChange={(e) => updateField('packagingFormat', e.target.value as PackagingFormat)}
              className="w-full px-2 py-2 text-xs bg-white border border-slate-300 rounded font-mono shadow-xs focus:border-slate-900 outline-none min-h-[36px]"
            >
              <option value="standup_pouch">Stand-Up Pouch (Doypack)</option>
              <option value="flat_pouch">3-Side Flat Pillow Pouch</option>
              <option value="tray_lidding">Thermoformed Barrier Tray + Lidding</option>
              <option value="flow_wrap">Horizontal Flow-Wrap (HFFS)</option>
              <option value="vacuum_pack">Vacuum Skin Packaging (VSP)</option>
              <option value="rigid_container">Rigid Container + Membrane</option>
            </select>
          </div>
        </div>

        {/* Mobile apply/done button */}
        {onCloseMobile && (
          <div className="pt-2 lg:hidden">
            <button
              onClick={onCloseMobile}
              className="w-full py-2.5 bg-slate-900 text-white font-semibold rounded text-xs flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Check className="w-4 h-4" />
              <span>Apply & View Specs</span>
            </button>
          </div>
        )}

      </div>

    </aside>
  );
};
