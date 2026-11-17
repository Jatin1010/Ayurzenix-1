import { useState } from 'react';
import { Sparkles, HelpCircle, Lightbulb, BookOpen, Heart, Activity, Target } from 'lucide-react';
import { BLOG_CONTENT } from '../lib/blogContent';
import { cn } from '../lib/utils';

interface FeatureBlogProps {
  featureId: string;
}

export default function FeatureBlog({ featureId }: FeatureBlogProps) {
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const content = BLOG_CONTENT[featureId]?.[lang];

  if (!content) return null;

  return (
    <div className="mt-16 pt-12 border-t border-black/5 space-y-12 pb-10 text-gray-800">
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-display font-black text-gray-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-ayur-neon" />
          {lang === 'hi' ? 'ब्लॉग और जानकारी' : 'Blog & Information'}
        </h3>
        <div className="flex gap-2 bg-gray-50 p-1 rounded-xl">
          <button 
            onClick={() => setLang('en')}
            className={cn("px-4 py-2 rounded-lg text-xs font-bold transition-all", lang === 'en' ? "bg-white shadow-sm text-ayur-neon" : "text-gray-400")}
          >
            A
          </button>
          <button 
            onClick={() => setLang('hi')}
            className={cn("px-4 py-2 rounded-lg text-xs font-bold transition-all", lang === 'hi' ? "bg-white shadow-sm text-ayur-neon" : "text-gray-400")}
          >
            अ
          </button>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-3xl font-display font-black tracking-tight text-gray-900">{content.title}</h2>
        <p className="text-sm leading-relaxed font-medium">{content.intro}</p>
        
        {content.image && (
          <div className="w-full rounded-2xl overflow-hidden mt-6 shadow-sm border border-gray-100">
            <img 
              src={content.image} 
              alt={content.title}
              className="w-full h-48 object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-display font-black tracking-tight flex items-center gap-2"><Target className="w-5 h-5 text-blue-500"/> {lang === 'hi' ? 'इसे कैसे उपयोग करें?' : 'How to Use This Feature'}</h3>
        <div className="space-y-3">
          {content.steps.map((step: string, i: number) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">{i + 1}</div>
              <p className="text-sm font-medium">{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-display font-black tracking-tight flex items-center gap-2"><Heart className="w-5 h-5 text-rose-500"/> {lang === 'hi' ? 'इसके लाभ' : 'Benefits You Get'}</h3>
        <ul className="space-y-2 pl-2">
          {content.benefits.map((b: string, i: number) => (
             <li key={i} className="flex items-start gap-2 text-sm font-medium">
               <span className="text-ayur-neon mt-0.5">🌱</span> {b}
             </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 bg-ayur-green/5 p-6 rounded-3xl border border-ayur-green/10">
        <h3 className="text-xl font-display font-black tracking-tight text-ayur-green flex items-center gap-2"><Sparkles className="w-5 h-5"/> {lang === 'hi' ? 'आयुर्वेद क्यों?' : 'Benefits of Ayurveda'}</h3>
        <p className="text-sm leading-relaxed font-medium text-ayur-green/90">{content.ayurveda}</p>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-display font-black tracking-tight flex items-center gap-2"><Activity className="w-5 h-5 text-purple-500"/> {lang === 'hi' ? 'यह अद्वितीय क्यों है?' : 'Why This Feature is Unique'}</h3>
        <p className="text-sm leading-relaxed font-medium">{content.unique}</p>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-display font-black tracking-tight flex items-center gap-2"><Lightbulb className="w-5 h-5 text-amber-500"/> {lang === 'hi' ? 'त्वरित टिप्स' : 'Quick Tips'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {content.tips.map((tip: string, i: number) => (
            <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
               <span className="text-amber-500">💡</span>
               <p className="text-xs font-bold">{tip}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-display font-black tracking-tight flex items-center gap-2"><HelpCircle className="w-5 h-5 text-gray-700"/> {lang === 'hi' ? 'अक्सर पूछे जाने वाले प्रश्न' : 'FAQs'}</h3>
        <div className="space-y-4">
          {content.faqs.map((faq: any, i: number) => (
            <div key={i} className="space-y-1 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <p className="font-black text-sm text-gray-900">Q: {faq.q}</p>
              <p className="text-xs font-medium text-gray-600">A: {faq.a}</p>
            </div>
          ))}
        </div>
      </section>
      
      <section className="space-y-4">
        <h3 className="text-xl font-display font-black tracking-tight flex items-center gap-2"><BookOpen className="w-5 h-5 text-gray-700"/> {lang === 'hi' ? 'निष्कर्ष' : 'Conclusion'}</h3>
        <p className="text-sm leading-relaxed font-bold italic border-l-4 border-ayur-neon pl-4 py-2 bg-gray-50/50 rounded-r-xl">{content.conclusion}</p>
      </section>

      <div className="pt-6 border-t border-gray-100 text-center">
        <p className="text-xs font-bold text-gray-500">
          ⚠️ {lang === 'hi' ? 'अस्वीकरण: यह सामग्री केवल सूचना के लिए है। किसी भी स्वास्थ्य स्थिति के लिए डॉक्टर से परामर्श करें।' : 'Disclaimer: This content is for informational purposes only. Consult a doctor for any health conditions.'}
        </p>
      </div>
    </div>
  );
}
