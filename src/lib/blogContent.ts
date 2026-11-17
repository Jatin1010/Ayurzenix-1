export interface FAQ {
  q: string;
  a: string;
}

export interface LanguageContent {
  title: string;
  intro: string;
  steps: string[];
  benefits: string[];
  ayurveda: string;
  unique: string;
  tips: string[];
  faqs: FAQ[];
  conclusion: string;
  cta: string;
  backgroundImage?: string;
  image?: string;
}

export interface FeatureBlogContent {
  en: LanguageContent;
  hi: LanguageContent;
}

export const BLOG_CONTENT: Record<string, FeatureBlogContent> = {
  'face-glow': {
    en: {
      title: 'Unlock Your Natural Radiance: The Ayurvedic Face Glow Analyzer',
      intro: 'Tired of dull skin and chemical-based products? Lasting radiance starts from within. The Ayurzenix Face Glow Analyzer combines AI with ancient Ayurveda to identify the root cause of your skin concerns.',
      steps: [
        'Upload a clear selfie or take a new photo.',
        'Select your skin type and primary skin concern.',
        'Answer a few questions about your sleep and stress.',
        'Tap "Get Glow Report" for an instant AI analysis.',
        'Follow your personalized Ayurvedic skincare routine.'
      ],
      benefits: [
        'Discover your unique skin dosha and needs.',
        'Get personalized chemical-free herb recommendations.',
        'Learn how diet and lifestyle affect your skin.',
        'Reduce acne and pigmentation naturally.',
        'Achieve a long-lasting, natural glow.'
      ],
      ayurveda: 'In Ayurveda, skin is a mirror of internal health. Skin issues are often caused by Dosha imbalances: excess Pitta (acne), imbalanced Vata (dryness), or high Kapha (oiliness).',
      unique: 'We go deeper than surface evaluation, using AI to map your facial markers to holistic Ayurvedic principles and lifestyle roots.',
      tips: [
        'Drink warm water to flush out toxins.',
        'Apply fresh Aloe Vera gel for redness.',
        'Get 7-8 hours of sleep for cellular repair.',
        'Limit spicy and fried foods.'
      ],
      faqs: [
        { q: 'How to get glowing skin naturally?', a: 'Balance your doshas through diet, hydration, and Ayurvedic herbs.' },
        { q: 'Is the AI analysis accurate?', a: 'Yes, it analyzes multiple markers for a personalized profile.' }
      ],
      conclusion: 'True beauty is a reflection of your inner health. By balancing your Doshas and following a nature-aligned routine, you can achieve a glow that is both sustainable and radiant. Start your Ayurvedic skin journey today!',
      cta: 'Get Your Glow Now',
      backgroundImage: '/faceglow.png'
    },
    hi: {
      title: 'प्राकृतिक चमक: आयुर्वेदिक फेस ग्लो एनालाइजर',
      intro: 'क्या आप बेजान त्वचा और रसायनों से थक चुके हैं? स्थायी चमक भीतर से शुरू होती है। आयुषेनिक्स फेस ग्लो एनालाइजर आपकी त्वचा की समस्याओं की जड़ तक पहुँचता है।',
      steps: [
        'एक स्पष्ट सेल्फी लें या अपलोड करें।',
        'अपनी त्वचा का प्रकार और समस्या चुनें।',
        'नींद और तनाव के बारे में बताएं।',
        'तुरंत एआई विश्लेषण के लिए रिपोर्ट बटन पर क्लिक करें।',
        'अपनी व्यक्तिगत आयुर्वेदिक रूटीन का पालन करें।'
      ],
      benefits: [
        'त्वचा के दोष और आवश्यकताओं की पहचान करें।',
        'केमिकल-मुक्त आयुर्वेदिक उपचार पाएं।',
        'डाइट का त्वचा पर प्रभाव समझें।',
        'प्राकृतिक रूप से पिंपल्स और दाग कम करें।',
        'स्थायी प्राकृतिक निखार प्राप्त करें।'
      ],
      ayurveda: 'आयुर्वेद के अनुसार त्वचा आंतरिक स्वास्थ्य का झरोखा है। दोष असंतुलन जैसे पित्त (मुँहासे) या वात (रूखापन) ही समस्याओं का मूल कारण हैं।',
      unique: 'हम केवल सतह नहीं देखते, बल्कि एआई के माध्यम से आपकी जीवनशैली के आधार पर गहराई से विश्लेषण करते हैं।',
      tips: [
        'विषैले पदार्थों को निकालने के लिए गुनगुना पानी पिएं।',
        'लौंग और एलोवेरा का उपयोग करें।',
        'पर्याप्त नींद लें।',
        'मसालेदार और जंक फूड से बचें।'
      ],
      faqs: [
        { q: 'प्राकृतिक निखार कैसे पाएं?', a: 'दोषों को संतुलित करके और सही जड़ी-बूटियों का उपयोग करके।' }
      ],
      conclusion: 'प्राकृतिक चमक केवल बाहरी उपचार नहीं, बल्कि आंतरिक स्वास्थ्य का परिणाम है। आयुर्वेद के साथ अपनी त्वचा को पुनर्जीवित करें।',
      cta: 'अभी निखार प्राप्त करें',
      backgroundImage: '/faceglow.png'
    }
  },
  'future-predictor': {
    en: {
      title: 'Your Wellness Roadmap: AI Future Health Predictor',
      intro: 'Predict your health trajectory 20-30 years ahead. Ayurzenix uses machine learning and Ayurvedic science to empower you with proactive insights.',
      steps: [
        'Input habits, current metrics, and family history.',
        'Answer sleep, diet, and lifestyle questions.',
        'AI evaluates thousands of data points.',
        'View your "Future Health Score".',
        'Receive a risk mitigation plan.'
      ],
      benefits: [
        'Identify disease risks before they manifest.',
        'Understand lifestyle impact on longevity.',
        'Actionable nutrition and movement advice.',
        'Stay proactive about your future.',
        'Gamified health scores for motivation.'
      ],
      ayurveda: 'Ayurveda uses "Arishta Lakshana" to spot signs years before a disease takes root. Balance your Doshas now to protect your future.',
      unique: 'Beyond risk calculations, we offer a Dosha-specific biological roadmap for personalized intervention.',
      tips: [
        'Walk 20 minutes daily for vitality.',
        'Eat a Sattvic diet to reduce inflammation.',
        'Practice meditation for brain health.',
        'Monitor digestion (Agni) regularly.',
        'Get regular Ayurvedic detox.'
      ],
      faqs: [
        { q: 'Is this a medical tool?', a: 'No, it is for proactive health planning and education.' }
      ],
      conclusion: 'Your future health is the result of the small choices you make today. Use these AI-driven predictions to take control of your wellness destiny and age gracefully with Ayurveda.',
      cta: 'See Your Future Today',
      backgroundImage: '/future_health.png',
      image: '/futurehealthpredictor.png'
    },
    hi: {
      title: 'भविष्य स्वास्थ्य भविष्यवक्ता: अपना कल देखें',
      intro: 'क्या आप जानते हैं कि 20 साल बाद आपका स्वास्थ्य कैसा होगा? एआई और आयुर्वेद के मेल से अपने भविष्य के स्वास्थ्य के बारे में सटीक पूर्वानुमान प्राप्त करें।',
      steps: [
        'अपनी आदतें और मेडिकल इतिहास साझा करें।',
        'नींद और आहार से जुड़े सवालों के जवाब दें।',
        'एआई आपके डेटा का विश्लेषण करता है।',
        'अपना स्वास्थ्य स्कोर देखें।',
        'जोखिम कम करने के उपाय प्राप्त करें।'
      ],
      benefits: [
        'बीमारियों का पहले से पता लगाएं।',
        'लंबी उम्र के लिए जीवनशैली सुधारें।',
        'पोषण और कसरत की सलाह।',
        'कल के लिए आज ही तैयार रहें।'
      ],
      ayurveda: 'आयुर्वेद में लक्षणों का वर्षों पहले पता लगाने की क्षमता है। दोषों को जल्दी संतुलित करके आप स्वस्थ भविष्य पा सकते हैं।',
      unique: 'हम केवल जोखिम नहीं बताते, बल्कि उसे ठीक करने का आयुर्वेदिक रास्ता भी दिखाते हैं।',
      tips: [
        'रोज़ाना 20 मिनट पैदल चलें।',
        'सात्विक भोजन का चुनाव करें।',
        'नियमित ध्यान करें।',
        'पाचन पर नज़र रखें।'
      ],
      faqs: [
        { q: 'क्या यह डॉक्टर की जगह ले सकता है?', a: 'नहीं, यह शैक्षिक मार्गदर्शन के लिए है।' }
      ],
      conclusion: 'आज के छोटे बदलाव कल के बड़े स्वास्थ्य लाभ बन सकते हैं। अपने भविष्य के स्वास्थ्य को सुरक्षित करें।',
      cta: 'अपना भविष्य जानें',
      backgroundImage: '/future_health.png',
      image: '/futurehealthpredictor.png'
    }
  },
  'mood-ayurveda': {
    en: {
      title: 'Mental Recovery: Ayurvedic Mood Engine',
      intro: 'Stressed or unable to sleep? The Mood Engine uses AI to assess your emotional state and provides immediate natural remedies.',
      steps: [
        'Select the emoji that represents your mood.',
        'Get an AI Dosha impact assessment.',
        'Discover an Ayurvedic functional drink.',
        'Receive a recommended balance activity.',
        'Follow diet tips to stabilize emotions.'
      ],
      benefits: [
        'Natural relief from acute stress.',
        'Identify emotional Dosha impact.',
        'Discover mental stabilization foods.',
        'Learn Pranayama for mental peace.',
        'Improve nighttime sleep quality.'
      ],
      ayurveda: 'The mind follows Sattva (clarity), Rajas (activity), and Tamas (inertia). We restore Sattva by balancing the others with specific herbs.',
      unique: 'A "Mental First-Aid Kit" mapping mood to Ayurvedic tastes and qualities for real-time relief.',
      tips: [
        'Warm milk with nutmeg for sleep.',
        'Ashwagandha oil for stress reduction.',
        '5 mins of Anulom Vilom breathing.',
        'Avoid sugar when anxious.',
        'Walk barefoot for earthing.'
      ],
      faqs: [
        { q: 'What is a Sattvic mind?', a: 'A mind that is calm, clear, and compassionate.' }
      ],
      conclusion: 'Mental peace is not a destination, but a daily practice of balance. By feeding your mind the right qualities and following Ayurvedic emotional care, you can navigate life\'s stresses with ease.',
      cta: 'Find Your Balance',
      backgroundImage: '/moodayurveda.png'
    },
    hi: {
      title: 'मन और नींद: आयुर्वेदिक मूड इंजन',
      intro: 'तनाव महसूस कर रहे हैं? एआई के माध्यम से अपने मूड को समझें और तत्काल आयुर्वेदिक उपचार प्राप्त करें।',
      steps: [
        'अपना वर्तमान मूड इमोजी चुनें।',
        'अपना भावनात्मक दोष प्रभाव जानें।',
        'एक खास ड्रिंक की खोज करें।',
        'शांति के लिए कसरत या ध्यान करें।',
        'आहार युक्तियों का पालन करें।'
      ],
      benefits: [
        'तनाव से प्राकृतिक राहत।',
        'इमोशनल दोषों की पहचान।',
        'मस्तिष्क को स्थिर करने वाले खाद्य पदार्थ।',
        'मानसिक शांति के लिए प्राणायाम।'
      ],
      ayurveda: 'मन सत्व (स्पष्टता), रजस (गतिविधि), और तमस (जड़ता) का अनुसरण करता है। हम विशिष्ट जड़ी-बूटियों के साथ दूसरों को संतुलित करके सत्व को बहाल करते हैं।',
      unique: 'रीयल-टाइम राहत के लिए मूड को आयुर्वेदिक स्वाद और गुणों से जोड़ने वाली एक "मानसिक प्राथमिक चिकित्सा किट"।',
      tips: [
        'नींद के लिए जायफल के साथ गर्म दूध।',
        'तनाव कम करने के लिए अश्वगंधा तेल।',
        '5 मिनट अनुलोम विलोम प्राणायाम।'
      ],
      faqs: [
        { q: 'सात्विक मन क्या है?', a: 'एक ऐसा मन जो शांत, स्पष्ट और दयालु हो।' }
      ],
      conclusion: 'मानसिक शांति जीवन की चुनौतियों का सामना करने की कुंजी है। सत्व को बहाल करें और संतुलित रहें।',
      cta: 'अपनी भावनाओं को संतुलित करें',
      backgroundImage: '/moodayurveda.png'
    }
  },
  'smart-scan': {
    en: {
      title: 'Smart AI Health Scan: The Future of Ayurvedic Weight Loss & Vitality',
      intro: '🧬 Struggling with stubborn fatigue or wondering how to lose weight naturally without crashing your metabolism? The secret isn\'t just in the gym—it\'s in your unique Dosha balance. Ayurzenix Smart Health Scan is India’s first AI-powered "Nadi Pariksha" for the digital age. By analyzing your body’s subtle signals, we identify local toxins (Ama) and digestive fires (Agni) that might be causing metabolic blocks. Whether you are looking for ayurvedic weight loss tips or a deep vitality boost, this scan is your starting point for a healthier you.',
      steps: [
        'Open the Ayurzenix App and tap on "Smart Health Scan".',
        'Input your current physical symptoms and energy levels.',
        'Answer simple lifestyle questions about your sleep and stress.',
        'Upload health metrics or a clear photo if required for AI analysis.',
        'Sit back as our AI maps your data to the 5,000-year-old Vedic principles.',
        'Get your instant "Health Blueprint" with personalized recommendations.'
      ],
      benefits: [
        'Identify hidden root causes for weight gain and low energy.',
        'Get a personalized diet chart mapped to your Dosha (Vata/Pitta/Kapha).',
        'Discover if your "Agni" (digestive fire) is the reason for belly fat loss struggle.',
        'Learn which Ayurvedic herbs are best for your specific body type.',
        'Track your internal health score over time for consistent progress.',
        'Get actionable advice on reducing bloating and improving gut health.'
      ],
      ayurveda: 'Ayurveda teaches us that "Swastha" (health) is a state where Doshas, Agni, and Dhatus are in perfect equilibrium. Most modern illnesses are "Vikriti"—a deviation from your natural state. By identifying your current imbalances, we can guide you back to your "Prakriti" (original nature) using natural, time-tested methods.',
      unique: 'Unlike generic health trackers, Ayurzenix combines the depth of pulse-reading logic with cutting-edge Pattern Recognition AI. We don’t just count steps; we analyze the "Quality" of your health signals to provide a 360-degree view of your wellness journey.',
      tips: [
        'Sip warm water throughout the day to boost Agni for better belly fat loss.',
        'Never skip breakfast; it\'s the ignition for your daily metabolism.',
        'Try to eat your largest meal between 12 PM and 2 PM (Pitta peak).',
        'Standardize your sleep time to stabilize Vata and reduce cortisol.',
        'Add warming spices like Ginger and Turmeric to your daily cooking.',
        'Spend 5 minutes in "Shavasana" after a stressful workday.'
      ],
      faqs: [
        { q: 'Can I use this for ayurvedic weight loss?', a: 'Definitely. The scan identifies if your weight gain is due to Kapha accumulation or poor Agni, providing a targeted path to lose weight naturally.' },
        { q: 'How often should I scan my health?', a: 'We recommend a weekly check-in. It helps the AI track your Dosha shifts based on changing weather, diet, and stress levels.' },
        { q: 'Do I need a doctor for this?', a: 'This is a wellness diagnostic for proactive health. For clinical medical diagnosis, please consult a certified physician.' },
        { q: 'Will it help with belly fat loss?', a: 'By optimizing your digestive fire (Agni), the scan helps your body process fats more efficiently, which is the key to natural belly fat loss.' }
      ],
      conclusion: 'Don\'t leave your health to chance. In just 60 seconds, you can transition from "random health tips" to a "Precision Vedic Roadmap." Your body is talking to you through every symptom—it’s time you start listening with the power of AI & Ayurveda. Start your journey to a leaner, more vibrant version of yourself today!',
      cta: 'Start Your Smart Scan Now',
      backgroundImage: '/smart_health.jpg',
      image: '/smarthealthscan.jpg'
    },
    hi: {
      title: 'स्मार्ट एआई हेल्थ स्कैन: आयुर्वेदिक वेट लॉस और जीवन शक्ति का भविष्य',
      intro: '🧬 क्या आप पुरानी थकान से परेशान हैं या सोच रहे हैं कि बिना मेटाबॉलिज्म खराब किए प्राकृतिक रूप से वजन कैसे घटाएं? रहस्य सिर्फ जिम में नहीं है—यह आपके अद्वितीय दोष संतुलन में है। आयुषेनिक्स स्मार्ट हेल्थ स्कैन डिजिटल युग के लिए भारत का पहला एआई-संचालित "नाड़ी परीक्षण" है।',
      steps: [
        'ऐप खोलें और "स्मार्ट हेल्थ स्कैन" पर टैप करें।',
        'अपने वर्तमान शारीरिक लक्षणों और ऊर्जा स्तरों की जानकारी दें।',
        'नींद और तनाव के बारे में सरल जीवनशैली के सवालों के जवाब दें।',
        'एआई आपके डेटा का विश्लेषण करता है।',
        'अपना "स्वास्थ्य ब्लूप्रिंट" और व्यक्तिगत सुझाव प्राप्त करें।'
      ],
      benefits: [
        'वजन बढ़ने और कम ऊर्जा के छिपे हुए कारणों की पहचान करें।',
        'अपने दोष (वात/पित्त/कफ) के अनुसार व्यक्तिगत डाइट चार्ट पाएं।',
        'पाचन अग्नि (अग्नि) और पेट की चर्बी के बीच का संबंध समझें।',
        'अपने शरीर के प्रकार के लिए सर्वोत्तम आयुर्वेदिक जड़ी-बूटियों को जानें।',
        'अपने आंतरिक स्वास्थ्य स्कोर को ट्रैक करें।'
      ],
      ayurveda: 'आयुर्वेद हमें सिखाता है कि "स्वस्थ" वह अवस्था है जहाँ दोष, अग्नि और धातु पूर्ण संतुलन में होते हैं। अधिकांश आधुनिक बीमारियाँ "विकृति" हैं—आपकी प्राकृतिक स्थिति से विचलन।',
      unique: 'जेनेरिक हेल्थ ट्रैकर्स के विपरीत, आयुषेनिक्स पल्स-रीडिंग लॉजिक की गहराई को पैटर्न रिकग्निशन एआई के साथ जोड़ता है।',
      tips: [
        'मेटाबॉलिज्म बढ़ाने के लिए दिन भर गुनगुना पानी पिएं।',
        'नाश्ते को कभी न छोड़ें; यह मेटाबॉलिज्म के लिए ईंधन है।',
        'अपना सबसे भारी भोजन दोपहर 12 से 2 बजे के बीच करें।',
        'सोने का समय निश्चित करें ताकि वात संतुलित रहे।'
      ],
      faqs: [
        { q: 'क्या मैं इसे वेट लॉस के लिए उपयोग कर सकता हूँ?', a: 'बिल्कुल। स्कैन यह पहचानता है कि आपका वजन बढ़ना कफ की वजह से है या कमजोर अग्नि की वजह से, और प्राकृतिक रूप से वजन कम करने का रास्ता दिखाता है।' },
        { q: 'बेली फैट कम करने में यह कैसे मदद करेगा?', a: 'अपनी पाचन अग्नि (अग्नि) को अनुकूलित करके, आप वसा को बेहतर ढंग से प्रोसेस कर सकते हैं।' }
      ],
      conclusion: 'अपने स्वास्थ्य को भाग्य के भरोसे न छोड़ें। केवल 60 सेकंड में "रैंडम हेल्थ टिप्स" से "सटीक वैदिक रोडमैप" की ओर बढ़ें। आज ही अपनी यात्रा शुरू करें!',
      cta: 'अभी स्कैन शुरू करें',
      backgroundImage: '/smart_health.jpg',
      image: '/smarthealthscan.jpg'
    }
  },
  'weight-loss': {
    en: {
      title: 'Natural Weight Loss: Melt Fat with Ayurveda',
      intro: 'Lose weight safely without extreme diets. Ignite your metabolism naturally.',
      steps: ['Input metrics', 'Habit analysis', 'Get your plan', 'Track progress'],
      benefits: ['Natural fat burning', 'Stamina boost', 'Gut health improvement'],
      ayurveda: 'Ignite Agni to burn Kapha-related fat accumulation.',
      unique: 'AI optimization matching diet to your specific metabolic rate.',
      tips: ['Lemon water morning', 'Cumin water post-meal', 'Early dinner', 'Gentle movement'],
      faqs: [
        { q: 'How does Ayurveda help in weight loss?', a: 'By improving digestion and balancing metabolic fires.' }
      ],
      conclusion: 'Ayurvedic weight loss is not about starvation; it is about awakening your internal fires. By aligning your lifestyle with natural rhythms, you can achieve a sustainable weight that supports your long-term health.',
      cta: 'Burn Fat Naturally',
      backgroundImage: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop'
    },
    hi: {
      title: 'प्राकृतिक वजन घटाने का तरीका',
      intro: 'बिना किसी साइड इफेक्ट के वजन घटाएं। चयापचय में सुधार लाएं।',
      steps: ['विवरण दें', 'प्लान प्राप्त करें', 'नियमित पालन करें'],
      benefits: ['सुरक्षित वेट लॉस', 'बेहतर ऊर्जा'],
      ayurveda: 'कफ से संबंधित वसा संचय को जलाने के लिए अग्नि को प्रज्वलित करें।',
      unique: 'आपकी विशिष्ट चयापचय दर के लिए आहार का मिलान करने वाला एआई अनुकूलन।',
      tips: ['सुबह नींबू पानी', 'भोजन के बाद जीरा पानी', 'जल्दी रात्रिभोज'],
      faqs: [
        { q: 'क्या यह सुरक्षित है?', a: 'हाँ, यह पूरी तरह प्राकृतिक और सुरक्षित है।' }
      ],
      conclusion: 'प्राकृतिक वजन घटाना एक यात्रा है, दौड़ नहीं। अपनी अग्नि को प्रज्वलित करें और स्थायी परिणाम प्राप्त करें।',
      cta: 'वजन घटाना शुरू करें',
      backgroundImage: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop'
    }
  },
  'daily-routine': {
    en: {
      title: 'Master Your Day: Dinacharya Guide',
      intro: 'Align your body clock with nature for maximum productivity and health.',
      steps: ['Morning detox', 'Movement', 'Focused work', 'Evening winding'],
      benefits: ['Hormonal balance', 'Energy stability', 'Mental clarity'],
      ayurveda: 'Dinacharya builds Ojas (vitality) through rhythm.',
      unique: 'Personalized timing based on your unique metabolic rate.',
      tips: ['Eat biggest meal at noon', 'Sleep by 10 PM', 'Morning sunlight'],
      faqs: [{ q: 'What is Dinacharya?', a: 'A daily routine aligned with natural rhythms.' }],
      conclusion: 'Consistency is the highest form of self-care. By following a steady Dinacharya, you create a foundation of stability that allows your physical and mental health to flourish.',
      cta: 'Optimize My Day',
      backgroundImage: '/daily_routine.jpg'
    },
    hi: {
      title: 'दिनचर्या: आपका दैनिक मार्गदर्शक',
      intro: 'प्रकृति के साथ तालमेल बिठाकर अपनी ऊर्जा और स्वास्थ्य को शिखर पर पहुंचाएं।',
      steps: ['जल्दी उठें', 'गर्म पानी पिएं', 'व्यायाम करें', 'समय पर सोएं'],
      benefits: ['बेहतर इम्युनिटी', 'मानसिक शांति', 'ऊर्जा में वृद्धि'],
      ayurveda: 'प्रकृति के साथ तालमेल ओजस (जीवन शक्ति) का निर्माण करता है।',
      unique: 'आपकी चयापचय दर के आधार पर व्यक्तिगत समय।',
      tips: ['दोपहर में सबसे भारी भोजन करें', 'रात 10 बजे तक सोएं', 'सुबह की धूप लें'],
      faqs: [{ q: 'दिनचर्या क्या है?', a: 'प्राकृतिक लय के अनुरूप एक दैनिक दिनचर्या।' }],
      conclusion: 'एक सही दिनचर्या जीवन की गुणवत्ता को बदल सकती है। प्रकृति के साथ संरेखित हों और स्वस्थ रहें।',
      cta: 'दैनिक लक्ष्य निर्धारित करें',
      backgroundImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop'
    }
  },
  'stress-relief': {
    en: {
      title: 'Instant Calm: Ayurvedic Stress Relief',
      intro: 'Release tension and find inner peace with AI-guided Ayurvedic techniques.',
      steps: ['Identify stress triggers', 'Practice Pranayama', 'Natural remedies', 'Daily meditation'],
      benefits: ['Lower cortisol', 'Inner peace', 'Better focus'],
      ayurveda: 'Stress is Vata imbalance. We use grounding herbs like Ashwagandha.',
      unique: 'Real-time analysis of stress levels mapped to remedies.',
      tips: ['Nadi Shodhana breathing', 'Abhyanga (oil massage)', 'Warm baths'],
      faqs: [{ q: 'Can Ayurveda help anxiety?', a: 'Yes, through grounding activities and herbs.' }],
      conclusion: 'Stress is a part of modern life, but it doesn\'t have to rule it. Use these Ayurvedic tools to find your center and return to a state of calm whenever the world feels overwhelming.',
      cta: 'Relieve Stress Now',
      backgroundImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop'
    },
    hi: {
      title: 'मानसिक शांति: आयुर्वेदिक तनाव मुक्ति',
      intro: 'तनाव छोड़ें और मानसिक शांति पाएं।',
      steps: ['ट्रिगर्स पहचानें', 'प्राणायाम करें', 'हर्बल उपचार', 'ध्यान'],
      benefits: ['तनाव कम करें', 'बेहतर एकाग्रता'],
      ayurveda: 'तनाव वात असंतुलन है। अश्वगंधा जैसी जड़ी-बूटियाँ मदद करती हैं।',
      unique: 'तनाव स्तर के आधार पर रियल-टाइम समाधान।',
      tips: ['नाड़ी शोधन प्राणायाम', 'अभ्यंग (तेल मालिश)'],
      faqs: [
        { q: 'क्या आयुर्वेद तनाव में मदद कर सकता है?', a: 'हाँ, प्राणायाम और जड़ी-बूटियों के माध्यम से।' }
      ],
      conclusion: 'तनाव मुक्ति का मतलब मन की शांति है। आयुर्वेद के साथ अपने तनाव को प्रबंधित करें और शांति पाएं।',
      cta: 'तनाव मुक्त हों',
      backgroundImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop'
    }
  },
  'better-sleep': {
    en: {
      title: 'Deep Rest: Ayurvedic Sleep Recovery',
      intro: 'Struggle with insomnia? Align your Doshas for restorative sleep.',
      steps: ['Screen detox', 'Sleep environment setup', 'Herbal teas', 'Mindful breathing'],
      benefits: ['Rapid sleep onset', 'Refreshing wake-ups', 'Dream quality'],
      ayurveda: 'Sleep is one of the three pillars of life (Trayopastambha).',
      unique: 'AI optimization of bedroom environment and habits.',
      tips: ['No blue light', 'Oil on feet', 'Cool, dark room'],
      faqs: [{ q: 'How much sleep do I need?', a: 'Ideally 7-8 hours depending on your Dosha.' }],
      conclusion: 'Sleep is the foundation of all healing. Prioritize your rest today to unlock your full potential tomorrow. Sweet dreams and deep recovery await.',
      cta: 'Sleep Better Tonight',
      backgroundImage: 'https://images.unsplash.com/photo-1531353826977-0941b4779a1c?q=80&w=800&auto=format&fit=crop'
    },
    hi: {
      title: 'गहरी नींद: आयुर्वेदिक स्लीप रिकवरी',
      intro: 'अनिद्रा से परेशान हैं? अपनी नींद की गुणवत्ता में सुधार करें।',
      steps: ['स्क्रीन से दूर रहें', 'शांत वातावरण', 'हर्बल चाय', 'प्राणायाम'],
      benefits: ['जल्दी नींद आना', 'ताज़गी भरी सुबह'],
      ayurveda: 'नींद जीवन के तीन स्तंभों में से एक है।',
      unique: 'नींद के लिए एआई आधारित व्यक्तिगत समाधान।',
      tips: ['ब्लू लाइट से बचें', 'पैरों के तलवों की मालिश'],
      faqs: [
        { q: 'मुझे कितनी नींद की ज़रूरत है?', a: 'आपके दोष के आधार पर आदर्श रूप से 7-8 घंटे।' }
      ],
      conclusion: 'गहरी नींद आपके शरीर और मस्तिष्क को फिर से जीवंत करती है। एक सही नींद की दिनचर्या अपनाएं।',
      cta: 'आज रात गहरी नींद सोएं',
      backgroundImage: 'https://images.unsplash.com/photo-1531353826977-0941b4779a1c?q=80&w=800&auto=format&fit=crop'
    }
  },
  'hormonal-balance': {
    en: {
      title: 'Balance Within: Hormonal Health',
      intro: 'Manage cycles and mood swings with Ayurvedic hormonal balancing.',
      steps: ['Cycle tracking', 'Diet adjustments', 'Herbal support', 'Stress management'],
      benefits: ['Regular cycles', 'Stable moods', 'Clear skin'],
      ayurveda: 'Shatavari and Ashoka are the queen of herbs for women.',
      unique: 'AI correlations between cycle and Dosha peaks.',
      tips: ['Seed cycling', 'Limit caffeine', 'Flax seeds'],
      faqs: [{ q: 'Are herbs safe?', a: 'Ayurvedic herbs are natural but consult a physician.' }],
      conclusion: 'Hormonal health is a delicate symphony of your body\'s signals. By nurturing your system with the right herbs and lifestyle, you can achieve a state of vibrant balance at every stage of life.',
      cta: 'Balance My Hormones',
      backgroundImage: '/harmonalbalance.png'
    },
    hi: {
      title: 'हार्मोनल संतुलन: आंतरिक संतुलन',
      intro: 'प्राकृतिक रूप से अपने हार्मोन संतुलित करें।',
      steps: ['ट्रैकिंग', 'आहार सुधार', 'जड़ी-बूटी सहायता'],
      benefits: ['नियमित चक्र', 'स्थिर मूड'],
      ayurveda: 'शतावरी और अशोक महिलाओं के लिए अमृत हैं।',
      unique: 'मासिक धर्म चक्र और दोष चोटियों के बीच एआई संबंध।',
      tips: ['कैफीन कम करें', 'अलसी का प्रयोग'],
      faqs: [
        { q: 'क्या जड़ी-बूटियां सुरक्षित हैं?', a: 'आयुर्वेदिक जड़ी-बूटियाँ प्राकृतिक हैं लेकिन चिकित्सक से परामर्श करें।' }
      ],
      conclusion: 'हार्मोनल संतुलन आपके समग्र स्वास्थ्य की नींव है। प्राकृतिक तरीके अपनाएं और स्वस्थ रहें।',
      cta: 'हार्मोन संतुलित करें',
      backgroundImage: '/harmonalbalance.png'
    }
  },
  'hair-fall': {
    en: {
      title: 'Healthy Tresses: Hair Fall Control',
      intro: 'Stop hair thinning and promote growth from the roots.',
      steps: ['Scalp analysis', 'Oil selection', 'Scalp detox', 'Nutrient diet'],
      benefits: ['Reduced shedding', 'Thicker hair', 'Scalp health'],
      ayurveda: 'Hair is an extension of Asthi (bone) tissue.',
      unique: 'Root cause analysis based on Pitta and Agni health.',
      tips: ['Brahmi oil', 'Amla intake', 'Head massage'],
      faqs: [{ q: 'Why is my hair falling?', a: 'Stress, diet, and Pitta imbalance are common causes.' }],
      conclusion: 'Your hair health starts deep within your body. By cooling your Pitta and nourishing your system, you can restore your hair\'s natural strength and shine from the inside out.',
      cta: 'Restore My Hair',
      backgroundImage: '/hairfall.png'
    },
    hi: {
      title: 'घने बाल: हेयर फॉल कंट्रोल',
      intro: 'बाल झड़ना बंद करें और मजबूत बनाएं।',
      steps: ['स्कैल्प जांच', 'सही तेल का चुनाव', 'पोषक आहार'],
      benefits: ['कम झड़ना', 'मजबूत जड़ें'],
      ayurveda: 'बाल अस्थि ऊतक का विस्तार हैं।',
      unique: 'पित्त और अग्नि स्वास्थ्य के आधार पर मूल कारण विश्लेषण।',
      tips: ['ब्राह्मी तेल', 'आंवला जूस'],
      faqs: [
        { q: 'मेरे बाल क्यों गिर रहे हैं?', a: 'तनाव, आहार और पित्त असंतुलन सामान्य कारण हैं।' }
      ],
      conclusion: 'स्वस्थ बाल स्वस्थ शरीर का प्रतिबिंब हैं। अपनी जड़ों को पोषण दें और बालों का झड़ना बंद करें।',
      cta: 'बालों को स्वस्थ बनाएं',
      backgroundImage: '/hairfall.png'
    }
  },
  'liver-health': {
    en: {
      title: 'Vital Liver: The Detox Master',
      intro: 'Boost overall health by cleansing your liver naturally.',
      steps: ['Toxin identification', 'Liver diet', 'Bitter herbs', 'Evening detox'],
      benefits: ['Improved digestion', 'Clear skin', 'Energy boost'],
      ayurveda: 'The Liver (Yakrit) is the seat of Pitta.',
      unique: 'Analysis of Ama (toxins) impacting liver function.',
      tips: ['Drink dandelion tea', 'Avoid alcohol', 'Early to bed'],
      faqs: [{ q: 'Why is liver health important?', a: 'It filters blood and aids digestion.' }],
      conclusion: 'A healthy liver is the cornerstone of a vibrant life. Regular cleansing and mindful eating can transform your energy levels and skin health from the inside out.',
      cta: 'Detox My Liver',
      backgroundImage: '/liverhealth.png'
    },
    hi: {
      title: 'लीवर का स्वास्थ्य: प्राकृतिक डिटॉक्स',
      intro: 'अपने लीवर को डिटॉक्स करें और ऊर्जा बढ़ाएं।',
      steps: ['डिटॉक्स डाइट', 'कड़ी जड़ी-बूटियाँ', 'शाम का डिटॉक्स'],
      benefits: ['बेहतर पाचन', 'स्वच्छ त्वचा'],
      ayurveda: 'यकृत (लीवर) पित्त का स्थान है।',
      unique: 'लीवर के कार्य को प्रभावित करने वाले अमा (विषाक्त पदार्थों) का विश्लेषण।',
      tips: ['शराब से बचें', 'समय पर सोएं'],
      faqs: [
        { q: 'लीवर का स्वास्थ्य क्यों महत्वपूर्ण है?', a: 'यह रक्त को छानता है और पाचन में सहायता करता है।' }
      ],
      conclusion: 'लीवर आपके शरीर का मुख्य फिल्टर है। इसे साफ रखें और अपने स्वास्थ्य को नई ऊंचाइयों पर ले जाएं।',
      cta: 'लीवर डिटॉक्स करें',
      backgroundImage: '/liverhealth.png'
    }
  },
  'gut-health': {
    en: {
      title: 'The Core: Gut Health Optimization',
      intro: 'All health starts in the gut. Heal your digestion with AI.',
      steps: ['Symptom check', 'Probiotic diet', 'Digestive herbs', 'Stool analysis'],
      benefits: ['No bloating', 'Regularity', 'Immunity boost'],
      ayurveda: 'Health starts with Agni (digestive fire).',
      unique: 'AI mapping of digestive symptoms to fire quality.',
      tips: ['Eat only when hungry', 'Sip warm water', 'Triphala night'],
      faqs: [{ q: 'What is Agni?', a: 'The digestive fire responsible for metabolism.' }],
      conclusion: 'A strong gut is the secret to a high quality of life. Fuel your Agni, honor your digestion, and watch your overall wellness transform.',
      cta: 'Heal My Gut',
      backgroundImage: '/gut-health.png'
    },
    hi: {
      title: 'पाचन स्वास्थ्य: गट हेल्थ',
      intro: 'सारा स्वास्थ पाचन से शुरू होता है।',
      steps: ['लक्षण जांच', 'प्रोबायोटिक आहार', 'पाचन जड़ी-बूटी'],
      benefits: ['गैस और भारीपन से राहत', 'इम्युनिटी'],
      ayurveda: 'स्वास्थ्य अग्नि (पाचन अग्नि) से शुरू होता है।',
      unique: 'अग्नि की गुणवत्ता के लिए पाचन लक्षणों का एआई मानचित्रण।',
      tips: ['भूख लगने पर ही खाएं', 'गुनगुना पानी पिएं'],
      faqs: [
        { q: 'अग्नि क्या है?', a: 'चयापचय के लिए जिम्मेदार पाचन अग्नि।' }
      ],
      conclusion: 'मजबूत पाचन ही उत्तम स्वास्थ्य का आधार है। अपनी अग्नि को संतुलित रखें और स्वस्थ रहें।',
      cta: 'पाचन सुधारें',
      backgroundImage: '/gut-health.png'
    }
  },
  'energy-booster': {
    en: {
      title: 'Infinite Energy: The Ayurvedic Way',
      intro: 'Ditch caffeine and find stable energy through natural vitality.',
      steps: ['Assess exhaustion cause', 'Vitality herbs', 'Prana exercises', 'Rest optimization'],
      benefits: ['No midday crashes', 'Mental alertness', 'Physical stamina'],
      ayurveda: 'Build Ojas through proper digestion and rest.',
      unique: 'AI vitality scores based on daily activity and sleep.',
      tips: ['Meditation morning', 'Ashwagandha milk', 'Sun exposure'],
      faqs: [{ q: 'How to increase energy?', a: 'Balance Ojas and keep Vata grounded.' }],
      conclusion: 'True energy comes from within, not from stimulants. Build your Ojas through proper and consistent Ayurvedic practices for a life full of vitality.',
      cta: 'Boost My Energy',
      backgroundImage: '/energy-booster.png'
    },
    hi: {
      title: 'ऊर्जा का स्रोत: आयुर्वेदिक तरीके',
      intro: 'थकान को अलविदा कहें और ऊर्जा बढ़ाएं।',
      steps: ['थकान का कारण जानें', 'ऊर्जा जड़ी-बूटी', 'प्राणायाम'],
      benefits: ['दिन भर ऊर्जा', 'मानसिक सतर्कता'],
      ayurveda: 'पाचन और विश्राम से ओजस बनाएं।',
      unique: 'दैनिक गतिविधि और नींद के आधार पर एआई जीवन शक्ति स्कोर।',
      tips: ['अश्वगंधा दूध', 'धूप लें'],
      faqs: [
        { q: 'ऊर्जा कैसे बढ़ाएं?', a: 'ओजस को संतुलित करें और वात को नियंत्रित रखें।' }
      ],
      conclusion: 'सच्ची ऊर्जा भीतर से आती है। ओजस का निर्माण करें और दिन भर सक्रिय रहें।',
      cta: 'ऊर्जा बढ़ाएं',
      backgroundImage: '/energy-booster.png'
    }
  },
  'body-scan': {
    en: {
      title: 'Body Insights: AI Anatomy Scan',
      intro: 'Visualize your internal balance through external observation.',
      steps: ['Posture check', 'Build assessment', 'AI processing', 'Dosha report'],
      benefits: ['Posture correction', 'Genetic predisposition', 'Optimal exercise'],
      ayurveda: 'Darshana is the science of observation.',
      unique: 'AI computer vision used for Ayurvedic trait identification.',
      tips: ['Stretching daily', 'Dosha-specific movement', 'Core stability'],
      faqs: [{ q: 'Is it medical scan?', a: 'No, it is a morphological wellness assessment.' }],
      conclusion: 'Understanding your body\'s unique geometry is the first step toward peak performance. Use these insights to move more mindfully and live more healthfully.',
      cta: 'Scan My Body',
      backgroundImage: '/yogi-3d.png'
    },
    hi: {
      title: 'बॉडी स्कैन: अपना शरीर समझें',
      intro: 'एआई के माध्यम से अपने शरीर की संरचना जानें।',
      steps: ['तस्वीर लें', 'प्रोसेसिंग', 'रिपोर्ट'],
      benefits: ['पोस्चर सुधार', 'शरीर दोष पहचान'],
      ayurveda: 'दर्शन अवलोकन का विज्ञान है।',
      unique: 'आयुर्वेदिक लक्षणों की पहचान के लिए उपयोग किया जाने वाला एआई कंप्यूटर विजन।',
      tips: ['स्ट्रेचिंग करें', 'योग अभ्यास'],
      faqs: [
        { q: 'क्या यह मेडिकल स्कैन है?', a: 'नहीं, यह एक रूपात्मक कल्याण मूल्यांकन है।' }
      ],
      conclusion: 'अपने शरीर की संरचना को समझना बेहतर स्वास्थ्य की दिशा में पहला कदम है।',
      cta: 'बॉडी स्कैन शुरू करें',
      backgroundImage: '/yogi-3d.png'
    }
  },
  'heart-health': {
    en: {
      title: 'Why Heart Attacks Are Increasing in India (2026 Insights)',
      intro: 'Heart attacks are no longer a problem limited to older adults. Across India, cases are rising rapidly—even among people in their 30s and 40s. According to multiple health reports, cardiovascular disease has become one of the leading causes of death in India. What’s more concerning is that many people show no clear symptoms before a heart event. So what’s causing this sudden rise? And more importantly—how can you protect yourself?',
      steps: [
        'Describe your daily physical activity and movement.',
        'Share your common diet and nutrition habits.',
        'Evaluate your current stress and anxiety levels.',
        'Monitor your sleep quality and duration.',
        'Identify subtle early warning signals.',
        'Get your instant AI Heart Risk Score.'
      ],
      benefits: [
        'Identify hidden cardiac risks early.',
        'Pinpoint diet and lifestyle bottlenecks.',
        'Detection of signals missing in standard tests.',
        'Personalized Ayurvedic recovery protocol.',
        'Proactive monitoring for your family.',
        'Improve cardiac stamina naturally.'
      ],
      ayurveda: 'In Ayurveda, heart health is linked to the balance of the three Doshas. Vata imbalance causes irregular rhythm and anxiety. Pitta imbalance leads to high blood pressure and heat. Kapha imbalance results in cholesterol and arterial blockage. Maintaining Hridaya health requires deep internal balance.',
      unique: 'Our AI engine maps clinical markers to Vedic concepts like Ojas and Agni, offering a 60-second analysis without invasive lab tests.',
      tips: [
        'Limit salt, excess oil, and refined sugars.',
        'Ensure 7-8 hours of sound sleep by 10 PM.',
        'Practice 10 mins of Nadi Shodhana pranayama.',
        'Walk briskly for at least 30 mins daily.',
        'Use heart-friendly spices like Cinnamon and Garlic.'
      ],
      faqs: [
        { q: 'Why are heart attacks rising in young Indians?', a: 'Modern work stress, sedentary habits, and processed food are the primary factors.' },
        { q: 'Can Ayurveda reverse heart risk?', a: 'Ayurveda focuses on prevention and strengthening through lifestyle, reducing risk markers naturally.' },
        { q: 'How often should I use the Analyzer?', a: 'Regular checks (once a month) help track how your lifestyle changes impact your heart.' }
      ],
      conclusion: 'Your heart is the engine of your life. Protecting it requires a blend of modern awareness and ancient wisdom. Start your cardiac wellness journey today by listening to the subtle signals of your body.',
      cta: 'Analyze My Heart Risk',
      backgroundImage: '/heart_banner.jpg'
    },
    hi: {
      title: 'भारत में हार्ट अटैक के मामले क्यों बढ़ रहे हैं? (2026 के नए आँकड़े)',
      intro: 'हार्ट अटैक अब केवल बुजुर्गों तक सीमित नहीं है। भारत में 30 और 40 की उम्र के युवाओं में भी मामले तेजी से बढ़ रहे हैं। हृदय रोग भारत में मृत्यु के प्रमुख कारणों में से एक बन गया है। सबसे चिंता की बात यह है कि कई लोगों में कोई स्पष्ट लक्षण नहीं दिखते। जानिए इसके पीछे के कारण और आप स्वयं को कैसे बचा सकते हैं।',
      steps: [
        'अपनी शारीरिक गतिविधि और व्यायाम का विवरण दें।',
        'अपनी खान-पान और पोषण की आदतों को साझा करें।',
        'तनाव और चिंता के स्तर का मूल्यांकन करें।',
        'अपनी नींद की गुणवत्ता और समय की जानकारी दें।',
        'आरंभिक चेतावनी के संकेतों की पहचान करें।',
        'तुरंत एआई हार्ट रिस्क स्कोर प्राप्त करें।'
      ],
      benefits: [
        'छिपे हुए हृदय जोखिमों की जल्दी पहचान करें।',
        'आहार और जीवनशैली की बाधाओं का पता लगाएं।',
        'उन संकेतों को पकड़ें जो टेस्ट में छूट जाते हैं।',
        'व्यक्तिगत आयुर्वेदिक रिकवरी प्रोटोकॉल।',
        'अपने परिवार के लिए सक्रिय स्वास्थ्य निगरानी।',
        'हृदय की क्षमता को प्राकृतिक रूप से बढ़ाएं।'
      ],
      ayurveda: 'आयुर्वेद में हृदय स्वास्थ्य तीन दोषों के संतुलन से जुड़ा है। वात असंतुलन अनियमितता और चिंता पैदा करता है। पित्त असंतुलन उच्च रक्तचाप की ओर ले जाता है। कफ असंतुलन कोलेस्ट्रॉल और ब्लॉकेज का कारण बनता है। एचृदय स्वास्थ्य के लिए आंतरिक संतुलन आवश्यक है।',
      unique: 'हमारा एआई इंजन ओजस और अग्नि जैसे वैदिक सिद्धांतों को आधुनिक नैदानिक संकेतों से जोड़ता है, जिससे लैब टेस्ट के बिना 60 सेकंड में विश्लेषण संभव होता है।',
      tips: [
        'नमक, तेल और रिफाइंड चीनी कम करें।',
        'रात 10 बजे तक 7-8 घंटे की नींद सुनिश्चित करें।',
        'प्रतिदिन 10 मिनट नाड़ी शोधन प्राणायाम करें।',
        'रोजाना कम से कम 30 मिनट तेज चलें।',
        'दालचीनी और लहसुन जैसे हृदय-हितैषी मसालों का प्रयोग करें।'
      ],
      faqs: [
        { q: 'भारतीय युवाओं में हार्ट अटैक क्यों बढ़ रहे हैं?', a: 'काम का तनाव, गतिहीन जीवनशैली और प्रोसेस्ड फूड इसके प्रमुख कारण हैं।' },
        { q: 'क्या आयुर्वेद हृदय जोखिम को कम कर सकता है?', a: 'आयुर्वेद जीवनशैली सुधार के माध्यम से रोकथाम और मजबूती पर ध्यान केंद्रित करता है।' }
      ],
      conclusion: 'अपने दिल की सुनें, इसके संकेतों को नजरअंदाज न करें। आयुर्वेद और एआई के साथ अपने हृदय स्वास्थ्य को सुरक्षित रखें।',
      cta: 'हृदय जोखिम का विश्लेषण करें',
      backgroundImage: '/heart_banner.jpg'
    }
  }
};
