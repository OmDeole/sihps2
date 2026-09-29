/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Header, WorkstationView } from './components/Header';
import { WorkstationSidebar } from './components/WorkstationSidebar';
import { WorkstationTelemetryDock } from './components/WorkstationTelemetryDock';
import { SpecificationDisplay } from './components/SpecificationDisplay';
import { CircularityScorecard } from './components/CircularityScorecard';
import { ShelfLifeChart } from './components/ShelfLifeChart';
import { TraceabilityPassport } from './components/TraceabilityPassport';
import { AiPackagingAuditor } from './components/AiPackagingAuditor';
import { MaterialDatabaseExplorer } from './components/MaterialDatabaseExplorer';
import { StandardsComplianceView } from './components/StandardsComplianceView';
import { RoiCalculatorModal } from './components/RoiCalculatorModal';
import { PrintDatasheetView } from './components/PrintDatasheetView';
import { OnboardingModal } from './components/OnboardingModal';
import { FOOD_COMMODITIES } from './data/foodCommodities';
import { calculatePackagingSpecification } from './utils/packagingEngine';
import { PackagingParameters, FoodCommodity, OnboardingProfile } from './types/packaging';
import {
  SlidersHorizontal,
  Layers,
  Leaf,
  Clock,
  Sparkles,
  QrCode,
  Activity,
  Database,
  BookOpen
} from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState<WorkstationView>('specifications');
  const [highContrast, setHighContrast] = useState(false);
  const [selectedCommodityId, setSelectedCommodityId] = useState<string>('strawberries');
  const [isRoiModalOpen, setIsRoiModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Initial Onboarding Profile
  const [onboardingProfile, setOnboardingProfile] = useState<OnboardingProfile>(() => {
    try {
      const saved = localStorage.getItem('circupack_onboarding');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return {
      completed: false,
      businessType: 'Food Startup / CPG Brand',
      industrySector: 'Fresh Produce & Horticulture',
      companyAge: 'Early Growth (1 - 3 years)',
      annualRevenue: '$250k - $1M USD',
      productionScale: 'Commercial Scale (5,000 - 50,000 packs/month)',
      primaryChallenge: 'Premature Spoilage / Short Shelf-Life',
      distributionLogistics: 'Domestic Supermarket Cold-Chain',
      packagingMachinery: 'Semi-Automatic Vacuum / Tray Sealer',
      circularityGoal: 'CEFLEX Mono-Material Recyclability (Class A)',
      regulatoryRegion: 'European Union (EU 10/2011 & PPWR Directives)',
    };
  });

  // Prompt onboarding on initial launch if not completed
  useEffect(() => {
    if (!onboardingProfile.completed) {
      setIsOnboardingOpen(true);
    }
  }, []);

  // Initial Commodity
  const initialCommodity = useMemo(() => {
    return FOOD_COMMODITIES.find((c) => c.id === selectedCommodityId) || FOOD_COMMODITIES[0];
  }, [selectedCommodityId]);

  // Parameters
  const [parameters, setParameters] = useState<PackagingParameters>({
    commodityId: initialCommodity.id,
    customName: initialCommodity.name,
    category: initialCommodity.category,
    moistureContent: initialCommodity.standardMoisture,
    waterActivity: initialCommodity.waterActivity,
    fatContent: initialCommodity.fatContent,
    pH: initialCommodity.pH,
    respirationRateClass: initialCommodity.respirationRateClass,
    respirationRateValue: initialCommodity.respirationRateValue,
    desiredShelfLifeDays: initialCommodity.targetShelfLifeDays,
    storageTempC: initialCommodity.typicalTempC,
    storageType: initialCommodity.recommendedStorageType,
    relativeHumidity: 85,
    transportationRisk: 'standard',
    packagingFormat: 'tray_lidding',
    packWeightGram: 250,
  });

  // Calculate live engineering specification
  const specification = useMemo(() => {
    return calculatePackagingSpecification(parameters);
  }, [parameters]);

  // Handle commodity selection
  const handleSelectCommodity = (commodity: FoodCommodity) => {
    setSelectedCommodityId(commodity.id);
    let format: PackagingParameters['packagingFormat'] = 'standup_pouch';
    if (commodity.category === 'fresh_produce') format = 'tray_lidding';
    if (commodity.category === 'meat_poultry_seafood') format = 'tray_lidding';
    if (commodity.category === 'bakery_confectionery') format = 'flow_wrap';

    setParameters({
      commodityId: commodity.id,
      customName: commodity.name,
      category: commodity.category,
      moistureContent: commodity.standardMoisture,
      waterActivity: commodity.waterActivity,
      fatContent: commodity.fatContent,
      pH: commodity.pH,
      respirationRateClass: commodity.respirationRateClass,
      respirationRateValue: commodity.respirationRateValue,
      desiredShelfLifeDays: commodity.targetShelfLifeDays,
      storageTempC: commodity.typicalTempC,
      storageType: commodity.recommendedStorageType,
      relativeHumidity: commodity.category === 'fresh_produce' ? 90 : 65,
      transportationRisk: 'standard',
      packagingFormat: format,
      packWeightGram: 250,
    });
  };

  const handleReset = () => {
    handleSelectCommodity(initialCommodity);
  };

  const handleSwapAlternative = () => {
    setParameters((prev) => ({
      ...prev,
      customName: `${prev.customName} (Bio-Compostable Pack)`,
      desiredShelfLifeDays: Math.max(3, prev.desiredShelfLifeDays + specification.circularAlternative.shelfLifeImpactDays),
    }));
  };

  const handleOnboardingComplete = (newProfile: OnboardingProfile, updatedParams?: Partial<PackagingParameters>) => {
    setOnboardingProfile(newProfile);
    try {
      localStorage.setItem('circupack_onboarding', JSON.stringify(newProfile));
    } catch (e) {
      // ignore
    }
    if (updatedParams) {
      setParameters((prev) => ({
        ...prev,
        ...updatedParams,
      }));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`h-screen w-screen overflow-hidden flex flex-col ${highContrast ? 'high-contrast bg-white text-black' : 'bg-slate-100 text-slate-900'}`}>
      
      {/* 1. Top Application Ribbon */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        onPrint={handlePrint}
        onboardingProfile={onboardingProfile}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
      />

      {/* 2. Main Workstation Area */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Desktop Docked Sidebar (>= 1024px) */}
        <div className="hidden lg:flex h-full shrink-0">
          <WorkstationSidebar
            parameters={parameters}
            onChange={setParameters}
            onSelectCommodity={handleSelectCommodity}
            onReset={handleReset}
          />
        </div>

        {/* Mobile / Tablet Off-Canvas Drawer (< 1024px) */}
        {isMobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            />
            {/* Slide-out Sheet */}
            <div className="relative z-10 w-full sm:w-96 max-w-[88vw] h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-200">
              <WorkstationSidebar
                parameters={parameters}
                onChange={setParameters}
                onSelectCommodity={handleSelectCommodity}
                onReset={handleReset}
                onCloseMobile={() => setIsMobileSidebarOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Center Main Stage */}
        <main className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50/70">
          
          {/* Sub-view Horizontal Tabs for Tablets & Mobile */}
          <div className="lg:hidden flex items-center gap-1 overflow-x-auto px-2 py-1.5 bg-white border-b border-slate-200 text-xs font-mono shrink-0 scrollbar-none">
            <button
              onClick={() => setActiveView('specifications')}
              className={`px-2.5 py-1.5 rounded whitespace-nowrap min-h-[32px] ${activeView === 'specifications' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Specs
            </button>
            <button
              onClick={() => setActiveView('circularity')}
              className={`px-2.5 py-1.5 rounded whitespace-nowrap min-h-[32px] ${activeView === 'circularity' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Circular LCA
            </button>
            <button
              onClick={() => setActiveView('shelflife')}
              className={`px-2.5 py-1.5 rounded whitespace-nowrap min-h-[32px] ${activeView === 'shelflife' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Shelf-Life
            </button>
            <button
              onClick={() => setActiveView('traceability')}
              className={`px-2.5 py-1.5 rounded whitespace-nowrap min-h-[32px] ${activeView === 'traceability' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              QR Passport
            </button>
            <button
              onClick={() => setActiveView('auditor')}
              className={`px-2.5 py-1.5 rounded whitespace-nowrap min-h-[32px] ${activeView === 'auditor' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              AI Copilot
            </button>
            <button
              onClick={() => setActiveView('telemetry')}
              className={`px-2.5 py-1.5 rounded whitespace-nowrap min-h-[32px] ${activeView === 'telemetry' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Telemetry
            </button>
            <button
              onClick={() => setActiveView('formulation')}
              className={`px-2.5 py-1.5 rounded whitespace-nowrap min-h-[32px] ${activeView === 'formulation' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Formulation
            </button>
            <button
              onClick={() => setActiveView('materials')}
              className={`px-2.5 py-1.5 rounded whitespace-nowrap min-h-[32px] ${activeView === 'materials' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Materials DB
            </button>
            <button
              onClick={() => setActiveView('standards')}
              className={`px-2.5 py-1.5 rounded whitespace-nowrap min-h-[32px] ${activeView === 'standards' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Standards
            </button>
          </div>

          {/* Active View Content Workspace */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-6 max-w-5xl mx-auto w-full pb-20 lg:pb-6">
            
            {/* View 1: Specification Console */}
            {activeView === 'specifications' && (
              <SpecificationDisplay
                specification={specification}
                onOpenAudit={() => setActiveView('auditor')}
                onOpenRoi={() => setIsRoiModalOpen(true)}
              />
            )}

            {/* View 2: Circular LCA & Alternative Swap */}
            {activeView === 'circularity' && (
              <CircularityScorecard
                specification={specification}
                onSwapToAlternative={handleSwapAlternative}
              />
            )}

            {/* View 3: Kinetic Shelf-Life Decay */}
            {activeView === 'shelflife' && (
              <ShelfLifeChart specification={specification} />
            )}

            {/* View 4: Traceability Passport & QR */}
            {activeView === 'traceability' && (
              <TraceabilityPassport specification={specification} />
            )}

            {/* View 5: AI Food Scientist Copilot */}
            {activeView === 'auditor' && (
              <AiPackagingAuditor
                parameters={parameters}
                specification={specification}
              />
            )}

            {/* View 6: ASTM Material Library */}
            {activeView === 'materials' && (
              <MaterialDatabaseExplorer
                onSelectMaterialForComparison={(mat) => {
                  setActiveView('specifications');
                  setParameters((prev) => ({
                    ...prev,
                    customName: `${prev.customName} (${mat.code})`,
                  }));
                }}
              />
            )}

            {/* View 7: Standards & Regulatory Compliance */}
            {activeView === 'standards' && (
              <StandardsComplianceView />
            )}

            {/* View 8: Full Formulation Console (Accessible directly on mobile) */}
            {activeView === 'formulation' && (
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <WorkstationSidebar
                  parameters={parameters}
                  onChange={setParameters}
                  onSelectCommodity={handleSelectCommodity}
                  onReset={handleReset}
                />
              </div>
            )}

            {/* View 9: Telemetry Card for Mobile/Tablet */}
            {activeView === 'telemetry' && (
              <WorkstationTelemetryDock
                specification={specification}
                onboardingProfile={onboardingProfile}
                onOpenOnboarding={() => setIsOnboardingOpen(true)}
                onOpenAudit={() => setActiveView('auditor')}
                onOpenRoi={() => setIsRoiModalOpen(true)}
                asMainView={true}
              />
            )}

          </div>

        </main>

        {/* Right Telemetry & Diagnostic Dock (Desktop only >= 1280px) */}
        <WorkstationTelemetryDock
          specification={specification}
          onboardingProfile={onboardingProfile}
          onOpenOnboarding={() => setIsOnboardingOpen(true)}
          onOpenAudit={() => setActiveView('auditor')}
          onOpenRoi={() => setIsRoiModalOpen(true)}
        />

      </div>

      {/* 3. Mobile Sticky Bottom Action Bar (< 1024px) - Thumb-friendly, >= 44px touch targets */}
      <nav
        aria-label="Mobile Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 h-14 bg-white border-t border-slate-200 z-40 flex items-center justify-around px-2 select-none shadow-lg"
      >
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 rounded ${
            isMobileSidebarOpen ? 'text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
          title="Open Formulation Drawer"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="text-[10px] font-mono mt-0.5">Params</span>
        </button>

        <button
          onClick={() => setActiveView('specifications')}
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 rounded ${
            activeView === 'specifications' ? 'text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span className="text-[10px] font-mono mt-0.5">Specs</span>
        </button>

        <button
          onClick={() => setActiveView('circularity')}
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 rounded ${
            activeView === 'circularity' ? 'text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Leaf className="w-4 h-4" />
          <span className="text-[10px] font-mono mt-0.5">LCA</span>
        </button>

        <button
          onClick={() => setActiveView('shelflife')}
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 rounded ${
            activeView === 'shelflife' ? 'text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span className="text-[10px] font-mono mt-0.5">Shelf-Life</span>
        </button>

        <button
          onClick={() => setActiveView('auditor')}
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 rounded ${
            activeView === 'auditor' ? 'text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span className="text-[10px] font-mono mt-0.5">AI Audit</span>
        </button>

        <button
          onClick={() => setActiveView('telemetry')}
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 rounded ${
            activeView === 'telemetry' ? 'text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span className="text-[10px] font-mono mt-0.5">Gauges</span>
        </button>
      </nav>

      {/* 4. Desktop Bottom Workstation Telemetry Status Bar (>= 1024px) */}
      <footer className="hidden lg:flex h-8 bg-white border-t border-slate-200 px-4 items-center justify-between text-[11px] font-mono text-slate-600 shrink-0 select-none z-20">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-bold text-slate-900">ENGINE NOMINAL</span>
          </span>
          <span aria-hidden="true" className="text-slate-300">|</span>
          <span className="hidden sm:inline">
            Batch: <strong className="text-slate-800">{specification.traceabilityPassport.dppBatchId}</strong>
          </span>
          <span aria-hidden="true" className="text-slate-300 hidden sm:inline">|</span>
          <span className="truncate">
            Substrate: <strong className="text-slate-900">{specification.primaryRecommendation.materialCode}</strong>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden md:inline text-slate-500">
            OTR: {specification.barrierSpecs.otr.target.toLocaleString()} cc · WVTR: {specification.barrierSpecs.wvtr.target.toLocaleString()} g
          </span>
          <span aria-hidden="true" className="text-slate-300 hidden md:inline">|</span>
          <span className="font-bold text-emerald-700">
            Circularity {specification.circularity.circularityScore}/100
          </span>
        </div>
      </footer>

      {/* 10-Question Diagnostic Onboarding Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        currentProfile={onboardingProfile}
        onComplete={handleOnboardingComplete}
      />

      {/* Spoilage Loss & ROI Modal */}
      <RoiCalculatorModal
        isOpen={isRoiModalOpen}
        onClose={() => setIsRoiModalOpen(false)}
        specification={specification}
        parameters={parameters}
      />

      {/* Print Technical Datasheet */}
      <PrintDatasheetView
        specification={specification}
        parameters={parameters}
      />

    </div>
  );
}
