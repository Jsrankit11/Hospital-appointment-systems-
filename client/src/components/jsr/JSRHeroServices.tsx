import React from 'react';
import {
  CalendarCheck, FlaskConical, Droplet, CreditCard,
  ShieldCheck, Video, ArrowRight, Activity, Clock, CheckCircle2,
  Mic, Flower2, FileText, Lock, User, Users, Sparkles
} from 'lucide-react';

interface JSRHeroServicesProps {
  language: 'en' | 'hi';
  onBookAppointment: () => void;
  onOpenLabReports: () => void;
  onOpenBloodAvailability: () => void;
  onOpenPaymentPortal: () => void;
  onOpenABHA: () => void;
  onOpenTeleconsult: () => void;
  onOpenAICaseTaking?: () => void;
  onOpenAyushIntake?: () => void;
  onOpenOCRScanner?: () => void;
  onOpenPatientPortal?: () => void;
  onOpenMediKiosk?: () => void;
  onOpenTriage?: () => void;
  onOpenGeminiCopilot?: () => void;
}

export const JSRHeroServices: React.FC<JSRHeroServicesProps> = ({
  language,
  onBookAppointment,
  onOpenLabReports,
  onOpenBloodAvailability,
  onOpenPaymentPortal,
  onOpenABHA,
  onOpenTeleconsult,
  onOpenAICaseTaking,
  onOpenAyushIntake,
  onOpenOCRScanner,
  onOpenPatientPortal,
  onOpenMediKiosk,
  onOpenTriage,
  onOpenGeminiCopilot
}) => {
  const services = [
    {
      id: 'ai-copilot',
      title: language === 'en' ? 'JSR AI Voice Medical Doctor' : 'जेएसआर एआई वॉयस मेडिकल डॉक्टर',
      sub: language === 'en' ? 'Multilingual Voice Consultation' : 'इंसानी आवाज में त्वरित चिकित्सीय परामर्श',
      desc: language === 'en' ? 'Instant natural Hindi/English voice consultation. Ask about symptoms, prescription safety, lab results, and differential diagnosis in real-time.' : 'इंसानी आवाज (हिन्दी व अन्य भाषाओं) में तत्काल मेडिकल उत्तर। लक्षण, दवाओं की सुरक्षा, और टेस्ट रिपोर्ट का त्वरित समाधान।',
      icon: Sparkles,
      image: '/images/6f858892-2750-45dc-b658-9ec10bca1d4a.jpg',
      color: 'from-teal-600 via-emerald-600 to-teal-800',
      badge: language === 'en' ? '🎙️ VOICE AI' : '🎙️ वॉयस एआई',
      action: onOpenGeminiCopilot || onOpenAICaseTaking
    },
    {
      id: 'medikiosk-flagship',
      title: language === 'en' ? 'MediKiosk – AI Patient Intake' : 'मेडीकियोस्क – एआई मरीज केस टेकिंग',
      sub: language === 'en' ? 'Multilingual Voice, Touch & 1-Page Summary' : 'बहुभाषी आवाज, स्पर्श व 1-पेज क्लिनिकल सारांश',
      desc: language === 'en' ? 'Complete clinical history taking before consultation. Adaptive SOCRATES questioning, emergency red flags, and physician-ready draft.' : 'परामर्श से पहले बहुभाषी वॉइस व टच द्वारा संपूर्ण केस टेकिंग। स्वचालित रेड-फ्लैग पहचान और डॉक्टर के लिए 1-पेज क्लिनिकल सारांश।',
      icon: Mic,
      image: '/images/SMS_NEW.png',
      color: 'from-emerald-700 to-teal-800',
      badge: language === 'en' ? '🌟 SIH FLAGSHIP' : '🌟 मुख्य सेवा',
      action: onOpenMediKiosk || onOpenAICaseTaking || onBookAppointment
    },
    {
      id: 'book',
      title: language === 'en' ? 'Book Hospital Appointment' : 'अस्पताल अपॉइंटमेंट बुक करें',
      sub: language === 'en' ? 'Online OPD Registration & Token' : 'ऑनलाइन ओपीडी पंजीकरण और टोकन',
      desc: language === 'en' ? 'Fast online OPD registration across AIIMS, KEM, NIMHANS, CMC Vellore, and 500+ Indian apex hospitals.' : 'एम्स, केईएम, निमहंस, सीएमसी वेल्लोर और 500+ भारतीय अस्पतालों में त्वरित ओपीडी।',
      icon: CalendarCheck,
      image: '/images/ORS1.png',
      color: 'from-emerald-600 to-teal-700',
      badge: language === 'en' ? 'FAST & INSTANT' : 'त्वरित एवं सुगम',
      action: onBookAppointment
    },
    {
      id: 'ocr',
      title: language === 'en' ? 'Document Scanner + AI OCR' : 'मेडिकल पर्चा व रिपोर्ट स्कैनर (OCR)',
      sub: language === 'en' ? 'Prescription OCR & Drug Interactions' : 'हस्तलिखित पर्चे व दवाओं की जांच',
      desc: language === 'en' ? 'Scan handwritten prescriptions and lab reports. Extracts medicines, highlights abnormal lab values, and flags fatal drug-drug interactions.' : 'पर्चे और लैब रिपोर्ट स्कैन करें। दवाइयों का विवरण, असामान्य जांच परिणाम और संभावित ड्रग इंटरैक्शन अलर्ट प्राप्त करें।',
      icon: FileText,
      image: '/images/97795-download-green.gif',
      color: 'from-blue-600 to-indigo-700',
      badge: language === 'en' ? '📄 SMART OCR' : '📄 स्मार्ट ओसीआर',
      action: onOpenOCRScanner || onOpenLabReports
    },
    {
      id: 'lab',
      title: language === 'en' ? 'Diagnostic Lab Reports' : 'डायग्नोस्टिक लैब रिपोर्ट',
      sub: language === 'en' ? 'View & Print Signed Reports' : 'हस्ताक्षरित रिपोर्ट देखें व प्रिंट करें',
      desc: language === 'en' ? 'Retrieve verified Pathology, Biochemistry & Radiology slips with 1-click clean PDF printing.' : 'यूएचआईडी या मोबाइल नंबर द्वारा अपनी पैथोलॉजी और रेडियोलॉजी रिपोर्ट प्राप्त करें।',
      icon: FlaskConical,
      image: '/images/lab_report.gif',
      color: 'from-blue-600 to-cyan-700',
      badge: language === 'en' ? 'OFFICIAL PDF' : 'आधिकारिक पीडीएफ',
      action: onOpenLabReports
    },
    {
      id: 'blood',
      title: language === 'en' ? 'Blood Bank Availability' : 'रक्त बैंक उपलब्धता',
      sub: language === 'en' ? 'Real-Time Blood Stock Finder' : 'वास्तविक समय रक्त भंडार',
      desc: language === 'en' ? 'Check live reserves of Whole Blood, Packed RBC, Platelets and Plasma across State Blood Banks.' : 'भारत भर के रक्त बैंकों में उपलब्ध रक्त इकाइयों की लाइव स्थिति जांचें।',
      icon: Droplet,
      image: '/images/blood_drop.gif',
      color: 'from-rose-600 to-red-700',
      badge: language === 'en' ? 'EMERGENCY 24/7' : 'आपातकालीन 24/7',
      action: onOpenBloodAvailability
    },
    {
      id: 'payment',
      title: language === 'en' ? 'Instant Hospital Payments' : 'त्वरित अस्पताल भुगतान',
      sub: language === 'en' ? 'Dynamic UPI QR & Tax Invoice' : 'डायनामिक यूपीआई क्यूआर एवं इनवॉइस',
      desc: language === 'en' ? 'Pay OPD fees, diagnostic tests, or bed advance with Google Pay, PhonePe, Cards, or Cash.' : 'गूगल पे, फोनपे, कार्ड या कैश द्वारा अस्पताल शुल्क का तुरंत भुगतान करें।',
      icon: CreditCard,
      image: '/images/mobile_payment.gif',
      color: 'from-purple-600 to-indigo-700',
      badge: language === 'en' ? 'UPI / CARDS' : 'यूपीआई / कार्ड',
      action: onOpenPaymentPortal
    },
    {
      id: 'tele',
      title: language === 'en' ? 'Doctor Tele-Consultation' : 'डॉक्टर वीडियो परामर्श',
      sub: language === 'en' ? 'Video OPD from Home' : 'घर बैठे वीडियो ओपीडी',
      desc: language === 'en' ? 'Connect with specialist cardiologists, neurologists, and pediatricians online via live video room.' : 'विशेषज्ञ डॉक्टरों से ऑनलाइन वीडियो परामर्श लें और ई-प्रिस्क्रिप्शन प्राप्त करें।',
      icon: Video,
      image: '/images/a7003b54-5f7b-4907-a0fa-8f81f1b1758c.jpg',
      color: 'from-teal-600 to-emerald-700',
      badge: language === 'en' ? 'VIDEO OPD' : 'वीडियो ओपीडी',
      action: onOpenTeleconsult
    },
    {
      id: 'ayush',
      title: language === 'en' ? 'AYUSH / Ayurveda Case Taking' : 'आयुष / आयुर्वेद केस टेकिंग फ्रेमवर्क',
      sub: language === 'en' ? 'Dashavidha Pariksha & Prakriti' : 'दशविध परीक्षा एवं वात-पित्त-कफ प्रकृति',
      desc: language === 'en' ? 'Comprehensive Ayurvedic assessment: Prakriti dosha distribution, Agni, Koshta, Sara, Samhanana, and tailored Ahara-Vihara diet protocols.' : 'दशविध परीक्षा, जठराग्नि, कोष्ठ, एवं प्रकृति निर्धारण के साथ संपूर्ण आयुर्वेदिक निदान एवं आहार-विहार प्रोटोकॉल।',
      icon: Flower2,
      color: 'from-emerald-700 to-green-800',
      badge: language === 'en' ? '🏥 AYUSH SPECIAL' : '🏥 आयुष विशिष्ट',
      action: onOpenAyushIntake || onBookAppointment
    }
  ];

  return (
    <section className="space-y-6">
      
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 border-2 border-emerald-500/30 text-white p-6 sm:p-10 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
              <img src="/images/ORS1.png" alt="ORS" className="w-4 h-4 object-contain" />
              <span>{language === 'en' ? 'JSR HEALTHCARE • OFFICIAL PORTAL' : 'जेएसआर हेल्थकेयर • आधिकारिक पोर्टल'}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              {language === 'en' ? (
                <>
                  All-India <span className="text-emerald-400">Hospital OPD Appointments</span> & Digital Health
                </>
              ) : (
                <>
                  अखिल भारतीय <span className="text-emerald-400">अस्पताल ओपीडी अपॉइंटमेंट</span> एवं स्वास्थ्य सेवा
                </>
              )}
            </h2>

            <p className="text-xs sm:text-base text-slate-300 leading-relaxed">
              {language === 'en'
                ? 'Complete healthcare management system providing instant online appointment booking across 500+ apex hospitals, live blood bank stocks, diagnostic report downloads, and digital payment receipts.'
                : '500+ प्रमुख अस्पतालों में ऑनलाइन अपॉइंटमेंट बुकिंग, लाइव ब्लड बैंक भंडार, डायग्नोस्टिक रिपोर्ट डाउनलोड और डिजिटल भुगतान रसीद की संपूर्ण सुविधा।'}
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={onOpenMediKiosk || onBookAppointment}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-sm shadow-xl shadow-teal-500/30 transition transform hover:-translate-y-0.5 border border-teal-200"
              >
                <Mic className="w-4 h-4 text-slate-950" />
                <span>{language === 'en' ? 'Start MediKiosk Patient Intake' : 'मेडीकियोस्क मरीज केस टेकिंग'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onBookAppointment}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-xl shadow-emerald-600/30 transition transform hover:-translate-y-0.5"
              >
                <span>{language === 'en' ? 'Book OPD Appointment Now' : 'ओपीडी अपॉइंटमेंट बुक करें'}</span>
              </button>
              <button
                onClick={onOpenPaymentPortal}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition"
              >
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span>{language === 'en' ? 'Pay Hospital Fees' : 'शुल्क का भुगतान करें'}</span>
              </button>
            </div>
          </div>

          {/* Right Banner Visual */}
          <div className="hidden lg:flex flex-col items-center gap-3 shrink-0">
            <div className="relative group">
              <div className="w-44 h-44 rounded-3xl overflow-hidden border-2 border-emerald-500/40 shadow-2xl bg-slate-800 p-2">
                <img
                  src="/images/SMS_NEW.png"
                  alt="JSR Healthcare"
                  className="w-full h-full object-contain rounded-2xl"
                />
              </div>
              <div className="absolute -bottom-3 -right-3 w-16 h-16 rounded-2xl overflow-hidden border-2 border-teal-400 shadow-xl">
                <img
                  src="/images/6f858892-2750-45dc-b658-9ec10bca1d4a.jpg"
                  alt="Doctor"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Service Cards Grid with Project Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s) => {
          const Icon = s.icon;

          return (
            <div
              key={s.id}
              onClick={s.action}
              className="group relative rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-md hover:shadow-2xl hover:border-emerald-500/60 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 p-1 bg-white dark:bg-slate-800 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    {s.image ? (
                      <img
                        src={s.image}
                        alt={s.title}
                        className="w-full h-full object-contain rounded-xl"
                      />
                    ) : (
                      <div className={`w-full h-full rounded-xl bg-gradient-to-br ${s.color} text-white flex items-center justify-center`}>
                        <Icon className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  <span className="px-3 py-1 rounded-full text-[10px] font-black bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase tracking-wider border border-slate-200 dark:border-slate-700">
                    {s.badge}
                  </span>
                </div>

                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {s.title}
                </h3>
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {s.sub}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  {s.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-black text-slate-700 dark:text-slate-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 flex items-center gap-1.5 transition-colors">
                  <span>{language === 'en' ? 'Open Service' : 'सेवा खोलें'}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};
