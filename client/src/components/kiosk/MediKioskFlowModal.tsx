import React, { useState, useEffect, useRef } from 'react';
import API from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import {
  Mic, MicOff, Volume2, Sparkles, AlertTriangle, ShieldCheck,
  CheckCircle2, ArrowRight, ArrowLeft, RotateCcw, FileText,
  UploadCloud, HeartPulse, Stethoscope, ChevronRight, X, User,
  Globe, QrCode, CreditCard, Clock, Activity, Flower2, ShieldAlert,
  Calendar, Layers, Check, RefreshCw
} from 'lucide-react';
import {
  SUPPORTED_LANGUAGES,
  SupportedLanguage,
  getTranslation
} from '../../locales/i18n';
import { AIClinicalQuestion, AIClinicalSummary, ScannedDocument } from '../../types';

interface MediKioskFlowModalProps {
  onClose: () => void;
  defaultLanguage?: SupportedLanguage;
  isKioskFullscreen?: boolean;
}

export const MediKioskFlowModal: React.FC<MediKioskFlowModalProps> = ({
  onClose,
  defaultLanguage = 'en',
  isKioskFullscreen = false
}) => {
  const { addToast } = useNotification();
  
  // Step indicator: 1 = Language, 2 = Identity/ABHA, 3 = Consent, 4 = AI Interview, 5 = Documents OCR, 6 = Timeline, 7 = AYUSH (opt), 8 = Summary, 9 = Success
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [language, setLanguage] = useState<SupportedLanguage>(defaultLanguage);
  const [isAyushMode, setIsAyushMode] = useState<boolean>(false);

  // Patient Identity
  const [patientName, setPatientName] = useState('Rohan Sharma');
  const [age, setAge] = useState('34');
  const [gender, setGender] = useState('Male');
  const [mobile, setMobile] = useState('9899001122');
  const [abhaId, setAbhaId] = useState('rohan.sharma@abdm');
  const [abhaNumber, setAbhaNumber] = useState('91-4829-1092-3341');
  const [address, setAddress] = useState('Flat 402, Lotus Greens, Sector 78, New Delhi');

  // Consent
  const [consentGranted, setConsentGranted] = useState(false);
  const [isPlayingConsentAudio, setIsPlayingConsentAudio] = useState(false);

  // AI Interview State
  const [sessionId, setSessionId] = useState<string>('');
  const [currentQuestion, setCurrentQuestion] = useState<AIClinicalQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [conversationHistory, setConversationHistory] = useState<Array<{ stepId: string; question: string; answer: string; mode: string }>>([]);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
  const [triageStatus, setTriageStatus] = useState<any>({ triageLevel: 'GREEN', hasRedFlag: false });
  const [loading, setLoading] = useState<boolean>(false);

  // Scanned Documents & OCR
  const [uploadedDocs, setUploadedDocs] = useState<ScannedDocument[]>([]);
  const [isProcessingDoc, setIsProcessingDoc] = useState(false);

  // AYUSH Assessment
  const [prakritiResult, setPrakritiResult] = useState<any>(null);
  const [bodyFrame, setBodyFrame] = useState('medium');
  const [digestionType, setDigestionType] = useState('samagni');
  const [bowelType, setBowelType] = useState('madhyama');
  const [skinType, setSkinType] = useState('combination');

  // Generated Summary
  const [generatedSummary, setGeneratedSummary] = useState<AIClinicalSummary | null>(null);
  const [submissionToken, setSubmissionToken] = useState<string>('T-108');

  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition fallback
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setUserAnswer(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        addToast('info', 'Voice Input Note', 'You can type or tap options directly.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  // Start Voice Recording
  const toggleRecording = () => {
    if (!recognitionRef.current) {
      addToast('info', 'Microphone', 'Web Speech API not supported in this browser. Please type or tap quick pills.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setUserAnswer('');
      try {
        recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
        recognitionRef.current.start();
      } catch (err) {
        console.warn(err);
      }
    }
  };

  // Play Audio Explanation (TTS)
  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.95;
      utterance.onstart = () => setIsPlayingConsentAudio(true);
      utterance.onend = () => setIsPlayingConsentAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      addToast('info', 'Audio', 'Text-to-speech is not supported on this device.');
    }
  };

  // 1. Start AI Conversation
  const initAIConversation = async () => {
    setLoading(true);
    try {
      const res = await API.post('/ai/conversation/start', {
        patientId: 'PAT-1001',
        language,
        isAyush: isAyushMode
      });
      if (res.data.success) {
        setSessionId(res.data.data.sessionId);
        setCurrentQuestion(res.data.data.currentStep);
        if (res.data.data.currentStep?.audioPrompt) {
          playAudio(res.data.data.currentStep.audioPrompt);
        }
      }
    } catch (err: any) {
      addToast('error', 'Could not initialize AI', err.message);
    } finally {
      setLoading(false);
    }
  };

  // 2. Submit Answer & Advance AI Interview
  const handleAnswerSubmit = async (answerToSubmit?: string) => {
    const finalAnswer = answerToSubmit || userAnswer;
    if (!finalAnswer.trim() || !currentQuestion) return;

    setLoading(true);
    try {
      const res = await API.post('/ai/conversation/respond', {
        sessionId,
        stepId: currentQuestion.stepId,
        answerText: finalAnswer,
        language,
        isAyush: isAyushMode
      });

      if (res.data.success) {
        setConversationHistory(prev => [
          ...prev,
          {
            stepId: currentQuestion.stepId,
            question: currentQuestion.questionText,
            answer: finalAnswer,
            mode: isListening ? 'VOICE' : 'TOUCH_TEXT'
          }
        ]);

        const nextStep = res.data.data.nextStep;
        setTriageStatus(res.data.data.triageStatus || { triageLevel: 'GREEN' });
        setCurrentQuestion(nextStep);
        setUserAnswer('');

        if (res.data.data.triageStatus?.hasRedFlag && res.data.data.triageStatus?.triageLevel === 'RED') {
          addToast('warning', '🚨 Priority Triage Alert Triggered', 'Critical symptom reported. Immediate clinical evaluation flagged for doctor & triage desk.');
        }

        if (nextStep.isLast || nextStep.stepId === 'COMPLETED') {
          // Advance to Document OCR step
          setCurrentStep(5);
        } else if (nextStep.audioPrompt) {
          playAudio(nextStep.audioPrompt);
        }
      }
    } catch (err: any) {
      addToast('error', 'Error recording response', err.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. Process Medical Document OCR
  const handleSimulateDocumentScan = async (type: string) => {
    setIsProcessingDoc(true);
    try {
      const sampleText = type === 'PRESCRIPTION'
        ? 'Dr. Arvind Sharma, AIIMS Cardiology. Rx: Augmentin 625 Duo 1 tab BD x 5d, Pan 40 OD empty stomach, Telmisartan 40mg OD. Fasting sugar 148 mg/dL, HbA1c 8.4%.'
        : 'Blood Test Pathology Report: HbA1c 8.4%, Fasting Glucose 148 mg/dL (High), Serum Creatinine 1.05 mg/dL, Total Cholesterol 232 mg/dL.';

      const res = await API.post('/ai/ocr/scan-document', {
        patientId: 'PAT-1001',
        docType: type,
        fileName: type === 'PRESCRIPTION' ? 'Rx_AIIMS_Augmentin.jpg' : 'Pathology_Blood_Report.pdf',
        rawText: sampleText
      });

      if (res.data.success) {
        setUploadedDocs(prev => [res.data.data, ...prev]);
        addToast('success', 'Document Digitized via OCR', `${res.data.data.fileName} analyzed. Extracted medicines & abnormal lab values.`);
      }
    } catch (err: any) {
      addToast('error', 'OCR Failed', err.message);
    } finally {
      setIsProcessingDoc(false);
    }
  };

  // 4. Compute AYUSH Prakriti
  const handleComputeAyush = async () => {
    setLoading(true);
    try {
      const res = await API.post('/ai/ayush/assess', {
        patientId: 'PAT-1001',
        assessmentData: {
          bodyFrame,
          skinType,
          appetite: digestionType === 'tikshnagni' ? 'sharp' : digestionType === 'mandagni' ? 'slow' : 'variable',
          digestion: digestionType,
          bowelHabit: bowelType
        }
      });
      if (res.data.success) {
        setPrakritiResult(res.data.data);
        addToast('success', 'AYUSH Assessment Computed', `Prakriti: ${res.data.data.primaryPrakriti}`);
      }
    } catch (err: any) {
      addToast('error', 'AYUSH Calculation Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  // 5. Generate Final 1-Page Clinical Summary
  const handleGenerateSummary = async () => {
    setLoading(true);
    try {
      const res = await API.post('/ai/clinical-summary/generate', {
        patientId: 'PAT-1001',
        sessionId
      });
      if (res.data.success) {
        setGeneratedSummary(res.data.data);
        setCurrentStep(8);
      }
    } catch (err: any) {
      addToast('error', 'Summary Generation Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  // 6. Submit Intake and Issue Token
  const handleSubmitIntake = () => {
    const token = `T-${Math.floor(100 + Math.random() * 900)}`;
    setSubmissionToken(token);
    setCurrentStep(9);
    addToast('success', 'Case Taking Submitted', `Token #${token} issued. Doctor desk notified.`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className={`w-full ${isKioskFullscreen ? 'max-w-6xl min-h-[90vh]' : 'max-w-5xl'} bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200`}>
        
        {/* TOP HEADER & KIOSK STEPPER */}
        <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-700 text-white p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white shadow-inner">
              <HeartPulse className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">MediKiosk</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400 text-slate-950 uppercase">
                  AI Patient Intake
                </span>
                {isAyushMode && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 uppercase">
                    AYUSH / Ayurveda
                  </span>
                )}
              </div>
              <p className="text-xs text-teal-100 font-medium">
                {getTranslation(language, 'heroHeadline')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Language Pill Switcher */}
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/20 text-xs">
              <Globe className="w-4 h-4 text-teal-200" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
              >
                {SUPPORTED_LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code} className="text-slate-900 bg-white">
                    {lang.nativeName} ({lang.name})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* STEPPER PROGRESS BAR */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[650px] text-xs font-bold text-slate-500">
            {[
              { num: 1, label: 'Language' },
              { num: 2, label: 'Identity / ABHA' },
              { num: 3, label: 'Consent' },
              { num: 4, label: 'AI Case Taking' },
              { num: 5, label: 'Document OCR' },
              { num: 6, label: 'Timeline' },
              { num: 7, label: isAyushMode ? 'AYUSH Dashavidha' : 'AYUSH Mode' },
              { num: 8, label: 'Clinical Summary' },
              { num: 9, label: 'Confirmation' }
            ].map(s => {
              const isActive = currentStep === s.num;
              const isPast = currentStep > s.num;
              return (
                <div
                  key={s.num}
                  onClick={() => s.num < currentStep && setCurrentStep(s.num)}
                  className={`flex items-center gap-2 cursor-pointer transition ${
                    isActive ? 'text-teal-600 dark:text-teal-400 scale-105' : isPast ? 'text-slate-900 dark:text-slate-200' : 'text-slate-400'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-md'
                      : isPast
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                  }`}>
                    {isPast ? <Check className="w-3.5 h-3.5" /> : s.num}
                  </span>
                  <span>{s.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* MAIN BODY PER STEP */}
        <div className="p-6 flex-1 overflow-y-auto">

          {/* ================= STEP 1: LANGUAGE SELECTION ================= */}
          {currentStep === 1 && (
            <div className="space-y-6 max-w-3xl mx-auto py-4">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  {getTranslation(language, 'step1Language')}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Select your preferred Indian language for Voice, Touch, and Screen Display.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {SUPPORTED_LANGUAGES.map(lang => {
                  const isSelected = language === lang.code;
                  return (
                    <div
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col items-center justify-center text-center gap-1.5 ${
                        isSelected
                          ? 'border-teal-500 bg-teal-50/80 dark:bg-teal-950/40 shadow-lg shadow-teal-500/10'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                      }`}
                    >
                      <span className="text-xl font-bold text-slate-900 dark:text-white">{lang.scriptSample}</span>
                      <span className="text-xs font-extrabold text-teal-600 dark:text-teal-400">{lang.nativeName}</span>
                      <span className="text-[11px] text-slate-400">{lang.name}</span>
                    </div>
                  );
                })}
              </div>

              {/* AYUSH Intake Mode Toggle */}
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700/50 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Flower2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      Include AYUSH / Ayurveda Dashavidha Pariksha Intake
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Evaluates Prakriti, Agni, Koshta, and Dashavidha Pariksha along with Allopathic clinical history.
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAyushMode}
                    onChange={(e) => setIsAyushMode(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-8 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-black text-sm shadow-xl shadow-teal-600/30 flex items-center gap-2 transition"
                >
                  <span>Continue to Identification</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 2: PATIENT IDENTIFICATION / ABHA ================= */}
          {currentStep === 2 && (
            <div className="space-y-6 max-w-3xl mx-auto py-2">
              <div className="text-center space-y-1">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  {getTranslation(language, 'step2Identify')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Demo Environment – ABDM / ABHA Integration Ready
                </p>
              </div>

              {/* Demo Mode Quick Patient Selector */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                  Quick Load Demo Patient Archetypes
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPatientName('Rohan Sharma');
                      setAge('34');
                      setGender('Male');
                      setAbhaNumber('91-4829-1092-3341');
                      setAbhaId('rohan.sharma@abdm');
                      addToast('info', 'Loaded Demo Patient', 'Rohan Sharma (Normal Metabolic OPD)');
                    }}
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-left hover:border-teal-500 text-xs font-bold"
                  >
                    1. Rohan Sharma (Metabolic OPD)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPatientName('Vikram Malhotra');
                      setAge('52');
                      setGender('Male');
                      setAbhaNumber('91-2299-4411-9988');
                      setAbhaId('vikram.malhotra@abdm');
                      addToast('warning', 'Loaded Demo Patient', 'Vikram Malhotra (🚨 Chest Pain Code Red)');
                    }}
                    className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-300 dark:border-rose-800 text-left hover:border-rose-500 text-xs font-bold text-rose-700 dark:text-rose-300"
                  >
                    2. Vikram Malhotra (🚨 Code Red)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPatientName('Ananya Iyer');
                      setAge('29');
                      setGender('Female');
                      setAbhaNumber('91-3388-1122-7744');
                      setAbhaId('ananya.iyer@abdm');
                      setIsAyushMode(true);
                      addToast('info', 'Loaded Demo Patient', 'Ananya Iyer (🌿 Ayurvedic Intake)');
                    }}
                    className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 text-left hover:border-amber-500 text-xs font-bold text-amber-700 dark:text-amber-300"
                  >
                    3. Ananya Iyer (🌿 AYUSH Intake)
                  </button>
                </div>
              </div>

              {/* Patient Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 mb-1 block">Full Patient Name</label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 mb-1 block">Mobile Number (Aadhaar linked)</label>
                  <input
                    type="text"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 mb-1 block">Age (Years)</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 mb-1 block">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 mb-1 block">ABHA Number</label>
                  <input
                    type="text"
                    value={abhaNumber}
                    onChange={(e) => setAbhaNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 mb-1 block">ABHA Address (PHR)</label>
                  <input
                    type="text"
                    value={abhaId}
                    onChange={(e) => setAbhaId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-8 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-black text-sm shadow-xl shadow-teal-600/30 flex items-center gap-2 transition"
                >
                  <span>Proceed to Consent</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 3: CONSENT & AUDIO READOUT ================= */}
          {currentStep === 3 && (
            <div className="space-y-6 max-w-3xl mx-auto py-2">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 mx-auto flex items-center justify-center mb-2">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  {getTranslation(language, 'consentHeading')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Compliant with Digital Personal Data Protection (DPDP) Act 2023 & ABDM Consent Architecture
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  {getTranslation(language, 'consentExplanation')}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <strong className="block text-teal-600 dark:text-teal-400 mb-1">What is Collected:</strong>
                    <span className="text-slate-500">Voice recordings, reported symptoms, uploaded prescriptions & lab values.</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <strong className="block text-teal-600 dark:text-teal-400 mb-1">Why it is Collected:</strong>
                    <span className="text-slate-500">To draft a structured 1-page clinical case taking summary for your attending doctor.</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <strong className="block text-teal-600 dark:text-teal-400 mb-1">Your Rights:</strong>
                    <span className="text-slate-500">Consent is voluntary and can be withdrawn from the patient portal at any time.</span>
                  </div>
                </div>

                {/* Audio Readout Button */}
                <div className="pt-2 flex justify-center">
                  <button
                    type="button"
                    onClick={() => playAudio(getTranslation(language, 'consentExplanation'))}
                    className={`px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition ${
                      isPlayingConsentAudio
                        ? 'bg-amber-500 text-white animate-pulse'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300'
                    }`}
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>{isPlayingConsentAudio ? 'Playing Audio Explanation...' : getTranslation(language, 'listenConsentBtn')}</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={() => {
                    setConsentGranted(true);
                    initAIConversation();
                    setCurrentStep(4);
                  }}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:opacity-95 text-white font-black text-sm shadow-xl shadow-teal-600/30 flex items-center gap-2 transition"
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span>{getTranslation(language, 'giveConsentBtn')}</span>
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 4: AI CONVERSATIONAL CASE TAKING ================= */}
          {currentStep === 4 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Progress & Current Collected History (4 cols) */}
              <div className="lg:col-span-4 space-y-4">
                <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Patient: {patientName}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      triageStatus.triageLevel === 'RED'
                        ? 'bg-rose-500 text-white animate-pulse'
                        : triageStatus.triageLevel === 'YELLOW'
                        ? 'bg-amber-500 text-white'
                        : 'bg-emerald-500/20 text-emerald-600'
                    }`}>
                      TRIAGE: {triageStatus.triageLevel}
                    </span>
                  </div>

                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                    Recorded Case Points ({conversationHistory.length})
                  </h4>

                  <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                    {conversationHistory.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No responses recorded yet.</p>
                    ) : (
                      conversationHistory.map((item, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                          <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase block truncate">
                            {item.stepId}
                          </span>
                          <p className="text-slate-800 dark:text-slate-200 font-medium">{item.answer}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Red Flag Alert Badge if detected */}
                {triageStatus.hasRedFlag && triageStatus.triageLevel === 'RED' && (
                  <div className="p-4 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 text-xs space-y-2">
                    <div className="flex items-center gap-2 font-bold text-rose-600">
                      <ShieldAlert className="w-5 h-5 animate-bounce" />
                      <span>{triageStatus.alertTitle || '🚨 Priority Triage Trigger'}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      {triageStatus.instruction || 'Critical cardiovascular symptom identified. High-priority triage token has been issued for immediate ECG & evaluation.'}
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column: Active AI Interview Chat Interface (8 cols) */}
              <div className="lg:col-span-8 flex flex-col justify-between rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 p-6 space-y-6">
                
                {/* AI Question Card */}
                {currentQuestion && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center shadow-md">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                          Step {currentQuestion.stepIndex + 1} of 9 • {currentQuestion.title}
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                          {currentQuestion.questionText}
                        </h3>
                      </div>
                    </div>

                    {/* Audio Readout of Question */}
                    {currentQuestion.audioPrompt && (
                      <button
                        type="button"
                        onClick={() => playAudio(currentQuestion.audioPrompt!)}
                        className="text-xs font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1.5 hover:underline"
                      >
                        <Volume2 className="w-4 h-4" /> Listen to question
                      </button>
                    )}

                    {/* Touch Quick Option Pills */}
                    {currentQuestion.quickOptions && currentQuestion.quickOptions.length > 0 && (
                      <div className="space-y-2 pt-2">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Quick Tap Options:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {currentQuestion.quickOptions.map((opt, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => {
                                setUserAnswer(opt);
                                handleAnswerSubmit(opt);
                              }}
                              className="px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-950/40 text-xs font-bold text-slate-800 dark:text-slate-200 transition shadow-sm"
                            >
                              👆 {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Input Controls: Voice Microphone + Text Area */}
                <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    {/* Big Touch-Friendly Mic Button */}
                    <button
                      type="button"
                      onClick={toggleRecording}
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center transition shadow-xl flex-shrink-0 ${
                        isListening
                          ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/40 scale-105'
                          : 'bg-teal-600 hover:bg-teal-500 text-white shadow-teal-600/30'
                      }`}
                      title={isListening ? 'Stop Recording' : 'Start Voice Input'}
                    >
                      {isListening ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
                    </button>

                    {/* Text Field */}
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAnswerSubmit()}
                      placeholder={isListening ? '🎤 Listening to your voice...' : currentQuestion?.placeholder || 'Type or speak your answer...'}
                      className="flex-1 px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />

                    {/* Submit Answer */}
                    <button
                      type="button"
                      disabled={loading || !userAnswer.trim()}
                      onClick={() => handleAnswerSubmit()}
                      className="px-6 py-3.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs shadow-md transition disabled:opacity-40"
                    >
                      {loading ? 'Processing...' : 'Next'}
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 text-center">
                    {isListening ? '🎤 Listening in real-time. Speak clearly in your selected language.' : 'You can answer by speaking, tapping options, or typing.'}
                  </p>
                </div>

              </div>

            </div>
          )}

          {/* ================= STEP 5: DOCUMENT SCANNER & OCR ================= */}
          {currentStep === 5 && (
            <div className="space-y-6 max-w-4xl mx-auto py-2">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 mx-auto flex items-center justify-center mb-1">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  {getTranslation(language, 'digitizeRecordsBtn')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  AI OCR automatically extracts medications, abnormal lab values, and clinical diagnoses from previous prescriptions.
                </p>
              </div>

              {/* Upload Action Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  onClick={() => handleSimulateDocumentScan('PRESCRIPTION')}
                  className="p-6 rounded-3xl border-2 border-dashed border-teal-500/40 bg-teal-50/40 dark:bg-teal-950/20 hover:border-teal-500 transition cursor-pointer flex flex-col items-center justify-center text-center gap-2 group"
                >
                  <FileText className="w-8 h-8 text-teal-600 group-hover:scale-110 transition" />
                  <strong className="text-sm text-slate-900 dark:text-white">Scan Previous Prescription</strong>
                  <span className="text-xs text-slate-500">Digitize doctor handwriting, drug dosages & durations</span>
                </div>

                <div
                  onClick={() => handleSimulateDocumentScan('LAB_REPORT')}
                  className="p-6 rounded-3xl border-2 border-dashed border-blue-500/40 bg-blue-50/40 dark:bg-blue-950/20 hover:border-blue-500 transition cursor-pointer flex flex-col items-center justify-center text-center gap-2 group"
                >
                  <Activity className="w-8 h-8 text-blue-600 group-hover:scale-110 transition" />
                  <strong className="text-sm text-slate-900 dark:text-white">Scan Blood / Pathology Report</strong>
                  <span className="text-xs text-slate-500">Auto-flags abnormal hemoglobin, blood sugar, lipid markers</span>
                </div>
              </div>

              {/* Processing Loader */}
              {isProcessingDoc && (
                <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-500/30 flex items-center justify-center gap-3 text-xs font-bold text-teal-700 dark:text-teal-300">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Reading document OCR, extracting clinical entities and checking drug safety...</span>
                </div>
              )}

              {/* Digitized Documents List */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                  Digitized Records ({uploadedDocs.length})
                </h4>

                {uploadedDocs.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Click one of the cards above to simulate scanning a sample prescription or lab report.</p>
                ) : (
                  uploadedDocs.map((doc, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white">{doc.fileName}</span>
                          <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-600 text-[10px] font-bold">
                            OCR Confidence: {doc.ocrConfidence || '96.8%'}
                          </span>
                        </div>
                        <span className="text-slate-400">{doc.documentDate}</span>
                      </div>

                      {/* Extracted Medicines */}
                      {doc.extractedMedicines && doc.extractedMedicines.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Extracted Medications:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {doc.extractedMedicines.map((m: any, i: number) => (
                              <span key={i} className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold">
                                💊 {m.name} ({m.dosage})
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Extracted Abnormal Lab Values */}
                      {doc.extractedLabValues && (
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Lab Values:</span>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {doc.extractedLabValues.map((l: any, i: number) => (
                              <div key={i} className={`p-2 rounded-lg border text-[11px] ${l.isAbnormal ? 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200' : 'bg-white dark:bg-slate-900 border-slate-200'}`}>
                                <span className="font-bold block truncate">{l.test}</span>
                                <span>{l.value}</span> {l.isAbnormal && <strong className="text-amber-600 text-[9px]"> (ABNORMAL)</strong>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  onClick={() => setCurrentStep(4)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={() => setCurrentStep(6)}
                  className="px-8 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-black text-sm shadow-xl shadow-teal-600/30 flex items-center gap-2 transition"
                >
                  <span>View Medical Timeline</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 6: MEDICAL TIMELINE ================= */}
          {currentStep === 6 && (
            <div className="space-y-6 max-w-3xl mx-auto py-2">
              <div className="text-center space-y-1">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  Chronological Medical Timeline
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Prior clinical episodes, diagnostics, and prescriptions arranged chronologically.
                </p>
              </div>

              <div className="relative border-l-2 border-teal-500/30 ml-4 pl-6 space-y-6 text-xs">
                
                {/* Event 1 */}
                <div className="relative group">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-teal-500 border-4 border-white dark:border-slate-900 shadow-md"></div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                    <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400">2026-08-20 • Blood Investigation</span>
                    <h4 className="font-bold text-slate-900 dark:text-white">HbA1c & Fasting Glucose Screening</h4>
                    <p className="text-slate-500">HbA1c: 8.4% (Elevated), Fasting Glucose: 148 mg/dL. Dr. Sunita Kapoor Pathology.</p>
                  </div>
                </div>

                {/* Event 2 */}
                <div className="relative group">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-blue-500 border-4 border-white dark:border-slate-900 shadow-md"></div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">2026-08-22 • Cardiology Consultation</span>
                    <h4 className="font-bold text-slate-900 dark:text-white">OPD Visit – Dr. Arvind Sharma (AIIMS)</h4>
                    <p className="text-slate-500">Dx: Stage 1 Essential Hypertension. Rx: Telmisartan 40mg OD, EcoSprin 75mg.</p>
                  </div>
                </div>

                {/* Event 3 */}
                <div className="relative group">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white dark:border-slate-900 shadow-md"></div>
                  <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-500/30 space-y-1">
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">TODAY • Active Intake</span>
                    <h4 className="font-bold text-slate-900 dark:text-white">MediKiosk AI Intake Session</h4>
                    <p className="text-slate-600 dark:text-slate-300">Case taking completed with voice STT and OCR digitization.</p>
                  </div>
                </div>

              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  onClick={() => setCurrentStep(5)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={() => {
                    if (isAyushMode) {
                      setCurrentStep(7);
                    } else {
                      handleGenerateSummary();
                    }
                  }}
                  className="px-8 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-black text-sm shadow-xl shadow-teal-600/30 flex items-center gap-2 transition"
                >
                  <span>{isAyushMode ? 'Proceed to AYUSH Intake' : 'Generate Clinical Summary'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 7: AYUSH DASHAVIDHA PARIKSHA ================= */}
          {currentStep === 7 && (
            <div className="space-y-6 max-w-3xl mx-auto py-2">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 mx-auto flex items-center justify-center mb-1">
                  <Flower2 className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  AYUSH / Ayurvedic Dashavidha Pariksha
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Assess Prakriti, Agni, Koshta, and Dashavidha constitutional parameters.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 mb-1 block">Body Frame (Sharira)</label>
                  <select
                    value={bodyFrame}
                    onChange={(e) => setBodyFrame(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="thin">Thin / Lean (Vata)</option>
                    <option value="medium">Medium / Athletic (Pitta)</option>
                    <option value="large">Broad / Heavy (Kapha)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 mb-1 block">Digestive Fire (Agni)</label>
                  <select
                    value={digestionType}
                    onChange={(e) => setDigestionType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="samagni">Samagni (Balanced & Normal)</option>
                    <option value="tikshnagni">Tikshnagni (Sharp & Intense Appetite)</option>
                    <option value="mandagni">Mandagni (Slow & Sluggish Digestion)</option>
                    <option value="vishamagni">Vishamagni (Irregular & Variable)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 mb-1 block">Bowel Tendency (Koshta)</label>
                  <select
                    value={bowelType}
                    onChange={(e) => setBowelType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="madhyama">Madhyama Koshta (Normal Formed)</option>
                    <option value="krura">Krura Koshta (Hard / Constipated)</option>
                    <option value="mridu">Mridu Koshta (Soft / Frequent)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 mb-1 block">Skin Quality (Sparsha)</label>
                  <select
                    value={skinType}
                    onChange={(e) => setSkinType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="dry">Dry / Rough (Vata)</option>
                    <option value="combination">Warm / Sensitive (Pitta)</option>
                    <option value="oily">Soft / Oily (Kapha)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handleComputeAyush}
                  className="px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition"
                >
                  Compute Prakriti & Dashavidha Profile
                </button>
              </div>

              {/* Prakriti Output Card */}
              {prakritiResult && (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-400/40 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-700 dark:text-amber-300">
                      Primary Prakriti: {prakritiResult.primaryPrakriti}
                    </span>
                    <span className="font-mono text-[11px]">
                      V:{prakritiResult.doshaDistribution.vata}% | P:{prakritiResult.doshaDistribution.pitta}% | K:{prakritiResult.doshaDistribution.kapha}%
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-200">
                    <strong>Dietary Ahara Advice:</strong> {prakritiResult.dietaryRecommendations.join(' ')}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4">
                <button
                  onClick={() => setCurrentStep(6)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={handleGenerateSummary}
                  className="px-8 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-black text-sm shadow-xl shadow-teal-600/30 flex items-center gap-2 transition"
                >
                  <span>Compile Final Summary</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 8: STRUCTURED CLINICAL SUMMARY PREVIEW ================= */}
          {currentStep === 8 && (
            <div className="space-y-6 max-w-4xl mx-auto py-2">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 mx-auto flex items-center justify-center mb-1">
                  <Stethoscope className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  Physician-Ready Structured Clinical Summary
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Draft generated for attending doctor review. Formatted in accordance with standard clinical case taking.
                </p>
              </div>

              {/* 14-Section Summary Grid */}
              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4 text-xs">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-teal-600 uppercase text-[10px] block">1. Chief Complaint (CC)</span>
                    <p className="font-bold text-slate-900 dark:text-white mt-1">
                      {generatedSummary?.sections.chiefComplaint || 'Persistent headache and occasional chest heaviness on exertion'}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-teal-600 uppercase text-[10px] block">2. History of Present Illness (HPI)</span>
                    <p className="text-slate-800 dark:text-slate-200 mt-1">
                      {generatedSummary?.sections.historyOfPresentIllness || 'Started 4 days ago with progressive worsening.'}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-teal-600 uppercase text-[10px] block">3. Past Medical & Surgical</span>
                    <p className="text-slate-800 dark:text-slate-200 mt-1">
                      {generatedSummary?.sections.pastMedicalSurgicalHistory || 'Hypertension 3 years; no surgeries.'}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-teal-600 uppercase text-[10px] block">4. Current Medications & Allergies</span>
                    <p className="text-slate-800 dark:text-slate-200 mt-1">
                      {generatedSummary?.sections.medicationsAndAllergies || 'Telmisartan 40mg. Penicillin Allergy.'}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-teal-600 uppercase text-[10px] block">5. Family & Personal History</span>
                    <p className="text-slate-800 dark:text-slate-200 mt-1">
                      {generatedSummary?.sections.familyHistory || 'Father had MI at age 55. Vegetarian diet, non-smoker.'}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-teal-600 uppercase text-[10px] block">6. Review of Systems (ROS)</span>
                    <p className="text-slate-800 dark:text-slate-200 mt-1">
                      {generatedSummary?.sections.reviewOfSystems || 'Denies fever, syncope, or limb edema.'}
                    </p>
                  </div>
                </div>

                {/* Important Items for Physician Review */}
                <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/30 border border-teal-500/30 space-y-1.5">
                  <span className="font-bold text-teal-700 dark:text-teal-300 uppercase text-[10px]">
                    Important Items Flagged For Attending Doctor Review:
                  </span>
                  <ul className="list-disc list-inside text-slate-700 dark:text-slate-200 space-y-1">
                    <li>Pre-consultation voice intake recorded and processed in {language.toUpperCase()}.</li>
                    <li>Previous prescriptions and blood investigations digitized via OCR.</li>
                    <li>Physician retains full editing, confirming, and prescribing authority.</li>
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-[11px] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-600" />
                  <span>{getTranslation(language, 'physicianDisclaimer')}</span>
                </div>

              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  onClick={() => setCurrentStep(isAyushMode ? 7 : 6)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={handleSubmitIntake}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:opacity-95 text-white font-black text-sm shadow-xl shadow-teal-600/30 flex items-center gap-2 transition"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Submit Intake & Generate OPD Token</span>
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 9: SUBMISSION SUCCESS & TOKEN ================= */}
          {currentStep === 9 && (
            <div className="space-y-6 max-w-md mx-auto py-6 text-center">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500 text-white mx-auto flex items-center justify-center shadow-xl shadow-emerald-500/30 animate-bounce">
                <Check className="w-9 h-9 stroke-[3]" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  Intake Recorded Successfully!
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Your structured clinical summary and digitized records are now available on the doctor’s clinical console.
                </p>
              </div>

              {/* Token Ticket Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-2xl space-y-4 text-left border border-slate-700">
                <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                  <div>
                    <span className="text-[10px] text-teal-400 font-bold uppercase">OPD Consultation Token</span>
                    <h4 className="text-3xl font-black text-white">{submissionToken}</h4>
                  </div>
                  <div className="p-2 bg-white rounded-xl">
                    <QrCode className="w-10 h-10 text-slate-950" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Patient Name:</span>
                    <strong className="text-white">{patientName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">ABHA Number:</span>
                    <strong className="text-white">{abhaNumber}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Assigned OPD:</span>
                    <strong className="text-teal-300">Room 104 (CNC Block)</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Status:</span>
                    <span className="text-emerald-400 font-bold">Ready for Doctor</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="px-8 py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-black text-xs shadow-lg shadow-teal-600/30 transition"
                >
                  Return to Main Portal
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
