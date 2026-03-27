
import React from 'react';
import { aboutUsImages } from '../images';
import { ViewType } from '../types';
import { Coffee, ShieldCheck, Heart } from 'lucide-react';
import { useLocale } from '../contexts/LocaleContext';
import SmartImage from './ui/SmartImage';

interface AboutUsProps {
  navigateTo: (view: ViewType) => void;
}

const AboutUs: React.FC<AboutUsProps> = ({ navigateTo }) => {
  const { locale } = useLocale();
  return (
    <div className="bg-bone min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-20 items-center">
          <div className="scroll-reveal visible">
            <span className="text-gold uppercase tracking-[0.35em] md:tracking-[0.5em] text-xs font-semibold block mb-6">{locale === 'pt' ? 'A Nossa Essência' : 'Our Essence'}</span>
            <h1 className="font-serif text-5xl md:text-7xl text-charcoal leading-tight">{locale === 'pt' ? 'Onde a Nobreza é' : 'Where Nobility is'} <span className="italic font-light">{locale === 'pt' ? 'Hospitalidade.' : 'Hospitality.'}</span></h1>
            
            <div className="mt-10 md:mt-12 space-y-6 text-charcoal/70 text-lg font-light leading-relaxed max-w-2xl">
              <p>{locale === 'pt' ? 'Recuperado de um antigo edifício de 1905 em Figueiró dos Vinhos, o Palacium Charming Suites guarda, em cada recanto, histórias de um tempo em que acolher era a mais nobre das virtudes.' : 'Restored from a 1905 building in Figueiró dos Vinhos, Palacium Charming Suites preserves stories from a time when welcoming guests was a noble art.'}</p>
              <p>{locale === 'pt' ? 'Aqui, a modernidade coexiste com a traça original. Oferecemos oito suítes exclusivas com camas super king-size, incluindo uma unidade adaptada para mobilidade condicionada, garantindo que o descanso régio seja acessível a todos.' : 'Here, modern comfort coexists with original architecture. We offer eight exclusive suites, including one adapted unit for accessibility.'}</p>
              <p>{locale === 'pt' ? 'A nossa filosofia baseia-se na autonomia e no conforto: da cozinha de apoio equipada ao serviço completo de lavandaria, cada detalhe foi pensado para que se sinta o mestre da sua própria estadia no palácio.' : 'Our philosophy is autonomy and comfort: from support kitchen facilities to full laundry services, every detail is designed to make your stay effortless.'}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-10 border-t border-charcoal/5 mt-12">
               <div className="space-y-2">
                  <Coffee className="w-5 h-5 text-gold" />
                  <h4 className="text-[10px] uppercase tracking-widest font-bold">{locale === 'pt' ? 'Buffet da Corte' : 'Court Buffet'}</h4>
                  <p className="text-[10px] text-charcoal/40 leading-relaxed italic">{locale === 'pt' ? 'Opções Veg, Vegan e Sem Glúten sob pedido.' : 'Veg, vegan and gluten-free options on request.'}</p>
               </div>
               <div className="space-y-2">
                  <ShieldCheck className="w-5 h-5 text-gold" />
                  <h4 className="text-[10px] uppercase tracking-widest font-bold">{locale === 'pt' ? 'Autonomia' : 'Autonomy'}</h4>
                  <p className="text-[10px] text-charcoal/40 leading-relaxed italic">{locale === 'pt' ? 'Cozinha de apoio para bebidas e refeições leves.' : 'Support kitchen for drinks and light meals.'}</p>
               </div>
               <div className="space-y-2">
                  <Heart className="w-5 h-5 text-gold" />
                  <h4 className="text-[10px] uppercase tracking-widest font-bold">{locale === 'pt' ? 'Tradição' : 'Tradition'}</h4>
                  <p className="text-[10px] text-charcoal/40 leading-relaxed italic">{locale === 'pt' ? 'Mármores e madeiras nobres de 1905.' : 'Marble and noble woods from 1905.'}</p>
               </div>
            </div>
          </div>
          
          <div className="relative scroll-reveal visible [transition-delay:300ms]">
            <div className="aspect-[4/5] rounded-sm overflow-hidden shadow-2xl">
              <SmartImage src={aboutUsImages.editorial} loading="lazy" className="transition-transform duration-[2s] hover:scale-105" overlay />
            </div>
            <div className="absolute -bottom-10 -right-10 bg-gold p-12 hidden md:block max-w-xs">
              <p className="text-white text-xl font-serif italic leading-relaxed">"{locale === 'pt' ? 'O silêncio do campo com a distinção de um palácio.' : 'The silence of the countryside with palace distinction.'}"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
