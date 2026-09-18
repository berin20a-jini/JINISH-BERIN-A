import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  ShieldCheck, 
  Lock, 
  Key, 
  Database, 
  Radio, 
  BellRing, 
  Sliders, 
  RotateCcw, 
  Server, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface SettingsViewProps {
  onResetData: () => void;
  onSimulateSurge: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  onResetData,
  onSimulateSurge
}) => {
  const [activeRole, setActiveRole] = useState<'CMO' | 'LOGISTICS_DIRECTOR' | 'PHARMACIST' | 'AUDITOR'>('CMO');
  const [coldMinTemp, setColdMinTemp] = useState<number>(2.0);
  const [coldMaxTemp, setColdMaxTemp] = useState<number>(8.0);
  const [surgeThresholdPct, setSurgeThresholdPct] = useState<number>(25);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSaveSettings = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-[#142332] via-[#10202e] to-[#121c27] border border-[#1e3a52] shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-[#4fc3f7]" />
              Platform Settings &amp; Security Architecture
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#4fc3f7] text-[#0c141d] font-mono">
              ENTERPRISE TIER
            </span>
          </div>
          <p className="text-xs text-[#90a4ae] mt-1">
            Role-Based Access Control (RBAC), end-to-end telemetry encryption, HL7/FHIR hospital data interfaces, and ML threshold parameters.
          </p>
        </div>

        {savedSuccess && (
          <span className="text-xs font-bold text-[#4caf50] flex items-center gap-1 bg-[#122319] border border-[#4caf50]/40 px-3 py-1.5 rounded-lg animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" /> Parameters Applied
          </span>
        )}
      </div>

      {/* Role-Based Access Control (RBAC) */}
      <div className="p-5 rounded-xl bg-[#14202c] border border-[#1e3a52] space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#4caf50]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            Role-Based Access Control (RBAC) Simulation
          </h3>
        </div>
        <p className="text-xs text-[#90a4ae]">
          Select active persona to test healthcare governance compliance:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { id: 'CMO', title: 'Chief Medical Officer', desc: 'Full AI recommendation approval & emergency dispatch rights' },
            { id: 'LOGISTICS_DIRECTOR', title: 'Logistics Director', desc: 'Convoy routing, green corridors & vehicle re-allocation' },
            { id: 'PHARMACIST', title: 'Hospital Pharmacist', desc: 'Dock intake verification, cold room inspection & FEFO dispensing' },
            { id: 'AUDITOR', title: 'Regulatory Compliance', desc: 'Read-only access to tamper-evident blockchain ledger' },
          ].map((role) => (
            <div
              key={role.id}
              onClick={() => setActiveRole(role.id as any)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                activeRole === role.id
                  ? 'bg-[#1b2a3a] border-[#4fc3f7] shadow-[0_2px_12px_rgba(79,195,247,0.15)]'
                  : 'bg-[#0f1923] border-[#1e3a52] hover:bg-[#14202c]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{role.title}</span>
                {activeRole === role.id && <span className="w-2 h-2 rounded-full bg-[#4fc3f7]" />}
              </div>
              <p className="text-[11px] text-[#90a4ae] mt-1.5 leading-relaxed">{role.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Threshold & Algorithmic Sensitivity Sliders */}
      <div className="p-5 rounded-xl bg-[#14202c] border border-[#1e3a52] space-y-4">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#ffa726]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            Algorithmic Safety Thresholds &amp; Cold-Chain Parameters
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-lg bg-[#0f1923] border border-[#1e3a52] space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#90a4ae]">Surge Sensitivity Alert</span>
              <span className="font-bold text-[#ef5350] font-mono">+{surgeThresholdPct}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              value={surgeThresholdPct}
              onChange={(e) => setSurgeThresholdPct(parseInt(e.target.value))}
              className="w-full accent-[#ef5350] cursor-pointer"
            />
            <span className="text-[10px] text-[#78909c] block">
              Triggers Level 2 Warning when triage intake exceeds baseline
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0f1923] border border-[#1e3a52] space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#90a4ae]">Cold Chain Min Limit</span>
              <span className="font-bold text-[#4fc3f7] font-mono">{coldMinTemp}°C</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="4.0"
              step="0.5"
              value={coldMinTemp}
              onChange={(e) => setColdMinTemp(parseFloat(e.target.value))}
              className="w-full accent-[#4fc3f7] cursor-pointer"
            />
            <span className="text-[10px] text-[#78909c] block">
              Freeze protection trip limit for WHO standard vaccines
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0f1923] border border-[#1e3a52] space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#90a4ae]">Cold Chain Max Limit</span>
              <span className="font-bold text-[#ffa726] font-mono">{coldMaxTemp}°C</span>
            </div>
            <input
              type="range"
              min="6.0"
              max="12.0"
              step="0.5"
              value={coldMaxTemp}
              onChange={(e) => setColdMaxTemp(parseFloat(e.target.value))}
              className="w-full accent-[#ffa726] cursor-pointer"
            />
            <span className="text-[10px] text-[#78909c] block">
              Excursion trigger threshold for walk-in cold rooms
            </span>
          </div>
        </div>

        <button
          onClick={handleSaveSettings}
          className="px-4 py-2 rounded-lg text-xs font-bold bg-[#4fc3f7] hover:bg-[#38b2ea] text-[#0c141d] transition-colors cursor-pointer"
        >
          Save Configuration
        </button>
      </div>

      {/* Production Integration & API Gateways */}
      <div className="p-5 rounded-xl bg-[#14202c] border border-[#1e3a52] space-y-4">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-[#81d4fa]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            Enterprise Interoperability &amp; Healthcare Connectors
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-lg bg-[#0f1923] border border-[#1e3a52] flex items-center justify-between">
            <div>
              <span className="font-bold text-white block">HL7 / FHIR v4.0 Endpoint</span>
              <span className="text-[11px] text-[#90a4ae]">Hospital Electronic Health Records sync</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-[#4caf50]/20 text-[#4caf50] border border-[#4caf50]/40">
              CONNECTED
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0f1923] border border-[#1e3a52] flex items-center justify-between">
            <div>
              <span className="font-bold text-white block">IoT MQTT Telemetry Broker</span>
              <span className="text-[11px] text-[#90a4ae]">BLE 5.0 &amp; Cellular Temp Loggers (TLS 1.3)</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-[#4caf50]/20 text-[#4caf50] border border-[#4caf50]/40">
              ACTIVE
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0f1923] border border-[#1e3a52] flex items-center justify-between">
            <div>
              <span className="font-bold text-white block">Autonomous Traffic Corridor API</span>
              <span className="text-[11px] text-[#90a4ae]">Municipal Smart Signal Grid override integration</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-[#4caf50]/20 text-[#4caf50] border border-[#4caf50]/40">
              STANDBY
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0f1923] border border-[#1e3a52] flex items-center justify-between">
            <div>
              <span className="font-bold text-white block">Gemini 2.5 GenAI Inference Service</span>
              <span className="text-[11px] text-[#90a4ae]">Server-side demand modeling and explanation</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-[#4fc3f7]/20 text-[#4fc3f7] border border-[#4fc3f7]/40">
              READY
            </span>
          </div>
        </div>
      </div>

      {/* Demo Controls */}
      <div className="p-5 rounded-xl bg-[#261517] border border-[#ef5350]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wide text-[#ef5350]">
            Hackathon Presentation Controls
          </h4>
          <p className="text-xs text-[#b0bec5] mt-0.5">
            Reset demo data to default baseline or trigger a full pandemic intake surge test.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onResetData}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#162230] text-white hover:bg-[#1e2f42] border border-[#1e3a52] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Demo Data
          </button>
          <button
            onClick={onSimulateSurge}
            className="px-4 py-2 rounded-lg text-xs font-bold bg-[#ef5350] hover:bg-[#d32f2f] text-white flex items-center gap-1.5 shadow-[0_0_12px_rgba(239,83,80,0.3)] transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Run End-to-End Scenario
          </button>
        </div>
      </div>
    </div>
  );
};
