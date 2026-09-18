import React, { useState } from 'react';
import { AlertLog, TabType } from '../types';
import { 
  Bell, 
  AlertTriangle, 
  XCircle, 
  Info, 
  CheckCircle, 
  CheckCheck, 
  Trash2, 
  Search, 
  Filter, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';

interface AlertsViewProps {
  alerts: AlertLog[];
  onAcknowledgeAlert: (alertId: string) => void;
  onAcknowledgeAll: () => void;
  onDismissAlert: (alertId: string) => void;
  onNavigateTab: (tab: TabType) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  alerts,
  onAcknowledgeAlert,
  onAcknowledgeAll,
  onDismissAlert,
  onNavigateTab
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredAlerts = alerts.filter(alert => {
    if (filterType !== 'ALL' && alert.type !== filterType.toLowerCase()) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        alert.title.toLowerCase().includes(q) ||
        alert.message.toLowerCase().includes(q) ||
        alert.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const criticalCount = alerts.filter(a => a.type === 'critical').length;
  const warningCount = alerts.filter(a => a.type === 'warning').length;
  const unackedCount = alerts.filter(a => !a.acknowledged).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-[#142332] via-[#10202e] to-[#121c27] border border-[#1e3a52] shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#ef5350]" />
              Real-Time Incident &amp; Alert Center
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#ef5350] text-white font-mono">
              {unackedCount} ACTIVE
            </span>
          </div>
          <p className="text-xs text-[#90a4ae] mt-1">
            Aggregated telemetry breaches across patient surge detection, cold-chain temperature sensors, and transit delays.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unackedCount > 0 && (
            <button
              onClick={onAcknowledgeAll}
              className="px-3.5 py-2 rounded-lg text-xs font-bold bg-[#1e3a52] text-[#81d4fa] hover:bg-[#284966] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCheck className="w-4 h-4" />
              Acknowledge All ({unackedCount})
            </button>
          )}
        </div>
      </div>

      {/* KPI Severity Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div 
          onClick={() => setFilterType('ALL')}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
            filterType === 'ALL' ? 'bg-[#1b2a3a] border-[#4fc3f7]' : 'bg-[#14202c] border-[#1e3a52]'
          }`}
        >
          <span className="text-[11px] font-mono text-[#90a4ae] uppercase">All Recorded Events</span>
          <p className="text-2xl font-bold text-white mt-1">{alerts.length}</p>
          <span className="text-[10px] text-[#78909c]">System-wide triggers</span>
        </div>

        <div 
          onClick={() => setFilterType('CRITICAL')}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
            filterType === 'CRITICAL' ? 'bg-[#261517] border-[#ef5350]' : 'bg-[#14202c] border-[#1e3a52]'
          }`}
        >
          <span className="text-[11px] font-mono text-[#ef5350] uppercase flex items-center gap-1">
            <XCircle className="w-3 h-3" /> Critical Incidents
          </span>
          <p className="text-2xl font-bold text-[#ef5350] mt-1">{criticalCount}</p>
          <span className="text-[10px] text-[#ef5350]/80">Immediate triage required</span>
        </div>

        <div 
          onClick={() => setFilterType('WARNING')}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
            filterType === 'WARNING' ? 'bg-[#261e14] border-[#ffa726]' : 'bg-[#14202c] border-[#1e3a52]'
          }`}
        >
          <span className="text-[11px] font-mono text-[#ffa726] uppercase flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Warnings &amp; Delays
          </span>
          <p className="text-2xl font-bold text-[#ffa726] mt-1">{warningCount}</p>
          <span className="text-[10px] text-[#ffa726]/80">Pre-emptive alerts</span>
        </div>

        <div 
          onClick={() => setFilterType('SUCCESS')}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
            filterType === 'SUCCESS' ? 'bg-[#122319] border-[#4caf50]' : 'bg-[#14202c] border-[#1e3a52]'
          }`}
        >
          <span className="text-[11px] font-mono text-[#4caf50] uppercase flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Deliveries &amp; Resolutions
          </span>
          <p className="text-2xl font-bold text-[#4caf50] mt-1">
            {alerts.filter(a => a.type === 'success' || a.type === 'info').length}
          </p>
          <span className="text-[10px] text-[#4caf50]/80">Confirmed operations</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#78909c] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search alerts by hospital, batch, keyword, or event type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#14202c] border border-[#1e3a52] rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-[#546e7a] focus:outline-none focus:border-[#4fc3f7]"
          />
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-8 rounded-xl bg-[#14202c] border border-[#1e3a52] text-center text-[#90a4ae]">
            <CheckCircle className="w-8 h-8 text-[#4caf50] mx-auto mb-2 opacity-70" />
            <p className="text-xs">No alerts matching the selected filter criteria.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            let badgeClass = 'bg-[#1e3a52] text-[#81d4fa] border-[#1e3a52]';
            let borderClass = 'border-[#1e3a52]';
            let Icon = Info;

            if (alert.type === 'critical') {
              badgeClass = 'bg-[#ef5350]/20 text-[#ef5350] border-[#ef5350]/50';
              borderClass = 'border-[#ef5350]/50 bg-[#1a1417]';
              Icon = XCircle;
            } else if (alert.type === 'warning') {
              badgeClass = 'bg-[#ffa726]/20 text-[#ffa726] border-[#ffa726]/50';
              borderClass = 'border-[#ffa726]/50 bg-[#1a1712]';
              Icon = AlertTriangle;
            } else if (alert.type === 'success') {
              badgeClass = 'bg-[#4caf50]/20 text-[#4caf50] border-[#4caf50]/50';
              borderClass = 'border-[#4caf50]/40 bg-[#121c17]';
              Icon = CheckCircle;
            }

            return (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border transition-all ${borderClass} ${
                  alert.acknowledged ? 'opacity-70' : 'shadow-md'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${
                      alert.type === 'critical' ? 'text-[#ef5350]' :
                      alert.type === 'warning' ? 'text-[#ffa726]' :
                      alert.type === 'success' ? 'text-[#4caf50]' : 'text-[#4fc3f7]'
                    }`} />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-0.5 text-[10px] font-bold font-mono uppercase rounded border ${badgeClass}`}>
                          {alert.category} · {alert.type}
                        </span>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wide">
                          {alert.title}
                        </h4>
                        {alert.acknowledged && (
                          <span className="text-[10px] text-[#4caf50] font-mono flex items-center gap-1">
                            ✓ ACKNOWLEDGED
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#b0bec5] mt-1 leading-relaxed">
                        {alert.message}
                      </p>
                      <span className="text-[10px] text-[#78909c] font-mono mt-1 block">
                        Logged: {alert.timestamp}
                      </span>
                    </div>
                  </div>

                  {/* Actions on Alert */}
                  <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 self-end sm:self-auto">
                    {alert.targetTab && (
                      <button
                        onClick={() => onNavigateTab(alert.targetTab!)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1e3a52] text-[#81d4fa] hover:bg-[#254663] transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>{alert.actionLabel || 'Inspect'}</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}

                    {!alert.acknowledged && (
                      <button
                        onClick={() => onAcknowledgeAlert(alert.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#162230] text-[#cfd8dc] hover:text-white hover:bg-[#1e2f42] border border-[#1e3a52] transition-colors cursor-pointer"
                      >
                        Acknowledge
                      </button>
                    )}

                    <button
                      onClick={() => onDismissAlert(alert.id)}
                      className="p-1.5 text-[#78909c] hover:text-[#ef5350] rounded hover:bg-white/5 transition-colors"
                      title="Dismiss alert"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
