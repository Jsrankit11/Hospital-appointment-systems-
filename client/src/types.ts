export type UserRole = 'SUPER_ADMIN' | 'DOCTOR' | 'NURSE' | 'PATIENT' | 'RECEPTIONIST' | 'LAB_TECHNICIAN' | 'PHARMACIST' | 'BILLING_OFFICER';

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: UserRole;
  department: string;
  badge?: string;
  hprId?: string;
  abhaNumber?: string;
  abhaAddress?: string;
  avatar?: string;
  city?: string;
  state?: string;
  passwordPreview?: string;
}

export interface Patient {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  abhaNumber: string;
  abhaAddress: string;
  aadhaarLast4: string;
  gender: 'Male' | 'Female' | 'Other';
  age: number;
  dob: string;
  bloodGroup: string;
  address: string;
  district: string;
  state: string;
  city?: string;
  pincode: string;
  emergencyContact: string;
  insuranceProvider?: string;
  allergies?: string[];
  chronicConditions?: string[];
  photoUrl?: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  tokenNumber: number;
  patientId: string;
  patientName: string;
  mobile?: string;
  email?: string;
  abhaNumber?: string;
  gender?: string;
  age?: number;
  department: string;
  doctorName: string;
  status: any;
  priority: any;
  timeSlot: string;
  opdRoom?: string;
  type?: string;
  date?: string;
  symptoms?: string;
  vitals?: {
    bp: string;
    pulse: number;
    temp: number;
    spo2: number;
  };
  createdAt: string;
}

export interface OPDQueueItem extends Appointment {}

export interface EHR {
  id: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  department: string;
  chiefComplaint: string;
  diagnosis: string;
  icdCode?: string;
  prescription: {
    medicine: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }[];
  labOrders: string[];
  followUpDate?: string;
  createdAt: string;
}

export interface BloodStock {
  bloodGroup: string;
  unitsAvailable: number;
  component: string;
  location?: string;
  hospitalName?: string;
  contactNumber?: string;
  lastUpdated?: string;
}

export interface Bed {
  id: string;
  bedNumber: string;
  ward: 'ICU' | 'GENERAL_MALE' | 'GENERAL_FEMALE' | 'EMERGENCY' | 'MATERNITY' | 'PEDIATRIC' | string;
  type: 'VENTILATOR' | 'OXYGEN' | 'NORMAL' | 'ISOLATION' | string;
  status: any;
  patientName?: string;
  currentPatient?: {
    id: string;
    name: string;
    admissionDate: string;
    doctorName: string;
  };
  dailyRate?: number;
  pricePerDay?: number;
  oxygenSupport?: boolean;
  ventilator?: boolean;
}

export interface Medicine {
  id: string;
  code?: string;
  name: string;
  genericName: string;
  manufacturer?: string;
  batchNumber: string;
  stock: number;
  stockQuantity?: number;
  unit: string;
  price: number;
  expiryDate: string;
  category: 'ANTIBIOTIC' | 'ANALGESIC' | 'CARDIAC' | 'DIABETIC' | 'CRITICAL_CARE' | string;
  requiresPrescription: boolean;
}

export interface LabTest {
  id: string;
  patientId: string;
  patientName: string;
  abhaNumber?: string;
  testName: string;
  sampleType?: string;
  category: 'PATHOLOGY' | 'RADIOLOGY' | 'BIOCHEMISTRY' | 'MICROBIOLOGY' | string;
  status: any;
  result?: string;
  findings?: string;
  referenceRange?: string;
  unit?: string;
  isPanicValue?: boolean;
  isCritical?: boolean;
  prescribedBy?: string;
  doctorName?: string;
  testedBy?: string;
  technician?: string;
  createdAt: string;
  completedAt?: string;
}

export interface Bill {
  id: string;
  invoiceNumber?: string;
  patientId: string;
  patientName: string;
  serviceType: string;
  items: { description: string; amount: number; gstRate: number }[];
  totalAmount: number;
  discount: number;
  netAmount: number;
  status?: any;
  paymentStatus: 'PAID' | 'PENDING' | 'PARTIAL';
  paymentMode?: 'UPI' | 'CASH' | 'CARD' | 'INSURANCE_PMJAY' | string;
  paymentMethod?: string;
  transactionId?: string;
  receiptNumber?: string;
  createdAt: string;
}

export interface ABDMConsent {
  id: string;
  consentId: string;
  patientId: string;
  patientName: string;
  requesterName: string;
  requesterHospital?: string;
  abhaNumber?: string;
  purpose: string;
  hiTypes: string[];
  status: 'REQUESTED' | 'GRANTED' | 'DENIED' | 'REVOKED';
  dateRange?: { from: string; to: string };
  dateFrom?: string;
  dateTo?: string;
  expiryDate: string;
  createdAt: string;
}

export interface HospitalStats {
  totalPatients: number;
  activeOPD: number;
  occupiedBeds: number;
  totalBeds: number;
  dailyRevenue: number;
  labTestsPending: number;
  totalOPD?: number;
  waitingOPD?: number;
  bedOccupancyRate?: number;
  totalRevenue?: number;
  abhaAdoptionRate?: number;
}
