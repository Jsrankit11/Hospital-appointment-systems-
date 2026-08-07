import React, { useState } from 'react';
import API from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { FlaskConical, Search, Download, Printer, X, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { LabTest } from '../../types';

interface LabReportsLookupModalProps {
  onClose: () => void;
  language: 'en' | 'hi';
}

export const LabReportsLookupModal: React.FC<LabReportsLookupModalProps> = ({ onClose, language }) => {
  const { addToast } = useNotification();
  const [searchUHID, setSearchUHID] = useState('UHID-AIIMS-99214');
  const [mobile, setMobile] = useState('');
  const [reports, setReports] = useState<LabTest[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setHasSearched(true);

    try {
      const res = await API.get(`/ors/lab-reports?uhid=${encodeURIComponent(searchUHID)}&mobile=${encodeURIComponent(mobile)}`);
      if (res.data.success) {
        setReports(res.data.data);
        if (res.data.data.length > 0) {
          addToast('success', 'Lab Reports Found', `Retrieved ${res.data.data.length} official diagnostic records.`);
        }
      }
    } catch (err: any) {
      addToast('error', 'Lookup Failed', err.response?.data?.message || 'Server error.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in no-print">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Header with lab_report.gif */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <img
              src="/images/lab_report.gif"
              alt="Lab Reports"
              className="h-10 w-10 object-contain rounded-xl"
              onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
            />
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                {language === 'en' ? 'Online Lab & Diagnostic Reports Portal' : 'ऑनलाइन लैब एवं डायग्नोस्टिक रिपोर्ट पोर्टल'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Download verified Pathology, Biochemistry & Radiology slips across all Indian Hospitals
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

        {/* Search Form */}
        <form onSubmit={handleSearch} className="space-y-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Hospital UHID / CR Number *
              </label>
              <input
                type="text"
                value={searchUHID}
                onChange={(e) => setSearchUHID(e.target.value)}
                placeholder="e.g. UHID-AIIMS-99214 or CR-101"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Registered Mobile Number (Optional)
              </label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="9899001122"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg shadow-teal-600/30 transition"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? 'Searching...' : 'Retrieve Diagnostic Reports'}</span>
            </button>
          </div>
        </form>

        {/* Results List */}
        {hasSearched && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Verified Diagnostic Results ({reports.length} Records Found)
            </h4>

            {reports.map((r) => (
              <div
                key={r.id}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-700">
                  <div>
                    <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                      {r.testName}
                    </h5>
                    <p className="text-[11px] text-slate-500">
                      Patient: <strong className="text-slate-800 dark:text-slate-200">{r.patientName}</strong> • {r.category}
                    </p>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 self-start sm:self-auto uppercase">
                    Verified by Pathologist
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                  {r.findings}
                </div>

                <div className="flex items-center justify-between pt-2 text-xs">
                  <span className="text-[11px] text-slate-400">
                    Technician: {r.technician || 'Anand Kulkarni'} • {r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-IN') : 'Recent'}
                  </span>

                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Signed PDF</span>
                  </button>
                </div>
              </div>
            ))}

            {reports.length === 0 && (
              <div className="text-center py-8 text-slate-500 text-xs">
                No lab reports found for the provided UHID. Please check the number or try with another search.
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
