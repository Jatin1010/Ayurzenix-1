import { ShieldCheck, ShieldAlert } from 'lucide-react';

export const DosAndDontsBanner = () => {
    return (
        <div className="px-6 py-8 bg-gray-50">
            <h3 className="text-sm font-black uppercase tracking-widest text-black mb-6">Daily Guidance</h3>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                    <div className="flex items-center gap-2 text-emerald-600 mb-2">
                        <ShieldCheck className="w-5 h-5" />
                        <span className="text-xs font-black uppercase">Do's</span>
                    </div>
                    <ul className="text-[11px] font-medium text-emerald-900 space-y-1">
                        <li>• Regular sleep time</li>
                        <li>• Mindful eating</li>
                        <li>• Daily movement</li>
                    </ul>
                </div>
                <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
                    <div className="flex items-center gap-2 text-rose-600 mb-2">
                        <ShieldAlert className="w-5 h-5" />
                        <span className="text-xs font-black uppercase">Don'ts</span>
                    </div>
                    <ul className="text-[11px] font-medium text-rose-900 space-y-1">
                        <li>• Processed foods</li>
                        <li>• Late night meals</li>
                        <li>• Excessive screen time</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
