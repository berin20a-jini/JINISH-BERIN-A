import React, { useState } from 'react';
import { StorageUnit } from '../types';
import { 
  Thermometer, 
  Wind, 
  Cpu, 
  AlertTriangle, 
  CheckCircle2, 
  Sliders, 
  Snowflake, 
  Flame, 
  Zap, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface TempControlViewProps {
  storageUnits: StorageUnit[];
  onAdjustSetPoint: (unitId: string, newSetPoint: number) => void;
  onTriggerCoolDown: (unitId: string) => void;
  onTriggerAutoMode: (unitId: string) => void;
  onTriggerWarmUp: (unitId: string) => void;
  onEmergencyCoolAll: () => void;
}

export const TempControlView: React.FC<TempControlViewProps> = ({
  storageUnits,
  onAdjustSetPoint,
  onTriggerCoolDown,
  onTriggerAutoMode,
  onTriggerWarmUp,
  onEmergencyCoolAll
}) => {
  const totalUnits = storageUnits.length;
  const criticalUnits = storageUnits.filter(u => u.status === 'CRITICAL');
  const warningUnits = storageUnits.filter(u => u.status === 'WARNING');
  const normalUnits = storageUnits.filter(u => u.status === 'NORMAL');

  // Group units by hospital
  const hospitalGroups = Array.from(new Set(storageUnits.map(u => u.hospitalName))).map(hospitalName => ({
    hospitalName,
    units: storageUnits.filter(u => u.hospitalName === hospitalName)
  }));

  return (
    <div className="space-y-6">
      {/* Title & Batch Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Thermometer size={22} className="text-[#4fc3f7]" />
            Cold Storage Temperature Control & Regulation
          </h2>
          <p className="text-xs text-[#5a7a94] mt-1">
            IoT dual-sensor telemetry, closed-loop compressor regulation, and cryogenic freezer telemetry
          </p>
        </div>
        {criticalUnits.length > 0 && (
          <button
            onClick={onEmergencyCoolAll}
            className="px-3.5 py-2 text-xs font-bold rounded-lg bg-[#ef5350] text-white hover:bg-[#c62828] transition-all flex items-center gap-1.5 shadow-md shadow-[#ef5350]/20 cursor-pointer self-start sm:self-auto"
          >
            <Snowflake size={15} />
            Emergency Cool All Critical Units ({criticalUnits.length})
          </button>
        )}
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#162230] border border-[#1e3a52] rounded-xl p-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#5a7a94] mb-1">
            Total Storage Units
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            16
          </div>
          <div className="text-[11px] text-[#5a7a94] mt-1">Monitored 24/7 across sites</div>
        </div>

        <div className="bg-[#162230] border border-[#1e3a52] rounded-xl p-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#4caf50] mb-1">
            Within Safe Range
          </div>
          <div className="text-2xl font-bold font-mono text-[#4caf50]">
            {16 - criticalUnits.length - warningUnits.length}
          </div>
          <div className="text-[11px] text-[#4caf50]/80 mt-1">Compliant (2-8°C / Ultra-low)</div>
        </div>

        <div className="bg-[#162230] border border-[#1e3a52] rounded-xl p-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#ffa726] mb-1">
            Thermal Warning
          </div>
          <div className="text-2xl font-bold font-mono text-[#ffa726]">
            {warningUnits.length}
          </div>
          <div className="text-[11px] text-[#ffa726]/80 mt-1">Nearing boundary threshold</div>
        </div>

        <div className="bg-[#162230] border border-[#ef5350]/60 rounded-xl p-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#ef5350] mb-1 flex items-center gap-1.5">
            <span>Critical Breach</span>
            {criticalUnits.length > 0 && <span className="w-2 h-2 rounded-full bg-[#ef5350] animate-ping" />}
          </div>
          <div className="text-2xl font-bold font-mono text-[#ef5350]">
            {criticalUnits.length}
          </div>
          <div className="text-[11px] text-[#ef5350]/80 mt-1">Auto-cooling override initiated</div>
        </div>
      </div>

      {/* Hospital Storage Cards */}
      <div className="space-y-6">
        {hospitalGroups.map(({ hospitalName, units }) => {
          const hasCritical = units.some(u => u.status === 'CRITICAL');
          const hasWarning = units.some(u => u.status === 'WARNING');

          return (
            <div 
              key={hospitalName}
              className={`bg-[#162230] border rounded-2xl p-5 shadow-xl transition-all ${
                hasCritical ? 'border-[#ef5350]/70' : 'border-[#1e3a52]'
              }`}
            >
              {/* Hospital Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-[#1e3a52]">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>🏥 {hospitalName}</span>
                  </h3>
                  <div className="text-xs text-[#5a7a94] mt-0.5">
                    {units.length} Storage Units Active • Dual IoT Sensors Online • Zigbee Gateway Synced
                  </div>
                </div>

                <div>
                  {hasCritical ? (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#3a1b1b] text-[#ef5350] border border-[#ef5350]/50 animate-pulse">
                      1 CRITICAL TEMPERATURE BREACH
                    </span>
                  ) : hasWarning ? (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#3a2e1b] text-[#ffa726] border border-[#ffa726]/50">
                      THERMAL DEVIATION CAUTION
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#1b3a2a] text-[#4caf50] border border-[#4caf50]/40">
                      ✓ ALL UNITS IN TARGET RANGE
                    </span>
                  )}
                </div>
              </div>

              {/* Units Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                {units.map((unit) => {
                  const isUltraCold = unit.minSafe < -20;
                  
                  // Gauge calculation
                  // Circle r=50 -> perimeter = 2 * PI * 50 = 314.15
                  const circumference = 314;
                  
                  // Calculate percentage for gauge offset
                  let gaugePercent = 0.5;
                  if (isUltraCold) {
                    // Range -90 to -50
                    gaugePercent = Math.max(0, Math.min(1, (unit.currentTemp - (-90)) / 40));
                  } else {
                    // Range -4 to +16
                    gaugePercent = Math.max(0, Math.min(1, (unit.currentTemp - (-4)) / 20));
                  }
                  const dashoffset = circumference - (circumference * gaugePercent);

                  // Colors based on status
                  let tempColor = '#4caf50';
                  let strokeColor = '#4caf50';
                  let statusBadge = (
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#1b3a2a] text-[#4caf50] border border-[#4caf50]/40">
                      ✓ NORMAL
                    </span>
                  );

                  if (unit.status === 'CRITICAL') {
                    tempColor = '#ef5350';
                    strokeColor = '#ef5350';
                    statusBadge = (
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#3a1b1b] text-[#ef5350] border border-[#ef5350]/60 animate-pulse">
                        ⚠ CRITICAL
                      </span>
                    );
                  } else if (unit.status === 'WARNING') {
                    tempColor = '#ffa726';
                    strokeColor = '#ffa726';
                    statusBadge = (
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#3a2e1b] text-[#ffa726] border border-[#ffa726]/40">
                        ⚠ WARNING
                      </span>
                    );
                  } else if (isUltraCold) {
                    tempColor = '#4fc3f7';
                    strokeColor = '#4fc3f7';
                  }

                  // Slider position calculation
                  let sliderMin = isUltraCold ? -90 : -4;
                  let sliderMax = isUltraCold ? -50 : 16;
                  let setpointPct = Math.max(0, Math.min(100, ((unit.setPoint - sliderMin) / (sliderMax - sliderMin)) * 100));
                  let currentPct = Math.max(0, Math.min(100, ((unit.currentTemp - sliderMin) / (sliderMax - sliderMin)) * 100));
                  let safeMinPct = Math.max(0, Math.min(100, ((unit.minSafe - sliderMin) / (sliderMax - sliderMin)) * 100));
                  let safeMaxPct = Math.max(0, Math.min(100, ((unit.maxSafe - sliderMin) / (sliderMax - sliderMin)) * 100));
                  let safeWidthPct = safeMaxPct - safeMinPct;

                  return (
                    <div 
                      key={unit.id}
                      className={`bg-[#0f1923] border rounded-xl p-5 relative transition-all shadow-inner ${
                        unit.status === 'CRITICAL'
                          ? 'border-[#ef5350] shadow-[0_0_20px_#ef535025]'
                          : unit.status === 'WARNING'
                          ? 'border-[#ffa726]/80'
                          : 'border-[#1e3a52]'
                      }`}
                    >
                      {/* Unit Header */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div>
                          <div className="font-bold text-sm text-[#c0d8ee]">{unit.name}</div>
                          <div className="text-xs text-[#5a7a94] mt-0.5">{unit.contents}</div>
                          <div className="text-[10px] text-[#4fc3f7] mt-0.5 font-mono">{unit.type}</div>
                        </div>
                        {statusBadge}
                      </div>

                      {/* Circular Gauge and Telemetry Grid */}
                      <div className="flex flex-col sm:flex-row items-center gap-5 mb-4">
                        {/* Gauge */}
                        <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                          <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                            {/* Background Track */}
                            <circle
                              cx="60"
                              cy="60"
                              r="50"
                              fill="none"
                              stroke="#1a2d3e"
                              strokeWidth="8"
                            />
                            {/* Dynamic Fill Arc */}
                            <circle
                              cx="60"
                              cy="60"
                              r="50"
                              fill="none"
                              stroke={strokeColor}
                              strokeWidth="8"
                              strokeLinecap="round"
                              strokeDasharray="314"
                              strokeDashoffset={dashoffset}
                              className="transition-all duration-700 ease-out"
                            />
                          </svg>

                          {/* Center readout */}
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                            <span 
                              className="font-mono text-xl sm:text-2xl font-extrabold tracking-tight transition-colors duration-500"
                              style={{ color: tempColor }}
                            >
                              {unit.currentTemp.toFixed(1)}°C
                            </span>
                            <span className="text-[9px] uppercase tracking-wider text-[#5a7a94] mt-0.5 font-semibold">
                              {unit.isAdjusting ? 'Balancing...' : 'Current'}
                            </span>
                          </div>
                        </div>

                        {/* Telemetry info rows */}
                        <div className="flex-1 w-full space-y-1.5 text-xs">
                          <div className="flex justify-between items-center py-1 border-b border-[#1a2d3e]">
                            <span className="text-[#5a7a94]">Target Range</span>
                            <span className="font-mono font-bold text-[#4fc3f7]">
                              {unit.minSafe}°C — {unit.maxSafe}°C
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-1 border-b border-[#1a2d3e]">
                            <span className="text-[#5a7a94]">Set Point</span>
                            <span className="font-mono font-semibold text-white">
                              {unit.setPoint.toFixed(1)}°C
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-1 border-b border-[#1a2d3e]">
                            <span className="text-[#5a7a94]">Relative Humidity</span>
                            <span className="font-mono font-semibold text-[#c0d8ee]">
                              {unit.humidity}%
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-1">
                            <span className="text-[#5a7a94]">Compressor Status</span>
                            <span className={`font-mono font-bold ${
                              unit.compressor === 'Boost Cooling' 
                                ? 'text-[#ef5350] animate-pulse' 
                                : unit.compressor === 'Running' 
                                ? 'text-[#4caf50]' 
                                : 'text-[#ffa726]'
                            }`}>
                              {unit.compressor}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Temperature Regulator Controls */}
                      <div className="bg-[#162230] rounded-xl p-3.5 border border-[#1e3a52]">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-[#5a7a94] flex items-center gap-1.5">
                            <span>🎛</span>
                            <span>Temperature Regulator</span>
                          </div>
                          <div className="font-mono text-xs font-bold text-[#4fc3f7]">
                            Set: {unit.setPoint.toFixed(1)}°C
                          </div>
                        </div>

                        {/* Interactive Slider Track */}
                        <div className="relative h-9 bg-[#0f1923] rounded-lg overflow-hidden border border-[#1a2d3e] flex items-center px-1">
                          {/* Safe Range Area Marker */}
                          <div 
                            className="absolute h-full bg-[#4caf50]/20 border-x border-[#4caf50]/50 pointer-events-none"
                            style={{ left: `${safeMinPct}%`, width: `${safeWidthPct}%` }}
                            title={`Safe tolerance: ${unit.minSafe}°C to ${unit.maxSafe}°C`}
                          />

                          {/* Current Temp Indicator Bar */}
                          <div 
                            className="absolute left-0 h-full rounded-l-md pointer-events-none transition-all duration-500"
                            style={{ 
                              width: `${currentPct}%`,
                              background: unit.status === 'CRITICAL'
                                ? 'linear-gradient(90deg, rgba(239, 83, 80, 0.2), rgba(239, 83, 80, 0.4))'
                                : 'linear-gradient(90deg, rgba(79, 195, 247, 0.1), rgba(76, 175, 80, 0.3))'
                            }}
                          />

                          {/* Setpoint Marker */}
                          <div 
                            className="absolute top-0 bottom-0 w-0.5 bg-[#4fc3f7] z-10 pointer-events-none"
                            style={{ left: `${setpointPct}%` }}
                          />

                          {/* Real HTML Range Input for accessibility and direct dragging */}
                          <input
                            type="range"
                            min={sliderMin}
                            max={sliderMax}
                            step={0.5}
                            value={unit.setPoint}
                            onChange={(e) => onAdjustSetPoint(unit.id, parseFloat(e.target.value))}
                            className="w-full relative z-20 opacity-80 cursor-pointer accent-[#4fc3f7]"
                          />
                        </div>

                        {/* Track Labels */}
                        <div className="flex justify-between text-[10px] font-mono text-[#5a7a94] mt-1.5 px-0.5">
                          {isUltraCold ? (
                            <>
                              <span>-90°C</span>
                              <span>-80°C (Min)</span>
                              <span>-70°C</span>
                              <span>-60°C (Max)</span>
                              <span>-50°C</span>
                            </>
                          ) : (
                            <>
                              <span>-4°C</span>
                              <span>0°C</span>
                              <span>2°C (Safe)</span>
                              <span>4°C</span>
                              <span>8°C (Safe)</span>
                              <span>12°C</span>
                              <span>16°C</span>
                            </>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-3 gap-2 mt-3">
                          <button
                            onClick={() => onTriggerCoolDown(unit.id)}
                            className="py-1.5 px-2 rounded-lg bg-[#152230] border border-[#0277bd] text-[#4fc3f7] text-[11px] font-bold hover:bg-[#0277bd]/30 transition-all flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Snowflake size={13} />
                            Cool Down
                          </button>

                          <button
                            onClick={() => onTriggerAutoMode(unit.id)}
                            className="py-1.5 px-2 rounded-lg bg-[#1b3a2a] border border-[#2e7d32] text-[#4caf50] text-[11px] font-bold hover:bg-[#2e7d32]/30 transition-all flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Zap size={13} />
                            Auto Mode
                          </button>

                          <button
                            onClick={() => onTriggerWarmUp(unit.id)}
                            className="py-1.5 px-2 rounded-lg bg-[#2a1215] border border-[#c62828] text-[#ef5350] text-[11px] font-bold hover:bg-[#c62828]/30 transition-all flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Flame size={13} />
                            Defrost / Warm
                          </button>
                        </div>
                      </div>

                      {/* Telemetry Log Footer */}
                      <div className="flex items-center gap-2 text-[11px] text-[#5a7a94] mt-3">
                        <span 
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: tempColor }}
                        />
                        <span className="truncate">
                          {unit.stableDuration} • {unit.lastAdjustment}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
