import React, { useState } from 'react';
import { Hospital, AlertLog, TabType } from '../types';
import { 
  AlertTriangle, 
  ArrowRight, 
  ShieldAlert, 
  Building, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Thermometer, 
  Zap,
  Filter
} from 'lucide-react';

interface OverviewViewProps {
  hospitals: Hospital[];
  alerts: AlertLog[];
  totalStock: number;
  activeDeliveriesCount: number;
  tempAlertsCount: number;
  pandemicMode: boolean;
  onNavigateTab: (tab: TabType) => void;
  onRequestRestock: (hospitalName: string) => void;
  onDismissAlert: (id: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  hospitals,
  alerts,
  totalStock,
  activeDeliveriesCount,
  tempAlertsCount,
  pandemicMode,
  onNavigateTab,
  onRequestRestock,
  onDismissAlert
}) => {
  const [alertFilter, setAlertFilter] = useState<'all' | 'critical' | 'warning' | 'info' | 'success'>('all');
  const [selectedFlowNode, setSelectedFlowNode] = useState<string | null>(null);

  const totalPatients = hospitals.reduce((acc, h) => acc + h.patients24h, 0);
  const totalBaseline = hospitals.reduce((acc, h) => acc + h.normalBaseline, 0);
  const overallSurge = Math.round(((totalPatients - totalBaseline) / totalBaseline) * 100);

  const filteredAlerts = alerts.filter(a => alertFilter === 'all' || a.type === alertFilter);

  return (
    <div className="space-y-6">
      {/* Pandemic Banner */}
      {pandemicMode ? (
        <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-[#3a1b1b] to-[#162230] border border-[#ef5350] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg shadow-[#ef5350]/10">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-3.5 h-3.5 mt-1 sm:mt-0 rounded-full bg-[#ef5350] shadow-[0_0_12px_#ef5350] animate-ping" />
            <div>
              <div className="font-bold text-base text-[#ef5350] flex items-center gap-2">
                <span>⚠ PANDEMIC MODE ACTIVE</span>
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-[#ef5350]/20 text-[#ef5350] border border-[#ef5350]/40">
                  SURGE DETECTED (+{overallSurge}%)
                </span>
              </div>
              <p className="text-xs text-[#c0a0a0] mt-1 leading-relaxed">
                Patient surge detected across {hospitals.filter(h => h.status === 'CRITICAL').length} core hospitals • Auto-escalated supply chain priority • Cold chain sensors reporting critical alerts
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <button
              onClick={() => onNavigateTab('supplier')}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#ef5350] text-white hover:bg-[#c62828] transition-colors cursor-pointer flex items-center gap-1.5 shadow"
            >
              <Zap size={14} />
              Open Emergency Hub
            </button>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#3a1b1b] text-[#ef5350] border border-[#ef5350]/60">
              LEVEL 3
            </span>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-[#162230] border border-[#1e3a52] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#4caf50] shadow-[0_0_8px_#4caf50]" />
            <div>
              <div className="text-sm font-bold text-[#4caf50]">STANDARD OPERATIONAL BASELINE</div>
              <div className="text-xs text-[#7a8fa3]">Patient inflow within regional tolerance limits.</div>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#1b3a2a] text-[#4caf50] border border-[#4caf50]/40">
            STATUS NORMAL
          </span>
        </div>
      )}

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Patients */}
        <div className="bg-[#162230] border border-[#1e3a52] rounded-xl p-5 relative overflow-hidden group hover:border-[#4fc3f7]/50 transition-all">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#5a7a94] mb-1">
            Total Patients (24h)
          </div>
          <div className="text-3xl font-extrabold font-mono text-white tracking-tight">
            {totalPatients.toLocaleString()}
          </div>
          <div className="text-xs font-medium text-[#ef5350] flex items-center gap-1 mt-2">
            <span>▲ {overallSurge}% above normal baseline</span>
          </div>
          <div className="absolute top-4 right-4 text-[#5a7a94]/30 group-hover:text-[#4fc3f7]/40 transition-colors">
            <ShieldAlert size={28} />
          </div>
        </div>

        {/* Vaccines in Stock */}
        <div className="bg-[#162230] border border-[#1e3a52] rounded-xl p-5 relative overflow-hidden group hover:border-[#4fc3f7]/50 transition-all cursor-pointer"
             onClick={() => onNavigateTab('inventory')}>
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#5a7a94] mb-1">
            Vaccines in Stock
          </div>
          <div className="text-3xl font-extrabold font-mono text-white tracking-tight">
            {totalStock.toLocaleString()}
          </div>
          <div className="text-xs font-medium text-[#ffa726] flex items-center gap-1 mt-2">
            <span>▼ 22% — restock triggered</span>
          </div>
          <div className="absolute top-4 right-4 text-[#5a7a94]/30 group-hover:text-[#ffa726]/40 transition-colors">
            <ArrowRight size={26} />
          </div>
        </div>

        {/* Active Deliveries */}
        <div className="bg-[#162230] border border-[#1e3a52] rounded-xl p-5 relative overflow-hidden group hover:border-[#4fc3f7]/50 transition-all cursor-pointer"
             onClick={() => onNavigateTab('transport')}>
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#5a7a94] mb-1">
            Active Deliveries
          </div>
          <div className="text-3xl font-extrabold font-mono text-white tracking-tight">
            {activeDeliveriesCount}
          </div>
          <div className="text-xs font-medium text-[#4fc3f7] flex items-center gap-1 mt-2">
            <span>3 en route • 2 loading • 2 queued</span>
          </div>
          <div className="absolute top-4 right-4 text-[#5a7a94]/30 group-hover:text-[#4fc3f7]/40 transition-colors">
            <Truck size={28} />
          </div>
        </div>

        {/* Temp Alerts */}
        <div className="bg-[#162230] border border-[#ef5350]/60 rounded-xl p-5 relative overflow-hidden group hover:border-[#ef5350] transition-all cursor-pointer bg-gradient-to-b from-[#162230] to-[#2a1215]/30"
             onClick={() => onNavigateTab('temperature')}>
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#ef5350] mb-1 flex items-center gap-1">
            <span>Temp Alerts</span>
            <span className="w-2 h-2 rounded-full bg-[#ef5350] animate-pulse" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-[#ef5350] tracking-tight">
            {tempAlertsCount}
          </div>
          <div className="text-xs font-medium text-[#ef5350] flex items-center gap-1 mt-2">
            <span>City Hospital • Metro Clinic</span>
          </div>
          <div className="absolute top-4 right-4 text-[#ef5350]/40 group-hover:text-[#ef5350]/80 transition-colors">
            <Thermometer size={28} />
          </div>
        </div>
      </div>

      {/* Supply Chain Process Flow */}
      <section className="bg-[#162230] border border-[#1e3a52] rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <h2 className="text-base font-bold text-[#c0d8ee] flex items-center gap-2">
            <Zap size={18} className="text-[#4fc3f7]" />
            Supply Chain Process Flow
          </h2>
          <span className="text-xs text-[#5a7a94]">
            Click any step to inspect automated triggers
          </span>
        </div>

        <div className="overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center min-w-[700px] justify-between gap-1 py-2">
            {/* Step 1 */}
            <div 
              onClick={() => setSelectedFlowNode('hospital')}
              className={`flex-1 p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                selectedFlowNode === 'hospital'
                  ? 'bg-[#1b2a3a] border-[#ef5350] shadow-md shadow-[#ef5350]/20'
                  : 'bg-[#1a2d3e] border-[#1e3a52] hover:border-[#4fc3f7]/50'
              }`}
            >
              <div className="text-[11px] font-medium text-[#5a7a94] uppercase tracking-wider">Hospital Data</div>
              <div className="text-sm font-bold text-white mt-1 font-mono">{totalPatients.toLocaleString()} patients</div>
              <div className="text-[10px] text-[#ef5350] font-semibold mt-0.5">Surge Triggered</div>
            </div>

            <div className="text-[#4fc3f7] font-bold px-1">→</div>

            {/* Step 2 */}
            <div 
              onClick={() => setSelectedFlowNode('pandemic')}
              className={`flex-1 p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                selectedFlowNode === 'pandemic'
                  ? 'bg-[#1b2a3a] border-[#ef5350] shadow-md shadow-[#ef5350]/20'
                  : 'bg-[#1a2d3e] border-[#ef5350]/60 shadow-[0_0_12px_#ef535020]'
              }`}
            >
              <div className="text-[11px] font-medium text-[#5a7a94] uppercase tracking-wider">Pandemic Detection</div>
              <div className="text-sm font-bold text-[#ef5350] mt-1 font-mono">PANDEMIC</div>
              <div className="text-[10px] text-[#ef5350]/80 mt-0.5">Level 3 Active</div>
            </div>

            <div className="text-[#4fc3f7] font-bold px-1">→</div>

            {/* Step 3 */}
            <div 
              onClick={() => { setSelectedFlowNode('stock'); onNavigateTab('inventory'); }}
              className={`flex-1 p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                selectedFlowNode === 'stock'
                  ? 'bg-[#1b2a3a] border-[#ffa726] shadow-md shadow-[#ffa726]/20'
                  : 'bg-[#1a2d3e] border-[#4fc3f7]/60 shadow-[0_0_12px_#4fc3f720]'
              }`}
            >
              <div className="text-[11px] font-medium text-[#5a7a94] uppercase tracking-wider">Stock Check</div>
              <div className="text-sm font-bold text-[#ffa726] mt-1 font-mono">LOW</div>
              <div className="text-[10px] text-[#ffa726]/80 mt-0.5">12 SKUs breached</div>
            </div>

            <div className="text-[#4fc3f7] font-bold px-1">→</div>

            {/* Step 4 */}
            <div 
              onClick={() => { setSelectedFlowNode('supplier'); onNavigateTab('supplier'); }}
              className="flex-1 p-3.5 rounded-xl bg-[#1a2d3e] border border-[#4caf50]/60 text-center shadow-[0_0_12px_#4caf5020] cursor-pointer hover:border-[#4caf50]"
            >
              <div className="text-[11px] font-medium text-[#5a7a94] uppercase tracking-wider">Signal Supplier</div>
              <div className="text-sm font-bold text-[#4caf50] mt-1 font-mono">SENT ✓</div>
              <div className="text-[10px] text-[#4caf50]/80 mt-0.5">MedPharma & VaxSupply</div>
            </div>

            <div className="text-[#4fc3f7] font-bold px-1">→</div>

            {/* Step 5 */}
            <div 
              onClick={() => onNavigateTab('supplier')}
              className="flex-1 p-3.5 rounded-xl bg-[#1a2d3e] border border-[#1e3a52] text-center cursor-pointer hover:border-[#4fc3f7]"
            >
              <div className="text-[11px] font-medium text-[#5a7a94] uppercase tracking-wider">Restock & Deliver</div>
              <div className="text-sm font-bold text-white mt-1 font-mono">In Progress</div>
              <div className="text-[10px] text-[#4fc3f7] mt-0.5">3 Convoys Dispatched</div>
            </div>

            <div className="text-[#4fc3f7] font-bold px-1">→</div>

            {/* Step 6 */}
            <div 
              onClick={() => onNavigateTab('transport')}
              className="flex-1 p-3.5 rounded-xl bg-[#1a2d3e] border border-[#4fc3f7]/50 text-center cursor-pointer hover:border-[#4fc3f7]"
            >
              <div className="text-[11px] font-medium text-[#5a7a94] uppercase tracking-wider">GPS + Traffic</div>
              <div className="text-sm font-bold text-[#4fc3f7] mt-1 font-mono">Route Active</div>
              <div className="text-[10px] text-[#4fc3f7]/80 mt-0.5">Green Corridor Open</div>
            </div>
          </div>
        </div>
      </section>

      {/* Hospital Patient Counts — Pandemic Threshold Analysis */}
      <section className="bg-[#162230] border border-[#1e3a52] rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-[#c0d8ee] flex items-center gap-2">
              <Building size={18} className="text-[#4fc3f7]" />
              Hospital Patient Counts — Pandemic Threshold Analysis
            </h2>
            <p className="text-xs text-[#5a7a94] mt-0.5">
              Live intake rate compared to 30-day pre-pandemic baseline
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('inventory')}
            className="text-xs font-semibold text-[#4fc3f7] hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            View all inventory allocations →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[#1e3a52] text-[#5a7a94] uppercase text-[11px] tracking-wider">
                <th className="py-3 px-3">Hospital</th>
                <th className="py-3 px-3">Patients (24h)</th>
                <th className="py-3 px-3">Normal Baseline</th>
                <th className="py-3 px-3">Surge %</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Stock Days Left</th>
                <th className="py-3 px-3 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a2d3e]">
              {hospitals.map((hospital) => (
                <tr key={hospital.id} className="hover:bg-[#1a2d3e]/60 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-semibold text-white">{hospital.name}</div>
                    <div className="text-[11px] text-[#5a7a94]">{hospital.location}</div>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-white">
                    {hospital.patients24h.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 font-mono text-[#5a7a94]">
                    {hospital.normalBaseline.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold">
                    <span className={hospital.surgePct > 100 ? 'text-[#ef5350]' : 'text-[#ffa726]'}>
                      +{hospital.surgePct}%
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      hospital.status === 'CRITICAL'
                        ? 'bg-[#3a1b1b] text-[#ef5350] border border-[#ef5350]/40 animate-pulse'
                        : 'bg-[#3a2e1b] text-[#ffa726] border border-[#ffa726]/40'
                    }`}>
                      {hospital.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold">
                    <span className={hospital.stockDaysLeft <= 2 ? 'text-[#ef5350]' : 'text-[#ffa726]'}>
                      {hospital.stockDaysLeft} days
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onRequestRestock(hospital.name)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#1b2a3a] text-[#4fc3f7] border border-[#1e3a52] hover:border-[#4fc3f7] hover:bg-[#1b2a3a]/80 transition-all cursor-pointer"
                    >
                      Restock Unit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Live Alerts Feed */}
      <section className="bg-[#162230] border border-[#1e3a52] rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className="text-[#ef5350]" />
            <h2 className="text-base font-bold text-[#c0d8ee]">Live Alerts & Dispatches</h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#0f1923] text-[#7a8fa3] border border-[#1e3a52]">
              {alerts.length} events
            </span>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {(['all', 'critical', 'warning', 'info', 'success'] as const).map(f => (
              <button
                key={f}
                onClick={() => setAlertFilter(f)}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-md uppercase tracking-wider transition-colors cursor-pointer ${
                  alertFilter === f
                    ? 'bg-[#4fc3f7] text-[#0f1923] font-bold'
                    : 'bg-[#0f1923] text-[#7a8fa3] hover:text-white border border-[#1e3a52]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2.5">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-8 text-xs text-[#5a7a94]">
              No alerts matching the selected filter.
            </div>
          ) : (
            filteredAlerts.map(alert => {
              const borderColors = {
                critical: 'border-[#ef5350] bg-[#2a1215]/80 text-[#ef5350]',
                warning: 'border-[#ffa726] bg-[#2a2215]/80 text-[#ffa726]',
                info: 'border-[#4fc3f7] bg-[#152230]/80 text-[#4fc3f7]',
                success: 'border-[#4caf50] bg-[#152a1b]/80 text-[#4caf50]'
              };

              return (
                <div 
                  key={alert.id}
                  className={`p-3.5 rounded-lg border text-xs sm:text-sm flex items-start justify-between gap-3 transition-all ${borderColors[alert.type]}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold tracking-wide">{alert.title}</span>
                      <span className="text-[11px] font-mono opacity-70">• {alert.timestamp}</span>
                    </div>
                    <p className="text-xs opacity-90 leading-relaxed">{alert.message}</p>
                  </div>
                  <button 
                    onClick={() => onDismissAlert(alert.id)}
                    className="text-[11px] opacity-60 hover:opacity-100 hover:underline shrink-0 text-[#c0d0e0] cursor-pointer"
                  >
                    Acknowledge
                  </button>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
};
