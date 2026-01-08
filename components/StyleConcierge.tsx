
import React, { useState } from 'react';
import { getStylingAdvice } from '../services/gemini';
import { MeasurementData } from '../types';

const StyleConcierge: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    occasion: 'Casamento',
    preference: 'Clássico Elegante',
    chest: '',
    waist: '',
    hips: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const mData: MeasurementData = {
      chest: parseFloat(formData.chest),
      waist: parseFloat(formData.waist),
      hips: parseFloat(formData.hips)
    };
    const result = await getStylingAdvice(mData, formData.occasion, formData.preference);
    setAdvice(result || "Nossa análise técnica está processando seus dados...");
    setLoading(false);
  };

  return (
    <div className="py-20 animate-fade">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-[#c5a059] text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block">Concierge Digital</span>
            <h2 className="text-5xl font-serif text-stone-900 mb-8 leading-tight">Sua Consultoria de <br/><span className="italic font-light">Estilo Personalizada</span></h2>
            <p className="text-stone-500 mb-10 leading-relaxed font-light text-lg">
              Nossa IA mestre utiliza décadas de conhecimento em alfaiataria para sugerir o traje perfeito com base nas suas medidas e na ocasião desejada.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Ocasião</label>
                  <select 
                    value={formData.occasion}
                    onChange={e => setFormData({...formData, occasion: e.target.value})}
                    className="w-full p-4 rounded-xl bg-white border border-stone-100 focus:border-[#c5a059] outline-none text-sm font-medium"
                  >
                    <option>Casamento</option>
                    <option>Gala / Black Tie</option>
                    <option>Business de Luxo</option>
                    <option>Social / Coquetel</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Preferência</label>
                  <select 
                    value={formData.preference}
                    onChange={e => setFormData({...formData, preference: e.target.value})}
                    className="w-full p-4 rounded-xl bg-white border border-stone-100 focus:border-[#c5a059] outline-none text-sm font-medium"
                  >
                    <option>Clássico Elegante</option>
                    <option>Slim Moderno</option>
                    <option>Ousado / Vanguarda</option>
                    <option>Conforto Master</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                 {['chest', 'waist', 'hips'].map(field => (
                   <div key={field} className="space-y-2">
                     <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                       {field === 'chest' ? 'Peito' : field === 'waist' ? 'Cintura' : 'Quadril'}
                     </label>
                     <input 
                       type="number" 
                       required
                       placeholder="cm"
                       value={formData[field as keyof typeof formData]}
                       onChange={e => setFormData({...formData, [field]: e.target.value})}
                       className="w-full p-4 rounded-xl bg-white border border-stone-100 focus:border-[#c5a059] outline-none text-sm"
                     />
                   </div>
                 ))}
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-stone-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-stone-800 transition-all shadow-xl disabled:opacity-50"
              >
                {loading ? 'Consultando Mestre Alfaiate...' : 'Receber Consultoria de Estilo'}
              </button>
            </form>
          </div>

          <div className="relative">
             {advice ? (
               <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-stone-50 animate-in zoom-in-95 duration-700 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 text-[#c5a059]/10">
                    <svg className="w-32 h-32 fill-current" viewBox="0 0 24 24"><path d="M14 17h3v2h-3v-2zm3-2h3v2h-3v-2zm3-2h3v2h-3v-2zm-6 4h3v2h-3v-2zm3-2h3v2h-3v-2zm-9 2h3v2H8v-2zm0-2h3v2H8v-2zm-3 2h3v2H5v-2zm0-2h3v2H5v-2zM14 5v10h9V5h-9zm7 8h-5V7h5v6zM2 19h3v2H2v-2zm1-8h10v2H3v-2zm0-4h10v2H3V7zm0-4h10v2H3V3z"/></svg>
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                       <div className="w-10 h-10 rounded-full bg-[#c5a059] flex items-center justify-center text-white text-xs">✦</div>
                       <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Diretriz da Maison</span>
                    </div>
                    <div className="prose prose-stone">
                      <p className="text-stone-800 font-serif text-2xl leading-relaxed italic whitespace-pre-line">
                        "{advice}"
                      </p>
                    </div>
                    <div className="mt-10 pt-8 border-t border-stone-100">
                       <p className="text-xs text-stone-400 font-medium mb-4">Esta consultoria é baseada em proporções ideais e princípios de alfaiataria clássica.</p>
                       <button 
                        onClick={() => setAdvice(null)}
                        className="text-[#c5a059] text-[10px] font-bold uppercase tracking-widest hover:underline"
                       >
                         Nova Consultoria
                       </button>
                    </div>
                  </div>
               </div>
             ) : (
               <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl relative group">
                  <img 
                    src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1000" 
                    className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900 to-transparent flex items-end p-12">
                     <p className="text-white font-serif text-2xl italic">"O estilo é um modo de dizer quem você é sem precisar falar."</p>
                  </div>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StyleConcierge;
