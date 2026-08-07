import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import {
  Calendar, Clock, ShieldCheck, Building2, Stethoscope,
  UserCheck, CheckCircle2, ArrowRight, ArrowLeft, Printer,
  Download, X, KeyRound, Smartphone, AlertCircle, Loader2, Sparkles, MapPin
} from 'lucide-react';

interface AppointmentBookingWizardProps {
  onClose: () => void;
  language: 'en' | 'hi';
}

export const AppointmentBookingWizard: React.FC<AppointmentBookingWizardProps> = ({ onClose, language }) => {
  const { user } = useAuth();
  const { addToast } = useNotification();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Citizen Verification State (Pre-filled from logged in user if available)
  const [method, setMethod] = useState<'AADHAAR' | 'MOBILE' | 'ABHA'>('AADHAAR');
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

  // Fetch Hospitals based on state or search
  useEffect(() => {
    const fetchHospitalsList = async () => {
      try {
        const res = await API.get(`/ors/hospitals?state=${selectedState}&query=${encodeURIComponent(searchCity)}`);
        if (res.data.success) {
          setHospitals(res.data.data);
          if (res.data.data.length > 0) {
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
        const res = await API.get(`/ors/slots?hospitalId=${selectedHospitalId}&department=${selectedDepartment}`);
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
                National Portal for 500+ Apex Hospitals across all Indian States & Cities
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="grid grid-cols-4 gap-2 mb-8 no-print">
          {[
            { num: 1, label: language === 'en' ? '1. Patient Info' : '1. रोगी विवरण' },
            { num: 2, label: language === 'en' ? '2. State & Hospital' : '2. राज्य एवं अस्पताल' },
            { num: 3, label: language === 'en' ? '3. Dept & Slot' : '3. विभाग एवं समय' },
            { num: 4, label: language === 'en' ? '4. OPD Slip' : '4. पुष्टि एवं पर्ची' },
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
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>Patient verified with National Health Authority Sandbox.</span>
              </div>
              <span className="text-slate-500 font-mono">Real-Time Database Sync</span>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Select Indian State / UT
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
                  placeholder="e.g. Mumbai, Bengaluru, Lucknow, Chennai, AIIMS..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Hospital Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
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
                      <span className="text-slate-500">{h.departments?.length || 8} Speciality OPDs</span>
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
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition"
              >
                <span>Select Department & Slot</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* --- STEP 3: DEPARTMENT & TIME SLOT --- */}
        {step === 3 && (
          <div className="space-y-6 no-print">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Select Clinical Department
                </label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
                >
                  {departments.map((d) => (
                    <option key={d.name} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Assigned Consultant Doctor / Unit
                </label>
                <input
                  type="text"
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-semibold"
                />
              </div>
            </div>

            {/* Available Dates */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Available Appointment Dates (Next 14 Days)
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
                {availableDates.slice(0, 7).map((d) => {
                  const isSelected = selectedDate === d.date;

                  return (
                    <button
                      key={d.date}
                      type="button"
                      onClick={() => setSelectedDate(d.date)}
                      className={`p-2.5 rounded-2xl border text-center transition-all ${
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
                {timeSlots.map((ts) => {
                  const isSelected = selectedSlot === ts.time;

                  return (
                    <button
                      key={ts.id}
                      type="button"
                      onClick={() => setSelectedSlot(ts.time)}
                      className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
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
                Reason for Visit / Health Complaint
              </label>
              <input
                type="text"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="e.g. Chest pain, blood pressure follow-up"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleFinalBooking}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm & Generate OPD Card'}
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
                Online OPD Registration Slip Confirmed!
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                SMS alert dispatched to {bookedAppointment.mobile}. Please present this slip or token at the OPD Room.
              </p>
            </div>

            {/* --- THE CLEAN OFFICIAL GOVT PRINT CARD (Prints ONLY this box) --- */}
            <div
              id="official-ors-slip"
              className="print-card p-6 rounded-3xl bg-white text-black border-2 border-black space-y-4 text-xs shadow-md"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b-2 border-black">
                <div>
                  <h4 className="font-black text-base text-black uppercase tracking-wide">
                    {bookedAppointment.hospitalName}
                  </h4>
                  <p className="text-[10px] text-black uppercase font-bold">
                    Online Registration System (ORS) • MoHFW • Government of India
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-black">Booking Ref:</span>
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
                  <span className="font-bold text-black">{bookedAppointment.opdRoom}</span>
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
                  <span className="font-bold text-black">FREE (Govt Hospital Scheme)</span>
                </div>
              </div>

              {/* Barcode & QR Code Section */}
              <div className="pt-4 border-t-2 border-black flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-1 bg-white border border-black rounded-lg">
                    <QRCodeSVG value={bookedAppointment.qrData || 'https://ors.gov.in'} size={60} />
                  </div>
                  <div className="text-[10px] text-black">
                    <p className="font-bold text-black">Scan at Kiosk</p>
                    <p className="font-mono text-xs tracking-widest">{bookedAppointment.barcode}</p>
                  </div>
                </div>

                <div className="text-right text-[10px] text-black">
                  <p>Ayushman Bharat Digital Mission</p>
                  <p className="font-bold text-black">ors.gov.in • abdm.gov.in</p>
                </div>
              </div>
            </div>

            {/* Action Buttons (Hidden on print) */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 no-print">
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official OPD Slip (Clean Card)</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition"
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
