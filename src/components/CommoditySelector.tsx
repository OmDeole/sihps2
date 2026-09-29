import React, { useState } from 'react';
import { FoodCategory, FoodCommodity } from '../types/packaging';
import { FOOD_COMMODITIES } from '../data/foodCommodities';
import { Search, Sparkles, SlidersHorizontal } from 'lucide-react';

interface CommoditySelectorProps {
  selectedCommodityId: string;
  onSelectCommodity: (commodity: FoodCommodity) => void;
  isCustomMode: boolean;
  setIsCustomMode: (val: boolean) => void;
}

const CATEGORIES: { id: FoodCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All Commodities' },
  { id: 'fresh_produce', label: 'Fresh Produce' },
  { id: 'bakery_confectionery', label: 'Bakery & Pastry' },
  { id: 'dairy_beverages', label: 'Dairy & Fats' },
  { id: 'meat_poultry_seafood', label: 'Meat & Seafood' },
  { id: 'dry_foods_cereals', label: 'Dry Foods & Snacks' },
  { id: 'sauces_liquids', label: 'Sauces & Liquids' },
];

export const CommoditySelector: React.FC<CommoditySelectorProps> = ({
  selectedCommodityId,
  onSelectCommodity,
  isCustomMode,
  setIsCustomMode,
}) => {
  const [activeCategory, setActiveCategory] = useState<FoodCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = FOOD_COMMODITIES.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.vulnerabilitySummary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-white border-b border-slate-200 pb-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-slate-500">
            Phase 01 / Commodity Profile Selection
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Food Commodity & Physicochemical Matrix
          </h2>
          <p className="text-sm text-slate-600 mt-0.5">
            Select a verified food profile with calibrated respiration and barrier sensitivity, or customize custom formulation parameters.
          </p>
        </div>

        {/* Custom Mode Toggle Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCustomMode(!isCustomMode)}
            className={`px-3 py-2 text-xs font-semibold rounded border transition-colors flex items-center gap-1.5 ${
              isCustomMode
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-300 hover:border-slate-500'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{isCustomMode ? 'Using Custom Formulation' : 'Create Custom Formulation'}</span>
          </button>
        </div>
      </div>

      {/* Category Filter Bar (Interactive segmented buttons) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-thin">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
              activeCategory === cat.id
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative mb-4">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter commodities by name or degradation vulnerability (e.g., strawberry, oxidation, mold, respiration)..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-slate-900 transition-colors"
        />
      </div>

      {/* Commodity Quick Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-h-72 overflow-y-auto pr-1">
        {filtered.map((item) => {
          const isSelected = !isCustomMode && selectedCommodityId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setIsCustomMode(false);
                onSelectCommodity(item);
              }}
              className={`text-left p-3 rounded border transition-all ${
                isSelected
                  ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-400 text-slate-900'
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="font-semibold text-sm leading-snug">{item.name}</span>
                <span className={`text-[10px] font-mono uppercase tracking-wider ${
                  isSelected ? 'text-slate-300' : 'text-slate-500'
                }`}>
                  {item.recommendedStorageType}
                </span>
              </div>

              {/* Clean unboxed metadata with separators (Anti-slop zero-pill standard) */}
              <div className={`mt-2 flex items-center gap-2 text-xs font-mono tabular-nums ${
                isSelected ? 'text-slate-300' : 'text-slate-500'
              }`}>
                <span>{item.standardMoisture}% H₂O</span>
                <span aria-hidden="true">·</span>
                <span>{item.fatContent}% Fat</span>
                <span aria-hidden="true">·</span>
                <span>pH {item.pH}</span>
              </div>

              {item.respirationRateValue > 0 && (
                <div className={`mt-1 text-[11px] font-mono ${
                  isSelected ? 'text-emerald-300' : 'text-emerald-700'
                }`}>
                  Resp: {item.respirationRateValue} mg CO₂/kg·h
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
