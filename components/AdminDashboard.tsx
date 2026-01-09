
import React, { useState } from 'react';
import { Order, OrderStatus, Appointment, AvailabilitySlot } from '../types.ts';

interface AdminDashboardProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  appointments: Appointment[];
  availability: AvailabilitySlot[];
  onUpdateAvailability: (newAvailability: AvailabilitySlot[]) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ orders, onUpdateStatus, appointments, availability, onUpdateAvailability }) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'appointments' | 'availability'>('orders');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  const statusColors: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: 'bg-amber-50 text-amber-700 border-amber-200',
    [OrderStatus.MEASURED]: 'bg-blue-50 text-blue-700 border-blue-200',
    [OrderStatus.IN_CUTTING]: 'bg-orange-50 text-orange-700 border-orange-200',
    [OrderStatus.IN_PRODUCTION]: 'bg-purple-50 text-purple-700 border-purple-200',
    [OrderStatus.QUALITY_CHECK]: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    [OrderStatus.READY]: 'bg-green-50 text-green-700 border-green-200',
    [OrderStatus.DELIVERED]: 'bg-stone-50 text-stone-500 border-stone-200',
  };

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDate || !newTime) return;

    const existingSlotIndex = availability.findIndex(s => s.date === newDate);
    if (existingSlotIndex > -1) {
      const updated = [...availability];
      if (!updated[existingSlotIndex].times.includes(newTime)) {
        updated[existingSlotIndex].times.push(newTime);
        updated[existingSlotIndex].times.sort();
        onUpdateAvailability(updated);
      }
    } else {
      onUpdateAvailability([...availability, { date: newDate, times: [newTime] }].sort((a,b) => a.date.localeCompare(b.date)));
    }
    setNewTime('');
  };

  const handleRemoveTime = (date: string, time: string) => {
    const updated = availability.map(s => {
      if (s.date === date) {
        return { ...s, times: s.times.filter(t => t !== time) };
      }
      return s;
    }).filter(s => s.times.length > 0);
    onUpdateAvailability(updated);
  };

  const handleRemoveDate = (date: string) => {
    if (window.confirm(`Deseja remover todos os horários do dia ${new Date(date).toLocaleDateString()}?`)) {
      onUpdateAvailability(availability.filter(s => s.date !== date));
    }
  };

  return (
    <div className="space-y-12 animate-fade py-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <div className="inline-block px-4 py-1 bg-stone-950 text-white rounded-full mb-4">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Console de Gestão de Alfaiataria</span>
          </div>
          <h2 className="text-5xl font-serif font-bold text-stone-900 tracking-tight">Maison <span className="text-[#c5a059]">Control</span></h2>
          <p className="text-stone-500 mt-2 font-light text-lg">Central de operações para pedidos e agendamentos.</p>
        </div>
      </div>

      <div className="flex gap-4 border-b border-stone-100 overflow-x-auto whitespace-nowrap scrollbar-hide">
        {[
          { id: 'orders', label: 'Produção' },
          { id: 'appointments', label: 'Agendamentos' },
          { id: 'availability', label: 'Agenda Atelier' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-8 py-4 text-[10px] font-bold uppercase tracking-widest border-b-2 transition-all ${
              activeTab === tab.id ? 'border-[#c5a059] text-stone-900' : 'border-transparent text-stone-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'orders' && (
        <div className="bg-white rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.04)] border border-stone-50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50/50 border-b border-stone-100">
                  <th className="px-8 py-6 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Protocolo / Peça</th>
                  <th className="px-8 py-6 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Cliente</th>
                  <th className="px-8 py-6 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Estado de Produção</th>
                  <th className="px-8 py-6 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Ações Rápidas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50/50 transition-all duration-300">
                    <td className="px-8 py-8">
                      <span className="font-serif text-lg font-bold text-stone-900">{order.id}</span>
                      <p className="text-[10px] text-[#c5a059] font-bold uppercase mt-1 tracking-tight">{order.items[0]}</p>
                      <p className="text-[9px] text-stone-300 font-bold uppercase mt-1">{order.date}</p>
                    </td>
                    <td className="px-8 py-8">
                      <div>
                        <p className="font-serif text-lg text-stone-900 leading-tight">{order.clientName}</p>
                        <p className="text-xs text-stone-400 font-light">{order.clientEmail}</p>
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-8">
                      <select
                        value={order.status}
                        onChange={(e) => onUpdateStatus(order.id, e.target.value as OrderStatus)}
                        className="bg-white border border-stone-200 rounded-xl text-[10px] font-bold uppercase tracking-widest py-3 px-4 focus:ring-2 focus:ring-[#c5a059]/20 outline-none cursor-pointer w-full"
                      >
                        {Object.values(OrderStatus).map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'appointments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.length > 0 ? appointments.map(app => (
            <div key={app.id} className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-100 flex flex-col justify-between hover:shadow-xl transition-all group">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <span className="text-[10px] font-bold text-[#c5a059] uppercase tracking-widest">{app.id}</span>
                  <span className="px-3 py-1 bg-green-50 text-green-600 text-[8px] font-bold uppercase tracking-widest rounded-full">Confirmado</span>
                </div>
                <h4 className="text-2xl font-serif text-stone-900 mb-1">{app.clientName}</h4>
                <p className="text-stone-400 text-xs mb-6 font-light">{app.clientEmail}</p>
                <div className="flex items-center gap-4 text-stone-600">
                  <div className="flex items-center gap-2 bg-stone-50 px-3 py-1.5 rounded-lg">
                    <svg className="w-3 h-3 text-[#c5a059]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <span className="text-[10px] font-bold uppercase tracking-tight">{new Date(app.date + 'T12:00:00').toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-stone-50 px-3 py-1.5 rounded-lg">
                    <svg className="w-3 h-3 text-[#c5a059]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="text-[10px] font-bold uppercase tracking-tight">{app.time}</span>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-24 text-center text-stone-300 font-serif italic text-xl bg-white rounded-[2rem] border-2 border-dashed border-stone-100">
              Nenhum agendamento para os próximos dias.
            </div>
          )}
        </div>
      )}

      {activeTab === 'availability' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Formulário de Adição */}
          <div className="lg:col-span-1">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-stone-100 sticky top-32">
              <h3 className="text-2xl font-serif text-stone-900 mb-6">Abrir Disponibilidade</h3>
              
              <div className="p-4 bg-[#c5a059]/5 border border-[#c5a059]/20 rounded-2xl mb-8">
                 <p className="text-[10px] font-bold text-[#c5a059] uppercase tracking-widest mb-1">Padrão da Maison</p>
                 <p className="text-xs text-stone-600 font-light leading-relaxed">
                   Atendimento padrão: Seg a Sex, das 16:30 às 18:00 (4 slots).
                 </p>
              </div>

              <form onSubmit={handleAddSlot} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Data do Atendimento</label>
                  <input 
                    type="date" 
                    value={newDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => setNewDate(e.target.value)}
                    className="w-full p-4 rounded-xl bg-stone-50 border border-stone-100 outline-none focus:ring-2 focus:ring-[#c5a059]/10 focus:border-[#c5a059] transition-all font-medium" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Horário</label>
                  <input 
                    type="time" 
                    value={newTime}
                    onChange={e => setNewTime(e.target.value)}
                    className="w-full p-4 rounded-xl bg-stone-50 border border-stone-100 outline-none focus:ring-2 focus:ring-[#c5a059]/10 focus:border-[#c5a059] transition-all font-medium" 
                  />
                </div>
                <button type="submit" className="w-full bg-stone-900 text-white py-5 rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-xl hover:bg-[#c5a059] transition-all active:scale-95">
                  Confirmar e Abrir Slot
                </button>
              </form>
            </div>
          </div>

          {/* Lista de Disponibilidade */}
          <div className="lg:col-span-2">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-stone-100 min-h-[500px]">
              <h3 className="text-2xl font-serif text-stone-900 mb-8">Datas Ativas no Site</h3>
              <div className="space-y-6">
                {availability.length > 0 ? availability.map(slot => (
                  <div key={slot.date} className="p-8 bg-stone-50/50 rounded-3xl border border-stone-100 group">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-stone-900 border border-stone-100">
                           <span className="font-serif text-lg font-bold">{new Date(slot.date + 'T12:00:00').getDate()}</span>
                        </div>
                        <div>
                          <span className="font-serif text-xl text-stone-900 block capitalize">
                            {new Date(slot.date + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', month: 'long' })}
                          </span>
                          <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">
                            {slot.times.length} horário(s) disponível(is)
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleRemoveDate(slot.date)}
                        className="text-red-400 hover:text-red-600 text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all"
                      >
                        Fechar Dia
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      {slot.times.map(t => (
                        <div key={t} className="relative group/time">
                          <div className="px-5 py-2.5 bg-white border border-stone-100 rounded-xl text-[10px] font-bold tracking-[0.1em] text-stone-600 flex items-center gap-3 shadow-sm">
                            {t}
                            <button 
                              onClick={() => handleRemoveTime(slot.date, t)}
                              className="text-stone-300 hover:text-red-500 transition-colors"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )) : (
                  <div className="py-20 text-center flex flex-col items-center">
                    <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center text-stone-300 mb-4">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                    <p className="text-stone-300 italic font-serif text-xl">Sua agenda externa está vazia.</p>
                    <p className="text-stone-400 text-xs font-bold uppercase tracking-widest mt-2">Use o formulário ao lado para abrir novos dias.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
