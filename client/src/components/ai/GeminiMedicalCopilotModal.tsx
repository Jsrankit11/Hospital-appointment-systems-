import React, { useState, useEffect, useRef } from 'react';
import API from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import {
  Sparkles, Send, Mic, MicOff, Volume2, VolumeX, RotateCcw,
  Languages, Download, Copy, Check, AlertTriangle, ShieldAlert,
  Bot, User, Activity, FileText, HeartPulse, Stethoscope,
  X, ChevronRight, Zap, RefreshCw
} from 'lucide-react';
import { ValidationBadge } from '../common/ValidationBadge';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isRedFlag?: boolean;
  differentialDiagnosis?: string[];
  suggestedActions?: string[];
}

interface GeminiMedicalCopilotModalProps {
  onClose: () => void;
  language?: 'en' | 'hi';
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

const PROMPT_SUGGESTIONS = [
  { en: "Explain my high fasting blood sugar (148 mg/dL)", hi: "मेरे 148 mg/dL फास्टिंग ब्लड शुगर का मतलब समझाएं" },
  { en: "Check drug interaction between Aspirin and Warfarin", hi: "एस्पिरिन और वारफारिन दवाओं के खतरे की जांच करें" },
  { en: "Severe chest tightness radiating to left arm", hi: "सीने में तेज दबाव और बाएं हाथ में दर्द हो रहा है" },
  { en: "Homeopathic & Ayush remedy for dry chronic cough", hi: "पुरानी सूखी खांसी के लिए आयुष और आयुर्वेदिक उपाय बताएं" }
];

export const GeminiMedicalCopilotModal: React.FC<GeminiMedicalCopilotModalProps> = ({
  onClose,
  language: initialLang = 'hi'
}) => {
  const { addToast } = useNotification();
  const [selectedLang, setSelectedLang] = useState<string>(initialLang);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: selectedLang === 'hi'
        ? "नमस्ते! मैं आपका **JSR AI क्लीनिकल मेडिकल कॉपायलट (AI Doctor)** हूँ। आप बोलकर (Voice 🎤) या लिखकर अपने लक्षण, दवाओं की जानकारी या लैब रिपोर्ट पूछ सकते हैं। मैं तुरंत इंसानी आवाज में उत्तर दूंगा।"
        : "Hello! I am your **JSR AI Clinical Medical Copilot (AI Doctor)**. You can speak (Voice 🎤) or type symptoms, prescription queries, or lab results. I will provide instant answers and natural voice guidance.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoTTS, setAutoTTS] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = false;

      const currLangObj = LANGUAGES.find(l => l.code === selectedLang) || LANGUAGES[0];
      recog.lang = currLangObj.speechLang;

      recog.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputMessage(transcript);
          setIsListening(false);
          // Instant automated query submission when speech is recognized!
          handleSendQuery(transcript);
        }
      };

      recog.onerror = (e: any) => {
        console.error('STT Error:', e);
        setIsListening(false);
      };

      recog.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recog;
    }
  }, [selectedLang]);

  // Human-like Multilingual Text-to-Speech Engine
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    // Clean markdown stars/formatting for natural speech
    const cleanText = text.replace(/[*_#`~]/g, '').trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const currLangObj = LANGUAGES.find(l => l.code === selectedLang) || LANGUAGES[0];
    utterance.lang = currLangObj.speechLang;
    utterance.rate = 0.95; // Natural human cadence
    utterance.pitch = 1.05;

    // Pick best available natural voice
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const matchVoice = voices.find(v => v.lang.startsWith(currLangObj.speechLang.substring(0, 2)) && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Neural')));
      if (matchVoice) {
        utterance.voice = matchVoice;
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

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      stopSpeaking();
      try {
        recognitionRef.current?.start();
        setIsListening(true);
        addToast('info', 'Listening...', 'Speak in your selected language now.');
      } catch (err) {
        console.error('Speech recognition start error:', err);
      }
    }
  };

  const handleSendQuery = async (queryText?: string) => {
    const textToSend = queryText || inputMessage;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await API.post('/ai/copilot/chat', {
        message: textToSend,
        language: selectedLang,
        chatHistory: messages.map(m => ({ sender: m.sender, text: m.text }))
      });

      if (res.data && res.data.success) {
        const assistantMsg: Message = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: res.data.response,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isRedFlag: res.data.isRedFlag,
          differentialDiagnosis: res.data.differentialDiagnosis,
          suggestedActions: res.data.suggestedActions
        };

        setMessages(prev => [...prev, assistantMsg]);

        if (autoTTS) {
          speakText(res.data.response);
        }

        if (res.data.isRedFlag) {
          addToast('error', '🚨 Critical Medical Alert', 'Immediate medical attention advised!');
        }
      } else {
        throw new Error('Could not get response from AI Copilot');
      }
    } catch (err: any) {
      console.error('Copilot Chat Error:', err);
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: selectedLang === 'hi'
          ? "क्षमा करें, AI सेवा से जुड़ने में समस्या हुई। कृपया पुनः प्रयास करें।"
          : "Apologies, could not connect to AI Medical Copilot. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    addToast('success', 'Copied to Clipboard', 'Text copied successfully');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadChat = () => {
    const chatContent = messages.map(m => `[${m.timestamp}] ${m.sender.toUpperCase()}:\n${m.text}\n`).join('\n---\n\n');
    const blob = new Blob([chatContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `JSR_AI_Medical_Consultation_${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    addToast('success', 'Downloaded', 'Consultation transcript downloaded.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl h-[94vh] sm:h-[90vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-teal-500/30 shadow-2xl shadow-teal-500/10 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-teal-600/15 via-emerald-600/10 to-cyan-500/10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl overflow-hidden border-2 border-emerald-400 text-white flex items-center justify-center shadow-lg shadow-teal-500/20 bg-slate-800">
                <img
                  src="/images/6f858892-2750-45dc-b658-9ec10bca1d4a.jpg"
                  alt="JSR AI Doctor"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                  JSR AI Clinical Doctor
                </h3>
                <ValidationBadge status="VERIFIED" label="Clinical AI 2.0" size="sm" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Human-like Voice Intake & Real-Time Clinical Diagnostic Reasoning
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Selection */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
              <Languages className="w-3.5 h-3.5 text-indigo-500 ml-1 mr-1 hidden sm:block" />
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                aria-label="Select consultation language"
                className="bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer py-1 px-1 rounded-lg"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code} className="dark:bg-slate-900">
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Auto Voice TTS Toggle */}
            <button
              onClick={() => setAutoTTS(!autoTTS)}
              title={autoTTS ? 'Auto Voice Speech ON' : 'Voice Speech Muted'}
              className={`p-2 rounded-xl border transition-all ${
                autoTTS
                  ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
              }`}
            >
              {autoTTS ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Download Button */}
            <button
              onClick={handleDownloadChat}
              title="Download Transcript"
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-all hidden sm:block"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Close Button */}
            <button
              onClick={() => {
                stopSpeaking();
                onClose();
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-950/50">
          
          {/* Quick Suggestions Chips */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pb-2">
            {PROMPT_SUGGESTIONS.map((item, idx) => {
              const text = selectedLang === 'hi' ? item.hi : item.en;
              return (
                <button
                  key={idx}
                  onClick={() => handleSendQuery(text)}
                  className="flex items-center gap-2 p-2.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-indigo-500/15 hover:border-indigo-500/40 text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-indigo-500/5 transition-all shadow-sm group"
                >
                  <Zap className="w-3.5 h-3.5 text-indigo-500 group-hover:scale-110 transition-transform shrink-0" />
                  <span className="line-clamp-1">{text}</span>
                  <ChevronRight className="w-3 h-3 text-slate-400 ml-auto shrink-0" />
                </button>
              );
            })}
          </div>

          {/* Messages List */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[88%] sm:max-w-[80%] ${
                msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-2xl overflow-hidden flex items-center justify-center shrink-0 shadow-md ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white'
                    : msg.isRedFlag
                    ? 'bg-rose-600 text-white animate-bounce'
                    : 'border border-emerald-500/40 bg-slate-800'
                }`}
              >
                {msg.sender === 'user' ? (
                  <User className="w-4 h-4" />
                ) : msg.isRedFlag ? (
                  <ShieldAlert className="w-4 h-4" />
                ) : (
                  <img
                    src="/images/6f858892-2750-45dc-b658-9ec10bca1d4a.jpg"
                    alt="Doctor"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`rounded-3xl p-4 sm:p-5 shadow-sm space-y-2 relative group ${
                  msg.sender === 'user'
                    ? 'bg-teal-700 text-white rounded-tr-none'
                    : msg.isRedFlag
                    ? 'bg-rose-50 dark:bg-rose-950/40 border border-rose-500/30 text-slate-800 dark:text-rose-100 rounded-tl-none'
                    : 'bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-slate-800 dark:text-slate-100 rounded-tl-none'
                }`}
              >
                {/* Red Flag Alert Header */}
                {msg.isRedFlag && (
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold">
                    <AlertTriangle className="w-4 h-4" />
                    <span>EMERGENCY RED FLAG ALERT</span>
                  </div>
                )}

                {/* Message Body */}
                <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                  {msg.text}
                </div>

                {/* Differential Diagnosis Tags */}
                {msg.differentialDiagnosis && msg.differentialDiagnosis.length > 0 && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 space-y-1">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
                      🩺 Differential Diagnosis / संभावित निदान:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.differentialDiagnosis.map((dx, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-lg bg-teal-500/10 text-teal-700 dark:text-teal-300 text-[11px] font-semibold border border-teal-500/20">
                          {dx}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested Clinical Actions */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="pt-2 space-y-1">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
                      ⚡ Recommended Next Steps:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestedActions.map((act, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendQuery(act)}
                          className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-teal-500/10 hover:text-teal-600 text-slate-700 dark:text-slate-300 text-[11px] font-medium border border-slate-200 dark:border-slate-600 transition-colors flex items-center gap-1"
                        >
                          <ChevronRight className="w-3 h-3 text-teal-600" />
                          <span>{act}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer / Time & Action Toolbar */}
                <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'assistant' && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => speakText(msg.text)}
                        title="Speak Out Loud"
                        className="p-1 hover:text-teal-600 rounded"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => copyToClipboard(msg.text, msg.id)}
                        title="Copy text"
                        className="p-1 hover:text-teal-600 rounded"
                      >
                        {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex gap-3 max-w-[80%]">
              <div className="w-9 h-9 rounded-2xl overflow-hidden border border-emerald-400 text-white flex items-center justify-center shrink-0 shadow-md">
                <img
                  src="/images/6f858892-2750-45dc-b658-9ec10bca1d4a.jpg"
                  alt="Doctor"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl rounded-tl-none p-4 shadow-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce [animation-delay:0.4s]"></div>
                <span className="text-xs text-slate-400 font-medium ml-2">
                  JSR AI Clinical Engine Thinking...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
          
          {/* Audio Waveform status banner if listening or speaking */}
          {(isListening || isSpeaking) && (
            <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 text-xs font-semibold animate-pulse">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
                <span>
                  {isListening
                    ? `🎤 Sun raha hoon (${LANGUAGES.find(l => l.code === selectedLang)?.label})... Boliye!`
                    : `🔊 Bol raha hoon...`}
                </span>
              </div>
              <button
                onClick={() => {
                  if (isListening) toggleListening();
                  if (isSpeaking) stopSpeaking();
                }}
                className="text-[11px] underline hover:text-rose-500"
              >
                Stop
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            {/* Mic Button for Voice AI */}
            <button
              onClick={toggleListening}
              className={`p-3 rounded-2xl flex items-center justify-center transition-all ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/30'
                  : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 border border-indigo-500/20'
              }`}
              title={isListening ? 'Stop Listening' : 'Speak your query (Hindi/English)'}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Input Text Box */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendQuery();
                }}
                placeholder={
                  selectedLang === 'hi'
                    ? "लक्षण लिखें या बोलें (उदा. मुझे 2 दिन से बुखार और सिरदर्द है)..."
                    : "Type symptoms or medical queries (e.g. fever for 2 days)..."
                }
                className="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            {/* Send Button */}
            <button
              onClick={() => handleSendQuery()}
              disabled={!inputMessage.trim() || loading}
              className="p-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
