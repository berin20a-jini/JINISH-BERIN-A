import React, { useState } from 'react';
import { Hospital, InventoryItem, Supplier } from '../types';
import { X, Send, AlertTriangle, ShieldCheck, Truck } from 'lucide-react';

interface RestockModalProps {
  isOpen: boolean;
  onClose: () => void;
  hospitals: Hospital[];
  inventory: InventoryItem[];
  suppliers: Supplier[];
  initialHospital?: string;
  onConfirmRestock: (order: {
    hospital: string;
    item: string;
    quantity: number;
    supplier: string;
    priority: 'EMERGENCY' | 'HIGH' | 'NORMAL';
  }) => void;
}

export const RestockModal: React.FC<RestockModalProps> = ({
  isOpen,
  onClose,
  hospitals,
  inventory,
  suppliers,
  initialHospital,
  onConfirmRestock
}) => {
  const [selectedHospital, setSelectedHospital] = useState(initialHospital || hospitals[0]?.name || '');
  const [selectedItem, setSelectedItem] = useState(inventory[0]?.name || 'Covaxin');
  const [quantity, setQuantity] = useState(5000);
  const [selectedSupplier, setSelectedSupplier] = useState(suppliers[0]?.name || 'MedPharma Corp');
  const [priority, setPriority] = useState<'EMERGENCY' | 'HIGH' | 'NORMAL'>('EMERGENCY');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmRestock({
      hospital: selectedHospital,
      item: selectedItem,
      quantity,
      supplier: selectedSupplier,
      priority
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-[#162230] border border-[#1e3a52] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-[#1e3a52] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#3a1b1b] border border-[#ef5350] flex items-center justify-center text-[#ef5350]">
              <Truck size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Issue Emergency Restock Dispatch</h3>
              <p className="text-xs text-[#5a7a94]">VaxChain automated supplier signaling and route priority</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-[#5a7a94] hover:text-white hover:bg-[#1a2d3e] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Destination Hospital */}
          <div>
            <label className="block text-xs font-semibold text-[#7a8fa3] uppercase tracking-wider mb-1.5">
              Destination Hospital
            </label>
            <select
              value={selectedHospital}
              onChange={(e) => setSelectedHospital(e.target.value)}
              className="w-full bg-[#0f1923] border border-[#1e3a52] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#4fc3f7] cursor-pointer"
            >
              {hospitals.map(h => (
                <option key={h.id} value={h.name} className="bg-[#162230]">
                  {h.name} ({h.status} — {h.stockDaysLeft} days left)
                </option>
              ))}
            </select>
          </div>

          {/* Medical Item SKU */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#7a8fa3] uppercase tracking-wider mb-1.5">
                Target Vaccine / Medicine
              </label>
              <select
                value={selectedItem}
                onChange={(e) => setSelectedItem(e.target.value)}
                className="w-full bg-[#0f1923] border border-[#1e3a52] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#4fc3f7] cursor-pointer"
              >
                {inventory.map(item => (
                  <option key={item.id} value={item.name} className="bg-[#162230]">
                    {item.name} ({item.type})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#7a8fa3] uppercase tracking-wider mb-1.5">
                Quantity Units
              </label>
              <input
                type="number"
                min={100}
                max={50000}
                step={100}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                className="w-full bg-[#0f1923] border border-[#1e3a52] rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-[#4fc3f7]"
              />
            </div>
          </div>

          {/* Supplier and Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#7a8fa3] uppercase tracking-wider mb-1.5">
                Primary Supplier
              </label>
              <select
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)}
                className="w-full bg-[#0f1923] border border-[#1e3a52] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#4fc3f7] cursor-pointer"
              >
                {suppliers.map(s => (
                  <option key={s.id} value={s.name} className="bg-[#162230]">
                    {s.name} ({s.responseTimeMin}m response)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#7a8fa3] uppercase tracking-wider mb-1.5">
                Priority Directive
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full bg-[#0f1923] border border-[#1e3a52] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#4fc3f7] cursor-pointer"
              >
                <option value="EMERGENCY" className="bg-[#162230] text-[#ef5350]">EMERGENCY (Police Escort / Corridor)</option>
                <option value="HIGH" className="bg-[#162230] text-[#ffa726]">HIGH (Expedited Transit)</option>
                <option value="NORMAL" className="bg-[#162230] text-[#4caf50]">NORMAL (Scheduled Logistics)</option>
              </select>
            </div>
          </div>

          {/* Alert Preview */}
          <div className="p-3 rounded-lg bg-[#0f1923] border border-[#1e3a52] text-xs text-[#7a8fa3] flex items-center gap-2.5">
            <ShieldCheck size={18} className="text-[#4caf50] shrink-0" />
            <span>
              Order triggers automated EDI signal to supplier and prepares refrigerated vehicle with 2°C—8°C continuous IoT data logging.
            </span>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#0f1923] border border-[#1e3a52] text-[#c0d0e0] hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold rounded-lg bg-[#4fc3f7] text-[#0f1923] hover:bg-[#38bdf8] transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Send size={14} />
              Transmit Restock Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
