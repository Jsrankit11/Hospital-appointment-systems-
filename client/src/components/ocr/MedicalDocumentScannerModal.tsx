import React, { useState, useRef } from 'react';
import API from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import {
  UploadCloud, FileText, CheckCircle2, AlertTriangle, ShieldAlert,
  Calendar, Pill, FlaskConical, Stethoscope, Clock,
  X, Eye, Download, ArrowRight, Loader2, Camera, Sparkles, RefreshCw
} from 'lucide-react';
import { ScannedMedicalDocument } from '../../types';
import { ValidationBadge } from '../common/ValidationBadge';

interface MedicalDocumentScannerModalProps {
  onClose: () => void;
  onDocumentScanned?: (doc: ScannedMedicalDocument) => void;
  language?: string;
}

export const MedicalDocumentScannerModal: React.FC<MedicalDocumentScannerModalProps> = ({
  onClose,
  onDocumentScanned,
  language = 'hi'
}) => {
  const { addToast } = useNotification();
  const isHindi = language === 'hi' || language === 'hinglish';

  const [docType, setDocType] = useState<'PRESCRIPTION' | 'LAB_REPORT' | 'DISCHARGE_SUMMARY'>('PRESCRIPTION');
  const [selectedFileName, setSelectedFileName] = useState<string>('Apollo_Hospital_Prescription_2026.pdf');
  const [documentDate, setDocumentDate] = useState<string>('2026-09-08');
  const [sampleText, setSampleText] = useState<string>(
    'Dr. K. Mehta (Cardiologist) - Rx: Tab Telmisartan 40mg OD, Tab Metformin 500mg BD, Tab Aspirin 75mg OD, Tab Warfarin 2mg OD. Advised Fasting Blood Sugar (FBS 148 mg/dL - High), HbA1c (8.4% - High), Serum Creatinine (1.05 mg/dL - Normal).'
  );
  
  const [isScanning, setIsScanning] = useState(false);
  const [scannedDoc, setScannedDoc] = useState<ScannedMedicalDocument | null>(null);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Past scanned history timeline sample
  const [timelineDocs, setTimelineDocs] = useState<ScannedMedicalDocument[]>([
    {
      docId: 'DOC-101',
      fileName: 'AIIMS_Cardiology_Discharge.pdf',
      docType: 'DISCHARGE_SUMMARY',
      documentDate: '2026-05-14',
      ocrConfidence: '98.2%',
      extractedDiagnosis: 'Coronary Artery Disease, Post-PTCA Drug-Eluting Stent in LAD',
      extractedMedicines: [
        { name: 'Brilinta 90mg', generic: 'Ticagrelor 90mg', dosage: '1 Tab BD', duration: '1 Year', frequency: 'Twice daily' },
        { name: 'Ecosprin 75mg', generic: 'Aspirin 75mg', dosage: '1 Tab OD', duration: 'Lifelong', frequency: 'Post dinner' }
      ],
      extractedLabValues: [
        { test: 'Ejection Fraction (2D Echo)', value: '55%', refRange: '50-70%', status: 'NORMAL', isAbnormal: false }
      ],
      detectedDrugInteractions: [],
      abnormalCount: 0,
      handwrittenDetected: false,
      printedDetected: true
    }
  ]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setUploadedPreview(ev.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
      addToast('info', 'Document Attached', `${file.name} loaded. Click 'Scan & Verify' to process.`);
    }
  };

  const handleScanSubmit = async () => {
    setIsScanning(true);
    try {
      const res = await API.post('/ai/ocr/scan-document', {
        patientId: 'PAT-1001',
        docType,
        fileName: selectedFileName,
        rawText: sampleText,
        date: documentDate
      });

      if (res.data.success) {
        const newDoc: ScannedMedicalDocument = res.data.data;
        setScannedDoc(newDoc);
        setTimelineDocs([newDoc, ...timelineDocs]);
        if (onDocumentScanned) onDocumentScanned(newDoc);

        if (newDoc.detectedDrugInteractions.length > 0) {
          addToast('error', '⚠️ Drug-Drug Interaction Detected!', `${newDoc.detectedDrugInteractions.length} critical interaction warning flagged.`);
        } else {
          addToast('success', 'Document OCR Verified', `Extracted ${newDoc.extractedMedicines.length} medicines & ${newDoc.extractedLabValues.length} lab tests.`);
        }
      }
    } catch (err: any) {
      console.error('Scan Error:', err);
      addToast('error', 'Scan Failed', 'Could not parse medical document.');
    } finally {
      setIsScanning(false);
    }
  };

  const downloadOCRReport = () => {
    if (!scannedDoc) return;
    const reportText = `
MEDI-KIOSK MEDICAL OCR & PRESCRIPTION VERIFICATION REPORT
============================================================
Document ID: ${scannedDoc.docId}
File: ${scannedDoc.fileName}
Type: ${scannedDoc.docType}
Date: ${scannedDoc.documentDate}
OCR Confidence: ${scannedDoc.ocrConfidence}

DIAGNOSIS:
${scannedDoc.extractedDiagnosis}

EXTRACTED MEDICINES (${scannedDoc.extractedMedicines.length}):
${scannedDoc.extractedMedicines.map((m, i) => `${i + 1}. ${m.name} (${m.generic}) - ${m.dosage} [${m.frequency}]`).join('\n')}

LABORATORY INVESTIGATIONS (${scannedDoc.extractedLabValues.length}):
${scannedDoc.extractedLabValues.map((l, i) => `${i + 1}. ${l.test}: ${l.value} (Ref: ${l.refRange}) - [${l.status}]`).join('\n')}

DRUG-DRUG INTERACTIONS:
${scannedDoc.detectedDrugInteractions.length === 0 ? 'None detected. Safe.' : scannedDoc.detectedDrugInteractions.map(d => `[${d.severity}] ${Array.isArray(d.drugs) ? d.drugs.join(' + ') : d.drugs}: ${d.warning || d.recommendation || 'Potential clinical interaction'}`).join('\n')}
============================================================

Generated by JSR Healthcare MediKiosk AI Engine
    `.trim();

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OCR_Report_${scannedDoc.docId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('success', 'Downloaded', 'OCR Clinical Report downloaded.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl max-h-[94vh] sm:max-h-[92vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-blue-500/30 shadow-2xl shadow-blue-500/10 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-600/15 via-indigo-500/10 to-teal-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {isHindi ? 'मेडिकल डॉक्यूमेंट स्कैनर व एआई ओसीआर' : 'Medical Document Scanner + AI OCR Engine'}
                </h3>
                <ValidationBadge status="VERIFIED" label="OCR 2.0" size="sm" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                {isHindi ? 'हस्तलिखित पर्चे, लैब रिपोर्ट व डिस्चार्ज सारांश से दवाओं एवं जांचों का सत्यापन' : 'Extract prescriptions, lab values, abnormal flags & drug-drug interactions'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Uploader Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Upload Card (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <label className="text-xs font-bold text-slate-900 dark:text-white">Document Classification</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'PRESCRIPTION', label: isHindi ? 'पर्चा (Rx)' : 'Prescription' },
                    { id: 'LAB_REPORT', label: isHindi ? 'लैब रिपोर्ट' : 'Lab Report' },
                    { id: 'DISCHARGE_SUMMARY', label: isHindi ? 'डिस्चार्ज' : 'Discharge' }
                  ].map(dt => (
                    <button
                      key={dt.id}
                      onClick={() => setDocType(dt.id as any)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition border ${
                        docType === dt.id
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {dt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-5 rounded-2xl border-2 border-dashed border-blue-500/30 hover:border-blue-500 bg-blue-50/30 dark:bg-blue-950/20 text-center space-y-2 cursor-pointer transition"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*,.pdf,.png,.jpg,.jpeg"
                  className="hidden"
                />
                
                {uploadedPreview ? (
                  <div className="space-y-2">
                    <img src={uploadedPreview} alt="Preview" className="max-h-32 mx-auto rounded-lg object-contain shadow" />
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">{selectedFileName}</p>
                  </div>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {isHindi ? 'पर्चे की फोटो या PDF अपलोड करें' : 'Upload Prescription / Report Image or PDF'}
                      </p>
                      <p className="text-[11px] text-slate-400">PNG, JPG, PDF up to 15MB • OCR auto-enabled</p>
                    </div>
                  </>
                )}
              </div>

              {/* Document Text Input / Sample */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isHindi ? 'दस्तावेज़ की सामग्री / टेक्स्ट:' : 'Document OCR Raw Text / Sample:'}
                </label>
                <textarea
                  rows={4}
                  value={sampleText}
                  onChange={(e) => setSampleText(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none font-mono"
                />
              </div>

              {/* Scan Button */}
              <button
                onClick={handleScanSubmit}
                disabled={isScanning}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white font-bold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-50 transition"
              >
                {isScanning ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Medical OCR & Safety Rules...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{isHindi ? 'ओसीआर स्कैन और सत्यापन करें' : 'Run OCR & Drug Safety Verification'}</span>
                  </>
                )}
              </button>

            </div>

            {/* Right Results & Extracted Entities (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              
              {scannedDoc ? (
                <div className="space-y-4 animate-fadeIn">
                  
                  {/* Confidence & Diagnosis Header Card */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 via-slate-50 dark:via-slate-800 to-indigo-500/10 border border-blue-500/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <ValidationBadge status="VERIFIED" label={`OCR Confidence: ${scannedDoc.ocrConfidence}`} size="sm" />
                      <button
                        onClick={downloadOCRReport}
                        className="px-3 py-1 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition flex items-center gap-1.5 shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Report</span>
                      </button>
                    </div>

                    <div className="pt-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Extracted Clinical Diagnosis:</span>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {scannedDoc.extractedDiagnosis}
                      </p>
                    </div>
                  </div>

                  {/* Critical Drug Interaction Warning if any */}
                  {scannedDoc.detectedDrugInteractions.length > 0 && (
                    <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 space-y-2 animate-pulse">
                      <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider">
                        <ShieldAlert className="w-4 h-4 text-rose-600" />
                        <span>Critical Drug-Drug Interaction Warning</span>
                      </div>
                      {scannedDoc.detectedDrugInteractions.map((inter, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-rose-500/20 text-xs">
                          <strong className="text-rose-600 font-bold block">{Array.isArray(inter.drugs) ? inter.drugs.join(' + ') : inter.drugs}</strong>
                          <p className="text-slate-600 dark:text-slate-300">{inter.warning || inter.recommendation || 'Potential drug interaction alert'}</p>
                        </div>
                      ))}

                    </div>
                  )}

                  {/* Extracted Medicines List */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Pill className="w-4 h-4 text-blue-500" />
                        <span>Extracted Medications ({scannedDoc.extractedMedicines.length})</span>
                      </h4>
                      <ValidationBadge status="VALID" label="Safety Bounds Checked" size="sm" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {scannedDoc.extractedMedicines.map((med, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                          <div className="font-bold text-blue-600 dark:text-blue-400">{med.name}</div>
                          <div className="text-slate-500 text-[11px]">{med.generic} • {med.dosage}</div>
                          <div className="text-slate-700 dark:text-slate-300 text-[11px] mt-0.5">{med.frequency}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Extracted Lab Values */}
                  {scannedDoc.extractedLabValues.length > 0 && (
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <FlaskConical className="w-4 h-4 text-purple-500" />
                          <span>Extracted Lab Values ({scannedDoc.extractedLabValues.length})</span>
                        </h4>
                        <span className="text-[11px] text-slate-400 font-medium">Reference Range Evaluated</span>
                      </div>

                      <div className="space-y-1.5">
                        {scannedDoc.extractedLabValues.map((lab, i) => (
                          <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                            <div>
                              <span className="font-semibold text-slate-800 dark:text-slate-200">{lab.test}: </span>
                              <strong className={lab.isAbnormal ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'}>
                                {lab.value}
                              </strong>
                              <span className="text-[10px] text-slate-400 ml-1.5">(Ref: {lab.refRange})</span>
                            </div>
                            <ValidationBadge
                              status={lab.isAbnormal ? 'WARNING' : 'VALID'}
                              label={lab.status}
                              size="sm"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              ) : (
                /* Empty state placeholder */
                <div className="h-full min-h-[300px] rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-8 text-center space-y-3">
                  <div className="w-14 h-14 rounded-3xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                    <FileText className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      {isHindi ? 'कोई दस्तावेज़ संसाधित नहीं हुआ' : 'No Document Processed Yet'}
                    </h4>
                    <p className="text-xs text-slate-400 max-w-sm mt-1">
                      {isHindi ? 'बाईं ओर पर्चा या लैब रिपोर्ट दर्ज करें और "ओसीआर स्कैन और सत्यापन करें" पर क्लिक करें।' : 'Select a document on the left and click scan to extract medicines and lab values.'}
                    </p>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
