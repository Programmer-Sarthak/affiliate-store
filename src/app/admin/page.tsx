"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, LogOut, Upload, Loader2, Trash2, Edit3, 
  Plus, X, IndianRupee, Search, ListTree, BarChart3, MousePointer2, 
  ShieldAlert, PlusCircle 
} from 'lucide-react';

export default function AdminPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [inventorySearch, setInventorySearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [stats, setStats] = useState({ clicks: 0, products: 0 });
  const router = useRouter();

  const initialForm = {
    product_id: '', name: '', price: '', category_id: '', 
    image_urls: [] as string[], affiliate_link: '', rating: '4.5', 
    discount_value: '', description: '', highlights: [] as string[]
  };

  const [formData, setFormData] = useState(initialForm);
  const [currentHighlight, setCurrentHighlight] = useState("");

  // Add this at the very top of your AdminPage component
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.email !== "sarthakchourey3s@gmail.com") {
        window.location.href = "/login";
      }
    };
    checkUser();
  }, []);

  useEffect(() => {
    fetchData();
    fetchAnalytics();
  }, []);

  async function fetchData() {
    const { data: catData } = await supabase.from('categories').select('*');
    const { data: prodData } = await supabase.from('products').select('*, categories(name)').order('created_at', { ascending: false });
    if (catData) setCategories(catData);
    if (prodData) setProducts(prodData);
  }

  async function fetchAnalytics() {
    const { count } = await supabase.from('analytics').select('*', { count: 'exact', head: true });
    setStats({ clicks: count || 0, products: products.length });
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploading(true);
    const files = Array.from(e.target.files || []);
    const urls = [...formData.image_urls];
    for (const file of files) {
      const name = `products/${Date.now()}-${file.name}`;
      await supabase.storage.from('product-images').upload(name, file);
      const { data } = supabase.storage.from('product-images').getPublicUrl(name);
      urls.push(data.publicUrl);
    }
    setFormData({ ...formData, image_urls: urls });
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      product_id: formData.product_id,
      name: formData.name,
      price: parseFloat(formData.price) || 0,
      category_id: formData.category_id,
      image_url: formData.image_urls,
      affiliate_link: formData.affiliate_link,
      rating: parseFloat(formData.rating) || 0,
      discount_label: formData.discount_value ? `${formData.discount_value}% OFF` : '',
      description: formData.description,
      highlights: formData.highlights
    };

    const { error } = editingId 
      ? await supabase.from('products').update(payload).eq('id', editingId)
      : await supabase.from('products').insert([payload]);

    if (!error) {
      setFormData(initialForm);
      setEditingId(null);
      fetchData();
    }
    setLoading(false);
  };

  const filteredInventory = products.filter(p => 
    p.name.toLowerCase().includes(inventorySearch.toLowerCase()) || 
    p.product_id?.toLowerCase().includes(inventorySearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans text-slate-900">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 sticky top-0 z-50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <ShieldAlert className="text-blue-400" />
          <h1 className="font-black text-xl uppercase tracking-tighter">Secure Admin Console</h1>
        </div>
        <button onClick={() => supabase.auth.signOut().then(() => router.push('/login'))} className="bg-white/10 p-2 rounded-xl hover:bg-red-500 transition-all"><LogOut /></button>
      </div>

      <div className="max-w-7xl mx-auto mt-10 px-4">
        {/* Analytics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <BarChart3 className="text-blue-600 mb-4" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Inventory</p>
            <p className="text-4xl font-black">{products.length}</p>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <MousePointer2 className="text-emerald-500 mb-4" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer Clicks</p>
            <p className="text-4xl font-black">{stats.clicks}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Builder Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[3rem] border border-slate-200 space-y-8">
              <h2 className="font-black text-2xl uppercase flex items-center gap-3"><PlusCircle className="text-blue-600" /> {editingId ? "Update Item" : "New Entry"}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input required placeholder="Product Title" className="w-full p-4 bg-slate-50 rounded-2xl outline-none" value={formData.name || ""} onChange={e => setFormData({...formData, name: e.target.value})} />
                <select required className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold" value={formData.category_id || ""} onChange={e => setFormData({...formData, category_id: e.target.value})}>
                  <option value="">-- Assign Category --</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="relative">
                  <IndianRupee className="absolute left-4 top-4 text-slate-400 w-4 h-4" />
                  <input required type="number" className="w-full p-4 pl-10 bg-slate-50 rounded-2xl outline-none" value={formData.price || ""} onChange={e => setFormData({...formData, price: e.target.value})} />
                </div>
                <input type="number" placeholder="Discount %" className="w-full p-4 bg-slate-50 rounded-2xl outline-none" value={formData.discount_value || ""} onChange={e => setFormData({...formData, discount_value: e.target.value})} />
                <input step="0.1" type="number" placeholder="Rating" className="w-full p-4 bg-slate-50 rounded-2xl outline-none" value={formData.rating || ""} onChange={e => setFormData({...formData, rating: e.target.value})} />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Highlights (About this item)</label>
                <div className="flex gap-3">
                  <input placeholder="Feature..." className="flex-1 p-4 bg-slate-50 rounded-2xl outline-none" value={currentHighlight} onChange={e => setCurrentHighlight(e.target.value)} />
                  <button type="button" onClick={() => { if(currentHighlight) setFormData({...formData, highlights: [...formData.highlights, currentHighlight]}); setCurrentHighlight(""); }} className="bg-slate-900 text-white px-6 rounded-2xl"><Plus /></button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.highlights.map((h, i) => (
                    <span key={i} className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                      {h} <X size={14} className="cursor-pointer" onClick={() => setFormData({...formData, highlights: formData.highlights.filter((_, idx) => idx !== i)})} />
                    </span>
                  ))}
                </div>
              </div>

              <textarea placeholder="Main Description..." className="w-full p-5 bg-slate-50 rounded-[2rem] h-40 outline-none" value={formData.description || ""} onChange={e => setFormData({...formData, description: e.target.value})} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all">
                  {uploading ? <Loader2 className="animate-spin" /> : <Upload className="text-slate-300"/>}
                  <span className="text-[10px] font-black text-slate-400 uppercase mt-2">Upload Images</span>
                  <input type="file" multiple className="hidden" onChange={handleImageUpload} />
                </label>
                <input required placeholder="Affiliate URL" className="p-4 bg-slate-50 rounded-2xl outline-none" value={formData.affiliate_link || ""} onChange={e => setFormData({...formData, affiliate_link: e.target.value})} />
              </div>

              <button disabled={loading || uploading} className="w-full bg-blue-600 text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-blue-100 hover:bg-slate-900 transition-all uppercase tracking-widest">
                {loading ? "Syncing..." : "Update Database"}
              </button>
            </form>
          </div>

          {/* Inventory Search & List */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm space-y-6">
              <div className="relative">
                <Search className="absolute left-4 top-4 text-slate-300 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Filter inventory..." 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none text-sm"
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
                />
              </div>
              <div className="space-y-3 max-h-[800px] overflow-y-auto no-scrollbar">
                {filteredInventory.map(p => (
                  <div key={p.id} className="bg-slate-50/50 p-4 rounded-3xl border flex items-center gap-4 group hover:bg-white transition-all">
                    <img src={p.image_url?.[0]} className="w-12 h-12 object-cover rounded-xl border bg-white" alt="" />
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-sm text-slate-800 truncate">{p.name}</p>
                      <p className="text-[10px] font-bold text-blue-600">₹{p.price}</p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => { setEditingId(p.id); setFormData({...p, discount_value: p.discount_label?.replace('% OFF', '') || '', image_urls: p.image_url || []}); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="p-2 hover:text-blue-600"><Edit3 size={18}/></button>
                      <button onClick={async () => { if(confirm("Delete?")) { await supabase.from('products').delete().eq('id', p.id); fetchData(); } }} className="p-2 hover:text-red-600"><Trash2 size={18}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}