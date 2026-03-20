
import React from 'react';
import { ViewType } from '../types';

interface FinalCTAProps {
  navigateTo: (view: ViewType) => void;
  openBooking: () => void;
}

const FinalCTA: React.FC<FinalCTAProps> = ({ navigateTo, openBooking }) => {
  return (
    <section id="cta" className="py-32 px-8 bg-bone relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10 scroll-reveal">
        <h2 className="font-serif text-4xl md:text-6xl text-charcoal mb-8">
          Pronto para a sua próxima estadia?
        </h2>
        <p className="text-charcoal/60 mb-12 text-lg max-w-xl mx-auto">
          Reserve diretamente connosco para obter a melhor tarifa garantida e benefícios exclusivos.
        </p>
        <button 
          onClick={openBooking}
          className="bg-gold text-white px-12 py-5 uppercase text-xs tracking-[0.3em] font-medium hover:bg-charcoal rounded-none transition-all duration-500 shadow-xl hover:shadow-2xl"
        >
          Faça a sua reserva
        </button>
      </div>
    </section>
  );
};

export default FinalCTA;
