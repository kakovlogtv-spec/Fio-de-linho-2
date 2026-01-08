
import React from 'react';
import { COLLECTION_ITEMS, WHATSAPP_NUMBER } from '../constants';

const Collection: React.FC = () => {
  const handleQuote = (itemName: string) => {
    const message = encodeURIComponent(`Olá! Estou encantado com a peça "${itemName}" da sua coleção e gostaria de solicitar um orçamento personalizado.`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  return (
    <section className="py-12">
      <div className="text-center mb-20 max-w-3xl mx-auto px-4">
        <div className="inline-block px-4 py-1.5 bg-[#c5a059]/10 rounded-full mb-4">
          <span className="text-[#c5a059] text-[10px] font-bold uppercase tracking-[0.3em]">Nossa Curadoria</span>
        </div>
        <h2 className="text-4xl sm:text-5xl font-serif font-bold text-stone-900 mb-6 tracking-tight">Coleção Été 2024</h2>
        <p className="text-stone-500 font-light text-lg leading-relaxed italic">"A elegância é a única beleza que nunca desaparece." — Audrey Hepburn</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {COLLECTION_ITEMS.map((item) => (
          <div key={item.id} className="group cursor-pointer">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-stone-200 mb-6 shadow-[0_20px_50px_rgba(0,0,0,0.04)] transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)]">
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-stone-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center p-6">
                 <button
                  onClick={() => handleQuote(item.name)}
                  className="bg-white text-stone-900 text-[10px] font-bold uppercase tracking-widest py-4 px-8 rounded-full transform translate-y-8 group-hover:translate-y-0 transition-all duration-500"
                >
                  {item.category === 'Essentiels' ? 'Comprar Agora' : 'Solicitar Orçamento'}
                </button>
              </div>
              <div className="absolute top-6 right-6 flex flex-col items-end gap-2">
                <div className={`glass px-4 py-1.5 rounded-full text-[9px] uppercase font-bold tracking-widest border border-white/50 ${
                  item.category === 'Essentiels' ? 'bg-[#c5a059]/20 text-[#c5a059]' : 'text-stone-900'
                }`}>
                  {item.category}
                </div>
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <h3 className="font-serif text-2xl text-stone-900 group-hover:text-[#c5a059] transition-colors">{item.name}</h3>
              <p className="text-xs text-[#c5a059] font-bold tracking-[0.2em] uppercase">
                {item.price > 1000 ? 'Sob Consulta' : `R$ ${item.price},00`}
              </p>
              <div className="pt-2">
                <p className="text-sm text-stone-500 font-light leading-relaxed px-4 line-clamp-2">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Collection;
