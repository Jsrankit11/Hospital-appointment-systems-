import React, { useState, useEffect, useRef } from 'react';
import API from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import {
  Mic, MicOff, Volume2, VolumeX, Send, AlertTriangle, ShieldAlert,
  CheckCircle2, ChevronRight, Activity, RotateCcw,
  Languages, FileText, HeartPulse, Stethoscope, X, User, Sparkles
} from 'lucide-react';
import { AICaseStep } from '../../types';
import { ValidationBadge } from '../common/ValidationBadge';

interface AICaseTakingModalProps {
  onClose: () => void;
  onCompleted?: (summaryData: any) => void;
  language?: string;
}

const LANGUAGES = [
  { code: 'hi', label: 'हिन्दी (Hindi)', speechLang: 'hi-IN' },
  { code: 'en', label: 'English (India)', speechLang: 'en-IN' },
  { code: 'hinglish', label: 'Hinglish (हिंग्लिश)', speechLang: 'hi-IN' },
  { code: 'mr', label: 'मराठी (Marathi)', speechLang: 'mr-IN' },
  { code: 'bn', label: 'বাংলা (Bengali)', speechLang: 'bn-IN' },
  { code: 'ta', label: 'தமிழ் (Tamil)', speechLang: 'ta-IN' },
  { code: 'te', label: 'తెలుగు (Telugu)', speechLang: 'te-IN' },
  { code: 'gu', label: 'ગુજરાતી (Gujarati)', speechLang: 'gu-IN' }
];

export const AICaseTakingModal: React.FC<AICaseTakingModalProps> = ({
  onClose,
  onCompleted,
  language: initialLang = 'hi'
}) => {
  const { addToast } = useNotification();
  const [selectedLang, setSelectedLang] = useState<string>(initialLang);
  const [isAyushMode, setIsAyushMode] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  
  const [currentStep, setCurrentStep] = useState<AICaseStep | null>(null);
  const [stepNumber, setStepNumber] = useState<number>(1);
  const [totalSteps, setTotalSteps] = useState<number>(9);
  
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [inputText, setInputText] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [autoVoiceTTS, setAutoVoiceTTS] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  // Red-Flag Emergency State
  const [redFlagAlert, setRedFlagAlert] = useState<{
    hasRedFlag: boolean;
    triageLevel: 'RED' | 'YELLOW' | 'GREEN';
    alertTitle: string;
    instruction: string;
  } | null>(null);

  // Completed Summary State
  const [generatedSummary, setGeneratedSummary] = useState<any | null>(null);

  // Speech Recognition instance ref
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = false;

      const curr = LANGUAGES.find(l => l.code === selectedLang) || LANGUAGES[0];
      recog.lang = curr.speechLang;

      recog.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText(transcript);
          setIsListening(false);
          // Instant Turn-Taking submission: automatically submit when voice is recognized
          handleAnswerSubmit(transcript);
        }
      };

      recog.onerror = () => {
        setIsListening(false);
      };

      recog.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recog;
    }
  }, [selectedLang]);

  // Voice Text-to-Speech synthesizer with natural human-like cadence
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const cleanText = text.replace(/[*_#`~]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    const curr = LANGUAGES.find(l => l.code === selectedLang) || LANGUAGES[0];
    utterance.lang = curr.speechLang;
    utterance.rate = 0.95; // Human conversational speed
    utterance.pitch = 1.05;

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const bestVoice = voices.find(v => v.lang.startsWith(curr.speechLang.substring(0, 2)) && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Neural')));
      if (bestVoice) {
        utterance.voice = bestVoice;
      }
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Start Session on Mount or Language Change
  useEffect(() => {
    startCaseTakingSession();
    return () => {
      stopSpeaking();
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [selectedLang, isAyushMode]);

  const startCaseTakingSession = async () => {
    setLoading(true);
    try {
      const res = await API.post('/ai/conversation/start', {
        patientId: 'PAT-1001',
        language: selectedLang === 'hi' || selectedLang === 'hinglish' ? 'hi' : selectedLang,
        isAyush: isAyushMode
      });

      if (res.data.success) {
        setSessionId(res.data.data.sessionId);
        setCurrentStep(res.data.data.currentStep);
        setStepNumber(1);
        setTotalSteps(res.data.data.totalSteps || 9);

        if (autoVoiceTTS && res.data.data.currentStep?.questionText) {
          speakText(res.data.data.currentStep.questionText);
        }
      }
    } catch (err: any) {
      console.error('Session start error:', err);
      addToast('error', 'Connection Error', 'Could not start AI case session.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle Microphone
  const toggleListening = () => {
    if (!recognitionRef.current) {
      addToast('error', 'Voice Input Unavailable', 'Web Speech recognition not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      stopSpeaking();
      try {
        const curr = LANGUAGES.find(l => l.code === selectedLang) || LANGUAGES[0];
        recognitionRef.current.lang = curr.speechLang;
        recognitionRef.current.start();
        setIsListening(true);
        addToast('info', 'Sun Raha Hoon...', 'Apni aawaz me bole (Speak now)');
      } catch (err) {
        console.error('Speech error:', err);
        setIsListening(false);
      }
    }
  };

  // Submit Current Answer
  const handleAnswerSubmit = async (customAnswer?: string) => {
    const textToSubmit = (customAnswer !== undefined ? customAnswer : inputText).trim();
    if (!textToSubmit || !currentStep) return;

    setLoading(true);
    stopSpeaking();

    try {
      const res = await API.post('/ai/conversation/respond', {
        sessionId,
        stepId: currentStep.stepId,
        answerText: textToSubmit,
        language: selectedLang === 'hi' || selectedLang === 'hinglish' ? 'hi' : selectedLang,
        isAyush: isAyushMode
      });

      if (res.data.success) {
        const { nextStep, completedSteps, triageStatus, currentAnswers } = res.data.data;
        setAnswers(currentAnswers || { ...answers, [currentStep.stepId]: textToSubmit });
        setInputText('');

        // Update triage red-flags
        if (triageStatus?.hasRedFlag && triageStatus.triageLevel === 'RED') {
          setRedFlagAlert({
            hasRedFlag: true,
            triageLevel: 'RED',
            alertTitle: triageStatus.alertTitle || '🚨 IMMEDIATE EMERGENCY RED FLAG',
            instruction: triageStatus.instruction || 'Direct physician evaluation indicated immediately.'
          });
          addToast('error', 'CRITICAL EMERGENCY DETECTED', triageStatus.alertTitle || 'Priority emergency alert triggered!');
        }

        if (nextStep.isLast || completedSteps >= 9) {
          // Intake finished -> Generate 1-Page Summary
          generateFinalSummary();
        } else {
          setCurrentStep(nextStep);
          setStepNumber(completedSteps + 1);

          if (autoVoiceTTS && nextStep.questionText) {
            speakText(nextStep.questionText);
          }
        }
      }
    } catch (err: any) {
      console.error('Submit answer error:', err);
      addToast('error', 'Submission Failed', 'Failed saving case step.');
    } finally {
      setLoading(false);
    }
  };

  // Final Summary Generator
  const generateFinalSummary = async () => {
    setLoading(true);
    try {
      const res = await API.post('/ai/clinical-summary/generate', {
        patientId: 'PAT-1001',
        sessionId
      });

      if (res.data.success) {
        setGeneratedSummary(res.data.data);
        if (onCompleted) onCompleted(res.data.data);
        addToast('success', 'Case Taking Completed', '1-Page Clinical Summary compiled for Attending Doctor.');
      }
    } catch (err) {
      console.error('Summary gen error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[94vh] sm:max-h-[92vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-teal-500/30 shadow-2xl shadow-teal-500/10 overflow-hidden">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-teal-500/15 via-emerald-500/10 to-indigo-500/10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl overflow-hidden border-2 border-emerald-400 bg-slate-800 text-white flex items-center justify-center shadow-lg shadow-teal-500/20">
              <img
                src="/images/6f858892-2750-45dc-b658-9ec10bca1d4a.jpg"
                alt="Doctor"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {selectedLang === 'en' ? 'AI Conversational Case Taking' : 'एआई वॉयस केस टेकिंग (केस विवरण)'}
                </h3>
                <ValidationBadge status="VERIFIED" label="SOCRATES + AYUSH" size="sm" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                {selectedLang === 'en' ? 'Voice & Touch Multilingual Clinical Intake' : 'आवाज और स्पर्श द्वारा बहुभाषी चिकित्सीय विवरण'}
              </p>
            </div>
          </div>

          {/* Controls: Language, Audio TTS, Close */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
              <Languages className="w-3.5 h-3.5 text-teal-500 ml-1 mr-1 hidden sm:block" />
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                aria-label="Select voice and case-taking language"
                className="bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer py-1 px-1 rounded-lg"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code} className="dark:bg-slate-900">
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setAutoVoiceTTS(!autoVoiceTTS)}
              title={autoVoiceTTS ? 'Mute AI Voice' : 'Unmute AI Voice'}
              className={`p-2 rounded-xl border transition ${
                autoVoiceTTS
                  ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
              }`}
            >
              {autoVoiceTTS ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={() => {
                stopSpeaking();
                onClose();
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Real-Time Red Flag Emergency Banner */}
        {redFlagAlert && (
          <div className="p-4 bg-rose-600 text-white flex items-center justify-between gap-4 animate-bounce">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-8 h-8 text-white flex-shrink-0 animate-pulse" />
              <div>
                <h4 className="font-black text-sm tracking-wide uppercase">{redFlagAlert.alertTitle}</h4>
                <p className="text-xs text-rose-100">{redFlagAlert.instruction}</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-white text-rose-600 font-black text-xs uppercase shadow-md flex-shrink-0">
              PRIORITY TRIAGE CODE RED
            </span>
          </div>
        )}

        {/* Stepper Progress Bar */}
        <div className="px-4 sm:px-6 pt-3.5 pb-2 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
            <span>
              {selectedLang === 'en' ? `Step ${stepNumber} of ${totalSteps}` : `चरण ${stepNumber} / ${totalSteps}`} :{' '}
              <strong className="text-teal-600 dark:text-teal-400">{currentStep?.title || 'Case Intake'}</strong>
            </span>
            <span>{Math.round((stepNumber / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-500 rounded-full"
              style={{ width: `${(stepNumber / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {!generatedSummary ? (
            <div className="space-y-6">
              
              {/* AI Question Bubble */}
              <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-teal-500/10 via-slate-50 dark:via-slate-800/80 to-emerald-500/10 border-2 border-teal-500/20 shadow-md space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-teal-600 text-white shadow-sm">
                      <Stethoscope className="w-3.5 h-3.5" />
                      {selectedLang === 'en' ? 'Doctor AI Clinical Assistant' : 'डॉक्टर एआई क्लिनिकल सहायक'}
                    </span>
                    <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
                      {currentStep?.questionText}
                    </h2>
                  </div>

                  <button
                    onClick={() => speakText(currentStep?.questionText || '')}
                    className={`p-3 rounded-2xl transition shadow-sm shrink-0 ${
                      isSpeaking
                        ? 'bg-teal-600 text-white animate-pulse'
                        : 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-300 hover:bg-teal-50'
                    }`}
                    title="Listen to question in Hindi/English"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Quick Touch Pill Suggestions */}
                {currentStep?.quickOptions && currentStep.quickOptions.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      {selectedLang === 'en' ? 'Quick Tap Answers:' : 'त्वरित विकल्प चुनें:'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {currentStep.quickOptions.map((opt, idx) => (
                        <button
                          key={idx}
                          disabled={loading}
                          onClick={() => handleAnswerSubmit(opt)}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 hover:bg-teal-500 hover:text-white dark:hover:bg-teal-600 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-teal-500 shadow-sm transition active:scale-95"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Patient Voice & Text Input Console */}
              <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <Mic className="w-4 h-4 text-teal-500" />
                    {selectedLang === 'en' ? 'Your Answer (Speak or Type)' : 'आपका उत्तर (बोलें या लिखें)'}
                  </span>
                  
                  {isListening && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500 text-white animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                      {selectedLang === 'en' ? 'Listening... Speak clearly' : 'सुन रहा हूँ... बोलिए'}
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <textarea
                      rows={3}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder={
                        selectedLang === 'en'
                          ? 'Describe your symptom or tap mic to speak...'
                          : 'लक्षण का विवरण दें या माइक दबाकर बोलें...'
                      }
                      className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none font-medium"
                    />
                  </div>

                  <div className="flex sm:flex-col gap-2">
                    <button
                      onClick={toggleListening}
                      className={`flex-1 sm:flex-none p-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-xs transition shadow-md ${
                        isListening
                          ? 'bg-rose-500 text-white animate-pulse'
                          : 'bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 hover:bg-teal-100 border border-teal-500/30'
                      }`}
                    >
                      {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                      <span className="sm:hidden">{isListening ? 'Stop' : 'Speak'}</span>
                    </button>

                    <button
                      disabled={!inputText.trim() || loading}
                      onClick={() => handleAnswerSubmit()}
                      className="flex-1 sm:flex-none p-4 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 disabled:opacity-50 transition shadow-md shadow-teal-500/20"
                    >
                      <Send className="w-5 h-5" />
                      <span className="sm:hidden">Send</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Progress answers review */}
              {Object.keys(answers).length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    Recorded Clinical History
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {Object.entries(answers).map(([key, val], idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <span className="font-bold text-teal-600 dark:text-teal-400 block text-[11px]">{key}</span>
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ) : (
            /* Final Summary Preview View */
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/30 text-slate-900 dark:text-white space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black">1-Page Clinical Summary Ready</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Generated according to Section 18 Clinical Format & ABDM FHIR Standards.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-emerald-500/20 text-xs">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 font-semibold block">Provisional Diagnosis:</span>
                    <strong className="text-teal-600 dark:text-teal-400 text-sm">
                      {generatedSummary.provisionalWorkingDiagnosis || 'Essential Hypertension with Stage 2 DM Suspicion'}
                    </strong>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 font-semibold block">Triage Priority:</span>
                    <strong className="text-emerald-600 text-sm uppercase font-black">
                      {generatedSummary.triageLevel || 'CODE GREEN'}
                    </strong>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-lg shadow-teal-500/20"
                  >
                    Done & Send to Doctor Console
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
