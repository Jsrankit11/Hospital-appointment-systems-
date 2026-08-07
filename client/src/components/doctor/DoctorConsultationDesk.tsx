import React, { useState } from 'react';
import API from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { Stethoscope, Heart, Activity, Thermometer, Weight, Plus, Trash2, Send, FileText, FlaskConical } from 'lucide-react';
import { Appointment, EHR } from '../../types';

interface DoctorConsultationDeskProps {
  currentAppointment: Appointment | null;
  onSavedEHR: (ehr: EHR) => void;
}

export const DoctorConsultationDesk: React.FC<DoctorConsultationDeskProps> = ({ currentAppointment, onSavedEHR }) => {
  const { addToast } = useNotification();
  const [bloodPressure, setBloodPressure] = useState('124/82 mmHg');
  const [pulseRate, setPulseRate] = useState('76 bpm');
  const [spo2, setSpo2] = useState('99%');
  const [temperature, setTemperature] = useState('98.6 °F');
  const [weight, setWeight] = useState('72 kg');
  const [symptoms, setSymptoms] = useState(currentAppointment?.symptoms || 'General weakness and fatigue post-viral episode');
  const [diagnosis, setDiagnosis] = useState('Mild Post-Viral Asthenia & Seasonal Allergy');
  const [clinicalNotes, setClinicalNotes] = useState('Patient examined. Chest bilateral clear, S1 S2 normal. Advised adequate hydration, balanced diet, and prescribed medications.');
  const [prescriptions, setPrescriptions] = useState([
    { medicine: 'Augmentin 625 Duo', dosage: '1 Tab Twice Daily (Morning & Night)', duration: '5 Days', instructions: 'After meals' },
    { medicine: 'Pantoprazole 40mg DSR', dosage: '1 Tab Daily (Morning)', duration: '10 Days', instructions: 'Empty stomach' }
  ]);
  const [recommendedTests, setRecommendedTests] = useState<string[]>(['Complete Blood Count (CBC)', 'Lipid Profile Comprehensive']);
  const [loading, setLoading] = useState(false);

  const addPrescriptionRow = () => {
    setPrescriptions([...prescriptions, { medicine: '', dosage: '1 Tab Daily', duration: '5 Days', instructions: 'After food' }]);
  };

  const removePrescriptionRow = (idx: number) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== idx));
  };

  const handlePrescriptionChange = (idx: number, field: string, value: string) => {
    const updated = [...prescriptions];
    (updated[idx] as any)[field] = value;
    setPrescriptions(updated);
  };

  const toggleTest = (test: string) => {
    if (recommendedTests.includes(test)) {
      setRecommendedTests(recommendedTests.filter(t => t !== test));
    } else {
      setRecommendedTests([...recommendedTests, test]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post('/doctor/ehr', {
        patientId: currentAppointment?.patientId || 'PAT-1001',
        patientName: currentAppointment?.patientName || 'Rohan Sharma',
        abhaNumber: currentAppointment?.abhaNumber || '91-4829-1092-3341',
        appointmentId: currentAppointment?.id,
        vitals: {
          bloodPressure,
          pulseRate,
          spo2,
          temperature,
          weight
        },
        symptoms,
        diagnosis,
        clinicalNotes,
        prescriptions: prescriptions.filter(p => p.medicine.trim() !== ''),
        recommendedTests,
        followUpDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });

      if (res.data.success) {
        addToast('success', 'EHR & Prescription Saved', 'e-Prescription signed and transmitted to Pharmacy & ABDM Gateway.');
        onSavedEHR(res.data.data);
      }
    } catch (err: any) {
      addToast('error', 'Failed saving EHR', err.response?.data?.message || 'Server error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-500">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Doctor Consultation Desk & EHR Writer
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Active Patient: <strong className="text-teal-600 dark:text-teal-400">{currentAppointment?.patientName || 'Rohan Sharma'}</strong> (Token #{currentAppointment?.tokenNumber || '101'})
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* VITALS ENTRY BAR */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            Patient Real-Time Vitals
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40">
              <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 text-xs font-bold mb-1">
                <Heart className="w-4 h-4" /> BP
              </div>
              <input
                type="text"
                value={bloodPressure}
                onChange={(e) => setBloodPressure(e.target.value)}
                className="w-full bg-transparent font-bold text-sm text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/40">
              <div className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400 text-xs font-bold mb-1">
                <Activity className="w-4 h-4" /> Pulse
              </div>
              <input
                type="text"
                value={pulseRate}
                onChange={(e) => setPulseRate(e.target.value)}
                className="w-full bg-transparent font-bold text-sm text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/40">
              <div className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400 text-xs font-bold mb-1">
                <Activity className="w-4 h-4" /> SpO2
              </div>
              <input
                type="text"
                value={spo2}
                onChange={(e) => setSpo2(e.target.value)}
                className="w-full bg-transparent font-bold text-sm text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40">
              <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-xs font-bold mb-1">
                <Thermometer className="w-4 h-4" /> Temp
              </div>
              <input
                type="text"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                className="w-full bg-transparent font-bold text-sm text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/40 col-span-2 sm:col-span-1">
              <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 text-xs font-bold mb-1">
                <Weight className="w-4 h-4" /> Weight
              </div>
              <input
                type="text"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full bg-transparent font-bold text-sm text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* DIAGNOSIS & CLINICAL NOTES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Clinical Diagnosis
            </label>
            <input
              type="text"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="e.g. Essential Hypertension, Bronchitis"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Presenting Symptoms
            </label>
            <input
              type="text"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* PRESCRIPTION DRUG BUILDER */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              e-Prescription (Rx) Dispensing List
            </h4>
            <button
              type="button"
              onClick={addPrescriptionRow}
              className="flex items-center gap-1 text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
            >
              <Plus className="w-3.5 h-3.5" /> Add Drug
            </button>
          </div>

          <div className="space-y-2">
            {prescriptions.map((rx, idx) => (
              <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="sm:col-span-4">
                  <input
                    type="text"
                    placeholder="Medicine Name (e.g. Telmisartan 40mg)"
                    value={rx.medicine}
                    onChange={(e) => handlePrescriptionChange(idx, 'medicine', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div className="sm:col-span-3">
                  <input
                    type="text"
                    placeholder="Dosage (e.g. 1 Tab Twice Daily)"
                    value={rx.dosage}
                    onChange={(e) => handlePrescriptionChange(idx, 'dosage', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    placeholder="Duration (e.g. 15 Days)"
                    value={rx.duration}
                    onChange={(e) => handlePrescriptionChange(idx, 'duration', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    placeholder="Instructions"
                    value={rx.instructions}
                    onChange={(e) => handlePrescriptionChange(idx, 'instructions', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div className="sm:col-span-1 text-center">
                  <button
                    type="button"
                    onClick={() => removePrescriptionRow(idx)}
                    className="text-rose-500 hover:text-rose-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LAB TEST ORDER CHIPS */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Order Pathology & Radiology Diagnostic Tests
          </h4>
          <div className="flex flex-wrap gap-2">
            {[
              'Complete Blood Count (CBC)',
              'Lipid Profile Comprehensive',
              'Liver Function Test (LFT)',
              'HbA1c Glycated Hemoglobin',
              'Chest X-Ray PA View',
              '12-Lead Electrocardiogram (ECG)'
            ].map(test => {
              const isSelected = recommendedTests.includes(test);
              return (
                <button
                  key={test}
                  type="button"
                  onClick={() => toggleTest(test)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <FlaskConical className="w-3.5 h-3.5" />
                  {test}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-sm shadow-xl shadow-teal-600/30 transition flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            {loading ? 'Saving...' : 'Sign & Transmit e-Prescription'}
          </button>
        </div>

      </form>
    </div>
  );
};
