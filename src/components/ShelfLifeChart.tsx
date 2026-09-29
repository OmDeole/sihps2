import React, { useState } from 'react';
import { PackagingSpecification } from '../types/packaging';
import { Clock, TrendingUp, AlertCircle, ShieldAlert } from 'lucide-react';

interface ShelfLifeChartProps {
  specification: PackagingSpecification;
}

export const ShelfLifeChart: React.FC<ShelfLifeChartProps> = ({ specification }) => {
  const { shelfLifePrediction } = specification;
  const { curvePoints, primaryLimitingFactor, spoilageMechanism } = shelfLifePrediction;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const maxDays = curvePoints[curvePoints.length - 1]?.day || 30;

  // SVG Chart Geometry
  const width = 640;
  const height = 240;
  const padLeft = 45;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 35;
  const plotWidth = width - padLeft - padRight;
  const plotHeight = height - padTop - padBottom;

  const getX = (day: number) => padLeft + (day / maxDays) * plotWidth;
  const getY = (val: number) => padTop + plotHeight - (val / 100) * plotHeight;

  // Build SVG path strings
  const buildPath = (key: 'unprotectedQuality' | 'conventionalQuality' | 'circuPackQuality') => {
    return curvePoints
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(p.day).toFixed(1)} ${getY(p[key]).toFixed(1)}`)
      .join(' ');
  };

  const activePoint = hoveredIndex !== null ? curvePoints[hoveredIndex] : curvePoints[curvePoints.length - 1];

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-200 gap-2">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-slate-500">
            Kinetic Degradation & Quality Decay Model
          </span>
          <h3 className="text-xl font-bold text-slate-900">
            Shelf-Life Prediction & Sensory Quality Retention Curve
          </h3>
        </div>
        <div className="text-xs font-mono text-slate-500">
          Acceptability Quality Threshold: <strong className="text-slate-900">60% Index</strong>
        </div>
      </div>

      {/* Comparative Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="p-3 bg-slate-50 rounded border border-slate-100">
          <div className="text-[11px] font-mono text-slate-500">01. UNPROTECTED</div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {shelfLifePrediction.unprotectedDays} <span className="text-xs font-normal text-slate-500">Days</span>
          </div>
          <div className="text-[11px] text-rose-600 mt-0.5 font-mono">Rapid spoilage</div>
        </div>

        <div className="p-3 bg-slate-50 rounded border border-slate-100">
          <div className="text-[11px] font-mono text-slate-500">02. STANDARD PACK</div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {shelfLifePrediction.conventionalPackDays} <span className="text-xs font-normal text-slate-500">Days</span>
          </div>
          <div className="text-[11px] text-amber-600 mt-0.5 font-mono">Moderate barrier</div>
        </div>

        <div className="p-3 bg-slate-900 text-white rounded border border-slate-900">
          <div className="text-[11px] font-mono text-slate-400">03. CIRCUPACK OPTIMIZED</div>
          <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">
            {shelfLifePrediction.circuPackOptimizedDays} <span className="text-xs font-normal text-slate-400">Days</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-0.5 font-mono font-bold">Target achieved</div>
        </div>

        <div className="p-3 bg-slate-50 rounded border border-slate-100">
          <div className="text-[11px] font-mono text-slate-500">04. MAP EXTENDED</div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {shelfLifePrediction.mapOptimizedDays} <span className="text-xs font-normal text-slate-500">Days</span>
          </div>
          <div className="text-[11px] text-emerald-700 mt-0.5 font-mono font-semibold">+35% extended</div>
        </div>
      </div>

      {/* SVG Kinetic Decay Chart */}
      <div className="relative border border-slate-100 rounded bg-slate-50/50 p-2 overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[500px]"
          role="img"
          aria-label="Shelf life degradation curve graph"
        >
          {/* Horizontal Grid Lines */}
          {[0, 25, 50, 60, 75, 100].map((val) => {
            const y = getY(val);
            const isThreshold = val === 60;
            return (
              <g key={val}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={width - padRight}
                  y2={y}
                  stroke={isThreshold ? '#F43F5E' : '#E2E8F0'}
                  strokeDasharray={isThreshold ? '4 3' : 'none'}
                  strokeWidth={isThreshold ? 1.5 : 1}
                />
                <text
                  x={padLeft - 6}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="10"
                  fontFamily="JetBrains Mono, monospace"
                  fill={isThreshold ? '#F43F5E' : '#94A3B8'}
                >
                  {val}%
                </text>
              </g>
            );
          })}

          {/* Acceptable Quality Cutoff Label */}
          <text
            x={width - padRight - 5}
            y={getY(60) - 5}
            textAnchor="end"
            fontSize="9"
            fontFamily="JetBrains Mono, monospace"
            fill="#F43F5E"
            fontWeight="bold"
          >
            CRITICAL COMMODITY FAILURE THRESHOLD (60%)
          </text>

          {/* Time X-axis Ticks */}
          {curvePoints.map((pt) => {
            const x = getX(pt.day);
            return (
              <g key={pt.day}>
                <line x1={x} y1={height - padBottom} x2={x} y2={height - padBottom + 4} stroke="#CBD5E1" />
                <text
                  x={x}
                  y={height - padBottom + 16}
                  textAnchor="middle"
                  fontSize="9"
                  fontFamily="JetBrains Mono, monospace"
                  fill="#64748B"
                >
                  D{pt.day}
                </text>
              </g>
            );
          })}

          {/* Curves */}
          {/* 1. Unprotected Curve (Red) */}
          <path
            d={buildPath('unprotectedQuality')}
            fill="none"
            stroke="#EF4444"
            strokeWidth="2"
            strokeDasharray="3 3"
          />

          {/* 2. Conventional Pack Curve (Slate) */}
          <path
            d={buildPath('conventionalQuality')}
            fill="none"
            stroke="#94A3B8"
            strokeWidth="2"
          />

          {/* 3. CircuPack Optimized Curve (Emerald/Black) */}
          <path
            d={buildPath('circuPackQuality')}
            fill="none"
            stroke="#0F172A"
            strokeWidth="2.5"
          />

          {/* Interactive Probe Crosshair */}
          {activePoint && (
            <g>
              <line
                x1={getX(activePoint.day)}
                y1={padTop}
                x2={getX(activePoint.day)}
                y2={height - padBottom}
                stroke="#0F172A"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <circle
                cx={getX(activePoint.day)}
                cy={getY(activePoint.circuPackQuality)}
                r="4.5"
                fill="#0F172A"
                stroke="#FFFFFF"
                strokeWidth="2"
              />
            </g>
          )}

          {/* Transparent Hover Hitbox Columns */}
          {curvePoints.map((pt, idx) => {
            const x = getX(pt.day);
            const w = plotWidth / curvePoints.length;
            return (
              <rect
                key={idx}
                x={x - w / 2}
                y={padTop}
                width={w}
                height={plotHeight}
                fill="transparent"
                onMouseEnter={() => setHoveredIndex(idx)}
                className="cursor-crosshair"
              />
            );
          })}
        </svg>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-2 px-3 py-1.5 text-xs font-mono text-slate-600 border-t border-slate-200">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-0.5 bg-slate-900 inline-block"></span>
              <span className="font-semibold text-slate-900">CircuPack Optimized</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-0.5 bg-slate-400 inline-block"></span>
              <span>Conventional Film</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-0.5 bg-rose-500 border-b border-dashed border-rose-500 inline-block"></span>
              <span>Unprotected</span>
            </span>
          </div>

          {activePoint && (
            <div className="text-right">
              <span>Day {activePoint.day}: </span>
              <strong className="text-slate-900">{activePoint.circuPackQuality}% Quality</strong>
              <span className="text-slate-400"> (vs {activePoint.conventionalQuality}% standard)</span>
            </div>
          )}
        </div>
      </div>

      {/* Degradation Limiting Factor Notice */}
      <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
          <div>
            <strong>Primary Shelf-Life Limiting Mechanism: </strong>
            <span>{primaryLimitingFactor}. {spoilageMechanism}.</span>
          </div>
        </div>
      </div>

    </div>
  );
};
