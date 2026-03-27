
import React from 'react';
import { ViewType } from '../types';
import { Mountain, Palette, MapPin, Utensils, Coffee, Car, Handshake, Heart } from 'lucide-react';
import { NEARBY_LOCATIONS } from '../constants';
import { experiencesImages } from '../images';
import { useLocale } from '../contexts/LocaleContext';
import SmartImage from './ui/SmartImage';

interface ExperiencesProps {
  navigateTo: (view: ViewType) => void;
}

const Experiences: React.FC<ExperiencesProps> = ({ navigateTo }) => {
  const { locale } = useLocale();
  const partnerships = [
    {
      title: locale === 'pt' ? 'Arte & Curadoria Local' : 'Art & Local Curation',
      image: experiencesImages.arte,
      desc: locale === 'pt'
        ? 'Colaboramos com o Museu e Centro de Artes para oferecer visitas privadas e acesso exclusivo a exposições de artistas da região.'
        : 'We collaborate with local art centers to offer curated private cultural experiences.',
      icon: <Palette className="w-4 h-4" />
    },
    {
      title: locale === 'pt' ? 'Guia das Aldeias do Xisto' : 'Schist Villages Guide',
      image: experiencesImages.aldeias,
      desc: locale === 'pt'
        ? 'Parcerias com guias locais para percursos personalizados pelo Casal de São Simão e as Fragas de São Simão.'
        : 'Partnerships with local guides for custom routes through nearby villages and nature trails.',
      icon: <Mountain className="w-4 h-4" />
    },
    {
      title: locale === 'pt' ? 'Gastronomia de Origem' : 'Origin Gastronomy',
      image: experiencesImages.gastronomia,
      desc: locale === 'pt'
        ? 'Uma seleção de produtores locais que garante frescura no buffet e as melhores sugestões da região.'
        : 'A selection of local producers that keep our food program authentic and fresh.',
      icon: <Utensils className="w-4 h-4" />
    }
  ];

  return (
    <div className="bg-bone min-h-screen">
      <section className="relative h-[60vh] flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <SmartImage src={experiencesImages.sectionHero} loading="lazy" className="grayscale opacity-50" />
          <div className="absolute inset-0 bg-charcoal/40"></div>
        </div>
        <div className="relative z-10 px-6">
          <span className="text-gold uppercase tracking-[0.35em] md:tracking-[0.5em] text-[10px] font-bold mb-4 block animate-fade-up">{locale === 'pt' ? 'Colaborações de Elite' : 'Elite Collaborations'}</span>
          <h1 className="font-serif text-5xl md:text-8xl text-white mb-6 animate-fade-up">{locale === 'pt' ? 'Curadoria &' : 'Curation &'} <span className="italic">{locale === 'pt' ? 'Parceiros.' : 'Partners.'}</span></h1>
          <p className="text-white/70 text-lg md:text-xl font-light tracking-wide animate-fade-up [animation-delay:200ms]">{locale === 'pt' ? 'Uma rede de excelência que enaltece a sua estadia no palácio.' : 'A partner network that elevates your stay experience.'}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 md:px-16 py-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {partnerships.map((exp, i) => (
            <div key={i} className="group scroll-reveal" style={{transitionDelay: `${i * 150}ms`}}>
              <div className="aspect-[3/4] overflow-hidden rounded-sm mb-8 relative">
                <SmartImage src={exp.image} alt={exp.title} loading="lazy" className="group-hover:scale-110 transition-transform duration-[1.5s]" />
                <div className="absolute top-6 left-6 bg-white/90 p-3 rounded-full text-gold">
                  {exp.icon}
                </div>
              </div>
              <h3 className="font-serif text-3xl text-charcoal mb-4">{exp.title}</h3>
              <p className="text-charcoal/50 font-light leading-relaxed mb-6">{exp.desc}</p>
              <button className="text-[10px] uppercase tracking-[0.3em] font-bold text-gold border-b border-gold/20 pb-2 hover:border-gold transition-all">{locale === 'pt' ? 'Saber Mais' : 'Learn More'}</button>
            </div>
          ))}
        </div>

        {/* Nearby Highlights - From Booking.com Data */}
        <div className="mt-40 scroll-reveal">
          <div className="mb-16 text-center">
            <span className="text-gold uppercase tracking-[0.4em] text-[10px] font-bold block mb-4">
              {locale === 'pt' ? 'A Nossa Vizinhança' : 'Our Surroundings'}
            </span>
            <h2 className="font-serif text-4xl md:text-6xl text-charcoal">
              {locale === 'pt' ? 'Rede de Excelência.' : 'Network of Excellence.'}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Restaurants */}
            <div className="space-y-10">
              <div className="flex items-center gap-4 border-b border-charcoal/5 pb-4">
                <Utensils className="w-5 h-5 text-gold" />
                <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-charcoal">
                  {locale === 'pt' ? 'Restaurantes Parceiros' : 'Partner Restaurants'}
                </h3>
              </div>
              <div className="space-y-6">
                {NEARBY_LOCATIONS.restaurants.map((place, i) => (
                  <div key={i} className="flex justify-between items-center group">
                    <div>
                      <h4 className="font-serif text-xl group-hover:text-gold transition-colors">{place.name}</h4>
                      <p className="text-[10px] text-charcoal/40 uppercase tracking-widest">{place.dist}</p>
                    </div>
                    <div className="flex items-center gap-2 text-charcoal/30">
                      <Car className="w-4 h-4" />
                      <span className="text-[10px] font-bold">{place.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cafes & Bars */}
            <div className="space-y-10">
              <div className="flex items-center gap-4 border-b border-charcoal/5 pb-4">
                <Coffee className="w-5 h-5 text-gold" />
                <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-charcoal">
                  {locale === 'pt' ? 'Cafés & Seleção de Bares' : 'Cafes & Selected Bars'}
                </h3>
              </div>
              <div className="space-y-6">
                {NEARBY_LOCATIONS.cafes.map((place, i) => (
                  <div key={i} className="flex justify-between items-center group">
                    <div>
                      <h4 className="font-serif text-xl group-hover:text-gold transition-colors">{place.name}</h4>
                      <p className="text-[10px] text-charcoal/40 uppercase tracking-widest">
                        {locale === 'pt' ? place.dist : place.dist.replace('pé', 'walk')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-charcoal/30">
                      <MapPin className="w-4 h-4" />
                      <span className="text-[10px] font-bold">{place.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-32 p-12 bg-offwhite border border-charcoal/5 text-center scroll-reveal rounded-sm">
          <Handshake className="w-8 h-8 text-gold mx-auto mb-6" />
          <h4 className="font-serif text-2xl text-charcoal mb-4">
            {locale === 'pt' ? 'A Aliança de Coimbra' : 'The Coimbra Alliance'}
          </h4>
          <p className="text-charcoal/60 max-w-2xl mx-auto text-sm leading-relaxed">
            {locale === 'pt'
              ? 'As nossas parcerias estendem-se até Coimbra, colaborando com instituições que preservam a universidade centenária e as tradições de fado, garantindo uma jornada histórica contínua pelo coração de Portugal.'
              : 'Our partnerships extend to Coimbra, collaborating with institutions that preserve its centenary university and fado traditions for a continuous cultural journey through Portugal.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Experiences;
