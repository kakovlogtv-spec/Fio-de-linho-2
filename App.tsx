
import React, { useState, useEffect } from 'react';
import Header from './components/Header.tsx';
import Collection from './components/Collection.tsx';
import MeasurementsForm from './components/MeasurementsForm.tsx';
import OrderTracker from './components/OrderTracker.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';
import Hero from './components/Hero.tsx';
import WhatsAppButton from './components/WhatsAppButton.tsx';
import StyleConcierge from './components/StyleConcierge.tsx';
import BookingCalendar from './components/BookingCalendar.tsx';
import { User, Order, OrderStatus, Appointment, AvailabilitySlot } from './types.ts';
import { INITIAL_ORDERS, ADMIN_EMAIL, ATELIER_ADDRESS, INITIAL_AVAILABILITY, INITIAL_APPOINTMENTS } from './constants.tsx';

type View = 'home' | 'collection' | 'measurements' | 'status' | 'admin' | 'login' | 'concierge' | 'booking';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>(INITIAL_AVAILABILITY);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const handleLogin = (role: 'admin' | 'client') => {
    setLoading(true);
    setTimeout(() => {
      setUser({
        name: role === 'admin' ? 'Proprietário' : 'Cliente Vip',
        email: role === 'admin' ? ADMIN_EMAIL : 'cliente@exemplo.com',
        photo: role === 'admin' 
          ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100'
          : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
        role
      });
      setCurrentView(role === 'admin' ? 'admin' : 'home');
      setLoading(false);
    }, 600);
  };

  const addNewOrder = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const addAppointment = (app: Appointment) => {
    setAppointments(prev => [app, ...prev]);
    // Remove the slot from availability if we want strictly 1 per slot
    setAvailability(prev => prev.map(slot => {
      if (slot.date === app.date) {
        return { ...slot, times: slot.times.filter(t => t !== app.time) };
      }
      return slot;
    }).filter(slot => slot.times.length > 0));
  };

  const handleUpdateAvailability = (newAvailability: AvailabilitySlot[]) => {
    setAvailability(newAvailability);
  };

  const renderContent = () => {
    if (currentView === 'login') {
      return (
        <div className="flex items-center justify-center min-h-[60vh] animate-fade">
          <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl border border-stone-100 max-w-md w-full text-center">
            <h2 className="text-3xl font-serif font-bold mb-4 text-stone-900">Maison Fio de Linho</h2>
            <p className="text-stone-500 mb-10 font-light text-sm uppercase tracking-widest">Portal de Acesso Restrito</p>
            <div className="space-y-4">
              <button onClick={() => handleLogin('client')} className="w-full py-5 rounded-2xl border border-stone-200 hover:bg-stone-50 transition-all font-semibold flex items-center justify-center gap-3 text-stone-700">
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Portal do Cliente VIP
              </button>
              <button onClick={() => handleLogin('admin')} className="w-full py-5 rounded-2xl bg-stone-900 text-white hover:bg-stone-800 transition-all font-bold shadow-xl text-xs uppercase tracking-widest">
                Dashboard Proprietário
              </button>
            </div>
            {loading && <div className="mt-8 animate-pulse text-[10px] text-stone-400 uppercase tracking-[0.3em]">Preparando sua experiência...</div>}
          </div>
        </div>
      );
    }

    switch (currentView) {
      case 'home': return <Hero onExplore={() => setCurrentView('collection')} onStatus={() => setCurrentView('status')} onBooking={() => setCurrentView('booking')} />;
      case 'collection': return <Collection />;
      case 'measurements': return <MeasurementsForm onOrderCreated={addNewOrder} />;
      case 'concierge': return <StyleConcierge />;
      case 'status': return <OrderTracker orders={orders} />;
      case 'booking': return <BookingCalendar availability={availability} onBook={addAppointment} />;
      case 'admin': return user?.role === 'admin' ? (
        <AdminDashboard 
          orders={orders} 
          onUpdateStatus={updateOrderStatus} 
          appointments={appointments} 
          availability={availability} 
          onUpdateAvailability={handleUpdateAvailability}
        />
      ) : <Hero onExplore={() => setCurrentView('collection')} onStatus={() => setCurrentView('status')} onBooking={() => setCurrentView('booking')} />;
      default: return <Hero onExplore={() => setCurrentView('collection')} onStatus={() => setCurrentView('status')} onBooking={() => setCurrentView('booking')} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf8]">
      <Header currentView={currentView} setView={setCurrentView} user={user} onLogout={() => {setUser(null); setCurrentView('home');}} />
      <main className="flex-grow pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4">{renderContent()}</div>
      </main>
      <footer className="bg-stone-950 text-stone-500 py-24 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 relative z-10">
          <div className="space-y-6 md:col-span-2">
            <h3 className="font-serif text-white text-3xl tracking-tighter">FIO <span className="text-[#c5a059]">de</span> LINHO</h3>
            <p className="text-sm font-light text-stone-400 max-w-sm leading-relaxed">Referência em alta alfaiataria no coração de Salvador. Transformamos o clássico em eterno através de técnicas ancestrais e visão contemporânea.</p>
            <div className="flex gap-4 pt-4">
               {['Instagram', 'Facebook', 'LinkedIn'].map(social => (
                 <a key={social} href="#" className="w-10 h-10 rounded-full border border-stone-800 flex items-center justify-center text-stone-500 hover:border-[#c5a059] hover:text-white transition-all text-[10px] uppercase font-bold tracking-tighter">{social[0]}</a>
               ))}
            </div>
          </div>
          <div className="space-y-6">
            <h4 className="text-white font-bold text-[10px] uppercase tracking-[0.3em]">Navegação Maison</h4>
            <ul className="space-y-4 text-xs font-medium uppercase tracking-widest">
              <li><button onClick={() => setCurrentView('collection')} className="hover:text-[#c5a059] transition">Coleções Atuais</button></li>
              <li><button onClick={() => setCurrentView('booking')} className="hover:text-[#c5a059] transition">Agendamento VIP</button></li>
              <li><button onClick={() => setCurrentView('measurements')} className="hover:text-[#c5a059] transition">Central de Medidas</button></li>
              <li><button onClick={() => setCurrentView('status')} className="hover:text-[#c5a059] transition">Acompanhamento</button></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="text-white font-bold text-[10px] uppercase tracking-[0.3em]">O Ateliê</h4>
            <div className="space-y-2 text-sm text-stone-400">
               <p>{ATELIER_ADDRESS}</p>
               <p className="text-[#c5a059] font-bold">71 98406-0628</p>
               <p className="pt-4 text-xs italic">Aberto para visitas com agendamento prévio de segunda a sábado.</p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-stone-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] uppercase tracking-[0.4em]">© 2024 Fio de Linho | Excluisividade em Salvador</p>
          <div className="flex gap-8 text-[9px] uppercase tracking-widest text-stone-600">
             <a href="#" className="hover:text-stone-400">Privacidade</a>
             <a href="#" className="hover:text-stone-400">Termos</a>
             <a href="#" className="hover:text-stone-400">FAQ</a>
          </div>
        </div>
      </footer>
      <WhatsAppButton />
    </div>
  );
};

export default App;
