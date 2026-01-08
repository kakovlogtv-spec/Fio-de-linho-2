
import React, { useState } from 'react';
import { OrderStatus, Order } from '../types';
// Import WHATSAPP_NUMBER to fix the error on line 137
import { WHATSAPP_NUMBER } from '../constants';

interface OrderTrackerProps {
  orders: Order[];
}

const OrderTracker: React.FC<OrderTrackerProps> = ({ orders }) => {
  const [searchId, setSearchId] = useState('');
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const order = orders.find(o => o.id.toUpperCase() === searchId.toUpperCase());
    setActiveOrder(order || null);
  };

  const steps = [
    OrderStatus.PENDING,
    OrderStatus.MEASURED,
    OrderStatus.IN_CUTTING,
    OrderStatus.IN_PRODUCTION,
    OrderStatus.QUALITY_CHECK,
    OrderStatus.READY
  ];

  const getStepIndex = (status: OrderStatus) => steps.indexOf(status);

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="text-center mb-16">
        <h2 className="text-4xl sm:text-5xl font-serif font-bold text-stone-900 mb-6 tracking-tight">Suivi de <span className="italic text-[#c5a059]">Commande</span></h2>
        <p className="text-stone-500 font-light max-w-xl mx-auto italic text-lg leading-relaxed">Insira o código gerado no ato do seu pedido para verificar em qual estágio sua peça se encontra.</p>
      </div>

      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-20 max-w-2xl mx-auto">
        <div className="relative flex-grow">
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Código do Pedido (Ex: FDL-XXXX-2024)"
            className="w-full bg-white border border-stone-200 rounded-2xl py-6 px-8 text-stone-900 shadow-[0_8px_30px_rgba(0,0,0,0.03)] focus:ring-2 focus:ring-[#c5a059]/20 focus:border-[#c5a059] outline-none transition-all font-serif text-xl"
          />
        </div>
        <button
          type="submit"
          className="bg-stone-900 text-white font-bold text-xs uppercase tracking-[0.2em] py-6 px-12 rounded-2xl hover:bg-stone-800 transition-all shadow-xl active:scale-95"
        >
          Consultar Status
        </button>
      </form>

      {activeOrder ? (
        <div className="bg-white rounded-[3.5rem] p-10 sm:p-20 shadow-[0_60px_150px_rgba(0,0,0,0.06)] border border-stone-50 animate-in fade-in zoom-in-95 duration-700 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] select-none pointer-events-none">
             <span className="font-serif text-[15rem] leading-none">{activeOrder.id.split('-')[1]}</span>
          </div>

          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-24 pb-12 border-b border-stone-100">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#c5a059] shadow-[0_0_15px_rgba(197,160,89,0.5)]"></div>
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.4em]">Protocolo Verificado</span>
                </div>
                <h3 className="text-5xl font-serif text-stone-900 tracking-tighter">{activeOrder.id}</h3>
                <p className="text-stone-400 text-sm mt-3 font-medium uppercase tracking-widest">{activeOrder.date} • Salvador/BA</p>
              </div>
              <div className="lg:text-right">
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3">Cliente VIP</p>
                <p className="text-3xl font-serif text-stone-900">{activeOrder.clientName}</p>
                <div className="mt-4 px-4 py-2 bg-[#c5a059]/10 rounded-full inline-block">
                   <span className="text-[#c5a059] text-[10px] font-bold uppercase tracking-widest">{activeOrder.status}</span>
                </div>
              </div>
            </div>

            <div className="relative">
              {/* Desktop Progress Line */}
              <div className="hidden lg:block absolute top-[28px] left-[5%] w-[90%] h-[2px] bg-stone-100">
                 <div 
                   className="h-full bg-stone-900 transition-all duration-1000 ease-out" 
                   style={{ width: `${(getStepIndex(activeOrder.status) / (steps.length - 1)) * 100}%` }}
                 />
              </div>
              
              <div className="flex flex-col lg:flex-row justify-between gap-12 relative">
                {steps.map((step, idx) => {
                  const isActive = idx <= getStepIndex(activeOrder.status);
                  const isCurrent = idx === getStepIndex(activeOrder.status);
                  
                  return (
                    <div key={step} className="flex flex-row lg:flex-col items-center lg:items-center gap-6 lg:gap-8 lg:w-1/6 relative group">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-700 z-10 ${
                        isActive ? 'bg-stone-900 border-stone-900 text-white shadow-xl' : 'bg-white border-stone-100 text-stone-200'
                      } ${isCurrent ? 'scale-125 ring-[10px] ring-[#c5a059]/10 border-[#c5a059]' : ''}`}>
                        {isActive ? (
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <span className="text-xs font-bold">{idx + 1}</span>
                        )}
                      </div>
                      
                      <div className="flex flex-col lg:items-center text-left lg:text-center">
                        <span className={`text-[9px] uppercase font-black tracking-[0.2em] transition-colors leading-tight ${
                          isActive ? 'text-stone-900' : 'text-stone-300'
                        }`}>
                          {step}
                        </span>
                        {isCurrent && (
                          <span className="lg:absolute lg:top-full mt-3 text-[8px] font-bold text-[#c5a059] uppercase tracking-widest bg-[#c5a059]/5 px-3 py-1 rounded-full whitespace-nowrap">Em progresso agora</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-32 p-10 bg-[#faf9f6] rounded-[3rem] border border-stone-100 flex flex-col md:flex-row justify-between items-center gap-12">
              <div className="flex items-center gap-8">
                 <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-stone-100 flex items-center justify-center">
                    <svg className="w-8 h-8 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                 </div>
                 <div>
                    <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Item em Produção</h4>
                    <p className="text-2xl font-serif text-stone-900">{activeOrder.items[0]}</p>
                 </div>
              </div>
              {/* WHATSAPP_NUMBER is now imported and correctly used here */}
              <button 
                onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank')}
                className="text-[10px] font-bold uppercase tracking-widest text-[#c5a059] border-b border-[#c5a059] pb-1 hover:text-[#b08d4a] hover:border-[#b08d4a] transition-all"
              >
                Falar com seu Alfaiate
              </button>
            </div>
          </div>
        </div>
      ) : searchId && (
        <div className="text-center p-24 glass rounded-[3rem] border-2 border-dashed border-stone-100 animate-in fade-in duration-500">
          <p className="text-stone-400 italic font-serif text-xl">O código "{searchId}" não foi identificado.</p>
          <p className="text-stone-300 text-sm mt-3 uppercase tracking-widest font-bold">Verifique se há erros de digitação.</p>
        </div>
      )}
    </div>
  );
};

export default OrderTracker;
