import React, { useState } from 'react';
import { Hospital, InventoryItem, Supplier } from '../types';
import { 
  TrendingUp, 
  BarChart3, 
  ShieldAlert, 
  CheckCircle2, 
  Truck, 
  Thermometer, 
  Calendar,
  Layers,
  Percent,
  Sparkles
} from 'lucide-react';

interface AnalyticsViewProps {
  hospitals: Hospital[];
  inventory: InventoryItem[];
  suppliers: Supplier[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  hospitals,
  inventory,
  suppliers
}) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  // Simulated metrics
  const totalStockDoses = inventory
    .filter(i => i.type === 'Vaccine')
    .reduce((acc, curr) => acc + curr.inStock, 0);

  const totalMedicineUnits = inventory
    .filter(i => i.type === 'Medicine')
    .reduce((acc, curr) => acc + curr.inStock, 0);

  const wastagePreventedDoses = 4850;
  const wastagePreventedCost = 58200; // in USD or converted
  const coldChainCompliancePct = 99.1;
  const avgSupplierLeadTimeHours = 14.2;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-[#142332] via-[#10202e] to-[#121c27] border border-[#1e3a52] shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#4fc3f7]" />
              Supply Chain Predictive Analytics &amp; KPI Metrics
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#4fc3f7] text-[#0c141d] font-mono">
              REAL-TIME AGGREGATION
            </span>
          </div>
          <p className="text-xs text-[#90a4ae] mt-1">
            Machine learning forecasting of hospital consumption curves, cold-chain stability benchmarks, and supplier SLA compliance.
          </p>
        </div>

        {/* Range Selector */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-[#0f1923] border border-[#1e3a52]">
          {(['7d', '30d', '90d'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                timeRange === r
                  ? 'bg-[#1b2a3a] text-[#4fc3f7] border border-[#4fc3f7]/40 shadow-sm'
                  : 'text-[#90a4ae] hover:text-white'
              }`}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Top Level Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#14202c] border border-[#1e3a52]">
          <span className="text-[10px] font-mono text-[#90a4ae] uppercase">Cold-Chain Compliance</span>
          <p className="text-2xl font-bold text-[#4caf50] mt-1">{coldChainCompliancePct}%</p>
          <span className="text-[11px] text-[#90a4ae]">2°C — 8°C thermal retention</span>
        </div>

        <div className="p-4 rounded-xl bg-[#14202c] border border-[#1e3a52]">
          <span className="text-[10px] font-mono text-[#90a4ae] uppercase">FEFO Wastage Prevented</span>
          <p className="text-2xl font-bold text-[#4fc3f7] mt-1">{wastagePreventedDoses.toLocaleString()} doses</p>
          <span className="text-[11px] text-[#4caf50]">Saved est. ${(wastagePreventedCost).toLocaleString()}</span>
        </div>

        <div className="p-4 rounded-xl bg-[#14202c] border border-[#1e3a52]">
          <span className="text-[10px] font-mono text-[#90a4ae] uppercase">Avg Supplier Lead Time</span>
          <p className="text-2xl font-bold text-[#ffa726] mt-1">{avgSupplierLeadTimeHours} hrs</p>
          <span className="text-[11px] text-[#90a4ae]">3.8 hrs faster than baseline</span>
        </div>

        <div className="p-4 rounded-xl bg-[#14202c] border border-[#1e3a52]">
          <span className="text-[10px] font-mono text-[#90a4ae] uppercase">Autonomous AI Precision</span>
          <p className="text-2xl font-bold text-white mt-1">96.8%</p>
          <span className="text-[11px] text-[#4fc3f7]">Surge demand accuracy</span>
        </div>
      </div>

      {/* Dual Column Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: 7-Day Patient Surge vs Actual Ingestion */}
        <div className="p-5 rounded-xl bg-[#14202c] border border-[#1e3a52] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#ef5350]" />
                Daily Patient Intake vs Projected Surge
              </h3>
              <p className="text-[11px] text-[#90a4ae] mt-0.5">Rolling 7-day emergency ward triage count</p>
            </div>
            <span className="text-[10px] font-mono text-[#4fc3f7]">+75.4% PEAK</span>
          </div>

          <div className="h-52 w-full p-2 bg-[#0f1923] rounded-lg border border-[#1e3a52] flex flex-col justify-end">
            <svg viewBox="0 0 500 160" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="surgeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef5350" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#ef5350" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid */}
              <line x1="0" y1="40" x2="500" y2="40" stroke="#1e3a52" strokeDasharray="3 3" />
              <line x1="0" y1="80" x2="500" y2="80" stroke="#1e3a52" strokeDasharray="3 3" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="#1e3a52" strokeDasharray="3 3" />

              {/* Baseline Line */}
              <line x1="0" y1="110" x2="500" y2="110" stroke="#546e7a" strokeWidth="1.5" strokeDasharray="4 4" />
              <text x="10" y="105" fill="#78909c" fontSize="9" fontFamily="monospace">NORMAL BASELINE (2,400)</text>

              {/* Surge Curve */}
              <path
                d="M 0 115 Q 80 110, 160 90 T 320 45 T 420 20 T 500 15 L 500 160 L 0 160 Z"
                fill="url(#surgeGrad)"
              />
              <path
                d="M 0 115 Q 80 110, 160 90 T 320 45 T 420 20 T 500 15"
                fill="none"
                stroke="#ef5350"
                strokeWidth="2.5"
              />

              {/* Points */}
              <circle cx="420" cy="20" r="4" fill="#ef5350" stroke="#fff" strokeWidth="2" />
              <text x="400" y="12" fill="#ef5350" fontSize="10" fontWeight="bold">4,210 Pts</text>
            </svg>
            <div className="flex justify-between text-[10px] font-mono text-[#78909c] pt-2 px-1">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Today (Surge)</span>
            </div>
          </div>
        </div>

        {/* Chart 2: Inventory Burn Velocity by SKU */}
        <div className="p-5 rounded-xl bg-[#14202c] border border-[#1e3a52] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#4fc3f7]" />
                Daily Inventory Burn Velocity vs Target Stock
              </h3>
              <p className="text-[11px] text-[#90a4ae] mt-0.5">Current reserves against required buffer</p>
            </div>
            <span className="text-[10px] font-mono text-[#ffa726]">CRITICAL RESERVES</span>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { name: 'Covaxin Doses', current: 1400, target: 3000, pct: 46, status: 'CRITICAL' },
              { name: 'Paracetamol 500mg', current: 1200, target: 4500, pct: 26, status: 'CRITICAL' },
              { name: 'Remdesivir Vials', current: 890, target: 1500, pct: 59, status: 'LOW' },
              { name: 'Covishield Doses', current: 3400, target: 2500, pct: 136, status: 'OK' },
              { name: 'Pfizer-BioNTech', current: 5200, target: 3500, pct: 148, status: 'OK' }
            ].map((sku, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-[#0f1923] border border-[#1e3a52]">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-white">{sku.name}</span>
                  <span className="font-mono text-[#90a4ae]">
                    {sku.current.toLocaleString()} / {sku.target.toLocaleString()} ({sku.pct}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-[#1e3a52] rounded-full mt-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      sku.pct < 35 ? 'bg-[#ef5350]' : sku.pct < 70 ? 'bg-[#ffa726]' : 'bg-[#4caf50]'
                    }`}
                    style={{ width: `${Math.min(100, sku.pct)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Supplier Reliability & SLA Performance Breakdown */}
      <div className="p-5 rounded-xl bg-[#14202c] border border-[#1e3a52] space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center justify-between">
          <span>Supplier Network Reliability &amp; On-Time Delivery Ratings</span>
          <span className="text-[11px] font-mono text-[#90a4ae]">ISO-9001 / WHO-PQS Certified</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {suppliers.map((s) => (
            <div key={s.id} className="p-4 rounded-xl bg-[#0f1923] border border-[#1e3a52] space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">{s.name}</h4>
                  <p className="text-[10px] text-[#78909c] mt-0.5">{s.location}</p>
                </div>
                <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-[#4caf50]/20 text-[#4caf50] border border-[#4caf50]/40">
                  {s.reliabilityScore}%
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-[#90a4ae]">
                <div className="flex justify-between">
                  <span>Standard ETA:</span>
                  <span className="text-white font-mono">{s.eta}</span>
                </div>
                <div className="flex justify-between">
                  <span>Response Time:</span>
                  <span className="text-white font-mono">{s.responseTimeMin} mins</span>
                </div>
                <div className="flex justify-between">
                  <span>Emergency Transit:</span>
                  <span className="text-[#4fc3f7] font-semibold">Available 24/7</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
