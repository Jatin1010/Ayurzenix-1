// Dataset import removed

export interface AyurvedicCondition {
  modernName: string;
  hindiName: string;
  marathiName: string;
  ayurvedicName: string;
  doshas: string;
  symptoms: string[];
  herbs: string[];
  formulation: string;
  diet: string[];
  lifestyle: string[];
  recedies: string[];
  yoga: string[];
  prognosis: string;
  complications: string;
}

const STATIC_KNOWLEDGE_BASE: Record<string, any> = {
  "Cough": {
    ayurvedicName: "Kasa",
    hindiName: "खांसी",
    marathiName: "खोकला",
    doshas: "Vata, Kapha",
    symptoms: ["Sore throat", "chest congestion"],
    herbs: ["Tulsi", "Ashwagandha", "Ginger", "Honey"],
    formulation: "Ginger (2g), Honey (1 tsp)",
    diet: ["Avoid cold foods", "consume warm liquids"],
    yoga: ["Anulom Vilom", "Pranayama"],
    prognosis: "Usually mild",
    complications: "Bronchitis, Pneumonia",
    diagnosis: ["Chest X-ray", "Blood tests", "Sputum analysis"],
    medicalIntervention: "Cough syrup, Antibiotics"
  },
  "Diabetes": {
    ayurvedicName: "Madhumeha",
    hindiName: "मधुमेह",
    marathiName: "मधुमेह",
    doshas: "Kapha, Pitta, Vata",
    symptoms: ["Frequent urination", "fatigue", "excessive thirst"],
    herbs: ["Jamun", "Gudmar", "Cinnamon", "Bitter melon"],
    formulation: "Fenugreek (3g daily), Bitter gourd (50ml juice)",
    diet: ["Avoid sugary foods", "focus on low-GI foods", "high fiber"],
    yoga: ["Surya Namaskar", "Pranayama"],
    prognosis: "Chronic, manageable",
    complications: "Retinopathy, Kidney disease",
    diagnosis: ["Blood sugar test", "HbA1c test"],
    medicalIntervention: "Insulin, Oral meds"
  },
  "Hypertension": {
    ayurvedicName: "Rakta Gata Vata",
    hindiName: "उच्च रक्तचाप",
    marathiName: "उच्च रक्तदाब",
    doshas: "Pitta, Vata",
    symptoms: ["High blood pressure", "stress", "headaches", "dizziness"],
    herbs: ["Ashwagandha", "Arjuna", "Garlic", "Hibiscus"],
    formulation: "Ashwagandha (5g daily), Arjuna bark (3g)",
    diet: ["Reduce salt", "avoid spicy foods", "low fat"],
    yoga: ["Meditation", "Savasana", "Surya Namaskar"],
    prognosis: "Chronic",
    complications: "Heart failure, Stroke",
    diagnosis: ["Blood pressure measurement"],
    medicalIntervention: "Antihypertensive meds"
  },
  "Migraine": {
    ayurvedicName: "Ardhavabhedaka",
    hindiName: "माइग्रेन",
    marathiName: "डोकेदुखी",
    doshas: "Pitta, Vata",
    symptoms: ["Severe headache", "nausea", "sensitivity to light/sound"],
    herbs: ["Brahmi", "Jatamansi", "Peppermint", "Lavender"],
    formulation: "Peppermint (2 drops in water), Brahmi (3g)",
    diet: ["Maintain regular meal times", "stay hydrated", "avoid caffeinated foods"],
    yoga: ["Anulom Vilom", "Pranayama"],
    prognosis: "Variable",
    complications: "Anxiety, Depression"
  },
  "Arthritis": {
    ayurvedicName: "Amavata / Sandhigata Vata",
    hindiName: "गठिया",
    marathiName: "आर्थरायटीस",
    doshas: "Vata, Kapha",
    symptoms: ["Joint pain", "swelling", "stiffness"],
    herbs: ["Ashwagandha", "Guggul", "Turmeric", "Ginger", "Shallaki"],
    formulation: "Turmeric (1/2 tsp), Milk (200ml)",
    diet: ["Anti-inflammatory foods", "warm cooked meals"],
    yoga: ["Gentle stretching", "Joint mobility exercises"],
    prognosis: "Chronic",
    complications: "Joint deformity, Mobility issues"
  },
  "Indigestion": {
    ayurvedicName: "Ajirna / Agnimandya",
    hindiName: "पाचन की समस्या",
    marathiName: "पचन समस्या",
    doshas: "Vata, Pitta",
    symptoms: ["Bloating", "abdominal discomfort", "nausea"],
    herbs: ["Triphala", "Ajwain", "Peppermint", "Fennel"],
    formulation: "Ajwain seeds (1 tsp), Warm water (200ml)",
    diet: ["Avoid processed foods", "eat smaller meals", "avoid heavy meals"],
    yoga: ["Vajrasana", "Pranayama"],
    prognosis: "Usually mild",
    complications: "Acid reflux, GERD"
  },
  "Asthma": {
    ayurvedicName: "Tamaka Svasa",
    hindiName: "दमा",
    marathiName: "श्वसन रोग",
    doshas: "Kapha, Vata",
    symptoms: ["Wheezing", "shortness of breath", "chest tightness"],
    herbs: ["Ashwagandha", "Tulsi", "Mulethi", "Ginger"],
    formulation: "Mulethi (1/2 tsp), Honey (1 tsp)",
    diet: ["Avoid cold and dusty environments", "warm foods"],
    yoga: ["Kapalbhati", "Pranayama"],
    prognosis: "Chronic",
    complications: "Asthma attacks, Lung infections"
  },
  "Insomnia": {
    ayurvedicName: "Anidra",
    hindiName: "अनिद्रा",
    marathiName: "अनिद्रा",
    doshas: "Vata, Pitta",
    symptoms: ["Difficulty sleeping", "restlessness", "fatigue"],
    herbs: ["Ashwagandha", "Jatamansi", "Brahmi", "Valerian root"],
    formulation: "Brahmi (1 tsp), Warm milk (200ml)",
    diet: ["Avoid caffeine", "avoid heavy late dinners", "warm milk"],
    yoga: ["Yoga Nidra", "Meditation", "Anulom Vilom"],
    prognosis: "Chronic if untreated",
    complications: "Anxiety, Depression"
  },
  "Obesity": {
    ayurvedicName: "Sthaulya",
    hindiName: "मोटापा",
    marathiName: "स्थूलता",
    doshas: "Kapha",
    symptoms: ["Weight gain", "lethargy", "shortness of breath on exertion"],
    herbs: ["Guggul", "Triphala", "Garcinia Cambogia", "Green tea"],
    formulation: "Guggulu (500mg), Triphala (1 tsp) in warm water",
    diet: ["Avoid heavy and oily foods", "light dinners", "low fat/sugar"],
    yoga: ["Surya Namaskar", "Walking", "Dynamic Yoga"],
    prognosis: "Chronic, manageable",
    complications: "Heart disease, Diabetes"
  },
  "Acidity": {
    ayurvedicName: "Amlapitta",
    hindiName: "अम्लपित्त",
    marathiName: "आम्लपित्त",
    doshas: "Pitta",
    symptoms: ["Heartburn", "sour taste", "nausea", "burning sensation"],
    herbs: ["Amla", "Ajwain", "Aloe Vera", "Fennel"],
    formulation: "Aloe vera (10ml), Water (200ml)",
    diet: ["Avoid spicy foods", "eat cooling foods like cucumber/coconut water"],
    yoga: ["Sitala Pranayama", "Vajrasana"],
    prognosis: "Usually mild",
    complications: "GERD, Esophagitis"
  },
  "Constipation": {
    ayurvedicName: "Vibandha",
    hindiName: "कब्ज",
    marathiName: "बद्धकोष्ठता",
    doshas: "Vata",
    symptoms: ["Hard stools", "infrequent bowel movement", "bloating"],
    herbs: ["Triphala", "Isabgol", "Aloe Vera"],
    formulation: "Triphala (1 tsp), Warm water (200ml)",
    diet: ["Increase fiber intake", "stay hydrated", "warm water in morning"],
    yoga: ["Paschimottanasana", "Malasana"],
    prognosis: "Usually mild",
    complications: "Hemorrhoids, Fecal impaction"
  },
  "PCOS": {
    ayurvedicName: "Artava Kshaya",
    hindiName: "PCOS",
    marathiName: "PCOS",
    doshas: "Kapha, Pitta",
    symptoms: ["Irregular periods", "weight gain", "excessive hair growth"],
    herbs: ["Shatavari", "Ashwagandha", "Kanchanar Guggulu"],
    formulation: "Shatavari (5g), Warm milk",
    diet: ["Low carb", "high fiber", "avoid processed sugar"],
    yoga: ["Baddha Konasana", "Surya Namaskar"],
    prognosis: "Manageable",
    complications: "Infertility, Diabetes"
  },
  "Psoriasis": {
    ayurvedicName: "Kitibha / Kapala Kushtha",
    hindiName: "सोरायसिस",
    marathiName: "सोरायसिस",
    doshas: "Vata, Kapha, Pitta",
    symptoms: ["Red inflamed skin", "silvery scales", "itching"],
    herbs: ["Neem", "Turmeric", "Aloe Vera", "Manjistha"],
    formulation: "Neem leaves (5-6), Water (200ml)",
    diet: ["Anti-inflammatory diet", "avoid incompatible foods", "low salt"],
    yoga: ["Stress reduction", "Pranayama"],
    prognosis: "Chronic",
    complications: "Joint pain, Skin infections"
  },
  "Tuberculosis": {
    ayurvedicName: "Rajayakshma",
    hindiName: "तपेदिक",
    marathiName: "क्षय रोग",
    doshas: "Tridosha",
    symptoms: ["Persistent cough", "fever", "weight loss", "night sweats"],
    herbs: ["Ashwagandha", "Guduchi", "Vasaka", "Mulethi"],
    formulation: "Chyawanprash (1 tsp), Warm milk",
    diet: ["High protein", "nutrient dense", "easy to digest"],
    yoga: ["Pranayama", "Gentle breathing"],
    prognosis: "Difficult",
    complications: "Lung damage, Organ failure"
  },
  "Conjunctivitis": {
    ayurvedicName: "Abhisyanda",
    code: "1/01",
    doshas: "Kapha/Pitta",
    symptoms: ["Redness of eye", "burning sensation", "sticky discharge"],
    treatment: ["Netra prakshalana (eye wash)", "Triphala drops"],
    herbs: ["Triphala", "Neem"],
    source: "Sushruta Samhita"
  },
  "Glaucoma": {
    ayurvedicName: "Adhimantha",
    code: "1/02",
    doshas: "Vata/Pitta",
    symptoms: ["Severe eye pain", "headache", "reduced peripheral vision"],
    treatment: ["Vata-Pitta shamana", "Nasya", "Raktamokshana"],
    herbs: ["Triphala", "Punarnava"],
    source: "Sushruta Samhita"
  },
  "Haemorrhoids": {
    ayurvedicName: "Arshas",
    code: "AR/01",
    doshas: "Vata / Pitta / Kapha",
    symptoms: ["Bleeding per rectum", "painful defecation", "protrusions"],
    treatment: ["Kshara Karma", "Sitz bath", "Deepana-pachana"],
    herbs: ["Suran (Elephant Foot Yam)", "Haritaki", "Nagkeshar"],
    source: "Sushruta Samhita"
  },
  "Anaemia": {
    ayurvedicName: "Pandu",
    code: "P/01",
    doshas: "Pitta / Vata / Kapha",
    symptoms: ["Pallor", "weakness", "shortness of breath"],
    treatment: ["Iron supplementation", "Nourishing diet"],
    herbs: ["Loha Bhasma", "Amalaki", "Punarnava"],
    source: "Charaka Samhita"
  }
};

export const AYURVEDIC_KNOWLEDGE_BASE = STATIC_KNOWLEDGE_BASE;

