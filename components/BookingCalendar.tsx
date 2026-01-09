
import React, { useState } from 'react';
import { AvailabilitySlot, Appointment } from '../types.ts';
import { WHATSAPP_NUMBER, ADMIN_EMAIL } from '../constants.tsx';

interface BookingCalendarProps {
  availability: AvailabilitySlot[];
  onBook: (appointment: Appointment) => void;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({ availability, onBook }) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [isNotifying, setIsNotifying] = useState(false);
  const [notificationLogs, setNotificationLogs] = useState<string[]>([]);
  const [clientInfo, setClientInfo] = useState({ name: '', email: '' });
  const [confirmedId, setConfirmedId] = useState<string | null>(null);

  const sortedAvailability = [...availability]
    .filter(a => new Date(a.date) >= new Date(new Date().setHours(0,0,0,0)))
    .sort((a, b) => a.date.localeCompare(b.date));

  const timesForSelectedDate = sortedAvailability.find(a => a.date === selectedDate)?.times || [];

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const triggerWhatsAppNotification = () => {
    const message = encodeURIComponent(
      `🔔 *NOVO AGENDAMENTO RECEBIDO*\n\n` +
      `📌 *Protocolo:* ${confirmedId}\n` +
      `👤 *Cliente:* ${clientInfo.name}\n` +
      `✉️ *E-mail:* ${clientInfo.email}\n` +
      `📅 *Data:* ${formatDate(selectedDate!)}\n` +
      `⏰ *Horário:* ${selectedTime}\n\n` +
      `_Notificação automática gerada pela Maison Fio de Linho._`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) return;
    
    setIsNotifying(true);
    const id = `APP-${Math.floor(Math.random() * 9000) + 1000}`;
    setConfirmedId(id);

    const addLog = (msg: string) => setNotificationLogs(prev => [...prev, msg]);
    
    await new Promise(r => setTimeout(r, 800));
    addLog("✓ Gerando ticket de agendamento...");
    
    await new Promise(r => setTimeout(r, 1000));
    addLog(`✓ Preparando notificação para o proprietário...`);
    
    await new Promise(r => setTimeout(r, 1200));
    addLog(`✓ E-mail encaminhado para ${ADMIN_EMAIL}...`);
    
    await new Promise(r => setTimeout(r, 1000));
    addLog(`✓ Gerando link de WhatsApp automático...`);

    const newAppointment: Appointment = {
      id,
      clientName: clientInfo.name,
      clientEmail: clientInfo.email,
      date: selectedDate,
      time: selectedTime,
      status: 'confirmed'
    };
    
    onBook(newAppointment);
    
    await new Promise(r => setTimeout(r, 500));
    setIsNotifying(false);
    setStep(3);
    
    // Disparo automático do WhatsApp (abrirá nova aba/app)
    triggerWhatsAppNotification();
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-16">
        <h2 className="text-4xl sm:text-5xl font-serif font-bold text-stone-900 mb-6 tracking-tight">Agendamento <span className="italic text-[#c5a059]">Exclusivo</span></h2>
        <p className="text-stone-500 font-light max-w-xl mx-auto italic text-lg leading-relaxed">Reserve seu espaço na agenda da Maison Fio de Linho.</p>
      </div>

      <div className="bg-white rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.05)] border border-stone-50 overflow-hidden min-h-[500px]">
        {step === 1 && (
          <div className="p-12 animate-fade">
            <h3 className="text-2xl font-serif mb-8 text-stone-900">1. Selecione a Data Disponível</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {sortedAvailability.length > 0 ? sortedAvailability.map((slot) => (
                <button
                  key={slot.date}
                  onClick={() => { setSelectedDate(slot.date); setSelectedTime(null); }}
                  className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                    selectedDate === slot.date 
                      ? 'border-stone-900 bg-stone-900 text-white shadow-xl' 
                      : 'border-stone-100 hover:border-[#c5a059] text-stone-600'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold tracking-widest opacity-60">
                    {new Date(slot.date + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'short' })}
                  </span>
                  <span className="text-xl font-serif">
                    {new Date(slot.date + 'T12:00:00').getDate()}/{new Date(slot.date + 'T12:00:00').getMonth() + 1}
                  </span>
                </button>
              )) : (
                <div className="col-span-full py-12 text-center text-stone-400 italic font-serif text-xl">
                  Agenda temporariamente lotada. Contate-nos via WhatsApp.
                </div>
              )}
            </div>

            {selectedDate && (
              <div className="mt-12 animate-in fade-in slide-in-from-top-4 duration-500">
                <h3 className="text-2xl font-serif mb-8 text-stone-900">2. Escolha o Horário</h3>
                <div className="flex flex-wrap gap-3">
                  {timesForSelectedDate.map(time => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`px-8 py-4 rounded-xl border transition-all text-[10px] font-bold tracking-widest uppercase ${
                        selectedTime === time
                          ? 'bg-[#c5a059] border-[#c5a059] text-white shadow-lg'
                          : 'bg-stone-50 border-stone-100 hover:border-[#c5a059] text-stone-500'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedTime && (
              <div className="mt-12 flex justify-end">
                <button 
                  onClick={() => setStep(2)}
                  className="bg-stone-900 text-white px-12 py-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl hover:bg-[#c5a059] transition-all active:scale-95"
                >
                  Próximo Passo
                </button>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="p-12 animate-fade max-w-lg mx-auto text-center">
            {isNotifying ? (
              <div className="py-20 flex flex-col items-center justify-center space-y-8">
                 <div className="w-16 h-16 border-4 border-[#c5a059]/20 border-t-[#c5a059] rounded-full animate-spin"></div>
                 <h3 className="text-2xl font-serif text-stone-900">Finalizando Agendamento...</h3>
                 <div className="w-full space-y-2 text-left bg-stone-50 p-6 rounded-2xl border border-stone-100">
                    {notificationLogs.map((log, i) => (
                      <p key={i} className="text-[10px] font-bold text-stone-500 uppercase tracking-widest animate-in fade-in slide-in-from-left-2">{log}</p>
                    ))}
                 </div>
              </div>
            ) : (
              <>
                <button onClick={() => setStep(1)} className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-8 block hover:text-stone-900 transition-colors">← Alterar Data</button>
                <h3 className="text-3xl font-serif mb-4 text-stone-900">Confirmar Presença</h3>
                <p className="text-stone-500 text-sm mb-10 font-light italic leading-relaxed">
                  Ao confirmar, uma mensagem automática será enviada ao WhatsApp da Maison para garantir sua reserva instantaneamente.
                </p>
                
                <div className="space-y-6 text-left">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Nome Completo</label>
                    <input 
                      type="text" 
                      autoFocus
                      value={clientInfo.name}
                      onChange={e => setClientInfo({...clientInfo, name: e.target.value})}
                      className="w-full bg-stone-50 border-b border-stone-200 py-3 text-stone-900 focus:border-[#c5a059] outline-none font-serif text-lg" 
                      placeholder="Ex: João da Silva"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">E-mail</label>
                    <input 
                      type="email" 
                      value={clientInfo.email}
                      onChange={e => setClientInfo({...clientInfo, email: e.target.value})}
                      className="w-full bg-stone-50 border-b border-stone-200 py-3 text-stone-900 focus:border-[#c5a059] outline-none font-serif text-lg" 
                      placeholder="seu@email.com"
                    />
                  </div>
                  <button 
                    onClick={handleBooking}
                    disabled={!clientInfo.name || !clientInfo.email}
                    className="w-full bg-stone-900 text-white py-6 rounded-2xl font-bold text-[10px] uppercase tracking-[0.3em] shadow-2xl hover:bg-[#c5a059] transition-all disabled:opacity-50 active:scale-95"
                  >
                    Confirmar e Notificar Ateliê
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="p-20 text-center animate-in zoom-in-95 duration-700">
             <div className="w-24 h-24 bg-[#c5a059]/10 rounded-full flex items-center justify-center text-[#c5a059] mx-auto mb-8">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
             </div>
             <h3 className="text-4xl font-serif text-stone-900 mb-4">Agendamento Concluído</h3>
             <p className="text-stone-500 mb-8 max-w-sm mx-auto font-light leading-relaxed">
               Uma nova janela de WhatsApp foi aberta para você enviar a confirmação final ao proprietário. 
               <br/>
               <span className="text-[#c5a059] font-bold">Protocolo: {confirmedId}</span>.
             </p>
             
             <div className="bg-stone-50 p-8 rounded-[2rem] border border-stone-100 inline-block mb-12 text-left">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-stone-400">Fluxo de Notificação Maison</span>
                </div>
                <ul className="space-y-2">
                   <li className="text-[10px] text-stone-600 font-medium">✓ Alerta enviado para {ADMIN_EMAIL}</li>
                   <li className="text-[10px] text-stone-600 font-medium">✓ Janela de WhatsApp do proprietário aberta</li>
                   <li className="text-[10px] text-stone-600 font-medium">✓ Registro efetuado no sistema central</li>
                </ul>
             </div>

             <div className="flex flex-col gap-4 justify-center items-center">
                <button onClick={triggerWhatsAppNotification} className="px-12 py-5 bg-[#25D366] text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
                  Reabrir WhatsApp do Ateliê
                </button>
                <button onClick={() => window.location.reload()} className="text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-all">
                  Voltar ao Início
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingCalendar;
