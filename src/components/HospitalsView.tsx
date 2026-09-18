import React, { useState } from 'react';
import { Hospital, InventoryItem, TabType } from '../types';
import { 
  Hospital as HospitalIcon, 
  MapPin, 
  Users, 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  Phone, 
  ShieldCheck, 
  Plus, 
  ChevronRight,
  Activity,
  BedDouble
} from 'lucide-react';

interface HospitalsViewProps {
  hospitals: Hospital[];
  inventory: InventoryItem[];
  onRequestRestock: (hospitalName: string) => void;
  onNavigateTab: (tab: TabType) => void;
}

export const HospitalsView: React.FC<HospitalsViewProps> = ({
  hospitals,
  inventory,
  onRequestRestock,
  onNavigateTab
}) => {
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>(hospitals[0]?.id || 'hosp-1');

  const selectedHospital = hospitals.find(h => h.id === selectedHospitalId) || hospitals[0];
  const hospitalInventory = inventory.filter(i => i.hospital === selectedHospital?.name);

  const totalVaccines = hospitalInventory
    .filter(i => i.type === 'Vaccine')
    .reduce((acc, curr) => acc + curr.inStock, 0);

  const criticalItems = hospitalInventory.filter(i => i.status === 'CRITICAL').length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-[#142332] via-[#10202e] to-[#121c27] border border-[#1e3a52] shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
              <HospitalIcon className="w-5 h-5 text-[#4fc3f7]" />
              Hospital Network &amp; Demand Monitor
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#4fc3f7] text-[#0c141d] font-mono">
              {hospitals.length} FACILITIES ONLINE
            </span>
          </div>
          <p className="text-xs text-[#90a4ae] mt-1">
            Real-time patient intake velocity, clinical triage occupancy, and localized vaccine buffer reserves.
          </p>
        </div>

        <button
          onClick={() => onRequestRestock(selectedHospital.name)}
          className="px-4 py-2.5 rounded-lg text-xs font-bold bg-[#4fc3f7] hover:bg-[#38b2ea] text-[#0c141d] flex items-center gap-2 shadow-[0_0_15px_rgba(79,195,247,0.25)] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Request Emergency Restock
        </button>
      </div>

      {/* Grid of Hospital Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {hospitals.map((hosp) => {
          const isSelected = hosp.id === selectedHospitalId;
          const isCritical = hosp.status === 'CRITICAL';
          const isHigh = hosp.status === 'HIGH';

          return (
            <div
              key={hosp.id}
              onClick={() => setSelectedHospitalId(hosp.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'bg-[#1b2a3a] border-2 border-[#4fc3f7] shadow-[0_4px_20px_rgba(79,195,247,0.15)]'
                  : 'bg-[#14202c] border-[#1e3a52] hover:border-[#4fc3f7]/50'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-xs font-bold text-white truncate max-w-[150px]">
                    {hosp.name}
                  </h3>
                  <p className="text-[10px] text-[#78909c] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-2.5 h-2.5 shrink-0" />
                    <span className="truncate">{hosp.location}</span>
                  </p>
                </div>

                <span className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded ${
                  isCritical 
                    ? 'bg-[#ef5350]/20 text-[#ef5350] border border-[#ef5350]/50 animate-pulse' 
                    : isHigh
                    ? 'bg-[#ffa726]/20 text-[#ffa726] border border-[#ffa726]/50'
                    : 'bg-[#4caf50]/20 text-[#4caf50] border border-[#4caf50]/50'
                }`}>
                  {hosp.status}
                </span>
              </div>

              {/* Patient Demand Surge */}
              <div className="mt-3 p-2.5 rounded-lg bg-[#0f1923] border border-[#1e3a52]">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="text-[10px] text-[#90a4ae] font-mono">24h Patients:</span>
                  <span className="font-bold text-white">{hosp.patients24h.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-baseline text-[11px] mt-1">
                  <span className="text-[10px] text-[#90a4ae]">Surge Delta:</span>
                  <span className={`font-bold font-mono ${hosp.surgePct > 50 ? 'text-[#ef5350]' : 'text-[#ffa726]'}`}>
                    +{hosp.surgePct}%
                  </span>
                </div>
              </div>

              {/* Stock Days Indicator */}
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-[#90a4ae] text-[11px]">Buffer Reserve:</span>
                <span className={`font-mono font-bold ${
                  hosp.stockDaysLeft < 2 ? 'text-[#ef5350]' : hosp.stockDaysLeft < 4 ? 'text-[#ffa726]' : 'text-[#4caf50]'
                }`}>
                  {hosp.stockDaysLeft} Days
                </span>
              </div>

              {/* Active Orders */}
              {hosp.activeOrders > 0 && (
                <div className="mt-2 text-[10px] text-[#4fc3f7] font-semibold flex items-center gap-1">
                  <span>⚡ {hosp.activeOrders} active convoy{hosp.activeOrders > 1 ? 's' : ''} inbound</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Hospital Deep-Dive Panel */}
      {selectedHospital && (
        <div className="p-6 rounded-xl bg-[#14202c] border border-[#1e3a52] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1e3a52]">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  {selectedHospital.name} · Clinical Triage Profile
                </h3>
                <span className="text-xs px-2 py-0.5 rounded bg-[#1e3a52] text-[#81d4fa] font-mono">
                  {selectedHospital.location}
                </span>
              </div>
              <p className="text-xs text-[#90a4ae] mt-1 flex items-center gap-3">
                <span>Director: {selectedHospital.primaryContact}</span>
                <span>•</span>
                <span>Last Telemetry: {selectedHospital.lastUpdated}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onRequestRestock(selectedHospital.name)}
                className="px-3.5 py-2 rounded-lg text-xs font-bold bg-[#ef5350] hover:bg-[#d32f2f] text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Dispatch Emergency Order
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-[#0f1923] border border-[#1e3a52]">
              <span className="text-[10px] text-[#90a4ae] uppercase font-mono">Triage Bed Occupancy</span>
              <p className="text-lg font-bold text-white mt-0.5">{selectedHospital.bedOccupancyPct}%</p>
              <div className="w-full h-1.5 bg-[#1e3a52] rounded-full mt-1 overflow-hidden">
                <div 
                  className={`h-full ${selectedHospital.bedOccupancyPct > 90 ? 'bg-[#ef5350]' : 'bg-[#4fc3f7]'}`} 
                  style={{ width: `${selectedHospital.bedOccupancyPct}%` }}
                />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#0f1923] border border-[#1e3a52]">
              <span className="text-[10px] text-[#90a4ae] uppercase font-mono">ICU Beds Available</span>
              <p className="text-lg font-bold text-[#ffa726] mt-0.5">{selectedHospital.icuAvailable} Beds</p>
              <span className="text-[10px] text-[#90a4ae]">Ventilators synced</span>
            </div>

            <div className="p-3 rounded-lg bg-[#0f1923] border border-[#1e3a52]">
              <span className="text-[10px] text-[#90a4ae] uppercase font-mono">Vaccine Stock Stored</span>
              <p className="text-lg font-bold text-[#4fc3f7] mt-0.5">{totalVaccines.toLocaleString()} doses</p>
              <span className="text-[10px] text-[#4caf50]">Cold chain active</span>
            </div>

            <div className="p-3 rounded-lg bg-[#0f1923] border border-[#1e3a52]">
              <span className="text-[10px] text-[#90a4ae] uppercase font-mono">Critical Shortage Items</span>
              <p className={`text-lg font-bold mt-0.5 ${criticalItems > 0 ? 'text-[#ef5350]' : 'text-[#4caf50]'}`}>
                {criticalItems} SKUs
              </p>
              <span className="text-[10px] text-[#90a4ae]">Below reorder level</span>
            </div>
          </div>

          {/* Hospital Specific Inventory Table */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center justify-between">
              <span>On-Site Formulary &amp; Cold Storage Inventory</span>
              <span className="text-[11px] text-[#90a4ae] font-mono">{hospitalInventory.length} Managed Items</span>
            </h4>

            <div className="overflow-x-auto border border-[#1e3a52] rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0f1923] text-[#78909c] font-mono text-[11px] uppercase border-b border-[#1e3a52]">
                  <tr>
                    <th className="p-3">Medicine / Vaccine</th>
                    <th className="p-3">Batch ID</th>
                    <th className="p-3">In Stock</th>
                    <th className="p-3">Daily Burn</th>
                    <th className="p-3">Est. Depletion</th>
                    <th className="p-3">FEFO Expiry</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e3a52]/60 bg-[#121c27]">
                  {hospitalInventory.map((item) => (
                    <tr key={item.id} className="hover:bg-[#162230]/70 transition-colors">
                      <td className="p-3 font-semibold text-white">
                        {item.name}
                        <span className="block text-[10px] text-[#78909c] font-normal">{item.type}</span>
                      </td>
                      <td className="p-3 font-mono text-[#4fc3f7]">{item.batchNumber}</td>
                      <td className="p-3 font-bold text-white">{item.inStock.toLocaleString()} {item.unit}</td>
                      <td className="p-3 text-[#90a4ae]">{item.dailyUsage} {item.unit}/day</td>
                      <td className="p-3 font-mono text-[#ffa726]">{item.predictedDepletionDays} days</td>
                      <td className="p-3 text-[#b0bec5]">
                        {item.expiryDate}
                        <span className="block text-[10px] text-[#78909c] font-mono">({item.expiryDays}d remaining)</span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                          item.status === 'CRITICAL'
                            ? 'bg-[#ef5350]/20 text-[#ef5350] border border-[#ef5350]/40'
                            : item.status === 'LOW'
                            ? 'bg-[#ffa726]/20 text-[#ffa726] border border-[#ffa726]/40'
                            : 'bg-[#4caf50]/20 text-[#4caf50] border border-[#4caf50]/40'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
