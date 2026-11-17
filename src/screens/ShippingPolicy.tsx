import { ArrowLeft, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

export default function ShippingPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-20">
      <div className="px-6 pt-8 pb-6 bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-50 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          <div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">Shipping Policy</h1>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Ayurzenix</p>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-2xl mx-auto space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6"
        >
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
            <Truck className="w-8 h-8" />
          </div>

          <section className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">1. Digital Delivery</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Ayurzenix (A Unit of IQ AI LABS) provides digital wellness services. There are no physical products shipped to your address.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">2. Delivery Timeline</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              All AI-powered analyses (Face Glow, Body Scan, Health Scan) are delivered instantly within the application upon successful payment and processing. Reports are generated in real-time.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">3. Wallet Credits</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Wallet recharges are credited to your account immediately after a successful transaction. In rare cases of network delay, it may take up to 30 minutes to reflect in your balance.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">4. Service Access</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Once a service is purchased or a report is generated, it remains accessible in your "History" section as long as your account is active.
            </p>
          </section>

          <div className="pt-8 border-t border-gray-50">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              Last Updated: April 08, 2026
            </p>
            <p className="text-[10px] text-gray-300 mt-1">
              © IQ AI LABS
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
