export interface Plan {
  id: string;
  name: string;
  price: number;
  title?: string;
  description?: string;
  benefits?: string[];
  badge?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features: string[];
  isPopular?: boolean;
  title?: string;
  description?: string;
  benefits?: string[];
  badge?: string;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [];

export interface FeaturePricing {
  featureId: string;
  plans: Plan[];
}

export const FEATURES_PRICING: Record<string, FeaturePricing> = {
  'better-sleep': {
    featureId: 'better-sleep',
    plans: [
      { id: 'basic', name: 'Basic', price: 0, title: 'Standard Sleep', description: 'Essential sleep patterns.', benefits: ['Sleep Analysis', 'Basic Routine'] },
      { id: 'pro', name: 'Pro', price: 0, title: 'Deep Peace', description: 'Deep dive into sleep quality.', benefits: ['Full Analysis', 'Herb Recommendations', 'Audio Guides'], badge: 'Included' },
      { id: 'premium', name: 'Premium', price: 0, title: 'Ultimate Recovery', description: 'Full holistic sleep transformation.', benefits: ['Consultation Sync', 'All Pro Features', 'Priority Support'] }
    ]
  },
  'stress-relief': {
    featureId: 'stress-relief',
    plans: [
      { id: 'basic', name: 'Basic', price: 0, title: 'Calm Start', description: 'Identify stressors.', benefits: ['Stress Score', 'Daily Tips'] },
      { id: 'pro', name: 'Pro', price: 0, title: 'Mindful Mastery', description: 'Emotional regulation & herbs.', benefits: ['Advanced Analysis', 'Tension Release', 'Dosha Balance'], badge: 'Included' },
      { id: 'premium', name: 'Premium', price: 0, title: 'Zen Professional', description: 'Complete mental health journey.', benefits: ['Full Therapy Path', 'Emergency Support', 'Wellness Kit'] }
    ]
  },
  'hair-fall': {
    featureId: 'hair-fall',
    plans: [
      { id: 'basic', name: 'Basic', price: 0, title: 'Root Check', description: 'Basic follicle analysis.', benefits: ['Hair Type Score', 'Routine Check'] },
      { id: 'pro', name: 'Pro', price: 0, title: 'Follicle Pro', description: 'In-depth root cause search.', benefits: ['Oil Formulations', 'Anti-fall Diet', 'Scalp Care'], badge: 'Included' },
      { id: 'premium', name: 'Premium', price: 0, title: 'Growth Ultimate', description: 'Complete hair rebirth plan.', benefits: ['Growth Tracking', 'Lab Sync', 'Premium Consultation'] }
    ]
  },
  'weight-loss': {
    featureId: 'weight-loss',
    plans: [
      { id: 'basic', name: 'Basic', price: 0, title: 'Metabolism basics', description: 'Goal setting & weight stats.', benefits: ['BMI Check', 'Agni Score'] },
      { id: 'pro', name: 'Pro', price: 0, title: 'Fat Burn Pro', description: 'Personalized detox & diet.', benefits: ['Meal Plans', 'Detox Routine', 'Calorie Guide'], badge: 'Included' },
      { id: 'premium', name: 'Premium', price: 0, title: 'Total Body Shift', description: 'Genetic & metabolic reset.', benefits: ['Weight Tracking', 'Coach Access', 'Supplements Guide'] }
    ]
  },
  'hormonal-balance': {
    featureId: 'hormonal-balance',
    plans: [
      { id: 'basic', name: 'Basic', price: 0, title: 'Hormone Intro', description: 'Basic cycle/mood check.', benefits: ['Balance Score', 'Basic Hygiene'] },
      { id: 'pro', name: 'Pro', price: 0, title: 'Endocrine Pro', description: 'Detailed hormonal triggers.', benefits: ['Cycle Tracking', 'PMS Support', 'Herbal Support'], badge: 'Included' },
      { id: 'premium', name: 'Premium', price: 0, title: 'Vital Balance', description: 'Ultimate female health path.', benefits: ['PCOS Support', 'Family Planning', 'Lab Reviews'] }
    ]
  },
  'gut-health': {
    featureId: 'gut-health',
    plans: [
      { id: 'basic', name: 'Basic', price: 0, title: 'Digestion Intro', description: 'Basic Agni assessment.', benefits: ['Bloating Check', 'Diet Tips'] },
      { id: 'pro', name: 'Pro', price: 0, title: 'Gut Master', description: 'Intestinal flora & detox.', benefits: ['Probiotic Guide', 'Deep Detox', 'Food Lists'], badge: 'Included' },
      { id: 'premium', name: 'Premium', price: 0, title: 'Microbiome Max', description: 'Full metabolic gut reset.', benefits: ['Total Reset', 'Custom Tonics', 'Weekly Progress'] }
    ]
  },
  'liver-health': {
    featureId: 'liver-health',
    plans: [
      { id: 'basic', name: 'Basic', price: 0, title: 'Pitta Check', description: 'Basic liver heat score.', benefits: ['Liver Status', 'Cooling Foods'] },
      { id: 'pro', name: 'Pro', price: 0, title: 'Detox Pro', description: 'In-depth detox protocols.', benefits: ['Liver Cleanse', 'Advanced Diet', 'Meditation'], badge: 'Included' },
      { id: 'premium', name: 'Premium', price: 0, title: 'Hepatix Ultimate', description: 'Total liver regeneration.', benefits: ['Regen Tracking', 'Special Supplements', 'Lab Guidance'] }
    ]
  },
  'face-glow': {
    featureId: 'face-glow',
    plans: [
      { id: 'basic', name: 'Basic', price: 0, title: 'Skin Pulse', description: 'Face type and simple routine.', benefits: ['Type Analysis', 'Simple Cleansers'] },
      { id: 'pro', name: 'Pro', price: 0, title: 'Aura Glow', description: 'Deeper skin tissue healing.', benefits: ['Face Yoga', 'Natural Masks', 'Blood Purifiers'], badge: 'Included' },
      { id: 'premium', name: 'Premium', price: 0, title: 'Eternal Youth', description: 'Ayurvedic anti-aging secrets.', benefits: ['Anti-aging Path', 'Custom Creams', 'Derm Access'] }
    ]
  },
  'symptom-checker': {
    featureId: 'symptom-checker',
    plans: [
      { id: 'basic', name: 'Basic', price: 0, title: 'Symptom Intro', description: 'Dosha imbalance check.', benefits: ['Dosha Score', 'Quick Relief'] },
      { id: 'pro', name: 'Pro', price: 0, title: 'Diagnostic Plus', description: 'Deep root cause analysis.', benefits: ['Root Cause Find', 'Herbal Meds', 'Precautions'], badge: 'Included' },
      { id: 'premium', name: 'Premium', price: 0, title: 'Immunity Shield', description: 'Full recovery & immunity.', benefits: ['Full Recovery', 'Direct Consult', 'Report Link'] }
    ]
  },
  'report_analyzer': {
    featureId: 'report_analyzer',
    plans: [
      { id: 'basic', name: 'Basic', price: 0, title: 'Scan Lite', description: 'AI summary of lab values.', benefits: ['Report Summary', 'Risk Flags'] },
      { id: 'pro', name: 'Pro', price: 0, title: 'Smart Insights', description: 'Expert explanations for values.', benefits: ['Value Explainer', 'Next Steps', 'Comparison'], badge: 'Included' },
      { id: 'premium', name: 'Premium', price: 0, title: 'Med-Expert Pro', description: 'Full AI MD plus Ayurveda.', benefits: ['Complete Review', 'Doc Consultation', 'Long-term Plan'] }
    ]
  },
  'health-scan': {
    featureId: 'health-scan',
    plans: [
      { id: 'basic', name: 'Basic', price: 0, title: 'Body Overview', description: '360° health baseline.', benefits: ['Organ Score', 'Energy Index'] },
      { id: 'pro', name: 'Pro', price: 0, title: 'Vitals Plus', description: 'Holistic vitals mapping.', benefits: ['Full Mapping', 'Risk Alerts', 'Yoga Plan'], badge: 'Included' },
      { id: 'premium', name: 'Premium', price: 0, title: 'Bio-Balance Max', description: 'Complete longevity scan.', benefits: ['Cellular Check', 'Longevity Plan', 'Family Health'] }
    ]
  },
  'body-scan': {
    featureId: 'body-scan',
    plans: [
      { id: 'basic', name: 'Basic', price: 0, title: 'Visual Pulse', description: 'Basic tongue & eye scan.', benefits: ['Visual Score', 'Daily Routine'] },
      { id: 'pro', name: 'Pro', price: 0, title: 'Anatomy Pro', description: 'Deep musculoskeletal analysis.', benefits: ['Deep Analysis', 'Corrective Yoga', 'Diet Reset'], badge: 'Included' },
      { id: 'premium', name: 'Premium', price: 0, title: 'Avatar Health', description: 'Precision physical transform.', benefits: ['3D Scan Sync', 'Physio Access', 'Elite Guide'] }
    ]
  },
  'future-health': {
    featureId: 'future-health',
    plans: [
      { id: 'basic', name: 'Basic', price: 0, title: 'Vision 2030', description: '10-year risk profile.', benefits: ['Life Expectancy', 'Risk Signs'] },
      { id: 'pro', name: 'Pro', price: 0, title: 'Timeline Pro', description: 'Predictive health trends.', benefits: ['Trend Analysis', 'Prevention Map', 'Trend Sync'], badge: 'Included' },
      { id: 'premium', name: 'Premium', price: 0, title: 'Legacy Shield', description: 'Centenarian lifestyle path.', benefits: ['Anti-ailment Plan', 'Priority Research', 'Family Risks'] }
    ]
  },
  'energy-booster': {
    featureId: 'energy-booster',
    plans: [
      { id: 'basic', name: 'Basic', price: 0, title: 'Stamina Intro', description: 'Daily energy mapping.', benefits: ['Stamina Score', 'Power Foods'] },
      { id: 'pro', name: 'Pro', price: 0, title: 'Ojas Mastery', description: 'Deep vitality & immunity.', benefits: ['Ojas Analysis', 'Sleep & Herbs', 'Pranayama'], badge: 'Included' },
      { id: 'premium', name: 'Premium', price: 0, title: 'Vigor Unlimited', description: 'Elite strength & mental sharp.', benefits: ['Strength Guide', 'Direct Trainer', 'Supplement Kit'] }
    ]
  },
  'heart-health': {
    featureId: 'heart-health',
    plans: [
      { 
        id: 'basic', 
        name: 'Basic', 
        price: 0, 
        title: 'Heart Pulse', 
        description: 'Basic risk score & 1-line insight.', 
        benefits: ['Heart Risk Score', 'Basic Risk Level', '2 Home Remedies', 'General Tips'] 
      },
      { 
        id: 'pro', 
        name: 'Pro', 
        price: 0, 
        title: 'Hridaya Master', 
        description: 'Detailed analysis & 7-day plan.', 
        benefits: ['Detailed Risk Breakdown', 'Dosha Root Cause', '5 Home Remedies', '7-Day Improvement Plan'],
        badge: 'Included' 
      },
      { 
        id: 'premium', 
        name: 'Premium', 
        price: 0, 
        title: 'Eternal Heart', 
        description: 'Elite protocol & 360° health.', 
        benefits: ['Everything in Pro', 'Herbal Protocol (Arjuna)', 'Daily Routine Plan', 'Priority AI Chat'],
        badge: 'Included' 
      }
    ]
  },
  'smart-mental-scan': {
    featureId: 'smart-mental-scan',
    plans: [
      { id: 'basic', name: 'Basic', price: 0, title: 'Mind Pulse', description: 'Mental clarity score.', benefits: ['Resilience Score', 'Daily Vibe'] },
      { id: 'pro', name: 'Pro', price: 0, title: 'Mental Mastery', description: 'Deep psychological report.', benefits: ['Guna Analysis', 'Mantra Ritual', 'Full Report'], badge: 'Included' },
      { id: 'premium', name: 'Premium', price: 0, title: 'Sattva Shield', description: 'Ultimate mental transformation.', benefits: ['Consultation Sync', '30 Day Protocol', 'Priority Support'] }
    ]
  },
  'mood-ayurveda': {
    featureId: 'mood-ayurveda',
    plans: [
      { id: 'basic', name: 'Basic', price: 0, title: 'Mood Pulse', description: 'Immediate state analysis.', benefits: ['Current Guna', 'Quick Tip'] },
      { id: 'pro', name: 'Pro', price: 0, title: 'Emotional Balance', description: 'Deeper emotional roots.', benefits: ['Deep Roots', 'Herbal Support', 'Mantra Set'], badge: 'Included' },
      { id: 'premium', name: 'Premium', price: 0, title: 'Total Harmony', description: 'Complete mental reset.', benefits: ['30 Day Path', 'Full Rituals', 'Expert Sync'] }
    ]
  }
};

export const getFeaturePricing = (featureId: string, appConfig?: any): FeaturePricing => {
  const staticPricing = FEATURES_PRICING[featureId] || {
    featureId,
    plans: [
      { id: 'basic', name: 'Basic', price: 0, title: 'Basic Analysis', description: 'Essential insights for your health markers.', benefits: ['Core Analysis', 'Basic Routine'] },
      { id: 'pro', name: 'Pro', price: 49, title: 'Pro Intelligence', description: 'Deep dive into root causes and herbs.', benefits: ['Advanced Analysis', 'Personalized Herbs', 'Priority Support'], badge: 'Most Popular' },
      { id: 'premium', name: 'Premium', price: 99, title: 'Elite Shield', description: 'Complete wellness transformation path.', benefits: ['Unlimited Access', 'Expert Consultation', 'Family History'] }
    ]
  };

  // Enforce fallback prices if static prices are 0
  staticPricing.plans = staticPricing.plans.map(p => {
    if (p.price === 0) {
      if (p.id === 'pro') return { ...p, price: 49 };
      if (p.id === 'premium') return { ...p, price: 99 };
    }
    return p;
  });

  // Convert hyphens to underscores for back-compat if needed, though FEATURE_LIST uses underscores
  const configKey = featureId.replace(/-/g, '_');
  const customPrices = appConfig?.prices?.[configKey];

  if (customPrices) {
    if (typeof customPrices === 'object') {
      return {
        ...staticPricing,
        plans: staticPricing.plans.map(p => ({
          ...p,
          price: customPrices[p.id] !== undefined ? customPrices[p.id] : p.price
        }))
      };
    } else if (typeof customPrices === 'number') {
      // Legacy support: mapping single price to 'pro' tier
      return {
        ...staticPricing,
        plans: staticPricing.plans.map(p => ({
          ...p,
          price: p.id === 'pro' ? customPrices : (p.id === 'basic' ? 0 : p.price)
        }))
      };
    }
  }

  return staticPricing;
};

export const getPlanPrice = (featureId: string, planId: string, appConfig?: any): number => {
  const pricing = getFeaturePricing(featureId, appConfig);
  if (!pricing.plans || pricing.plans.length === 0) return 0;
  const plan = pricing.plans.find(p => p.id === planId);
  return plan ? plan.price : pricing.plans[0].price;
};
