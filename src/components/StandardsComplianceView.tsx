import React from 'react';
import { ShieldCheck, BookOpen, Scale, Award, CheckCircle } from 'lucide-react';

export const StandardsComplianceView: React.FC = () => {
  const standards = [
    {
      code: 'ASTM D3985 / ISO 15105-2',
      title: 'Oxygen Gas Transmission Rate (OTR)',
      scope: 'Standard Test Method for Oxygen Gas Transmission Rate Through Plastic Film and Sheeting Using a Coulometric Sensor.',
      measurement: 'Measured in cc / (m² · 24h · 1 atm) at 23°C and 0% RH.',
      importance: 'Governs lipid auto-oxidation in fatty foods, oxidative nutrient decay, and aerobic fungal/bacterial mold development.'
    },
    {
      code: 'ASTM F1249 / ISO 15106-3',
      title: 'Water Vapor Transmission Rate (WVTR)',
      scope: 'Standard Test Method for Water Vapor Transmission Rate Through Plastic Film and Sheeting Using a Modulated Infrared Sensor.',
      measurement: 'Measured in g / (m² · 24h) at 38°C and 90% RH.',
      importance: 'Determines crispness loss in dry bakery and snack products, weight loss in fresh cuts, and moisture migration in multi-component foods.'
    },
    {
      code: 'EU Regulation (EU) No 10/2011',
      title: 'Plastic Materials and Articles in Food Contact (PIM)',
      scope: 'Harmonized European standard for safety of plastic materials in contact with foodstuffs.',
      measurement: 'Overall Migration Limit (OML): ≤ 10 mg/dm² of surface area (or 60 mg/kg of food).',
      importance: 'Regulates monomer release, plasticizer migration, and Non-Intentionally Added Substances (NIAS) across fat, acid, and water food simulants.'
    },
    {
      code: 'US FDA 21 CFR § 177.1520',
      title: 'Polyolefin Food Contact Resins',
      scope: 'United States Food and Drug Administration criteria for polyethylene and polypropylene polymers in contact with food.',
      measurement: 'Extractable fractions in n-hexane at reflux and xylene-soluble limits.',
      importance: 'Mandatory standard for food packaging used in US interstate commerce and global agricultural export.'
    },
    {
      code: 'CEFLEX Circular Design Guidelines',
      title: 'Designing for a Circular Economy (D4ACE)',
      scope: 'European industrial coalition standard for flexible packaging mechanical recyclability.',
      measurement: '≥ 95% mono-polyolefin purity by weight (Mono-PE or Mono-PP). EVOH barrier must remain < 5% w/w with tie layers.',
      importance: 'Eliminates unrecyclable multi-material laminate waste and enables sorting into high-value post-consumer recyclate.'
    },
    {
      code: 'EN 13432 / ASTM D6400',
      title: 'Compostability & Biodegradability Criteria',
      scope: 'Requirements for packaging recoverable through industrial and municipal composting.',
      measurement: '≥ 90% disintegration within 12 weeks, heavy metal concentrations below stringent ecotoxicity thresholds.',
      importance: 'Critical specification when selecting bio-polymers (PLA, PBAT, cellulose) for organic food packaging.'
    }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 mb-8">
      <div className="pb-4 mb-6 border-b border-slate-200">
        <span className="text-xs font-mono uppercase tracking-wider text-slate-500">
          Regulatory & Metrology Framework
        </span>
        <h3 className="text-2xl font-bold text-slate-900 mt-1">
          Packaging Standards & Compliance Guide
        </h3>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          Overview of global testing standards and circular design benchmarks integrated into the CircuPack AI recommendation calculations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {standards.map((std, i) => (
          <div key={i} className="p-4 rounded border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                {std.code}
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            
            <h4 className="text-sm font-bold text-slate-900 mt-2">
              {std.title}
            </h4>
            
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {std.scope}
            </p>

            <div className="mt-3 pt-2 border-t border-slate-200/80 text-[11px] font-mono space-y-1">
              <div>
                <span className="text-slate-500">Benchmark: </span>
                <span className="text-slate-800">{std.measurement}</span>
              </div>
              <div>
                <span className="text-slate-500">Quality Impact: </span>
                <span className="text-slate-700">{std.importance}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
