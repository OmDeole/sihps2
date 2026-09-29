import React, { useState } from 'react';
import { PackagingSpecification } from '../types/packaging';
import { generateSvgQrCode } from '../utils/qrGenerator';
import { QrCode, Download, Copy, Check, ShieldCheck, FileText } from 'lucide-react';

interface TraceabilityPassportProps {
  specification: PackagingSpecification;
}

export const TraceabilityPassport: React.FC<TraceabilityPassportProps> = ({ specification }) => {
  const { traceabilityPassport, foodName, primaryRecommendation, circularity, physicalSpecs } = specification;
  const [copied, setCopied] = useState(false);

  // Generate real SVG QR code from batch metadata
  const qrSvg = generateSvgQrCode(traceabilityPassport.qrCodeData, 160);

  const handleCopy = () => {
    navigator.clipboard.writeText(traceabilityPassport.qrCodeData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([traceabilityPassport.qrCodeData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${traceabilityPassport.dppBatchId}_passport.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-200 gap-2">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-slate-500">
            Traceability & Regulatory Transparency
          </span>
          <h3 className="text-xl font-bold text-slate-900">
            Digital Product Passport (DPP) & Batch QR Traceability
          </h3>
        </div>
        <div className="text-xs font-mono text-slate-600 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
          Batch: <strong className="text-slate-900">{traceabilityPassport.dppBatchId}</strong>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        
        {/* QR Code Container */}
        <div className="p-4 bg-white border border-slate-300 rounded shadow-sm flex flex-col items-center shrink-0 mx-auto md:mx-0">
          <div
            className="w-40 h-40 flex items-center justify-center"
            dangerouslySetInnerHTML={{ __html: qrSvg }}
          />
          <span className="text-[10px] font-mono text-slate-400 mt-2 text-center uppercase tracking-wider">
            Scan for Circular Passport
          </span>
          
          <div className="flex items-center gap-2 mt-3 w-full">
            <button
              onClick={handleCopy}
              className="flex-1 py-1 px-2 text-[11px] font-medium border border-slate-200 rounded hover:bg-slate-50 text-slate-700 flex items-center justify-center gap-1"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={handleDownloadJson}
              className="flex-1 py-1 px-2 text-[11px] font-medium bg-slate-900 text-white rounded hover:bg-slate-800 flex items-center justify-center gap-1"
            >
              <Download className="w-3 h-3" />
              <span>JSON</span>
            </button>
          </div>
        </div>

        {/* Passport Specification Details */}
        <div className="flex-1 space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-slate-500 font-mono">Commodity Assigned:</span>
              <div className="font-semibold text-slate-900 text-sm">{foodName}</div>
            </div>
            <div>
              <span className="text-slate-500 font-mono">Substrate Specification:</span>
              <div className="font-semibold text-slate-900 font-mono">{primaryRecommendation.materialCode} ({physicalSpecs.filmThicknessTotalMicron} µm)</div>
            </div>
          </div>

          <div>
            <span className="text-slate-500 font-mono">End-of-Life Consumer Disposal Instructions:</span>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded font-medium text-slate-800 mt-1">
              {traceabilityPassport.recyclingInstructions}
            </div>
          </div>

          <div>
            <span className="text-slate-500 font-mono">Food Contact Regulatory Certifications:</span>
            <ul className="mt-1 space-y-1">
              {traceabilityPassport.standardsComplied.map((std, i) => (
                <li key={i} className="flex items-center gap-2 text-slate-700 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{std}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Overall Migration Limit: &lt; 10 mg/dm² (EU 10/2011)</span>
            <span>Heavy Metal Compliance: Directive 94/62/EC (&lt; 100 ppm)</span>
          </div>

        </div>

      </div>
    </div>
  );
};
