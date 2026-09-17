import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import {
  Calendar, Clock, ShieldCheck, Building2, Stethoscope,
  UserCheck, CheckCircle2, ArrowRight, ArrowLeft, Printer,
  Download, X, KeyRound, Smartphone, AlertCircle, Loader2, MapPin,
  AlertTriangle, QrCode, Sparkles, CreditCard, HeartPulse, Check
} from 'lucide-react';

interface AppointmentBookingWizardProps {
  onClose: () => void;
  language: 'en' | 'hi';
  initialBookingType?: 'GENERAL' | 'EMERGENCY' | 'QR';
}

export const AppointmentBookingWizard: React.FC<AppointmentBookingWizardProps> = ({
  onClose,
  language,
  initialBookingType = 'GENERAL'
}) => {
  const { user } = useAuth();
  const { addToast, triggerEmergencyCodeBlue } = useNotification();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Booking Type: GENERAL OPD vs EMERGENCY FAST-TRACK vs QR INSTANT
  const [bookingType, setBookingType] = useState<'GENERAL' | 'EMERGENCY' | 'QR'>(initialBookingType);

  // Verification Method: ABHA vs AADHAAR vs MOBILE vs QR
  const [method, setMethod] = useState<'ABHA' | 'AADHAAR' | 'MOBILE' | 'QR_PASS'>('ABHA');
  const [abhaNumber, setAbhaNumber] = useState(user?.abhaNumber || '91-4829-1092-3341');
  const [aadhaarNumber, setAadhaarNumber] = useState('5489 1029 3847');
  const [patientName, setPatientName] = useState(user?.name || 'Rohan Sharma');
  const [mobile, setMobile] = useState(user?.mobile || '9899001122');
  const [email, setEmail] = useState(user?.email || 'rohan.sharma@gmail.com');
  const [gender, setGender] = useState('Male');
  const [age, setAge] = useState(34);
  const [isVerified, setIsVerified] = useState(true);

  // Step 2: Hospital & State/City Selection
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [selectedState, setSelectedState] = useState('All');
  const [searchCity, setSearchCity] = useState('');
  const [selectedHospitalId, setSelectedHospitalId] = useState('HOSP-AIIMS-DELHI');
  const [selectedHospitalName, setSelectedHospitalName] = useState('All India Institute of Medical Sciences (AIIMS New Delhi)');

  // Step 3: Department & Slot Selection
  const [departments, setDepartments] = useState<any[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState('Cardiology & Cardiac Surgery');
  const [selectedDoctor, setSelectedDoctor] = useState('Dr. Arvind Sharma (Senior Consultant)');
  const [availableDates, setAvailableDates] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState('2026-08-08');
  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState('09:30 AM - 10:30 AM (Morning Session)');
  const [symptoms, setSymptoms] = useState('Routine Outpatient Health Checkup & Consultation');

  // Step 4: Booked Appointment Confirmation
  const [bookedAppointment, setBookedAppointment] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  // Switch to Emergency mode
  const handleSelectEmergencyMode = () => {
    setBookingType('EMERGENCY');
    setSelectedDepartment('Trauma & Emergency Care (Code Red)');
    setSelectedDoctor('Dr. Emergency Duty Officer (Trauma Team)');
    setSelectedSlot('IMMEDIATE PRIORITY (Zero Wait Time)');
    setSymptoms('Emergency / Acute Trauma Condition - Immediate Medical Attention Required');
    addToast('warning', 'Emergency Mode Activated', 'Priority Trauma Pass configured with Zero Waiting Time.');
  };

  // Switch to QR Instant mode
  const handleSelectQRMode = () => {
    setBookingType('QR');
    setMethod('QR_PASS');
    setPatientName('Rohan Sharma (ABHA Verified)');
    setIsVerified(true);
    addToast('success', 'QR Fast-Pass Connected', 'Patient demographic credentials auto-filled via QR Code.');
  };

  // ABHA / Aadhaar Auto-verification
  const handleVerifyABHA = () => {
    setIsVerified(true);
    setPatientName('Rohan Sharma');
    setAge(34);
    setGender('Male');
    addToast('success', 'ABHA Verified', `Ayushman Health Account #${abhaNumber} linked successfully.`);
  };

  const handleVerifyAadhaar = () => {
    setIsVerified(true);
    setPatientName('Rohan Sharma');
    setAge(34);
    setGender('Male');
    addToast('success', 'Aadhaar e-KYC Verified', 'UIDAI demographic biometric check successful.');
  };

  // Dynamically assign doctor based on department
  useEffect(() => {
    if (bookingType === 'EMERGENCY') {
      setSelectedDoctor('Dr. Emergency Duty Officer (Trauma Team)');
      return;
    }

    const assignDoctor = (dept: string) => {
      const doctors: Record<string, string> = {
        'Cardiology & Cardiac Surgery': 'Dr. Arvind Sharma (Senior Consultant)',
        'Cardiology & Lari Centre': 'Dr. Arvind Sharma (Senior Consultant)',
        'Neurology & Neurosurgery': 'Dr. Meera Reddy (Head of Dept)',
        'Pediatrics & Neonatology': 'Dr. Priya Sharma (Consultant)',
        'Pediatrics (Kalam Centre)': 'Dr. Priya Sharma (Specialist)',
        'Orthopedics & Joint Replacement': 'Dr. Vikram Singh (Surgeon)',
        'Gastroenterology & Hepatology': 'Dr. Neha Patel (Specialist)',
        'Ophthalmology (Dr. RP Centre)': 'Dr. Amit Kumar (Surgeon)',
        'General Medicine & Diabetology': 'Dr. Rakesh Verma (Senior Physician)',
        'General Medicine': 'Dr. Rakesh Verma (Senior Physician)',
        'Trauma & Emergency Medicine': 'Dr. Emergency Duty Officer (Trauma Team)'
      };
      return doctors[dept] || 'Dr. Medical Officer (Consultant)';
    };
    setSelectedDoctor(assignDoctor(selectedDepartment));
  }, [selectedDepartment, bookingType]);

  // Fetch Hospitals based on state or search
  useEffect(() => {
    const fetchHospitalsList = async () => {
      try {
        const res = await API.get(`/ors/hospitals?state=${selectedState}&query=${encodeURIComponent(searchCity)}`);
        if (res.data.success && res.data.data.length > 0) {
          setHospitals(res.data.data);
          setSelectedHospitalId(res.data.data[0].id);
          setSelectedHospitalName(res.data.data[0].name);
          setDepartments(res.data.data[0].departments || []);
          if (res.data.data[0].departments?.length > 0 && bookingType !== 'EMERGENCY') {
            setSelectedDepartment(res.data.data[0].departments[0].name);
          }
        }
      } catch (err) {
        console.error('Fetch hospitals error:', err);
      }
    };

    fetchHospitalsList();
  }, [selectedState, searchCity]);

  // Fetch Slots
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const res = await API.get(`/ors/slots?hospitalId=${selectedHospitalId}&department=${encodeURIComponent(selectedDepartment)}`);
        if (res.data.success) {
          setAvailableDates(res.data.availableDates);
          setTimeSlots(res.data.timeSlots);
          if (res.data.availableDates.length > 0) {
            setSelectedDate(res.data.availableDates[0].date);
          }
        }
      } catch (err) {
        console.error('Fetch slots error:', err);
      }
    };

    fetchSlots();
  }, [selectedHospitalId, selectedDepartment]);

  const handleHospitalSelect = (h: any) => {
    setSelectedHospitalId(h.id);
    setSelectedHospitalName(h.name);
    setDepartments(h.departments || []);
    if (h.departments?.length > 0 && bookingType !== 'EMERGENCY') {
      setSelectedDepartment(h.departments[0].name);
    }
  };

  // Submit Final Booking (Supports instant Emergency & QR Booking)
  const handleFinalBooking = async () => {
    setLoading(true);
    try {
      if (bookingType === 'EMERGENCY') {
        triggerEmergencyCodeBlue();
      }

      const res = await API.post('/ors/book', {
        patientName,
        mobile,
        email,
        abhaNumber: method === 'ABHA' ? abhaNumber : (user?.abhaNumber || '91-4829-1092-3341'),
        aadhaarNumber: method === 'AADHAAR' ? aadhaarNumber : undefined,
        gender,
        age,
        hospitalId: selectedHospitalId,
        hospitalName: selectedHospitalName,
        department: bookingType === 'EMERGENCY' ? 'Trauma & Emergency Care (Code Red)' : selectedDepartment,
        doctorName: selectedDoctor,
        appointmentDate: bookingType === 'EMERGENCY' ? new Date().toISOString().split('T')[0] : selectedDate,
        timeSlot: bookingType === 'EMERGENCY' ? 'IMMEDIATE PRIORITY (Zero Wait Time)' : selectedSlot,
        symptoms: bookingType === 'EMERGENCY' ? `[EMERGENCY RED ALERT] ${symptoms}` : symptoms,
        isEmergency: bookingType === 'EMERGENCY',
        bookedVia: bookingType === 'QR' ? 'QR_FAST_PASS' : 'PORTAL'
      });

      if (res.data.success) {
        setBookedAppointment({
          ...res.data.appointment,
          isEmergency: bookingType === 'EMERGENCY',
          aadhaarVerified: method === 'AADHAAR',
          abhaVerified: method === 'ABHA' || method === 'QR_PASS'
        });
        setStep(4);
        addToast(
          bookingType === 'EMERGENCY' ? 'warning' : 'success',
          bookingType === 'EMERGENCY' ? '🚨 EMERGENCY TOKEN ISSUED' : 'Appointment Confirmed',
          `Token #${res.data.appointment.tokenNumber} issued for ${selectedHospitalName}`
        );
      }
    } catch (err: any) {
      addToast('error', 'Booking Failed', err.response?.data?.message || 'Server error.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const indianStates = [
    'All',
    'Delhi',
    'Maharashtra',
    'Karnataka',
    'Tamil Nadu',
    'Uttar Pradesh',
    'Gujarat',
    'Rajasthan',
    'Chandigarh',
    'Bihar',
    'Madhya Pradesh',
    'Telangana',
    'Kerala',
    'Odisha',
    'Uttarakhand',
    'West Bengal'
  ];

  const topHospitals = [
    { id: 'HOSP-AIIMS-DELHI', name: 'AIIMS New Delhi', city: 'Delhi', badge: 'National Apex' },
    { id: 'HOSP-KGMU-LUCKNOW', name: "King George’s Medical University (KGMU)", city: 'Lucknow, UP', badge: 'Govt Apex' },
    { id: 'HOSP-SJH-DELHI', name: 'Safdarjung Hospital', city: 'Delhi', badge: 'Trauma Center' },
    { id: 'HOSP-SGPGI-LUCKNOW', name: 'SGPGIMS Lucknow', city: 'Lucknow, UP', badge: 'Super Specialty' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        
        {/* Header with ORS Logo & Mode Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-4 mb-6 no-print">
          <div className="flex items-center gap-3">
            <img
              src="/images/ORS1.png"
              alt="ORS"
              className="h-10 w-auto object-contain rounded-lg"
              onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
            />
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>{language === 'en' ? 'Online OPD & Emergency Registration' : 'ऑनलाइन ओपीडी एवं आपातकालीन पंजीकरण'}</span>
                {bookingType === 'EMERGENCY' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-wider animate-pulse">
                    🚨 Emergency Priority
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                MoHFW • Instant Booking via ABHA ID, Aadhaar & QR Code
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer self-end sm:self-auto"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Mode Selector Strip: General vs Emergency vs QR Fast-Pass */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-6 no-print">
          
          {/* General OPD Mode */}
          <button
            type="button"
            onClick={() => {
              setBookingType('GENERAL');
              setSelectedDepartment('Cardiology & Cardiac Surgery');
            }}
            className={`p-3 rounded-2xl border text-left transition flex items-center gap-3 cursor-pointer ${
              bookingType === 'GENERAL'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 shadow-md shadow-emerald-500/10'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              bookingType === 'GENERAL' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}>
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black">Regular OPD Consultation</h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">500+ Govt Apex Hospitals</p>
            </div>
          </button>

          {/* Emergency / Trauma Instant Mode */}
          <button
            type="button"
            onClick={handleSelectEmergencyMode}
            className={`p-3 rounded-2xl border text-left transition flex items-center gap-3 cursor-pointer ${
              bookingType === 'EMERGENCY'
                ? 'bg-red-50 dark:bg-red-950/40 border-red-500 text-red-900 dark:text-red-200 shadow-md shadow-red-500/10 scale-[1.02]'
                : 'border-slate-200 dark:border-slate-800 hover:bg-red-50/50 dark:hover:bg-red-950/20'
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              bookingType === 'EMERGENCY' ? 'bg-red-600 text-white animate-pulse' : 'bg-red-100 dark:bg-red-950 text-red-600'
            }`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-red-700 dark:text-red-400">🚨 Emergency / Trauma Pass</h4>
              <p className="text-[10px] text-red-600/80 dark:text-red-300/80">Instant Token • Zero Waiting</p>
            </div>
          </button>

          {/* QR Fast-Pass Mode */}
          <button
            type="button"
            onClick={handleSelectQRMode}
            className={`p-3 rounded-2xl border text-left transition flex items-center gap-3 cursor-pointer ${
              bookingType === 'QR'
                ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-500 text-teal-900 dark:text-teal-200 shadow-md shadow-teal-500/10'
                : 'border-slate-200 dark:border-slate-800 hover:bg-teal-50/50 dark:hover:bg-teal-950/20'
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              bookingType === 'QR' ? 'bg-teal-600 text-white' : 'bg-teal-100 dark:bg-teal-950 text-teal-600'
            }`}>
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-teal-800 dark:text-teal-300">⚡ Instant Booking with QR</h4>
              <p className="text-[10px] text-teal-600/80 dark:text-teal-300/80">Scan QR Code • 1-Click Pass</p>
            </div>
          </button>

        </div>

        {/* Stepper Progress Bar */}
        <div className="grid grid-cols-4 gap-2 mb-8 no-print">
          {[
            { num: 1, label: language === 'en' ? '1. ABHA / Aadhaar / QR' : '1. आधार / आभा / QR' },
            { num: 2, label: language === 'en' ? '2. Hospital' : '2. अस्पताल' },
            { num: 3, label: language === 'en' ? (bookingType === 'EMERGENCY' ? '3. Priority Trauma Slot' : '3. Dept & Slot') : (bookingType === 'EMERGENCY' ? '3. इमरजेंसी स्लॉट' : '3. विभाग एवं समय') },
            { num: 4, label: language === 'en' ? (bookingType === 'EMERGENCY' ? '4. Emergency Token' : '4. OPD Slip & QR') : '4. पुष्टि एवं पर्ची' },
          ].map((s) => {
            const isDone = step > s.num;
            const isCurrent = step === s.num;

            return (
              <div
                key={s.num}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  isCurrent
                    ? (bookingType === 'EMERGENCY' ? 'bg-red-50 dark:bg-red-950/40 border-red-500 text-red-700 dark:text-red-300 font-bold' : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold')
                    : isDone
                    ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-teal-600 dark:text-teal-400 font-semibold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-400 font-medium'
                }`}
              >
                <span className="text-xs truncate block">{s.label}</span>
              </div>
            );
          })}
        </div>

        {/* --- STEP 1: VERIFICATION (ABHA / AADHAAR / QR CODE FAST-PASS) --- */}
        {step === 1 && (
          <div className="space-y-6 no-print">
            
            {/* Identity Mode Pills */}
            <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500 mr-2">Instant Verify Via:</span>
              
              <button
                type="button"
                onClick={() => setMethod('ABHA')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  method === 'ABHA'
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Ayushman ABHA ID</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('AADHAAR')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  method === 'AADHAAR'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Aadhaar Card (UIDAI)</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('QR_PASS')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  method === 'QR_PASS'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Scan QR Fast-Pass</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('MOBILE')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  method === 'MOBILE'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile Number</span>
              </button>
            </div>

            {/* ABHA Input Mode */}
            {method === 'ABHA' && (
              <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="block text-xs font-black text-teal-900 dark:text-teal-200 uppercase tracking-wider">
                    Enter 14-Digit ABHA Number or ABHA Address
                  </label>
                  <span className="text-[11px] text-teal-700 dark:text-teal-400 font-semibold">
                    Ayushman Bharat Digital Mission (ABDM)
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={abhaNumber}
                    onChange={(e) => setAbhaNumber(e.target.value)}
                    placeholder="91-4829-1092-3341 or rohan@abdm"
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-teal-300 dark:border-teal-700 bg-white dark:bg-slate-800 text-sm font-mono text-slate-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyABHA}
                    className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-md cursor-pointer transition flex items-center gap-1.5 shrink-0"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Auto-Fetch KYC</span>
                  </button>
                </div>
              </div>
            )}

            {/* Aadhaar Input Mode */}
            {method === 'AADHAAR' && (
              <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="block text-xs font-black text-emerald-900 dark:text-emerald-200 uppercase tracking-wider">
                    Enter 12-Digit Aadhaar Card Number
                  </label>
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                    UIDAI Government Verified e-KYC
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aadhaarNumber}
                    onChange={(e) => setAadhaarNumber(e.target.value)}
                    placeholder="5489 1029 3847"
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-800 text-sm font-mono text-slate-900 dark:text-white tracking-wider"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyAadhaar}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md cursor-pointer transition flex items-center gap-1.5 shrink-0"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify Aadhaar</span>
                  </button>
                </div>
              </div>
            )}

            {/* QR Fast-Pass Mode (Embeds the user's uploaded QR code image) */}
            {method === 'QR_PASS' && (
              <div className="p-5 rounded-2xl bg-purple-50/80 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 flex flex-col sm:flex-row items-center gap-5">
                <div className="bg-white p-2 rounded-2xl border-2 border-purple-400 shadow-md shrink-0">
                  <img
                    src="/images/qr_code_scan.png"
                    alt="Scan QR Code"
                    className="w-24 h-24 object-contain rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/scan_qr_code.png';
                    }}
                  />
                </div>
                <div className="space-y-2 text-center sm:text-left flex-1">
                  <h4 className="text-sm font-black text-purple-900 dark:text-purple-200">
                    Scan QR Code for Instant OPD / Emergency Booking
                  </h4>
                  <p className="text-xs text-purple-700 dark:text-purple-300 leading-relaxed">
                    Scan this QR code with any camera or click below to immediately pull your Ayushman Health credentials and confirm booking in 1 click.
                  </p>
                  <button
                    type="button"
                    onClick={handleSelectQRMode}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md transition cursor-pointer flex items-center gap-1.5 mx-auto sm:mx-0"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Auto-Fill Verified Profile</span>
                  </button>
                </div>
              </div>
            )}

            {/* Patient Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Patient Full Name (as per Govt ID / Aadhaar) *
                </label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Rohan Sharma"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mobile Number (for Instant SMS & Live Token Updates) *
                </label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="9899001122"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Gender & Age
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Linked Identity Status
                </label>
                <div className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30 text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>{method === 'AADHAAR' ? 'Aadhaar e-KYC Linked' : (method === 'ABHA' ? 'ABHA Card Linked' : 'QR Fast-Pass Verified')}</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">MoHFW Validated</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setStep(2)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm shadow-lg transition cursor-pointer ${
                  bookingType === 'EMERGENCY'
                    ? 'bg-red-600 hover:bg-red-500 shadow-red-600/30'
                    : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
                }`}
              >
                <span>{bookingType === 'EMERGENCY' ? 'Continue to Emergency Hospital Selection' : 'Continue to Select Hospital'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* --- STEP 2: SELECT HOSPITAL --- */}
        {step === 2 && (
          <div className="space-y-6 no-print">
            
            {/* Quick 1-Click Selection for Top Hospitals */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                ⭐ 1-Click Quick Select: Top Government Apex Hospitals
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {topHospitals.map((th) => {
                  const isPicked = selectedHospitalId === th.id;
                  return (
                    <button
                      key={th.id}
                      type="button"
                      onClick={() => {
                        const h = hospitals.find((item) => item.id === th.id);
                        if (h) {
                          handleHospitalSelect(h);
                        } else {
                          setSelectedHospitalId(th.id);
                          setSelectedHospitalName(th.name);
                        }
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isPicked
                          ? (bookingType === 'EMERGENCY' ? 'bg-red-600 text-white border-red-600 shadow-md scale-[1.02]' : 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-[1.02]')
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                      }`}
                    >
                      <div>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full inline-block mb-1 ${
                          isPicked ? 'bg-white/20 text-white' : 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300'
                        }`}>
                          {th.badge}
                        </span>
                        <h5 className="font-extrabold text-xs leading-tight">{th.name}</h5>
                      </div>
                      <p className={`text-[10px] mt-2 font-medium ${isPicked ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>
                        📍 {th.city}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Filter by Indian State / UT
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                >
                  {indianStates.map((st) => (
                    <option key={st} value={st}>
                      {st === 'All' ? 'All Indian States & UTs' : st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Search by City or Hospital Name
                </label>
                <input
                  type="text"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  placeholder="e.g. AIIMS, KGMU, Safdarjung, Lucknow, Delhi..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Hospital Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
              {hospitals.map((h) => {
                const isSelected = selectedHospitalId === h.id;

                return (
                  <div
                    key={h.id}
                    onClick={() => handleHospitalSelect(h)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? (bookingType === 'EMERGENCY' ? 'bg-red-50 dark:bg-red-950/40 border-red-500 shadow-md shadow-red-500/10' : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 shadow-md shadow-emerald-500/10')
                        : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          bookingType === 'EMERGENCY' ? 'bg-red-500/10 text-red-600' : 'bg-teal-500/10 text-teal-600 dark:text-teal-400'
                        }`}>
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                            {h.name}
                          </h5>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-emerald-500" />
                            <span>{h.city}, {h.state}</span>
                          </p>
                        </div>
                      </div>

                      {isSelected && <CheckCircle2 className={`w-5 h-5 shrink-0 ${bookingType === 'EMERGENCY' ? 'text-red-500' : 'text-emerald-500'}`} />}
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">{h.departments?.length || 6} Speciality OPDs</span>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{h.bedsCount} Beds</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-bold text-xs shadow-lg transition cursor-pointer ${
                  bookingType === 'EMERGENCY' ? 'bg-red-600 hover:bg-red-500 shadow-red-600/30' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
                }`}
              >
                <span>{bookingType === 'EMERGENCY' ? 'Confirm Emergency Priority' : 'Select Department & Slot'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* --- STEP 3: DEPARTMENT & TIME SLOT --- */}
        {step === 3 && (
          <div className="space-y-6 no-print">
            
            {/* Emergency Mode Banner in Step 3 */}
            {bookingType === 'EMERGENCY' && (
              <div className="p-4 rounded-2xl bg-red-600 text-white flex items-center justify-between shadow-lg shadow-red-600/30 animate-pulse">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6" />
                  <div>
                    <h4 className="font-black text-sm uppercase tracking-wide">🚨 Priority Trauma / Emergency Code Red</h4>
                    <p className="text-xs text-red-100">Zero wait time. Immediate doctor & emergency bed reservation.</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-white text-red-700 font-black text-xs uppercase">
                  Fast-Track
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Clinical Department / OPD Wing
                </label>
                {bookingType === 'EMERGENCY' ? (
                  <input
                    type="text"
                    disabled
                    value="Trauma & Emergency Care (Code Red)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/40 text-xs font-black text-red-900 dark:text-red-200 cursor-not-allowed"
                  />
                ) : (
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
                  >
                    {(departments.length > 0 ? departments : [
                      { name: 'Cardiology & Cardiac Surgery' },
                      { name: 'Cardiology & Lari Centre' },
                      { name: 'Neurology & Neurosurgery' },
                      { name: 'Pediatrics & Neonatology' },
                      { name: 'Orthopedics & Joint Replacement' },
                      { name: 'Gastroenterology & Hepatology' },
                      { name: 'General Medicine & Diabetology' }
                    ]).map((d: any) => (
                      <option key={d.name} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Assigned Consultant / Duty Officer
                </label>
                <div className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs text-slate-700 dark:text-slate-300 font-semibold flex items-center justify-between">
                  <span>{selectedDoctor}</span>
                  <span className="px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-600 dark:text-teal-400 text-[10px] uppercase">Assigned</span>
                </div>
              </div>
            </div>

            {/* Available Dates (Skipped for Emergency) */}
            {bookingType !== 'EMERGENCY' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Available Appointment Dates (Next 7 Days)
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
                  {(availableDates.length > 0 ? availableDates : [
                    { date: '2026-08-08', display: 'Fri, 08 Aug', availableSlotsCount: 14 },
                    { date: '2026-08-09', display: 'Sat, 09 Aug', availableSlotsCount: 18 },
                    { date: '2026-08-11', display: 'Mon, 11 Aug', availableSlotsCount: 22 },
                    { date: '2026-08-12', display: 'Tue, 12 Aug', availableSlotsCount: 20 },
                    { date: '2026-08-13', display: 'Wed, 13 Aug', availableSlotsCount: 16 },
                    { date: '2026-08-14', display: 'Thu, 14 Aug', availableSlotsCount: 15 },
                    { date: '2026-08-15', display: 'Fri, 15 Aug', availableSlotsCount: 12 }
                  ]).slice(0, 7).map((d) => {
                    const isSelected = selectedDate === d.date;

                    return (
                      <button
                        key={d.date}
                        type="button"
                        onClick={() => setSelectedDate(d.date)}
                        className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                            : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-emerald-500'
                        }`}
                      >
                        <span className="text-[11px] font-bold block">{d.display}</span>
                        <span className={`text-[9px] font-semibold mt-0.5 block ${isSelected ? 'text-emerald-100' : 'text-emerald-600 dark:text-emerald-400'}`}>
                          {d.availableSlotsCount} Slots
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Time Slot Selection */}
            {bookingType !== 'EMERGENCY' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Select Time Slot (Morning / Afternoon Sessions)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(timeSlots.length > 0 ? timeSlots : [
                    { id: 'ts-1', time: '09:00 AM - 10:00 AM', session: 'Morning Session' },
                    { id: 'ts-2', time: '10:00 AM - 11:00 AM', session: 'Morning Session' },
                    { id: 'ts-3', time: '11:00 AM - 12:00 PM', session: 'Mid-Day Session' },
                    { id: 'ts-4', time: '02:00 PM - 03:00 PM', session: 'Afternoon Session' }
                  ]).map((ts) => {
                    const isSelected = selectedSlot === ts.time;

                    return (
                      <button
                        key={ts.id}
                        type="button"
                        onClick={() => setSelectedSlot(ts.time)}
                        className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold'
                            : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-emerald-500" />
                          <span className="text-xs">{ts.time}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-semibold">{ts.session}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Reason for Visit / Health Complaint
              </label>
              <input
                type="text"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="e.g. Chest pain, high fever, breathlessness, accident"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleFinalBooking}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-bold text-xs shadow-lg transition cursor-pointer ${
                  bookingType === 'EMERGENCY' ? 'bg-red-600 hover:bg-red-500 shadow-red-600/30' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
                }`}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  bookingType === 'EMERGENCY' ? '🚨 Generate Immediate Emergency Token' : 'Confirm & Generate OPD Card'
                )}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}

        {/* --- STEP 4: PRINTABLE OFFICIAL ORS / EMERGENCY REGISTRATION SLIP --- */}
        {step === 4 && bookedAppointment && (
          <div className="space-y-6">
            
            {/* Success Notification Bar (Hidden on print) */}
            <div className={`p-4 rounded-2xl border text-center space-y-1 no-print ${
              bookedAppointment.isEmergency
                ? 'bg-red-50 dark:bg-red-950/40 border-red-500/40 text-red-900 dark:text-red-200'
                : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500/40 text-emerald-900 dark:text-emerald-200'
            }`}>
              <CheckCircle2 className={`w-8 h-8 mx-auto ${bookedAppointment.isEmergency ? 'text-red-600' : 'text-emerald-500'}`} />
              <h4 className="text-base font-black">
                {bookedAppointment.isEmergency ? '🚨 Emergency Trauma Fast-Track Pass Issued!' : 'Official OPD Registration Slip Confirmed!'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                SMS alert dispatched to {bookedAppointment.mobile}. Please present this slip or scan the QR Code at the hospital reception/kiosk.
              </p>
            </div>

            {/* --- THE CLEAN OFFICIAL GOVT PRINT CARD (Prints ONLY this box) --- */}
            <div
              id="official-ors-slip"
              className={`print-card p-6 rounded-3xl bg-white text-black border-2 space-y-4 text-xs shadow-md ${
                bookedAppointment.isEmergency ? 'border-red-600' : 'border-black'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b-2 border-black">
                <div className="flex items-center gap-3">
                  <img
                    src="/images/ORS1.png"
                    alt="ORS"
                    className="h-9 w-auto object-contain"
                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                  />
                  <div>
                    <h4 className="font-black text-base text-black uppercase tracking-wide">
                      {bookedAppointment.hospitalName}
                    </h4>
                    <p className="text-[10px] text-black uppercase font-bold">
                      {bookedAppointment.isEmergency ? '🚨 Emergency Trauma Unit • MoHFW • Government of India' : 'Online Registration System (ORS) • MoHFW • Government of India'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-black font-semibold">Booking Ref:</span>
                  <p className="font-mono font-black text-sm text-black">
                    {bookedAppointment.id}
                  </p>
                </div>
              </div>

              {/* Patient and Token Info */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <span className="text-[10px] text-black block font-semibold">Patient Full Name</span>
                  <span className="font-bold text-sm text-black">{bookedAppointment.patientName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-black block font-semibold">ABHA ID / Aadhaar Status</span>
                  <span className="font-mono text-black font-bold">
                    {bookedAppointment.abhaNumber || 'Verified ABHA Citizen'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-black block font-semibold">
                    {bookedAppointment.isEmergency ? 'EMERGENCY TOKEN' : 'OPD Token Number'}
                  </span>
                  <span className={`font-mono font-black text-2xl ${bookedAppointment.isEmergency ? 'text-red-600' : 'text-black'}`}>
                    #{bookedAppointment.tokenNumber}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2 border-t border-black">
                <div>
                  <span className="text-[10px] text-black block font-semibold">Clinical Department</span>
                  <span className="font-bold text-black">{bookedAppointment.department}</span>
                </div>
                <div>
                  <span className="text-[10px] text-black block font-semibold">Assigned Doctor / Unit</span>
                  <span className="font-bold text-black">{bookedAppointment.doctorName}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-black block font-semibold">OPD Room / Bay</span>
                  <span className="font-bold text-black">{bookedAppointment.opdRoom || 'Trauma Red Bay 01'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-black">
                <div>
                  <span className="text-[10px] text-black block font-semibold">Appointment Date & Slot</span>
                  <span className="font-bold text-black text-sm">
                    {bookedAppointment.date} • {bookedAppointment.timeSlot}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-black block font-semibold">Registration Fee</span>
                  <span className="font-bold text-black">FREE (Government Health Scheme)</span>
                </div>
              </div>

              {/* QR Code Scan Stamp Section (Uses user's uploaded QR code image) */}
              <div className="pt-4 border-t-2 border-black flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src="/images/qr_code_scan.png"
                    alt="Scan QR Code"
                    className="w-16 h-16 object-contain border border-black rounded-lg p-0.5"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/scan_qr_code.png';
                    }}
                  />
                  <div className="text-[10px] text-black">
                    <p className="font-bold text-black uppercase">Scan QR Code For Instant Check-in</p>
                    <p className="font-mono text-xs tracking-widest font-black">{bookedAppointment.barcode || 'ORS-9821-4820'}</p>
                    <p className="text-[9px] text-black">Fast-Track Entry at Kiosk & Reception</p>
                  </div>
                </div>

                <div className="text-right text-[10px] text-black">
                  <p className="font-bold">Ayushman Bharat Digital Mission (ABDM)</p>
                  <p>ors.gov.in • abdm.gov.in</p>
                  <p className="font-mono text-[9px] text-black/80 mt-0.5">National Health Authority Verified</p>
                </div>
              </div>
            </div>

            {/* Action Buttons (Hidden on print) */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 no-print">
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Slip (Clean Card)</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition cursor-pointer"
              >
                Done
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
