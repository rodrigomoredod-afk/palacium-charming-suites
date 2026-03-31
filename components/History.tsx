
import React from 'react';
import { ArrowLeft, History as HistoryIcon, Globe, Leaf, Award } from 'lucide-react';
import { historyImages } from '../images';
import { useLocale } from '../contexts/LocaleContext';
import SmartImage from './ui/SmartImage';

interface HistoryProps {
  navigateTo: (view: 'home' | 'history') => void;
}

const History: React.FC<HistoryProps> = ({ navigateTo }) => {
  const { locale } = useLocale();

  const pillars = [
    {
      icon: <HistoryIcon className="w-full h-full" />,
      title: locale === 'pt' ? 'Herança' : 'Heritage',
      desc:
        locale === 'pt'
          ? 'Preservação rigorosa da pedra e traça original de 1905.'
          : 'Rigorous preservation of original 1905 stonework and lines.',
    },
    {
      icon: <Leaf className="w-full h-full" />,
      title: locale === 'pt' ? 'Natureza' : 'Nature',
      desc:
        locale === 'pt'
          ? 'O olival centenário como guardião do nosso jardim.'
          : 'Centenary olive trees as guardians of the estate.',
    },
    {
      icon: <Globe className="w-full h-full" />,
      title: locale === 'pt' ? 'Cultura' : 'Culture',
      desc:
        locale === 'pt'
          ? 'Hospitalidade que celebra as raízes de Figueiró.'
          : 'Hospitality that reflects local roots and identity.',
    },
    {
      icon: <Award className="w-full h-full" />,
      title: locale === 'pt' ? 'Exclusividade' : 'Exclusivity',
      desc:
        locale === 'pt'
          ? 'Privacidade e conforto absoluto no nosso refúgio.'
          : 'Privacy and premium comfort in our retreat.',
    },
  ];

  return (
    <div className="bg-bone min-h-screen">
      <section className="relative h-[80vh] flex flex-col justify-end overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <SmartImage
            src={historyImages.hero} 
            alt={locale === 'pt' ? 'Detalhe historico' : 'Heritage detail'} 
            loading="lazy"
            overlay
            className="grayscale opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bone via-bone/20 to-transparent"></div>
        </div>
        
        <div className="relative z-10 px-6 md:px-16 pb-20 max-w-7xl mx-auto w-full">
          <button 
            onClick={() => navigateTo('home')}
            className="inline-flex items-center gap-2 text-charcoal/80 text-[10px] uppercase tracking-[0.32em] font-bold mb-12 px-3 py-2 bg-bone/70 backdrop-blur-sm border border-charcoal/10 hover:-translate-x-2 hover:text-charcoal transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> {locale === 'pt' ? 'Voltar ao Início' : 'Back to Home'}
          </button>
          
          <div className="max-w-4xl scroll-reveal visible">
            <span className="inline-block text-charcoal/75 uppercase tracking-[0.3em] md:tracking-[0.42em] text-xs font-semibold mb-6 px-3 py-1.5 bg-bone/70 backdrop-blur-sm border border-charcoal/10">{locale === 'pt' ? 'A Nossa História' : 'Our Story'}</span>
            <h1 className="font-serif text-5xl md:text-9xl text-charcoal leading-[0.9] mb-8">
              {locale === 'pt' ? 'Herança' : 'Enduring'} <br /> <span className="italic font-light">{locale === 'pt' ? 'Eterna.' : 'Legacy.'}</span>
            </h1>
            <p className="text-xl md:text-2xl text-charcoal/70 font-light leading-relaxed max-w-2xl">
              {locale === 'pt'
                ? 'Da robustez da pedra de 1905 à transparência da piscina moderna: um diálogo entre gerações.'
                : 'From 1905 stone strength to modern glass openness: a dialogue across generations.'}
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-16 py-32 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          
          <div className="lg:col-span-5 space-y-12 scroll-reveal">
            <div className="aspect-[3/4] overflow-hidden rounded-none shadow-2xl bg-charcoal/5">
              <SmartImage src={historyImages.stone} loading="lazy" className="hover:scale-110 transition-transform duration-[2s]" />
            </div>
            <div className="space-y-6">
              <span className="font-serif text-7xl text-gold/20">01.</span>
              <h2 className="font-serif text-4xl text-charcoal">{locale === 'pt' ? 'A Pedra e o Tempo' : 'Stone and Time'}</h2>
              <p className="text-charcoal/60 leading-relaxed font-light text-lg">
                {locale === 'pt'
                  ? 'As escadarias monumentais em pedra, agora restauradas, serviram outrora de palco para as famílias mais ilustres da região.'
                  : 'The restored monumental staircases once welcomed the region’s leading families, preserving a timeless sense of grandeur.'}
              </p>
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-2"></div>

          <div className="lg:col-span-5 space-y-12 lg:mt-40 scroll-reveal">
            <div className="aspect-[3/4] overflow-hidden rounded-none shadow-2xl">
              <SmartImage src={historyImages.garden} loading="lazy" className="hover:scale-110 transition-transform duration-[2s]" />
            </div>
            <div className="space-y-6">
              <span className="font-serif text-7xl text-gold/20">02.</span>
              <h2 className="font-serif text-4xl text-charcoal">{locale === 'pt' ? 'O Jardim do Repouso' : 'The Garden of Rest'}</h2>
              <p className="text-charcoal/60 leading-relaxed font-light text-lg">
                {locale === 'pt'
                  ? 'A introdução da cúpula de vidro na piscina e a revitalização do olival centenário trouxeram nova luz à propriedade.'
                  : 'The glass pool dome and revitalized olive grove brought new light to the estate, balancing heritage with present-day comfort.'}
              </p>
            </div>
          </div>

        </div>
      </section>

      <section className="bg-charcoal text-white py-40 px-6 md:px-16 overflow-hidden relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24 scroll-reveal">
            <span className="text-gold uppercase tracking-[0.3em] md:tracking-[0.45em] text-[10px] font-bold mb-4 block">{locale === 'pt' ? 'Valores' : 'Values'}</span>
            <h2 className="font-serif text-5xl md:text-7xl leading-tight">{locale === 'pt' ? 'Os Pilares do Palacium' : 'The Pillars of Palacium'}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {pillars.map((pillar, i) => (
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
            {locale === 'pt' ? 'Faça parte do' : 'Become part of'} <br /> <span className="italic">{locale === 'pt' ? 'próximo capítulo.' : 'the next chapter.'}</span>
          </h2>
          <button 
            onClick={() => navigateTo('home')}
            className="bg-gold text-white px-16 py-5 uppercase text-[10px] tracking-[0.4em] font-bold hover:bg-charcoal rounded-none transition-all shadow-xl"
          >
            {locale === 'pt' ? 'Explorar as Suítes' : 'Explore Suites'}
          </button>
        </div>
      </section>
    </div>
  );
};

export default History;
