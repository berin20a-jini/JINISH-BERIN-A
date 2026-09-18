import React, { useState } from 'react';
import { TrafficSignal, Vehicle } from '../types';
import { 
  Truck, 
  MapPin, 
  Radio, 
  ShieldCheck, 
  AlertCircle, 
  Zap, 
  Navigation, 
  Route, 
  Check, 
  Clock, 
  Flame,
  CornerDownRight
} from 'lucide-react';

interface TransportViewProps {
  signals: TrafficSignal[];
  vehicles: Vehicle[];
  selectedVehicleId: string | null;
  onSelectVehicle: (id: string | null) => void;
  onToggleSignal: (signalId: string) => void;
  onActivateGreenCorridorAll: () => void;
}

export const TransportView: React.FC<TransportViewProps> = ({
  signals,
  vehicles,
  selectedVehicleId,
  onSelectVehicle,
  onToggleSignal,
  onActivateGreenCorridorAll
}) => {
  const [alternateRouteApplied, setAlternateRouteApplied] = useState(false);
  const activeVehicle = vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];

  const handleApplyRoute = () => {
    setAlternateRouteApplied(true);
    onActivateGreenCorridorAll();
  };

  return (
    <div className="space-y-6">
      {/* Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Truck size={22} className="text-[#4fc3f7]" />
            GPS Tracking & Traffic Management
          </h2>
          <p className="text-xs text-[#5a7a94] mt-1">
            Real-time cold-chain vehicle telemetry with automated smart traffic signal override (Green Corridors)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onActivateGreenCorridorAll}
            className="px-3.5 py-2 text-xs font-bold rounded-lg bg-[#1b3a2a] text-[#4caf50] border border-[#4caf50]/60 hover:bg-[#4caf50] hover:text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Zap size={14} />
            Authorize Full Green Corridor
          </button>
        </div>
      </div>

      {/* Interactive Map Visualizer */}
      <div className="bg-[#0d1820] border border-[#1e3a52] rounded-xl p-5 relative overflow-hidden min-h-[340px] shadow-2xl">
        {/* Radar Map Grid Background */}
        <div className="absolute inset-0 map-grid-bg opacity-30 pointer-events-none" />

        {/* Top Control Overlay */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2 bg-[#162230]/90 backdrop-blur px-3 py-1.5 rounded-lg border border-[#1e3a52] text-xs">
            <span className="w-2 h-2 rounded-full bg-[#4fc3f7] animate-ping" />
            <span className="font-mono text-[#c0d0e0]">Active GPS Transponders: 3/3 Live</span>
            <span className="text-[#5a7a94]">•</span>
            <span className="text-[#4caf50] font-semibold">Corridor TS-4421: OPEN</span>
          </div>

          <div className="flex items-center gap-2">
            {alternateRouteApplied ? (
              <span className="text-xs font-mono px-3 py-1 rounded bg-[#1b3a2a] text-[#4caf50] border border-[#4caf50]/40 flex items-center gap-1">
                <Check size={13} />
                OMR Bypass Active (-12 min)
              </span>
            ) : (
              <button
                onClick={handleApplyRoute}
                className="text-xs font-semibold px-3 py-1 rounded bg-[#3a2e1b] text-[#ffa726] border border-[#ffa726]/40 hover:bg-[#ffa726]/20 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <CornerDownRight size={13} />
                Reroute via OMR
              </button>
            )}
          </div>
        </div>

        {/* Map Elements Canvas Area */}
        <div className="relative w-full h-[240px] sm:h-[260px] my-2">
          {/* Node 1: MedPharma Warehouse */}
          <div className="absolute left-[6%] top-[32%] z-10">
            <div className="w-4 h-4 rounded-full bg-[#4caf50] border-2 border-white shadow-[0_0_12px_#4caf50]" />
            <div className="mt-1 -ml-6 px-2.5 py-1 rounded bg-[#162230] border border-[#1e3a52] text-[10px] font-bold text-white whitespace-nowrap shadow">
              🏭 MedPharma Mumbai Hub
            </div>
          </div>

          {/* Route Segment 1: Origin to Vehicle */}
          <div className="absolute left-[9%] top-[36%] w-[26%] h-[3px] bg-gradient-to-r from-[#4caf50] to-[#4fc3f7] rounded-full" />

          {/* Vehicle 1 (TN-01-AB-1234) on Route */}
          <div 
            onClick={() => onSelectVehicle('veh-1')}
            className="absolute left-[33%] top-[28%] z-20 cursor-pointer group"
          >
            <div className="w-5 h-5 rounded-full bg-[#4fc3f7] border-2 border-white shadow-[0_0_16px_#4fc3f7] animate-pulse" />
            <div className="mt-1 -ml-12 px-3 py-1.5 rounded-lg bg-[#162230] border border-[#4fc3f7] text-[11px] font-semibold text-white whitespace-nowrap shadow-lg group-hover:scale-105 transition-transform">
              <div className="flex items-center gap-1.5">
                <Truck size={12} className="text-[#4fc3f7]" />
                <span>TN-01-AB-1234</span>
              </div>
              <div className="text-[10px] text-[#4caf50] font-mono">
                {alternateRouteApplied ? '54 km/h · OMR Bypass' : '42 km/h · Approaching NH-48'}
              </div>
            </div>
          </div>

          {/* Route Segment 2: Vehicle to Congestion / Signal */}
          <div className="absolute left-[37%] top-[36%] w-[16%] h-[3px] bg-gradient-to-r from-[#4fc3f7] to-[#ef5350] rounded-full" />

          {/* Traffic Hazard Node: NH-48 Junction */}
          <div className="absolute left-[52%] top-[24%] z-10">
            <div className="px-2.5 py-1 rounded bg-[#3a1b1b] border border-[#ef5350] text-[10px] font-bold text-[#ef5350] shadow-md flex items-center gap-1">
              <span>🚦</span>
              <span>{alternateRouteApplied ? 'TRAFFIC CLEARED (BYPASS)' : 'TRAFFIC — NH-48 Jn'}</span>
            </div>
          </div>

          {/* Route Segment 3: Traffic to Hospital */}
          <div className="absolute left-[56%] top-[36%] w-[20%] h-[3px] bg-gradient-to-r from-[#ef5350] to-[#4caf50] rounded-full" />

          {/* Destination: City General Hospital */}
          <div className="absolute left-[77%] top-[30%] z-10">
            <div className="w-4 h-4 rounded-full bg-[#ef5350] border-2 border-white shadow-[0_0_12px_#ef5350]" />
            <div className="mt-1 -ml-10 px-2.5 py-1 rounded bg-[#162230] border border-[#ef5350]/60 text-[10px] font-bold text-white whitespace-nowrap shadow">
              🏥 City General Hospital
            </div>
          </div>

          {/* Route 2: VaxSupply Depot to Loading Bay */}
          <div className="absolute left-[10%] top-[70%] z-10">
            <div className="w-3.5 h-3.5 rounded-full bg-[#ffa726] border-2 border-white shadow-[0_0_8px_#ffa726]" />
            <div className="mt-1 -ml-4 px-2 py-0.5 rounded bg-[#162230] border border-[#1e3a52] text-[9px] font-bold text-[#ffa726] whitespace-nowrap shadow">
              🏭 VaxSupply Depot
            </div>
          </div>

          <div className="absolute left-[14%] top-[73%] w-[18%] h-[2px] bg-[#ffa726] opacity-70" />

          {/* Vehicle 2 (TN-02-CD-5678) Loading */}
          <div 
            onClick={() => onSelectVehicle('veh-2')}
            className="absolute left-[31%] top-[68%] z-15 cursor-pointer group"
          >
            <div className="w-3.5 h-3.5 rounded-full bg-[#ffa726] border border-white" />
            <div className="mt-1 -ml-8 px-2 py-1 rounded bg-[#162230] border border-[#ffa726] text-[10px] font-semibold text-[#ffa726] whitespace-nowrap shadow group-hover:scale-105 transition-transform">
              🚛 TN-02-CD-5678 (Loading)
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="relative z-10 flex flex-wrap items-center gap-4 text-[11px] text-[#5a7a94] border-t border-[#1e3a52]/80 pt-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4caf50]" />
            <span>Warehouse Origin</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4fc3f7]" />
            <span>Active Transport Convoy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ef5350]" />
            <span>Hospital Emergency Intake</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffa726]" />
            <span>Depot / In-prep</span>
          </div>
        </div>
      </div>

      {/* Two Column Section: Traffic Signal Alerts & Vehicle Registry */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Traffic Signal Alerts Sent */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#c0d8ee] flex items-center gap-2">
              <Radio size={18} className="text-[#ef5350]" />
              Traffic Signal Alerts Sent (Green Corridors)
            </h3>
            <span className="text-xs text-[#5a7a94]">Smart Grid Overrides</span>
          </div>

          <div className="space-y-3">
            {signals.map((sig) => (
              <div 
                key={sig.id}
                className="p-4 rounded-xl bg-[#1a2d3e] border border-[#1e3a52] flex items-start gap-4 hover:border-[#4fc3f7]/50 transition-all"
              >
                {/* Traffic Light Visualizer */}
                <div className="flex flex-col gap-1 bg-[#0f1923] p-1.5 rounded-md border border-[#2a3f52] shrink-0">
                  <div className={`w-3.5 h-3.5 rounded-full border border-[#2a3f52] ${
                    sig.status === 'RED' ? 'bg-[#ef5350] shadow-[0_0_10px_#ef5350]' : 'bg-[#1a2d3e]'
                  }`} />
                  <div className={`w-3.5 h-3.5 rounded-full border border-[#2a3f52] ${
                    sig.status === 'YELLOW' ? 'bg-[#ffa726] shadow-[0_0_10px_#ffa726]' : 'bg-[#1a2d3e]'
                  }`} />
                  <div className={`w-3.5 h-3.5 rounded-full border border-[#2a3f52] ${
                    sig.status === 'GREEN' ? 'bg-[#4caf50] shadow-[0_0_10px_#4caf50]' : 'bg-[#1a2d3e]'
                  }`} />
                </div>

                {/* Details */}
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-bold text-white text-xs sm:text-sm">
                      {sig.code} • {sig.name}
                    </div>
                    {sig.greenCorridorActive ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#1b3a2a] text-[#4caf50] border border-[#4caf50]/40">
                        ACTIVE
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#3a2e1b] text-[#ffa726] border border-[#ffa726]/40">
                        STANDBY
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-semibold text-[#4caf50] mt-1">
                    {sig.details}
                  </div>
                  <div className="text-[11px] text-[#5a7a94] mt-1">
                    Intersection: {sig.intersection}
                  </div>

                  {/* Manual control toggle */}
                  <div className="mt-2.5 pt-2 border-t border-[#1e3a52] flex items-center justify-between">
                    <span className="text-[11px] text-[#7a8fa3]">
                      Assigned: <span className="font-mono text-white">{sig.vehicleAssigned}</span>
                    </span>
                    <button
                      onClick={() => onToggleSignal(sig.id)}
                      className="px-2.5 py-1 text-xs font-semibold rounded bg-[#0f1923] border border-[#1e3a52] hover:border-[#4fc3f7] text-[#4fc3f7] transition-colors cursor-pointer"
                    >
                      {sig.greenCorridorActive ? 'Cycle to Standard' : 'Force Green Wave'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Supplier Vehicle Registry */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#c0d8ee] flex items-center gap-2">
              <Truck size={18} className="text-[#4fc3f7]" />
              Supplier Vehicle Registry
            </h3>
            <span className="text-xs text-[#5a7a94]">Active Fleet Telemetry</span>
          </div>

          <div className="space-y-3">
            {vehicles.map((veh) => (
              <div 
                key={veh.id}
                onClick={() => onSelectVehicle(veh.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedVehicleId === veh.id
                    ? 'bg-[#1b2a3a] border-[#4fc3f7] shadow-lg shadow-[#4fc3f7]/15'
                    : 'bg-[#1a2d3e] border-[#1e3a52] hover:border-[#4fc3f7]/50'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-lg bg-[#0f1923] border border-[#1e3a52] flex items-center justify-center shrink-0">
                    <Truck size={22} className={veh.status === 'EN ROUTE' ? 'text-[#4fc3f7]' : veh.status === 'LOADING' ? 'text-[#ffa726]' : 'text-[#5a7a94]'} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-bold text-white text-sm font-mono flex items-center gap-2">
                        {veh.plate}
                        {veh.status === 'EN ROUTE' && (
                          <span className="w-2 h-2 rounded-full bg-[#4caf50] animate-pulse" />
                        )}
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        veh.status === 'EN ROUTE'
                          ? 'bg-[#1b3a2a] text-[#4caf50] border border-[#4caf50]/40'
                          : veh.status === 'LOADING'
                          ? 'bg-[#3a2e1b] text-[#ffa726] border border-[#ffa726]/40'
                          : 'bg-[#1b2a3a] text-[#4fc3f7] border border-[#4fc3f7]/40'
                      }`}>
                        {veh.status}
                      </span>
                    </div>

                    <div className="text-xs text-[#5a7a94] mt-0.5">
                      {veh.type} • {veh.supplier}
                    </div>

                    <div className="text-xs text-[#c0d0e0] mt-1 font-mono flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="flex items-center gap-1">
                        Cold Chain: <span className="text-[#4caf50] font-bold">✅ {veh.currentTemp}°C</span>
                      </span>
                      <span>•</span>
                      <span>Target: {veh.targetTemp}</span>
                      <span>•</span>
                      <span>Speed: <strong className="text-white">{veh.speedKmH} km/h</strong></span>
                    </div>

                    <div className="text-[11px] text-[#7a8fa3] mt-1">
                      Driver: {veh.driver} • Dest: {veh.destination}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Route Optimization Notice Box */}
      <div className="p-4 rounded-xl bg-[#152230] border border-[#4fc3f7] text-xs sm:text-sm text-[#4fc3f7] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md shadow-[#4fc3f7]/10">
        <div className="flex items-start sm:items-center gap-3">
          <Navigation size={20} className="shrink-0 text-[#4fc3f7]" />
          <div>
            <strong>AI ROUTE OPTIMIZATION ENGINE:</strong> High congestion detected at NH-48 junction. Alternative route via Old Mahabalipuram Expressway (OMR) saves 12 minutes. Traffic signal green corridors automatically coordinated.
          </div>
        </div>
        <button
          onClick={handleApplyRoute}
          disabled={alternateRouteApplied}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer self-start sm:self-auto ${
            alternateRouteApplied
              ? 'bg-[#1b3a2a] text-[#4caf50] border border-[#4caf50]/50'
              : 'bg-[#4fc3f7] text-[#0f1923] hover:bg-[#38bdf8]'
          }`}
        >
          {alternateRouteApplied ? '✓ OMR Route Active' : 'Switch Route to OMR'}
        </button>
      </div>
    </div>
  );
};
