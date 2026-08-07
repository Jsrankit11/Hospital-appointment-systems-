import React, { useState } from 'react';
import API from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { UserCheck, Stethoscope, Clock, ShieldCheck, X, Loader2, IndianRupee } from 'lucide-react';
import { Appointment } from '../../types';

interface OPDRegistrationModalProps {
  onClose: () => void;
  onRegistered: (appointment: Appointment) => void;
}

export const OPDRegistrationModal: React.FC<OPDRegistrationModalProps> = ({ onClose, onRegistered }) => {
  const { addToast } = useNotification();
  const [patientName, setPatientName] = useState('');
  const [mobile, setMobile] = useState('');
  const [abhaNumber, setAbhaNumber] = useState('');
  const [department, setDepartment] = useState('Cardiology & Cardiac Surgery');
  const [doctorName, setDoctorName] = useState('Dr. Arvind Sharma');
  const [priority, setPriority] = useState<'Normal' | 'Urgent' | 'Emergency'>('Normal');
  const [symptoms, setSymptoms] = useState('');
  const [fee, setFee] = useState(800);
  const [loading, setLoading] = useState(false);

  const departments = [
    { name: 'Cardiology & Cardiac Surgery', doctor: 'Dr. Arvind Sharma', fee: 800 },
    { name: 'Neurology & Brain Spine', doctor: 'Dr. Priya Nair', fee: 1000 },
    { name: 'Pediatrics & Neonatal Care', doctor: 'Dr. Rajesh Verma', fee: 600 },
    { name: 'Orthopedics & Joint Replacement', doctor: 'Dr. K. S. Reddy', fee: 750 },
    { name: 'General Medicine & Diabetology', doctor: 'Dr. Ananya Roy', fee: 500 },
  ];

  const handleDeptChange = (deptName: string) => {
    setDepartment(deptName);
    const found = departments.find(d => d.name === deptName);
    if (found) {
      setDoctorName(found.doctor);
      setFee(found.fee);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName) return;

    setLoading(true);
    try {
      const res = await API.post('/opd/book', {
        patientName,
        mobile,
        abhaNumber,
        department,
        doctorName,
        priority,
        symptoms,
        fee
      });

      if (res.data.success) {
        addToast('success', `OPD Token #${res.data.data.tokenNumber} Generated`, `Patient ${patientName} assigned to ${doctorName}`);
        onRegistered(res.data.data);
      }
    } catch (err: any) {
      addToast('error', 'Booking Failed', err.response?.data?.message || 'Could not allocate OPD token.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-500">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                New OPD Token Registration
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Fast Token Generation & Doctor Consultation Desk</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Patient Full Name *
              </label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g. Ramesh Chandra"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Mobile Number (for SMS & WhatsApp)
              </label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="9876543210"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                ABHA ID (Optional)
              </label>
              <input
                type="text"
                value={abhaNumber}
                onChange={(e) => setAbhaNumber(e.target.value)}
                placeholder="91-4829-1092-3341"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Priority Tier
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
              >
                <option value="Normal">Normal OPD Queue</option>
                <option value="Urgent">Urgent / Fast-Track</option>
                <option value="Emergency">Emergency Resuscitation</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => handleDeptChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
              >
                {departments.map(d => (
                  <option key={d.name} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Consulting Doctor & Fee
              </label>
              <div className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                <span>{doctorName}</span>
                <span className="text-teal-600 dark:text-teal-400">₹{fee}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Presenting Symptoms & Notes
            </label>
            <input
              type="text"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g. Chest pain with radiating discomfort, shortness of breath"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
            />
          </div>

          {/* SMS Alert Banner Notification Feature with SMS_NEW.png */}
          <div className="p-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-500/30 flex items-center gap-3">
            <img
              src="/images/SMS_NEW.png"
              alt="SMS Confirmation"
              className="h-10 w-auto object-contain rounded-lg shrink-0"
              onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
            />
            <div className="text-xs">
              <span className="font-bold text-teal-900 dark:text-teal-200 block">Instant Multi-Channel Dispatch</span>
              <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                Token number and room directions will be sent directly to patient's mobile via SMS and WhatsApp.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-bold shadow-lg shadow-teal-600/30 transition flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Generate OPD Token'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
