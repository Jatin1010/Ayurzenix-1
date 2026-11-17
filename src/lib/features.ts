export interface FeatureConfig {
  id: string;
  title: string;
  headline: string;
  subtext: string;
  benefits: string[];
  theme: {
    primary: string;
    secondary: string;
  };
  bannerImage: string;
}

export const FEATURES: Record<string, FeatureConfig> = {
    "face-glow": {
        id: "face-glow",
        title: "Face Glow Analyzer",
        headline: "Discover Your Skin's Radiance",
        subtext: "Personalized AI Skin Analysis & Ayurvedic Remedies to reveal your natural glow.",
        benefits: ["AI Skin Analysis", "Personalized Remedies", "Ayurvedic Routine"],
        theme: {
            primary: "#EC4899",
            secondary: "#FBCFE8"
        },
        bannerImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0a?q=80&w=2000&auto=format&fit=crop"
    },
    "better-sleep": {
        id: "better-sleep",
        title: "Better Sleep",
        headline: "Deep Peace & Recovery",
        subtext: "Deep dive into sleep quality with personalized insights.",
        benefits: ["Sleep Analysis", "Herb Recommendations", "Audio Guides"],
        theme: {
            primary: "#6366f1",
            secondary: "#e0e7ff"
        },
        bannerImage: "https://images.unsplash.com/photo-1541480601022-7707c83b22d6?q=80&w=2000&auto=format&fit=crop"
    }
    // Add other features dynamically following this structure
};

export const getFeatureConfig = (featureId: string): FeatureConfig | undefined => {
  return FEATURES[featureId];
};
