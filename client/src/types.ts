export type UserRole = 'SUPER_ADMIN' | 'DOCTOR' | 'RECEPTIONIST' | 'LAB_TECHNICIAN' | 'PHARMACIST' | 'PATIENT';

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: UserRole;
  department?: string;
  qualification?: string;
  hprId?: string;
  opdRoom?: string;
  abhaNumber?: string;
  abhaAddress?: string;
  badge?: string;
  avatar?: string;
  consultationFee?: number;
}

export interface Patient {
  id: string;
  name: string;
  mobile: string;
  email: string;
  abhaNumber?: string;
  abhaAddress?: string;
  aadhaarLast4?: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  age: number;
  bloodGroup: string;
  address: string;
  district: string;
  state: string;
  pincode: string;
  emergencyContact: string;
  insuranceProvider?: string;
  insurancePolicyNo?: string;
  allergies: string[];
  chronicConditions: string[];
  photoUrl?: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  tokenNumber: string;
  patientId: string;
  patientName: string;
  abhaNumber?: string;
  doctorId: string;
  doctorName: string;
  department: string;
  opdRoom: string;
  date: string;
  timeSlot: string;
  type: string;
  priority: 'Normal' | 'Urgent' | 'Emergency';
  status: 'Waiting' | 'In-Consultation' | 'Completed' | 'Cancelled';
  fee: number;
  paymentStatus: 'PAID' | 'PENDING';
  symptoms: string;
  createdAt: string;
}

export interface Vitals {
  bloodPressure?: string;
  pulseRate?: string;
  spo2?: string;
  temperature?: string;
  weight?: string;
  height?: string;
  bmi?: string;
}

export interface PrescriptionItem {
  medicine: string;
  dosage: string;
  duration: string;
  instructions: string;
}

export interface EHR {
  id: string;
  patientId: string;
  patientName: string;
  abhaNumber?: string;
  doctorId: string;
  doctorName: string;
  department: string;
  date: string;
  vitals: Vitals;
  symptoms: string;
  diagnosis: string;
  clinicalNotes: string;
  prescriptions: PrescriptionItem[];
  recommendedTests: string[];
  followUpDate: string;
  createdAt: string;
}

export interface LabTest {
  id: string;
  patientId: string;
  patientName: string;
  abhaNumber?: string;
  testName: string;
  category: string;
  doctorName: string;
  sampleType: string;
  status: 'Sample Collection Pending' | 'In-Progress' | 'Completed';
  isCritical: boolean;
  findings?: string;
  reportUrl?: string;
  downloadBadge?: string;
  technician?: string;
  verifiedBy?: string;
  createdAt: string;
}

export interface Bed {
  id: string;
  ward: string;
  bedNumber: string;
  type: string;
  status: 'Available' | 'Occupied' | 'Maintenance';
  patientName?: string | null;
  patientId?: string | null;
  oxygenSupport: boolean;
  ventilator: boolean;
  dailyRate: number;
  allocatedAt?: string;
}

export interface Medicine {
  code: string;
  name: string;
  category: string;
  batchNumber: string;
  stockQuantity: number;
  price: number;
  expiryDate: string;
  manufacturer: string;
}

export interface BloodStock {
  bloodGroup: string;
  unitsAvailable: number;
  component: string;
  status: string;
  lastUpdated: string;
}

export interface BillItem {
  name: string;
  amount: number;
}

export interface Bill {
  id: string;
  invoiceNumber: string;
  patientId: string;
  patientName: string;
  abhaNumber?: string;
  serviceType: string;
  items: BillItem[];
  totalAmount: number;
  discount: number;
  tax: number;
  netAmount: number;
  paymentMethod: 'UPI' | 'Razorpay' | 'Stripe' | 'Cash';
  transactionId: string;
  status: 'PAID' | 'PENDING' | 'REFUNDED';
  createdAt: string;
}

export interface ABDMConsent {
  id: string;
  consentRequestId: string;
  patientId: string;
  patientName: string;
  abhaNumber: string;
  requesterHospital: string;
  purpose: string;
  healthInfoTypes: string[];
  dateFrom: string;
  dateTo: string;
  expiryDate: string;
  status: 'REQUESTED' | 'GRANTED' | 'DENIED' | 'REVOKED';
  grantedAt?: string;
}

export interface HospitalStats {
  totalPatients: number;
  totalOPD: number;
  waitingOPD: number;
  totalBeds: number;
  occupiedBeds: number;
  bedOccupancyRate: number;
  totalRevenue: number;
  totalLabTests: number;
  criticalLabCount: number;
  totalMedsStock: number;
  lowStockMeds: number;
  abhaLinkedCount: number;
  abhaAdoptionRate: number;
}
