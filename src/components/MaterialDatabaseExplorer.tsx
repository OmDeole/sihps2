import React, { useState } from 'react';
import { PACKAGING_MATERIALS_DB } from '../data/packagingMaterials';
import { PackagingMaterialDBItem } from '../types/packaging';
import { Search, Database, ExternalLink, Filter, Check } from 'lucide-react';

interface MaterialDatabaseExplorerProps {
  onSelectMaterialForComparison?: (material: PackagingMaterialDBItem) => void;
}

export const MaterialDatabaseExplorer: React.FC<MaterialDatabaseExplorerProps> = ({
  onSelectMaterialForComparison,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<PackagingMaterialDBItem | null>(null);

  const categories = ['all', 'Polyolefin', 'Polyester', 'Bio-polymer', 'Laminate Foil', 'Cellulose / Paper', 'Polyamide'];

  const filteredMaterials = PACKAGING_MATERIALS_DB.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesQuery = item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.code.toLowerCase().includes(search.toLowerCase()) ||
      item.typicalUses.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-4 mb-5 border-b border-slate-200 gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-slate-500">
            ASTM / ISO Barrier Reference Database
          </span>
          <h3 className="text-2xl font-bold text-slate-900">
            Packaging Substrates & Barrier Film Library
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            Empirical transmission rates measured at 25 µm standard thickness (OTR at 23°C, 0% RH · WVTR at 38°C, 90% RH).
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search material or code..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-slate-900"
          />
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-thin">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap capitalize ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Interactive Tabular Comparison (Swiss Data Table) */}
      <div className="overflow-x-auto border border-slate-200 rounded">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
            <tr>
              <th className="py-2.5 px-3">Substrate Name</th>
              <th className="py-2.5 px-3">Code</th>
              <th className="py-2.5 px-3">OTR (cc/m²·24h)</th>
              <th className="py-2.5 px-3">WVTR (g/m²·24h)</th>
              <th className="py-2.5 px-3">Tensile (MPa)</th>
              <th className="py-2.5 px-3">Seal Window</th>
              <th className="py-2.5 px-3">Circularity Score</th>
              <th className="py-2.5 px-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredMaterials.map((mat) => {
              const isSelected = selectedItem?.id === mat.id;
              return (
                <tr
                  key={mat.id}
                  onClick={() => setSelectedItem(mat)}
                  className={`hover:bg-slate-50/80 cursor-pointer transition-colors ${
                    isSelected ? 'bg-slate-100/70 font-semibold' : ''
                  }`}
                >
                  <td className="py-2.5 px-3 font-sans font-medium text-slate-900">
                    {mat.name}
                    {mat.bioBased && (
                      <span className="text-[10px] font-mono text-emerald-700 ml-1.5">
                        (Bio-Derived)
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-slate-700">{mat.code}</td>
                  <td className="py-2.5 px-3 tabular-nums">
                    {mat.otrAt23C >= 1000 ? mat.otrAt23C.toLocaleString() : mat.otrAt23C}
                  </td>
                  <td className="py-2.5 px-3 tabular-nums">{mat.wvtrAt38C}</td>
                  <td className="py-2.5 px-3 tabular-nums">{mat.tensileStrengthMpa}</td>
                  <td className="py-2.5 px-3 text-slate-600">{mat.heatSealTempRangeC}</td>
                  <td className="py-2.5 px-3 tabular-nums">
                    <span className="font-bold text-slate-900">{mat.circularityScore}</span> / 100
                  </td>
                  <td className="py-2.5 px-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItem(mat);
                      }}
                      className="px-2 py-0.5 text-[11px] font-medium border border-slate-300 rounded hover:bg-white text-slate-800"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Selected Material Inspector Drawer */}
      {selectedItem && (
        <div className="mt-5 p-4 rounded border border-slate-300 bg-slate-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-200 mb-3 gap-2">
            <div>
              <span className="text-xs font-mono uppercase text-slate-500">Substrate Deep Profile</span>
              <h4 className="text-base font-bold text-slate-900">
                {selectedItem.name} ({selectedItem.code})
              </h4>
            </div>
            <span className="text-xs font-mono text-slate-700 bg-white px-2 py-1 rounded border border-slate-200">
              Recyclability: {selectedItem.recyclabilityTier}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono mb-3">
            <div>
              <span className="text-slate-500">Density: </span>
              <span className="text-slate-900 font-bold">{selectedItem.densityGcm3} g/cm³</span>
            </div>
            <div>
              <span className="text-slate-500">Puncture Resistance: </span>
              <span className="text-slate-900 font-bold">{selectedItem.punctureResistanceN} Newtons</span>
            </div>
            <div>
              <span className="text-slate-500">Circularity Rating: </span>
              <span className="text-emerald-800 font-bold">{selectedItem.circularityScore} / 100</span>
            </div>
          </div>

          <div className="text-xs text-slate-700 leading-relaxed">
            <strong>Industrial Applications: </strong>{selectedItem.typicalUses}
          </div>
        </div>
      )}

    </div>
  );
};
