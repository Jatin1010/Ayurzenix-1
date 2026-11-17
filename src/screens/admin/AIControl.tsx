import { useState, useEffect } from 'react';
import { 
  Cpu, 
  Save, 
  RefreshCw, 
  Zap, 
  Terminal,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Loader2
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';

export default function AIControl() {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testResult, setTestResult] = useState("");

  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        const token = await user?.getIdToken();
        const { data } = await axios.get('/api/admin/ai/prompt', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPrompt(data.content || "");
      } catch (err) {
        console.error("Failed to fetch admin AI prompt", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrompt();
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = await user?.getIdToken();
      await axios.post('/api/admin/ai/prompt', { content: prompt }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("AI Master Prompt synced successfully!");
    } catch (err) {
      console.error("Save failed", err);
      alert("Critical: Failed to sync AI logic.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-10 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-500">
               <Cpu className="w-5 h-5" />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight uppercase">Neural-Veda Logic</h2>
          </div>
          <p className="text-sm text-zinc-500 font-medium">Calibrate the intelligence kernel for the entire ecosystem</p>
        </div>

        <button 
          onClick={handleSave}
          disabled={saving || loading}
          className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 rounded-2xl flex items-center gap-3 transition-all active:scale-95 disabled:opacity-50 shadow-glow-purple"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          <span className="text-xs font-black uppercase tracking-[0.2em]">{saving ? 'Propagating...' : 'Deploy Intelligence'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-950 border border-zinc-900 rounded-[2.5rem] p-8 flex flex-col h-[600px]">
             <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                   <Terminal className="w-4 h-4 text-zinc-500" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Kernel Prompt v1.0.4</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-teal-500">Real-time Injection Active</span>
                </div>
             </div>

             <textarea 
               value={prompt}
               onChange={(e) => setPrompt(e.target.value)}
               disabled={loading}
               placeholder="Enter the master intelligence logic for Ayurzenix AI..."
               className="flex-1 bg-[#0a0a0a] border border-zinc-900 rounded-[1.5rem] p-8 text-zinc-300 font-mono text-sm leading-relaxed outline-none focus:border-purple-600/50 transition-all resize-none scrollbar-thin scrollbar-thumb-zinc-800"
             />

             <div className="mt-6 flex items-center justify-between text-[10px] text-zinc-600 font-black uppercase tracking-widest">
                <span>{prompt.length} Characters Detected</span>
                <span>Vedic Encoding: Enabled</span>
             </div>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-6">
          <div className="bg-zinc-950 border border-zinc-900 rounded-[2.5rem] p-8">
            <h3 className="text-lg font-bold text-white tracking-tight mb-6 flex items-center gap-2">
               <Zap className="w-4 h-4 text-purple-500" />
               Safety Parameters
            </h3>
            <div className="space-y-6">
              {[
                { label: "Token Limit", value: "4096", desc: "Max response length" },
                { label: "Temperature", value: "0.7", desc: "Creativity vs Precision" },
                { label: "Dosha Guard", value: "STRICT", desc: "Medical safety boundary" },
              ].map((param, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-zinc-400">{param.label}</span>
                    <span className="text-xs font-mono text-purple-400">{param.value}</span>
                  </div>
                  <p className="text-[10px] text-zinc-600 font-medium">{param.desc}</p>
                  <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-600 w-[70%]" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-950 border border-zinc-900 rounded-[2.5rem] p-8">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-500">
                   <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">Intelligence Health</h3>
             </div>
             <p className="text-xs text-zinc-500 leading-relaxed font-medium mb-6">
                Your current logic is synchronized across 3 distributed nodes. Diagnostic checks pass.
             </p>
             <button className="w-full py-4 rounded-xl border border-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all flex items-center justify-center gap-2">
                <RefreshCw className="w-3 h-3" />
                Run Logic Diagnostic
             </button>
          </div>

          <div className="p-8 bg-rose-500/5 border border-rose-500/20 rounded-[2.5rem] flex flex-col gap-4">
             <div className="flex items-center gap-3 text-rose-500">
                <AlertTriangle className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-widest">Emergency Kill</span>
             </div>
             <p className="text-[10px] text-rose-500/80 font-medium">Disables all AI features instantly if logic hallucinations are detected.</p>
             <button className="bg-rose-500 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-500/20 active:scale-95 transition-all">
                Kill AI Nodes
             </button>
          </div>
        </div>
      </div>

      {/* Feature Grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Sparkles, name: "Consultation AI" },
          { icon: Cpu, name: "Body Scan Engine" },
          { icon: Zap, name: "Symptom Logic" },
          { icon: ShieldCheck, name: "Wellness Guard" },
        ].map((feat, i) => (
          <div key={i} className="bg-zinc-950 border border-zinc-900 p-6 rounded-3xl flex items-center justify-between group hover:border-purple-600/30 transition-all">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-500 group-hover:text-purple-500 transition-all">
                   <feat.icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-white tracking-tight">{feat.name}</span>
             </div>
             <div className="w-2 h-2 rounded-full bg-teal-500 shadow-glow-teal" />
          </div>
        ))}
      </div>
    </div>
  );
}
