import React from 'react';
import { Vehicle } from '../types';
import { X, Truck, Thermometer, Navigation, ShieldCheck, Phone, CheckCircle2 } from 'lucide-react';

interface VehicleDetailModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
  onTriggerGreenWave: () => void;
}

export const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({
  vehicle,
  onClose,
  onTriggerGreenWave
}) => {
  if (!vehicle) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-[#162230] border border-[#1e3a52] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-[#1e3a52] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#0f1923] border border-[#4fc3f7] flex items-center justify-center text-[#4fc3f7]">
              <Truck size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-mono">{vehicle.plate}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#1b3a2a] text-[#4caf50] border border-[#4caf50]/40">
                  {vehicle.status}
                </span>
              </div>
              <p className="text-xs text-[#5a7a94]">{vehicle.type} • {vehicle.supplier}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-[#5a7a94] hover:text-white hover:bg-[#1a2d3e] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs sm:text-sm">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#0f1923] border border-[#1e3a52] rounded-xl p-3">
              <div className="text-[11px] text-[#5a7a94] uppercase tracking-wider mb-1 flex items-center gap-1">
                <Thermometer size={14} className="text-[#4caf50]" />
                Cold-Chain Temp
              </div>
              <div className="text-xl font-bold font-mono text-[#4caf50]">
                {vehicle.currentTemp}°C
              </div>
              <div className="text-[11px] text-[#7a8fa3] mt-0.5">
                Target: {vehicle.targetTemp}
              </div>
            </div>

            <div className="bg-[#0f1923] border border-[#1e3a52] rounded-xl p-3">
              <div className="text-[11px] text-[#5a7a94] uppercase tracking-wider mb-1 flex items-center gap-1">
                <Navigation size={14} className="text-[#4fc3f7]" />
                Speed & Transit
              </div>
              <div className="text-xl font-bold font-mono text-white">
                {vehicle.speedKmH} km/h
              </div>
              <div className="text-[11px] text-[#4fc3f7] mt-0.5">
                ETA: {vehicle.eta}
              </div>
            </div>
          </div>

          {/* Details list */}
          <div className="bg-[#0f1923] border border-[#1e3a52] rounded-xl p-3.5 space-y-2 font-mono text-xs">
            <div className="flex justify-between py-1 border-b border-[#1a2d3e]">
              <span className="text-[#5a7a94]">Driver / Lead:</span>
              <span className="text-white font-sans">{vehicle.driver}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#1a2d3e]">
              <span className="text-[#5a7a94]">Current Location:</span>
              <span className="text-[#4fc3f7] font-sans">{vehicle.locationName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#1a2d3e]">
              <span className="text-[#5a7a94]">Destination Hospital:</span>
              <span className="text-white font-sans font-semibold">{vehicle.destination}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#5a7a94]">Smart Corridor:</span>
              <span className="text-[#4caf50] font-sans font-semibold">Priority Clearance Active</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => { onTriggerGreenWave(); onClose(); }}
              className="flex-1 py-2 px-3 rounded-lg bg-[#1b3a2a] border border-[#4caf50] text-[#4caf50] hover:bg-[#4caf50] hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck size={16} />
              Open Ahead Green Signals
            </button>
            <button
              onClick={onClose}
              className="py-2 px-4 rounded-lg bg-[#0f1923] border border-[#1e3a52] text-[#c0d0e0] hover:text-white text-xs font-semibold cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
