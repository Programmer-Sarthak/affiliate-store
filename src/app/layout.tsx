import './globals.css';
import { ShoppingBag, ShieldCheck, Mail } from 'lucide-react';

export const metadata = {
  title: 'TechPick | Expert Product Recommendations',
  description: 'Independent research and top deals from Amazon, Flipkart, and Meesho.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased font-sans">
        {/* Navigation */}
        <nav className="bg-white border-b sticky top-0 z-[100]">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <ShoppingBag className="text-white w-5 h-5" />
              </div>
              <span className="font-black text-xl tracking-tight uppercase">
                Tech<span className="text-blue-600">Pick</span>
              </span>
            </div>
            <div className="hidden md:flex gap-8 text-sm font-bold text-slate-600">
              <a href="/" className="hover:text-blue-600 transition">Discovery</a>
              <a href="/#deals" className="hover:text-blue-600 transition">Top Deals</a>
              <a href="/#guides" className="hover:text-blue-600 transition">Buying Guides</a>
            </div>
            <button className="bg-slate-900 text-white px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-2">
              <Mail size={14} /> Subscribe
            </button>
          </div>
        </nav>
        
        {/* Mandatory Affiliate Disclosure Bar */}
        <div className="bg-blue-50 border-b border-blue-100 py-2.5">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-2 text-[10px] md:text-xs text-blue-700 font-bold uppercase tracking-wide">
            <ShieldCheck size={14} className="flex-shrink-0" />
            <span>Transparency: We may earn a commission when you buy through our links.</span>
          </div>
        </div>

        {children}

        {/* Global Footer */}
        <footer className="bg-white border-t mt-24 py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-6 opacity-50 grayscale">
              <ShoppingBag className="w-5 h-5" />
              <span className="font-black text-lg tracking-tight uppercase">TechPick</span>
            </div>
            <p className="text-slate-400 text-xs font-medium max-w-md mx-auto leading-loose">
              TechPick is a participant in the Amazon Services LLC Associates Program, Flipkart Affiliate Program, and Meesho Referral Program.
            </p>
            <div className="flex justify-center gap-6 mt-8 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <a href="/privacy" className="hover:text-slate-900">Privacy</a>
              <a href="/terms" className="hover:text-slate-900">Terms</a>
              <a href="/disclosure" className="hover:text-slate-900">Disclosure</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}