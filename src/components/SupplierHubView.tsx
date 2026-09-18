import React, { useState } from 'react';
import { Supplier, RestockOrder } from '../types';
import { 
  Building2, 
  Send, 
  CheckCircle2, 
  Clock, 
  Truck, 
  ShieldCheck, 
  Phone, 
  AlertTriangle,
  Radio,
  ExternalLink
} from 'lucide-react';

interface SupplierHubViewProps {
  suppliers: Supplier[];
  orders: RestockOrder[];
  onBroadcastAlert: () => void;
  onTrackVehicle: (vehicleId: string) => void;
  onOpenRestockModal: () => void;
}

export const SupplierHubView: React.FC<SupplierHubViewProps> = ({
  suppliers,
  orders,
  onBroadcastAlert,
  onTrackVehicle,
  onOpenRestockModal
}) => {
  const [broadcasted, setBroadcasted] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  const handleBroadcast = () => {
    onBroadcastAlert();
    setBroadcasted(true);
    setTimeout(() => setBroadcasted(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 size={22} className="text-[#4fc3f7]" />
            Supplier Management Hub
          </h2>
          <p className="text-xs text-[#5a7a94] mt-1">
            Direct telemetry link, electronic dispatch orders, and priority escalation to pharmaceutical distributors
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenRestockModal}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#1b2a3a] text-[#4fc3f7] border border-[#1e3a52] hover:border-[#4fc3f7] transition-all cursor-pointer"
          >
            + New Restock Order
          </button>
          <button
            onClick={handleBroadcast}
            className="px-3.5 py-2 text-xs font-bold rounded-lg bg-[#ef5350] text-white hover:bg-[#c62828] transition-all flex items-center gap-1.5 shadow-md shadow-[#ef5350]/20 cursor-pointer"
          >
            <Radio size={15} />
            {broadcasted ? 'Alert Re-broadcasted!' : 'Re-broadcast Alert'}
          </button>
        </div>
      </div>

      {/* Pandemic Alert Broadcast Box */}
      <div className="bg-[#162230] border border-[#ef5350] rounded-xl p-5 shadow-lg shadow-[#ef5350]/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-3.5 h-3.5 rounded-full bg-[#ef5350] shadow-[0_0_10px_#ef5350] animate-ping" />
            <div>
              <div className="font-bold text-sm text-[#ef5350] flex items-center gap-2">
                <span>Pandemic Alert Broadcast to All Suppliers</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#ef5350]/20 text-[#ef5350] font-mono">EMERGENCY PROTOCOL</span>
              </div>
              <div className="text-xs text-[#7a8fa3] mt-0.5">
                Sent: 16 Sep 2026, 14:30 IST • Priority: EMERGENCY • Demand Multiplier: 3.2x
              </div>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#3a1b1b] text-[#ef5350] border border-[#ef5350]/60 self-start sm:self-auto font-mono">
            3 SUPPLIERS LINKED
          </span>
        </div>

        {/* Monospace telemetry payload */}
        <div className="bg-[#0f1923] border border-[#1e3a52] rounded-lg p-3.5 font-mono text-xs text-[#c0d0e0] leading-relaxed overflow-x-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
            <div><span className="text-[#5a7a94]">ALERT_TYPE:</span> <span className="text-[#ef5350] font-bold">PANDEMIC_SURGE</span></div>
            <div><span className="text-[#5a7a94]">REQUIRED_DELIVERY:</span> <span className="text-[#ffa726] font-bold">WITHIN 6 HOURS</span></div>
            <div><span className="text-[#5a7a94]">PATIENT_COUNT_24H:</span> <span className="text-white">12,847</span></div>
            <div><span className="text-[#5a7a94]">COLD_CHAIN_REQUIRED:</span> <span className="text-[#4fc3f7] font-bold">YES (2°C — 8°C & -70°C)</span></div>
            <div><span className="text-[#5a7a94]">BASELINE_NORMAL:</span> <span className="text-[#7a8fa3]">7,000</span></div>
            <div><span className="text-[#5a7a94]">GPS_CORRIDOR_SYNC:</span> <span className="text-[#4caf50]">ENABLED (AUTO TRAFFIC CLEAR)</span></div>
            <div><span className="text-[#5a7a94]">SURGE_FACTOR:</span> <span className="text-[#ef5350] font-bold">1.84x CRITICAL</span></div>
            <div><span className="text-[#5a7a94]">PRIORITY_ITEMS:</span> <span className="text-white">Covaxin, Paracetamol, Dexamethasone, Remdesivir</span></div>
          </div>
        </div>
      </div>

      {/* Supplier Profile Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {suppliers.map(sup => (
          <div 
            key={sup.id}
            className="bg-[#162230] border border-[#1e3a52] rounded-xl p-5 flex flex-col justify-between hover:border-[#4fc3f7]/50 transition-all shadow-md group"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <h3 className="font-bold text-base text-white group-hover:text-[#4fc3f7] transition-colors">
                    {sup.name}
                  </h3>
                  <div className="text-xs text-[#5a7a94] mt-0.5">{sup.role}</div>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  sup.status === 'ACTIVE' 
                    ? 'bg-[#1b3a2a] text-[#4caf50] border border-[#4caf50]/40'
                    : sup.status === 'PREPARING'
                    ? 'bg-[#3a2e1b] text-[#ffa726] border border-[#ffa726]/40'
                    : 'bg-[#1b2a3a] text-[#4fc3f7] border border-[#4fc3f7]/40'
                }`}>
                  {sup.status}
                </span>
              </div>

              {/* Data Table within card */}
              <div className="space-y-2 text-xs border-t border-[#1e3a52] pt-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-[#5a7a94]">Response Time</span>
                  <span className="font-mono font-bold text-[#4caf50]">{sup.responseTimeMin} min</span>
                </div>
                <div className="flex justify-between items-start gap-2">
                  <span className="text-[#5a7a94] shrink-0">Order Accepted</span>
                  <span className="font-mono text-right text-white text-[11px]">{sup.orderAccepted}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#5a7a94]">Next ETA</span>
                  <span className="font-mono font-bold text-[#4fc3f7]">{sup.eta}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#5a7a94]">Vehicle Assigned</span>
                  <button 
                    onClick={() => onTrackVehicle(sup.assignedVehicle)}
                    className="font-mono font-semibold text-[#4fc3f7] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {sup.assignedVehicle}
                    <ExternalLink size={12} />
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#5a7a94]">Reliability Score</span>
                  <span className="font-mono font-bold text-[#4caf50]">{sup.reliabilityScore}%</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 pt-2 border-t border-[#1a2d3e]">
              <button
                onClick={() => onTrackVehicle(sup.assignedVehicle)}
                className="flex-1 py-1.5 px-2 rounded-lg bg-[#0f1923] border border-[#1e3a52] text-xs font-semibold text-[#c0d0e0] hover:text-[#4fc3f7] hover:border-[#4fc3f7] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Truck size={14} />
                Track Convoy
              </button>
              <a
                href={`tel:${sup.phone}`}
                className="py-1.5 px-3 rounded-lg bg-[#1a2d3e] border border-[#1e3a52] text-xs text-[#5a7a94] hover:text-white transition-all flex items-center justify-center cursor-pointer"
                title={`Call ${sup.contactPerson} (${sup.phone})`}
              >
                <Phone size={14} />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Active Restock Orders Table */}
      <section className="bg-[#162230] border border-[#1e3a52] rounded-xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-[#4fc3f7]" />
            <h2 className="text-base font-bold text-[#c0d8ee]">Active Restock Orders</h2>
          </div>
          <span className="text-xs text-[#5a7a94]">
            Real-time batch manifests and GPS dispatch statuses
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[#1e3a52] bg-[#121c27] text-[#5a7a94] uppercase text-[11px] tracking-wider">
                <th className="py-3 px-3">Order ID</th>
                <th className="py-3 px-3">Supplier</th>
                <th className="py-3 px-3">Items</th>
                <th className="py-3 px-3">Destination</th>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 font-mono">ETA</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a2d3e]">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-[#1a2d3e]/60 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-[#4fc3f7]">
                    {ord.id}
                  </td>
                  <td className="py-3 px-3 font-medium text-white">
                    {ord.supplier}
                  </td>
                  <td className="py-3 px-3 text-[#c0d0e0]">
                    {ord.items}
                  </td>
                  <td className="py-3 px-3 text-[#c0d0e0]">
                    {ord.destination}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      ord.priority === 'EMERGENCY'
                        ? 'bg-[#3a1b1b] text-[#ef5350] border border-[#ef5350]/40'
                        : 'bg-[#3a2e1b] text-[#ffa726] border border-[#ffa726]/40'
                    }`}>
                      {ord.priority}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`font-semibold flex items-center gap-1.5 ${
                      ord.status === 'En Route'
                        ? 'text-[#4caf50]'
                        : ord.status === 'Loading'
                        ? 'text-[#ffa726]'
                        : 'text-[#5a7a94]'
                    }`}>
                      {ord.status === 'En Route' && <span className="w-1.5 h-1.5 rounded-full bg-[#4caf50] animate-ping" />}
                      {ord.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-white">
                    {ord.eta}
                  </td>
                  <td className="py-3 px-3 text-right">
                    {ord.vehicleId ? (
                      <button
                        onClick={() => onTrackVehicle(ord.vehicleId!)}
                        className="px-2.5 py-1 text-xs font-semibold rounded bg-[#1b2a3a] text-[#4fc3f7] border border-[#1e3a52] hover:border-[#4fc3f7] transition-all cursor-pointer"
                      >
                        Track GPS →
                      </button>
                    ) : (
                      <span className="text-[#5a7a94] text-xs font-mono">Assigning...</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
