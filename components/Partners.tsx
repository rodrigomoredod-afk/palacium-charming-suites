
import React from 'react';
import { Handshake, Globe, Award, ShieldCheck, Sparkles } from 'lucide-react';
import { useLocale } from '../contexts/LocaleContext';

const Partners: React.FC = () => {
  const { locale } = useLocale();
  const placeholders = [
    {
      name: locale === 'pt' ? 'Parceiro de Excelência I' : 'Excellence Partner I',
      category: locale === 'pt' ? 'Gastronomia Local' : 'Local Gastronomy',
      icon: <Award className="w-5 h-5" />,
    },
    {
      name: locale === 'pt' ? 'Parceiro de Excelência II' : 'Excellence Partner II',
      category: locale === 'pt' ? 'Experiências & Lazer' : 'Experiences & Leisure',
      icon: <Sparkles className="w-5 h-5" />,
    },
    {
      name: locale === 'pt' ? 'Parceiro de Excelência III' : 'Excellence Partner III',
      category: locale === 'pt' ? 'Bem-Estar & Spa' : 'Wellness & Spa',
      icon: <ShieldCheck className="w-5 h-5" />,
    },
    {
      name: locale === 'pt' ? 'Parceiro de Excelência IV' : 'Excellence Partner IV',
      category: locale === 'pt' ? 'Artes & Cultura' : 'Arts & Culture',
      icon: <Globe className="w-5 h-5" />,
    },
  ];

  return (
    <section id="partners" className="py-24 md:py-40 px-6 md:px-16 bg-white overflow-hidden border-t border-charcoal/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 md:mb-32 scroll-reveal">
          <span className="text-gold uppercase tracking-[0.4em] text-[10px] font-bold block mb-4">{locale === 'pt' ? 'Colaborações' : 'Collaborations'}</span>
          <h2 className="font-serif text-4xl md:text-6xl text-charcoal leading-tight">
            {locale === 'pt' ? 'Parceiros &' : 'Partners &'} <span className="italic font-light">{locale === 'pt' ? 'Alianças.' : 'Alliances.'}</span>
          </h2>
          <div className="w-12 h-[1px] bg-gold/30 mx-auto mt-8"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {placeholders.map((partner, idx) => (
            <div 
              key={idx} 
              className={`group p-10 border border-charcoal/5 hover:border-gold/20 transition-all duration-700 bg-bone/30 hover:bg-white hover:shadow-2xl hover:shadow-gold/5 scroll-reveal [transition-delay:${idx * 150}ms] text-center`}
            >
              <div className="mb-8 flex justify-center">
                <div className="p-4 bg-white rounded-full text-gold/40 group-hover:text-gold transition-colors duration-500 shadow-sm">
                  {partner.icon}
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-[9px] uppercase tracking-[0.3em] font-black text-gold/60">{partner.category}</span>
                <h3 className="font-serif text-xl text-charcoal group-hover:text-gold transition-colors">{partner.name}</h3>
              </div>
              <div className="mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <p className="text-[10px] text-charcoal/40 uppercase tracking-widest leading-relaxed italic">{locale === 'pt' ? 'Curadoria Especial Palacium' : 'Curated by Palacium'}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 md:mt-32 flex justify-center scroll-reveal">
          <div className="flex items-center gap-4 text-charcoal/20">
            <Handshake className="w-4 h-4" />
            <p className="text-[10px] uppercase tracking-[0.4em] font-bold">{locale === 'pt' ? 'A construir o futuro da hospitalidade em conjunto' : 'Building the future of hospitality together'}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;
