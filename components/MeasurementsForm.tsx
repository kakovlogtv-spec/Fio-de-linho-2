
import React, { useState } from 'react';
import { MeasurementData, Order, OrderStatus } from '../types';
import { analyzeMeasurements } from '../services/gemini';
import { WHATSAPP_NUMBER } from '../constants';
import { generateProjectCode } from '../utils/generators';

interface MeasurementsFormProps {
  onOrderCreated?: (order: Order) => void;
}

const MeasurementsForm: React.FC<MeasurementsFormProps> = ({ onOrderCreated }) => {
  const [formData, setFormData] = useState<MeasurementData>({ clothingType: 'Terno Completo' });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [projectCode, setProjectCode] = useState<string | null>(null);
  const [clientInfo, setClientInfo] = useState({ name: '', email: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'clientName' || name === 'clientEmail') {
      setClientInfo(prev => ({ ...prev, [name === 'clientName' ? 'name' : 'email']: value }));
    } else if (name === 'clothingType') {
      setFormData(prev => ({ ...prev, [name]: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || undefined }));
    }
  };

  const sendToWhatsApp = () => {
    let message = `🧵 *NOVO PEDIDO DE CONFECÇÃO SOB MEDIDA*\n\n`;
    message += `📌 *Protocolo:* ${projectCode}\n`;
    message += `👤 *Cliente:* ${clientInfo.name}\n`;
    message += `👗 *Peça:* ${formData.clothingType}\n\n`;
    message += `📏 *Medidas (cm):*\n`;
    message += `• Peito: ${formData.chest || '-'}\n`;
    message += `• Cintura: ${formData.waist || '-'}\n`;
    message += `• Quadril: ${formData.hips || '-'}\n`;
    message += `• Ombros: ${formData.shoulders || '-'}\n\n`;
    message += `_O cliente aguarda contato para validação do design._`;
    
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const analysis = await analyzeMeasurements(formData);
    const code = generateProjectCode();
    
    setFeedback(analysis);
    setProjectCode(code);

    if (onOrderCreated) {
      onOrderCreated({
        id: code,
        clientName: clientInfo.name || 'Cliente Interessado',
        clientEmail: clientInfo.email || 'contato@exemplo.com',
        items: [formData.clothingType || 'Projeto Sob Medida'],
        clothingType: formData.clothingType,
        status: OrderStatus.PENDING,
        date: new Date().toLocaleDateString('pt-BR')
      });
    }
    
    setLoading(false);
    // Notificação automática ao finalizar
    setTimeout(() => {
        sendToWhatsApp();
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="bg-white rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.05)] overflow-hidden border border-stone-50 flex flex-col lg:flex-row min-h-[750px]">
        
        {/* Lado Esquerdo - Instruções */}
        <div className="lg:w-[35%] bg-stone-950 p-12 text-white flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#c5a059]/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <h2 className="text-4xl font-serif mb-8 leading-tight relative z-10">Envio de <span className="italic text-[#c5a059]">Medidas</span></h2>
          <p className="text-stone-400 font-light leading-relaxed mb-12 relative z-10">
            Nossos mestres alfaiates utilizam estas proporções para criar a estrutura inicial da sua peça. Precisão é o segredo da elegância.
          </p>
          
          <div className="space-y-6 mt-auto relative z-10">
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#c5a059] mb-2">Dica de Ouro</h4>
              <p className="text-xs text-stone-400 leading-relaxed italic">
                "Use uma fita métrica flexível e peça ajuda a alguém para garantir que a fita esteja nivelada ao redor do corpo."
              </p>
            </div>
          </div>
        </div>

        {/* Lado Direito - Formulário */}
        <div className="lg:w-[65%] p-12 flex flex-col">
          {!projectCode ? (
            <form onSubmit={handleSubmit} className="space-y-8 flex-grow animate-fade">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Seu Nome Completo</label>
                  <input type="text" name="clientName" required onChange={handleChange} className="w-full bg-stone-50 border-b border-stone-200 py-3 text-stone-900 focus:border-[#c5a059] outline-none font-serif text-lg" placeholder="Ex: João Silva" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Peça Desejada</label>
                  <select name="clothingType" value={formData.clothingType} onChange={handleChange} className="w-full bg-stone-50 border-b border-stone-200 py-3 text-stone-900 focus:border-[#c5a059] outline-none font-serif text-lg appearance-none">
                    <option>Terno Completo (3 peças)</option>
                    <option>Costume (2 peças)</option>
                    <option>Vestido de Gala</option>
                    <option>Camisa Social de Luxo</option>
                    <option>Calça de Alfaiataria</option>
                    <option>Blazer / Paletó</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 mb-8">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">E-mail para Contato</label>
                  <input type="email" name="clientEmail" required onChange={handleChange} className="w-full bg-stone-50 border-b border-stone-200 py-3 text-stone-900 focus:border-[#c5a059] outline-none font-serif text-lg" placeholder="seu@email.com" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {[
                  { label: 'Cintura', name: 'waist' },
                  { label: 'Peito', name: 'chest' },
                  { label: 'Quadril', name: 'hips' },
                  { label: 'Ombros', name: 'shoulders' },
                ].map((field) => (
                  <div key={field.name} className="space-y-2">
                    <label className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">{field.label}</label>
                    <div className="relative">
                      <input type="number" name={field.name} required onChange={handleChange} className="w-full bg-stone-50 border-b border-stone-100 py-2 text-stone-900 focus:border-[#c5a059] outline-none text-base font-serif" placeholder="0" />
                      <span className="absolute right-0 bottom-2 text-[9px] text-stone-300">cm</span>
                    </div>
                  </div>
                ))}
              </div>

              <button type="submit" disabled={loading} className="w-full bg-stone-900 text-white font-bold py-6 rounded-2xl transition-all shadow-2xl hover:bg-[#c5a059] disabled:opacity-50 group">
                <span className="text-xs uppercase tracking-[0.3em]">
                  {loading ? 'Processando Medidas...' : 'Enviar e Notificar Ateliê'}
                </span>
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-in zoom-in-95 duration-700">
               <div className="w-24 h-24 bg-[#c5a059]/10 rounded-full flex items-center justify-center text-[#c5a059] mb-4">
                  <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                  </svg>
               </div>
               <div>
                 <h3 className="text-4xl font-serif text-stone-900 mb-2">Obra de Arte Iniciada</h3>
                 <p className="text-stone-500 font-light">Seu pedido foi registrado. Notificamos o proprietário via WhatsApp.</p>
                 <div className="mt-6 p-6 bg-stone-50 rounded-3xl border-2 border-dashed border-[#c5a059]/30 inline-block">
                    <span className="text-4xl font-serif font-bold tracking-widest text-stone-900">{projectCode}</span>
                 </div>
               </div>
               
               <div className="max-w-md bg-[#faf9f6] p-8 rounded-3xl border border-stone-100 italic font-serif text-stone-600">
                 "{feedback}"
               </div>

               <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
                 <button onClick={sendToWhatsApp} className="flex-grow bg-[#25D366] text-white py-5 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl hover:scale-[1.02] transition-all">
                   Reenviar Medidas via WhatsApp
                 </button>
                 <button onClick={() => window.location.reload()} className="px-8 py-5 border border-stone-200 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-stone-50 transition-all">
                   Voltar
                 </button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MeasurementsForm;
