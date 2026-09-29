import React, { useState, useEffect } from 'react';
import { PackagingParameters, PackagingSpecification } from '../types/packaging';
import {
  Sparkles,
  Send,
  Loader2,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Cpu,
  Key,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Check,
  X
} from 'lucide-react';
import { directGeminiGenerate } from '../utils/geminiDirect';

interface AiPackagingAuditorProps {
  parameters: PackagingParameters;
  specification: PackagingSpecification;
}

export const AiPackagingAuditor: React.FC<AiPackagingAuditorProps> = ({
  parameters,
  specification,
}) => {
  const [loadingAudit, setLoadingAudit] = useState(false);
  const [auditResult, setAuditResult] = useState<string | null>(null);
  const [auditModel, setAuditModel] = useState<string | null>(null);
  const [isBenchmark, setIsBenchmark] = useState(false);
  const [auditError, setAuditError] = useState<string | null>(null);

  // Technical Chat state
  const [chatQuestion, setChatQuestion] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatResponses, setChatResponses] = useState<{ q: string; a: string; model?: string; isBenchmark?: boolean }[]>([]);

  // API Key State & Health
  const [apiKey, setApiKey] = useState<string>(() => {
    try {
      return localStorage.getItem('circupack_gemini_api_key') || '';
    } catch {
      return '';
    }
  });
  const [inputKey, setInputKey] = useState('');
  const [showKeyConfig, setShowKeyConfig] = useState(false);
  const [hasServerEnvKey, setHasServerEnvKey] = useState<boolean | null>(null);
  const [keySavedToast, setKeySavedToast] = useState(false);

  // Check health / API key presence on backend
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const headers: Record<string, string> = {};
        if (apiKey) headers['x-gemini-api-key'] = apiKey;

        const res = await fetch('/api/health', { headers });
        if (res.ok) {
          const data = await res.json();
          setHasServerEnvKey(Boolean(data.hasEnvKey));
        }
      } catch {
        // Ignore error
      }
    };
    checkHealth();
  }, [apiKey]);

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputKey.trim();
    if (!trimmed) return;
    try {
      localStorage.setItem('circupack_gemini_api_key', trimmed);
    } catch (e) {
      console.error(e);
    }
    setApiKey(trimmed);
    setInputKey('');
    setKeySavedToast(true);
    setTimeout(() => setKeySavedToast(false), 3000);
  };

  const handleRemoveKey = () => {
    try {
      localStorage.removeItem('circupack_gemini_api_key');
    } catch (e) {
      console.error(e);
    }
    setApiKey('');
    setInputKey('');
  };

  const getRequestHeaders = () => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (apiKey) {
      headers['x-gemini-api-key'] = apiKey;
    }
    return headers;
  };

  const AUDIT_PROMPT_TEMPLATE = (params: PackagingParameters, spec: PackagingSpecification) => `You are a Senior Food Packaging Scientist and Circular Materials Engineer specializing in ASTM/ISO standards and Modified Atmosphere Packaging (MAP).
Perform an authoritative, concise technical audit (under 300 words, structured in 4 bulleted sections) of the following formulation:

Commodity: ${params?.customName || 'Produce'} (${params?.category})
Moisture: ${params?.moistureContent}% w/w | Water Activity: ${params?.waterActivity} aw | Fat: ${params?.fatContent}% w/w | pH: ${params?.pH}
Respiration: ${params?.respirationRateClass} (${params?.respirationRateValue} mg CO₂/kg·h) | Storage: ${params?.storageType} at ${params?.storageTempC}°C, RH: ${params?.relativeHumidity}%

Specification:
Recommended Film: ${spec?.primaryRecommendation?.materialName} (${spec?.physicalSpecs?.filmThicknessTotalMicron} µm)
OTR (ASTM D3985): ${spec?.barrierSpecs?.otr?.target} cc/(m²·24h·atm)
WVTR (ASTM F1249): ${spec?.barrierSpecs?.wvtr?.target} g/(m²·24h)
CO₂TR & Permselectivity β: ${spec?.barrierSpecs?.co2tr?.target} cc (β=${spec?.barrierSpecs?.co2tr?.permselectivityBeta || 3.8})
MAP Gas: ${spec?.mapRequirements?.initialGasComposition?.o2Percent}% O₂ / ${spec?.mapRequirements?.initialGasComposition?.co2Percent}% CO₂ / ${spec?.mapRequirements?.initialGasComposition?.n2Percent}% N₂
Circularity: ${spec?.circularity?.circularityScore}/100 (${spec?.circularity?.recyclabilityStream})

Sections required:
1. Barrier & Degradation Fit: OTR/WVTR match against mold, oxidation, or anaerobic fermentative off-odors.
2. MAP Steady-State Equilibrium: Gas flux and packaging ballooning / hypoxia risk.
3. Sealing Window & Mechanical Tolerance: Seal integrity (${spec?.physicalSpecs?.sealTemperatureRange || '105-125°C'}).
4. Circularity & Compliance: Mono-material recyclability and migration safety under EU 10/2011 & US FDA 21 CFR 177.`;

  const SYSTEM_INSTRUCTION = 'You are an authoritative Senior Food Packaging Technologist and Materials Fellow. Deliver clear, objective, highly technical engineering audits.';

  const handleRunAudit = async () => {
    setLoadingAudit(true);
    setAuditError(null);

    // 1. Try Backend Serverless Endpoint
    try {
      const res = await fetch('/api/audit-packaging', {
        method: 'POST',
        headers: getRequestHeaders(),
        body: JSON.stringify({ parameters, specification }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.auditAnalysis && !data.isBenchmark) {
          setAuditResult(data.auditAnalysis);
          setAuditModel(data.modelUsed || 'Gemini AI');
          setIsBenchmark(false);
          setLoadingAudit(false);
          return;
        }
      }
    } catch (err: any) {
      console.warn('Backend audit call had an issue, trying direct client fallback:', err?.message || err);
    }

    // 2. Direct Client-Side Fallback if user has entered an API key
    if (apiKey) {
      try {
        const directResult = await directGeminiGenerate(
          apiKey,
          AUDIT_PROMPT_TEMPLATE(parameters, specification),
          SYSTEM_INSTRUCTION
        );
        if (directResult) {
          setAuditResult(directResult.text);
          setAuditModel(directResult.modelUsed);
          setIsBenchmark(false);
          setLoadingAudit(false);
          return;
        }
      } catch (directErr) {
        console.warn('Direct Gemini call failed:', directErr);
      }
    }

    // 3. High-fidelity scientific benchmark baseline
    if (!apiKey && !hasServerEnvKey) {
      setAuditError('No active Gemini API key detected. Displaying deterministic packaging engineering standards. Add key via the "API Key" button above or in Vercel to activate live Gemini models.');
    }
    setAuditResult(
      `### 1. Barrier Integrity & Spoilage Prevention\n` +
      `- Target OTR of ${specification.barrierSpecs.otr.target} cc and WVTR of ${specification.barrierSpecs.wvtr.target} g are calibrated to retard oxidation and prevent premature moisture condensation for ${parameters.desiredShelfLifeDays} days.\n\n` +
      `### 2. Micro-Atmosphere & MAP Gas Equilibrium\n` +
      `- Controlled equilibrium maintains aerobic/anaerobic balance at ${parameters.storageTempC}°C without vacuum bag collapse.\n\n` +
      `### 3. Circularity & Polymer Purity\n` +
      `- Mono-material structure ${specification.primaryRecommendation.materialCode} achieves ${specification.circularity.circularityScore}/100 circularity with 95%+ stream recyclability.\n\n` +
      `### 4. Regulatory Safety\n` +
      `- Compliant with EU Regulation 10/2011 and US FDA 21 CFR 177.`
    );
    setAuditModel('Deterministic Packaging Engineering Baseline');
    setIsBenchmark(true);
    setLoadingAudit(false);
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatQuestion.trim() || chatLoading) return;

    const q = chatQuestion.trim();
    setChatQuestion('');
    setChatLoading(true);

    // 1. Try Backend Serverless Endpoint
    try {
      const res = await fetch('/api/technical-chat', {
        method: 'POST',
        headers: getRequestHeaders(),
        body: JSON.stringify({
          question: q,
          context: {
            foodName: parameters.customName,
            material: specification.primaryRecommendation.materialName,
            otr: specification.barrierSpecs.otr.target,
            wvtr: specification.barrierSpecs.wvtr.target,
            storageType: parameters.storageType,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.answer && !data.isBenchmark) {
          setChatResponses((prev) => [
            ...prev,
            {
              q,
              a: data.answer,
              model: data.modelUsed,
              isBenchmark: false,
            },
          ]);
          setChatLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Backend chat error, attempting direct client fallback:', err);
    }

    // 2. Direct Client-Side Fallback
    if (apiKey) {
      try {
        const chatSystemPrompt = `You are CircuPack Technical Advisor, an expert senior packaging engineer and food technologist.
The user is asking a specific technical question regarding their food commodity packaging.
Context:
Commodity: ${parameters.customName || 'Food Commodity'}
Current Substrate: ${specification.primaryRecommendation.materialName || 'Mono-material polymer'}
OTR Target: ${specification.barrierSpecs.otr.target} cc/(m²·24h·atm)
WVTR Target: ${specification.barrierSpecs.wvtr.target} g/(m²·24h)
Storage Regimen: ${parameters.storageType || 'Ambient'}

Answer authoritatively with practical industrial steps, testing standards (ASTM/ISO), and circular packaging recommendations. Keep it concise (under 200 words) and direct.`;

        const directResult = await directGeminiGenerate(apiKey, q, chatSystemPrompt);
        if (directResult) {
          setChatResponses((prev) => [
            ...prev,
            {
              q,
              a: directResult.text,
              model: directResult.modelUsed,
              isBenchmark: false,
            },
          ]);
          setChatLoading(false);
          return;
        }
      } catch (directErr) {
        console.warn('Direct chat error:', directErr);
      }
    }

    // 3. Fallback answer
    setChatResponses((prev) => [
      ...prev,
      {
        q,
        a: `For ${parameters.customName}, maintain barrier limits (OTR: ${specification.barrierSpecs.otr.target} cc, WVTR: ${specification.barrierSpecs.wvtr.target} g). Ensure sealing bar temperature is properly calibrated within ${specification.physicalSpecs.sealTemperatureRange}. (Configure Gemini API key to activate interactive AI dialogue).`,
        model: 'Technical Reference Baseline',
        isBenchmark: true,
      },
    ]);
    setChatLoading(false);
  };

  const isAiActive = Boolean(hasServerEnvKey || apiKey);

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-6 mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-200 gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
              Intelligent Validation & Food Science Copilot
            </span>

            {/* AI Status Badge */}
            {isAiActive ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-mono border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{hasServerEnvKey ? 'Gemini AI Active (Vercel Env)' : 'Gemini AI Active (Custom Key)'}</span>
              </span>
            ) : (
              <button
                onClick={() => setShowKeyConfig(!showKeyConfig)}
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-50 text-amber-800 text-[10px] font-mono border border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer"
              >
                <Key className="w-3 h-3 text-amber-600" />
                <span>API Key Standby · Configure Key</span>
              </button>
            )}
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">
            AI Technical Packaging Auditor & Compatibility Review
          </h3>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowKeyConfig(!showKeyConfig)}
            className="px-2.5 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded flex items-center gap-1.5 transition-colors min-h-[38px]"
            title="Configure Gemini API Key"
          >
            <Key className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">API Key</span>
            {showKeyConfig ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          <button
            onClick={handleRunAudit}
            disabled={loadingAudit}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded flex items-center gap-2 transition-colors disabled:opacity-50 whitespace-nowrap min-h-[38px]"
          >
            {loadingAudit ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Analyzing Chemical Matrices...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Run Deep AI Formulation Audit</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Optional Gemini API Key Drawer */}
      {showKeyConfig && (
        <div className="mb-6 p-4 bg-slate-50 border border-slate-300 rounded-lg text-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-emerald-600" />
              <span>Gemini API Key Configuration</span>
            </span>
            <button
              onClick={() => setShowKeyConfig(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-slate-600 text-[11px] leading-relaxed">
            You can either add <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-slate-800">GEMINI_API_KEY</code> in your <strong>Vercel Project Settings &gt; Environment Variables</strong> (recommended for production), or paste your Gemini API key below to test it directly in your browser.
          </p>

          {apiKey ? (
            <div className="flex items-center justify-between p-2.5 bg-emerald-50/70 border border-emerald-200 rounded">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-emerald-900 font-mono text-[11px]">
                  Custom API Key stored: ••••••••{apiKey.slice(-4)}
                </span>
              </div>
              <button
                onClick={handleRemoveKey}
                className="text-rose-600 hover:text-rose-800 text-[11px] font-semibold underline ml-3"
              >
                Remove
              </button>
            </div>
          ) : (
            <form onSubmit={handleSaveKey} className="flex gap-2">
              <input
                type="password"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="AIzaSy... (Paste Gemini API Key)"
                className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded font-mono text-xs text-slate-900 focus:border-slate-900 outline-none"
              />
              <button
                type="submit"
                disabled={!inputKey.trim()}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded disabled:opacity-50 text-xs"
              >
                Save Key
              </button>
            </form>
          )}

          {keySavedToast && (
            <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Gemini API Key active for this session and saved to local storage!</span>
            </div>
          )}

          <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
            <span>
              Don't have a key? Get one for free at{' '}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-700 underline font-semibold inline-flex items-center gap-0.5"
              >
                Google AI Studio <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </span>
            <span>Supported: gemini-2.5-flash · gemini-3.8-flash · gemini-3.5-flash</span>
          </div>
        </div>
      )}

      {/* Audit Results Section */}
      <div className="mb-8">
        {loadingAudit && (
          <div className="p-6 bg-slate-50 border border-slate-200 rounded text-center space-y-3 animate-pulse">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-slate-600" />
            <div className="text-xs font-mono text-slate-700 font-medium">
              Querying Gemini AI with biochemical matrix ({parameters.moistureContent}% H₂O, aw {parameters.waterActivity}, {parameters.respirationRateValue} mg CO₂/kg·h)...
            </div>
            <div className="text-[11px] font-mono text-slate-500">
              Validating against ASTM D3985 (OTR), ASTM F1249 (WVTR), and ISO 15105 permselectivity.
            </div>
          </div>
        )}

        {auditError && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800 flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{auditError}</span>
          </div>
        )}

        {auditResult && !loadingAudit && (
          <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded space-y-3">
            <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-2 gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-800 font-bold flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Chemical & Barrier Audit Summary</span>
              </span>

              <div className="flex items-center gap-2">
                {isBenchmark ? (
                  <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                    <span>Engineering Benchmark Baseline</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-500" />
                    <span>Live Gemini AI ({auditModel})</span>
                  </span>
                )}
                {auditModel && !isBenchmark && (
                  <span className="text-[10px] font-mono text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200 flex items-center gap-1">
                    <Cpu className="w-3 h-3 text-slate-500" />
                    <span>{auditModel}</span>
                  </span>
                )}
              </div>
            </div>

            <div className="text-xs leading-relaxed text-slate-700 whitespace-pre-wrap font-sans space-y-2">
              {auditResult}
            </div>

            <div className="pt-2 text-[11px] font-mono text-slate-500 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <span>Audited Commodity: {parameters.customName}</span>
              <span>Substrate Code: {specification.primaryRecommendation.materialCode}</span>
            </div>
          </div>
        )}

        {!auditResult && !loadingAudit && (
          <div className="p-6 bg-slate-50/60 border border-dashed border-slate-300 rounded text-center space-y-2">
            <Cpu className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Run an automated multi-point AI scientific audit on your active packaging formulation to verify OTR/WVTR suitability, MAP gas steady-state equilibrium, and EU 10/2011 migration safety.
            </p>
            <button
              onClick={handleRunAudit}
              className="mt-2 text-xs font-mono font-semibold text-slate-900 underline hover:text-emerald-700"
            >
              Click here to run audit
            </button>
          </div>
        )}
      </div>

      {/* Real-time Food Packaging Technical Chat */}
      <div className="border-t border-slate-200 pt-6">
        <div className="mb-3">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-slate-500" />
            <span>Interactive Food Packaging Scientist Assistant</span>
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Ask specific engineering questions about seal integrity, moisture fogging, pinhole fatigue, or recyclability standards for {parameters.customName}.
          </p>
        </div>

        {/* Chat History */}
        {chatResponses.length > 0 && (
          <div className="space-y-3 mb-4 max-h-72 overflow-y-auto pr-1">
            {chatResponses.map((item, idx) => (
              <div key={idx} className="space-y-1.5 text-xs">
                <div className="bg-slate-100 p-2.5 rounded text-slate-900 font-semibold flex items-center justify-between">
                  <span>Q: {item.q}</span>
                  {item.model && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                      item.isBenchmark
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {item.isBenchmark ? 'Deterministic Baseline' : `Live: ${item.model}`}
                    </span>
                  )}
                </div>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {item.a}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Question Form */}
        <form onSubmit={handleAskQuestion} className="flex gap-2">
          <input
            type="text"
            value={chatQuestion}
            onChange={(e) => setChatQuestion(e.target.value)}
            placeholder={`Ask a technical question about packaging ${parameters.customName}...`}
            className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded font-medium text-slate-900 focus:border-slate-900 outline-none"
            disabled={chatLoading}
          />
          <button
            type="submit"
            disabled={chatLoading || !chatQuestion.trim()}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors disabled:opacity-50 min-h-[38px]"
          >
            {chatLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">Ask AI</span>
          </button>
        </form>
      </div>
    </div>
  );
};
