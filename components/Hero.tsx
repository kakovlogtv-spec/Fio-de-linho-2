
import React from 'react';
import { WHATSAPP_NUMBER } from '../constants.tsx';

interface HeroProps {
  onExplore: () => void;
  onStatus: () => void;
  onBooking: () => void;
}

const Hero: React.FC<HeroProps> = ({ onExplore, onStatus, onBooking }) => {
  return (
    <div className="relative min-h-[85vh] flex items-center rounded-[3rem] overflow-hidden bg-stone-900 group shadow-2xl">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1556905055-8f358a7a4bb4?auto=format&fit=crop&q=80&w=2000" 
          alt="Alta Costura" 
          className="h-full w-full object-cover opacity-60 transition-transform duration-[15s] group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 sm:px-16 py-24 w-full">
        <div className="max-w-3xl">
          <div className="flex items-center gap-4 mb-8 animate-in fade-in slide-in-from-left-4 duration-700">
            <div className="h-px w-16 bg-[#c5a059]"></div>
            <span className="text-[#c5a059] text-[10px] font-bold uppercase tracking-[0.5em]">Maison de Haute Couture Salvador</span>
          </div>
          
          <h1 className="text-6xl sm:text-8xl font-serif font-medium text-white leading-[1.1] mb-10 animate-in fade-in slide-in-from-left-8 duration-1000">
            A Arte do <br />
            <span className="italic font-light text-[#e2c08d]">Caimento Perfeito</span>
          </h1>
          
          <p className="text-stone-300 text-xl leading-relaxed mb-12 max-w-lg animate-in fade-in slide-in-from-left-12 duration-1000 delay-200 font-light">
            Onde a tradição da alfaiataria baiana encontra a tecnologia da nova era. Peças únicas, feitas sob medida para sua história.
          </p>
          
          <div className="flex flex-wrap items-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
            <button
              onClick={onExplore}
              className="px-12 py-6 bg-[#c5a059] text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-full hover:bg-[#b08d4a] transition-all hover:shadow-[0_0_30px_rgba(197,160,89,0.3)] active:scale-95"
            >
              Explorar Coleção
            </button>
            <button
              onClick={onBooking}
              className="px-12 py-6 border border-white/30 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-full hover:bg-white/10 transition-all active:scale-95"
            >
              Agendar Experiência
            </button>
          </div>
        </div>
      </div>

      {/* Floating Badge */}
      <div className="hidden xl:flex absolute bottom-20 right-20 flex-col items-center gap-4 animate-bounce duration-[3s]">
         <div className="w-px h-24 bg-gradient-to-b from-transparent to-[#c5a059]"></div>
         <span className="text-[#c5a059] text-[9px] font-bold uppercase tracking-widest vertical-rl">Scroll Experience</span>
      </div>
    </div>
  );
};

export default Hero;
