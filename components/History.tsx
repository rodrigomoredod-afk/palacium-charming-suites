
import React from 'react';
import { ArrowLeft, History as HistoryIcon, Globe, Leaf, Award } from 'lucide-react';
import { historyImages } from '../images';

interface HistoryProps {
  navigateTo: (view: 'home' | 'history') => void;
}

const History: React.FC<HistoryProps> = ({ navigateTo }) => {
  return (
    <div className="bg-bone min-h-screen">
      <section className="relative h-[80vh] flex flex-col justify-end overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <img 
            src={historyImages.hero} 
            alt="Heritage Detail" 
            loading="lazy"
            className="w-full h-full object-cover grayscale opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bone via-bone/20 to-transparent"></div>
        </div>
        
        <div className="relative z-10 px-6 md:px-16 pb-20 max-w-7xl mx-auto w-full">
          <button 
            onClick={() => navigateTo('home')}
            className="flex items-center gap-2 text-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-12 hover:-translate-x-2 transition-transform"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar ao Início
          </button>
          
          <div className="max-w-4xl scroll-reveal visible">
            <span className="text-gold uppercase tracking-[0.6em] text-xs font-semibold block mb-6">A Nossa História</span>
            <h1 className="font-serif text-5xl md:text-9xl text-charcoal leading-[0.9] mb-8">
              Herança <br /> <span className="italic font-light">Eterna.</span>
            </h1>
            <p className="text-xl md:text-2xl text-charcoal/70 font-light leading-relaxed max-w-2xl">
              Da robustez da pedra de 1905 à transparência da piscina moderna: um diálogo entre gerações.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-16 py-32 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          
          <div className="lg:col-span-5 space-y-12 scroll-reveal">
            <div className="aspect-[3/4] overflow-hidden rounded-none shadow-2xl bg-charcoal/5">
              <img src={historyImages.stone} loading="lazy" className="w-full h-full object-cover hover:scale-110 transition-transform duration-[2s]" />
            </div>
            <div className="space-y-6">
              <span className="font-serif text-7xl text-gold/20">01.</span>
              <h2 className="font-serif text-4xl text-charcoal">A Pedra e o Tempo</h2>
              <p className="text-charcoal/60 leading-relaxed font-light text-lg">
                As escadarias monumentais em pedra, agora restauradas, serviram outrora de palco para as famílias mais ilustres da região. Cada bloco de granito foi mantido na sua posição original, preservando a imponência que só o tempo sabe conferir.
              </p>
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-2"></div>

          <div className="lg:col-span-5 space-y-12 lg:mt-40 scroll-reveal">
            <div className="aspect-[3/4] overflow-hidden rounded-none shadow-2xl">
              <img src={historyImages.garden} loading="lazy" className="w-full h-full object-cover hover:scale-110 transition-transform duration-[2s]" />
            </div>
            <div className="space-y-6">
              <span className="font-serif text-7xl text-gold/20">02.</span>
              <h2 className="font-serif text-4xl text-charcoal">O Jardim do Repouso</h2>
              <p className="text-charcoal/60 leading-relaxed font-light text-lg">
                A introdução da cúpula de vidro na piscina e a revitalização do olival centenário trouxeram uma nova luz à propriedade. Hoje, o Palacium oferece o silêncio do passado com a transparência e o conforto do presente.
              </p>
            </div>
          </div>

        </div>
      </section>

      <section className="bg-charcoal text-white py-40 px-6 md:px-16 overflow-hidden relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24 scroll-reveal">
            <span className="text-gold uppercase tracking-[0.5em] text-[10px] font-bold mb-4 block">Valores</span>
            <h2 className="font-serif text-5xl md:text-7xl leading-tight">Os Pilares do Palacium</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {[
              { icon: <HistoryIcon className="w-full h-full" />, title: "Herança", desc: "Preservação rigorosa da pedra e traça original de 1905." },
              { icon: <Leaf className="w-full h-full" />, title: "Natureza", desc: "O olival centenário como guardião do nosso jardim." },
              { icon: <Globe className="w-full h-full" />, title: "Cultura", desc: "Hospitalidade que celebra as raízes de Figueiró." },
              { icon: <Award className="w-full h-full" />, title: "Exclusividade", desc: "Privacidade absoluta sob a cúpula do nosso refúgio." }
            ].map((pillar, i) => (
              <div key={i} className="flex flex-col items-center text-center space-y-6 p-8 border border-white/5 hover:bg-white/5 rounded-none transition-all scroll-reveal">
                <div className="text-gold w-10 h-10 stroke-1">{pillar.icon}</div>
                <h3 className="uppercase tracking-[0.3em] font-bold text-xs">{pillar.title}</h3>
                <p className="text-white/40 text-sm font-light leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-40 px-6 text-center bg-offwhite">
        <div className="max-w-3xl mx-auto space-y-12 scroll-reveal">
          <h2 className="font-serif text-4xl md:text-6xl text-charcoal">
            Faça parte do <br /> <span className="italic">próximo capítulo.</span>
          </h2>
          <button 
            onClick={() => navigateTo('home')}
            className="bg-gold text-white px-16 py-5 uppercase text-[10px] tracking-[0.4em] font-bold hover:bg-charcoal rounded-none transition-all shadow-xl"
          >
            Explorar as Suites
          </button>
        </div>
      </section>
    </div>
  );
};

export default History;
