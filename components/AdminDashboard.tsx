
import React from 'react';
import { Order, OrderStatus } from '../types';

interface AdminDashboardProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ orders, onUpdateStatus }) => {
  const statusColors: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: 'bg-amber-50 text-amber-700 border-amber-200',
    [OrderStatus.MEASURED]: 'bg-blue-50 text-blue-700 border-blue-200',
    [OrderStatus.IN_CUTTING]: 'bg-orange-50 text-orange-700 border-orange-200',
    [OrderStatus.IN_PRODUCTION]: 'bg-purple-50 text-purple-700 border-purple-200',
    [OrderStatus.QUALITY_CHECK]: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    [OrderStatus.READY]: 'bg-green-50 text-green-700 border-green-200',
    [OrderStatus.DELIVERED]: 'bg-stone-50 text-stone-500 border-stone-200',
  };

  return (
    <div className="space-y-12 animate-fade py-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <div className="inline-block px-4 py-1 bg-stone-950 text-white rounded-full mb-4">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Console de Gestão de Alfaiataria</span>
          </div>
          <h2 className="text-5xl font-serif font-bold text-stone-900 tracking-tight">Maison <span className="text-[#c5a059]">Control</span></h2>
          <p className="text-stone-500 mt-2 font-light text-lg">Atualize o status das peças conforme avançam no ateliê.</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.04)] border border-stone-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50/50 border-b border-stone-100">
                <th className="px-8 py-6 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Protocolo</th>
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
                    <p className="text-[10px] text-stone-400 font-bold uppercase mt-1">{order.date}</p>
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
                    <div className="relative group">
                      <select
                        value={order.status}
                        onChange={(e) => onUpdateStatus(order.id, e.target.value as OrderStatus)}
                        className="appearance-none bg-white border border-stone-200 rounded-xl text-[10px] font-bold uppercase tracking-widest py-3 pl-4 pr-10 focus:ring-2 focus:ring-[#c5a059]/20 focus:border-[#c5a059] outline-none cursor-pointer w-full shadow-sm"
                      >
                        {Object.values(OrderStatus).map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div className="p-20 text-center text-stone-300 font-serif italic text-xl">Nenhum projeto em andamento no momento.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
