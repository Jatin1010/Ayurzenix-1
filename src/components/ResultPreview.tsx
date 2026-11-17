import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export default function ResultPreview({ score, insight, featureId }: { score: number, insight: string, featureId: string }) {
    const navigate = useNavigate();
    return (
        <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-xl font-black text-gray-900">Result Preview</h3>
            <div className="text-4xl font-black text-[#A259FF]">{score}% Balanced</div>
            <p className="text-gray-600 blur-sm">{insight}</p>
            <button 
                onClick={() => navigate(`/paywall/${featureId}`)}
                className="w-full py-3 bg-[#A259FF] text-white rounded-xl font-bold"
            >
                Unlock Full Report →
            </button>
        </div>
    );
}
