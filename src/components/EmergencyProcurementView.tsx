import React, { useState } from 'react';
import { RestockOrder, OrderStatus, Supplier, Hospital, InventoryItem, TabType } from '../types';
import { 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  Truck, 
  PackageCheck, 
  ArrowRight, 
  Plus, 
  Building2, 
  MapPin, 
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface EmergencyProcurementViewProps {
  orders: RestockOrder[];
  suppliers: Supplier[];
  hospitals: Hospital[];
  inventory: InventoryItem[];
  onAdvanceOrderStatus: (orderId: string) => void;
  onCompleteDelivery: (orderId: string) => void;
  onOpenRestockModal: () => void;
  onNavigateTab: (tab: TabType) => void;
}

export const EmergencyProcurementView: React.FC<EmergencyProcurementViewProps> = ({
  orders,
  suppliers,
  hospitals,
  inventory,
  onAdvanceOrderStatus,
  onCompleteDelivery,
  onOpenRestockModal,
  onNavigateTab
}) => {
  const [filterPriority, setFilterPriority] = useState<string>('ALL');

  const statusSteps: OrderStatus[] = ['QUEUED', 'CONFIRMED', 'LOADING', 'EN ROUTE', 'DELIVERED'];

  const filteredOrders = orders.filter(order => {
    if (filterPriority === 'ALL') return true;
    return order.priority === filterPriority;
  });

  const getStepIndex = (status: OrderStatus) => {
    return statusSteps.indexOf(status);
  };

  return (
    <div className="space-y-6">
      {/* Top Protocol Header */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-[#142332] via-[#10202e] to-[#121c27] border border-[#1e3a52] shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#ffa726]/10 border border-[#ffa726]/40 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(255,167,38,0.2)]">
              <ShieldAlert className="w-6 h-6 text-[#ffa726]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide">
                  Emergency Procurement &amp; Fulfillment Pipeline
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#ffa726] text-[#0c141d]">
                  STAGE TRACKER
                </span>
              </div>
              <p className="text-xs text-[#90a4ae] mt-1 max-w-2xl leading-relaxed">
                Automated contract binding with pre-approved medical suppliers. Tracks the end-to-end lifecycle 
                from algorithmic calculation to physical dock intake and verification.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenRestockModal}
              className="px-4 py-2.5 rounded-lg text-xs font-bold bg-[#4fc3f7] hover:bg-[#38b2ea] text-[#0c141d] flex items-center gap-2 shadow-[0_0_15px_rgba(79,195,247,0.25)] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Manual Emergency Order
            </button>
          </div>
        </div>

        {/* 8-Stage Visual Lifecycle Banner */}
        <div className="mt-6 pt-5 border-t border-[#1e3a52]/60">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#4fc3f7] block mb-3">
            Autonomous Procurement Execution Pipeline:
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-center">
            {[
              { step: '1', title: 'Shortage Detected', status: 'done' },
              { step: '2', title: 'AI Calculates Qty', status: 'done' },
              { step: '3', title: 'Supplier Rec', status: 'done' },
              { step: '4', title: 'Human Approval', status: 'active' },
              { step: '5', title: 'Order Created', status: 'active' },
              { step: '6', title: 'Supplier Confirms', status: 'pending' },
              { step: '7', title: 'Transport Assigned', status: 'pending' },
              { step: '8', title: 'Dock Delivery', status: 'pending' },
            ].map((s, idx) => (
              <div 
                key={idx}
                className="p-2 rounded-lg bg-[#0f1923] border border-[#1e3a52] flex flex-col items-center justify-center relative"
              >
                <div className="w-5 h-5 rounded-full bg-[#1e3a52] text-[10px] font-bold font-mono text-[#4fc3f7] flex items-center justify-center mb-1">
                  {s.step}
                </div>
                <span className="text-[10px] font-medium text-white leading-tight">{s.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {['ALL', 'EMERGENCY', 'HIGH', 'NORMAL'].map((p) => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                filterPriority === p
                  ? 'bg-[#1b2a3a] text-[#4fc3f7] border border-[#4fc3f7]/40'
                  : 'bg-[#14202c] text-[#90a4ae] border border-[#1e3a52] hover:text-white'
              }`}
            >
              {p} ORDERS
            </button>
          ))}
        </div>

        <span className="text-xs text-[#90a4ae] font-mono">
          Showing {filteredOrders.length} of {orders.length} active requisitions
        </span>
      </div>

      {/* Orders List with Real Interactive Action Buttons */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const stepIndex = getStepIndex(order.status);
          const isDelivered = order.status === 'DELIVERED';
          const isEnRoute = order.status === 'EN ROUTE';

          return (
            <div 
              key={order.id}
              className="p-5 rounded-xl bg-[#14202c] border border-[#1e3a52] shadow-md space-y-4 hover:border-[#4fc3f7]/40 transition-colors"
            >
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 text-[11px] font-black font-mono uppercase rounded-md tracking-wider ${
                    order.priority === 'EMERGENCY'
                      ? 'bg-[#ef5350]/20 text-[#ef5350] border border-[#ef5350]/50'
                      : 'bg-[#ffa726]/20 text-[#ffa726] border border-[#ffa726]/50'
                  }`}>
                    {order.priority}
                  </span>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-white tracking-wide">
                        {order.items}
                      </h4>
                      {order.aiSuggested && (
                        <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-[#4fc3f7]/20 text-[#4fc3f7] border border-[#4fc3f7]/40 flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" /> AI RECOMMENDED
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#90a4ae] font-mono mt-0.5">
                      Order ID: <span className="text-white">{order.id}</span> · Initiated: {order.timestamp}
                    </p>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-[#90a4ae] font-mono uppercase block">Delivery Target</span>
                    <span className="text-xs font-bold text-white">{order.eta}</span>
                  </div>
                  <div className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono uppercase tracking-wider ${
                    isDelivered 
                      ? 'bg-[#4caf50]/20 text-[#4caf50] border border-[#4caf50]/50'
                      : isEnRoute
                      ? 'bg-[#4fc3f7]/20 text-[#4fc3f7] border border-[#4fc3f7]/50'
                      : 'bg-[#ffa726]/20 text-[#ffa726] border border-[#ffa726]/50'
                  }`}>
                    {order.status}
                  </div>
                </div>
              </div>

              {/* Step Progress Bar */}
              <div className="p-3.5 rounded-lg bg-[#0f1923] border border-[#1e3a52]">
                <div className="grid grid-cols-5 gap-2">
                  {statusSteps.map((s, idx) => {
                    const isCompleted = idx <= stepIndex;
                    const isCurrent = idx === stepIndex;

                    return (
                      <div key={s} className="space-y-1.5">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-3 h-3 rounded-full flex items-center justify-center text-[8px] font-bold ${
                            isCurrent
                              ? 'bg-[#4fc3f7] text-[#0f1923] ring-2 ring-[#4fc3f7]/30 animate-pulse'
                              : isCompleted
                              ? 'bg-[#4caf50] text-[#0f1923]'
                              : 'bg-[#1e3a52] text-[#90a4ae]'
                          }`}>
                            {isCompleted ? '✓' : idx + 1}
                          </div>
                          <span className={`text-[10px] font-mono uppercase truncate ${
                            isCurrent ? 'text-[#4fc3f7] font-bold' : isCompleted ? 'text-white' : 'text-[#78909c]'
                          }`}>
                            {s}
                          </span>
                        </div>
                        <div className={`h-1.5 rounded-full ${
                          isCompleted ? 'bg-[#4fc3f7]' : 'bg-[#1e3a52]'
                        }`} />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Route & Transport Card Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[#0f1923]/70 border border-[#1e3a52] flex items-center gap-2.5">
                  <Building2 className="w-4 h-4 text-[#4fc3f7] shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] text-[#90a4ae] block">Distributor Origin:</span>
                    <span className="font-semibold text-white truncate block">{order.supplier}</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#0f1923]/70 border border-[#1e3a52] flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-[#ef5350] shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] text-[#90a4ae] block">Hospital Destination:</span>
                    <span className="font-semibold text-white truncate block">{order.destination}</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#0f1923]/70 border border-[#1e3a52] flex items-center gap-2.5">
                  <Truck className="w-4 h-4 text-[#ffa726] shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] text-[#90a4ae] block">Assigned Transport:</span>
                    <span className="font-semibold text-white truncate block">
                      {order.vehicleId ? `${order.vehicleId} (Refrigerated)` : 'Dock Allocation Pending'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons for Prototype Progression */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#1e3a52]/60">
                <div className="text-xs text-[#90a4ae]">
                  {isDelivered ? (
                    <span className="text-[#4caf50] font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Received &amp; Stock Added to Hospital Inventory
                    </span>
                  ) : (
                    <span>Click action button to simulate lifecycle progression:</span>
                  )}
                </div>

                <div className="flex items-center gap-2.5">
                  {order.vehicleId && (
                    <button
                      onClick={() => onNavigateTab('transport')}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#1e3a52] text-[#81d4fa] hover:bg-[#254663] transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      Track Vehicle GPS
                    </button>
                  )}

                  {!isDelivered && (
                    <>
                      {isEnRoute ? (
                        <button
                          onClick={() => onCompleteDelivery(order.id)}
                          className="px-4 py-2 rounded-lg text-xs font-bold bg-[#4caf50] hover:bg-[#43a047] text-[#0c141d] flex items-center gap-2 shadow-[0_0_15px_rgba(76,175,80,0.3)] transition-all cursor-pointer"
                        >
                          <PackageCheck className="w-4 h-4" />
                          Complete Delivery &amp; Restock
                        </button>
                      ) : (
                        <button
                          onClick={() => onAdvanceOrderStatus(order.id)}
                          className="px-4 py-2 rounded-lg text-xs font-bold bg-[#4fc3f7] hover:bg-[#38b2ea] text-[#0c141d] flex items-center gap-2 shadow-[0_0_12px_rgba(79,195,247,0.2)] transition-all cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          Advance to Next Status ({statusSteps[stepIndex + 1]})
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
