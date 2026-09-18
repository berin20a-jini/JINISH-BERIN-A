import React from 'react';
import { TabType } from '../types';
import { 
  LayoutDashboard, 
  Cpu, 
  Package, 
  Building2, 
  ShieldAlert, 
  Navigation, 
  ThermometerSnowflake, 
  Bell, 
  Hospital, 
  TrendingUp, 
  ShieldCheck, 
  Settings,
  Sparkles,
  ChevronRight,
  Radio,
  X
} from 'lucide-react';

interface SidebarNavProps {
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
  criticalAlertsCount: number;
  lowStockCount: number;
  activeOrdersCount: number;
  pendingAiRecsCount: number;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  currentTab,
  setCurrentTab,
  criticalAlertsCount,
  lowStockCount,
  activeOrdersCount,
  pendingAiRecsCount,
  mobileOpen,
  setMobileOpen
}) => {
  const navItems: {
    id: TabType;
    label: string;
    icon: React.ElementType;
    badge?: number;
    badgeColor?: string;
    aiBadge?: boolean;
    tag?: string;
  }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { 
      id: 'ai-command', 
      label: 'AI Command Center', 
      icon: Cpu, 
      aiBadge: true,
      badge: pendingAiRecsCount > 0 ? pendingAiRecsCount : undefined,
      badgeColor: 'bg-[#4fc3f7] text-[#0f1923]'
    },
    { 
      id: 'inventory', 
      label: 'Inventory', 
      icon: Package,
      badge: lowStockCount > 0 ? lowStockCount : undefined,
      badgeColor: 'bg-[#ef5350] text-white'
    },
    { id: 'supplier', label: 'Supplier Hub', icon: Building2 },
    { 
      id: 'procurement', 
      label: 'Emergency Procurement', 
      icon: ShieldAlert,
      badge: activeOrdersCount > 0 ? activeOrdersCount : undefined,
      badgeColor: 'bg-[#ffa726] text-[#0f1923]'
    },
    { id: 'transport', label: 'Transport & GPS', icon: Navigation, tag: 'LIVE' },
    { 
      id: 'temperature', 
      label: 'Temperature / Cold Chain', 
      icon: ThermometerSnowflake,
      badge: criticalAlertsCount > 0 ? criticalAlertsCount : undefined,
      badgeColor: 'bg-[#ef5350] text-white'
    },
    { 
      id: 'alerts', 
      label: 'Alerts', 
      icon: Bell,
      badge: criticalAlertsCount > 0 ? criticalAlertsCount : undefined,
      badgeColor: 'bg-[#ef5350] text-white'
    },
    { id: 'hospitals', label: 'Hospitals', icon: Hospital },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'audit', label: 'Audit Log', icon: ShieldCheck, tag: 'HASHED' },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSelect = (tab: TabType) => {
    setCurrentTab(tab);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0c141d] border-r border-[#1e3a52] flex flex-col
        transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:z-auto
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-[#1e3a52] flex items-center justify-between bg-[#0f1923]">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-[#4fc3f7]/20 to-[#0288d1]/30 border border-[#4fc3f7]/50 shadow-[0_0_15px_rgba(79,195,247,0.25)]">
              <Sparkles className="w-5 h-5 text-[#4fc3f7]" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4fc3f7] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#4fc3f7]"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-bold tracking-wider text-white">VAXCHAIN</h1>
                <span className="px-1.5 py-0.5 text-[10px] font-black uppercase tracking-widest bg-[#4fc3f7] text-[#0c141d] rounded">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-[#90a4ae] font-mono tracking-tight">Cold-Chain &amp; Logistics</p>
            </div>
          </div>

          <button 
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 text-[#90a4ae] hover:text-white rounded hover:bg-[#162230]"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* System telemetry status pill */}
        <div className="px-4 py-3 border-b border-[#1e3a52]/60 bg-[#121c27]">
          <div className="flex items-center justify-between text-[11px] text-[#90a4ae]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#4caf50] animate-pulse"></span>
              <span className="font-mono text-[#b0bec5]">SYS: SYNCHRONIZED</span>
            </span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#162230] border border-[#1e3a52] text-[#4fc3f7]">
              v2.8-AI
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1 custom-scrollbar">
          <div className="px-3 py-1 text-[10px] font-semibold text-[#607d8b] uppercase tracking-wider">
            Operational Modules
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                id={`sidebar-link-${item.id}`}
                onClick={() => handleSelect(item.id)}
                className={`
                  w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 group
                  ${isActive 
                    ? 'bg-gradient-to-r from-[#162a3d] to-[#142332] text-white border-l-4 border-[#4fc3f7] shadow-[0_2px_12px_rgba(79,195,247,0.12)]' 
                    : 'text-[#90a4ae] hover:bg-[#162230]/70 hover:text-[#e0e6ed]'
                  }
                `}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-[#4fc3f7]' : 'text-[#78909c] group-hover:text-[#4fc3f7]'}`} />
                  <span className="truncate">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {item.aiBadge && (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase rounded bg-[#4fc3f7]/20 text-[#4fc3f7] border border-[#4fc3f7]/40">
                      CORE
                    </span>
                  )}
                  {item.tag && (
                    <span className="px-1.5 py-0.5 text-[9px] font-mono font-semibold rounded bg-[#1e3a52] text-[#81d4fa]">
                      {item.tag}
                    </span>
                  )}
                  {item.badge !== undefined && (
                    <span className={`px-1.5 py-0.5 text-[10px] font-bold font-mono rounded-full ${item.badgeColor || 'bg-[#ef5350] text-white'}`}>
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <ChevronRight className="w-3.5 h-3.5 text-[#4fc3f7]" />
                  )}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Bottom System Identity */}
        <div className="p-3 border-t border-[#1e3a52] bg-[#0f1923]">
          <div className="p-2.5 rounded-lg bg-[#14202c] border border-[#1e3a52] flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1e3a52] flex items-center justify-center text-xs font-bold text-[#4fc3f7]">
              VC
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-white truncate">Dr. Priya Sharma</p>
              <p className="text-[10px] text-[#90a4ae] truncate">Chief Medical Logistics</p>
            </div>
            <Radio className="w-4 h-4 text-[#4caf50] shrink-0" />
          </div>
        </div>
      </aside>
    </>
  );
};
