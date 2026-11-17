import axios from 'axios';
// Imports removed
import { callGeminiServer } from "../lib/gemini";

// Use consistent model names across the engine
const MODELS = {
  BASIC: 'gemini-1.5-flash',
  COMPLEX: 'gemini-1.5-flash' 
};

export async function checkSymptoms(userSymptomsInput: string | { id: string, severity: string }[], planId: string = 'basic') {
  // Format symptoms into a descriptive string for the AI
  let symptomsString = '';
  if (Array.isArray(userSymptomsInput)) {
    symptomsString = userSymptomsInput
      .map(s => {
        // Use the ID as label, replace underscore and capitalize for readability
        const label = s.id.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        return `${label} (${s.severity})`;
      })
      .join(', ');
  } else {
    symptomsString = userSymptomsInput;
  }

  const planInstructions = {
    basic: "TIER: BASIC. Provide essential summary metrics (Wellness Score, Dominant Dosha, Root Cause, 1 Insight, 1 Home Remedy, 1 Lifestyle Tip). Style with Electric Purple (#A259FF) and Vivid Teal (#00BFA6).",
    pro: "TIER: PRO. Provide EVERYTHING in BASIC plus: Full Analysis (Dashboard, Mental, Diet, Routine, Herbs, Medicines, Yoga, Therapies, 7-Day Plan, Triggers, Products). Style with Electric Purple (#A259FF), Vivid Teal (#00BFA6), Warm Coral (#FF6B6B), and Amber Yellow (#FFB400).",
    premium: "TIER: PREMIUM. Provide EVERYTHING in PRO (which includes Basic) plus: Advanced Intelligence (Dhatu impact, Therapy Sequences, 30-Day Plan, Future Risks). Style with the full color suite: Electric Purple (#A259FF), Vivid Teal (#00BFA6), Warm Coral (#FF6B6B), Amber Yellow (#FFB400), and Royal Azure (#006BDF)."
  }[planId as any] || "";

  const prompt = `
    You are an AI Ayurvedic Health Advisor for the Ayurzenix app.
    PLAN TIER: ${planId.toUpperCase()} - ${planInstructions}
    Based on the following user-provided symptoms (and their severities), match relevant Ayurvedic conditions from our database and provide wellness recommendations.
    
    IMPORTANT: Symptoms marked as "severe" or "high" are urgent markers of high Dosha vitiation. Prioritize these in your analysis.

    **USER SYMPTOMS**: "${symptomsString}"

    **AYURVEDIC KNOWLEDGE**:
    Use your deep, expert-level clinical knowledge base to conduct this analysis.

    **INSTRUCTIONS**:
    1. Match the symptoms to the most relevant Ayurvedic condition(s). Give preference to the most clinically proven Ayurvedic approaches.
    2. Explain possible wellness concerns.
    3. Recommend specific Ayurvedic herbs.
    4. Recommend specific Yoga poses.
    5. **CRITICAL**: If the severity is "High" or the user symptoms sound urgent, suggest consulting a professional doctor immediately.
    6. **IMPORTANT**: State clearly that this is NOT a medical diagnosis, but a wellness suggestion based on Ayurveda.
  `;

  try {
    const result = await callGeminiServer(MODELS.BASIC, [{ role: 'user', parts: [{ text: prompt }] }], {
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          matches: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ayurvedicName: { type: "string" },
                modernEquivalent: { type: "string" },
                relevance: { type: "string" }
              },
              required: ["ayurvedicName", "modernEquivalent", "relevance"]
            }
          },
          wellnessConcerns: { type: "string" },
          detailedReasoning: { type: "string", description: "Detailed Ayurvedic logic connecting symptoms to the imbalance." },
          herbs: { type: "array", items: { type: "string" } },
          yoga: { type: "array", items: { type: "string" } },
          seriousAlert: { type: "boolean" },
          disclaimer: { type: "string" }
        },
        required: ["matches", "wellnessConcerns", "detailedReasoning", "herbs", "yoga", "seriousAlert", "disclaimer"]
      }
    }, 'symptom_checker');

    if (!result.text) {
      throw new Error("No response text received from Gemini");
    }

    return JSON.parse(result.text);
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to analyze symptoms. Please try again later.");
  }
}

export async function getSeasonalRecommendations(ritu: string, language: string = 'English') {
  const prompt = `
    You are an Ayurvedic Expert for Ayurzenix.
    The current season is "${ritu}" (Ayurvedic Ritucharya).
    
    Provide a specific list of:
    1. Diet recommendations (Ahar)
    2. Lifestyle habits (Vihar)
    3. Herbs to favor
    4. Simple explanation of what happens to Doshas in this season.
    
    Output in ${language} language.
    Respond in JSON format with properties: seasonName, doshaEffect, diet, lifestyle, herbs.
  `;

  try {
    const result = await callGeminiServer(MODELS.BASIC, [{ role: 'user', parts: [{ text: prompt }] }], {
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          seasonName: { type: "string" },
          doshaEffect: { type: "string" },
          diet: { type: "array", items: { type: "string" } },
          lifestyle: { type: "array", items: { type: "string" } },
          herbs: { type: "array", items: { type: "string" } },
          reasoning: { type: "string" }
        },
        required: ["seasonName", "doshaEffect", "diet", "lifestyle", "herbs", "reasoning"]
      }
    }, 'seasonal_recommendations');

    if (!result.text) {
      throw new Error("No response text received from Gemini");
    }

    return JSON.parse(result.text);
  } catch (error: any) {
    console.error("Gemini Seasonal Alert Error:", error);
    // Fallback static data if AI fails
    return {
      seasonName: ritu,
      doshaEffect: "Seasonal transitions affect your biological humors.",
      diet: ["Eat fresh, seasonal fruits", "Stay hydrated"],
      lifestyle: ["Maintain a regular sleep schedule", "Practice mild exercise"],
      herbs: ["Amla", "Tulsi"]
    };
  }
}

export async function analyzeAgni(inputs: any, language: string = 'English', planId: string = 'basic') {
  const planInstructions = {
    basic: "TIER: BASIC (FREE). Provide ONLY: Agni Type, overall scores, and personalizedInsightSummary (short). OMIT all other detailed analysis fields like routine, herbs, diet roadmap etc.",
    pro: "TIER: PRO. Provide Full Detailed Analysis except advanced 30-day roadmap.",
    premium: "TIER: PREMIUM. Provide absolute depth including everything in Pro plus transformation rituals."
  }[planId as any] || "";

  const prompt = `
    You are the "Agni Engine" (Metabolic Fire Master) of the Ayurzenix ecosystem.
    PLAN TIER: ${planId.toUpperCase()} - ${planInstructions}
    Your task is to provide a premium, deep-insight Ayurvedic analysis of the user's metabolic fire (Agni) based on their inputs.

    **USER INPUTS**:
    ${JSON.stringify(inputs, null, 2)}

    **INSTRUCTIONS**:
    1. Identify the specific Agni type: Samagni (Balanced), Vishamagni (Irregular - Vata), Tikshnagni (Sharp/Acidic - Pitta), or Mandagni (Slow - Kapha).
    2. Provide a 13-point analysis strictly following this structure:
       - personalizedInsightSummary: Human-like, warm, and professional.
       - dominantDoshaAnalysis: Vata/Pitta/Kapha breakdown.
       - imbalanceDetection: Vikriti markers.
       - rootCauseExplanation: Ancient + Modern perspective.
       - recommendedRemedies: Nuskha.
       - dietRecommendations: Ahara.
       - foodsToAvoid: Pathya-Apathya.
       - dailyRoutine: Dinacharya.
       - yogaMeditation: Sadhana.
       - sleepStressGuidance: Nidra & Manas.
       - hydrationDetox: Shodhana.
       - herbalSuggestions: Aushadhi.
       - motivationalMessage: Ayurzenix brand message.

    3. Also include scores (0-100):
       - energyScore
       - digestiveBalanceScore
       - amaLevel (Toxin level)

    **STYLE**:
    - Futuristic, Premium, Spiritual-Modern.
    - Emotional Intelligence: Connect with the user.
    - Avoid medical diagnosis. Use "Your markers reflect an imbalance in...".
  `;

  try {
    const result = await callGeminiServer(MODELS.BASIC, [{ role: 'user', parts: [{ text: prompt }] }], {
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          agniType: { type: "string" },
          analysis: {
            type: "object",
            properties: {
              personalizedInsightSummary: { type: "string" },
              dominantDoshaAnalysis: { type: "string" },
              imbalanceDetection: { type: "string" },
              rootCauseExplanation: { type: "string" },
              recommendedRemedies: { type: "string" },
              dietRecommendations: { type: "string" },
              foodsToAvoid: { type: "string" },
              dailyRoutine: { type: "string" },
              yogaMeditation: { type: "string" },
              sleepStressGuidance: { type: "string" },
              hydrationDetox: { type: "string" },
              herbalSuggestions: { type: "string" },
              motivationalMessage: { type: "string" }
            },
            required: [
              "personalizedInsightSummary", "dominantDoshaAnalysis", "imbalanceDetection", 
              "rootCauseExplanation", "recommendedRemedies", "dietRecommendations", 
              "foodsToAvoid", "dailyRoutine", "yogaMeditation", "sleepStressGuidance", 
              "hydrationDetox", "herbalSuggestions", "motivationalMessage"
            ]
          },
          scores: {
            type: "object",
            properties: {
              energyScore: { type: "number" },
              digestiveBalanceScore: { type: "number" },
              amaLevel: { type: "number" }
            },
            required: ["energyScore", "digestiveBalanceScore", "amaLevel"]
          }
        },
        required: ["agniType", "analysis", "scores"]
      }
    }, 'agni_engine');

    if (!result.text) throw new Error("AI analysis failed");
    return JSON.parse(result.text);
  } catch (error) {
    console.error("Agni Engine Analysis Error:", error);
    throw error;
  }
}

export async function analyzeFoodCompatibility(imageData: string, userPrakriti: string) {
  const prompt = `
    You are the "Aahar Vision Engine" of the Ayurzenix app.
    The user has shared a photo of their food plate.
    The user's dominant Dosha (Prakriti) is "${userPrakriti || 'Unknown'}".

    **INSTRUCTIONS**:
    1. Identify the food items in the image.
    2. Calculate a "Compatibility Score" (0-100) based on how well this meal suits the user's Prakriti.
       - If Prakriti is unknown, give a general healthy eating score.
    3. Provide "Ayurvedic Insights" (Dosha impact).
    4. Provide "Actionable Advice" (e.g., "Add ghee to balance Vata", "Avoid extra spice for your Pitta").
    5. Follow the Ayurzenix premium voice: Futuristic, Premium, and Warm.

    **OUTPUT FORMAT (JSON)**:
    {
      "dishName": "Name of the dishes identified",
      "compatibilityScore": 85,
      "prakritiImpact": "How it affects Vata/Pitta/Kapha",
      "insights": "Detailed Ayurvedic logic",
      "tips": ["Tip 1", "Tip 2"],
      "message": "A warm brand message from Ayurzenix"
    }
  `;

  try {
    const result = await callGeminiServer(MODELS.BASIC, [
      {
        role: 'user',
        parts: [
          { text: prompt },
          { inlineData: { mimeType: "image/jpeg", data: imageData } }
        ]
      }
    ], {
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          dishName: { type: "string" },
          compatibilityScore: { type: "number" },
          prakritiImpact: { type: "string" },
          insights: { type: "string" },
          tips: { type: "array", items: { type: "string" } },
          message: { type: "string" }
        },
        required: ["dishName", "compatibilityScore", "prakritiImpact", "insights", "tips", "message"]
      }
    }, 'aahar_vision');

    if (!result.text) throw new Error("Food analysis failed");
    return JSON.parse(result.text);
  } catch (error) {
    console.error("Food Scanner Error:", error);
    throw error;
  }
}

export async function analyzeMentalIntelligence(inputs: any, language: string = 'English') {
  const prompt = `
    You are the "Manas Intelligence Engine" (Ayurvedic Mental Health Master) of the Ayurzenix app.
    Your task is to provide a premium, deep-insight analysis of the user's emotional and mental state based on their inputs.

    **USER INPUTS**:
    ${JSON.stringify(inputs, null, 2)}

    **INSTRUCTIONS**:
    1. Calculate an "overallScore" (0-100) representing mental resilience.
    2. Analyze the Guna balance (Sattva, Rajas, Tamas) - should sum to 100.
    3. Identify the "rootCause" of current mental stress from an Ayurvedic perspective (Pragya-aparadha, etc.).
    4. Provide "metrics" (0-100) for: stressScore, anxietyLoad, emotionalStability, mentalResilience, nervousSystemBalance, sleepRecoveryScore, burnoutRisk, emotionalEnergy.
    5. Provide 3-5 "deepInsights" about their mental patterns.
    6. Provide "recommendations" including:
       - mantra: A specific Sanskrit/Universal mantra for their state.
       - pranayama: List of breathing exercises.
       - diet: Mental-health-focus foods.
       - lifestyle: Daily rhythm adjustments.
    7. Provide a 7-day "protocol" (array of {day: number, focus: string, task: string}).
    8. Provide a 4-week "transformationroadmap" (array of {week: number, focus: string, outcome: string}).
    9. Include a "disclaimer" and "planId" (default 'pro').

    **STYLE**:
    - Futuristic, Premium, and Warm.
    - Deeply Ayurvedic yet medically modern.
    - Output in ${language}.
  `;

  try {
    const result = await callGeminiServer(MODELS.BASIC, [{ role: 'user', parts: [{ text: prompt }] }], {
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          overallScore: { type: "number" },
          gunaBalance: {
             type: "object",
             properties: {
                sattva: { type: "number" },
                rajas: { type: "number" },
                tamas: { type: "number" }
             },
             required: ["sattva", "rajas", "tamas"]
          },
          rootCause: { type: "string" },
          metrics: {
             type: "object",
             properties: {
                stressScore: { type: "number" },
                anxietyLoad: { type: "number" },
                emotionalStability: { type: "number" },
                mentalResilience: { type: "number" },
                nervousSystemBalance: { type: "number" },
                sleepRecoveryScore: { type: "number" },
                burnoutRisk: { type: "number" },
                emotionalEnergy: { type: "number" }
             },
             required: ["stressScore", "anxietyLoad", "emotionalStability", "mentalResilience", "nervousSystemBalance", "sleepRecoveryScore", "burnoutRisk", "emotionalEnergy"]
          },
          deepInsights: { type: "array", items: { type: "string" } },
          recommendations: {
             type: "object",
             properties: {
                mantra: { type: "string" },
                pranayama: { type: "array", items: { type: "string" } },
                diet: { type: "array", items: { type: "string" } },
                lifestyle: { type: "array", items: { type: "string" } }
             },
             required: ["mantra", "pranayama", "diet", "lifestyle"]
          },
          protocol: {
             type: "array",
             items: {
                type: "object",
                properties: {
                   day: { type: "number" },
                   focus: { type: "string" },
                   task: { type: "string" }
                },
                required: ["day", "focus", "task"]
             }
          },
          transformationroadmap: {
             type: "array",
             items: {
                type: "object",
                properties: {
                   week: { type: "number" },
                   focus: { type: "string" },
                   outcome: { type: "string" }
                },
                required: ["week", "focus", "outcome"]
             }
          },
          disclaimer: { type: "string" }
        },
        required: [
           "overallScore", "gunaBalance", "rootCause", "metrics", "deepInsights", 
           "recommendations", "protocol", "transformationroadmap", "disclaimer"
        ]
      }
    }, 'mental_health_analysis');

    if (!result.text) throw new Error("Mental health analysis failed");
    return JSON.parse(result.text);
  } catch (err) {
    console.error("Mental Health Analysis Error:", err);
    throw err;
  }
}
