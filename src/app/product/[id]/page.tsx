"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import { 
  ExternalLink, 
  Star, 
  ChevronLeft, 
  ShieldCheck, 
  CheckCircle, 
  ArrowRight,
  Info
} from 'lucide-react';
import Link from 'next/link';

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [activeImg, setActiveImg] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getProduct() {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (data) setProduct(data);
      setLoading(false);
    }
    getProduct();
  }, [id]);

    useEffect(() => {
    const logClick = async () => {
      if (product) {
        await supabase.from('analytics').insert([
          { event_type: 'product_click', product_name: product.name }
        ]);
      }
    };
    logClick();
  }, [product]);

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Fetching Details...</p>
    </div>
  );

  if (!product) return (
    <div className="h-screen flex flex-col items-center justify-center text-center p-6">
      <h2 className="text-2xl font-black mb-4">Product Not Found</h2>
      <button onClick={() => router.push('/')} className="text-blue-600 font-bold underline">Return to Catalog</button>
    </div>
  );

  return (
    <main className="min-h-screen bg-white">
      {/* Top Breadcrumb Nav */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-8">
          <Link href="/" className="hover:text-blue-600 transition">Catalog</Link>
          <span>/</span>
          <span className="text-slate-900">{product.category}</span>
          <span>/</span>
          <span className="truncate max-w-[150px] md:max-w-none">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Left Column: Image Gallery (Span 7) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="aspect-square bg-slate-50 rounded-[3rem] overflow-hidden border border-slate-100 p-8 md:p-16 flex items-center justify-center relative">
              <img 
                src={product.image_url?.[activeImg]} 
                alt={product.name} 
                className="w-full h-full object-contain mix-blend-multiply hover:scale-105 transition-transform duration-500"
              />
              {product.discount_label && (
                <div className="absolute top-8 right-8 bg-emerald-500 text-white px-5 py-2 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-200">
                  {product.discount_label}
                </div>
              )}
            </div>
            
            {/* Thumbnails */}
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {product.image_url?.map((img: string, i: number) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImg(i)}
                  className={`w-24 h-24 rounded-[1.5rem] border-2 flex-shrink-0 p-3 bg-slate-50 transition-all ${
                    activeImg === i ? 'border-blue-600 ring-4 ring-blue-50' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>

            {/* NON-STICKY PROFESSIONAL BUY BOX */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-[0_20px_50px_rgba(37,99,235,0.06)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-700" />

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em]">
                  <ShieldCheck size={16} /> Verified Market Link
                </div>
                
                <div className="mb-8">
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.1em] mb-2">Deal Price</p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl font-black text-slate-900 tracking-tighter">₹{product.price}</span>
                    {product.discount_label && (
                      <span className="bg-emerald-50 text-emerald-600 font-black text-xs px-3 py-1.5 rounded-xl uppercase tracking-tighter">
                        {product.discount_label}
                      </span>
                    )}
                  </div>
                </div>
                
                <a 
                  href={product.affiliate_link} 
                  target="_blank" 
                  className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-center flex items-center justify-center gap-3 hover:bg-slate-900 transition-all shadow-xl shadow-blue-100 group/btn"
                >
                  CHECK AVAILABILITY <ExternalLink size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                </a>
                
                <div className="mt-8 grid grid-cols-2 gap-3">
                  <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-500 bg-slate-50/50 py-3 rounded-xl border border-slate-100">
                    <CheckCircle size={14} className="text-emerald-500" /> Trusted Store
                  </div>
                  <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-500 bg-slate-50/50 py-3 rounded-xl border border-slate-100">
                    <CheckCircle size={14} className="text-emerald-500" /> Secure Exit
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Product Conversion (Span 5) */}
          <div className="lg:col-span-5 flex flex-col h-fit">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex text-orange-400 gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={18} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} stroke="currentColor" />
                ))}
              </div>
              <span className="text-sm font-black text-slate-900">{product.rating}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-[1.1] tracking-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-10">
              <span className="text-5xl font-black text-slate-900 tracking-tighter">₹{product.price}</span>
              <div className="h-10 w-[2px] bg-slate-100 mx-2"></div>
              <span className="text-slate-400 text-sm font-bold leading-tight">Incl. all taxes <br />& shipping</span>
            </div>

            {/* Description Tab */}

            <div className="space-y-10">
              {/* Structured Highlights (Bullets) */}
              {product.highlights && product.highlights.length > 0 && (
                <div>
                  <h3 className="text-base font-black text-slate-900 mb-6 flex items-center gap-2">
                    About this item
                  </h3>
                  <ul className="space-y-4">
                    {product.highlights.map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-4 group">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 flex-shrink-0 group-hover:bg-blue-600 transition-colors" />
                        <p className="text-slate-600 text-sm font-medium leading-relaxed">
                          {item}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Main Paragraph Description */}
              <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                  Product Details
                </h3>
                <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                  <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                    {product.description}
                  </p>
                </div>
              </div>
            </div>

            
          </div>
        </div>
      </div>

      {/* Trust & Compliance Footer */}
      <section className="max-w-7xl mx-auto px-4 mt-24 py-12 border-t border-slate-100">
        <p className="text-[10px] text-slate-400 font-medium leading-relaxed max-w-2xl">
          * Note: TechPick does not directly sell products. When you click our links, you are redirected to official platforms like Amazon, Flipkart, or Meesho. We ensure the links are safe, but the final transaction and delivery are handled by the respective marketplace.
        </p>
      </section>
    </main>
  );
}