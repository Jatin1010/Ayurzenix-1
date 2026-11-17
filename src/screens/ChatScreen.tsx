import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MessageSquare, Send, Loader2, User, Bot, Sparkles, AlertCircle, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';
import LoadingYogi from '../components/LoadingYogi';
import { callGeminiServer } from '../lib/gemini';

const MODELS = {
  BASIC: 'gemini-3-flash-preview',
  COMPLEX: 'gemini-3-flash-preview'
};

const withRetry = async <T,>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> => {
  try {
    return await fn();
  } catch (error: any) {
    if (retries > 0 && (error?.status === "RESOURCE_EXHAUSTED" || error?.code === 429)) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
};

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface ChatScreenProps {
  userData?: any;
  appConfig?: any;
}

export default function ChatScreen({ userData, appConfig }: ChatScreenProps) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Namaste! 🙏 I am your Ayurvedic AI Assistant, **Ayurzenix**. How can I help you achieve balance today? ✨' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const result = await withRetry(() => callGeminiServer(MODELS.BASIC, 
        [...messages.map(m => ({ role: m.role, parts: [{ text: m.text }] })), { role: 'user', parts: [{ text: userMessage }] }],
        {
          systemInstruction: `You are Ayurzenix, a highly advanced yet friendly AI Ayurvedic Assistant. 
          
          Use your deep, expert-level Ayurvedic knowledge base to provide personalized wellness advice.
          
          CRITICAL INSTRUCTIONS & PERSONA:
          1. Act as a super helpful, caring, and knowledgeable Ayurvedic wellness coach.
          2. YOU MUST ACTIVELY PROMOTE Ayurzenix's PAID FEATURES! Whenever a user asks about hair, skin, weight, sleep, stress, future health, gut, or hormones, naturally recommend using the specific AI scan or plan feature available in the app (e.g., Face Glow Analyzer, Body Scan, Hair Fall Analyzer, Symptom Checker, etc.). Let them know these tools provide deep, personalized insights!
          3. DO NOT give complete, exhaustive plans for free in the chat. Give them a quick tip, mention doshas if appropriate, and heavily encourage them to use the app's dedicated features or "Ask Ayurzenix" for comprehensive analysis.
          4. NEVER use asterisks (*) or dashes (-) for bullet points or lists. ALWAYS use relevant emojis (🌿, ✨, 🧘, etc.).
          5. If the user asks in Hindi, respond in Hindi with appropriate emojis and Hindi tone.
          6. Provide a small disclaimer at the end about consulting doctors for medical concerns.`,
        }
      ));

      const aiText = result.text || 'I apologize, I could not process that.';
      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error. Please try again. 🛑' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-ayur-bg relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--color-ayur-green) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

      {/* Header */}
      <div className="p-5 bg-white/80 backdrop-blur-xl border-b border-gray-100 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-ayur-green to-ayur-teal rounded-2xl flex items-center justify-center text-white shadow-xl shadow-ayur-green/20">
            <Bot className="w-7 h-7" />
          </div>
          <div className="space-y-0.5">
            <h3 className="font-black text-gray-900 tracking-tight flex items-center gap-2 text-lg">
              Ayurzenix
              <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
            </h3>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full glow-indicator-teal"></span>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Always Online</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth no-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={cn(
                "flex gap-4 max-w-[92%]",
                m.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-xl",
                m.role === 'user' ? "bg-ayur-green text-white shadow-ayur-green/20" : "bg-white border border-gray-50 text-gray-400 shadow-gray-100/50"
              )}>
                {m.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className={cn(
                "p-5 rounded-[2rem] text-sm leading-relaxed shadow-xl prose prose-sm max-w-none transition-all",
                m.role === 'user' 
                  ? "bg-gradient-to-br from-ayur-green to-ayur-teal text-white rounded-tr-none shadow-ayur-green/20" 
                  : "bg-white text-gray-800 rounded-tl-none border border-gray-50 shadow-gray-100/50"
              )}>
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <div className="m-0 leading-relaxed font-medium">{children}</div>,
                    strong: ({ children }) => <strong className={m.role === 'user' ? "text-white font-black" : "text-ayur-green font-black"}>{children}</strong>,
                    ul: ({ children }) => <ul className="list-none p-0 m-0 space-y-3 mt-3">{children}</ul>,
                    li: ({ children }) => <li className="flex items-start gap-3 m-0 font-medium">{children}</li>
                  }}
                >
                  {m.text}
                </ReactMarkdown>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {loading && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4 max-w-[85%] mr-auto"
          >
            <div className="w-10 h-10 bg-white border border-gray-50 rounded-xl flex items-center justify-center text-gray-400 shadow-xl shadow-gray-100/50">
              <Bot className="w-5 h-5" />
            </div>
            <div className="bg-white border border-gray-50 p-5 rounded-[2rem] rounded-tl-none shadow-xl shadow-gray-100/50 flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-ayur-green/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 bg-ayur-green/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 bg-ayur-green/40 rounded-full animate-bounce"></span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 bg-white/80 backdrop-blur-xl border-t border-gray-100 sticky bottom-0">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto">
          <div className="relative group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Ayurzenix..."
              className="w-full pl-6 pr-16 py-5 rounded-[1.5rem] border-2 border-gray-100 bg-white focus:border-ayur-neon focus:shadow-[0_0_15px_rgba(57,255,20,0.2)] outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] disabled:opacity-50 font-bold text-gray-900 placeholder:text-gray-300"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-b from-ayur-neon to-green-500 text-black rounded-2xl disabled:opacity-50 transition-all active:translate-y-0.5 active:border-b-2 border-x-2 border-t-2 border-b-[4px] border-green-700 shadow-sm flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-[10px] text-center text-gray-400 mt-4 font-bold leading-relaxed px-4 opacity-80 italic">
            🌿 Ayurzenix provides wellness guidance based on Ayurvedic principles.
          </p>
        </form>
      </div>

    </div>
  );
}
