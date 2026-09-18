import React, { useState } from 'react';
import { InventoryItem } from '../types';
import { 
  Package, 
  Search, 
  Filter, 
  AlertCircle, 
  Send, 
  Check, 
  Plus, 
  Clock, 
  RefreshCw 
} from 'lucide-react';

interface InventoryViewProps {
  inventory: InventoryItem[];
  onTriggerSignal: (id: string) => void;
  onOpenRestockModal: (initialHospital?: string) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  inventory,
  onTriggerSignal,
  onOpenRestockModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHospital, setSelectedHospital] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');

  // Stats
  const totalSkus = 156;
  const criticalCount = inventory.filter(i => i.status === 'CRITICAL').length;
  const lowCount = inventory.filter(i => i.status === 'LOW').length;
  const belowReorderCount = criticalCount + lowCount;
  const activeOrdersCount = 5;
  const expiringCount = 8;

  const hospitalsList = ['ALL', ...Array.from(new Set(inventory.map(i => i.hospital)))];
  const typesList = ['ALL', 'Vaccine', 'Medicine'];

  const filteredItems = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.batchNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesHospital = selectedHospital === 'ALL' || item.hospital === selectedHospital;
    const matchesType = selectedType === 'ALL' || item.type === selectedType;
    return matchesSearch && matchesHospital && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header with Title and Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
            <Package size={22} className="text-[#4fc3f7]" />
            Vaccine & Medicine Inventory — All Hospitals
          </h2>
          <p className="text-xs text-[#5a7a94] mt-1">
            Real-time stock level monitoring with automated reorder dispatch triggers
          </p>
        </div>
        <button
          onClick={() => onOpenRestockModal()}
          className="px-4 py-2 rounded-lg bg-[#4fc3f7] text-[#0f1923] font-bold text-xs hover:bg-[#38bdf8] transition-colors flex items-center gap-2 cursor-pointer shadow-md self-start sm:self-auto"
        >
          <Plus size={16} />
          Create Restock Request
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#162230] border border-[#1e3a52] rounded-xl p-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#5a7a94] mb-1">
            Total SKUs Tracked
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {totalSkus}
          </div>
          <div className="text-[11px] text-[#5a7a94] mt-1">Across 4 regional centers</div>
        </div>

        <div className="bg-[#162230] border border-[#ef5350]/60 rounded-xl p-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#ef5350] mb-1">
            Below Reorder Level
          </div>
          <div className="text-2xl font-bold font-mono text-[#ef5350]">
            {belowReorderCount}
          </div>
          <div className="text-[11px] text-[#ef5350]/80 mt-1">Critical replenishment needed</div>
        </div>

        <div className="bg-[#162230] border border-[#1e3a52] rounded-xl p-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#5a7a94] mb-1">
            Restock Orders Active
          </div>
          <div className="text-2xl font-bold font-mono text-[#ffa726]">
            {activeOrdersCount}
          </div>
          <div className="text-[11px] text-[#ffa726]/80 mt-1">Suppliers dispatched</div>
        </div>

        <div className="bg-[#162230] border border-[#1e3a52] rounded-xl p-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#5a7a94] mb-1">
            Expiring in 30 Days
          </div>
          <div className="text-2xl font-bold font-mono text-[#ffa726]">
            {expiringCount}
          </div>
          <div className="text-[11px] text-[#5a7a94] mt-1">Priority rotation tagged</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#162230] border border-[#1e3a52] rounded-xl p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5a7a94]" />
          <input
            type="text"
            placeholder="Search SKU name, batch number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#0f1923] border border-[#1e3a52] rounded-lg text-xs sm:text-sm text-white placeholder-[#5a7a94] focus:outline-none focus:border-[#4fc3f7] transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Hospital Filter */}
          <div className="flex items-center gap-1.5 bg-[#0f1923] border border-[#1e3a52] rounded-lg px-2.5 py-1.5">
            <span className="text-[11px] text-[#5a7a94] uppercase tracking-wider">Hospital:</span>
            <select
              value={selectedHospital}
              onChange={(e) => setSelectedHospital(e.target.value)}
              className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
            >
              {hospitalsList.map(h => (
                <option key={h} value={h} className="bg-[#162230] text-white">
                  {h}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1.5 bg-[#0f1923] border border-[#1e3a52] rounded-lg px-2.5 py-1.5">
            <span className="text-[11px] text-[#5a7a94] uppercase tracking-wider">Type:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
            >
              {typesList.map(t => (
                <option key={t} value={t} className="bg-[#162230] text-white">
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Inventory Table */}
      <div className="bg-[#162230] border border-[#1e3a52] rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[#1e3a52] bg-[#121c27] text-[#5a7a94] uppercase text-[11px] tracking-wider">
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Hospital</th>
                <th className="py-3 px-4 font-mono">In Stock</th>
                <th className="py-3 px-4 font-mono">Reorder Level</th>
                <th className="py-3 px-4">Stock Level</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Signal / Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a2d3e]">
              {filteredItems.map((item) => {
                const percentage = Math.min(100, Math.round((item.inStock / item.reorderLevel) * 100));
                
                let barClass = 'bg-gradient-to-r from-[#2e7d32] to-[#4caf50]';
                let statusBadge = (
                  <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1b3a2a] text-[#4caf50] border border-[#4caf50]/40">
                    OK
                  </span>
                );

                if (item.status === 'CRITICAL') {
                  barClass = 'bg-gradient-to-r from-[#c62828] to-[#ef5350]';
                  statusBadge = (
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#3a1b1b] text-[#ef5350] border border-[#ef5350]/40 animate-pulse">
                      CRITICAL
                    </span>
                  );
                } else if (item.status === 'LOW') {
                  barClass = 'bg-gradient-to-r from-[#e65100] to-[#ffa726]';
                  statusBadge = (
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#3a2e1b] text-[#ffa726] border border-[#ffa726]/40">
                      LOW
                    </span>
                  );
                }

                return (
                  <tr key={item.id} className="hover:bg-[#1a2d3e]/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{item.name}</div>
                      <div className="text-[11px] font-mono text-[#5a7a94]">Batch: {item.batchNumber}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                        item.type === 'Vaccine' 
                          ? 'bg-[#152230] text-[#4fc3f7] border border-[#4fc3f7]/30' 
                          : 'bg-[#1a2d3e] text-[#c0d0e0]'
                      }`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#c0d0e0]">
                      {item.hospital}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-white">
                      {item.inStock.toLocaleString()}{' '}
                      <span className="text-[10px] font-normal text-[#5a7a94]">{item.unit}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[#5a7a94]">
                      {item.reorderLevel.toLocaleString()}{' '}
                      <span className="text-[10px]">{item.unit}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-28 sm:w-36 bg-[#1a2d3e] rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${barClass}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="text-[10px] font-mono text-[#5a7a94] mt-1">
                        {percentage}% of baseline
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {statusBadge}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {item.signalStatus === 'SENT' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-[#ef5350]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ef5350] animate-ping" />
                          ⚡ SENT
                        </span>
                      ) : item.signalStatus === 'QUEUED' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-[#ffa726]">
                          ⏳ QUEUED
                        </span>
                      ) : item.status === 'CRITICAL' || item.status === 'LOW' ? (
                        <button
                          onClick={() => onTriggerSignal(item.id)}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#2a1215] text-[#ef5350] border border-[#ef5350]/60 hover:bg-[#ef5350] hover:text-white transition-all cursor-pointer"
                        >
                          Send Signal
                        </button>
                      ) : (
                        <span className="text-[#5a7a94] font-mono">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Auto Restock Alert Box */}
      <div className="p-4 rounded-xl bg-[#2a1215] border border-[#ef5350] text-xs sm:text-sm text-[#ef5350] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md shadow-[#ef5350]/10">
        <div className="flex items-start sm:items-center gap-3">
          <AlertCircle size={20} className="shrink-0 text-[#ef5350]" />
          <div>
            <strong>AUTO-RESTOCK DIRECTIVE:</strong> 3 items at City General have breached the critical 20% emergency reserve. Restock signals dispatched to MedPharma Corp and VaxSupply Ltd.
          </div>
        </div>
        <button
          onClick={() => onOpenRestockModal('City General Hospital')}
          className="px-3 py-1.5 rounded-lg bg-[#ef5350] text-white text-xs font-bold hover:bg-[#c62828] transition-colors shrink-0 cursor-pointer self-start sm:self-auto"
        >
          Review Dispatch Orders
        </button>
      </div>
    </div>
  );
};
