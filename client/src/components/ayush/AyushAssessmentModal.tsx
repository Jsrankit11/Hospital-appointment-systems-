import React, { useState } from 'react';
import API from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import {
  Flower2, CheckCircle2, Award, HeartHandshake,
  Flame, Utensils, Moon, ShieldCheck, X, FileText, FileCheck, ChevronRight, Activity
} from 'lucide-react';
import { AyushAssessmentData } from '../../types';

interface AyushAssessmentModalProps {
  onClose: () => void;
  onSaved?: (data: AyushAssessmentData) => void;
  language?: 'en' | 'hi';
}

export const AyushAssessmentModal: React.FC<AyushAssessmentModalProps> = ({
  onClose,
  onSaved,
  language = 'en'
}) => {
  const { addToast } = useNotification();
  const isHindi = language === 'hi';

  const [activeTab, setActiveTab] = useState<'PRAKRITI' | 'DASHAVIDHA' | 'ASHTAVIDHA' | 'RESULT'>('PRAKRITI');
  const [loading, setLoading] = useState(false);

  // Form State
  const [bodyFrame, setBodyFrame] = useState<'thin' | 'medium' | 'large'>('medium');
  const [skinType, setSkinType] = useState<'dry' | 'warm' | 'thick'>('warm');
  const [appetite, setAppetite] = useState<'irregular' | 'sharp' | 'slow'>('sharp');
  const [digestion, setDigestion] = useState<'vishamagni' | 'tikshnagni' | 'mandagni' | 'samagni'>('tikshnagni');
  const [bowelHabit, setBowelHabit] = useState<'krura' | 'mridu' | 'madhyama'>('madhyama');
  const [sleep, setSleep] = useState<'light' | 'moderate' | 'deep'>('moderate');
  const [mindTemperament, setMindTemperament] = useState<'quick' | 'sharp' | 'calm'>('sharp');
  
  // Dashavidha details
  const [sara, setSara] = useState('Rasa & Rakta Sara (Madhyama)');
  const [samhanana, setSamhanana] = useState('Madhyama Samhanana (Moderate Compactness)');
  const [satmya, setSatmya] = useState('Sarva-rasa Satmya (Diverse Adaptability)');
  const [sattva, setSattva] = useState('Pravara Sattva (High Mental Resilience)');
  const [vyayamaShakti, setVyayamaShakti] = useState('Madhyama (Moderate Endurance)');
  const [currentComplaintDosha, setCurrentComplaintDosha] = useState('Pitta-Vata Dushti with Amla-Pitta');

  const [resultData, setResultData] = useState<AyushAssessmentData | null>(null);

  const handleSubmitAssessment = async () => {
    setLoading(true);
    try {
      const res = await API.post('/ai/ayush/assess', {
        patientId: 'PAT-1001',
        assessmentData: {
          bodyFrame,
          skinType,
          appetite,
          digestion,
          bowelHabit,
          sleep,
          mindTemperament,
          currentComplaintDosha,
          dashavidha: {
            sara,
            samhanana,
            satmya,
            sattva,
            vyayamaShakti
          }
        }
      });

      if (res.data.success) {
        setResultData(res.data.data);
        setActiveTab('RESULT');
        if (onSaved) onSaved(res.data.data);
        addToast('success', 'AYUSH Assessment Completed', `Computed Primary Prakriti: ${res.data.data.primaryPrakriti}`);
      }
    } catch (err: any) {
      console.error('AYUSH Error:', err);
      addToast('error', 'Assessment Failed', 'Could not compute AYUSH assessment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-emerald-500/30 shadow-2xl shadow-emerald-500/10 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-emerald-600/15 via-teal-500/10 to-amber-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Flower2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {isHindi ? 'आयुष / आयुर्वेद केस टेकिंग फ्रेमवर्क' : 'AYUSH & Ayurveda Case Taking Protocol'}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  Dashavidha Pariksha
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isHindi ? 'प्रकृति, विकृति, अग्नि, कोष्ठ एवं दशविध परीक्षा' : 'Prakriti, Vikriti, Agni, Koshta & 10-fold Ayurvedic Diagnostics'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 overflow-x-auto">
          {[
            { id: 'PRAKRITI', label: isHindi ? '1. दोष व प्रकृति' : '1. Dosha & Constitution', icon: Flame },
            { id: 'DASHAVIDHA', label: isHindi ? '2. दशविध परीक्षा' : '2. Dashavidha Pariksha', icon: Award },
            { id: 'ASHTAVIDHA', label: isHindi ? '3. अष्टविध नाड़ी परीक्षा' : '3. Ashtavidha Pariksha', icon: Activity },
            { id: 'RESULT', label: isHindi ? '4. आयुष रिपोर्ट' : '4. AYUSH Clinical Report', icon: FileCheck, disabled: !resultData }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                disabled={tab.disabled}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 border-b-2 font-bold text-xs flex items-center gap-2 transition whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed ${
                  isActive
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 rounded-t-xl'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: Prakriti Constitutional Assessment */}
          {activeTab === 'PRAKRITI' && (
            <div className="space-y-6">
              
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300">
                <strong>{isHindi ? 'दोष निर्धारण:' : 'Ayurvedic Dosha Determination:'}</strong>{' '}
                {isHindi
                  ? 'रोगियों की शारीरिक बनावट, त्वचा, भूख (अग्नि), और कोष्ठ के आधार पर वात, पित्त, एवं कफ प्रकृति का सटीक अनुपात।'
                  : 'Constitutional assessment evaluates intrinsic Vata, Pitta, and Kapha physiological balance, digestion (Agni), and bowel function (Koshta).'}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Body Frame */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-emerald-500" />
                    {isHindi ? 'शारीरिक बनावट (Body Frame / Akruti)' : 'Body Frame (Akruti)'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'thin', label: isHindi ? 'दुबला (वात)' : 'Thin (Vata)' },
                      { id: 'medium', label: isHindi ? 'मध्यम (पित्त)' : 'Medium (Pitta)' },
                      { id: 'large', label: isHindi ? 'स्थूल (कफ)' : 'Large (Kapha)' }
                    ].map(b => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setBodyFrame(b.id as any)}
                        className={`p-2 rounded-xl text-xs font-bold border transition ${
                          bodyFrame === b.id
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Skin Type */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <HeartHandshake className="w-3.5 h-3.5 text-emerald-500" />
                    {isHindi ? 'त्वचा की प्रकृति (Sparsha / Skin)' : 'Skin Nature (Sparsha)'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'dry', label: isHindi ? 'शुष्क (रूक्ष)' : 'Dry / Rough (Vata)' },
                      { id: 'warm', label: isHindi ? 'उष्ण / संवेदनशील' : 'Warm / Sensitive (Pitta)' },
                      { id: 'thick', label: isHindi ? 'स्निग्ध / कोमल' : 'Oily / Soft (Kapha)' }
                    ].map(s => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSkinType(s.id as any)}
                        className={`p-2 rounded-xl text-xs font-bold border transition ${
                          skinType === s.id
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Jatharagni / Digestion */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    {isHindi ? 'जठराग्नि / पाचन शक्ति (Agni)' : 'Digestive Fire (Jatharagni)'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'tikshnagni', label: isHindi ? 'तीक्ष्णाग्नि (तीव्र भूख/पित्त)' : 'Tikshnagni (Sharp/Pitta)' },
                      { id: 'mandagni', label: isHindi ? 'मन्दाग्नि (धीमा पाचन/कफ)' : 'Mandagni (Slow/Kapha)' },
                      { id: 'vishamagni', label: isHindi ? 'विषमाग्नि (अनियमित/वात)' : 'Vishamagni (Irregular/Vata)' },
                      { id: 'samagni', label: isHindi ? 'समाग्नि (संतुलित)' : 'Samagni (Balanced)' }
                    ].map(a => (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => setDigestion(a.id as any)}
                        className={`p-2 rounded-xl text-xs font-bold border transition ${
                          digestion === a.id
                            ? 'bg-amber-600 text-white border-amber-600 shadow-md'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Koshta / Bowel Habit */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5 text-emerald-500" />
                    {isHindi ? 'कोष्ठ / मल त्याग प्रवृत्ति (Koshta)' : 'Bowel Nature (Koshta)'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'krura', label: isHindi ? 'क्रूर कोष्ठ (कब्ज)' : 'Krura (Constipated)' },
                      { id: 'mridu', label: isHindi ? 'मृदु कोष्ठ (अतिसार)' : 'Mridu (Loose/Quick)' },
                      { id: 'madhyama', label: isHindi ? 'मध्यम कोष्ठ (सामान्य)' : 'Madhyama (Normal)' }
                    ].map(k => (
                      <button
                        key={k.id}
                        type="button"
                        onClick={() => setBowelHabit(k.id as any)}
                        className={`p-2 rounded-xl text-xs font-bold border transition ${
                          bowelHabit === k.id
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {k.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sleep Pattern */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Moon className="w-3.5 h-3.5 text-indigo-500" />
                    {isHindi ? 'निद्रा / नींद की गुणवत्ता (Nidra)' : 'Sleep Quality (Nidra)'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'light', label: isHindi ? 'अल्प / खंडित' : 'Light / Broken' },
                      { id: 'moderate', label: isHindi ? 'मध्यम (6-7h)' : 'Moderate (6-7h)' },
                      { id: 'deep', label: isHindi ? 'गहरी / भारी' : 'Deep / Heavy' }
                    ].map(sl => (
                      <button
                        key={sl.id}
                        type="button"
                        onClick={() => setSleep(sl.id as any)}
                        className={`p-2 rounded-xl text-xs font-bold border transition ${
                          sleep === sl.id
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {sl.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Current Dosha Dushti / Vikriti */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-rose-500" />
                    {isHindi ? 'वर्तमान दोष दृष्टि (Vikriti / Pathology)' : 'Current Imbalance (Vikriti)'}
                  </label>
                  <input
                    type="text"
                    value={currentComplaintDosha}
                    onChange={(e) => setCurrentComplaintDosha(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:border-emerald-500 outline-none"
                    placeholder="e.g. Vata-Pitta Dushti with Amla-Pitta"
                  />
                </div>

              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('DASHAVIDHA')}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition"
                >
                  <span>{isHindi ? 'अगला: दशविध परीक्षा' : 'Proceed to Dashavidha'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: Dashavidha Pariksha 10-Fold Assessment */}
          {activeTab === 'DASHAVIDHA' && (
            <div className="space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="font-bold text-emerald-600 uppercase text-[10px]">1. Sara (Tissue Excellence)</span>
                  <select
                    value={sara}
                    onChange={e => setSara(e.target.value)}
                    className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                  >
                    <option>Rasa & Rakta Sara (Madhyama)</option>
                    <option>Mamsa & Meda Sara (Pravara)</option>
                    <option>Asthi & Majja Sara (Madhyama)</option>
                    <option>Shukra Sara & Sarva Sara (Uttama)</option>
                  </select>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="font-bold text-emerald-600 uppercase text-[10px]">2. Samhanana (Body Compactness)</span>
                  <select
                    value={samhanana}
                    onChange={e => setSamhanana(e.target.value)}
                    className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                  >
                    <option>Madhyama Samhanana (Moderate Compactness)</option>
                    <option>Pravara Samhanana (Solid / Muscular)</option>
                    <option>Avara Samhanana (Fragile / Loose)</option>
                  </select>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="font-bold text-emerald-600 uppercase text-[10px]">3. Satmya (Homologation / Diet Adaptability)</span>
                  <select
                    value={satmya}
                    onChange={e => setSatmya(e.target.value)}
                    className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                  >
                    <option>Sarva-rasa Satmya (Diverse All-Taste Adaptability)</option>
                    <option>Madhura & Snigdha Satmya</option>
                    <option>Katu-Tikta Satmya</option>
                  </select>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="font-bold text-emerald-600 uppercase text-[10px]">4. Sattva (Mental Resilience & Temperament)</span>
                  <select
                    value={sattva}
                    onChange={e => setSattva(e.target.value)}
                    className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                  >
                    <option>Pravara Sattva (High Mental Fortitude)</option>
                    <option>Madhyama Sattva (Moderate Resilience)</option>
                    <option>Avara Sattva (Prone to Anxiety/Low Tolerance)</option>
                  </select>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="font-bold text-emerald-600 uppercase text-[10px]">5. Vyayama Shakti (Physical Endurance)</span>
                  <select
                    value={vyayamaShakti}
                    onChange={e => setVyayamaShakti(e.target.value)}
                    className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                  >
                    <option>Madhyama (Moderate Endurance)</option>
                    <option>Pravara (High Athletic Capacity)</option>
                    <option>Avara (Sedentary / Quick Fatigue)</option>
                  </select>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="font-bold text-emerald-600 uppercase text-[10px]">6. Vaya (Age Group / Stage)</span>
                  <input
                    type="text"
                    readOnly
                    value="Madhyama Vaya (34 Years)"
                    className="w-full p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs"
                  />
                </div>

              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('PRAKRITI')}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 font-bold text-xs"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('ASHTAVIDHA')}
                  className="px-6 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md"
                >
                  Proceed to Ashtavidha Pariksha
                </button>
              </div>

            </div>
          )}

          {/* TAB 3: Ashtavidha Pariksha (Pulse, Tongue, Eyes, etc.) */}
          {activeTab === 'ASHTAVIDHA' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {[
                  { name: 'Nadi (Pulse)', val: 'Mandukagati / Pitta (74 bpm)', icon: Activity },
                  { name: 'Mutra (Urine)', val: 'Pita-Varna (Normal)', icon: Award },
                  { name: 'Mala (Stool)', val: 'Niram (Normal Formed)', icon: Utensils },
                  { name: 'Jihva (Tongue)', val: 'Slight Sama (Mild White)', icon: Award },
                  { name: 'Shabda (Voice)', val: 'Spashta (Clear Resonant)', icon: Flower2 },
                  { name: 'Sparsha (Touch)', val: 'Ushna / Snigdha (Warm)', icon: HeartHandshake },
                  { name: 'Druk (Eyes)', val: 'Pita-abha / Bright', icon: ShieldCheck },
                  { name: 'Akruti (Posture)', val: 'Madhyama Proportionate', icon: Award }
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                      <span className="font-bold text-teal-600 text-[10px] flex items-center gap-1">
                        <Icon className="w-3 h-3" />
                        {item.name}
                      </span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{item.val}</p>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('DASHAVIDHA')}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 font-bold text-xs"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleSubmitAssessment}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-black text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isHindi ? 'दोष गणना करें एवं रिपोर्ट बनाएं' : 'Compute Prakriti & Generate AYUSH Record'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: Computed AYUSH Report & Prescription Draft */}
          {activeTab === 'RESULT' && resultData && (
            <div className="space-y-6">
              
              {/* Constitutional Summary Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-black tracking-widest text-emerald-200">
                      PRIMARY AYURVEDIC CONSTITUTION
                    </span>
                    <h3 className="text-2xl font-black">{resultData.primaryPrakriti}</h3>
                  </div>
                  <div className="px-4 py-2 rounded-2xl bg-white/20 backdrop-blur-md font-mono text-xs font-bold">
                    AYUSH OPD PROTOCOL
                  </div>
                </div>

                {/* Dosha Progress Bars */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span>Vata (वात)</span>
                      <span>{resultData.doshaDistribution.vata}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-black/20 overflow-hidden">
                      <div className="h-full bg-blue-300 rounded-full" style={{ width: `${resultData.doshaDistribution.vata}%` }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span>Pitta (पित्त)</span>
                      <span>{resultData.doshaDistribution.pitta}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-black/20 overflow-hidden">
                      <div className="h-full bg-amber-300 rounded-full" style={{ width: `${resultData.doshaDistribution.pitta}%` }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span>Kapha (कफ)</span>
                      <span>{resultData.doshaDistribution.kapha}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-black/20 overflow-hidden">
                      <div className="h-full bg-emerald-300 rounded-full" style={{ width: `${resultData.doshaDistribution.kapha}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Ahara & Vihara Lifestyle Recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-500/30 space-y-2">
                  <h4 className="font-black text-amber-900 dark:text-amber-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Utensils className="w-4 h-4 text-amber-500" />
                    Ahara (Dietary Protocols)
                  </h4>
                  <ul className="space-y-1.5 text-amber-800 dark:text-amber-300 list-disc list-inside">
                    {resultData.dietaryRecommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/30 border border-teal-500/30 space-y-2">
                  <h4 className="font-black text-teal-900 dark:text-teal-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-teal-500" />
                    Vihara & Dinacharya (Daily Routine)
                  </h4>
                  <p className="text-teal-800 dark:text-teal-300">{resultData.lifestyleAdvice}</p>
                  <p className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold">
                    Agni Status: {resultData.dashavidhaSummary.agni} | Koshta: {resultData.dashavidhaSummary.koshta}
                  </p>
                </div>

              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition"
                >
                  Done & Close
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
