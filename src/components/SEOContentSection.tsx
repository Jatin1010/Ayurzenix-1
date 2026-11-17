import React from 'react';
import { Sparkles, HelpCircle, Lightbulb, Heart, Target, ShieldCheck, Zap } from 'lucide-react';

interface SEOProps {
  content: any;
}

export default function SEOContentSection({ content }: SEOProps) {
  if (!content) return null;

  return (
    <div className="mt-16 space-y-12 pb-16">
      {/* Intro */}
      <section className="space-y-4">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-tight">
          {content.title}
        </h2>
        <p className="text-base text-gray-600 leading-relaxed font-medium">
          {content.introduction}
        </p>
      </section>

      {/* How to Use */}
      <section className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-sm space-y-6">
        <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">
            <Target className="w-5 h-5" />
          </div>
          How to Use This Feature
        </h3>
        <div className="space-y-4">
          {content.howToUse.map((step: string, i: number) => (
            <div key={i} className="flex gap-4">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white text-[10px] font-black flex items-center justify-center mt-1">
                {i + 1}
              </div>
              <p className="text-sm font-bold text-gray-700 leading-relaxed">{step}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="space-y-6">
        <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
          <div className="w-10 h-10 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500">
            <Heart className="w-5 h-5" />
          </div>
          Benefits You Get
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {content.benefits.map((ben: string, i: number) => (
            <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-black/5 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-ayur-neon shrink-0" />
              <span className="text-sm font-bold text-gray-700">{ben}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Ayurveda Wisdom */}
      <section className="bg-ayur-neon/5 p-8 rounded-[2.5rem] border border-ayur-neon/20 space-y-4">
        <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
          <div className="w-10 h-10 bg-ayur-neon/20 rounded-2xl flex items-center justify-center text-ayur-neon">
            <Sparkles className="w-5 h-5" />
          </div>
          Benefits of Ayurveda
        </h3>
        <p className="text-sm text-gray-700 leading-relaxed font-bold">
          {content.ayurvedicWisdom}
        </p>
      </section>

      {/* Uniqueness */}
      <section className="space-y-4">
        <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500">
            <Zap className="w-5 h-5" />
          </div>
          Why This Feature is Unique
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed font-medium bg-gray-50 p-6 rounded-3xl border border-black/5">
          {content.uniqueness}
        </p>
      </section>

      {/* Quick Tips */}
      <section className="space-y-6">
        <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500">
            <Lightbulb className="w-5 h-5" />
          </div>
          Quick Tips Section
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {content.quickTips.map((tip: string, i: number) => (
            <div key={i} className="flex items-center gap-4 p-5 bg-white rounded-[1.5rem] border border-black/5 shadow-sm group hover:border-ayur-neon transition-all">
              <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
                <Lightbulb className="w-4 h-4" />
              </div>
              <p className="text-xs font-black text-gray-900 uppercase tracking-wide leading-tight">{tip}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="space-y-6">
        <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-500">
            <HelpCircle className="w-5 h-5" />
          </div>
          FAQs
        </h3>
        <div className="space-y-4">
          {content.faqs.map((faq: any, i: number) => (
            <div key={i} className="p-6 bg-white rounded-[2rem] border border-black/5 shadow-sm space-y-2">
              <p className="text-sm font-black text-gray-900 leading-tight">Q: {faq.q}</p>
              <p className="text-[11px] font-bold text-gray-500 leading-relaxed uppercase tracking-wider bg-gray-50 p-3 rounded-xl border border-black/5">
                A: {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Conclusion */}
      <div className="pt-12 border-t border-black/5 text-center space-y-4">
        <div className="w-12 h-12 bg-ayur-neon/10 rounded-2xl flex items-center justify-center text-ayur-neon mx-auto">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <p className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] max-w-xs mx-auto">
          Trust Ayurzenix for Natural Health Recovery
        </p>
      </div>
    </div>
  );
}
