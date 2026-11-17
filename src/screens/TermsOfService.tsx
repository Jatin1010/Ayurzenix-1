import { motion } from 'motion/react';
import { ChevronLeft, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TermsOfService() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white px-6 py-8 pb-24">
      <button 
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center gap-2 text-gray-500 font-bold"
      >
        <ChevronLeft className="w-5 h-5" />
        Back
      </button>

      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-[#22C55E]">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Terms of Service</h1>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Last Updated: April 16, 2026</p>
        </div>
      </div>

      <div className="prose prose-sm text-gray-600 space-y-8">
        <section className="bg-orange-50 p-5 rounded-2xl border border-orange-100">
          <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
            <span className="text-orange-500">📢</span> Affiliate Disclosure
          </h2>
          <p className="text-gray-700 font-medium leading-relaxed">
            <strong>As an Amazon Associate, we earn from qualifying purchases.</strong> Ayurzenix participates in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.in and affiliated sites. When you click on links to various merchants on this site and make a purchase, this can result in this site earning a commission.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">1. Acceptance of Terms</h2>
          <p>By accessing or using Ayurzenix (A Unit of IQ AI LABS), you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, you may not use our services.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">2. Description of Service</h2>
          <p>Ayurzenix provides AI-powered Ayurvedic wellness analysis, personalized routines, and product recommendations. <strong>Medical Disclaimer:</strong> Our services are for informational and educational purposes only and are not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">3. User Responsibilities</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>You must be at least 18 years old to use our services.</li>
            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
            <li>You agree to provide accurate, current, and complete information during the registration process.</li>
            <li>You agree not to use the service for any illegal or unauthorized purpose.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">4. Purchases and Affiliate Links</h2>
          <p>Our app may contain links to third-party websites or services that are not owned or controlled by Ayurzenix. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party web sites or services. You further acknowledge and agree that Ayurzenix shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods or services available on or through any such web sites or services.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">5. Disclaimer of Warranties</h2>
          <p>Our services are provided "as is" and "as available" without warranties of any kind, either express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of performance.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">6. Limitation of Liability</h2>
          <p>In no event shall Ayurzenix, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">7. Governing Law</h2>
          <p>These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.</p>
        </section>

        <div className="pt-8 text-center border-t border-gray-100 mt-12">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            © {new Date().getFullYear()} IQ AI LABS
          </p>
          <p className="text-[10px] text-gray-300 mt-1">
            All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  );
}
