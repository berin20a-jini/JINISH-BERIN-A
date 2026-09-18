import React, { useState, useEffect } from 'react';
import { TabType } from '../types';
import { 
  Volume2, 
  VolumeX, 
  RotateCcw,
  Menu,
  Zap,
  ShieldAlert,
  Bell,
  CheckCircle2
} from 'lucide-react';

interface HeaderNavProps {
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
  criticalAlertsCount: number;
  lowStockCount: number;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  onSimulateSurge: () => void;
  onResetData: () => void;
  pandemicMode: boolean;
  setPandemicMode: (val: boolean) => void;
  onOpenMobileMenu: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentTab,
  setCurrentTab,
  criticalAlertsCount,
  soundEnabled,
  setSoundEnabled,
  onSimulateSurge,
  onResetData,
  pandemicMode,
  setPandemicMode,
  onOpenMobileMenu
}) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) +
        ' · ' +
        now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) +
        ' IST'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const tabLabels: Record<TabType, string> = {
    'overview': 'Overview Dashboard',
    'ai-command': 'AI Command Center',
    'inventory': 'Inventory & FEFO Expiry Management',
    'supplier': 'Supplier Intelligence & EDI Hub',
    'procurement': 'Emergency Procurement & Workflow',
    'transport': 'Transport, GPS & Green Corridor',
    'temperature': 'Temperature & Cold Chain IoT',
    'alerts': 'Incident & Alert Management',
    'hospitals': 'Hospital Network & Demand Monitor',
    'analytics': 'Supply Chain Analytics & Forecasting',
    'audit': 'Tamper-Evident Audit Ledger',
    'settings': 'Platform Settings & Security Architecture'
  };

  return (
    <header className="sticky top-0 z-30 bg-[#0c141d]/95 backdrop-blur-md border-b border-[#1e3a52] px-4 sm:px-6 py-3 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger + Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 text-[#90a4ae] hover:text-white rounded-lg bg-[#14202c] border border-[#1e3a52]"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#4fc3f7] font-semibold">
                VAXCHAIN AI
              </span>
              <span className="text-[#546e7a] text-xs">/</span>
              <span className="text-xs font-semibold text-white truncate max-w-[180px] sm:max-w-none">
                {tabLabels[currentTab]}
              </span>
            </div>
            <div className="text-[11px] text-[#78909c] flex items-center gap-2 mt-0.5">
              <span className="hidden sm:inline">Regional Node: Mumbai-Chennai Corridor</span>
              <span className="hidden sm:inline">•</span>
              <span className="font-mono text-[#90a4ae]">{timeStr}</span>
            </div>
          </div>
        </div>

        {/* Right: Pandemic Mode, Surge Simulation Button, Sound, Alerts, Reset */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Pandemic Mode Toggle Badge */}
          <button
            onClick={() => setPandemicMode(!pandemicMode)}
            className={`hidden md:flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
              pandemicMode
                ? 'bg-[#ef5350]/15 text-[#ef5350] border-[#ef5350]/60 hover:bg-[#ef5350]/25'
                : 'bg-[#162230] text-[#90a4ae] border-[#1e3a52] hover:text-white'
            }`}
            title="Toggle Pandemic Alert Mode"
          >
            <span className={`w-2 h-2 rounded-full ${pandemicMode ? 'bg-[#ef5350] animate-ping' : 'bg-[#78909c]'}`} />
            {pandemicMode ? 'PANDEMIC LVL 3' : 'STANDARD PROTOCOL'}
          </button>

          {/* Quick Demo Simulator CTA */}
          <button
            id="btn-simulate-surge"
            onClick={onSimulateSurge}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#d32f2f] to-[#b71c1c] text-white border border-[#ef5350] shadow-[0_0_15px_rgba(239,83,80,0.35)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            title="Simulate sudden pandemic surge across hospital triage with end-to-end AI response"
          >
            <Zap className="w-3.5 h-3.5 fill-white" />
            <span className="hidden sm:inline">Simulate</span> Surge
          </button>

          {/* Alerts quick button */}
          <button
            onClick={() => setCurrentTab('alerts')}
            className={`relative p-2 rounded-lg border transition-all ${
              criticalAlertsCount > 0
                ? 'bg-[#261517] border-[#ef5350]/50 text-[#ef5350] hover:bg-[#ef5350]/20'
                : 'bg-[#14202c] border-[#1e3a52] text-[#90a4ae] hover:text-white'
            }`}
            title="View Alerts"
            aria-label="View Alerts"
          >
            <Bell className="w-4 h-4" />
            {criticalAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ef5350] text-white text-[9px] font-bold flex items-center justify-center font-mono animate-pulse">
                {criticalAlertsCount}
              </span>
            )}
          </button>

          {/* Sound Mute/Unmute */}
          <button
            id="btn-toggle-sound"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-lg border transition-colors ${
              soundEnabled
                ? 'text-[#4fc3f7] bg-[#162a3d] border-[#4fc3f7]/50'
                : 'text-[#78909c] bg-[#14202c] border-[#1e3a52] hover:text-white'
            }`}
            title={soundEnabled ? 'Audio feedback: ON' : 'Audio feedback: MUTED'}
            aria-label="Toggle Sound"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Reset Demo Data */}
          <button
            id="btn-reset-demo"
            onClick={onResetData}
            className="p-2 rounded-lg text-[#90a4ae] hover:text-white bg-[#14202c] border border-[#1e3a52] hover:border-[#4fc3f7]/50 transition-colors"
            title="Reset to default synthetic demo state"
            aria-label="Reset Demo Data"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
