import React from 'react';
import {
  CalendarCheck, FlaskConical, Droplet, CreditCard,
  ShieldCheck, Video, ArrowRight, Activity, Clock, CheckCircle2, Sparkles
} from 'lucide-react';

interface ORSHeroServicesProps {
  language: 'en' | 'hi';
  onBookAppointment: () => void;
  onOpenLabReports: () => void;
  onOpenBloodAvailability: () => void;
  onOpenPaymentPortal: () => void;
  onOpenABHA: () => void;
  onOpenTeleconsult: () => void;
}

export const ORSHeroServices: React.FC<ORSHeroServicesProps> = ({
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
      title: language === 'en' ? 'Book Appointment Now' : 'अपॉइंटमेंट बुक करें',
      sub: language === 'en' ? 'Online OPD Registration & Token' : 'ऑनलाइन ओपीडी पंजीकरण और टोकन',
      desc: language === 'en' ? 'Aadhaar / Mobile verified OPD appointment booking across 500+ AIIMS and State Government Hospitals.' : '500+ एम्स और सरकारी अस्पतालों में आधार/मोबाइल से ओपीडी अपॉइंटमेंट।',
      icon: CalendarCheck,
      color: 'from-emerald-600 to-teal-700',
      badge: language === 'en' ? 'FAST & FREE' : 'मुफ़्त एवं त्वरित',
      action: onBookAppointment,
      image: '/images/ORS1.png'
    },
    {
      id: 'lab',
      title: language === 'en' ? 'Lab Reports Online' : 'लैब रिपोर्ट ऑनलाइन देखें',
      sub: language === 'en' ? 'View & Download Diagnostic Reports' : 'डायग्नोस्टिक रिपोर्ट डाउनलोड करें',
      desc: language === 'en' ? 'Access your NABL verified pathology, biochemistry, and radiology reports using UHID or Mobile OTP.' : 'यूएचआईडी या मोबाइल ओटीपी द्वारा अपनी पैथोलॉजी और रेडियोलॉजी रिपोर्ट प्राप्त करें।',
      icon: FlaskConical,
      color: 'from-blue-600 to-cyan-700',
      badge: language === 'en' ? 'OFFICIAL PDF' : 'आधिकारिक पीडीएफ',
      action: onOpenLabReports,
      image: '/images/lab_report.gif'
    },
    {
      id: 'blood',
      title: language === 'en' ? 'Blood Availability' : 'रक्त उपलब्धता खोजें',
      sub: language === 'en' ? 'Real-Time Blood Bank Stocks' : 'वास्तविक समय रक्त बैंक भंडार',
      desc: language === 'en' ? 'Check live stock of Whole Blood, Packed RBC, Platelets and Plasma across State & Central Blood Banks.' : 'राज्य और केंद्रीय रक्त बैंकों में उपलब्ध रक्त इकाइयों की लाइव स्थिति जांचें।',
      icon: Droplet,
      color: 'from-rose-600 to-red-700',
      badge: language === 'en' ? 'EMERGENCY 24/7' : 'आपातकालीन 24/7',
      action: onOpenBloodAvailability,
      image: '/images/blood_drop.gif'
    },
    {
      id: 'payment',
      title: language === 'en' ? 'Payment Portal' : 'अस्पताल शुल्क भुगतान',
      sub: language === 'en' ? 'Instant UPI QR & Gateway' : 'त्वरित यूपीआई क्यूआर और गेटवे',
      desc: language === 'en' ? 'Pay diagnostic fees, OPD charges, and IPD advance using Google Pay, PhonePe, Paytm, or Cards.' : 'गूगल पे, फोनपे, पेटीएम या कार्ड द्वारा ओपीडी व जांच शुल्क का ऑनलाइन भुगतान करें।',
      icon: CreditCard,
      color: 'from-purple-600 to-indigo-700',
      badge: language === 'en' ? 'UPI / RAZORPAY' : 'यूपीआई / रेजरपे',
      action: onOpenPaymentPortal,
      image: '/images/mobile_payment.gif'
    },
    {
      id: 'abha',
      title: language === 'en' ? 'Create / Link ABHA ID' : 'आभा स्वास्थ्य खाता बनाएं',
      sub: language === 'en' ? 'Ayushman Bharat 14-Digit Card' : '14-अंकीय डिजिटल हेल्थ कार्ड',
      desc: language === 'en' ? 'Enroll in Ayushman Bharat Digital Mission (ABDM) to link and carry all your health records digitally.' : 'आयुष्मान भारत डिजिटल मिशन में नामांकन कर अपने सभी स्वास्थ्य रिकॉर्ड डिजिटल रूप से सुरक्षित रखें।',
      icon: ShieldCheck,
      color: 'from-amber-600 to-orange-700',
      badge: language === 'en' ? 'ABDM NATIONAL' : 'राष्ट्रीय मिशन',
      action: onOpenABHA,
      image: '/images/ORS1.png'
    },
    {
      id: 'tele',
      title: language === 'en' ? 'Tele-Consultation' : 'ई-संजीवनी टेलीपरामर्श',
      sub: language === 'en' ? 'Doctor Video OPD from Home' : 'घर बैठे डॉक्टर से वीडियो परामर्श',
      desc: language === 'en' ? 'Connect with specialist doctors online via National Teleconsultation Service (e-Sanjeevani).' : 'राष्ट्रीय टेलीपरामर्श सेवा के माध्यम से विशेषज्ञ डॉक्टरों से ऑनलाइन वीडियो परामर्श लें।',
      icon: Video,
      color: 'from-teal-600 to-emerald-700',
      badge: language === 'en' ? 'VIDEO CONSULT' : 'वीडियो परामर्श',
      action: onOpenTeleconsult,
      image: '/images/SMS_NEW.png'
    }
  ];

  return (
    <section className="space-y-6">
      
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 border-2 border-emerald-500/30 text-white p-6 sm:p-10 shadow-2xl">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
            <Sparkles className="w-4 h-4" />
            <span>{language === 'en' ? 'OFFICIAL NATIONAL CITIZEN HEALTH PORTAL' : 'आधिकारिक राष्ट्रीय नागरिक स्वास्थ्य पोर्टल'}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            {language === 'en' ? (
              <>
                Hassle-Free <span className="text-emerald-400">Hospital Appointments</span> & Health Records
              </>
            ) : (
              <>
                सुगम एवं त्वरित <span className="text-emerald-400">अस्पताल अपॉइंटमेंट</span> और स्वास्थ्य सेवाएं
              </>
            )}
          </h2>

          <p className="text-xs sm:text-base text-slate-300 leading-relaxed">
            {language === 'en'
              ? 'An initiative of the Ministry of Health & Family Welfare (MoHFW) to provide online OPD registration, diagnostic lab report downloads, blood bank stock lookup, and digital payments across all AIIMS and government hospitals.'
              : 'स्वास्थ्य एवं परिवार कल्याण मंत्रालय की एक पहल जिसके द्वारा आप भारत के सभी एम्स और प्रमुख सरकारी अस्पतालों में ओपीडी पंजीकरण, लैब रिपोर्ट डाउनलोड, और रक्त उपलब्धता की जानकारी प्राप्त कर सकते हैं।'}
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
              onClick={onOpenABHA}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{language === 'en' ? 'Generate ABHA Card' : 'आभा कार्ड बनाएं'}</span>
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
              {/* Top Row with Badge & Icon */}
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

              {/* Bottom Action Strip */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-black text-slate-700 dark:text-slate-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 flex items-center gap-1.5 transition-colors">
                  <span>{language === 'en' ? 'Open Service' : 'सेवा खोलें'}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>

                {s.image && (
                  <img
                    src={s.image}
                    alt={s.title}
                    className="h-8 w-auto object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};
