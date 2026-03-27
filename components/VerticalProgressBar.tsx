
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLocale } from '../contexts/LocaleContext';

interface Section {
  id: string;
  title: string;
}

const VerticalProgressBar: React.FC = () => {
  const { locale } = useLocale();
  const [scrollPercent, setScrollPercent] = useState(0);
  const [activeSection, setActiveSection] = useState('');
  const requestRef = useRef<number>(null);

  const sections: Section[] = useMemo(() => [
    { id: 'hero', title: locale === 'pt' ? 'Bem-Vindo' : 'Welcome' },
    { id: 'heritage', title: locale === 'pt' ? 'Nossa História' : 'Our Story' },
    { id: 'suites', title: locale === 'pt' ? 'Suites Reais' : 'Royal Suites' },
    { id: 'reviews', title: locale === 'pt' ? 'Críticas' : 'Reviews' },
    { id: 'cta', title: locale === 'pt' ? 'Reserve Já' : 'Book Now' }
  ], [locale]);

  const updateScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // Smooth percentage calculation
    if (docHeight > 0) {
      const percent = Math.min(Math.max((scrollTop / docHeight) * 100, 0), 100);
      setScrollPercent(percent);
    }

    // Stable section detection
    let current = '';
    const viewportMiddle = window.innerHeight / 3; // Using upper third for faster switching

    for (const section of sections) {
      const element = document.getElementById(section.id);
      if (element) {
        const rect = element.getBoundingClientRect();
        // Section is active if it occupies the top part of the screen
        if (rect.top <= viewportMiddle && rect.bottom >= viewportMiddle) {
          current = section.title;
          break;
        }
      }
    }
    
    if (current) {
      setActiveSection(current);
    }
    
    requestRef.current = requestAnimationFrame(updateScroll);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(updateScroll);

    const handleResize = () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      requestRef.current = requestAnimationFrame(updateScroll);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [sections]);

  const activeTitle = activeSection || sections[0].title;

  return (
    <div className="fixed right-4 md:right-12 top-1/2 -translate-y-1/2 z-[100] flex items-center gap-4 md:gap-6 pointer-events-none group select-none">
      <div className="hidden lg:block overflow-hidden">
        <span 
          key={activeTitle}
          className="block text-[10px] uppercase tracking-[0.4em] font-bold text-gold animate-fade-left whitespace-nowrap"
        >
          {activeTitle}
        </span>
      </div>

      <div className="relative w-[1.5px] md:w-[2px] h-32 md:h-64 bg-charcoal/5 rounded-full overflow-visible pointer-events-auto shadow-sm">
        {/* The Progress Fill */}
        <div 
          className="absolute top-0 left-0 w-full bg-gold rounded-full transition-all duration-300 ease-out will-change-[height]"
          style={{ height: `${scrollPercent}%` }}
        />
        
        {/* Section Markers */}
        {sections.map((section, idx) => {
          const pos = (idx / (sections.length - 1)) * 100;
          const isPast = scrollPercent >= pos - 1; // Small buffer
          const isActive = activeSection === section.title;
          
          return (
            <div 
              key={section.id}
              className={`absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 border border-bone transition-all duration-700 rounded-full ${
                isPast ? 'bg-gold scale-125' : 'bg-charcoal/10'
              } ${isActive ? 'ring-4 ring-gold/20 scale-150' : ''}`}
              style={{ top: `${pos}%` }}
            >
               {/* Hover Label for Markers */}
               <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:block">
                  <span className="text-[8px] uppercase tracking-widest text-charcoal/30 whitespace-nowrap">{section.title}</span>
               </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VerticalProgressBar;
