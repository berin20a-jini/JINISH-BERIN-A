import React, { useState } from 'react';
import { AuditLogRecord } from '../types';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Hash, 
  Cpu, 
  User, 
  Clock,
  Layers
} from 'lucide-react';

interface AuditLogViewProps {
  logs: AuditLogRecord[];
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({ logs }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const filteredLogs = logs.filter(log => {
    if (filterCategory !== 'ALL' && log.category !== filterCategory) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        log.action.toLowerCase().includes(q) ||
        log.actor.toLowerCase().includes(q) ||
        log.entity.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        log.hash.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExportCSV = () => {
    const headers = ['Timestamp', 'Actor', 'ActorRole', 'Action', 'Category', 'Entity', 'Status', 'Details', 'Hash'];
    const rows = filteredLogs.map(l => [
      `"${l.timestamp}"`,
      `"${l.actor}"`,
      `"${l.actorRole}"`,
      `"${l.action}"`,
      `"${l.category}"`,
      `"${l.entity}"`,
      `"${l.status}"`,
      `"${l.details.replace(/"/g, '""')}"`,
      `"${l.hash}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `VaxChain_Audit_Ledger_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Protocol Header */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-[#142332] via-[#10202e] to-[#121c27] border border-[#1e3a52] shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#4caf50]" />
              Tamper-Evident Medical Audit Ledger
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#4caf50] text-[#0c141d] font-mono">
              CRYPTOGRAPHIC CHAIN
            </span>
          </div>
          <p className="text-xs text-[#90a4ae] mt-1">
            Immutable chain-of-custody tracking for AI advisory suggestions, medical director approvals, cold-chain sensor trips, and hospital physical handovers.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-lg text-xs font-bold bg-[#1e3a52] hover:bg-[#284966] text-[#81d4fa] flex items-center gap-2 border border-[#4fc3f7]/30 transition-colors cursor-pointer self-start md:self-auto"
        >
          <Download className="w-4 h-4" />
          Export Ledger (CSV)
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#78909c] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search audit records by actor, action, batch ID, or block hash..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#14202c] border border-[#1e3a52] rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-[#546e7a] focus:outline-none focus:border-[#4fc3f7]"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
          {['ALL', 'AI_DECISION', 'PROCUREMENT', 'COLD_CHAIN', 'TRANSIT', 'INVENTORY'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                filterCategory === cat
                  ? 'bg-[#1b2a3a] text-[#4fc3f7] border border-[#4fc3f7]/40'
                  : 'bg-[#14202c] text-[#90a4ae] border border-[#1e3a52] hover:text-white'
              }`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Ledger Table */}
      <div className="overflow-x-auto border border-[#1e3a52] rounded-xl bg-[#14202c] shadow-md">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#0f1923] text-[#78909c] font-mono text-[11px] uppercase border-b border-[#1e3a52]">
            <tr>
              <th className="p-3.5">Timestamp</th>
              <th className="p-3.5">Actor / System Node</th>
              <th className="p-3.5">Action Event</th>
              <th className="p-3.5">Target Entity</th>
              <th className="p-3.5">Verification</th>
              <th className="p-3.5">Ledger Hash</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e3a52]/60 bg-[#121c27]">
            {filteredLogs.map((log) => {
              const isAI = log.category === 'AI_DECISION' || log.actor.includes('AI');

              return (
                <tr key={log.id} className="hover:bg-[#162230]/70 transition-colors">
                  <td className="p-3.5 font-mono text-[#90a4ae] whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  
                  <td className="p-3.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${
                        isAI ? 'bg-[#4fc3f7]/20 text-[#4fc3f7]' : 'bg-[#4caf50]/20 text-[#4caf50]'
                      }`}>
                        {isAI ? <Cpu className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <span className="font-semibold text-white block">{log.actor}</span>
                        <span className="text-[10px] text-[#78909c] block">{log.actorRole}</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-[#1e3a52] text-[#81d4fa] border border-[#1e3a52]">
                      {log.action}
                    </span>
                    <p className="text-[11px] text-[#cfd8dc] mt-1 max-w-sm leading-relaxed">
                      {log.details}
                    </p>
                  </td>

                  <td className="p-3.5 font-medium text-white whitespace-nowrap">
                    {log.entity}
                  </td>

                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                      log.status === 'SUCCESS' || log.status === 'VERIFIED'
                        ? 'bg-[#4caf50]/20 text-[#4caf50] border border-[#4caf50]/40'
                        : log.status === 'CRITICAL'
                        ? 'bg-[#ef5350]/20 text-[#ef5350] border border-[#ef5350]/40'
                        : 'bg-[#ffa726]/20 text-[#ffa726] border border-[#ffa726]/40'
                    }`}>
                      ✓ {log.status}
                    </span>
                  </td>

                  <td className="p-3.5 font-mono text-[11px] text-[#4fc3f7] flex items-center gap-1">
                    <Hash className="w-3 h-3 text-[#78909c]" />
                    <span>{log.hash}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
