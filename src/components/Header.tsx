import React from 'react';
import { Eye, Printer, SlidersHorizontal, Sparkles, CheckCircle2, Menu } from 'lucide-react';
import { OnboardingProfile } from '../types/packaging';

export type WorkstationView =
  | 'specifications'
  | 'circularity'
  | 'shelflife'
  | 'traceability'
  | 'auditor'
  | 'materials'
  | 'standards'
  | 'formulation'
  | 'telemetry';

interface HeaderProps {
  activeView: WorkstationView;
  setActiveView: (view: WorkstationView) => void;
  highContrast: boolean;
  setHighContrast: (val: boolean | ((prev: boolean) => boolean)) => void;
  onPrint: () => void;
  onboardingProfile: OnboardingProfile;
  onOpenOnboarding: () => void;
  onToggleMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  highContrast,
  setHighContrast,
  onPrint,
  onboardingProfile,
  onOpenOnboarding,
  onToggleMobileSidebar,
}) => {
  return (
    <header className="h-14 bg-white border-b border-slate-200 shrink-0 z-30 flex items-center justify-between px-3 sm:px-4 lg:px-6 transition-colors select-none">
      
      {/* Zone 1: Mobile Sidebar Toggle + Wordmark + Diagnostic Trigger */}
      <div className="flex items-center gap-2 sm:gap-3">
        
        {/* Mobile/Tablet Parameter Drawer Toggle Button */}
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 -ml-1 text-slate-700 hover:text-slate-900 rounded hover:bg-slate-100 flex items-center justify-center min-w-[40px] min-h-[40px]"
          aria-label="Open Formulation Parameters Drawer"
          title="Open Formulation Drawer"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>

        <a
          href="/"
          onClick={(e) => { e.preventDefault(); setActiveView('specifications'); }}
          className="text-sm sm:text-base font-bold tracking-tight text-slate-900 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap"
        >
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-slate-900 inline-block"></span>
          <span className="hidden xs:inline">CircuPack</span>
          <span className="xs:hidden">CircuPack</span>
          <span className="text-slate-400 font-normal hidden sm:inline">AI</span>
        </a>

        {/* Diagnostic Onboarding Status Badge / Action */}
        <button
          onClick={onOpenOnboarding}
          className="flex items-center gap-1 px-2 py-1 text-[11px] font-mono rounded border transition-colors border-slate-300 hover:border-slate-800 bg-slate-50 text-slate-800 truncate max-w-[140px] sm:max-w-[220px]"
          title="Click to view or edit 10-Question Enterprise Diagnostic"
        >
          {onboardingProfile.completed ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">
                {onboardingProfile.businessType.split('/')[0].trim()}
              </span>
            </>
          ) : (
            <>
              <Sparkles className="w-3 h-3 text-emerald-600 shrink-0" />
              <span className="truncate">Setup (10 Qs)</span>
            </>
          )}
        </button>
      </div>

      {/* Zone 2: Workspace View Mode Tabs (Desktop Only) */}
      <nav className="hidden lg:flex items-center gap-5 text-xs font-mono font-medium text-slate-600">
        <button
          onClick={() => setActiveView('specifications')}
          className={`py-1 transition-colors whitespace-nowrap ${
            activeView === 'specifications'
              ? 'text-slate-900 font-bold border-b-2 border-slate-900'
              : 'hover:text-slate-900'
          }`}
        >
          01. Specs & Barrier
        </button>
        <button
          onClick={() => setActiveView('circularity')}
          className={`py-1 transition-colors whitespace-nowrap ${
            activeView === 'circularity'
              ? 'text-slate-900 font-bold border-b-2 border-slate-900'
              : 'hover:text-slate-900'
          }`}
        >
          02. Circular LCA
        </button>
        <button
          onClick={() => setActiveView('shelflife')}
          className={`py-1 transition-colors whitespace-nowrap ${
            activeView === 'shelflife'
              ? 'text-slate-900 font-bold border-b-2 border-slate-900'
              : 'hover:text-slate-900'
          }`}
        >
          03. Shelf-Life Decay
        </button>
        <button
          onClick={() => setActiveView('traceability')}
          className={`py-1 transition-colors whitespace-nowrap ${
            activeView === 'traceability'
              ? 'text-slate-900 font-bold border-b-2 border-slate-900'
              : 'hover:text-slate-900'
          }`}
        >
          04. QR Passport
        </button>
        <button
          onClick={() => setActiveView('auditor')}
          className={`py-1 transition-colors whitespace-nowrap ${
            activeView === 'auditor'
              ? 'text-slate-900 font-bold border-b-2 border-slate-900'
              : 'hover:text-slate-900'
          }`}
        >
          05. AI Copilot
        </button>
        <button
          onClick={() => setActiveView('materials')}
          className={`py-1 transition-colors whitespace-nowrap ${
            activeView === 'materials'
              ? 'text-slate-900 font-bold border-b-2 border-slate-900'
              : 'hover:text-slate-900'
          }`}
        >
          Materials DB
        </button>
        <button
          onClick={() => setActiveView('standards')}
          className={`py-1 transition-colors whitespace-nowrap ${
            activeView === 'standards'
              ? 'text-slate-900 font-bold border-b-2 border-slate-900'
              : 'hover:text-slate-900'
          }`}
        >
          Standards
        </button>
      </nav>

      {/* Zone 3: Actions (High-Contrast, Datasheet Export) */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={() => setHighContrast((prev) => !prev)}
          aria-label="Toggle High-Contrast Accessibility Mode"
          title="Toggle High-Contrast (for Factory Floor & Cold Room Tablets)"
          className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded border text-xs font-mono flex items-center gap-1.5 transition-colors min-h-[36px] ${
            highContrast
              ? 'bg-black text-white border-black font-bold'
              : 'bg-white text-slate-700 border-slate-300 hover:border-slate-500'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden xl:inline">High Contrast</span>
        </button>

        <button
          onClick={onPrint}
          aria-label="Print or Export Technical Datasheet"
          title="Export Laboratory Technical Datasheet"
          className="p-1.5 sm:px-3 sm:py-1.5 text-xs font-semibold text-white bg-slate-900 rounded hover:bg-slate-800 transition-colors flex items-center gap-1.5 whitespace-nowrap min-h-[36px]"
        >
          <Printer className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export</span>
        </button>
      </div>

    </header>
  );
};
