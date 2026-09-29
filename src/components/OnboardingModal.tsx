import React, { useState } from 'react';
import { OnboardingProfile, PackagingParameters } from '../types/packaging';
import { FOOD_COMMODITIES } from '../data/foodCommodities';
import {
  Building2,
  Apple,
  Clock,
  DollarSign,
  Boxes,
  AlertTriangle,
  Truck,
  Cpu,
  Leaf,
  Globe2,
  ChevronRight,
  ChevronLeft,
  Check,
  X,
  Sparkles
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: OnboardingProfile;
  onComplete: (profile: OnboardingProfile, updatedParams?: Partial<PackagingParameters>) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onComplete,
}) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<OnboardingProfile>(currentProfile);

  if (!isOpen) return null;

  const totalSteps = 10;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep((prev) => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const handleFinish = () => {
    // Determine smart presets based on the 10 answers
    const updated: Partial<PackagingParameters> = {};

    // 1. Sector matching
    if (profile.industrySector.includes('Produce')) {
      const match = FOOD_COMMODITIES.find((c) => c.category === 'fresh_produce');
      if (match) {
        updated.commodityId = match.id;
        updated.customName = match.name;
        updated.category = 'fresh_produce';
        updated.moistureContent = match.standardMoisture;
        updated.waterActivity = match.waterActivity;
        updated.fatContent = match.fatContent;
        updated.pH = match.pH;
        updated.respirationRateClass = match.respirationRateClass;
        updated.respirationRateValue = match.respirationRateValue;
        updated.storageTempC = match.typicalTempC;
        updated.storageType = match.recommendedStorageType;
        updated.packagingFormat = 'tray_lidding';
      }
    } else if (profile.industrySector.includes('Bakery')) {
      const match = FOOD_COMMODITIES.find((c) => c.category === 'bakery_confectionery');
      if (match) {
        updated.commodityId = match.id;
        updated.customName = match.name;
        updated.category = 'bakery_confectionery';
        updated.moistureContent = match.standardMoisture;
        updated.waterActivity = match.waterActivity;
        updated.fatContent = match.fatContent;
        updated.pH = match.pH;
        updated.storageType = 'ambient';
        updated.storageTempC = 20;
        updated.packagingFormat = 'flow_wrap';
      }
    } else if (profile.industrySector.includes('Meat')) {
      const match = FOOD_COMMODITIES.find((c) => c.category === 'meat_poultry_seafood');
      if (match) {
        updated.commodityId = match.id;
        updated.customName = match.name;
        updated.category = 'meat_poultry_seafood';
        updated.moistureContent = match.standardMoisture;
        updated.waterActivity = match.waterActivity;
        updated.fatContent = match.fatContent;
        updated.pH = match.pH;
        updated.storageType = 'chilled';
        updated.storageTempC = 2;
        updated.packagingFormat = 'tray_lidding';
      }
    } else if (profile.industrySector.includes('Dry')) {
      const match = FOOD_COMMODITIES.find((c) => c.id === 'potato_chips') || FOOD_COMMODITIES.find((c) => c.category === 'dry_foods_cereals');
      if (match) {
        updated.commodityId = match.id;
        updated.customName = match.name;
        updated.category = 'dry_foods_cereals';
        updated.moistureContent = match.standardMoisture;
        updated.waterActivity = match.waterActivity;
        updated.fatContent = match.fatContent;
        updated.pH = match.pH;
        updated.storageType = 'ambient';
        updated.packagingFormat = 'standup_pouch';
      }
    }

    // 2. Logistics matching
    if (profile.distributionLogistics.includes('Marine')) {
      updated.transportationRisk = 'marine_humidity';
      updated.relativeHumidity = 92;
    } else if (profile.distributionLogistics.includes('Long-Haul') || profile.distributionLogistics.includes('Vibration')) {
      updated.transportationRisk = 'high_vibration';
    } else if (profile.distributionLogistics.includes('Cold-Chain')) {
      updated.transportationRisk = 'cold_chain_intermittent';
    }

    // 3. Scale matching
    if (profile.productionScale.includes('Pilot')) {
      updated.packWeightGram = 150;
    } else if (profile.productionScale.includes('Industrial')) {
      updated.packWeightGram = 500;
    }

    const finalProfile: OnboardingProfile = {
      ...profile,
      completed: true,
    };

    onComplete(finalProfile, updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-xs">
      <div className="bg-white rounded-lg border border-slate-300 shadow-2xl max-w-2xl w-full flex flex-col max-h-[96vh] sm:max-h-[92vh] overflow-hidden">
        
        {/* Top Progress Header */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-slate-500">
              Diagnostic Onboarding · Step 0{step} of {totalSteps}
            </span>
            <div className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
              Packaging & Enterprise Diagnostic Setup
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Skip / Close Diagnostic"
            className="p-1.5 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-200 text-xs font-mono flex items-center gap-1 min-h-[36px]"
          >
            <span>Skip</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 10-step progress bar */}
        <div className="w-full bg-slate-200 h-1">
          <div
            className="bg-slate-900 h-1 transition-all duration-200"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        {/* Question Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          
          {/* Question 1: Business Type */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-slate-700" />
                <h3 className="text-lg font-bold text-slate-900">01. What type of business entity are you?</h3>
              </div>
              <p className="text-xs text-slate-600">
                Helps us adapt technical barrier recommendations to your operational setup and supply chain maturity.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  { title: 'Farmer / Grower Cooperative', desc: 'Direct agricultural harvest, packhouses, fresh perishables' },
                  { title: 'Food Startup / Emerging CPG Brand', desc: 'New formulated food brand launching packaged shelf-stable or chilled items' },
                  { title: 'Small-to-Medium Food Processor', desc: 'Regional commercial food facility with established packaging lines' },
                  { title: 'Industrial Manufacturer / Multi-Facility', desc: 'High-speed automated production with strict mass retail standards' },
                  { title: 'Packaging Converter / Material Supplier', desc: 'Formulating film laminates, testing barrier specs for food clients' },
                  { title: 'Research & University Lab / Food Scientist', desc: 'Experimental shelf-life validation and circular polymer research' },
                ].map((item) => (
                  <button
                    key={item.title}
                    onClick={() => {
                      setProfile({ ...profile, businessType: item.title });
                      handleNext();
                    }}
                    className={`p-3 text-left rounded border transition-all ${
                      profile.businessType === item.title
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 hover:border-slate-400 bg-white text-slate-900'
                    }`}
                  >
                    <div className="font-semibold text-xs">{item.title}</div>
                    <div className={`text-[11px] mt-1 ${profile.businessType === item.title ? 'text-slate-300' : 'text-slate-500'}`}>
                      {item.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Question 2: Industry Sector */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Apple className="w-5 h-5 text-slate-700" />
                <h3 className="text-lg font-bold text-slate-900">02. What food industry sector are you working in?</h3>
              </div>
              <p className="text-xs text-slate-600">
                Calibrates biochemical degradation vectors (respiration, water activity, lipid oxidation).
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  { title: 'Fresh Produce & Horticulture', desc: 'Berries, cut fruit, leafy greens, mushrooms, herbs' },
                  { title: 'Bakery, Pastry & Biscuits', desc: 'Breads, croissants, crisp wafers, cookies, cakes' },
                  { title: 'Dairy, Plant-Dairy & Butter', desc: 'Cheeses, butter blocks, milk powders, vegan alternatives' },
                  { title: 'Meat, Poultry & Seafood', desc: 'Fresh beef steak, chilled poultry, smoked fish, shrimp' },
                  { title: 'Dry Foods, Grains & Snacks', desc: 'Potato chips, roasted nuts, basmati rice, coffee beans' },
                  { title: 'Sauces, Condiments & Liquids', desc: 'Tomato paste, orange juice, extra virgin olive oil' },
                ].map((item) => (
                  <button
                    key={item.title}
                    onClick={() => {
                      setProfile({ ...profile, industrySector: item.title });
                      handleNext();
                    }}
                    className={`p-3 text-left rounded border transition-all ${
                      profile.industrySector === item.title
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 hover:border-slate-400 bg-white text-slate-900'
                    }`}
                  >
                    <div className="font-semibold text-xs">{item.title}</div>
                    <div className={`text-[11px] mt-1 ${profile.industrySector === item.title ? 'text-slate-300' : 'text-slate-500'}`}>
                      {item.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Question 3: Company Age / Maturity */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-slate-700" />
                <h3 className="text-lg font-bold text-slate-900">03. What is the operational age of your business?</h3>
              </div>
              <p className="text-xs text-slate-600">
                Helps tailor between flexible off-the-shelf standard pouches or custom engineered laminate cylinders.
              </p>
              <div className="space-y-2.5 pt-2">
                {[
                  { title: 'Pre-launch / R&D Stage (< 1 year)', desc: 'Developing first commercial prototype or finalizing packaging recipe' },
                  { title: 'Early Growth (1 - 3 years)', desc: 'Scaling initial retail distribution, solving first spoilage complaints' },
                  { title: 'Established Operation (3 - 10 years)', desc: 'Steady distribution, looking to optimize packaging costs and sustainability' },
                  { title: 'Mature Enterprise (10+ years)', desc: 'Large production facilities undergoing circular transition away from multi-laminates' },
                ].map((item) => (
                  <button
                    key={item.title}
                    onClick={() => {
                      setProfile({ ...profile, companyAge: item.title });
                      handleNext();
                    }}
                    className={`w-full p-3 text-left rounded border transition-all ${
                      profile.companyAge === item.title
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 hover:border-slate-400 bg-white text-slate-900'
                    }`}
                  >
                    <div className="font-semibold text-xs">{item.title}</div>
                    <div className={`text-[11px] mt-0.5 ${profile.companyAge === item.title ? 'text-slate-300' : 'text-slate-500'}`}>
                      {item.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Question 4: Annual Revenue / Budget */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-slate-700" />
                <h3 className="text-lg font-bold text-slate-900">04. What is your approximate annual revenue / packaging budget?</h3>
              </div>
              <p className="text-xs text-slate-600">
                Enables realistic ROI calculations, payback periods, and MOQ (Minimum Order Quantity) viability.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  { title: 'Pre-revenue / Bootstrap', desc: 'Focus on low MOQ stock pouches and standard sealers' },
                  { title: 'Under $250k USD', desc: 'Small batch regional distribution' },
                  { title: '$250k - $1M USD', desc: 'Commercial growing brand with customized printed reels' },
                  { title: '$1M - $10M USD', desc: 'Mid-sized food manufacturer with automated lines' },
                  { title: '$10M+ Enterprise', desc: 'High-volume production with corporate ESG circular commitments' },
                ].map((item) => (
                  <button
                    key={item.title}
                    onClick={() => {
                      setProfile({ ...profile, annualRevenue: item.title });
                      handleNext();
                    }}
                    className={`p-3 text-left rounded border transition-all ${
                      profile.annualRevenue === item.title
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 hover:border-slate-400 bg-white text-slate-900'
                    }`}
                  >
                    <div className="font-semibold text-xs">{item.title}</div>
                    <div className={`text-[11px] mt-1 ${profile.annualRevenue === item.title ? 'text-slate-300' : 'text-slate-500'}`}>
                      {item.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Question 5: Production Scale */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Boxes className="w-5 h-5 text-slate-700" />
                <h3 className="text-lg font-bold text-slate-900">05. What production volume do you plan to pack per month?</h3>
              </div>
              <p className="text-xs text-slate-600">
                Directly impacts film extrusion feasibility, tooling costs, and spoilage reduction dollar savings.
              </p>
              <div className="space-y-2.5 pt-2">
                {[
                  { title: 'Pilot / Artisan Scale (< 5,000 packs/month)', desc: 'Pre-formed pouches, hand or semi-automatic sealing' },
                  { title: 'Commercial Scale (5,000 - 50,000 packs/month)', desc: 'Roll-fed automated packaging machinery, form-fill-seal' },
                  { title: 'High-Speed Mass Production (50,000 - 500,000+ packs/month)', desc: 'Multi-lane automated flow wrappers, thermoforming MAP lines' },
                ].map((item) => (
                  <button
                    key={item.title}
                    onClick={() => {
                      setProfile({ ...profile, productionScale: item.title });
                      handleNext();
                    }}
                    className={`w-full p-3 text-left rounded border transition-all ${
                      profile.productionScale === item.title
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 hover:border-slate-400 bg-white text-slate-900'
                    }`}
                  >
                    <div className="font-semibold text-xs">{item.title}</div>
                    <div className={`text-[11px] mt-0.5 ${profile.productionScale === item.title ? 'text-slate-300' : 'text-slate-500'}`}>
                      {item.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Question 6: Current Packaging Pain Point */}
          {step === 6 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-slate-700" />
                <h3 className="text-lg font-bold text-slate-900">06. What is your primary packaging pain point or bottleneck?</h3>
              </div>
              <p className="text-xs text-slate-600">
                Directs the engine's primary algorithm prioritization (barrier vs cost vs breathability).
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  { title: 'Premature Spoilage / Short Shelf-Life', desc: 'Food spoils before retail sale or returns rate is too high' },
                  { title: 'Moisture Softening / Crispness Loss', desc: 'Dry snacks or biscuits lose crunch within weeks' },
                  { title: 'Fat Oxidation & Rancid Odors', desc: 'Nuts, chips, or dairy develop off-flavors from light/oxygen' },
                  { title: 'Unrecyclable Packaging / High Landfill Taxes', desc: 'Current multi-layer foil cannot be recycled and faces EPR fines' },
                  { title: 'Lack of Technical Barrier & MAP Know-How', desc: 'Unsure what OTR, WVTR, or gas composition is scientifically needed' },
                  { title: 'Seal Failure & Leaker Contamination', desc: 'Seals break during vibration transit or fail through grease/dust' },
                ].map((item) => (
                  <button
                    key={item.title}
                    onClick={() => {
                      setProfile({ ...profile, primaryChallenge: item.title });
                      handleNext();
                    }}
                    className={`p-3 text-left rounded border transition-all ${
                      profile.primaryChallenge === item.title
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 hover:border-slate-400 bg-white text-slate-900'
                    }`}
                  >
                    <div className="font-semibold text-xs">{item.title}</div>
                    <div className={`text-[11px] mt-1 ${profile.primaryChallenge === item.title ? 'text-slate-300' : 'text-slate-500'}`}>
                      {item.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Question 7: Distribution Logistics */}
          {step === 7 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-slate-700" />
                <h3 className="text-lg font-bold text-slate-900">07. What distribution and transport conditions do you face?</h3>
              </div>
              <p className="text-xs text-slate-600">
                Calibrates mechanical puncture resistance, seal integrity under vibration, and moisture barrier.
              </p>
              <div className="space-y-2.5 pt-2">
                {[
                  { title: 'Local Direct / Farm-to-Table (< 24h)', desc: 'Short distances, immediate cold storage, low mechanical stress' },
                  { title: 'Domestic Supermarket Cold-Chain', desc: 'Continuous 2°C - 4°C chilled logistics with standard handling' },
                  { title: 'Long-Distance Road / Rail (High Vibration)', desc: 'Significant vibration, friction scuffing, potential rough transit' },
                  { title: 'Marine Container Export (90%+ RH & Saline)', desc: 'Severe humidity swings, condensation risk inside freight containers' },
                ].map((item) => (
                  <button
                    key={item.title}
                    onClick={() => {
                      setProfile({ ...profile, distributionLogistics: item.title });
                      handleNext();
                    }}
                    className={`w-full p-3 text-left rounded border transition-all ${
                      profile.distributionLogistics === item.title
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 hover:border-slate-400 bg-white text-slate-900'
                    }`}
                  >
                    <div className="font-semibold text-xs">{item.title}</div>
                    <div className={`text-[11px] mt-0.5 ${profile.distributionLogistics === item.title ? 'text-slate-300' : 'text-slate-500'}`}>
                      {item.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Question 8: Packaging Machinery */}
          {step === 8 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-slate-700" />
                <h3 className="text-lg font-bold text-slate-900">08. What packaging machinery or seal technology do you use?</h3>
              </div>
              <p className="text-xs text-slate-600">
                Dictates seal initiation temperature (SIT), hot tack strength, and film stiffness.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  { title: 'Manual Impulse / Hand Heat Sealer', desc: 'Basic table sealers, tolerant of wider temperature variations' },
                  { title: 'Semi-Automatic Vacuum / Tray Sealer', desc: 'Preformed trays with roll lidding or vacuum chamber pouches' },
                  { title: 'Continuous Horizontal Flow-Wrap (HFFS)', desc: 'High-speed packaging for bakery, snack bars, produce trays' },
                  { title: 'Vertical Form-Fill-Seal (VFFS)', desc: 'Continuous bagger for chips, grains, powders, frozen produce' },
                  { title: 'Automated Thermoforming MAP Line', desc: 'Form-fill-seal bottom web + top barrier lidding with gas flush' },
                ].map((item) => (
                  <button
                    key={item.title}
                    onClick={() => {
                      setProfile({ ...profile, packagingMachinery: item.title });
                      handleNext();
                    }}
                    className={`p-3 text-left rounded border transition-all ${
                      profile.packagingMachinery === item.title
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 hover:border-slate-400 bg-white text-slate-900'
                    }`}
                  >
                    <div className="font-semibold text-xs">{item.title}</div>
                    <div className={`text-[11px] mt-1 ${profile.packagingMachinery === item.title ? 'text-slate-300' : 'text-slate-500'}`}>
                      {item.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Question 9: Circularity Ambition */}
          {step === 9 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-slate-700" />
                <h3 className="text-lg font-bold text-slate-900">09. What is your Circular Economy and sustainability goal?</h3>
              </div>
              <p className="text-xs text-slate-600">
                Selects whether to prioritize mono-material polyolefin recycling or bio-compostable pathways.
              </p>
              <div className="space-y-2.5 pt-2">
                {[
                  { title: 'CEFLEX Mono-Material Recyclability (Class A)', desc: '≥ 95% single polymer (MDO-PE or mono-PP) compatible with standard recycling curbside' },
                  { title: '100% Certified Bio-Compostable (EN 13432)', desc: 'Regenerated cellulose or bio-PBS that composts organically without plastic residue' },
                  { title: 'Post-Consumer Recycled Content (PCR 30%+)', desc: 'Incorporate chemically certified food-contact recycled polymer' },
                  { title: 'Lowest Cost Standard Barrier (Non-Circular ok for now)', desc: 'Prioritize minimum material unit cost over circularity certifications' },
                ].map((item) => (
                  <button
                    key={item.title}
                    onClick={() => {
                      setProfile({ ...profile, circularityGoal: item.title });
                      handleNext();
                    }}
                    className={`w-full p-3 text-left rounded border transition-all ${
                      profile.circularityGoal === item.title
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 hover:border-slate-400 bg-white text-slate-900'
                    }`}
                  >
                    <div className="font-semibold text-xs">{item.title}</div>
                    <div className={`text-[11px] mt-0.5 ${profile.circularityGoal === item.title ? 'text-slate-300' : 'text-slate-500'}`}>
                      {item.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Question 10: Regulatory Standard */}
          {step === 10 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-slate-700" />
                <h3 className="text-lg font-bold text-slate-900">10. What geographic regulatory standards must you comply with?</h3>
              </div>
              <p className="text-xs text-slate-600">
                Configures food contact migration limits, overall migration testing, and packaging passport rules.
              </p>
              <div className="space-y-2.5 pt-2">
                {[
                  { title: 'European Union (EU 10/2011 & PPWR Directives)', desc: 'Strict overall migration limit < 10 mg/dm², mandatory recyclability grading' },
                  { title: 'United States (US FDA 21 CFR § 177 Polyolefins)', desc: 'FDA food contact notification, extractables in n-hexane / xylene' },
                  { title: 'FSSAI / India & Asia-Pacific Standards', desc: 'Bureau of Indian Standards IS 9845 / FSSAI Food Safety Regulations' },
                  { title: 'Global Multi-Market Compliance', desc: 'Harmonized specification complying simultaneously with EU, US FDA, and ISO 22000' },
                ].map((item) => (
                  <button
                    key={item.title}
                    onClick={() => {
                      setProfile({ ...profile, regulatoryRegion: item.title });
                    }}
                    className={`w-full p-3 text-left rounded border transition-all ${
                      profile.regulatoryRegion === item.title
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 hover:border-slate-400 bg-white text-slate-900'
                    }`}
                  >
                    <div className="font-semibold text-xs">{item.title}</div>
                    <div className={`text-[11px] mt-0.5 ${profile.regulatoryRegion === item.title ? 'text-slate-300' : 'text-slate-500'}`}>
                      {item.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer Navigation Buttons */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-2">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="px-3.5 py-2 text-xs font-semibold rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5 min-h-[44px]"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-2">
            {step < totalSteps ? (
              <button
                onClick={handleNext}
                className="px-5 py-2 text-xs font-semibold rounded bg-slate-900 text-white hover:bg-slate-800 flex items-center gap-1.5 min-h-[44px]"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="px-4 sm:px-5 py-2 text-xs font-semibold rounded bg-emerald-700 hover:bg-emerald-600 text-white flex items-center gap-2 shadow-xs min-h-[44px] text-center"
              >
                <Sparkles className="w-4 h-4 text-emerald-200 shrink-0" />
                <span>Apply Profile</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
