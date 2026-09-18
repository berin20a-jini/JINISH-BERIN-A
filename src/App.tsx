/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  TabType, 
  Hospital, 
  InventoryItem, 
  Supplier, 
  RestockOrder, 
  TrafficSignal, 
  Vehicle, 
  StorageUnit, 
  AlertLog,
  AIRecommendation,
  AuditLogRecord,
  ToastMessage,
  OrderStatus
} from './types';
import { 
  initialHospitals, 
  initialInventory, 
  initialSuppliers, 
  initialOrders, 
  initialSignals, 
  initialVehicles, 
  initialStorageUnits, 
  initialAlerts,
  initialAIRecommendations as initialRecommendations,
  initialAuditLogs
} from './data/mockData';
import { HeaderNav } from './components/HeaderNav';
import { SidebarNav } from './components/SidebarNav';
import { ToastContainer } from './components/ToastContainer';
import { OverviewView } from './components/OverviewView';
import { AiCommandCenterView } from './components/AiCommandCenterView';
import { InventoryView } from './components/InventoryView';
import { SupplierHubView } from './components/SupplierHubView';
import { EmergencyProcurementView } from './components/EmergencyProcurementView';
import { TransportView } from './components/TransportView';
import { TempControlView } from './components/TempControlView';
import { AlertsView } from './components/AlertsView';
import { HospitalsView } from './components/HospitalsView';
import { AnalyticsView } from './components/AnalyticsView';
import { AuditLogView } from './components/AuditLogView';
import { SettingsView } from './components/SettingsView';
import { RestockModal } from './components/RestockModal';
import { VehicleDetailModal } from './components/VehicleDetailModal';
import { soundFx } from './utils/audio';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('overview');
  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);
  const [hospitals, setHospitals] = useState<Hospital[]>(initialHospitals);
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [orders, setOrders] = useState<RestockOrder[]>(initialOrders);
  const [signals, setSignals] = useState<TrafficSignal[]>(initialSignals);
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [storageUnits, setStorageUnits] = useState<StorageUnit[]>(initialStorageUnits);
  const [alerts, setAlerts] = useState<AlertLog[]>(initialAlerts);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>(initialRecommendations);
  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>(initialAuditLogs);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [pandemicMode, setPandemicMode] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState<boolean>(false);
  const [restockInitialHospital, setRestockInitialHospital] = useState<string | undefined>(undefined);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState<boolean>(false);

  // Derived counts for alerts and badges
  const criticalTempCount = storageUnits.filter(u => u.status === 'CRITICAL').length;
  const criticalAlertsCount = alerts.filter(a => a.type === 'critical' && !a.acknowledged).length + criticalTempCount;
  const lowStockCount = inventory.filter(i => i.status === 'CRITICAL' || i.status === 'LOW').length;
  const activeOrdersCount = orders.filter(o => o.status !== 'DELIVERED').length;
  const pendingAiRecsCount = recommendations.filter(r => r.status === 'PENDING').length;
  const totalStockDoses = inventory
    .filter(i => i.type === 'Vaccine')
    .reduce((acc, i) => acc + i.inStock, 0);

  // Audio helper
  const playSound = (type: 'alarm' | 'success' | 'click') => {
    if (!soundEnabled) return;
    if (type === 'alarm') soundFx.playCriticalAlarm();
    else if (type === 'success') soundFx.playSuccessChime();
    else soundFx.playActionClick();
  };

  // Add Toast Notification
  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newToast: ToastMessage = { ...toast, id };
    setToasts(prev => [newToast, ...prev].slice(0, 5));

    // Auto dismiss after 6 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 6000);
  };

  const handleDismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Helper: append an immutable audit log record
  const appendAuditLog = (
    action: string,
    category: 'AI_DECISION' | 'PROCUREMENT' | 'COLD_CHAIN' | 'TRANSIT' | 'INVENTORY',
    entity: string,
    details: string,
    status: 'SUCCESS' | 'WARNING' | 'CRITICAL' | 'VERIFIED' = 'SUCCESS',
    actor: string = 'Dr. Priya Sharma (CMO)',
    actorRole: string = 'Hospital Chief Medical Officer'
  ) => {
    const timeStr = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST';
    const hash = `${Math.random().toString(36).substring(2, 6)}...${Math.random().toString(36).substring(2, 6)}`;
    const newRecord: AuditLogRecord = {
      id: `aud-${Date.now()}`,
      timestamp: timeStr,
      actor,
      actorRole,
      action,
      category,
      entity,
      status,
      details,
      hash
    };
    setAuditLogs(prev => [newRecord, ...prev]);
  };

  // Automated Temperature Regulation simulation tick
  useEffect(() => {
    const interval = setInterval(() => {
      setStorageUnits(prevUnits => 
        prevUnits.map(unit => {
          const diff = unit.setPoint - unit.currentTemp;
          if (Math.abs(diff) > 0.15) {
            const step = diff > 0 ? 0.3 : -0.4;
            const nextTemp = parseFloat((unit.currentTemp + step).toFixed(1));
            
            let nextStatus: 'NORMAL' | 'WARNING' | 'CRITICAL' = 'NORMAL';
            if (nextTemp < unit.minSafe || nextTemp > unit.maxSafe) {
              const breachDelta = Math.max(unit.minSafe - nextTemp, nextTemp - unit.maxSafe);
              nextStatus = breachDelta > 2.0 ? 'CRITICAL' : 'WARNING';
            }

            return {
              ...unit,
              currentTemp: nextTemp,
              status: nextStatus,
              isAdjusting: true
            };
          } else {
            return {
              ...unit,
              isAdjusting: false
            };
          }
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Action: Approve AI Recommendation (Human in the loop)
  const handleApproveRecommendation = (recId: string) => {
    playSound('success');
    const rec = recommendations.find(r => r.id === recId);
    if (!rec) return;

    setRecommendations(prev => prev.map(r => 
      r.id === recId 
        ? { ...r, status: 'APPROVED', approvedTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST' } 
        : r
    ));

    // Create Emergency Order
    const newOrderId = `RST-${Date.now().toString().slice(-4)}`;
    const newOrder: RestockOrder = {
      id: newOrderId,
      supplier: rec.recommendedSupplier,
      items: `${rec.targetItem} × ${rec.recommendedQuantity.toLocaleString()}`,
      itemName: rec.targetItem,
      quantity: rec.recommendedQuantity,
      destination: rec.hospital,
      priority: 'EMERGENCY',
      status: 'CONFIRMED',
      eta: '4 hours',
      vehicleId: 'TN-01-AB-1234',
      aiSuggested: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST'
    };
    setOrders(prev => [newOrder, ...prev]);

    // Add Audit Log
    appendAuditLog(
      'AI_RECOMMENDATION_APPROVED',
      'AI_DECISION',
      `Rec #${rec.id} (${rec.targetItem} × ${rec.recommendedQuantity})`,
      `Human-in-the-loop approved procurement from ${rec.recommendedSupplier} for ${rec.hospital}. Emergency Order #${newOrderId} generated.`,
      'VERIFIED'
    );

    // Add Toast
    addToast({
      type: 'success',
      title: 'Recommendation Approved & Dispatched',
      message: `Emergency Order #${newOrderId} created for ${rec.hospital} (${rec.recommendedQuantity.toLocaleString()} units via ${rec.recommendedSupplier}).`
    });
  };

  // Action: Reject AI Recommendation
  const handleRejectRecommendation = (recId: string) => {
    playSound('click');
    const rec = recommendations.find(r => r.id === recId);
    if (!rec) return;

    setRecommendations(prev => prev.map(r => 
      r.id === recId ? { ...r, status: 'REJECTED' } : r
    ));

    appendAuditLog(
      'AI_RECOMMENDATION_REJECTED',
      'AI_DECISION',
      `Rec #${rec.id}`,
      `Chief Medical Logistics officer opted to override AI recommendation for ${rec.targetItem}.`,
      'WARNING'
    );

    addToast({
      type: 'warning',
      title: 'Recommendation Declined',
      message: `Recommendation #${rec.id} dismissed by user decision.`
    });
  };

  // Action: Advance Order Status in Emergency Pipeline
  const handleAdvanceOrderStatus = (orderId: string) => {
    playSound('click');
    const statusCycle: OrderStatus[] = ['QUEUED', 'CONFIRMED', 'LOADING', 'EN ROUTE', 'DELIVERED'];
    
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;
      const curIdx = statusCycle.indexOf(order.status);
      const nextIdx = Math.min(statusCycle.length - 1, curIdx + 1);
      const nextStatus = statusCycle[nextIdx];

      // If transition to DELIVERED, restock inventory
      if (nextStatus === 'DELIVERED') {
        handleCompleteDelivery(order.id);
      }

      appendAuditLog(
        'ORDER_STATUS_ADVANCED',
        'PROCUREMENT',
        `Order #${order.id}`,
        `Status transitioned from ${order.status} to ${nextStatus}.`,
        'SUCCESS'
      );

      return {
        ...order,
        status: nextStatus
      };
    }));
  };

  // Action: Complete Delivery and replenish Hospital inventory
  const handleCompleteDelivery = (orderId: string) => {
    playSound('success');
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    setOrders(prev => prev.map(o => 
      o.id === orderId ? { ...o, status: 'DELIVERED', eta: 'COMPLETED' } : o
    ));

    // Replenish hospital inventory doses
    const itemName = order.items.split(' × ')[0];
    const qtyMatch = order.items.match(/×\s*([\d,]+)/);
    const addedQty = qtyMatch ? parseInt(qtyMatch[1].replace(/,/g, '')) : 2000;

    setInventory(prev => prev.map(item => {
      if (item.hospital === order.destination && item.name.includes(itemName)) {
        const newStock = item.inStock + addedQty;
        return {
          ...item,
          inStock: newStock,
          status: newStock > item.reorderLevel ? 'OK' : 'LOW',
          signalStatus: undefined
        };
      }
      return item;
    }));

    // Update hospital days left
    setHospitals(prev => prev.map(h => {
      if (h.name === order.destination) {
        return {
          ...h,
          stockDaysLeft: Math.min(7.5, parseFloat((h.stockDaysLeft + 3.2).toFixed(1))),
          status: h.status === 'CRITICAL' ? 'HIGH' : h.status
        };
      }
      return h;
    }));

    appendAuditLog(
      'DELIVERY_ACCEPTED_VERIFIED',
      'INVENTORY',
      `Order #${order.id} (${order.destination})`,
      `Dock intake verified. ${addedQty.toLocaleString()} units replenished into on-site cold storage.`,
      'SUCCESS',
      'Pharmacist M. Alok',
      'Lead Hospital Pharmacist'
    );

    addToast({
      type: 'success',
      title: 'Delivery Received & Restocked!',
      message: `Order #${order.id} verified at ${order.destination}. Inventory replenished with ${addedQty.toLocaleString()} units.`
    });
  };

  // Action: Trigger Restock Signal for a specific inventory item
  const handleTriggerSignal = (itemId: string) => {
    playSound('success');
    const targetItem = inventory.find(i => i.id === itemId);
    if (!targetItem) return;

    setInventory(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, signalStatus: 'SENT' } 
        : item
    ));

    const newOrderId = `RST-${Date.now().toString().slice(-4)}`;
    const newOrder: RestockOrder = {
      id: newOrderId,
      supplier: 'MedPharma Corp',
      items: `${targetItem.name} × ${targetItem.reorderLevel}`,
      itemName: targetItem.name,
      quantity: targetItem.reorderLevel,
      destination: targetItem.hospital,
      priority: 'EMERGENCY',
      status: 'LOADING',
      eta: '2.5 hours',
      vehicleId: 'TN-01-AB-1234',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST'
    };

    setOrders(prev => [newOrder, ...prev]);

    // Add alert
    const newAlert: AlertLog = {
      id: `alt-${Date.now()}`,
      type: 'critical',
      category: 'SHORTAGE',
      title: 'RESTOCK SIGNAL SENT',
      message: `${targetItem.hospital}: ${targetItem.name} (${targetItem.reorderLevel.toLocaleString()} units) → Supplier: MedPharma Corp`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST',
      acknowledged: false,
      targetTab: 'procurement',
      actionLabel: 'View Procurement'
    };
    setAlerts(prev => [newAlert, ...prev]);

    appendAuditLog(
      'RESTOCK_SIGNAL_DISPATCHED',
      'PROCUREMENT',
      `${targetItem.name} (${targetItem.hospital})`,
      `Signal sent to MedPharma Corp for emergency batch replenishment. Order #${newOrderId} generated.`,
      'SUCCESS'
    );

    addToast({
      type: 'warning',
      title: 'Restock Signal Sent',
      message: `Dispatched order #${newOrderId} to MedPharma Corp for ${targetItem.hospital}.`
    });
  };

  // Action: Open Restock Modal
  const handleOpenRestockModal = (initialHosp?: string) => {
    playSound('click');
    setRestockInitialHospital(initialHosp);
    setIsRestockModalOpen(true);
  };

  // Action: Confirm Order from Modal
  const handleConfirmRestock = (orderData: {
    hospital: string;
    item: string;
    quantity: number;
    supplier: string;
    priority: 'EMERGENCY' | 'HIGH' | 'NORMAL';
  }) => {
    playSound('success');
    const newOrderId = `RST-${Date.now().toString().slice(-4)}`;
    const newOrder: RestockOrder = {
      id: newOrderId,
      supplier: orderData.supplier,
      items: `${orderData.item} × ${orderData.quantity.toLocaleString()}`,
      itemName: orderData.item,
      quantity: orderData.quantity,
      destination: orderData.hospital,
      priority: orderData.priority,
      status: 'EN ROUTE',
      eta: '3 hours',
      vehicleId: 'TN-01-AB-1234',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST'
    };

    setOrders(prev => [newOrder, ...prev]);

    setInventory(prev => prev.map(item => 
      item.hospital === orderData.hospital && item.name === orderData.item
        ? { ...item, signalStatus: 'SENT' }
        : item
    ));

    setHospitals(prev => prev.map(h => 
      h.name === orderData.hospital
        ? { ...h, activeOrders: h.activeOrders + 1 }
        : h
    ));

    appendAuditLog(
      'MANUAL_ORDER_CREATED',
      'PROCUREMENT',
      `Order #${newOrderId}`,
      `Manual requisition created for ${orderData.quantity.toLocaleString()} doses of ${orderData.item} destined for ${orderData.hospital}.`,
      'SUCCESS'
    );

    addToast({
      type: 'success',
      title: 'Emergency Order Created',
      message: `Order #${newOrderId} dispatched via ${orderData.supplier} to ${orderData.hospital}.`
    });
  };

  // Temperature Controls
  const handleAdjustSetPoint = (unitId: string, newSetPoint: number) => {
    playSound('click');
    setStorageUnits(prev => prev.map(unit => {
      if (unit.id !== unitId) return unit;
      return {
        ...unit,
        setPoint: newSetPoint,
        mode: 'MANUAL',
        lastAdjustment: `Target set to ${newSetPoint.toFixed(1)}°C at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      };
    }));
  };

  const handleTriggerCoolDown = (unitId: string) => {
    playSound('success');
    setStorageUnits(prev => prev.map(unit => {
      if (unit.id !== unitId) return unit;
      const optimalTemp = unit.minSafe < -20 ? -75.0 : 4.0;
      return {
        ...unit,
        setPoint: optimalTemp,
        compressor: 'Boost Cooling',
        mode: 'MANUAL',
        currentTemp: parseFloat((optimalTemp + 0.8).toFixed(1)),
        status: 'NORMAL',
        stableDuration: 'Cooling override active',
        lastAdjustment: `Forced rapid chilling cycle to ${optimalTemp}°C`
      };
    }));

    const target = storageUnits.find(u => u.id === unitId);
    if (target) {
      appendAuditLog(
        'COLD_CHAIN_OVERRIDE',
        'COLD_CHAIN',
        `${target.hospitalName} ${target.name}`,
        `Manual chilling override initiated. Compressor locked to Boost Cooling.`,
        'SUCCESS'
      );
      addToast({
        type: 'success',
        title: 'Chilling Override Active',
        message: `${target.hospitalName}: Compressor shifted to Boost Cooling.`
      });
    }
  };

  const handleTriggerAutoMode = (unitId: string) => {
    playSound('click');
    setStorageUnits(prev => prev.map(unit => {
      if (unit.id !== unitId) return unit;
      const target = unit.minSafe < -20 ? -75.0 : 4.0;
      return {
        ...unit,
        setPoint: target,
        compressor: 'Running',
        mode: 'AUTO',
        currentTemp: target,
        status: 'NORMAL',
        stableDuration: 'Auto PID balanced',
        lastAdjustment: 'Closed-loop automation restored'
      };
    }));
  };

  const handleTriggerWarmUp = (unitId: string) => {
    playSound('click');
    setStorageUnits(prev => prev.map(unit => {
      if (unit.id !== unitId) return unit;
      const newTarget = Math.min(unit.maxSafe, unit.setPoint + 1.5);
      return {
        ...unit,
        setPoint: newTarget,
        compressor: 'Defrost',
        lastAdjustment: `Defrost cycle target ${newTarget.toFixed(1)}°C`
      };
    }));
  };

  const handleEmergencyCoolAll = () => {
    playSound('success');
    setStorageUnits(prev => prev.map(unit => {
      if (unit.status !== 'CRITICAL') return unit;
      const target = unit.minSafe < -20 ? -75.0 : 4.0;
      return {
        ...unit,
        setPoint: target,
        currentTemp: parseFloat((target + 0.6).toFixed(1)),
        compressor: 'Running',
        status: 'NORMAL',
        stableDuration: 'Stabilized after emergency cooldown',
        lastAdjustment: 'Auto emergency chilled'
      };
    }));

    appendAuditLog(
      'MASS_THERMAL_REGULATION',
      'COLD_CHAIN',
      'All Storage Banks',
      'System-wide emergency chill dispatched to prevent vaccine spoilage.',
      'SUCCESS'
    );

    addToast({
      type: 'success',
      title: 'Emergency Cooldown Activated',
      message: 'Closed-loop chilling stabilized all critical cold rooms.'
    });
  };

  // Traffic Signal handlers
  const handleToggleSignal = (signalId: string) => {
    playSound('click');
    setSignals(prev => prev.map(sig => {
      if (sig.id !== signalId) return sig;
      const nextActive = !sig.greenCorridorActive;
      return {
        ...sig,
        greenCorridorActive: nextActive,
        status: nextActive ? 'GREEN' : 'RED',
        details: nextActive 
          ? `GREEN CORRIDOR FORCED for ${sig.vehicleAssigned} · 5 min clear window`
          : `Corridor deactivated · Standard traffic cycle active`
      };
    }));
  };

  const handleActivateGreenCorridorAll = () => {
    playSound('success');
    setSignals(prev => prev.map(sig => ({
      ...sig,
      status: 'GREEN',
      greenCorridorActive: true,
      policeNotified: true,
      details: `EMERGENCY GREEN CORRIDOR ACTIVE · Convoy priority route clear`
    })));

    appendAuditLog(
      'GREEN_CORRIDOR_OVERRIDE',
      'TRANSIT',
      'Smart Traffic Grid TS-4421 & TS-4422',
      'All municipal signals locked to GREEN wave for convoy TN-01-AB-1234.',
      'SUCCESS'
    );

    addToast({
      type: 'info',
      title: 'Green Corridor Authorized',
      message: 'Municipal smart traffic signals set to Green Wave priority.'
    });
  };

  // Vehicle tracker navigation
  const handleTrackVehicle = (vehiclePlateOrId: string) => {
    playSound('click');
    const veh = vehicles.find(v => v.plate === vehiclePlateOrId || v.id === vehiclePlateOrId);
    if (veh) {
      setSelectedVehicleId(veh.id);
    }
    setCurrentTab('transport');
  };

  const handleOpenVehicleModal = (vehId: string | null) => {
    playSound('click');
    setSelectedVehicleId(vehId);
    if (vehId) {
      setIsVehicleModalOpen(true);
    }
  };

  // Broadcast Alert Re-trigger
  const handleBroadcastAlert = () => {
    playSound('alarm');
    const alertItem: AlertLog = {
      id: `alt-${Date.now()}`,
      type: 'critical',
      category: 'SURGE',
      title: 'PANDEMIC EMERGENCY BROADCAST SENT',
      message: 'All 3 contracted pharma distribution hubs received priority manifest re-confirmation.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST',
      acknowledged: false
    };
    setAlerts(prev => [alertItem, ...prev]);

    appendAuditLog(
      'SUPPLIER_BROADCAST_SENT',
      'PROCUREMENT',
      'Regional Supplier Grid',
      'Level 3 pandemic alert broadcast transmitted to all pharmaceutical partners.',
      'CRITICAL'
    );

    addToast({
      type: 'critical',
      title: 'Emergency Broadcast Transmitted',
      message: 'Alert dispatched to all distribution partners.'
    });
  };

  // Alert Handlers
  const handleAcknowledgeAlert = (id: string) => {
    playSound('click');
    setAlerts(prev => prev.map(a => 
      a.id === id ? { ...a, acknowledged: true } : a
    ));
  };

  const handleAcknowledgeAllAlerts = () => {
    playSound('click');
    setAlerts(prev => prev.map(a => ({ ...a, acknowledged: true })));
    addToast({
      type: 'info',
      title: 'Alerts Acknowledged',
      message: 'All outstanding telemetry alerts cleared.'
    });
  };

  const handleDismissAlert = (id: string) => {
    playSound('click');
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  // Simulation: Trigger Pandemic Surge (End-to-End Core Workflow)
  const handleSimulateSurge = () => {
    playSound('alarm');
    setPandemicMode(true);

    // 1. Surge in Hospitals
    setHospitals(prev => prev.map(h => ({
      ...h,
      patients24h: Math.round(h.patients24h * 1.35),
      surgePct: Math.round(h.surgePct + 38),
      status: 'CRITICAL',
      stockDaysLeft: Math.max(0.5, parseFloat((h.stockDaysLeft * 0.55).toFixed(1)))
    })));

    // 2. Deplete inventory
    setInventory(prev => prev.map(item => {
      const newStock = Math.max(60, Math.round(item.inStock * 0.72));
      return {
        ...item,
        inStock: newStock,
        status: newStock < item.reorderLevel ? 'CRITICAL' : item.status,
        predictedDepletionDays: Math.max(1, Math.round(item.predictedDepletionDays * 0.6))
      };
    }));

    // 3. Generate New AI Recommendation
    const newRecId = `rec-${Date.now().toString().slice(-4)}`;
    const newRec: AIRecommendation = {
      id: newRecId,
      title: 'Emergency Surge Reallocation: Covaxin 2,500 Doses',
      hospital: 'City General Hospital',
      targetItem: 'Covaxin',
      currentStock: 1008,
      predictedDemand7Days: 4800,
      projectedShortage: 3792,
      daysUntilShortage: 1.2,
      recommendedQuantity: 2500,
      recommendedSupplier: 'MedPharma Corp',
      supplierReliability: 98.4,
      estimatedDeliveryHours: 14,
      confidenceScore: 97,
      reasoning: [
        'Sudden +35% inpatient triage spike detected across City General emergency wards.',
        'Current buffer reserve (1,008 doses) will deplete within 29 hours at current burn rate.',
        'MedPharma Corp has 18,500 verified reserve doses with certified cold-chain transit.',
        'Recommendation generated with 97% confidence based on epidemiological intake velocity.'
      ],
      status: 'PENDING'
    };
    setRecommendations(prev => [newRec, ...prev]);

    // 4. Critical Alert
    const surgeAlert: AlertLog = {
      id: `alt-surge-${Date.now()}`,
      type: 'critical',
      category: 'SURGE',
      title: 'PANDEMIC DEMAND ANOMALY DETECTED (+75% SURGE)',
      message: 'City General Hospital: Influx velocity exceeded 3.8 standard deviations. New AI recommendation pending human approval.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST',
      acknowledged: false,
      targetTab: 'ai-command',
      actionLabel: 'Open AI Command'
    };
    setAlerts(prev => [surgeAlert, ...prev]);

    // 5. Audit Log Record
    appendAuditLog(
      'PANDEMIC_SURGE_SIMULATED',
      'AI_DECISION',
      'City General Hospital Triage Node',
      'Synthetic pandemic intake surge triggered. Demand modeling calculated immediate deficit of 3,792 doses. Human advisory rec created.',
      'CRITICAL'
    );

    // 6. Toast
    addToast({
      type: 'critical',
      title: 'Pandemic Surge Anomaly Detected!',
      message: 'City General triage spiked +75%. AI generated an emergency procurement recommendation in AI Command Center.'
    });

    // Navigate to AI Command Center to show the immediate human-in-the-loop action
    setCurrentTab('ai-command');
  };

  // Reset Demo Data
  const handleResetData = () => {
    playSound('click');
    setHospitals(initialHospitals);
    setInventory(initialInventory);
    setSuppliers(initialSuppliers);
    setOrders(initialOrders);
    setSignals(initialSignals);
    setVehicles(initialVehicles);
    setStorageUnits(initialStorageUnits);
    setAlerts(initialAlerts);
    setRecommendations(initialRecommendations);
    setAuditLogs(initialAuditLogs);
    setPandemicMode(true);

    addToast({
      type: 'info',
      title: 'Demo Data Reset',
      message: 'Prototype restored to default scenario baseline.'
    });
  };

  return (
    <div className="min-h-screen bg-[#0c141d] text-[#e0e6ed] flex selection:bg-[#4fc3f7] selection:text-[#0c141d]">
      {/* 12-Module Sidebar Navigation */}
      <SidebarNav
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        criticalAlertsCount={criticalAlertsCount}
        lowStockCount={lowStockCount}
        activeOrdersCount={activeOrdersCount}
        pendingAiRecsCount={pendingAiRecsCount}
        mobileOpen={mobileNavOpen}
        setMobileOpen={setMobileNavOpen}
      />

      {/* Main App Content Body */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <HeaderNav
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          criticalAlertsCount={criticalAlertsCount}
          lowStockCount={lowStockCount}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          onSimulateSurge={handleSimulateSurge}
          onResetData={handleResetData}
          pandemicMode={pandemicMode}
          setPandemicMode={setPandemicMode}
          onOpenMobileMenu={() => setMobileNavOpen(true)}
        />

        {/* Dynamic Module Canvas */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#0c141d]">
          <div className="max-w-7xl mx-auto">
            {currentTab === 'overview' && (
              <OverviewView
                hospitals={hospitals}
                alerts={alerts}
                totalStock={totalStockDoses}
                activeDeliveriesCount={vehicles.filter(v => v.status === 'EN ROUTE' || v.status === 'LOADING').length}
                tempAlertsCount={criticalTempCount}
                pandemicMode={pandemicMode}
                onNavigateTab={setCurrentTab}
                onRequestRestock={handleOpenRestockModal}
                onDismissAlert={handleDismissAlert}
              />
            )}

            {currentTab === 'ai-command' && (
              <AiCommandCenterView
                recommendations={recommendations}
                hospitals={hospitals}
                inventory={inventory}
                onApproveRecommendation={handleApproveRecommendation}
                onRejectRecommendation={handleRejectRecommendation}
                onNavigateTab={setCurrentTab}
                onSimulateSurge={handleSimulateSurge}
              />
            )}

            {currentTab === 'inventory' && (
              <InventoryView
                inventory={inventory}
                onTriggerSignal={handleTriggerSignal}
                onOpenRestockModal={handleOpenRestockModal}
              />
            )}

            {currentTab === 'supplier' && (
              <SupplierHubView
                suppliers={suppliers}
                orders={orders}
                onBroadcastAlert={handleBroadcastAlert}
                onTrackVehicle={handleTrackVehicle}
                onOpenRestockModal={() => handleOpenRestockModal()}
              />
            )}

            {currentTab === 'procurement' && (
              <EmergencyProcurementView
                orders={orders}
                suppliers={suppliers}
                hospitals={hospitals}
                inventory={inventory}
                onAdvanceOrderStatus={handleAdvanceOrderStatus}
                onCompleteDelivery={handleCompleteDelivery}
                onOpenRestockModal={() => handleOpenRestockModal()}
                onNavigateTab={setCurrentTab}
              />
            )}

            {currentTab === 'transport' && (
              <TransportView
                signals={signals}
                vehicles={vehicles}
                selectedVehicleId={selectedVehicleId}
                onSelectVehicle={handleOpenVehicleModal}
                onToggleSignal={handleToggleSignal}
                onActivateGreenCorridorAll={handleActivateGreenCorridorAll}
              />
            )}

            {currentTab === 'temperature' && (
              <TempControlView
                storageUnits={storageUnits}
                onAdjustSetPoint={handleAdjustSetPoint}
                onTriggerCoolDown={handleTriggerCoolDown}
                onTriggerAutoMode={handleTriggerAutoMode}
                onTriggerWarmUp={handleTriggerWarmUp}
                onEmergencyCoolAll={handleEmergencyCoolAll}
              />
            )}

            {currentTab === 'alerts' && (
              <AlertsView
                alerts={alerts}
                onAcknowledgeAlert={handleAcknowledgeAlert}
                onAcknowledgeAll={handleAcknowledgeAllAlerts}
                onDismissAlert={handleDismissAlert}
                onNavigateTab={setCurrentTab}
              />
            )}

            {currentTab === 'hospitals' && (
              <HospitalsView
                hospitals={hospitals}
                inventory={inventory}
                onRequestRestock={handleOpenRestockModal}
                onNavigateTab={setCurrentTab}
              />
            )}

            {currentTab === 'analytics' && (
              <AnalyticsView
                hospitals={hospitals}
                inventory={inventory}
                suppliers={suppliers}
              />
            )}

            {currentTab === 'audit' && (
              <AuditLogView
                logs={auditLogs}
              />
            )}

            {currentTab === 'settings' && (
              <SettingsView
                onResetData={handleResetData}
                onSimulateSurge={handleSimulateSurge}
              />
            )}
          </div>
        </main>
      </div>

      {/* Global Toast Container */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

      {/* Modals */}
      <RestockModal
        isOpen={isRestockModalOpen}
        onClose={() => setIsRestockModalOpen(false)}
        hospitals={hospitals}
        inventory={inventory}
        suppliers={suppliers}
        initialHospital={restockInitialHospital}
        onConfirmRestock={handleConfirmRestock}
      />

      <VehicleDetailModal
        vehicle={vehicles.find(v => v.id === selectedVehicleId) || null}
        onClose={() => setIsVehicleModalOpen(false)}
        onTriggerGreenWave={handleActivateGreenCorridorAll}
      />
    </div>
  );
}
