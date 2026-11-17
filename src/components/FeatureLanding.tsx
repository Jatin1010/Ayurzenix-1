import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { getFeatureConfig } from '../lib/features';
import { SEO } from './SEO';

export default function FeatureLanding({ featureId }: { featureId: string }) {
    const navigate = useNavigate();
    const config = getFeatureConfig(featureId);

    if (!config) return <div>Feature not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <SEO 
                title={config.title}
                description={config.subtext}
                image={config.bannerImage}
            />
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative h-80"
            >
                <img src={config.bannerImage} alt={config.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40" />
            </motion.div>

            <div className="p-6 -mt-10 bg-white rounded-t-[2.5rem] relative z-10">
                <h1 className="text-3xl font-black tracking-tight text-gray-900 mb-2">{config.headline}</h1>
                <p className="text-gray-600 mb-8">{config.subtext}</p>
                
                <div className="space-y-4 mb-8">
                    {config.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                            <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">✓</div>
                            <p className="font-bold text-gray-800">{benefit}</p>
                        </div>
                    ))}
                </div>

                <button 
                  onClick={() => navigate(`/f/${featureId}/input`)}
                  className="w-full bg-[#A259FF] text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-purple-200"
                >
                    Start Analysis
                </button>
            </div>
        </div>
    );
}
