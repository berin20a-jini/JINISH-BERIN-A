import React, { useState } from 'react';
import { Hospital, InventoryItem, AIRecommendation, TabType } from '../types';
import { 
  Cpu, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  ShieldAlert, 
  Sparkles, 
  Clock, 
  Truck, 
  ShieldCheck,
  ChevronRight,
  Activity,
  Layers,
  FileText
} from 'lucide-react';

interface AiCommandCenterViewProps {
  recommendations: AIRecommendation[];
  hospitals: Hospital[];
  inventory: InventoryItem[];
  onApproveRecommendation: (recId: string) => void;
  onRejectRecommendation: (recId: string) => void;
  onNavigateTab: (tab: TabType) => void;
  onSimulateSurge: () => void;
}

export const AiCommandCenterView: React.FC<AiCommandCenterViewProps> = ({
  recommendations,
  hospitals,
  inventory,
  onApproveRecommendation,
  onRejectRecommendation,
  onNavigateTab,
  onSimulateSurge
}) => {
  const [forecastHorizon, setForecastHorizon] = useState<'7' | '14' | '30'>('7');
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>('hosp-1');

  const selectedHospital = hospitals.find(h => h.id === selectedHospitalId) || hospitals[0];
  const pendingRecs = recommendations.filter(r => r.status === 'PENDING');
  const approvedRecs = recommendations.filter(r => r.status === 'APPROVED');

  // Multiplier for forecast horizon
  const horizonMultiplier = forecastHorizon === '7' ? 1 : forecastHorizon === '14' ? 1.9 : 3.8;
  const currentDailyRate = selectedHospital ? Math.round(selectedHospital.patients24h * 0.085) : 350;
  const forecastedDemand = Math.round(currentDailyRate * parseInt(forecastHorizon) * 1.18);
  const currentHospitalStock = inventory
    .filter(i => i.hospital === selectedHospital?.name && i.type === 'Vaccine')
    .reduce((acc, curr) => acc + curr.inStock, 0);

  const shortageRisk = currentHospitalStock < forecastedDemand;
  const shortageAmount = Math.max(0, forecastedDemand - currentHospitalStock);

  return (
    <div className="space-y-6">
      {/* Top Banner: Core Autonomous Triaging Paradigm */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-[#142332] via-[#10202e] to-[#121c27] border border-[#1e3a52] shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#4fc3f7]/10 border border-[#4fc3f7]/40 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(79,195,247,0.2)]">
              <Cpu className="w-6 h-6 text-[#4fc3f7]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide">
                  AI Autonomous Command Center
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#4fc3f7] text-[#0c141d]">
                  LIVE INFERENCE
                </span>
              </div>
              <p className="text-xs text-[#90a4ae] mt-1 max-w-2xl leading-relaxed">
                Continuous machine learning monitoring that evaluates triage intake velocity, cold-chain stability, 
                and supplier logistics. Powered by the <span className="text-[#4fc3f7] font-semibold">Human-in-the-Loop</span> governance protocol.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onSimulateSurge}
              className="px-3.5 py-2 rounded-lg text-xs font-bold bg-[#ef5350]/20 text-[#ef5350] border border-[#ef5350]/60 hover:bg-[#ef5350]/30 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Trigger Surge Anomaly
            </button>
            <button
              onClick={() => onNavigateTab('procurement')}
              className="px-3.5 py-2 rounded-lg text-xs font-bold bg-[#1e3a52] text-[#81d4fa] hover:bg-[#254663] transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>Procurement Pipeline</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* The 3 Questions Framework */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5 pt-4 border-t border-[#1e3a52]/60">
          <div className="p-3 rounded-lg bg-[#0f1923]/70 border border-[#1e3a52]/80">
            <span className="text-[10px] font-mono text-[#4fc3f7] uppercase font-bold tracking-wider">
              1. What is happening?
            </span>
            <p className="text-xs font-semibold text-white mt-1">Abnormal Surge Detected</p>
            <p className="text-[11px] text-[#90a4ae] mt-0.5">
              City General Hospital: +75.4% surge in past 24h. Stock burn rate increased to 350 doses/day.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#0f1923]/70 border border-[#1e3a52]/80">
            <span className="text-[10px] font-mono text-[#ffa726] uppercase font-bold tracking-wider">
              2. What will happen?
            </span>
            <p className="text-xs font-semibold text-white mt-1">Stock Depletion in 4 Days</p>
            <p className="text-[11px] text-[#90a4ae] mt-0.5">
              Current vaccine reserve (1,400 doses) will be exhausted in ~96 hours; 1,600 dose deficit predicted.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#0f1923]/70 border border-[#1e3a52]/80">
            <span className="text-[10px] font-mono text-[#4caf50] uppercase font-bold tracking-wider">
              3. What should we do?
            </span>
            <p className="text-xs font-semibold text-white mt-1">Procure 2,000 Doses via MedPharma</p>
            <p className="text-[11px] text-[#90a4ae] mt-0.5">
              MedPharma Corp has 18.5k verified stock, 98.4% reliability, and refrigerated transit within 18 hours.
            </p>
          </div>
        </div>
      </div>

      {/* Human-in-the-loop Recommendations Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#4fc3f7]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Pending Human Approval ({pendingRecs.length})
            </h3>
          </div>
          <span className="text-xs text-[#90a4ae] font-mono">
            AI Advisory Protocol · Human Validation Required
          </span>
        </div>

        {pendingRecs.length === 0 ? (
          <div className="p-8 rounded-xl bg-[#14202c] border border-[#1e3a52] text-center">
            <CheckCircle2 className="w-10 h-10 text-[#4caf50] mx-auto mb-2 opacity-80" />
            <h4 className="text-sm font-semibold text-white">All AI Recommendations Processed</h4>
            <p className="text-xs text-[#90a4ae] mt-1 max-w-md mx-auto">
              Supply chain allocations are synchronized. Click "Trigger Surge Anomaly" to simulate a new emergency scenario.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {pendingRecs.map((rec) => (
              <div 
                key={rec.id}
                className="p-5 rounded-xl bg-[#142230] border-2 border-[#4fc3f7]/50 shadow-[0_4px_20px_rgba(79,195,247,0.1)] relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 px-3 py-1 bg-[#4fc3f7] text-[#0f1923] text-[10px] font-black uppercase tracking-wider rounded-bl-lg">
                  CONFIDENCE: {rec.confidenceScore}%
                </div>

                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="space-y-3 flex-1">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-[#ef5350]/20 text-[#ef5350] border border-[#ef5350]/50 font-mono">
                          ACTION NEEDED
                        </span>
                        <h4 className="text-base font-bold text-white tracking-wide">
                          {rec.title}
                        </h4>
                      </div>
                      <p className="text-xs text-[#b0bec5] mt-1">
                        Facility: <span className="text-white font-semibold">{rec.hospital}</span> · Item: <span className="text-[#4fc3f7] font-semibold">{rec.targetItem}</span>
                      </p>
                    </div>

                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2">
                      <div className="p-2.5 rounded-lg bg-[#0f1923] border border-[#1e3a52]">
                        <span className="text-[10px] text-[#90a4ae] uppercase font-mono">Current Stock</span>
                        <p className="text-sm font-bold text-white mt-0.5">{rec.currentStock.toLocaleString()} doses</p>
                        <span className="text-[10px] text-[#ef5350]">Depletes in ~{rec.daysUntilShortage} days</span>
                      </div>

                      <div className="p-2.5 rounded-lg bg-[#0f1923] border border-[#1e3a52]">
                        <span className="text-[10px] text-[#90a4ae] uppercase font-mono">7-Day Demand</span>
                        <p className="text-sm font-bold text-[#ffa726] mt-0.5">{rec.predictedDemand7Days.toLocaleString()} doses</p>
                        <span className="text-[10px] text-[#90a4ae]">+75% surge factored</span>
                      </div>

                      <div className="p-2.5 rounded-lg bg-[#0f1923] border border-[#1e3a52]">
                        <span className="text-[10px] text-[#90a4ae] uppercase font-mono">Projected Shortage</span>
                        <p className="text-sm font-bold text-[#ef5350] mt-0.5">{rec.projectedShortage.toLocaleString()} doses</p>
                        <span className="text-[10px] text-[#ef5350]">Critical Deficit</span>
                      </div>

                      <div className="p-2.5 rounded-lg bg-[#0f1923] border border-[#4fc3f7]/30">
                        <span className="text-[10px] text-[#4fc3f7] uppercase font-mono">AI Recommended Buy</span>
                        <p className="text-sm font-bold text-[#4fc3f7] mt-0.5">{rec.recommendedQuantity.toLocaleString()} doses</p>
                        <span className="text-[10px] text-[#4caf50]">From {rec.recommendedSupplier}</span>
                      </div>
                    </div>

                    {/* Explainable AI Reasoning */}
                    <div className="p-3 rounded-lg bg-[#0f1923]/80 border border-[#1e3a52]">
                      <span className="text-[10px] font-bold text-[#4fc3f7] uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        Explainable AI Recommendation Logic:
                      </span>
                      <ul className="mt-1.5 space-y-1">
                        {rec.reasoning.map((r, i) => (
                          <li key={i} className="text-xs text-[#cfd8dc] flex items-start gap-2">
                            <span className="text-[#4fc3f7] font-bold">•</span>
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Decision Action Buttons */}
                  <div className="flex lg:flex-col gap-2.5 shrink-0 justify-end pt-2 lg:pt-0">
                    <button
                      onClick={() => onApproveRecommendation(rec.id)}
                      className="flex-1 lg:flex-initial px-5 py-3 rounded-lg font-bold text-xs bg-[#4caf50] hover:bg-[#43a047] text-[#0c141d] flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(76,175,80,0.3)] transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Approve &amp; Dispatch Order
                    </button>
                    
                    <button
                      onClick={() => onRejectRecommendation(rec.id)}
                      className="flex-1 lg:flex-initial px-4 py-2.5 rounded-lg font-medium text-xs bg-[#1a2634] hover:bg-[#203042] text-[#b0bec5] border border-[#1e3a52] flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <XCircle className="w-4 h-4 text-[#ef5350]" />
                      Decline Recommendation
                    </button>

                    <button
                      onClick={() => onNavigateTab('inventory')}
                      className="hidden sm:flex px-4 py-2 rounded-lg font-medium text-[11px] text-[#90a4ae] hover:text-white justify-center items-center gap-1"
                    >
                      View Hospital Inventory
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Demand Forecasting & Surge Modeling */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Demand Forecasting */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-[#14202c] border border-[#1e3a52] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#4fc3f7]" />
                Demand Forecasting &amp; Depletion Model
              </h3>
              <p className="text-xs text-[#90a4ae] mt-0.5">
                Predictive consumption projection based on clinical intake rates
              </p>
            </div>

            {/* Time Horizon Selector */}
            <div className="flex items-center gap-1 p-1 rounded-lg bg-[#0f1923] border border-[#1e3a52]">
              {(['7', '14', '30'] as const).map((days) => (
                <button
                  key={days}
                  onClick={() => setForecastHorizon(days)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    forecastHorizon === days
                      ? 'bg-[#1b2a3a] text-[#4fc3f7] border border-[#4fc3f7]/40 shadow-sm'
                      : 'text-[#90a4ae] hover:text-white'
                  }`}
                >
                  {days} Days
                </button>
              ))}
            </div>
          </div>

          {/* Hospital Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {hospitals.map((hosp) => (
              <button
                key={hosp.id}
                onClick={() => setSelectedHospitalId(hosp.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap border transition-all cursor-pointer ${
                  selectedHospitalId === hosp.id
                    ? 'bg-[#1e3a52] text-[#4fc3f7] border-[#4fc3f7]/60'
                    : 'bg-[#0f1923] text-[#90a4ae] border-[#1e3a52] hover:text-white'
                }`}
              >
                {hosp.name} {hosp.status === 'CRITICAL' && '⚠️'}
              </button>
            ))}
          </div>

          {/* Forecast Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-lg bg-[#0f1923] border border-[#1e3a52]">
              <span className="text-[11px] text-[#90a4ae] font-mono">Current Available Stock</span>
              <p className="text-xl font-bold text-white mt-1">{currentHospitalStock.toLocaleString()} <span className="text-xs font-normal text-[#90a4ae]">doses</span></p>
              <div className="flex items-center gap-1 text-[11px] text-[#90a4ae] mt-1">
                <span>Burn rate:</span>
                <span className="font-semibold text-white">{currentDailyRate} doses/day</span>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-[#0f1923] border border-[#1e3a52]">
              <span className="text-[11px] text-[#90a4ae] font-mono">{forecastHorizon}-Day Predicted Demand</span>
              <p className="text-xl font-bold text-[#ffa726] mt-1">{forecastedDemand.toLocaleString()} <span className="text-xs font-normal text-[#90a4ae]">doses</span></p>
              <div className="flex items-center gap-1 text-[11px] text-[#ffa726] mt-1">
                <span>Confidence:</span>
                <span className="font-semibold">93.2%</span>
              </div>
            </div>

            <div className={`p-3.5 rounded-lg border ${shortageRisk ? 'bg-[#261517] border-[#ef5350]/60' : 'bg-[#122319] border-[#4caf50]/60'}`}>
              <span className="text-[11px] font-mono uppercase text-[#90a4ae]">
                {shortageRisk ? 'Projected Deficit' : 'Safety Buffer'}
              </span>
              <p className={`text-xl font-bold mt-1 ${shortageRisk ? 'text-[#ef5350]' : 'text-[#4caf50]'}`}>
                {shortageRisk ? `-${shortageAmount.toLocaleString()}` : `+${(currentHospitalStock - forecastedDemand).toLocaleString()}`} <span className="text-xs font-normal text-[#90a4ae]">doses</span>
              </p>
              <div className="text-[11px] font-semibold mt-1">
                {shortageRisk ? (
                  <span className="text-[#ef5350] flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> SHORTAGE LIKELY
                  </span>
                ) : (
                  <span className="text-[#4caf50]">ADEQUATELY STOCKED</span>
                )}
              </div>
            </div>
          </div>

          {/* SVG Visual Forecast Chart */}
          <div className="p-4 rounded-lg bg-[#0f1923] border border-[#1e3a52]">
            <div className="flex items-center justify-between text-xs text-[#90a4ae] mb-3">
              <span className="font-mono">Daily Stock vs Predicted Cumulative Consumption Curve</span>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4fc3f7]" /> Stock Level
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ef5350]" /> Depletion Threshold
                </span>
              </div>
            </div>

            <div className="h-44 w-full relative">
              <svg viewBox="0 0 600 150" className="w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="stockGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4fc3f7" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#4fc3f7" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1="0" y1="30" x2="600" y2="30" stroke="#1e3a52" strokeDasharray="3 3" />
                <line x1="0" y1="75" x2="600" y2="75" stroke="#1e3a52" strokeDasharray="3 3" />
                <line x1="0" y1="120" x2="600" y2="120" stroke="#1e3a52" strokeDasharray="3 3" />

                {/* Critical safety threshold baseline */}
                <line x1="0" y1="110" x2="600" y2="110" stroke="#ef5350" strokeWidth="1.5" strokeDasharray="4 4" />
                <text x="10" y="105" fill="#ef5350" fontSize="10" fontFamily="monospace">CRITICAL RESERVE CEILING</text>

                {/* Stock depletion curve */}
                <path
                  d="M 0 35 Q 150 50, 300 95 T 600 145 L 600 150 L 0 150 Z"
                  fill="url(#stockGradient)"
                />
                <path
                  d="M 0 35 Q 150 50, 300 95 T 600 145"
                  fill="none"
                  stroke="#4fc3f7"
                  strokeWidth="3"
                />

                {/* Depletion point marker */}
                <circle cx="340" cy="110" r="5" fill="#ef5350" stroke="#ffffff" strokeWidth="2" />
                <text x="350" y="105" fill="#ef5350" fontSize="11" fontWeight="bold">Depletion Day 4</text>
              </svg>
            </div>
            <div className="flex justify-between text-[11px] font-mono text-[#78909c] mt-2">
              <span>Day 0 (Now)</span>
              <span>Day 2</span>
              <span>Day 4 (Breach)</span>
              <span>Day 6</span>
              <span>Day 7 (Horizon)</span>
            </div>
          </div>
        </div>

        {/* Right Col: Hospital Anomaly & Surge Classification */}
        <div className="p-5 rounded-xl bg-[#14202c] border border-[#1e3a52] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#ef5350]" />
              Hospital Surge Risk Index
            </h3>
            <span className="text-[10px] font-mono text-[#4fc3f7]">AI CLASSIFIER</span>
          </div>

          <div className="space-y-3">
            {hospitals.map((hosp) => (
              <div 
                key={hosp.id}
                onClick={() => setSelectedHospitalId(hosp.id)}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  selectedHospitalId === hosp.id 
                    ? 'bg-[#1b2a3a] border-[#4fc3f7]' 
                    : 'bg-[#0f1923] border-[#1e3a52] hover:bg-[#14202c]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{hosp.name}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${
                    hosp.status === 'CRITICAL' 
                      ? 'bg-[#ef5350]/20 text-[#ef5350] border border-[#ef5350]/50' 
                      : hosp.status === 'HIGH'
                      ? 'bg-[#ffa726]/20 text-[#ffa726] border border-[#ffa726]/50'
                      : 'bg-[#4caf50]/20 text-[#4caf50] border border-[#4caf50]/50'
                  }`}>
                    {hosp.status} RISK
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2 text-[11px] text-[#90a4ae]">
                  <div>
                    <span>Surge Index:</span>{' '}
                    <span className="font-semibold text-[#ef5350]">+{hosp.surgePct}%</span>
                  </div>
                  <div>
                    <span>Stock Left:</span>{' '}
                    <span className="font-semibold text-white">{hosp.stockDaysLeft} days</span>
                  </div>
                  <div>
                    <span>Patients (24h):</span>{' '}
                    <span className="font-semibold text-white">{hosp.patients24h.toLocaleString()}</span>
                  </div>
                  <div>
                    <span>ICU Available:</span>{' '}
                    <span className="font-semibold text-white">{hosp.icuAvailable} beds</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-[#0f1923] border border-[#1e3a52] text-xs text-[#90a4ae]">
            <p className="font-semibold text-white mb-1">Anomaly Detection Rule:</p>
            <p className="text-[11px] leading-relaxed">
              Triage surge exceeding 25% over a 24h baseline flags an automatic Level 2 Warning; surges &gt;50% trigger Level 3 Emergency Order Recommendations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
