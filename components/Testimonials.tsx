
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Star, Globe, ChevronLeft, ChevronRight, CheckCircle2, TrendingUp } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const Testimonials: React.FC = () => {
  const { reviews } = useData();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  // Calculate rating distribution for the summary dashboard
  const ratingDistribution = useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    reviews.forEach(r => {
      const idx = 5 - Math.round(r.rating);
      if (idx >= 0 && idx < 5) counts[idx]++;
    });
    return counts.map(count => ({
      count,
      percent: reviews.length > 0 ? (count / reviews.length) * 100 : 0
    }));
  }, [reviews]);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const maxScroll = scrollWidth - clientWidth;
      
      // Calculate active index based on which card is closest to the center of the viewport
      const center = scrollLeft + clientWidth / 2;
      const items = scrollContainerRef.current.querySelectorAll('.review-card-item');
      let closestIndex = 0;
      let minDistance = Infinity;

      items.forEach((item, idx) => {
        const itemRect = item.getBoundingClientRect();
        const containerRect = scrollContainerRef.current!.getBoundingClientRect();
        const itemCenter = itemRect.left + itemRect.width / 2;
        const containerCenter = containerRect.left + containerRect.width / 2;
        const distance = Math.abs(itemCenter - containerCenter);
        
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = idx;
        }
      });

      setActiveIndex(closestIndex);
      setScrollProgress(maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0);
      setCanScrollLeft(scrollLeft > 50);
      setCanScrollRight(scrollLeft < maxScroll - 50);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [reviews]);

  const scrollToIndex = (index: number) => {
    if (scrollContainerRef.current) {
      const items = scrollContainerRef.current.querySelectorAll('.review-card-item');
      if (items[index]) {
        items[index].scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  };

  const navigate = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'next' 
      ? Math.min(activeIndex + 1, reviews.length - 1) 
      : Math.max(activeIndex - 1, 0);
    scrollToIndex(newIndex);
  };

  return (
    <section id="reviews" className="py-24 md:py-48 px-0 bg-charcoal text-white relative overflow-hidden group/section">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.02] select-none">
        <div className="absolute top-[-10%] right-[-5%] font-serif text-[50rem] rotate-12 leading-none">"</div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Editorial Header & Rating Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 mb-20 md:mb-32 items-center">
          <div className="lg:col-span-5 space-y-8 scroll-reveal">
            <span className="text-gold uppercase tracking-[0.7em] text-[10px] font-black block">Herança de Opinião</span>
            <h2 className="font-serif text-5xl md:text-8xl leading-[1.05] tracking-tight">
              A Voz dos <br />
              <span className="italic font-light text-white/90">Nossos Hóspedes.</span>
            </h2>
            <p className="text-white/40 text-sm md:text-lg font-light leading-relaxed max-w-md">
              A nossa reputação é construída sobre a satisfação absoluta de quem nos visita. Cada estadia é uma promessa de excelência cumprida.
            </p>
          </div>

          <div className="lg:col-span-7 bg-white/[0.02] border border-white/5 p-8 md:p-12 rounded-sm backdrop-blur-sm scroll-reveal [transition-delay:200ms]">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="text-center md:border-r border-white/5 md:pr-12 shrink-0">
                <div className="font-serif text-8xl text-gold leading-none mb-4">9.6</div>
                <div className="flex gap-1 justify-center mb-2">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-gold text-gold" />)}
                </div>
                <span className="text-[10px] uppercase tracking-[0.3em] font-black text-white/20 whitespace-nowrap">Official Booking Score</span>
              </div>

              <div className="flex-grow w-full space-y-3.5">
                {ratingDistribution.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 group/bar">
                    <span className="text-[10px] font-black text-white/30 w-6 uppercase tabular-nums">{5 - idx}★</span>
                    <div className="flex-grow h-1 bg-white/5 rounded-full overflow-hidden relative">
                      <div 
                        className="absolute inset-y-0 left-0 bg-gold transition-all duration-1000 ease-out"
                        style={{ width: `${item.percent}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] font-bold text-white/10 group-hover/bar:text-gold transition-colors w-10 text-right tabular-nums">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Center-Snapping Carousel Wrapper */}
      <div className="relative w-full">
        {/* Desktop Side Navigation */}
        <div className="hidden xl:block">
          <button 
            onClick={() => navigate('prev')}
            className={`absolute left-12 top-1/2 -translate-y-1/2 z-50 p-6 transition-all duration-500 border rounded-full bg-charcoal/40 backdrop-blur-xl ${canScrollLeft ? 'border-gold/40 text-gold hover:border-gold hover:bg-gold hover:text-white translate-x-0' : 'opacity-0 -translate-x-10 pointer-events-none'}`}
            aria-label="Anterior"
          >
            <ChevronLeft className="w-8 h-8 stroke-[1px]" />
          </button>
          <button 
            onClick={() => navigate('next')}
            className={`absolute right-12 top-1/2 -translate-y-1/2 z-50 p-6 transition-all duration-500 border rounded-full bg-charcoal/40 backdrop-blur-xl ${canScrollRight ? 'border-gold/40 text-gold hover:border-gold hover:bg-gold hover:text-white translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none'}`}
            aria-label="Próximo"
          >
            <ChevronRight className="w-8 h-8 stroke-[1px]" />
          </button>
        </div>

        {/* The Scroll Container */}
        <div 
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="flex items-stretch overflow-x-auto snap-x snap-mandatory scrollbar-hide py-10"
        >
          {/* Leading Spacer to allow first card to center */}
          <div className="shrink-0 w-[5vw] md:w-[calc(50vw-250px)]" aria-hidden="true" />

          {reviews.map((review, i) => {
            const isActive = i === activeIndex;
            return (
              <div 
                key={review.id} 
                className={`
                  review-card-item shrink-0 w-[85vw] md:w-[500px] mx-4 snap-center flex flex-col 
                  p-10 md:p-14 border transition-all duration-1000 group rounded-none
                  ${isActive 
                    ? 'bg-white/[0.04] border-gold/40 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] scale-100 opacity-100' 
                    : 'bg-white/[0.01] border-white/5 opacity-20 scale-[0.92] blur-[2px]'
                  }
                `}
              >
                <div className="flex-1 flex flex-col gap-10">
                  <div className="flex justify-between items-start shrink-0">
                    <div className={`font-serif text-8xl select-none leading-none transition-colors duration-700 ${isActive ? 'text-gold/40' : 'text-white/5'}`}>“</div>
                    <div className="flex flex-col items-end gap-2">
                       <div className="flex gap-0.5">
                          {[...Array(5)].map((_, idx) => (
                            <Star key={idx} className={`w-3 h-3 ${idx < review.rating ? 'fill-gold text-gold' : 'text-white/10'}`} />
                          ))}
                       </div>
                       {isActive && (
                         <div className="flex items-center gap-1.5 animate-fade-up">
                           <CheckCircle2 className="w-3 h-3 text-gold/60" />
                           <span className="text-[8px] uppercase tracking-widest font-black text-gold/40">Estadia Verificada</span>
                         </div>
                       )}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <p className={`font-serif text-xl md:text-2xl leading-[1.7] transition-all duration-700 ${isActive ? 'text-white' : 'text-white/20'} italic`}>
                      {review.comment}
                    </p>
                  </div>
                  
                  <div className={`pt-10 mt-auto border-t transition-colors duration-1000 flex items-center justify-between shrink-0 ${isActive ? 'border-gold/30' : 'border-white/5'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full border flex items-center justify-center font-serif text-lg transition-all duration-700 bg-gradient-to-br ${isActive ? 'from-gold/20 to-transparent border-gold/40 text-gold' : 'from-white/5 to-transparent border-white/5 text-white/5'}`}>
                        {review.author.charAt(0)}
                      </div>
                      <div>
                        <h4 className={`text-[12px] uppercase tracking-[0.2em] font-black transition-colors duration-700 ${isActive ? 'text-white' : 'text-white/20'}`}>{review.author}</h4>
                        <div className="flex items-center gap-2 mt-1">
                           <Globe className={`w-3 h-3 transition-colors duration-700 ${isActive ? 'text-gold/50' : 'text-white/5'}`} />
                           <span className={`text-[9px] uppercase tracking-[0.3em] font-bold transition-colors duration-700 ${isActive ? 'text-white/40' : 'text-white/5'}`}>{review.nationality || 'Hóspede'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className={`text-[10px] uppercase tracking-widest font-black transition-colors duration-700 ${isActive ? 'text-white/20' : 'text-white/5'}`}>{review.date}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Trailing Spacer to allow last card to center */}
          <div className="shrink-0 w-[5vw] md:w-[calc(50vw-250px)]" aria-hidden="true" />
        </div>
      </div>

      {/* Navigation Progress Bar & Index */}
      <div className="max-w-7xl mx-auto px-6 mt-16 md:mt-24">
        <div className="flex flex-col items-center gap-10">
           <div className="w-full max-w-2xl h-[1px] bg-white/5 relative">
              <div 
                className="absolute top-0 left-0 h-full bg-gold transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(184,147,82,0.6)]"
                style={{ width: `${scrollProgress}%` }}
              ></div>
           </div>
           
           <div className="flex items-center gap-12">
              <span className="font-serif italic text-gold text-4xl tabular-nums tracking-tighter transition-all duration-500" key={activeIndex}>
                {String(activeIndex + 1).padStart(2, '0')}
              </span>
              <div className="w-12 h-[1px] bg-white/10"></div>
              <span className="font-serif italic text-white/10 text-4xl tabular-nums tracking-tighter">
                {String(reviews.length).padStart(2, '0')}
              </span>
           </div>
        </div>

        <div className="md:hidden mt-12 text-center">
            <span className="text-[10px] uppercase tracking-[0.8em] text-white/5 font-black animate-pulse">Deslize para Navegar</span>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
