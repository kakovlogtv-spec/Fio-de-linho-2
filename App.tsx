
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      console.warn("Scroll reset failed", e);
    }
  }, [currentView]);

  // Fallback para evitar crash total se algo falhar no render
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-stone-50 p-10 text-center">
        <div className="max-w-md">
          <h1 className="text-3xl font-serif mb-4 text-stone-900">Maison em Manutenção</h1>
          <p className="text-stone-500 mb-8 font-light leading-relaxed">Ocorreu um erro inesperado ao carregar a plataforma. Nossa equipe técnica já foi notificada.</p>
          <button onClick={() => window.location.reload()} className="bg-stone-900 text-white px-8 py-3 rounded-full font-bold uppercase text-[10px] tracking-widest">Recarregar</button>
        </div>
      </div>
    );
  }

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
                Portal do Cliente VIP
              </button>
              <button onClick={() => handleLogin('admin')} className="w-full py-5 rounded-2xl bg-stone-900 text-white hover:bg-stone-800 transition-all font-bold shadow-xl text-xs uppercase tracking-widest">
                Dashboard Proprietário
              </button>
            </div>
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
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="w-12 h-12 border-4 border-[#c5a059]/20 border-t-[#c5a059] rounded-full animate-spin"></div>
            </div>
          ) : renderContent()}
        </div>
      </main>
      <footer className="bg-stone-950 text-stone-500 py-24 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 relative z-10">
          <div className="space-y-6 md:col-span-2">
            <h3 className="font-serif text-white text-3xl tracking-tighter">FIO <span className="text-[#c5a059]">de</span> LINHO</h3>
            <p className="text-sm font-light text-stone-400 max-w-sm leading-relaxed">Referência em alta alfaiataria no coração de Salvador.</p>
          </div>
          <div className="space-y-6">
            <h4 className="text-white font-bold text-[10px] uppercase tracking-[0.3em]">Navegação Maison</h4>
            <ul className="space-y-4 text-xs font-medium uppercase tracking-widest">
              <li><button onClick={() => setCurrentView('collection')} className="hover:text-[#c5a059] transition text-left">Coleções Atuais</button></li>
              <li><button onClick={() => setCurrentView('booking')} className="hover:text-[#c5a059] transition text-left">Agendamento VIP</button></li>
              <li><button onClick={() => setCurrentView('measurements')} className="hover:text-[#c5a059] transition text-left">Central de Medidas</button></li>
              <li><button onClick={() => setCurrentView('status')} className="hover:text-[#c5a059] transition text-left">Acompanhamento</button></li>
            </ul>
          </div>
        </div>
      </footer>
      <WhatsAppButton />
    </div>
  );
};

export default App;
