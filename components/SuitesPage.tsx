
import React from 'react';
import { useData } from '../contexts/DataContext';
import { ViewType } from '../types';
import { Users, Maximize, ArrowLeft } from 'lucide-react';
import { useLocale } from '../contexts/LocaleContext';

interface SuitesPageProps {
  navigateTo: (view: ViewType) => void;
  openBooking: () => void;
}

const SuitesPage: React.FC<SuitesPageProps> = ({ navigateTo, openBooking }) => {
  const { suites } = useData();
  const { locale } = useLocale();

  const suiteDescriptionEn: Record<string, string> = {
    '101': 'Ground floor. Designed for universal accessibility with adapted bathroom layout and generous circulation space, while preserving the 1905 elegance.',
    '102': 'Ground floor. Classic comfort with original stone character and views to the entrance courtyard.',
    '103': 'Ground floor. An intimate retreat preserving the soul of the historic building with modern climate control.',
    '104': 'Ground floor. Cozy atmosphere and minimal design focused on deep rest.',
    '201': 'Upper floor. Majestic space designed for families or groups, offering the broadest palace layout.',
    '203': 'Upper floor. Imperial 40m² suite where natural light highlights architectural heritage.',
    '205': 'Upper floor. Privileged views and refined design with integrated lounge area and premium finishes.',
    '206': 'Upper floor. The pinnacle of Deluxe elegance, with 28m² bathed in natural light.',
  };

  return (
    <div className="bg-bone min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <button 
          onClick={() => navigateTo('home')}
          className="flex items-center gap-2 text-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-12 hover:-translate-x-2 transition-transform"
        >
          <ArrowLeft className="w-4 h-4" /> {locale === 'pt' ? 'Inicio' : 'Home'}
        </button>

        <div className="mb-20 scroll-reveal visible">
          <span className="text-gold uppercase tracking-[0.35em] md:tracking-[0.5em] text-xs font-semibold block mb-6">{locale === 'pt' ? 'Acomodacoes' : 'Accommodations'}</span>
          <h1 className="font-serif text-5xl md:text-8xl text-charcoal leading-tight">Royal <span className="italic font-light">Suites</span></h1>
          <p className="text-charcoal/60 text-lg md:text-xl font-light mt-8 max-w-2xl">
            {locale === 'pt'
              ? 'Cada quarto no Palacium foi desenhado para ser um santuario de tranquilidade, fundindo o esplendor do seculo XX com as comodidades do seculo XXI.'
              : 'Each suite at Palacium is designed as a sanctuary of calm, blending early-20th-century elegance with modern comfort.'}
          </p>
        </div>

        <div className="space-y-32">
          {suites.map((suite, idx) => (
            <div key={suite.id} className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center scroll-reveal ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
              <div className={`overflow-hidden aspect-[16/10] rounded-none shadow-2xl ${idx % 2 !== 0 ? 'lg:order-2' : ''}`}>
                <img src={suite.image} alt={suite.name} loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2s]" />
              </div>
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-baseline">
                    <h2 className="font-serif text-4xl md:text-5xl text-charcoal">{suite.name}</h2>
                    <span className="text-2xl font-serif text-gold [font-variant-numeric:lining-nums]">€{suite.price}</span>
                  </div>
                  <p className="text-charcoal/60 text-lg leading-relaxed">
                    {locale === 'pt' ? suite.description : (suiteDescriptionEn[suite.id] ?? suite.description)}
                  </p>
                </div>
                
                <div className="flex gap-10">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-gold" />
                    <span className="text-xs uppercase tracking-widest font-bold text-charcoal/40 [font-variant-numeric:lining-nums]">{suite.adults} {locale === 'pt' ? 'Adultos' : 'Adults'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Maximize className="w-5 h-5 text-gold" />
                    <span className="text-xs uppercase tracking-widest font-bold text-charcoal/40 [font-variant-numeric:lining-nums]">{suite.area}</span>
                  </div>
                </div>

                <div className="pt-6 flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={openBooking}
                    className="w-full sm:w-auto bg-gold text-white px-10 py-4 uppercase text-[10px] tracking-[0.2em] md:tracking-[0.3em] font-bold hover:bg-charcoal rounded-none transition-all"
                  >
                    {locale === 'pt' ? 'Reservar Agora' : 'Book Now'}
                  </button>
                  <button className="w-full sm:w-auto border border-charcoal/20 text-charcoal px-10 py-4 uppercase text-[10px] tracking-[0.2em] md:tracking-[0.3em] font-bold hover:bg-charcoal hover:text-white rounded-none transition-all">
                    {locale === 'pt' ? 'Detalhes da Suite' : 'Suite Details'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuitesPage;
