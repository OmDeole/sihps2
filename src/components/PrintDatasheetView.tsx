import React from 'react';
import { PackagingSpecification, PackagingParameters } from '../types/packaging';
import { generateSvgQrCode } from '../utils/qrGenerator';

interface PrintDatasheetViewProps {
  specification: PackagingSpecification;
  parameters: PackagingParameters;
}

export const PrintDatasheetView: React.FC<PrintDatasheetViewProps> = ({
  specification,
  parameters,
}) => {
  const qrSvg = generateSvgQrCode(specification.traceabilityPassport.qrCodeData, 120);

  return (
    <div className="hidden print:block print-page max-w-4xl mx-auto p-6 bg-white text-black font-sans">
      
      {/* Datasheet Header */}
      <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-6">
        <div>
          <div className="text-2xl font-bold tracking-tight">CircuPack AI — Technical Packaging Datasheet</div>
          <div className="text-xs font-mono text-gray-700 mt-1">
            Standard Specification for Food Contact Materials · Circular Economy & Barrier Optimization
          </div>
        </div>
        <div className="text-right text-xs font-mono">
          <div><strong>Batch Ref:</strong> {specification.traceabilityPassport.dppBatchId}</div>
          <div><strong>Date:</strong> {new Date(specification.timestamp).toLocaleDateString()}</div>
        </div>
      </div>

      {/* Section 1: Commodity Formulation */}
      <div className="mb-6 print-break-inside-avoid">
        <div className="text-xs font-mono font-bold uppercase tracking-wider border-b border-black pb-1 mb-2">
          01. Commodity Formulation & Physical-Chemical Baseline
        </div>
        <table className="w-full text-xs font-mono border-collapse mb-2">
          <tbody>
            <tr className="border-b border-gray-300">
              <td className="py-1 font-bold w-1/4">Product Commodity:</td>
              <td className="py-1 w-1/4">{parameters.customName}</td>
              <td className="py-1 font-bold w-1/4">Storage Regimen:</td>
              <td className="py-1 w-1/4">{parameters.storageType} ({parameters.storageTempC}°C)</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="py-1 font-bold">Moisture Content:</td>
              <td className="py-1">{parameters.moistureContent}% w/w (aw: {parameters.waterActivity})</td>
              <td className="py-1 font-bold">Relative Humidity:</td>
              <td className="py-1">{parameters.relativeHumidity}% RH</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="py-1 font-bold">Fat / Oil Content:</td>
              <td className="py-1">{parameters.fatContent}% w/w</td>
              <td className="py-1 font-bold">Acidity:</td>
              <td className="py-1">pH {parameters.pH}</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="py-1 font-bold">Respiration Rate:</td>
              <td className="py-1">{parameters.respirationRateClass} ({parameters.respirationRateValue} mg CO₂/kg·h)</td>
              <td className="py-1 font-bold">Target Shelf Life:</td>
              <td className="py-1 font-bold">{parameters.desiredShelfLifeDays} Days</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Section 2: Material Recommendation & Barrier Specs */}
      <div className="mb-6 print-break-inside-avoid">
        <div className="text-xs font-mono font-bold uppercase tracking-wider border-b border-black pb-1 mb-2">
          02. Recommended Substrate & Barrier Permeability (ASTM/ISO)
        </div>
        <div className="mb-3 text-xs">
          <strong>Primary Specification: </strong>
          <span className="font-mono">{specification.primaryRecommendation.materialName} ({specification.primaryRecommendation.structureDescription})</span>
        </div>
        
        <table className="w-full text-xs font-mono border border-black mb-3">
          <thead className="bg-gray-100 border-b border-black">
            <tr>
              <th className="p-1.5 text-left">Property</th>
              <th className="p-1.5 text-left">Standard</th>
              <th className="p-1.5 text-left">Target Value</th>
              <th className="p-1.5 text-left">Tolerance Range</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            <tr>
              <td className="p-1.5">Oxygen Transmission Rate (OTR)</td>
              <td className="p-1.5">ASTM D3985 (23°C, 0% RH)</td>
              <td className="p-1.5 font-bold">{specification.barrierSpecs.otr.target} cc/(m²·24h·atm)</td>
              <td className="p-1.5">{specification.barrierSpecs.otr.min} - {specification.barrierSpecs.otr.max}</td>
            </tr>
            <tr>
              <td className="p-1.5">Water Vapor Transmission Rate (WVTR)</td>
              <td className="p-1.5">ASTM F1249 (38°C, 90% RH)</td>
              <td className="p-1.5 font-bold">{specification.barrierSpecs.wvtr.target} g/(m²·24h)</td>
              <td className="p-1.5">{specification.barrierSpecs.wvtr.min} - {specification.barrierSpecs.wvtr.max}</td>
            </tr>
            <tr>
              <td className="p-1.5">CO₂ Transmission Rate (CO₂TR)</td>
              <td className="p-1.5">ISO 15105-1</td>
              <td className="p-1.5 font-bold">{specification.barrierSpecs.co2tr.target} cc/(m²·24h·atm)</td>
              <td className="p-1.5">Permselectivity β = {specification.barrierSpecs.co2tr.permselectivityBeta}</td>
            </tr>
            <tr>
              <td className="p-1.5">Total Thickness Gauge</td>
              <td className="p-1.5">ASTM D6988</td>
              <td className="p-1.5 font-bold">{specification.physicalSpecs.filmThicknessTotalMicron} µm</td>
              <td className="p-1.5">± 5%</td>
            </tr>
            <tr>
              <td className="p-1.5">Heat Seal Temperature Window</td>
              <td className="p-1.5">ASTM F88 / F2029</td>
              <td className="p-1.5 font-bold">{specification.physicalSpecs.sealTemperatureRange}</td>
              <td className="p-1.5">Dwell: 0.8 - 1.2 sec</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Section 3: MAP & Circularity */}
      <div className="grid grid-cols-2 gap-6 mb-6 print-break-inside-avoid">
        <div>
          <div className="text-xs font-mono font-bold uppercase tracking-wider border-b border-black pb-1 mb-2">
            03. MAP Atmosphere Flush Target
          </div>
          <div className="text-xs font-mono space-y-1">
            <div><strong>Initial Flush:</strong> {specification.mapRequirements.initialGasComposition.o2Percent}% O₂ / {specification.mapRequirements.initialGasComposition.co2Percent}% CO₂ / {specification.mapRequirements.initialGasComposition.n2Percent}% N₂</div>
            <div><strong>Gas:Product Ratio:</strong> {specification.mapRequirements.gasToProductVolumeRatio}</div>
            <div><strong>Micro-Perforation:</strong> {specification.mapRequirements.perforationRequired ? 'Required (Laser Drilled)' : 'None (Hermetic Barrier)'}</div>
          </div>
        </div>

        <div>
          <div className="text-xs font-mono font-bold uppercase tracking-wider border-b border-black pb-1 mb-2">
            04. Circular Economy & Compliance
          </div>
          <div className="text-xs font-mono space-y-1">
            <div><strong>Circularity Score:</strong> {specification.circularity.circularityScore} / 100</div>
            <div><strong>Stream:</strong> {specification.circularity.recyclabilityStream}</div>
            <div><strong>Embodied Carbon:</strong> {specification.circularity.carbonFootprintKgCO2ePer1000Packs} kg CO₂e / 1k packs</div>
            <div><strong>Food Contact:</strong> EU 10/2011 & US FDA 21 CFR 177.1520</div>
          </div>
        </div>
      </div>

      {/* Section 4: QR Traceability Passport & QA Sign-off */}
      <div className="flex items-center justify-between border-t-2 border-black pt-4 print-break-inside-avoid">
        <div className="flex items-center gap-4">
          <div
            dangerouslySetInnerHTML={{ __html: qrSvg }}
            className="w-24 h-24"
          />
          <div className="text-[11px] font-mono">
            <div className="font-bold">Digital Product Passport (DPP)</div>
            <div>Scan to verify material layers, recycling stream,</div>
            <div>and food contact migration certs.</div>
          </div>
        </div>

        <div className="text-right text-xs font-mono space-y-3">
          <div>
            <span className="text-gray-500">Packaging Technologist Sign-off: </span>
            <span className="inline-block border-b border-black w-36"></span>
          </div>
          <div>
            <span className="text-gray-500">Quality Assurance (QA) Approval: </span>
            <span className="inline-block border-b border-black w-36"></span>
          </div>
        </div>
      </div>

    </div>
  );
};
