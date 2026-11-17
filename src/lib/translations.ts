export type LanguageCode = 'en' | 'hi' | 'bn' | 'ta' | 'te' | 'mr' | 'gu' | 'kn' | 'ml' | 'pa';

export interface TranslationSchema {
  common: {
    continue: string;
    back: string;
    save: string;
    loading: string;
    error: string;
    success: string;
  };
  onboarding: {
    title1: string;
    desc1: string;
    title2: string;
    desc2: string;
    getStarted: string;
    next: string;
    skip: string;
  };
  home: {
    greeting: string;
    tagline: string;
    heroTitle: string;
    heroSubtitle: string;
    analyzeNow: string;
    trustedBy: string;
    trustMessage: string;
    features: string;
    wallet: string;
    scans: string;
    status: string;
  };
  ritucharya: {
    title: string;
    description: string;
    activeSeason: string;
    diet: string;
    lifestyle: string;
    herbs: string;
    viewFullGuide: string;
    aiSuggestion: string;
  };
  languagePopup: {
    title: string;
    subtitle: string;
  };
  profile: {
    title: string;
    personalInfo: string;
    ayurvedicProfile: string;
    lifestyle: string;
    notifications: string;
    settings: string;
    logout: string;
    appLanguage: string;
    save: string;
  };
}

export const LANGUAGES: { code: LanguageCode; name: string; nativeName: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
];

export const translations: Record<LanguageCode, TranslationSchema> = {
  en: {
    common: {
      continue: "Continue",
      back: "Back",
      save: "Save",
      loading: "Loading...",
      error: "Error",
      success: "Success"
    },
    onboarding: {
      title1: "Ancient Wisdom, AI Precision",
      desc1: "Experience the power of 5,000 years of Ayurvedic wisdom combined with cutting-edge AI for personalized wellness.",
      title2: "Trusted & Secure",
      desc2: "Your data is safe with us. We only deduct from your wallet after you see your personalized results. Trust is our foundation.",
      getStarted: "Get Started",
      next: "Next",
      skip: "Skip Intro"
    },
    home: {
      greeting: "Hi",
      tagline: "Your daily path to wellness",
      heroTitle: "Get Your Ayurvedic Plan in Seconds",
      heroSubtitle: "Identify your Dosha and start your transformation today.",
      analyzeNow: "Analyze Now",
      trustedBy: "Trusted by 10k+",
      trustMessage: "YOU WILL BE CHARGED AFTER RESULT ONLY.",
      features: "Intelligent Features",
      wallet: "Wallet",
      scans: "Scans",
      status: "Status"
    },
    ritucharya: {
      title: "Ritucharya",
      description: "Season-based AI Recommendation",
      activeSeason: "Active Season",
      diet: "Diet",
      lifestyle: "Lifestyle",
      herbs: "Herbs",
      viewFullGuide: "View Full Guide",
      aiSuggestion: "Personalized AI Suggestion"
    },
    languagePopup: {
      title: "Select Your Language",
      subtitle: "Choose your preferred language"
    },
    profile: {
      title: "Profile",
      personalInfo: "Personal Information",
      ayurvedicProfile: "Ayurvedic Profile",
      lifestyle: "Lifestyle & Activity",
      notifications: "Smart Notifications",
      settings: "Settings",
      logout: "Log Out",
      appLanguage: "App Language",
      save: "Save"
    }
  },
  hi: {
    common: {
      continue: "जारी रखें",
      back: "पीछे",
      save: "सहेजें",
      loading: "लोड हो रहा है...",
      error: "त्रुटि",
      success: "सफलता"
    },
    onboarding: {
      title1: "प्राचीन ज्ञान, AI सटीकता",
      desc1: "व्यक्तिगत कल्याण के लिए अत्याधुनिक AI के साथ संयुक्त 5,000 वर्षों के आयुर्वेदिक ज्ञान की शक्ति का अनुभव करें।",
      title2: "विश्वसनीय और सुरक्षित",
      desc2: "आपका डेटा हमारे पास सुरक्षित है। आपके व्यक्तिगत परिणाम देखने के बाद ही हम आपके वॉलेट से कटौती करते हैं। विश्वास हमारी नींव है।",
      getStarted: "शुरू करें",
      next: "अगला",
      skip: "छोड़ें"
    },
    home: {
      greeting: "नमस्ते",
      tagline: "कल्याण के लिए आपका दैनिक पथ",
      heroTitle: "अपनी कल्याण यात्रा शुरू करें",
      heroSubtitle: "अपने दोष की खोज करें और सेकंडों में व्यक्तिगत आयुर्वेदिक मार्गदर्शन प्राप्त करें।",
      analyzeNow: "अभी विश्लेषण करें",
      trustedBy: "10k+ द्वारा विश्वसनीय",
      trustMessage: "परिणाम के बाद ही राशि काटी जाएगी • 100% सुरक्षित",
      features: "बुद्धिमान विशेषताएं",
      wallet: "वॉलेट",
      scans: "स्कैन",
      status: "स्थिति"
    },
    ritucharya: {
      title: "ऋतुचर्या",
      description: "सीजन-आधारित AI सिफारिश",
      activeSeason: "सक्रिय मौसम",
      diet: "आहार",
      lifestyle: "जीवनशैली",
      herbs: "जड़ी-बूटियाँ",
      viewFullGuide: "पूरा गाइड देखें",
      aiSuggestion: "व्यक्तिगत AI सुझाव"
    },
    languagePopup: {
      title: "अपनी भाषा चुनें",
      subtitle: "अपनी पसंदीदा भाषा चुनें"
    },
    profile: {
      title: "प्रोफ़ाइल",
      personalInfo: "व्यक्तिगत जानकारी",
      ayurvedicProfile: "आयुर्वेदिक प्रोफ़ाइल",
      lifestyle: "जीवनशैली और गतिविधि",
      notifications: "स्मार्ट सूचनाएं",
      settings: "सेटिंग्स",
      logout: "लॉग आउट",
      appLanguage: "ऐप की भाषा",
      save: "सहेजें"
    }
  },
  bn: {
    common: {
      continue: "চালিয়ে যান",
      back: "পিছনে",
      save: "সংরক্ষণ করুন",
      loading: "লোড হচ্ছে...",
      error: "ত্রুটি",
      success: "সাফল্য"
    },
    onboarding: {
      title1: "প্রাচীন জ্ঞান, AI নির্ভুলতা",
      desc1: "ব্যক্তিগতকৃত সুস্থতার জন্য অত্যাধুনিক AI-এর সাথে ৫,০০০ বছরের আয়ুর্বেদিক জ্ঞানের শক্তির অভিজ্ঞতা নিন।",
      title2: "বিশ্বস্ত ও নিরাপদ",
      desc2: "আপনার ডেটা আমাদের কাছে নিরাপদ। আপনি আপনার ব্যক্তিগতকৃত ফলাফল দেখার পরেই আমরা আপনার ওয়ালেট থেকে টাকা কাটি। বিশ্বাস আমাদের ভিত্তি।",
      getStarted: "শুরু করুন",
      next: "পরবর্তী",
      skip: "এড়িয়ে যান"
    },
    home: {
      greeting: "নমস্কার",
      tagline: "সুস্থতার জন্য আপনার দৈনন্দিন পথ",
      heroTitle: "আপনার সুস্থতার যাত্রা শুরু করুন",
      heroSubtitle: "আপনার দোষ আবিষ্কার করুন এবং সেকেন্ডের মধ্যে ব্যক্তিগতকৃত আয়ুর্বেদিক নির্দেশিকা পান।",
      analyzeNow: "এখনই বিশ্লেষণ করুন",
      trustedBy: "১০ হাজার+ দ্বারা বিশ্বস্ত",
      trustMessage: "ফলাফলের পরেই টাকা কাটা হবে • ১০০% নিরাপদ",
      features: "বুদ্ধিমান বৈশিষ্ট্য",
      wallet: "ওয়ালেট",
      scans: "স্ক্যান",
      status: "অবস্থা"
    },
    ritucharya: {
      title: "Ritucharya",
      description: "Season-based AI Recommendation",
      activeSeason: "Active Season",
      diet: "Diet",
      lifestyle: "Lifestyle",
      herbs: "Herbs",
      viewFullGuide: "View Full Guide",
      aiSuggestion: "Personalized AI Suggestion"
    },
    languagePopup: {
      title: "আপনার ভাষা নির্বাচন করুন",
      subtitle: "আপনার পছন্দের ভাষা চয়ন করুন"
    },
    profile: {
      title: "প্রোফাইল",
      personalInfo: "ব্যক্তিগত তথ্য",
      ayurvedicProfile: "আয়ুর্বেদিক প্রোফাইল",
      lifestyle: "জীবনধারা এবং কার্যকলাপ",
      notifications: "স্মার্ট বিজ্ঞপ্তি",
      settings: "সেটিংস",
      logout: "লগ আউট",
      appLanguage: "অ্যাপের ভাষা",
      save: "সংরক্ষণ করুন"
    }
  },
  ta: {
    common: {
      continue: "தொடரவும்",
      back: "பின்னால்",
      save: "சேமி",
      loading: "ஏற்றப்படுகிறது...",
      error: "பிழை",
      success: "வெற்றி"
    },
    onboarding: {
      title1: "பண்டைய ஞானம், AI துல்லியம்",
      desc1: "தனிப்பயனாக்கப்பட்ட ஆரோக்கியத்திற்காக அதிநவீன AI உடன் இணைந்த 5,000 ஆண்டுகால ஆயுர்வேத ஞானத்தின் சக்தியை அனுபவியுங்கள்.",
      title2: "நம்பகமான மற்றும் பாதுகாப்பானது",
      desc2: "உங்கள் தரவு எங்களிடம் பாதுகாப்பாக உள்ளது. உங்கள் தனிப்பயனாக்கப்பட்ட முடிவுகளைப் பார்த்த பின்னரே உங்கள் வாலட்டில் இருந்து கழிக்கிறோம். நம்பிக்கையே எங்கள் அடித்தளம்.",
      getStarted: "தொடங்குங்கள்",
      next: "அடுத்து",
      skip: "தவிர்"
    },
    home: {
      greeting: "வணக்கம்",
      tagline: "ஆரோக்கியத்திற்கான உங்கள் தினசரி பாதை",
      heroTitle: "உங்கள் ஆரோக்கிய பயணத்தைத் தொடங்குங்கள்",
      heroSubtitle: "உங்கள் தோஷத்தைக் கண்டறிந்து நொடிகளில் தனிப்பயனாக்கப்பட்ட ஆயுர்வேத வழிகாட்டலைப் பெறுங்கள்.",
      analyzeNow: "இப்போது பகுப்பாய்வு செய்யுங்கள்",
      trustedBy: "10k+ பேரால் நம்பப்படுகிறது",
      trustMessage: "முடிவுக்குப் பிறகு மட்டுமே தொகை கழிக்கப்படும் • 100% பாதுகாப்பானது",
      features: "புத்திசாலித்தனமான அம்சங்கள்",
      wallet: "வாலட்",
      scans: "ஸ்கேன்கள்",
      status: "நிலை"
    },
    ritucharya: {
      title: "Ritucharya",
      description: "Season-based AI Recommendation",
      activeSeason: "Active Season",
      diet: "Diet",
      lifestyle: "Lifestyle",
      herbs: "Herbs",
      viewFullGuide: "View Full Guide",
      aiSuggestion: "Personalized AI Suggestion"
    },
    languagePopup: {
      title: "உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்",
      subtitle: "உங்களுக்கு விருப்பமான மொழியைத் தேர்ந்தெடுக்கவும்"
    },
    profile: {
      title: "சுயவிவரம்",
      personalInfo: "தனிப்பட்ட தகவல்",
      ayurvedicProfile: "ஆயுர்வேத சுயவிவரம்",
      lifestyle: "வாழ்க்கை முறை மற்றும் செயல்பாடு",
      notifications: "ஸ்மார்ட் அறிவிப்புகள்",
      settings: "அமைப்புகள்",
      logout: "வெளியேறு",
      appLanguage: "பயன்பாட்டு மொழி",
      save: "சேமி"
    }
  },
  te: {
    common: {
      continue: "కొనసాగించు",
      back: "వెనుకకు",
      save: "సేవ్ చేయి",
      loading: "లోడ్ అవుతోంది...",
      error: "లోపం",
      success: "విజయం"
    },
    onboarding: {
      title1: "ప్రాచీన జ్ఞానం, AI ఖచ్చితత్వం",
      desc1: "వ్యక్తిగతీకరించిన ఆరోగ్యం కోసం అత్యాధునిక AIతో కలిపి 5,000 సంవత్సరాల ఆయుర్వేద జ్ఞానం యొక్క శక్తిని అనుభవించండి.",
      title2: "నమ్మదగినది & సురక్షితమైనది",
      desc2: "మీ డేటా మా వద్ద సురక్షితంగా ఉంటుంది. మీరు మీ వ్యక్తిగతీకరించిన ఫలితాలను చూసిన తర్వాత మాత్రమే మేము మీ వాలెట్ నుండి తీసివేస్తాము. నమ్మకమే మా పునాది.",
      getStarted: "ప్రారంభించండి",
      next: "తదుపరి",
      skip: "వదిలివేయి"
    },
    home: {
      greeting: "నమస్తే",
      tagline: "ఆరోగ్యం కోసం మీ రోజువారీ మార్గం",
      heroTitle: "మీ ఆరోగ్య ప్రయాణాన్ని ప్రారంభించండి",
      heroSubtitle: "మీ దోషాన్ని కనుగొనండి మరియు సెకన్లలో వ్యక్తిగతీకరించిన ఆయుర్వేద మార్గదర్శకత్వాన్ని పొందండి.",
      analyzeNow: "ఇప్పుడే విశ్లేషించండి",
      trustedBy: "10వేల+ మంది నమ్మకం",
      trustMessage: "ఫలితం తర్వాత మాత్రమే మొత్తం తీసివేయబడుతుంది • 100% సురక్షితం",
      features: "తెలివైన ఫీచర్లు",
      wallet: "వాలెట్",
      scans: "స్కాన్లు",
      status: "స్థితి"
    },
    ritucharya: {
      title: "Ritucharya",
      description: "Season-based AI Recommendation",
      activeSeason: "Active Season",
      diet: "Diet",
      lifestyle: "Lifestyle",
      herbs: "Herbs",
      viewFullGuide: "View Full Guide",
      aiSuggestion: "Personalized AI Suggestion"
    },
    languagePopup: {
      title: "మీ భాషను ఎంచుకోండి",
      subtitle: "మీకు నచ్చిన భాషను ఎంచుకోండి"
    },
    profile: {
      title: "ప్రొఫైల్",
      personalInfo: "వ్యక్తిగత సమాచారం",
      ayurvedicProfile: "ఆయుర్వేద ప్రొఫైల్",
      lifestyle: "జీవనశైలి & కార్యాచరణ",
      notifications: "స్మార్ట్ నోటిఫికేషన్లు",
      settings: "సెట్టింగులు",
      logout: "లాగ్ అవుట్",
      appLanguage: "యాప్ భాష",
      save: "సేవ్ చేయి"
    }
  },
  mr: {
    common: {
      continue: "सुरू ठेवा",
      back: "मागे",
      save: "जतन करा",
      loading: "लोड होत आहे...",
      error: "त्रुटी",
      success: "यश"
    },
    onboarding: {
      title1: "प्राचीन ज्ञान, AI अचूकता",
      desc1: "वैयक्तिक आरोग्यासाठी अत्याधुनिक AI सह एकत्रित ५,००० वर्षांच्या आयुर्वेदिक ज्ञानाच्या शक्तीचा अनुभव घ्या.",
      title2: "विश्वसनीय आणि सुरक्षित",
      desc2: "तुमचा डेटा आमच्याकडे सुरक्षित आहे. तुम्ही तुमचे वैयक्तिकृत निकाल पाहिल्यानंतरच आम्ही तुमच्या वॉलेटमधून कपात करतो. विश्वास हा आमचा पाया आहे.",
      getStarted: "सुरू करा",
      next: "पुढील",
      skip: "वगळा"
    },
    home: {
      greeting: "नमस्कार",
      tagline: "आरोग्यासाठी आपला दैनंदिन मार्ग",
      heroTitle: "तुमचा आरोग्य प्रवास सुरू करा",
      heroSubtitle: "तुमचा दोष शोधा आणि सेकंदात वैयक्तिकृत आयुर्वेदिक मार्गदर्शन मिळवा.",
      analyzeNow: "आता विश्लेषण करा",
      trustedBy: "१० हजार+ लोकांचा विश्वास",
      trustMessage: "निकालानंतरच रक्कम कापली जाईल • १००% सुरक्षित",
      features: "बुद्धिमान वैशिष्ट्ये",
      wallet: "वॉलेट",
      scans: "स्कॅन",
      status: "स्थिती"
    },
    ritucharya: {
      title: "Ritucharya",
      description: "Season-based AI Recommendation",
      activeSeason: "Active Season",
      diet: "Diet",
      lifestyle: "Lifestyle",
      herbs: "Herbs",
      viewFullGuide: "View Full Guide",
      aiSuggestion: "Personalized AI Suggestion"
    },
    languagePopup: {
      title: "तुमची भाषा निवडा",
      subtitle: "तुमची पसंतीची भाषा निवडा"
    },
    profile: {
      title: "प्रोफाइल",
      personalInfo: "वैयक्तिक माहिती",
      ayurvedicProfile: "आयुर्वेदिक प्रोफाइल",
      lifestyle: "जीवनशैली आणि क्रियाकलाप",
      notifications: "स्मार्ट सूचना",
      settings: "सेटिंग्ज",
      logout: "लॉग आउट",
      appLanguage: "अॅपची भाषा",
      save: "जतन करा"
    }
  },
  gu: {
    common: {
      continue: "ચાલુ રાખો",
      back: "પાછળ",
      save: "સાચવો",
      loading: "લોડ થઈ રહ્યું છે...",
      error: "ભૂલ",
      success: "સફળતા"
    },
    onboarding: {
      title1: "પ્રાચીન જ્ઞાન, AI ચોકસાઈ",
      desc1: "વ્યક્તિગત સુખાકારી માટે અત્યાધુનિક AI સાથે જોડાયેલ 5,000 વર્ષના આયુર્વેદિક જ્ઞાનની શક્તિનો અનુભવ કરો.",
      title2: "વિશ્વસનીય અને સુરક્ષિત",
      desc2: "તમારો ડેટા અમારી પાસે સુરક્ષિત છે. તમે તમારા વ્યક્તિગત પરિણામો જોયા પછી જ અમે તમારા વોલેટમાંથી કપાત કરીએ છીએ. વિશ્વાસ અમારો પાયો છે.",
      getStarted: "શરૂ કરો",
      next: "આગળ",
      skip: "છોડી દો"
    },
    home: {
      greeting: "નમસ્તે",
      tagline: "સુખાકારી માટે તમારો દૈનિક માર્ગ",
      heroTitle: "તમારી સુખાકારીની મુસાફરી શરૂ કરો",
      heroSubtitle: "તમારા દોષને શોધો અને સેકન્ડોમાં વ્યક્તિગત આયુર્વેદિક માર્ગદર્શન મેળવો.",
      analyzeNow: "હમણાં વિશ્લેષણ કરો",
      trustedBy: "10k+ દ્વારા વિશ્વસનીય",
      trustMessage: "પરિણામ પછી જ રકમ કાપવામાં આવશે • 100% સુરક્ષિત",
      features: "બુદ્ધિશાળી સુવિધાઓ",
      wallet: "વોલેટ",
      scans: "સ્કેન",
      status: "સ્થિતિ"
    },
    ritucharya: {
      title: "Ritucharya",
      description: "Season-based AI Recommendation",
      activeSeason: "Active Season",
      diet: "Diet",
      lifestyle: "Lifestyle",
      herbs: "Herbs",
      viewFullGuide: "View Full Guide",
      aiSuggestion: "Personalized AI Suggestion"
    },
    languagePopup: {
      title: "તમારી ભાષા પસંદ કરો",
      subtitle: "તમારી પસંદગીની ભાષા પસંદ કરો"
    },
    profile: {
      title: "પ્રોફાઇલ",
      personalInfo: "વ્યક્તિગત માહિતી",
      ayurvedicProfile: "આયુર્વેદિક પ્રોફાઇલ",
      lifestyle: "જીવનશૈલી અને પ્રવૃત્તિ",
      notifications: "સ્માર્ટ સૂચનાઓ",
      settings: "સેટિંગ્સ",
      logout: "લોગ આઉટ",
      appLanguage: "એપ્લિકેશન ભાષા",
      save: "સાચવો"
    }
  },
  kn: {
    common: {
      continue: "ಮುಂದುವರಿಸಿ",
      back: "ಹಿಂದಕ್ಕೆ",
      save: "ಉಳಿಸಿ",
      loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
      error: "ದೋಷ",
      success: "ಯಶಸ್ಸು"
    },
    onboarding: {
      title1: "ಪ್ರಾಚೀನ ಜ್ಞಾನ, AI ನಿಖರತೆ",
      desc1: "ವೈಯಕ್ತಿಕಗೊಳಿಸಿದ ಕ್ಷೇಮಕ್ಕಾಗಿ ಅತ್ಯಾಧುನಿಕ AI ನೊಂದಿಗೆ ಸಂಯೋಜಿಸಲ್ಪಟ್ಟ 5,000 ವರ್ಷಗಳ ಆಯುರ್ವೇದ ಜ್ಞಾನದ ಶಕ್ತಿಯನ್ನು ಅನುಭವಿಸಿ.",
      title2: "ವಿಶ್ವಾಸಾರ್ಹ ಮತ್ತು ಸುರಕ್ಷಿತ",
      desc2: "ನಿಮ್ಮ ಡೇಟಾ ನಮ್ಮ ಬಳಿ ಸುರಕ್ಷಿತವಾಗಿದೆ. ನಿಮ್ಮ ವೈಯಕ್ತಿಕಗೊಳಿಸಿದ ಫಲಿತಾಂಶಗಳನ್ನು ನೋಡಿದ ನಂತರವೇ ನಾವು ನಿಮ್ಮ ವ್ಯಾಲೆಟ್‌ನಿಂದ ಹಣ ಕಡಿತಗೊಳಿಸುತ್ತೇವೆ. ವಿಶ್ವಾಸವೇ ನಮ್ಮ ಅಡಿಪಾಯ.",
      getStarted: "ಪ್ರಾರಂಭಿಸಿ",
      next: "ಮುಂದೆ",
      skip: "ಬಿಟ್ಟುಬಿಡಿ"
    },
    home: {
      greeting: "ನಮಸ್ಕಾರ",
      tagline: "ಕ್ಷೇಮಕ್ಕಾಗಿ ನಿಮ್ಮ ದೈನಂದಿನ ಹಾದಿ",
      heroTitle: "ನಿಮ್ಮ ಕ್ಷೇಮ ಪ್ರಯಾಣವನ್ನು ಪ್ರಾರಂಭಿಸಿ",
      heroSubtitle: "ನಿಮ್ಮ ದೋಷವನ್ನು ಅನ್ವೇಷಿಸಿ ಮತ್ತು ಸೆಕೆಂಡುಗಳಲ್ಲಿ ವೈಯಕ್ತಿಕಗೊಳಿಸಿದ ಆಯುರ್ವೇದ ಮಾರ್ಗದರ್ಶನ ಪಡೆಯಿರಿ.",
      analyzeNow: "ಈಗ ವಿಶ್ಲೇಷಿಸಿ",
      trustedBy: "10k+ ಜನರಿಂದ ವಿಶ್ವಾಸಾರ್ಹ",
      trustMessage: "ಫಲಿತಾಂಶದ ನಂತರ ಮಾತ್ರ ಹಣ ಕಡಿತಗೊಳಿಸಲಾಗುತ್ತದೆ • 100% ಸುರಕ್ಷಿತ",
      features: "ಬುದ್ಧಿವಂತ ವೈಶಿಷ್ಟ್ಯಗಳು",
      wallet: "ವ್ಯಾಲೆಟ್",
      scans: "ಸ್ಕ್ಯಾನ್‌ಗಳು",
      status: "ಸ್ಥಿತಿ"
    },
    ritucharya: {
      title: "Ritucharya",
      description: "Season-based AI Recommendation",
      activeSeason: "Active Season",
      diet: "Diet",
      lifestyle: "Lifestyle",
      herbs: "Herbs",
      viewFullGuide: "View Full Guide",
      aiSuggestion: "Personalized AI Suggestion"
    },
    languagePopup: {
      title: "ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆರಿಸಿ",
      subtitle: "ನಿಮ್ಮ ಆದ್ಯತೆಯ ಭಾಷೆಯನ್ನು ಆರಿಸಿ"
    },
    profile: {
      title: "ಪ್ರೊಫೈಲ್",
      personalInfo: "ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ",
      ayurvedicProfile: "ಆಯುರ್ವೇದ ಪ್ರೊಫೈಲ್",
      lifestyle: "ಜೀವನಶೈಲಿ ಮತ್ತು ಚಟುವಟಿಕೆ",
      notifications: "ಸ್ಮಾರ್ಟ್ ಅಧಿಸೂಚನೆಗಳು",
      settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
      logout: "ಲಾಗ್ ಔಟ್",
      appLanguage: "ಅಪ್ಲಿಕೇಶನ್ ಭಾಷೆ",
      save: "ಉಳಿಸಿ"
    }
  },
  ml: {
    common: {
      continue: "തുടരുക",
      back: "പിന്നിലേക്ക്",
      save: "സംരക്ഷിക്കുക",
      loading: "ലോഡ് ചെയ്യുന്നു...",
      error: "പിശക്",
      success: "വിജയം"
    },
    onboarding: {
      title1: "പുരാതന ജ്ഞാനം, AI കൃത്യത",
      desc1: "വ്യക്തിഗതമാക്കിയ ആരോഗ്യത്തിനായി അത്യാധുനിക AI-യുമായി സംയോജിപ്പിച്ച 5,000 വർഷത്തെ ആയുർവേദ ജ്ഞാനത്തിന്റെ ശക്തി അനുഭവിക്കുക.",
      title2: "വിശ്വസനീയവും സുരക്ഷിതവും",
      desc2: "നിങ്ങളുടെ ഡാറ്റ ഞങ്ങളുടെ പക്കൽ സുരക്ഷിതമാണ്. നിങ്ങളുടെ വ്യക്തിഗതമാക്കിയ ഫലങ്ങൾ കണ്ടതിനുശേഷം മാത്രമേ ഞങ്ങൾ നിങ്ങളുടെ വാലറ്റിൽ നിന്ന് പണം ഈടാക്കൂ. വിശ്വാസമാണ് ഞങ്ങളുടെ അടിത്തറ.",
      getStarted: "ആരംഭിക്കുക",
      next: "അടുത്തത്",
      skip: "ഒഴിവാക്കുക"
    },
    home: {
      greeting: "നമസ്കാരം",
      tagline: "ആരോഗ്യത്തിലേക്കുള്ള നിങ്ങളുടെ ദൈനംദിന പാത",
      heroTitle: "നിങ്ങളുടെ ആരോഗ്യ യാത്ര ആരംഭിക്കുക",
      heroSubtitle: "നിങ്ങളുടെ ദോഷം കണ്ടെത്തുകയും നിമിഷങ്ങൾക്കുള്ളിൽ വ്യക്തിഗതമാക്കിയ ആയുർവേദ മാർഗ്ഗനിർദ്ദേശം നേടുകയും ചെയ്യുക.",
      analyzeNow: "ഇപ്പോൾ വിശകലനം ചെയ്യുക",
      trustedBy: "10k+ ആളുകൾ വിശ്വസിക്കുന്നു",
      trustMessage: "ഫലത്തിന് ശേഷം മാത്രമേ തുക ഈടാക്കൂ • 100% സുരക്ഷിതം",
      features: "ബുദ്ധിപരമായ സവിശേഷതകൾ",
      wallet: "വാലറ്റ്",
      scans: "സ്കാനുകൾ",
      status: "നില"
    },
    ritucharya: {
      title: "Ritucharya",
      description: "Season-based AI Recommendation",
      activeSeason: "Active Season",
      diet: "Diet",
      lifestyle: "Lifestyle",
      herbs: "Herbs",
      viewFullGuide: "View Full Guide",
      aiSuggestion: "Personalized AI Suggestion"
    },
    languagePopup: {
      title: "നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക",
      subtitle: "നിങ്ങൾ ഇഷ്ടപ്പെടുന്ന ഭാഷ തിരഞ്ഞെടുക്കുക"
    },
    profile: {
      title: "പ്രൊഫൈൽ",
      personalInfo: "വ്യക്തിഗത വിവരങ്ങൾ",
      ayurvedicProfile: "ആയുർവേദ പ്രൊഫൈൽ",
      lifestyle: "ജീവിതശൈലിയും പ്രവർത്തനവും",
      notifications: "സ്മാർട്ട് അറിയിപ്പുകൾ",
      settings: "ക്രമീകരണങ്ങൾ",
      logout: "ലോഗ് ഔട്ട്",
      appLanguage: "ആപ്പ് ഭാഷ",
      save: "സംരക്ഷിക്കുക"
    }
  },
  pa: {
    common: {
      continue: "ਜਾਰੀ ਰੱਖੋ",
      back: "ਪਿੱਛੇ",
      save: "ਸੇਵ ਕਰੋ",
      loading: "ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...",
      error: "ਗਲਤੀ",
      success: "ਸਫਲਤਾ"
    },
    onboarding: {
      title1: "ਪ੍ਰਾਚੀਨ ਗਿਆਨ, AI ਸ਼ੁੱਧਤਾ",
      desc1: "ਵਿਅਕਤੀਗਤ ਤੰਦਰੁਸਤੀ ਲਈ ਅਤਿ-ਆਧੁਨਿਕ AI ਦੇ ਨਾਲ ਮਿਲ ਕੇ 5,000 ਸਾਲਾਂ ਦੇ ਆਯੁਰਵੈਦਿਕ ਗਿਆਨ ਦੀ ਸ਼ਕਤੀ ਦਾ ਅਨੁਭਵ ਕਰੋ।",
      title2: "ਭਰੋਸੇਮੰਦ ਅਤੇ ਸੁਰੱਖਿਅਤ",
      desc2: "ਤੁਹਾਡਾ ਡੇਟਾ ਸਾਡੇ ਕੋਲ ਸੁਰੱਖਿਅਤ ਹੈ। ਤੁਹਾਡੇ ਵਿਅਕਤੀਗਤ ਨਤੀਜੇ ਦੇਖਣ ਤੋਂ ਬਾਅਦ ਹੀ ਅਸੀਂ ਤੁਹਾਡੇ ਵਾਲਿਟ ਵਿੱਚੋਂ ਕਟੌਤੀ ਕਰਦੇ ਹਾਂ। ਵਿਸ਼ਵਾਸ ਸਾਡੀ ਨੀਂਹ ਹੈ।",
      getStarted: "ਸ਼ੁਰੂ ਕਰੋ",
      next: "ਅਗਲਾ",
      skip: "ਛੱਡੋ"
    },
    home: {
      greeting: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ",
      tagline: "ਤੰਦਰੁਸਤੀ ਲਈ ਤੁਹਾਡਾ ਰੋਜ਼ਾਨਾ ਮਾਰਗ",
      heroTitle: "ਆਪਣੀ ਤੰਦਰੁਸਤੀ ਯਾਤਰਾ ਸ਼ੁਰੂ ਕਰੋ",
      heroSubtitle: "ਆਪਣੇ ਦੋਸ਼ ਦੀ ਖੋਜ ਕਰੋ ਅਤੇ ਸਕਿੰਟਾਂ ਵਿੱਚ ਵਿਅਕਤੀਗਤ ਆਯੁਰਵੈਦਿਕ ਮਾਰਗਦਰਸ਼ਨ ਪ੍ਰਾਪਤ ਕਰੋ।",
      analyzeNow: "ਹੁਣੇ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ",
      trustedBy: "10k+ ਦੁਆਰਾ ਭਰੋਸੇਮੰਦ",
      trustMessage: "ਨਤੀਜੇ ਤੋਂ ਬਾਅਦ ਹੀ ਰਕਮ ਕੱਟੀ ਜਾਵੇਗੀ • 100% ਸੁਰੱਖਿਅਤ",
      features: "ਬੁੱਧੀਮਾਨ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ",
      wallet: "ਵਾਲਿਟ",
      scans: "ਸਕੈਨ",
      status: "ਸਥਿਤੀ"
    },
    ritucharya: {
      title: "Ritucharya",
      description: "Season-based AI Recommendation",
      activeSeason: "Active Season",
      diet: "Diet",
      lifestyle: "Lifestyle",
      herbs: "Herbs",
      viewFullGuide: "View Full Guide",
      aiSuggestion: "Personalized AI Suggestion"
    },
    languagePopup: {
      title: "ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ",
      subtitle: "ਆਪਣੀ ਪਸੰਦੀਦਾ ਭਾਸ਼ਾ ਚੁਣੋ"
    },
    profile: {
      title: "ਪ੍ਰੋਫਾਈਲ",
      personalInfo: "ਨਿੱਜੀ ਜਾਣਕਾਰੀ",
      ayurvedicProfile: "ਆਯੁਰਵੈਦਿਕ ਪ੍ਰੋਫਾਈਲ",
      lifestyle: "ਜੀਵਨ ਸ਼ੈਲੀ ਅਤੇ ਗਤੀਵਿਧੀ",
      notifications: "ਸਮਾਰਟ ਸੂਚਨਾਵਾਂ",
      settings: "ਸੈਟਿੰਗਾਂ",
      logout: "ਲੌਗ ਆਉਟ",
      appLanguage: "ਐਪ ਭਾਸ਼ਾ",
      save: "ਸੇਵ ਕਰੋ"
    }
  }
};
