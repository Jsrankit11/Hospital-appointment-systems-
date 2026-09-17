import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import {
  Calendar, Clock, ShieldCheck, Building2, Stethoscope,
  UserCheck, CheckCircle2, ArrowRight, ArrowLeft, Printer,
  Download, X, KeyRound, Smartphone, AlertCircle, Loader2, MapPin,
  Sparkles, Star
} from 'lucide-react';

interface AppointmentBookingWizardProps {
  onClose: () => void;
  language: 'en' | 'hi';
  initialHospitalId?: string;
  initialDepartment?: string;
  initialDoctor?: string;
}

export const AppointmentBookingWizard: React.FC<AppointmentBookingWizardProps> = ({
  onClose,
  language,
  initialHospitalId = 'HOSP-KGMU-LUCKNOW',
  initialDepartment,
  initialDoctor
}) => {
  const { user } = useAuth();
  const { addToast } = useNotification();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Citizen Verification State (Pre-filled from logged in user if available)
  const [patientName, setPatientName] = useState(user?.name || 'Rohan Sharma');
  const [mobile, setMobile] = useState(user?.mobile || '9899001122');
  const [email, setEmail] = useState(user?.email || 'rohan.sharma@gmail.com');
  const [gender, setGender] = useState('Male');
  const [age, setAge] = useState(34);
  const [abhaNumber, setAbhaNumber] = useState(user?.abhaNumber || '91-4829-1092-3341');

  // Step 2: Hospital & State/City Selection
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [selectedState, setSelectedState] = useState('All');
  const [searchCity, setSearchCity] = useState('');
  const [selectedHospitalId, setSelectedHospitalId] = useState(initialHospitalId);
  const [selectedHospitalName, setSelectedHospitalName] = useState("King George’s Medical University (KGMU Lucknow)");

  // Step 3: Department & Slot Selection
  const [departments, setDepartments] = useState<any[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState(initialDepartment || 'Cardiology & Lari Centre');
  const [selectedDoctor, setSelectedDoctor] = useState(initialDoctor || 'Dr. Arvind Sharma (Senior Consultant)');
  const [availableDates, setAvailableDates] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState('2026-08-08');
  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState('09:30 AM - 10:30 AM (Morning Session)');
  const [symptoms, setSymptoms] = useState('Routine Outpatient Health Checkup & Consultation');

  // Doctor Profiles mapping for realistic display with avatars
  const doctorProfiles: Record<string, { name: string; title: string; image: string; exp: string }> = {
    'Cardiology & Lari Centre': {
      name: 'Dr. Arvind Sharma (Senior Consultant)',
      title: 'MD, DM Cardiology • 16+ Yrs Exp',
      image: '/images/6f858892-2750-45dc-b658-9ec10bca1d4a.jpg',
      exp: 'Lari Cardiology Wing - Room 104'
    },
    'Trauma & Emergency Medicine': {
      name: 'Dr. Rakesh Verma (Chief Physician)',
      title: 'MBBS, MD Emergency Medicine • 18+ Yrs Exp',
      image: '/images/6f858892-2750-45dc-b658-9ec10bca1d4a.jpg',
      exp: 'Centenary Trauma Centre - Room 02'
    },
    'Pediatrics (Kalam Centre)': {
      name: 'Dr. Priya Sharma (Specialist)',
      title: 'MD Pediatrics, Ayush Expert • 12+ Yrs Exp',
      image: '/images/a7003b54-5f7b-4907-a0fa-8f81f1b1758c.jpg',
      exp: 'Kalam Pediatric Complex - Room 108'
    },
    'Cardiology & Cardiac Surgery': {
      name: 'Dr. Arvind Sharma (Senior Consultant)',
      title: 'MD, DM Cardiology • 16+ Yrs Exp',
      image: '/images/6f858892-2750-45dc-b658-9ec10bca1d4a.jpg',
      exp: 'Ground Floor, CNC Block'
    },
    'Neurology & Neurosurgery': {
      name: 'Dr. Meera Reddy (Head of Dept)',
      title: 'MS, MCh Neurosurgery • 15+ Yrs Exp',
      image: '/images/a7003b54-5f7b-4907-a0fa-8f81f1b1758c.jpg',
      exp: 'Neuro Sciences Wing - Room 204'
    },
    'Pediatrics & Neonatology': {
      name: 'Dr. Priya Sharma (Consultant)',
      title: 'MD Pediatrics • 12+ Yrs Exp',
      image: '/images/a7003b54-5f7b-4907-a0fa-8f81f1b1758c.jpg',
      exp: 'Pediatric OPD Wing'
    },
    'General Medicine & Diabetology': {
      name: 'Dr. Rakesh Verma (Senior Physician)',
      title: 'MD General Medicine • 18+ Yrs Exp',
      image: '/images/6f858892-2750-45dc-b658-9ec10bca1d4a.jpg',
      exp: 'Main OPD Block - Room 06'
    }
  };

  // Dynamically assign doctor based on department
  useEffect(() => {
    if (initialDoctor && selectedDepartment === initialDepartment) {
      setSelectedDoctor(initialDoctor);
      return;
    }
    const profile = doctorProfiles[selectedDepartment];
    if (profile) {
      setSelectedDoctor(profile.name);
    } else {
      setSelectedDoctor('Dr. Medical Officer (Consultant)');
    }
  }, [selectedDepartment]);

  // Step 4: Booked Appointment Confirmation
  const [bookedAppointment, setBookedAppointment] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch Hospitals based on state or search
  useEffect(() => {
    const fetchHospitalsList = async () => {
      try {
        const res = await API.get(`/ors/hospitals?state=${selectedState}&query=${encodeURIComponent(searchCity)}`);
        if (res.data.success) {
          setHospitals(res.data.data);
          // If initialHospitalId matches, pick it, else pick the first
          const matched = res.data.data.find((h: any) => h.id === selectedHospitalId);
          if (matched) {
            setSelectedHospitalName(matched.name);
            setDepartments(matched.departments || []);
            if (matched.departments?.length > 0 && !initialDepartment) {
              setSelectedDepartment(matched.departments[0].name);
            }
          } else if (res.data.data.length > 0) {
            setSelectedHospitalId(res.data.data[0].id);
            setSelectedHospitalName(res.data.data[0].name);
            setDepartments(res.data.data[0].departments || []);
            if (res.data.data[0].departments?.length > 0) {
              setSelectedDepartment(res.data.data[0].departments[0].name);
            }
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

    if (selectedHospitalId) {
      fetchSlots();
    }
  }, [selectedHospitalId, selectedDepartment]);

  const handleHospitalSelect = (h: any) => {
    setSelectedHospitalId(h.id);
    setSelectedHospitalName(h.name);
    setDepartments(h.departments || []);
    if (h.departments?.length > 0) {
      setSelectedDepartment(h.departments[0].name);
    }
  };

  // Submit Final Booking
  const handleFinalBooking = async () => {
    setLoading(true);
    try {
      const res = await API.post('/ors/book', {
        patientName,
        mobile,
        email,
        abhaNumber,
        gender,
        age,
        hospitalId: selectedHospitalId,
        hospitalName: selectedHospitalName,
        department: selectedDepartment,
        doctorName: selectedDoctor,
        appointmentDate: selectedDate,
        timeSlot: selectedSlot,
        symptoms
      });

      if (res.data.success) {
        setBookedAppointment(res.data.appointment);
        setStep(4);
        addToast('success', 'ORS Appointment Confirmed', `Token #${res.data.appointment.tokenNumber} issued for ${selectedHospitalName}`);
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

  const topGovtHospitals = [
    { id: 'HOSP-KGMU-LUCKNOW', name: "King George’s Medical University (KGMU)", city: 'Lucknow, UP', badge: 'State Apex Institute' },
    { id: 'HOSP-AIIMS-DELHI', name: 'AIIMS New Delhi', city: 'Ansari Nagar, New Delhi', badge: 'National Apex' },
    { id: 'HOSP-SGPGI-LUCKNOW', name: 'SGPGIMS Lucknow', city: 'Lucknow, UP', badge: 'Tertiary Care' },
    { id: 'HOSP-SJH-DELHI', name: 'Safdarjung Hospital', city: 'South Delhi', badge: 'Central Govt' }
  ];

  const indianStates = [
    'All',
    'Uttar Pradesh',
    'Delhi',
    'Maharashtra',
    'Karnataka',
    'Tamil Nadu',
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

  const currentDoctorProfile = doctorProfiles[selectedDepartment] || {
    name: selectedDoctor,
    title: 'Consultant Specialist',
    image: '/images/6f858892-2750-45dc-b658-9ec10bca1d4a.jpg',
    exp: 'OPD Room 102'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        
        {/* Header with ORS Logo */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6 no-print">
          <div className="flex items-center gap-3">
            <img
              src="/images/ORS1.png"
              alt="ORS"
              className="h-10 w-auto object-contain rounded-lg"
              onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
            />
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                {language === 'en' ? 'Online OPD Registration & Appointment' : 'ऑनलाइन ओपीडी पंजीकरण एवं अपॉइंटमेंट'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Government of India • KGMU Lucknow & 500+ Apex Hospitals
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="grid grid-cols-4 gap-2 mb-8 no-print">
          {[
            { num: 1, label: language === 'en' ? '1. Patient Info' : '1. रोगी विवरण' },
            { num: 2, label: language === 'en' ? '2. Govt Hospital' : '2. अस्पताल चुनें' },
            { num: 3, label: language === 'en' ? '3. Dept & Doctor' : '3. विभाग एवं डॉक्टर' },
            { num: 4, label: language === 'en' ? '4. OPD Slip & QR' : '4. पुष्टि एवं पर्ची' },
          ].map((s) => {
            const isDone = step > s.num;
            const isCurrent = step === s.num;

            return (
              <div
                key={s.num}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  isCurrent
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold'
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

        {/* --- STEP 1: PATIENT VERIFICATION & DETAILS --- */}
        {step === 1 && (
          <div className="space-y-6 no-print">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Patient Full Name (as per Govt ID) *
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
                  Mobile Number (for SMS & OPD Token Alert) *
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
                  Ayushman ABHA Number (Optional)
                </label>
                <input
                  type="text"
                  value={abhaNumber}
                  onChange={(e) => setAbhaNumber(e.target.value)}
                  placeholder="91-4829-1092-3341"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>

            {/* Verification Badge */}
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>Patient verified with National Health Authority Sandbox (Free Govt OPD).</span>
              </div>
              <span className="text-slate-500 font-mono hidden sm:inline">KGMU & AIIMS Empanelled</span>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition cursor-pointer"
              >
                <span>Continue to Select Hospital</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* --- STEP 2: SELECT INDIAN STATE & HOSPITAL --- */}
        {step === 2 && (
          <div className="space-y-6 no-print">
            
            {/* Quick 1-Click Selection for Top Govt Hospitals */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                ⭐ 1-Click Quick Select: Top Government Apex Hospitals
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {topGovtHospitals.map((th) => {
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
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-[1.02]'
                          : 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-slate-800 dark:text-slate-200 hover:border-emerald-400'
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
                      <p className={`text-[10px] mt-2 font-medium ${isPicked ? 'text-emerald-100' : 'text-slate-500 dark:text-slate-400'}`}>
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
                  placeholder="e.g. KGMU, Lucknow, AIIMS, Safdarjung, SGPGI..."
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
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 shadow-md shadow-emerald-500/10'
                        : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
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

                      {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
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
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition cursor-pointer"
              >
                <span>Select Department & Doctor</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* --- STEP 3: DEPARTMENT & TIME SLOT --- */}
        {step === 3 && (
          <div className="space-y-6 no-print">
            
            {/* Selected Hospital Display */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Building2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white">{selectedHospitalName}</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Selected Apex Hospital for OPD Consultation</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:underline"
              >
                Change Hospital
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Select Clinical Department / OPD Wing
                </label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
                >
                  {(departments.length > 0 ? departments : [
                    { name: 'Cardiology & Lari Centre' },
                    { name: 'Trauma & Emergency Medicine' },
                    { name: 'Pediatrics (Kalam Centre)' },
                    { name: 'Cardiology & Cardiac Surgery' },
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
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Assigned Consultant Doctor & Room
                </label>
                <div className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 flex items-center gap-3">
                  <img
                    src={currentDoctorProfile.image}
                    alt={currentDoctorProfile.name}
                    className="w-10 h-10 rounded-xl object-cover border border-emerald-400 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                      {currentDoctorProfile.name}
                    </h5>
                    <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold truncate">
                      {currentDoctorProfile.title} • {currentDoctorProfile.exp}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Available Dates */}
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

            {/* Time Slot Selection */}
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

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Reason for Visit / Health Symptoms
              </label>
              <input
                type="text"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="e.g. Chest pain, follow-up consultation, blood sugar review"
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
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition cursor-pointer"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm & Generate Official OPD Card'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}

        {/* --- STEP 4: PRINTABLE OFFICIAL ORS REGISTRATION SLIP --- */}
        {step === 4 && bookedAppointment && (
          <div className="space-y-6">
            
            {/* Success Notification Bar (Hidden on print) */}
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/40 text-center space-y-1 no-print">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <h4 className="text-base font-black text-emerald-900 dark:text-emerald-300">
                Official OPD Appointment Confirmed!
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                SMS alert dispatched to {bookedAppointment.mobile}. Please show this digital slip or barcode at the hospital kiosk/reception.
              </p>
            </div>

            {/* --- THE CLEAN OFFICIAL GOVT PRINT CARD (Prints ONLY this box) --- */}
            <div
              id="official-ors-slip"
              className="print-card p-6 rounded-3xl bg-white text-black border-2 border-black space-y-4 text-xs shadow-md"
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
                      Online Registration System (ORS) • MoHFW • Government of India
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-black font-semibold">Booking Reference:</span>
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
                  <span className="text-[10px] text-black block font-semibold">ABHA ID / Mobile</span>
                  <span className="font-mono text-black font-bold">{bookedAppointment.abhaNumber || bookedAppointment.mobile}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-black block font-semibold">OPD Token Number</span>
                  <span className="font-mono font-black text-2xl text-black">
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
                  <span className="text-[10px] text-black block font-semibold">OPD Room</span>
                  <span className="font-bold text-black">{bookedAppointment.opdRoom || 'OPD Room 104'}</span>
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
                  <span className="font-bold text-black">FREE (Government Hospital Scheme)</span>
                </div>
              </div>

              {/* QR Code & Fast-Pass Scan Image */}
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
                    <p className="font-bold text-black uppercase">Scan QR Code For OPD Token</p>
                    <p className="font-mono text-xs tracking-widest font-black">{bookedAppointment.barcode || 'ORS-9821-4820'}</p>
                    <p className="text-[9px] text-black">Fast-Track Entry at KGMU / AIIMS Kiosk</p>
                  </div>
                </div>

                <div className="text-right text-[10px] text-black">
                  <p className="font-bold">Ayushman Bharat Digital Mission (ABDM)</p>
                  <p>ors.gov.in • abdm.gov.in • kgmu.org</p>
                  <p className="font-mono text-[9px] text-black/80 mt-0.5">Govt of India Verified</p>
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
                <span>Print Official OPD Slip (Clean Card)</span>
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
