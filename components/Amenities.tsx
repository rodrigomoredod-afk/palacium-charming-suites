
import React from 'react';
import { AMENITIES_GROUPS } from '../constants';
import { useData } from '../contexts/DataContext';
import { amenitiesImages } from '../images';
import { Star, CheckCircle2 } from 'lucide-react';

const Amenities: React.FC = () => {
  const { bookingDisplayScore } = useData();
  return (
    <section id="amenities" className="py-24 md:py-40 px-6 md:px-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Adjusted header alignment: Centered on mobile, Left on Desktop */}
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-12 mb-20 md:mb-32 text-center lg:text-left">
          <div className="scroll-reveal max-w-2xl">
            <span className="text-gold uppercase tracking-[0.4em] text-[10px] font-bold block mb-4">Experiência Palacium</span>
            <h2 className="font-serif text-4xl md:text-7xl text-charcoal leading-tight">
              O Requinte está nos <br /> <span className="italic font-light">Pormenores.</span>
            </h2>
          </div>
          
          <div className="scroll-reveal bg-offwhite border border-charcoal/5 p-8 flex flex-col items-center gap-4 text-center rounded-sm shadow-sm transition-transform hover:scale-105 duration-500 w-full md:w-auto max-w-xs md:max-w-none">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-gold text-gold" />)}
            </div>
            <div className="space-y-1">
              <span className="text-5xl font-serif text-charcoal">{bookingDisplayScore}</span>
              <span className="block text-[10px] uppercase tracking-widest font-black text-gold">Excelente</span>
            </div>
            <p className="text-[10px] text-charcoal/40 uppercase tracking-widest font-bold">Booking.com Score</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-x-16">
          {AMENITIES_GROUPS.map((group, idx) => (
            <div key={idx} className={`scroll-reveal [transition-delay:${idx * 100}ms] space-y-8`}>
              <div className="flex items-center gap-4 border-b border-charcoal/5 pb-4">
                <div className="p-3 bg-gold/5 rounded-full">
                  {group.icon}
                </div>
                <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-charcoal">{group.title}</h3>
              </div>
              <ul className="space-y-4">
                {group.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 group">
                    <CheckCircle2 className="w-3.5 h-3.5 text-gold/30 group-hover:text-gold transition-colors shrink-0 mt-0.5" />
                    <span className="text-sm font-light text-charcoal/60 leading-tight group-hover:text-charcoal transition-colors">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Dietary highlight box - Split Layout with Image */}
        <div className="mt-24 md:mt-32 rounded-sm overflow-hidden scroll-reveal shadow-2xl">
          <div className="flex flex-col lg:flex-row bg-charcoal text-white">
             {/* Image Section */}
             <div className="relative w-full lg:w-1/2 min-h-[300px] lg:min-h-full order-1 lg:order-2">
                <img
                  src={amenitiesImages.dietaryHighlight}
                  alt="Área de pequeno-almoço do Palacium"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3s] hover:scale-105"
                />
                <div className="absolute inset-0 bg-charcoal/10 mix-blend-multiply"></div>
             </div>

             {/* Text Section */}
             <div className="w-full lg:w-1/2 p-10 md:p-16 flex flex-col justify-center text-center md:text-left relative z-10 order-2 lg:order-1">
                <div className="space-y-6">
                   <span className="text-gold uppercase tracking-[0.4em] text-[10px] font-bold">Nutrição & Inclusão</span>
                   <h4 className="font-serif text-3xl md:text-5xl leading-tight">Um buffet que abraça <br /> <span className="italic">todos os paladares.</span></h4>
                   <p className="text-white/60 text-lg font-light leading-relaxed">
                     Acreditamos que o pequeno-almoço é o ritual mais importante do dia. Por isso, preparamos diariamente opções <strong>Vegetarianas, Vegan e Sem Glúten</strong> com o mesmo rigor e sabor, garantindo que a sua saúde e preferências são respeitadas.
                   </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Amenities;
