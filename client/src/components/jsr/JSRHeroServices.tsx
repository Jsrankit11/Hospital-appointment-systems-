import React from 'react';
import {
  CalendarCheck, FlaskConical, Droplet, CreditCard,
  ShieldCheck, Video, ArrowRight, Activity, Clock, CheckCircle2, Sparkles
} from 'lucide-react';

interface JSRHeroServicesProps {
  language: 'en' | 'hi';
  onBookAppointment: () => void;
  onOpenLabReports: () => void;
  onOpenBloodAvailability: () => void;
  onOpenPaymentPortal: () => void;
  onOpenABHA: () => void;
  onOpenTeleconsult: () => void;
}

export const JSRHeroServices: React.FC<JSRHeroServicesProps> = ({
  language,
  onBookAppointment,
  onOpenLabReports,
  onOpenBloodAvailability,
  onOpenPaymentPortal,
  onOpenABHA,
  onOpenTeleconsult
}) => {
  const services = [
    {
      id: 'book',
      title: language === 'en' ? 'Book Hospital Appointment' : 'अस्पताल अपॉइंटमेंट बुक करें',
      sub: language === 'en' ? 'Online OPD Registration & Token' : 'ऑनलाइन ओपीडी पंजीकरण और टोकन',
      desc: language === 'en' ? 'Fast online OPD registration across AIIMS, KEM, NIMHANS, CMC Vellore, and 500+ Indian apex hospitals.' : 'एम्स, केईएम, निमहंस, सीएमसी वेल्लोर और 500+ भारतीय अस्पतालों में त्वरित ओपीडी।',
      icon: CalendarCheck,
      color: 'from-emerald-600 to-teal-700',
      badge: language === 'en' ? 'FAST & INSTANT' : 'त्वरित एवं सुगम',
      action: onBookAppointment
    },
    {
      id: 'lab',
      title: language === 'en' ? 'Diagnostic Lab Reports' : 'डायग्नोस्टिक लैब रिपोर्ट',
      sub: language === 'en' ? 'View & Print Signed Reports' : 'हस्ताक्षरित रिपोर्ट देखें व प्रिंट करें',
      desc: language === 'en' ? 'Retrieve verified Pathology, Biochemistry & Radiology slips with 1-click clean PDF printing.' : 'यूएचआईडी या मोबाइल नंबर द्वारा अपनी पैथोलॉजी और रेडियोलॉजी रिपोर्ट प्राप्त करें।',
      icon: FlaskConical,
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
      color: 'from-purple-600 to-indigo-700',
      badge: language === 'en' ? 'UPI / CARDS / CASH' : 'यूपीआई / कार्ड / कैश',
      action: onOpenPaymentPortal
    },
    {
      id: 'abha',
      title: language === 'en' ? 'Digital Health ID Card' : 'डिजिटल हेल्थ आईडी कार्ड',
      sub: language === 'en' ? '14-Digit Health Account' : '14-अंकीय स्वास्थ्य खाता',
      desc: language === 'en' ? 'Create your official 14-digit Digital Health Card with QR code for paperless OPD hospital admissions.' : 'अस्पतालों में बिना कतार प्रवेश के लिए अपना 14-अंकीय डिजिटल हेल्थ कार्ड बनाएं।',
      icon: ShieldCheck,
      color: 'from-amber-600 to-orange-700',
      badge: language === 'en' ? 'DIGITAL ID' : 'डिजिटल आईडी',
      action: onOpenABHA
    },
    {
      id: 'tele',
      title: language === 'en' ? 'Doctor Tele-Consultation' : 'डॉक्टर वीडियो परामर्श',
      sub: language === 'en' ? 'Video OPD from Home' : 'घर बैठे वीडियो ओपीडी',
      desc: language === 'en' ? 'Connect with specialist cardiologists, neurologists, and pediatricians online via live video room.' : 'विशेषज्ञ डॉक्टरों से ऑनलाइन वीडियो परामर्श लें और ई-प्रिस्क्रिप्शन प्राप्त करें।',
      icon: Video,
      color: 'from-teal-600 to-emerald-700',
      badge: language === 'en' ? 'VIDEO OPD' : 'वीडियो ओपीडी',
      action: onOpenTeleconsult
    }
  ];

  return (
    <section className="space-y-6">
      
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 border-2 border-emerald-500/30 text-white p-6 sm:p-10 shadow-2xl">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
            <Sparkles className="w-4 h-4" />
            <span>{language === 'en' ? 'JSR HEALTHCARE • CREATED BY ANKIT CHAUDHARY' : 'जेएसआर हेल्थकेयर • अंकित चौधरी द्वारा निर्मित'}</span>
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
              onClick={onBookAppointment}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-xl shadow-emerald-600/30 transition transform hover:-translate-y-0.5"
            >
              <span>{language === 'en' ? 'Book OPD Appointment Now' : 'ओपीडी अपॉइंटमेंट बुक करें'}</span>
              <ArrowRight className="w-4 h-4" />
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
      </div>

      {/* 6 Core Service Cards Grid */}
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
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} text-white flex items-center justify-center shadow-lg shadow-teal-900/20 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7" />
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
