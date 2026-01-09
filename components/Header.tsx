
import React, { useState, useEffect } from 'react';
import { User } from '../types.ts';

interface HeaderProps {
  currentView: string;
  setView: (view: any) => void;
  user: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView, user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Coleção', value: 'collection' },
    { label: 'Agendar', value: 'booking' },
    { label: 'Concierge IA', value: 'concierge' },
    { label: 'Medidas', value: 'measurements' },
    { label: 'Pedidos', value: 'status' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-700 ${
      scrolled ? 'py-4' : 'py-8'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className={`relative flex justify-between items-center transition-all duration-700 rounded-full px-10 ${
          scrolled ? 'glass shadow-[0_15px_40px_rgba(0,0,0,0.08)] border border-white/50 h-16' : 'h-20 border border-transparent'
        }`}>
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer group" onClick={() => setView('home')}>
            <span className="font-serif text-2xl font-bold tracking-tighter text-stone-900 flex items-center gap-2">
              <span className="text-[#c5a059] group-hover:rotate-12 transition-transform">✦</span>
              FIO <span className="font-light text-stone-400 italic">de</span> LINHO
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-10">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => setView(item.value)}
                className={`text-[10px] font-bold uppercase tracking-[0.3em] transition-all hover:text-[#c5a059] relative py-2 ${
                  currentView === item.value ? 'text-stone-900' : 'text-stone-400'
                }`}
              >
                {item.label}
                {currentView === item.value && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#c5a059] rounded-full animate-pulse" />
                )}
              </button>
            ))}
            
            {user?.role === 'admin' && (
              <button
                onClick={() => setView('admin')}
                className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#c5a059] border border-[#c5a059]/30 px-6 py-2.5 rounded-full hover:bg-[#c5a059] hover:text-white transition-all shadow-lg shadow-[#c5a059]/10"
              >
                Admin
              </button>
            )}

            <div className="h-4 w-px bg-stone-200"></div>

            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-[9px] font-bold text-stone-300 uppercase tracking-widest">{user.role}</span>
                  <span className="text-xs font-semibold text-stone-700">{user.name.split(' ')[0]}</span>
                </div>
                <div className="relative group cursor-pointer">
                  <img src={user.photo} alt={user.name} className="w-10 h-10 rounded-full ring-2 ring-stone-100 group-hover:ring-[#c5a059]/30 transition-all object-cover" />
                  <div className="absolute top-full right-0 mt-3 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                    <button onClick={onLogout} className="bg-white shadow-2xl border border-stone-100 px-8 py-4 rounded-2xl text-[10px] font-bold text-red-500 whitespace-nowrap hover:bg-red-50 uppercase tracking-widest">Encerrar Sessão VIP</button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setView('login')}
                className="bg-stone-900 text-white text-[10px] font-bold py-3.5 px-8 rounded-full hover:bg-stone-800 transition uppercase tracking-[0.2em] shadow-xl shadow-stone-900/10 active:scale-95"
              >
                Acesso Exclusivo
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-stone-900 p-2"
            >
              <div className="w-6 h-5 flex flex-col justify-between items-end">
                <span className={`h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'w-6 translate-y-2 rotate-45' : 'w-6'}`} />
                <span className={`h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'w-4'}`} />
                <span className={`h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'w-6 -translate-y-2.5 -rotate-45' : 'w-5'}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="lg:hidden glass border-b border-stone-200 animate-in slide-in-from-top duration-500 overflow-hidden mx-6 mt-4 rounded-[2.5rem] shadow-2xl">
          <div className="px-10 py-12 space-y-6">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => { setView(item.value); setIsMenuOpen(false); }}
                className={`block w-full text-left text-2xl font-serif ${
                  currentView === item.value ? 'text-[#c5a059]' : 'text-stone-900'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-8 border-t border-stone-100">
              {user ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img src={user.photo} className="w-14 h-14 rounded-full" />
                    <span className="font-serif text-xl">{user.name}</span>
                  </div>
                  <button onClick={onLogout} className="text-red-500 font-bold uppercase text-[10px] tracking-widest">Sair</button>
                </div>
              ) : (
                <button
                  onClick={() => { setView('login'); setIsMenuOpen(false); }}
                  className="w-full bg-stone-900 text-white py-5 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl"
                >
                  Entrar com Google
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
