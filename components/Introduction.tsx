
import React from 'react';
import { FEATURES } from '../constants';
import { introductionImages } from '../images';

interface IntroductionProps {
  navigateTo: (view: 'home' | 'history') => void;
}

const Introduction: React.FC<IntroductionProps> = ({ navigateTo }) => {
  return (
    <section id="heritage" className="py-24 md:py-40 px-6 md:px-16 bg-offwhite overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        
        {/* Editorial Text */}
        <div className="scroll-reveal space-y-10 order-2 lg:order-1">
          <div className="space-y-4">
            <span className="text-gold uppercase tracking-[0.4em] text-xs font-semibold block">Herança de 1905</span>
            <h2 className="font-serif text-4xl md:text-6xl text-charcoal leading-tight">
              Onde a pedra <br /> <span className="italic">conta histórias.</span>
            </h2>
          </div>
          
          <p className="text-charcoal/70 text-lg leading-relaxed font-light border-l-2 border-gold/30 pl-8">
            Situado numa propriedade histórica onde a robustez da pedra original se funde com a leveza da natureza, o Palacium é emoldurado por oliveiras centenárias. Aqui, cada detalhe arquitetónico de 1905 foi preservado para oferecer uma experiência de luxo autêntica, onde o granito ancestral encontra o design contemporâneo.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-6">
            {FEATURES.map((feature, idx) => (
              <div key={idx} className="group cursor-default">
                <div className="text-gold mb-3 transition-transform duration-500 group-hover:-translate-y-1">
                  {feature.icon}
                </div>
                <h4 className="text-[10px] uppercase tracking-widest text-charcoal font-bold">{feature.label}</h4>
              </div>
            ))}
          </div>

          <button 
            onClick={() => navigateTo('history')}
            className="text-xs uppercase tracking-[0.3em] font-bold border-b border-gold pb-2 hover:text-gold transition-colors"
          >
            Explorar a Herança
          </button>
        </div>

        {/* Visual Composition - Using the Real Reception Stairs Photo provided by User */}
        <div className="relative order-1 lg:order-2">
          <div className="relative z-10 aspect-[4/5] overflow-hidden rounded-sm shadow-2xl scroll-reveal">
            <img 
              src={introductionImages.heritage} 
              alt="Interiores históricos do Palacium" 
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-[3s] hover:scale-105"
            />
          </div>
          {/* Decorative Elements */}
          <div className="absolute -bottom-10 -left-10 w-2/3 aspect-square bg-bone -z-10 shadow-lg hidden md:block"></div>
          <div className="absolute -top-6 -right-6 font-serif text-[120px] text-gold/10 pointer-events-none select-none hidden lg:block">
            1905
          </div>
        </div>

      </div>
    </section>
  );
};

export default Introduction;
