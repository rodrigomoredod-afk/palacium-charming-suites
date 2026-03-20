
import React from 'react';
// Fix: Import ViewType from types.ts instead of App.tsx
import { ViewType } from '../types';
import { Coffee, ShieldCheck, Heart } from 'lucide-react';

interface AboutUsProps {
  navigateTo: (view: ViewType) => void;
}

const AboutUs: React.FC<AboutUsProps> = ({ navigateTo }) => {
  return (
    <div className="bg-bone min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="scroll-reveal visible">
            <span className="text-gold uppercase tracking-[0.6em] text-xs font-semibold block mb-6">A Nossa Essência</span>
            <h1 className="font-serif text-5xl md:text-7xl text-charcoal leading-tight">Onde a Nobreza é <span className="italic font-light">Hospitalidade.</span></h1>
            
            <div className="mt-12 space-y-6 text-charcoal/70 text-lg font-light leading-relaxed">
              <p>Recuperado de um antigo edifício de 1905 em Figueiró dos Vinhos, o Palacium Charming Suites guarda, em cada recanto, histórias de um tempo em que acolher era a mais nobre das virtudes.</p>
              <p>Aqui, a modernidade coexiste com a traça original. Oferecemos oito suítes exclusivas com camas super king-size, incluindo uma unidade adaptada para mobilidade condicionada, garantindo que o descanso régio seja acessível a todos.</p>
              <p>A nossa filosofia baseia-se na autonomia e no conforto: da cozinha de apoio equipada ao serviço completo de lavandaria, cada detalhe foi pensado para que se sinta o mestre da sua própria estadia no palácio.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-10 border-t border-charcoal/5 mt-12">
               <div className="space-y-2">
                  <Coffee className="w-5 h-5 text-gold" />
                  <h4 className="text-[10px] uppercase tracking-widest font-bold">Buffet da Corte</h4>
                  <p className="text-[10px] text-charcoal/40 leading-relaxed italic">Opções Veg, Vegan e Sem Glúten sob pedido.</p>
               </div>
               <div className="space-y-2">
                  <ShieldCheck className="w-5 h-5 text-gold" />
                  <h4 className="text-[10px] uppercase tracking-widest font-bold">Autonomia</h4>
                  <p className="text-[10px] text-charcoal/40 leading-relaxed italic">Cozinha de apoio para bebidas e refeições leves.</p>
               </div>
               <div className="space-y-2">
                  <Heart className="w-5 h-5 text-gold" />
                  <h4 className="text-[10px] uppercase tracking-widest font-bold">Tradição</h4>
                  <p className="text-[10px] text-charcoal/40 leading-relaxed italic">Mármores e madeiras nobres de 1905.</p>
               </div>
            </div>
          </div>
          
          <div className="relative scroll-reveal visible [transition-delay:300ms]">
            <div className="aspect-[4/5] rounded-sm overflow-hidden shadow-2xl">
              <img src="https://images.unsplash.com/photo-1544161515-4ad6ce6f8a4a?q=80&w=1200&auto=format&fit=crop" loading="lazy" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-10 -right-10 bg-gold p-12 hidden md:block max-w-xs">
              <p className="text-white text-xl font-serif italic leading-relaxed">"O silêncio do campo com a distinção de um palácio."</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
