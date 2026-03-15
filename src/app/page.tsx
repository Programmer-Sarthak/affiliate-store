"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { 
  Search, Zap, ArrowRight, Filter, Star, 
  TrendingUp, CheckCircle2, ChevronLeft, ChevronRight 
} from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [activeCategories, setActiveCategories] = useState<any[]>([]);
  const [selectedCatId, setSelectedCatId] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      // Fetch products with category details joined
      const { data: pData } = await supabase
        .from('products')
        .select('*, categories(id, name, slug)');

      if (pData) {
        setProducts(pData);
        // Extract unique categories that actually have products
        const cats = pData
          .map(p => p.categories)
          .filter((v, i, a) => v && a.findIndex(t => t.id === v.id) === i);
        setActiveCategories(cats);
      }
      setLoading(false);
    }
    getData();
  }, []);


    const handleSearchLogging = async (query: string) => {
    setSearch(query);
    
    // Only log if the user has typed 3+ characters (prevents spamming the DB)
    if (query.length > 3) {
      const { error } = await supabase.from('analytics').insert([
        { 
          event_type: 'search', 
          search_query: query,
          timestamp: new Date().toISOString() 
        }
      ]);
      if (error) console.error("Analytics Error:", error);
    }
  };

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          (p.product_id && p.product_id.toLowerCase().includes(search.toLowerCase()));
    const matchesCat = selectedCatId === "All" || p.category_id === selectedCatId;
    return matchesSearch && matchesCat;
  });

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HERO SECTION: SEARCH & INTENT */}
      <section className="bg-white py-16 md:py-24 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-8">
            <Zap size={14} className="fill-blue-600" /> 2026 Buying Intelligence
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 tracking-tight leading-tight">
            Research Less. <span className="text-blue-600">Buy Better.</span>
          </h1>
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-6 top-5 text-slate-300 w-6 h-6" />
            <input 
              type="text" 
              placeholder="Search products, IDs, or features..."
              className="w-full pl-16 pr-6 py-5 rounded-[2rem] border-2 border-slate-100 focus:border-blue-500 outline-none shadow-2xl shadow-blue-100/10 text-slate-900 text-lg transition-all"
              onChange={(e) => handleSearchLogging(e.target.value)}
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* TOP 3 COMPARISON: EXPERT PICKS */}
        {selectedCatId === "All" && search === "" && filtered.length >= 3 && (
          <section className="mb-24">
            <div className="flex items-center gap-3 mb-8">
              <TrendingUp className="text-orange-500" />
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Expert Recommendations</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border rounded-[3rem] bg-white overflow-hidden shadow-sm">
              {filtered.slice(0, 3).map((p, idx) => (
                <div key={p.id} className={`p-10 flex flex-col ${idx !== 2 ? 'border-b md:border-b-0 md:border-r border-slate-100' : ''} hover:bg-slate-50/50 transition-colors group`}>
                   <div className="relative mb-6">
                    <img src={p.image_url?.[0]} className="w-40 h-40 object-contain mx-auto group-hover:scale-110 transition-transform duration-500" alt={p.name} />
                    {idx === 0 && <span className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 rounded-lg text-[10px] font-bold shadow-lg">#1 Choice</span>}
                   </div>
                   
                   <h3 className="text-lg font-bold text-slate-800 text-center mb-4 line-clamp-2 h-14">{p.name}</h3>
                   
                   <div className="flex items-center justify-center gap-1 text-orange-400 mb-6 font-black">
                     <Star size={16} fill="currentColor" /> {p.rating}
                   </div>
                   
                   {/* Structured Bullet Highlights from DB */}
                   <div className="space-y-3 mb-8 flex-grow">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Key Highlights</p>
                     {p.highlights?.slice(0, 3).map((h: string, i: number) => (
                       <div key={i} className="flex items-start gap-2 text-xs text-slate-600 font-bold leading-tight">
                         <CheckCircle2 className="text-emerald-500 w-4 h-4 flex-shrink-0" /> {h}
                       </div>
                     ))}
                   </div>

                   <div className="pt-6 border-t border-slate-100">
                    <p className="text-center text-2xl font-black text-slate-900 mb-4">₹{p.price}</p>
                    <Link href={`/product/${p.id}`} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-center text-xs tracking-widest uppercase shadow-xl shadow-blue-100 block hover:bg-slate-900 transition-all">
                      View Deal
                    </Link>
                   </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* DYNAMIC CATEGORY FILTER BAR */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6 text-slate-400 font-black text-[10px] uppercase tracking-widest">
            <Filter size={14} /> Available Categories
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            <button 
              onClick={() => setSelectedCatId("All")}
              className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${selectedCatId === 'All' ? 'bg-slate-900 text-white shadow-xl' : 'bg-white border text-slate-500 hover:bg-slate-100'}`}
            >
              All Products
            </button>
            {activeCategories.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setSelectedCatId(cat.id)}
                className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${selectedCatId === cat.id ? 'bg-slate-900 text-white shadow-xl' : 'bg-white border text-slate-500 hover:bg-slate-100'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* PRODUCT GRID: DISCOVERY */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {loading ? (
             Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-white rounded-[2.5rem] p-6 border border-slate-100 animate-pulse h-96"></div>
            ))
          ) : (
            filtered.map(product => (
              <Link key={product.id} href={`/product/${product.id}`} className="group">
                <div className="bg-white p-5 rounded-[2.5rem] border border-transparent hover:border-blue-100 hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
                  
                  {/* Image Container */}
                  <div className="relative aspect-square rounded-[1.8rem] overflow-hidden mb-6 bg-slate-50">
                    <img src={product.image_url?.[0]} className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700" alt={product.name} />
                    {product.discount_label && (
                      <div className="absolute top-4 right-4 bg-emerald-500 text-white px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter">
                        {product.discount_label}
                      </div>
                    )}
                  </div>

                  {/* Text Content */}
                  <h3 className="text-sm font-black text-slate-800 line-clamp-2 h-10 mb-2 group-hover:text-blue-600 transition-colors leading-tight">
                    {product.name}
                  </h3>
                  <p className="text-[10px] text-slate-400 line-clamp-2 mb-6 flex-grow leading-relaxed italic">
                    {product.description}
                  </p>

                  {/* Price and CTA Icon */}
                  <div className="flex justify-between items-center border-t border-slate-50 pt-4">
                     <div>
                        <p className="text-[8px] font-black text-slate-300 uppercase mb-1">Deal Price</p>
                        <p className="text-2xl font-black text-slate-900">₹{product.price}</p>
                     </div>
                     <div className="h-10 w-10 bg-slate-900 text-white rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors shadow-lg shadow-slate-200">
                       <ArrowRight size={18} />
                     </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </main>
  );
}