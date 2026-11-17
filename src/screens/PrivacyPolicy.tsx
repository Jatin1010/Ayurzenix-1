import { motion } from 'motion/react';
import { ChevronLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PrivacyPolicy() {
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
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Privacy Policy</h1>
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
          <h2 className="text-lg font-bold text-gray-900 mb-2">1. Information We Collect</h2>
          <p className="mb-3">Ayurzenix (A Unit of IQ AI LABS) collects information you provide directly to us to ensure the best possible personalized Ayurvedic experience. This includes:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Personal Information:</strong> Name, email address, phone number, and account credentials when you register.</li>
            <li><strong>Health & Wellness Data:</strong> Dosha types, daily routines, dietary preferences, sleep patterns, and physical symptoms you choose to share for AI analysis.</li>
            <li><strong>Usage Data:</strong> Information about how you interact with our app, features used, and time spent on different sections.</li>
            <li><strong>Device Information:</strong> IP address, browser type, operating system, and device identifiers.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">2. How We Use Your Information</h2>
          <p className="mb-3">We use the information we collect for various purposes, including to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Provide, maintain, and improve our AI-powered Ayurvedic analysis and wellness insights.</li>
            <li>Personalize your experience by recommending specific herbs, routines, and lifestyle changes based on your unique Dosha profile.</li>
            <li>Process transactions and send related information, including purchase confirmations and invoices.</li>
            <li>Send technical notices, updates, security alerts, and support messages.</li>
            <li>Respond to your comments, questions, and customer service requests.</li>
          </ul>
          <p className="mt-3 text-sm italic text-gray-500">Note: Your health data is used solely for generating wellness insights within the app and is never sold to third parties for marketing purposes.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">3. Third-Party Services & Links</h2>
          <p>Our application may contain links to third-party websites or services, including affiliate links (such as Amazon). If you click on a third-party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">4. Data Security & Retention</h2>
          <p>We implement industry-standard security measures to protect the information we collect. Your sensitive health data is encrypted in transit and at rest. However, no method of transmission over the internet or electronic storage is 100% secure. We retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">5. Your Privacy Rights</h2>
          <p className="mb-3">Depending on your location, you may have the following rights regarding your personal data:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>The right to access, update, or delete the information we have on you.</li>
            <li>The right of rectification if your information is inaccurate or incomplete.</li>
            <li>The right to object to our processing of your personal data.</li>
            <li>The right to request that we restrict the processing of your personal information.</li>
          </ul>
          <p className="mt-3">You can exercise these rights by contacting us directly or managing your data through the app's settings panel.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">6. Changes to This Privacy Policy</h2>
          <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top. You are advised to review this Privacy Policy periodically for any changes.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">7. Contact Us</h2>
          <p>If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:</p>
          <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <p className="font-bold text-gray-900">IQ AI LABS</p>
            <p className="text-gray-600">Email: Help@Ayurzenix.in</p>
          </div>
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
