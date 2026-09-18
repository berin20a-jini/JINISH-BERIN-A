export type TabType = 
  | 'overview' 
  | 'ai-command' 
  | 'inventory' 
  | 'supplier' 
  | 'procurement' 
  | 'transport' 
  | 'temperature' 
  | 'alerts' 
  | 'hospitals' 
  | 'analytics' 
  | 'audit' 
  | 'settings';

export interface Hospital {
  id: string;
  name: string;
  patients24h: number;
  normalBaseline: number;
  surgePct: number;
  status: 'CRITICAL' | 'HIGH' | 'NORMAL';
  stockDaysLeft: number;
  location: string;
  activeOrders: number;
  bedOccupancyPct: number;
  icuAvailable: number;
  primaryContact: string;
  lastUpdated: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  type: 'Vaccine' | 'Medicine';
  hospital: string;
  inStock: number;
  reorderLevel: number;
  dailyUsage: number;
  predictedDepletionDays: number;
  unit: string;
  status: 'CRITICAL' | 'LOW' | 'OK';
  signalStatus: 'SENT' | 'QUEUED' | 'CONFIRMED' | 'NONE';
  batchNumber: string;
  expiryDays: number;
  expiryDate: string;
  fefoPriority: 'CRITICAL' | 'MEDIUM' | 'NORMAL';
}

export interface Supplier {
  id: string;
  name: string;
  role: string;
  location: string;
  responseTimeMin: number;
  orderAccepted: string;
  eta: string;
  assignedVehicle: string;
  reliabilityScore: number;
  status: 'ACTIVE' | 'PREPARING' | 'STANDBY';
  contactPerson: string;
  phone: string;
  availableStock: { [key: string]: number };
  emergencyFulfillment: boolean;
  distanceKm: number;
}

export type OrderStatus = 'QUEUED' | 'CONFIRMED' | 'LOADING' | 'EN ROUTE' | 'DELIVERED';

export interface RestockOrder {
  id: string;
  supplier: string;
  items: string;
  itemName: string;
  quantity: number;
  destination: string;
  priority: 'EMERGENCY' | 'HIGH' | 'NORMAL';
  status: OrderStatus;
  eta: string;
  vehicleId?: string;
  driver?: string;
  timestamp: string;
  aiSuggested?: boolean;
}

export interface TrafficSignal {
  id: string;
  code: string;
  name: string;
  intersection: string;
  status: 'GREEN' | 'RED' | 'YELLOW';
  greenCorridorActive: boolean;
  vehicleAssigned: string;
  windowMinutes: number;
  policeNotified: boolean;
  details: string;
}

export interface Vehicle {
  id: string;
  plate: string;
  type: string;
  supplier: string;
  driver: string;
  driverPhone: string;
  coldChainActive: boolean;
  currentTemp: number;
  targetTemp: string;
  speedKmH: number;
  status: 'EN ROUTE' | 'LOADING' | 'STANDBY' | 'DELIVERED';
  locationName: string;
  destination: string;
  eta: string;
  etaMinutes: number;
  originalEtaMinutes: number;
  altRouteAvailable: boolean;
  altRouteEtaMinutes: number;
  altRouteName: string;
  cargo: string;
  cargoQuantity: number;
  progressPct: number;
  xPct: number;
  yPct: number;
  trafficCondition: 'HEAVY' | 'MODERATE' | 'CLEAR';
}

export interface StorageUnit {
  id: string;
  hospitalId: string;
  hospitalName: string;
  name: string;
  type: string;
  contents: string;
  currentTemp: number;
  setPoint: number;
  minSafe: number;
  maxSafe: number;
  humidity: number;
  compressor: 'Running' | 'Idle' | 'Boost Cooling' | 'Auto Balancing' | 'Defrost';
  status: 'NORMAL' | 'WARNING' | 'CRITICAL';
  mode: 'AUTO' | 'MANUAL';
  stableDuration: string;
  lastAdjustment: string;
  isAdjusting?: boolean;
}

export interface AlertLog {
  id: string;
  category: 'SURGE' | 'SHORTAGE' | 'COLD_CHAIN' | 'TRANSIT' | 'EXPIRY' | 'DELIVERY';
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
  actionLabel?: string;
  targetTab?: TabType;
  targetEntityId?: string;
}

export interface AIRecommendation {
  id: string;
  title: string;
  hospital: string;
  targetItem: string;
  currentStock: number;
  predictedDemand7Days: number;
  projectedShortage: number;
  daysUntilShortage: number;
  recommendedQuantity: number;
  recommendedSupplier: string;
  supplierReliability: number;
  estimatedDeliveryHours: number;
  confidenceScore: number;
  reasoning: string[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'MODIFIED';
  approvedTimestamp?: string;
}

export interface AuditLogRecord {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: string;
  category: 'AI_DECISION' | 'PROCUREMENT' | 'INVENTORY' | 'TRANSIT' | 'COLD_CHAIN' | 'ALERT' | 'SECURITY';
  entity: string;
  status: 'SUCCESS' | 'WARNING' | 'CRITICAL' | 'VERIFIED';
  details: string;
  hash: string;
}

export interface ToastMessage {
  id: string;
  type: 'critical' | 'warning' | 'success' | 'info';
  title: string;
  message: string;
}
