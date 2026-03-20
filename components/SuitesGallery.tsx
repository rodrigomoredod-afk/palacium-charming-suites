
import React, { useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { ArrowRight, UtensilsCrossed, Plus } from 'lucide-react';
import { ViewType } from '../types';

interface SuitesGalleryProps {
  navigateTo: (view: ViewType) => void;
  openBooking: () => void;
}

const SuitesGallery: React.FC<SuitesGalleryProps> = ({ navigateTo, openBooking }) => {
  const { suites } = useData();
  
  const featuredSuites = useMemo(() => {
    const regis = suites.find(s => s.id === '102');
    const deluxe = suites.find(s => s.id === '205');
    const familiar = suites.find(s => s.id === '201');
    return [regis, deluxe, familiar].filter(Boolean) as typeof suites;
  }, [suites]);

  return (
    <section id="suites" className="py-24 md:py-40 px-6 md:px-16 bg-bone">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16 md:mb-24">
        <div className="scroll-reveal">
          <span className="text-gold uppercase tracking-[0.4em] text-xs font-semibold block mb-4">Alojamento</span>
          <h2 className="font-serif text-4xl md:text-7xl text-charcoal leading-tight md:leading-[0.9]">
            Refúgios <span className="italic font-light">Reais.</span>
          </h2>
        </div>
        <div className="max-w-sm scroll-reveal [transition-delay:200ms]">
          <p className="text-charcoal/60 text-sm leading-relaxed mb-6">
            Uma curadoria seleta de espaços onde a história encontra o conforto absoluto. Cada suite é uma narrative única de design e sofisticação.
          </p>
          <button 
            onClick={() => navigateTo('suites')}
            className="hidden md:flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] font-bold text-gold hover:gap-5 transition-all"
          >
            Ver Coleção Completa <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-x-12">
        {featuredSuites.map((suite, idx) => (
          <div key={suite.id} className={`group relative scroll-reveal [transition-delay:${idx * 150}ms]`}>
            <div className="overflow-hidden aspect-[4/5] relative mb-8 rounded-none shadow-sm group-hover:shadow-2xl transition-shadow duration-700">
              <img 
                src={suite.image} 
                alt={suite.name} 
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex flex-col justify-end p-8">
                <button 
                  onClick={openBooking}
                  className="w-full bg-white text-charcoal py-4 uppercase text-[9px] tracking-[0.3em] font-bold transform translate-y-10 group-hover:translate-y-0 transition-transform duration-500 hover:bg-gold hover:text-white rounded-none"
                >
                  Reservar Suite
                </button>
              </div>
            </div>
            
            <div className="space-y-4 px-1">
              <div className="flex justify-between items-baseline">
                <h3 className="font-serif text-2xl md:text-3xl text-charcoal group-hover:text-gold transition-colors">{suite.name}</h3>
                <span className="text-[10px] text-charcoal/30 uppercase tracking-widest font-semibold [font-variant-numeric:lining-nums]">{suite.area}</span>
              </div>
              <p className="text-sm text-charcoal/50 leading-relaxed font-light line-clamp-2">
                {suite.description}
              </p>
              <div className="flex flex-col gap-2 pt-2">
                 <div className="flex items-center gap-2">
                   <div className="w-8 h-[1px] bg-gold/50"></div>
                   <span className="text-[9px] uppercase tracking-widest text-gold font-bold [font-variant-numeric:lining-nums]">Desde €{suite.price} / noite</span>
                 </div>
                 <div className="flex items-center gap-2 opacity-60">
                    <UtensilsCrossed className="w-3 h-3 text-gold" />
                    <span className="text-[8px] uppercase tracking-[0.2em] font-bold text-charcoal">Pequeno-almoço incluído</span>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 md:mt-32 flex justify-center scroll-reveal">
        <button 
          onClick={() => navigateTo('suites')}
          className="group relative flex items-center gap-6 px-12 py-6 border border-charcoal/10 hover:border-gold transition-all duration-500 rounded-none overflow-hidden"
        >
          <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
          <span className="relative z-10 text-[11px] uppercase tracking-[0.4em] font-black text-charcoal group-hover:text-white transition-colors">
            Explorar Coleção Completa
          </span>
          <Plus className="relative z-10 w-4 h-4 text-gold group-hover:text-white group-hover:rotate-90 transition-all duration-500" />
        </button>
      </div>
    </section>
  );
};

export default SuitesGallery;
