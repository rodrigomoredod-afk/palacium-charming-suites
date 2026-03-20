
import React from 'react';
import { Handshake, Globe, Award, ShieldCheck, Sparkles } from 'lucide-react';

const Partners: React.FC = () => {
  const placeholders = [
    { name: "Parceiro de Excelência I", category: "Gastronomia Local", icon: <Award className="w-5 h-5" /> },
    { name: "Parceiro de Excelência II", category: "Experiências & Lazer", icon: <Sparkles className="w-5 h-5" /> },
    { name: "Parceiro de Excelência III", category: "Bem-Estar & Spa", icon: <ShieldCheck className="w-5 h-5" /> },
    { name: "Parceiro de Excelência IV", category: "Artes & Cultura", icon: <Globe className="w-5 h-5" /> }
  ];

  return (
    <section id="partners" className="py-24 md:py-40 px-6 md:px-16 bg-white overflow-hidden border-t border-charcoal/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 md:mb-32 scroll-reveal">
          <span className="text-gold uppercase tracking-[0.4em] text-[10px] font-bold block mb-4">Colaborações</span>
          <h2 className="font-serif text-4xl md:text-6xl text-charcoal leading-tight">
            Parceiros & <span className="italic font-light">Alianças.</span>
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
                <p className="text-[10px] text-charcoal/40 uppercase tracking-widest leading-relaxed italic">Curadoria Especial Palacium</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 md:mt-32 flex justify-center scroll-reveal">
          <div className="flex items-center gap-4 text-charcoal/20">
            <Handshake className="w-4 h-4" />
            <p className="text-[10px] uppercase tracking-[0.4em] font-bold">A construir o futuro da hospitalidade em conjunto</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;
