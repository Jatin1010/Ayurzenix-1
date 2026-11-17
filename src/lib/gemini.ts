import axios from "axios";
import { AYURVEDIC_KNOWLEDGE_BASE } from "../constants/ayurvedicData";
import { AI_PERSONA, AI_SAFETY_RULES } from "../constants/aiPrompts";

// Helper for model selection - using stable aliases from skill
const MODELS = {
  BASIC: 'gemini-1.5-flash',
  COMPLEX: 'gemini-1.5-flash' 
};

/**
 * Robust AI Caller that proxies through the backend to keep API keys secure.
 */
export const callGeminiServer = async (modelName: string, contents: any[], config: any = {}, featureId?: string) => {
  try {
    const response = await axios.post('/api/gemini/analyze', {
      model: modelName,
      contents,
      config,
      featureId
    });

    if (!response.data || (!response.data.text && !response.data.success)) {
      throw new Error(response.data?.error || "AI returned an empty response.");
    }

    if (!response.data.text && response.data.success) {
      throw new Error("AI returned an empty response.");
    }

    return { 
      text: response.data.text,
      success: true 
    };
  } catch (error: any) {
    console.error(`[AI] Generation Failed (${featureId}):`, error.response?.data || error);
    
    return { 
      success: false,
      error: error.response?.data?.error || error.message || "Failed to generate AI insights",
      text: ""
    };
  }
};

const withRetry = async <T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> => {
  try {
    return await fn();
  } catch (error: any) {
    // Handle SDK specific error properties
    const message = error.message?.toLowerCase() || '';
    const isRetryable = error.status === "RESOURCE_EXHAUSTED" || 
                        error.code === 429 || 
                        message.includes('429') ||
                        message.includes('503') ||
                        message.includes('empty') ||
                        message.includes('recalibrating') ||
                        message.includes('hiccup');

    if (retries > 0 && isRetryable) {
      console.warn(`AI Throttled. Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
};

const UNIVERSAL_RULES = `
### HIGH-DEFINITION STORYTELLING (MANDATORY)
Your output must be cinematic, professional, and deeply Ayurvedic. 
- Use "High-Contrast" descriptors (e.g., "Radiant Vitality", "Systemic Turbulence", "Biological Synergy").
- Maintain a perfect balance between ancient Sanskrit wisdom and modern life-science diagnostics.
- Ensure every insight feels like it was written by a world-class health consultant.

### THE "DNA" CONNECT (MANDATORY)
For every analysis:
- Connect: Symptoms → Elemental Vitiation → Tissue Layer (Dhatu) → Systemic Outcome.
- Personalization: Reference specific markers from the user's data to prove individual calibration.
- Style: Use professional tone that is both clinical and empathetic.

### THERAPY INTELLIGENCE (MANDATORY MAPPING)
Identify the main condition category and map:
- Hair Care (hair_fall) → Nasya, Shiro Abhyanga
- Mind/Sleep (stress_relief, better_sleep) → Shirodhara, Abhyanga
- Gut/Acidity (gut_health) → Virechana, Agni Deepana
- Weight (weight_loss) → Udvartana, Swedana
- Skin (face_glow/body_scan) → Raktamokshana (concept), Lepa
- Default → Abhyanga, Swedana

### OUTPUT TEXT & LANGUAGE
- "आपके symptoms से संकेत मिलता है…" (Insight)
- "इसका मुख्य कारण है…" (Root Cause)
- "इसलिए यह उपाय आपके लिए जरूरी है…" (Remedy)
- Mix high-level medical English with relatable "Premium Hinglish" to build trust.
`;

const BASIC_PROTOCOL = `
# ROLE AND CLIENT SCOPE
You are "Ayurzenix [Free Tier]", an AI-driven Ayurvedic advisor. Analyze user inputs and generate a simple, helpful, curiosity-driven basic report.

${UNIVERSAL_RULES}

# PLAN LEVEL DEFINITION: BASIC (FREE)
Generate ONLY the following details in the JSON structure (leave other keys empty or brief, but do not crash the parser):
1. Wellness Score dashboard metrics in 'wellnessScore' (Vata, Pitta, Kapha, and overall score out of 100).
2. Dominant Dosha connected to user symptoms in 'doshaHeader' (dominant name & short symptom-linked insight using "आपके symptoms से संकेत मिलता है…").
3. Root Cause in 'rootCause': MUST be written in EXACTLY 5 lines (no more, no less), detailing how the symptoms connect to body systems and Dosha imbalances (using "इसका मुख्य कारण है…").
4. One Clear Deep Insight in 'deepInsight' detailing the core biological transition.
5. Exactly ONE powerful, practical Home Remedy in 'homeRemedies' array (only 1 element, using "इसलिए यह उपाय आपके लिए जरूरी है…").
6. Exactly ONE lifestyle tip in 'routine.lifestyleTip'.
7. Exactly 3 personalized Ayurvedic Product Recommendations in 'productSuggestions' featuring handpicked herbal formulations with descriptive search terms (such as "organic pure ashwagandha powder" or similar).

Tone: Simple, warm, helpful, curiosity-driven.
`;

const PRO_PROTOCOL = `
# ROLE AND CLIENT SCOPE
You are "Ayurzenix [PRO Tier]", an advanced AI-driven Ayurvedic clinical expert. Analyze the user's input and generate an attractive, very detailed, but easy-to-read mid-tier clinical wellness blueprint.

${UNIVERSAL_RULES}

# PLAN LEVEL DEFINITION: PRO (₹49)
You MUST generate ALL fields in the JSON response schema. No details can be left sparse or empty.
Generate fully comprehensive content for each of the following:
1. Full Wellness Dashboard: 'wellnessScore' (0-100 overall score, plus vata/pitta/kapha percentages) and compatibility score metrics.
2. Dominant Dosha (linked to symptoms): 'doshaHeader' (dominant and insight using "आपके symptoms से संकेत मिलता है…").
3. Briefly describe Root Cause: 'rootCause' - Explaining the root cause in an EXHAUSTIVE, deeply detailed explanation of at least 500 words summarizing it beautifully (using "इसका मुख्य कारण है…").
4. One Clear Insight (deep reason) in details: 'deepInsight'.
5. Five Home Remedies: 'homeRemedies' array containing EXACTLY 5 recipes/formulas with ingredients, step-by-step methods, dosage, daily logic (using "इसलिए यह उपाय आपके लिए जरूरी है…").
6. 10 Lifestyle Tips: in 'routine.lifestyleTip' (list 10 high-impact actions) and across routine plans.
7. System Health: Include detailed ratings of Energy, Digestion, Sleep, Stress, and Immunity bio-balances within 'metrics'.
8. Agni Analysis: 'agniAnalysis' detailing the state of their digestive fire (Manda, Tikshna, Vishama, or Sama).
9. Mental Analysis: 'mentalState' analyzing Guna balance (Sattva/Rajas/Tamas state) and Manas Prakriti.
10. Diet Plan: 'dietPlan' mapping 'eat' foods (with precise Ayurvedic reasons) and 'avoid' foods (with precise bio-impact reasons).
11. Daily Routine (Dinacharya): 'routine' with structured 'morning' and 'night' sequential steps.
12. Herbs and Remedies formulas: 'herbalProtocol' containing specific herbs/formulas with reasons and direct dosha impacts.
13. Ayurvedic Medicines (market-available suggestions): 'ayurvedicMedicines' providing 3-4 suggestions with dosage and guidelines.
14. Yoga and Pranayama: 'yogaPranayama' with at least 3 'yoga' asanas and 3 'breathing' techniques.
15. Ayurvedic Therapies (MANDATORY): 'therapies' array containing therapies matching the mapping rules of THERAPY INTELLIGENCE.
16. 7-Day Action Plan: 'plan7Day' containing daily structured action items for 7 days.
17. Trigger and Habit Analysis: 'triggers' containing at least 4 critical physical/mental habit triggers.
18. Product Recommendations: 'productSuggestions' featuring handpicked herbal formulations with affiliate-friendly terms.

Tone: Clinical, deeply authoritative, empathetic, completely scientific but classical.
`;

const PREMIUM_PROTOCOL = `
# ROLE AND CLIENT SCOPE
You are "Ayurzenix [PREMIUM Tier]", the ultimate master of AI-driven Ayurvedic science. Generate a dense, exhaustive, highest-intelligence forensic wellness blueprint.

${UNIVERSAL_RULES}

# PLAN LEVEL DEFINITION: PREMIUM (₹99)
You MUST generate ALL fields in the JSON response schema. Fill every single field exhaustively!
Generate fully comprehensive content:
1. Full Wellness Dashboard: 'wellnessScore' (0-100 overall score, plus vata/pitta/kapha percentages) and compatibility score metrics.
2. Dominant Dosha: 'doshaHeader' explaining the exact imbalance linked directly to user symptoms (using "आपके symptoms से संकेत मिलता है…").
3. Root Cause: 'rootCause' - Explaining the root cause in an EXHAUSTIVE, deeply detailed explanation of at least 500 words summarizing it beautifully (using "इसका मुख्य कारण है…").
4. One Clear Insight (deep reason) in details: 'deepInsight'.
5. Five Home Remedies: 'homeRemedies' array containing EXACTLY 5 recipes/formulas with ingredients, step-by-step methods, dosage, daily logic (using "इसलिए यह उपाय आपके लिए जरूरी है…").
6. 10 Lifestyle Tips: in 'routine.lifestyleTip' (list 10 high-impact actions) and across routine plans.
7. System Health: Include detailed ratings of Energy, Digestion, Sleep, Stress, and Immunity within 'metrics'.
8. Agni Analysis: 'agniAnalysis' detailing the state of their digestive fire (Manda, Tikshna, Vishama, or Sama).
9. Mental Analysis: 'mentalState' analyzing Guna balance (Sattva/Rajas/Tamas state) and Manas Prakriti.
10. Diet Plan: 'dietPlan' mapping 'eat' foods (with precise Ayurvedic reasons) and 'avoid' foods (with precise bio-impact reasons).
11. Daily Routine (Dinacharya): 'routine' with structured 'morning' and 'night' sequential steps.
12. Herbs and Remedies, formulas: 'herbalProtocol' containing specific herbs/formulas with reasons and direct dosha impacts.
13. Ayurvedic Medicines (market-available suggestions): 'ayurvedicMedicines' providing 3-4 suggestions with dosage and guidelines.
14. Yoga and Pranayama: 'yogaPranayama' with at least 3 'yoga' asanas and 3 'breathing' techniques.
15. Ayurvedic Therapies (MANDATORY): 'therapies' array containing therapies matching the mapping rules of THERAPY INTELLIGENCE.
16. 7-Day Action Plan: 'plan7Day' containing daily structured action items for 7 days.
17. Trigger and Habit Analysis: 'triggers' containing at least 4 critical physical/mental habit triggers.
18. Product Recommendations: 'productSuggestions' featuring handpicked herbal formulations with descriptive affiliate terms.
19. Deep Ayurvedic Intelligence: Cover Dosha interaction, Dhatu impact, and Long-term effects.
20. Therapy Sequencing: Include step-by-step order of when and how to perform each therapy in the 'sequencing' field.
21. 30-Day Transformation Plan: 'plan30Day' detailing a weekly structured path to milestones.
22. Future Health Risk Prediction: 'futurePrediction' with the next 30 days biological predictions.
23. Progress Tracking System: 'progressTracking' outlining weekly measurable indicators (tongue, sleep, energy) to self-evaluate.
24. Advanced Product Recommendations: 'productSuggestions' mapped to cure.
25. Priority AI Insights: 'priorityAIInsights' representing an extra high-intelligence layer.

Tone: Clinical, deeply authoritative, empathetic, completely scientific but classical.
`;


const getReportInstructions = (planId: string) => {
  if (planId === 'basic') return BASIC_PROTOCOL;
  if (planId === 'pro') return PRO_PROTOCOL;
  return PREMIUM_PROTOCOL; // Premium
};

const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    reportHeader: {
      type: "object",
      properties: {
        featureName: { type: "string" },
        dateTime: { type: "string" },
        conditionName: { type: "string" },
        planName: { type: "string" }
      },
      required: ["featureName", "dateTime", "conditionName", "planName"]
    },
    doshaHeader: {
      type: "object",
      properties: {
        dominant: { type: "string" },
        insight: { type: "string" }
      },
      required: ["dominant", "insight"]
    },
    wellnessScore: {
      type: "object",
      properties: {
        score: { type: "number" },
        vata: { type: "number" },
        pitta: { type: "number" },
        kapha: { type: "number" }
      },
      required: ["score", "vata", "pitta", "kapha"]
    },
    rootCause: { type: "string", description: "The core reason for the imbalance. Maximize depth for PRO/PREMIUM." },
    agniAnalysis: { type: "string" },
    mentalState: { type: "string" },
    deepInsight: { type: "string" },
    dietPlan: {
      type: "object",
      properties: {
        eat: { type: "array", items: { type: "string" } },
        avoid: { type: "array", items: { type: "string" } }
      },
      required: ["eat", "avoid"]
    },
    routine: {
      type: "object",
      properties: {
        morning: { type: "array", items: { type: "string" } },
        night: { type: "array", items: { type: "string" } },
        lifestyleTip: { type: "string" }
      },
      required: ["morning", "night"]
    },
    herbalProtocol: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          why: { type: "string" },
          usage: { type: "string" }
        },
        required: ["name", "why", "usage"]
      }
    },
    ayurvedicMedicines: {
       type: "array",
       items: {
          type: "object",
          properties: {
             name: { type: "string" },
             benefit: { type: "string" },
             dosage: { type: "string" }
          },
          required: ["name", "benefit", "dosage"]
       }
    },
    homeRemedies: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          ingredients: { type: "array", items: { type: "string" } },
          steps: { type: "array", items: { type: "string" } },
          timing: { type: "string" },
          duration: { type: "string" },
          logic: { type: "string" }
        },
        required: ["name", "ingredients", "steps", "timing", "duration", "logic"]
      }
    },
    yogaPranayama: {
      type: "object",
      properties: {
        yoga: { type: "array", items: { type: "string" } },
        breathing: { type: "array", items: { type: "string" } }
      },
      required: ["yoga", "breathing"]
    },
    therapies: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          benefits: { type: "string" },
          doshaImpact: { type: "string" },
          recoveryImpact: { type: "string" },
          frequency: { type: "string" },
          sequencing: { type: "string", description: "When and how to perform. Include for PREMIUM." }
        },
        required: ["name", "description", "benefits", "doshaImpact", "recoveryImpact", "frequency"]
      }
    },
    plan7Day: {
      type: "array",
      items: {
        type: "object",
        properties: {
          day: { type: "number" },
          tasks: { type: "array", items: { type: "string" } }
        },
        required: ["day", "tasks"]
      }
    },
    plan30Day: {
      type: "array",
      items: {
        type: "object",
        properties: {
          week: { type: "number" },
          milestone: { type: "string" },
          focus: { type: "string" },
          outcome: { type: "string" }
        },
        required: ["week", "milestone", "focus"]
      }
    },
    triggers: { type: "array", items: { type: "string" } },
    futurePrediction: { type: "string" },
    progressTracking: { type: "string" },
    productSuggestions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          benefit: { type: "string" },
          link_search_term: { type: "string" }
        },
        required: ["name", "benefit", "link_search_term"]
      }
    },
    priorityAIInsights: { type: "string", description: "Extra intelligence layer for PREMIUM." },
    reportSummary: { type: "string" },
    detailedReasoning: { type: "string" },
    disclaimer: { type: "string" },
    // Dashboard Compatibility Fields
    riskScore: { type: "number" },
    riskLevel: { type: "string" },
    breakdown: { type: "array", items: { type: "object" } },
    metrics: { type: "object" },
    ayurvedicAnalysis: { type: "object" },
    overallScore: { type: "number" }
  },
  required: [
    "reportHeader",
    "doshaHeader", 
    "wellnessScore", 
    "rootCause"
  ]
};

export const analyzeSleepIntelligence = async (inputs: any, language: string = 'en', planId: string = 'basic') => {
  const prompt = `
    ${AI_PERSONA}
    ${getReportInstructions(planId)}
    
    PLAN TIER: ${planId.toUpperCase()}
    Analyze the user's comprehensive sleep intelligence data:
    ${JSON.stringify(inputs)}

    Identify 'Nidra' quality, impact of late-night screen time on Tarpaka Kapha and Sadhaka Pitta, and overall Rajasic/Tamasic mind state.

    LANGUAGE: ${language}

    GENERATE REPORT FOLLOWING THE MASTER PLAN STRUCTURE.
    Include specialized dashboard metrics in "metrics" and "ayurvedicAnalysis" fields.
    
    ${AI_SAFETY_RULES}
  `;

  try {
    const result = await withRetry(() => callGeminiServer(MODELS.BASIC, [{ role: 'user', parts: [{ text: prompt }] }], {
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA as any,
    }, 'sleep_intelligence'));

    const text = result.text;
    if (!text) throw new Error("Empty response from AI");
    const parsed = JSON.parse(text);

    // Deep mapping for compatibility with Sleep Screen
    if (!parsed.ayurvedicAnalysis) {
      parsed.ayurvedicAnalysis = {
        rootCause: parsed.rootCause,
        imbalanceExplanation: parsed.rootCauseDetailed || parsed.deepInsight,
        doshaPercentages: { 
          vata: parsed.wellnessScore?.vata || (parsed.doshaHeader?.dominant === 'Vata' ? 70 : 30),
          pitta: parsed.wellnessScore?.pitta || (parsed.doshaHeader?.dominant === 'Pitta' ? 70 : 30),
          kapha: parsed.wellnessScore?.kapha || (parsed.doshaHeader?.dominant === 'Kapha' ? 70 : 30)
        },
        gunaBalance: { sattva: 45, rajas: 35, tamas: 20 }
      };
    }
    if (!parsed.metrics) {
      parsed.metrics = {
        sleepQuality: parsed.wellnessScore?.score || 70,
        sleepDebt: 2,
        deepSleep: 65,
        nervousSystemRecovery: parsed.wellnessScore?.score || 70,
        stressImpact: 45,
        circadianBalance: 80
      };
    }
    parsed.overallScore = parsed.wellnessScore?.score || 0;
    parsed.roadmap = parsed.plan7Day?.map((d: any) => ({
      week: Math.ceil(d.day / 7),
      title: d.tasks?.[0] || "Recovery Step",
      focus: d.tasks?.[1] || "Biological Reset",
      practices: d.tasks || []
    })) || [];

    return parsed;
  } catch (error) {
    console.error("Sleep Intelligence Analysis Error:", error);
    throw error;
  }
};

export const generateHeartHealthAnalysis = async (data: any, planId: string = 'basic') => {
  const planInstructions = {
    basic: "TIER: BASIC. Provide essential cardiovascular summary metrics: Wellness Score, Risk Assessment, and Quick Lifestyle Tips. Focus: Hridaya Moola protection.",
    pro: "TIER: PRO. Provide EVERYTHING in BASIC plus: Full Cardiac Dashboard, Detailed Root Cause analysis (Sadhaka Pitta & Adharaniya Vega), Agni Analysis (Liver/Digestion), 7-Day Cardiovascular Action Plan, Heart-Specific Herbs, and Daily Circadian Routine.",
    premium: "TIER: PREMIUM. Provide EVERYTHING in PRO plus: 30-Day Heart Transformation Plan, Deep Hridaya Marma Therapy Sequences, Cardiovascular Risk Forecasting (5-year), and Premium Ayurvedic Cardiovascular Ledger."
  }[planId as 'basic' | 'pro' | 'premium'] || "";

  const prompt = `
    ${AI_PERSONA}
    ${getReportInstructions(planId)}
    
    PLAN TIER: ${planId.toUpperCase()} - ${planInstructions}
    Analyze this heart health profile (Hridaya specialist):
    Age: ${data.age}, BP: ${data.bp_systolic}/${data.bp_diastolic}, Stress: ${data.stress_level}, Symptoms: ${data.chest_pain ? 'Chest Pain' : ''} ${data.breathlessness ? 'Breathlessness' : ''}

    Focus on 'Hridaya Moola', 'Sadhaka Pitta', and 'Adharaniya Vega'.

    LANGUAGE: en
    
    GENERATE REPORT FOLLOWING THE MASTER PLAN STRUCTURE FOR PLAN: ${planId.toUpperCase()}.
    Include "riskScore", "riskLevel", and "breakdown" for the dashboard.
    
    ${AI_SAFETY_RULES}
  `;

  try {
    const result = await withRetry(() => callGeminiServer(MODELS.COMPLEX, [{ role: 'user', parts: [{ text: prompt }] }], {
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA as any,
    }, 'heart_health'));

    const text = result.text;
    if (!text) throw new Error("Empty response from Gemini");
    const parsed = JSON.parse(text);

    // Compatibility mapping
    parsed.riskScore = parsed.wellnessScore?.score || 0;
    parsed.riskLevel = parsed.riskScore > 70 ? 'High risk' : parsed.riskScore > 30 ? 'Moderate risk' : 'Low risk';
    if (!parsed.breakdown) {
      parsed.breakdown = [
        { label: "Circadian Rhythm", score: 85, status: "Stable" },
        { label: "Stress Load", score: parsed.riskScore, status: parsed.riskLevel },
        { label: "Vata Regulation", score: 72, status: "Optimal" }
      ];
    }
    if (!parsed.ayurveda) {
      parsed.ayurveda = {
        doshaImbalance: parsed.doshaHeader?.dominant || "Vata-Pitta",
        rootCause: parsed.rootCause
      };
    }
    // Deep map for premium UI
    parsed.premium = {
      ashtangaGita: parsed.deepInsight || "Protecting the heart is protecting the Ojas.",
      marmaMapping: { point: "Hridaya Marma", status: "Active", guidance: "Gentle pressure with rose oil." },
      riskPrediction: { current: parsed.riskScore, projection5Year: Math.max(0, parsed.riskScore - 20), explanation: parsed.futurePrediction || "Long-term outlook is positive with lifestyle shifts." },
      herbs: parsed.herbalProtocol || [],
      routine: parsed.routine?.morning?.map((t: any) => ({ time: "06:00 AM", task: t, benefit: "Vitality" })) || [],
      roadmap30Day: parsed.plan30Day || []
    };
    
    return parsed;
  } catch (error) {
    console.error("Heart Health Analysis Error:", error);
    throw error;
  }
};

export const analyzeHealthProfile = async (profile: any, language: string = 'en') => {
  const planId = profile.planId || 'basic';
  
  const prompt = `
    ${AI_PERSONA}
    ${getReportInstructions(planId)}
    
    PLAN TIER: ${planId.toUpperCase()}

    FEATURE CONTEXT: ${profile.type}
    
    USER DATA:
    ${profile.type === 'goal_wellness' ? `
    GOAL: ${profile.goalTitle}
    Input: ${JSON.stringify(profile)}
    ` : `
    Age: ${profile.age}, Gender: ${profile.gender}, Symptoms: ${profile.currentSymptoms}
    Lifestyle: ${profile.lifestyle}, Stress: ${profile.stressLevel}, Sleep: ${profile.sleepQuality}
    `}

    LANGUAGE: ${language}

    --------------------------------------------------
    GENERATE REPORT FOLLOWING THE MASTER PLAN STRUCTURE.
    Be extremely specific. Reference user symptoms back to them in the analysis.
    For fields excluded by the selectedPlan, return null or empty array.
    --------------------------------------------------
    
    ${AI_SAFETY_RULES}
  `;

  try {
    const result = await withRetry(() => callGeminiServer(MODELS.COMPLEX, [{ role: 'user', parts: [{ text: prompt }] }], {
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA as any,
    }, profile.type));

    const text = result.text;
    if (!text) throw new Error("Empty response from Gemini");
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};

export const analyzeBodyScan = async (base64Image: string | null, inputs: any, language: string = 'en', planId: string = 'basic') => {
  const finalPlanId = planId || inputs.planId || 'basic';
  
  let data = '';
  let mimeType = 'image/jpeg';
  if (base64Image) {
    const parts = base64Image.split(',');
    data = parts[1] || parts[0];
    mimeType = parts[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  }

  const prompt = `
    ${AI_PERSONA}
    ${getReportInstructions(planId)}
    
    PLAN TIER: ${finalPlanId.toUpperCase()}
    
    ${base64Image ? 'Analyze this image using Ayurvedic visual diagnostics (skin/tongue/posture/eye-patterns) combined with user bio-data.' : 'Analyze user symptoms and lifestyle from a holistic Ayurvedic perspective.'}

    User Data:
    - Symptoms: ${inputs.symptoms?.join(', ') || 'N/A'}${inputs.otherSymptom ? ` (Other: ${inputs.otherSymptom})` : ''}
    - Sleep: ${inputs.lifestyle?.sleep}, Stress: ${inputs.lifestyle?.stress}, Energy: ${inputs.lifestyle?.energy}

    **GROUNDING DATA**:
    ${JSON.stringify(Object.values(AYURVEDIC_KNOWLEDGE_BASE).slice(0, 20))}

    LANGUAGE: ${language}

    GENERATE REPORT FOLLOWING THE MASTER PLAN STRUCTURE.
    Provide realistic, evidence-based Ayurvedic insights.
    
    ${AI_SAFETY_RULES}
  `;

  try {
    const parts: any[] = [{ text: prompt }];
    if (base64Image) {
      parts.push({ inlineData: { data, mimeType } });
    }

    const result = await withRetry(() => callGeminiServer(MODELS.COMPLEX, [{ role: 'user', parts: parts }], {
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA as any,
    }, 'body_scan'));

    const text = result.text;
    if (!result.success) throw new Error(result.error);
    if (!text) throw new Error("Empty response from Gemini");
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Body Scan Error:", error);
    throw error;
  }
};

export const generateProductSketch = async (productName: string) => {
  try {
    const result = await withRetry(() => callGeminiServer(MODELS.BASIC, [
      {
        role: 'user',
        parts: [
          {
            text: `A minimalist, elegant pencil sketch of an Ayurvedic product: ${productName}. 
            The style should be clean, botanical, and artistic, on a plain white background. 
            No text, no labels, just the artistic representation of the herb or medicine bottle.
            Make it look like a professional medical illustration from an ancient Ayurvedic text but modernized.`,
          },
        ],
      }
    ], {}));

    return result.text ? null : null; // Placeholder for now
  } catch (error) {
    console.error("Error generating sketch:", error);
    return null;
  }
};

export const analyzeFaceGlow = async (imageBase64: string | null, inputs: any, language: string = 'en', planId: string = 'basic') => {
  const finalPlanId = planId || inputs.planId || 'basic';
  
  const planInstructions = {
    basic: "Provide a QUICK SUMMARY result. Keep explanations brief. Focus on 1 main remedy and 2-3 diet tips.",
    pro: "Provide a FULL PERSONALIZED report. Go deep into Dosha analysis, Agni, and skin constitution. Provide 5-7 diet items and 3 home remedies.",
    premium: "Provide a DEEP TRANSFORMATION plan. Extremely detailed analysis. Include a 30-day glow ritual, advanced herbal mask recipes, and long-term skin health strategy."
  }[finalPlanId as 'basic' | 'pro' | 'premium'] || "Provide a standard analysis.";

  const prompt = `
    ${AI_PERSONA}
    ${UNIVERSAL_RULES}
    
    PLAN TIER: ${finalPlanId.toUpperCase()} - ${planInstructions}
    Analyze the ${imageBase64 ? 'uploaded face image and ' : ''}user inputs to provide a detailed skin glow analysis.
    
    User Inputs:
    - Skin Type: ${inputs.skinType}
    - Main Concern: ${inputs.mainConcern}
    - Sleep Quality: ${inputs.sleepQuality}
    - Water Intake: ${inputs.waterIntake}
    - Stress Level: ${inputs.stressLevel}

    ${imageBase64 ? 'The user has provided a face image. Please analyze visual markers like dullness, dryness, oiliness, and spots.' : 'No image provided. Base your analysis strictly on the user inputs provided above.'}

    **GROUNDING**: Strictly follow Ayurvedic skincare principles and the provided knowledge base where applicable.

    Respond in ${language}.
    
    ${AI_SAFETY_RULES}

    Return the response in the following JSON format:
  {
    "glowScore": number (0-100),
    "hydrationLevel": "Low" | "Medium" | "Good",
    "observations": [
      { "title": string, "description": string }
    ],
    "possibleCauses": [
      { "title": string, "description": string }
    ],
    "suggestions": {
      "diet": [string],
      "skincare": {
        "morning": [string],
        "night": [string]
      },
      "remedies": [string]
    },
    "recommendedProducts": [
      {
        "name": string,
        "benefit": string,
        "category": "Cream" | "Oil" | "Face Wash" | "Pack",
        "price": string,
        "rating": number,
        "imageSearchTerm": string
      }
    ]
  }`;

  try {
    const parts: any[] = [{ text: prompt }];
    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: imageBase64.split(',')[1] || imageBase64,
        },
      });
    }

    const result = await withRetry(() => callGeminiServer(MODELS.BASIC, [{ role: 'user', parts }], {
      responseMimeType: "application/json",
    }, 'face_glow'));

    const text = result.text;
    if (!text) throw new Error("Empty response from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error("Face Glow Analysis Error:", error);
    throw error;
  }
};

export const analyzeFutureHealth = async (inputs: any, language: string = 'en') => {
  const planId = inputs.planId || 'basic';
  
  const planInstructions = {
    basic: "Provide a QUICK SUMMARY result. Focus on the main risk and top 3 actions.",
    pro: "Provide a FULL PERSONALIZED report. Deep dive into weekly markers and causes.",
    premium: "Provide a DEEP TRANSFORMATION plan. Extremely detailed biological and Ayurvedic predictions for every phase of the month."
  }[planId as 'basic' | 'pro' | 'premium'] || "Provide a standard analysis.";

  const prompt = `
    ${AI_PERSONA}
    ${UNIVERSAL_RULES}
    
    PLAN TIER: ${planId.toUpperCase()} - ${planInstructions}
    Based on the user's structured lifestyle and health data, predict their health risks and wellness outlook for the next 30 days with extreme precision.
    
    User Data:
    - Daily Routine: ${inputs.dailyRoutine}
    - Diet Habits: ${inputs.dietHabits}
    - Sleep Quality: ${inputs.sleep}
    - Stress Level: ${inputs.stressLevel}
    - Energy Level: ${inputs.energyLevel}
    - Current Symptoms: ${inputs.symptoms.join(', ')}${inputs.otherSymptom ? ` (Other: ${inputs.otherSymptom})` : ''}

    **GROUNDING**:
    ${JSON.stringify(Object.values(AYURVEDIC_KNOWLEDGE_BASE).slice(0, 20))}

    Language: ${language}

    OBJECTIVE:
    1. Provide a VERY LONG, EXHAUSTIVE, and SCIENTIFICALLY-BACKED Ayurvedic report. 
    2. Identify possible future health risks for the next 30 days.
    3. Explain the root cause based on Ayurvedic principles (Vata, Pitta, Kapha) in great detail.
    
    ${AI_SAFETY_RULES}

    Return the response in the following JSON format:
  {
    "outlook": string (A very detailed 3-4 paragraph summary of the overall 30-day outlook, explaining the 'why' behind the prediction),
    "riskLevel": "Low" | "Medium" | "High",
    "predictions": [
      { 
        "period": "Week 1" | "Week 2" | "Week 3" | "Week 4", 
        "focus": string (Main area of focus), 
        "risk": string (Possible risk), 
        "cause": string (Deep Ayurvedic and biological cause analysis, at least 2-3 sentences),
        "remedy": string (Detailed Ayurvedic remedy/prevention, at least 2-3 sentences) 
      }
    ],
    "keyWarnings": [string] (At least 6-8 specific warnings),
    "recommendedActions": [string] (At least 8-10 specific, actionable steps),
    "ayurvedicInsight": string (A very deep, 4-5 paragraph Ayurvedic explanation of their current biological state, mentioning Dhatus, Agni, and Ama),
    "dietaryRecommendations": {
      "toEat": [string],
      "toAvoid": [string],
      "specialHerbs": [string]
    },
    "mentalWellness": string (Detailed guidance for mental peace, meditation, and stress management)
  }`;

  try {
    const result = await withRetry(() => callGeminiServer(MODELS.BASIC, [{ role: 'user', parts: [{ text: prompt }] }], {
      responseMimeType: "application/json",
    }, 'future_health'));

    const text = result.text;
    if (!text) throw new Error("Empty response from Gemini");
    return JSON.parse(text);
  } catch (error) {
    console.error("Future Health Prediction Error:", error);
    throw error;
  }
};

export const analyzeStressRelief = async (inputs: any, language: string = 'en', planId: string = 'basic') => {
  const prompt = `
    ${AI_PERSONA}
    ${getReportInstructions(planId)}
    
    PLAN TIER: ${planId.toUpperCase()}
    Analyze the user's stress and Manovaha Srotas data:
    ${JSON.stringify(inputs)}

    Focus on Guna balance (Sattva/Rajas/Tamas) and Vata disturbance in the mind.

    LANGUAGE: ${language}

    GENERATE REPORT FOLLOWING THE MASTER PLAN STRUCTURE.
    Include "gunaBalance" and specific "mentalState" analysis.
    
    ${AI_SAFETY_RULES}
  `;

  try {
    const result = await withRetry(() => callGeminiServer(MODELS.BASIC, [{ role: 'user', parts: [{ text: prompt }] }], {
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA as any,
    }, 'stress_relief'));

    const text = result.text;
    if (!text) throw new Error("Empty response from AI");
    const parsed = JSON.parse(text);

    // Compatibility mapping
    parsed.overallScore = parsed.wellnessScore?.score || 0;
    parsed.metrics = parsed.wellnessScore ? { 
      stressScore: parsed.wellnessScore.score, 
      anxietyLoad: 40,
      emotionalResilience: 60,
      burnoutRisk: 30,
      nervousSystemBalance: 65,
      mentalClarity: 70
    } : {};
    if (!parsed.ayurvedicAnalysis) {
      parsed.ayurvedicAnalysis = {
        dominantDosha: parsed.doshaHeader?.dominant || "Vata",
        doshaPercentages: { vata: parsed.wellnessScore?.vata || 60, pitta: parsed.wellnessScore?.pitta || 20, kapha: parsed.wellnessScore?.kapha || 20 },
        gunaBalance: { sattva: 50, rajas: 30, tamas: 20 },
        rootCause: parsed.rootCause,
        imbalanceExplanation: parsed.deepInsight
      };
    }
    parsed.roadmap = parsed.plan7Day?.map((d: any) => ({
      week: Math.ceil(d.day / 7),
      title: d.tasks?.[0] || "Peace Protocol",
      focus: d.tasks?.[1] || "Nervous Reset",
      practices: d.tasks || [],
      herbs: parsed.herbalProtocol?.map((h: any) => h.name) || []
    })) || [];

    return parsed;
  } catch (error) {
    console.error("Stress Relief Analysis Error:", error);
    throw error;
  }
};

export const analyzeMoodAyurveda = async (mood: string, language: string = 'en', planId: string = 'basic') => {
  const planInstructions = {
    basic: "Provide 1 main remedy and 2 diet tips.",
    pro: "Provide a detailed stress reset plan with herbs and ritual guidance.",
    premium: "Provide a complete 30-day emotional transformation protocol with deep ritual mastery."
  }[planId as 'basic' | 'pro' | 'premium'] || "Standard stress relief.";

  const prompt = `You are an Ayurvedic mood and psychological expert (Manas Vigyana specialist). 
  PLAN TIER: ${planId.toUpperCase()} - ${planInstructions}
  Based on the user's selected mood, provide a holistic Ayurvedic remedy.
  
  **KNOWLEDGE INTEGRATION**: Use the concepts of the Three Gunas:
  - Sattva: Clarity, light, peace.
  - Rajas: Agitation, passion, movement.
  - Tamas: Heaviness, inertia, darkness.
  
  Identify which Guna is currently dominating the user's mind (Chitta) based on their mood and how to bring it back to Sattva.

  User Mood: ${mood}
  Language: ${language} (Ensure all text in the response is in this language)

  IMPORTANT: 
  - Do NOT provide medical diagnosis.
  - Keep the tone helpful, supportive, and Ayurvedic.
  - Respond in ${language}.

  Return the response in the following JSON format:
  {
    "remedy": string (Overall Ayurvedic remedy),
    "drink": string (Recommended Ayurvedic drink),
    "activity": string (Recommended activity like Yoga or Pranayama),
    "diet": [string],
    "doshaImpact": string (How this mood affects Vata/Pitta/Kapha),
    "gunaAnalysis": string (Analysis of Sattva, Rajas, and Tamas state)
  }`;

  try {
    const result = await withRetry(() => callGeminiServer(MODELS.BASIC, [{ role: 'user', parts: [{ text: prompt }] }], {
      responseMimeType: "application/json",
    }, 'mood_ayurveda'));

    const text = result.text;
    return JSON.parse(text);
  } catch (error) {
    console.error("Mood Ayurveda Analysis Error:", error);
    throw error;
  }
};

export const analyzeSmartMentalScan = async (inputs: any, language: string = 'en', planId: string = 'basic') => {
  const prompt = `
    ${AI_PERSONA}
    ${getReportInstructions(planId)}
    
    PLAN TIER: ${planId.toUpperCase()}
    Analyze the user's mental architect and emotional intelligence:
    ${JSON.stringify(inputs)}

    Focus on Manas Prakriti, Sattva/Rajas/Tamas ratios, and the state of Sadhaka Pitta and Tarpaka Kapha in the mind.

    LANGUAGE: ${language}

    GENERATE REPORT FOLLOWING THE MASTER PLAN STRUCTURE.
    Include deep mental metrics in the "metrics" and "gunaBalance" fields.
    
    ${AI_SAFETY_RULES}
  `;

  try {
    const result = await withRetry(() => callGeminiServer(MODELS.BASIC, [{ role: 'user', parts: [{ text: prompt }] }], {
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA as any,
    }, 'smart_mental_scan'));

    const text = result.text;
    if (!text) throw new Error("Empty response from Gemini");
    const parsed = JSON.parse(text);

    // Compatibility mapping
    parsed.overallScore = parsed.wellnessScore?.score || 0;
    parsed.gunaBalance = { sattva: 60, rajas: 30, tamas: 10 };
    parsed.gunaAnalysis = parsed.mentalState;
    parsed.deepInsights = [parsed.deepInsight || "Your mind is currently in a state of delicate balance."];
    parsed.recommendations = {
      mantra: "Om Shanti",
      herbs: parsed.herbalProtocol?.map((h: any) => h.name) || [],
      diet: parsed.dietPlan?.eat || [],
      pranayama: parsed.yogaPranayama?.breathing || [],
      lifestyle: parsed.routine?.morning || []
    };

    return parsed;
  } catch (error) {
    console.error("Smart Mental Scan Error:", error);
    throw error;
  }
};

export const generateProductDetails = async (keyword: string) => {
  const prompt = `
You are an AI Product Assistant for an Android app "Ayurzenix".
Your task is to generate clean, realistic, and app-ready product details based on a product keyword extracted from an affiliate link.

INPUT: "${keyword}"

OUTPUT (STRICT JSON FORMAT):
{
  "title": "Clean, simple, attractive title (Max 6-8 words)",
  "tags": ["tag1", "tag2", "tag3"],
  "description": "1-2 lines only. No medical claims. Use safe wording like 'may help'.",
  "category": "energy" // Choose one: ["energy", "skin", "stress", "sleep", "digestion", "general"]
}

RULES:
- Do NOT use medical claims
- Do NOT say "cure", "treat", "guaranteed"
- Keep everything realistic and simple
- Avoid complex or technical words
- Output must be suitable for Indian users
- Clean, trustworthy, natural tone, slight Hinglish allowed
  `;

  try {
    const result = await withRetry(() => callGeminiServer(MODELS.BASIC, [{ role: 'user', parts: [{ text: prompt }] }], {
      responseMimeType: "application/json",
    }, 'product_generation'));

    if (!result.text) {
      throw new Error("Failed to generate product details.");
    }

    return JSON.parse(result.text);
  } catch (error) {
    console.error("Product Generation Error:", error);
    throw error;
  }
};

export const analyzeAdvancedProfile = async (type: string, inputs: any, language: string = 'en', planId: string = 'basic') => {
  let featureContext = '';
  if (type === 'hormonal_balance') {
    featureContext = "Focus specifically on female hormonal health, menstrual cycle rhythms (Rutu Chakra), Apana Vata function, checking for PCOS/PCOD indicators, and hormonal balance (Pitta-Vata).";
  } else if (type === 'hair_fall') {
    featureContext = "Focus specifically on Asthi and Majja Dhatu, scalp health, factors leading to hair fall (Khalitya/Palitya), and root-strengthening Ayurvedic remedies.";
  } else if (type === 'energy_booster') {
    featureContext = "Focus specifically on Ojas depletion, Prana vata, systemic fatigue (Klama), Ama accumulation blocking energy channels, and vitality restoration.";
  } else if (type === 'gut_health') {
    featureContext = "Focus specifically on Agni types (Sama, Vishama, Tikshna, Manda), gut microbiome (Grahani), digestion-related toxins (Ama), and gut-brain axis in Ayurveda.";
  } else if (type === 'liver_health') {
    featureContext = "Focus specifically on Yakrit (Liver) health, Pitta dosha excess, blood purification (Rakta Dhatu), detoxification, jaundice indicators, and herbs that cool and protect the liver like Milk Thistle (Bhumi Amla) or Kutki.";
  } else if (type === 'symptom_checker') {
    featureContext = "Deeply analyze the user's symptoms from an Ayurvedic perspective. Identify potential imbalances in Doshas (Vata/Pitta/Kapha), Agni (digestion), and Dhatus. Match the symptoms to classical Ayurvedic syndromes (Vikriti) and suggest natural pathways for balance.";
  } else if (type === 'report_analyzer') {
    featureContext = "Analyze the health report data (blood reports, lab results) or detailed symptoms provided. Translate modern medical findings into Ayurvedic terminology. Focus on Agni, Ama, and Dhatu health based on the medical readings.";
  } else if (type === 'mood_ayurveda' || type === 'stress_relief') {
    featureContext = "Focus on psychological wellness, Manas Vigyana, sattva/rajas/tamas balance, emotional resilience, and deep stress relief rituals.";
  }

  const prompt = `
    ${AI_PERSONA}
    ${getReportInstructions(planId)}
    
    PLAN TIER: ${planId.toUpperCase()}
    Analyze the user-provided inputs with extreme precision focusing on: ${featureContext}.

    User Inputs: ${JSON.stringify(inputs)}

    **GROUNDING DATA**:
    ${JSON.stringify(Object.values(AYURVEDIC_KNOWLEDGE_BASE).slice(0, 40))}

    LANGUAGE: ${language}

    GENERATE REPORT FOLLOWING THE MASTER PLAN STRUCTURE.
    Be verbose, analytical, and link every recommendation to user data in the "detailedReasoning" field.
    
    ${AI_SAFETY_RULES}
  `;

  try {
    const result = await withRetry(() => callGeminiServer(MODELS.BASIC, [{ role: 'user', parts: [{ text: prompt }] }], {
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA as any,
    }, type || 'advanced_profile'));

    const text = result.text;
    if (!result.success) throw new Error(result.error);
    if (!text) throw new Error("Empty response from Gemini");
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Advanced Profile Gemin Analysis Error:", error);
    throw error;
  }
};
