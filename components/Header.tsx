
import React, { useState, useEffect } from 'react';
import { Menu, X, CalendarCheck } from 'lucide-react';
import { ViewType } from '../types';
import Logo from './Logo';
import { useLocale } from '../contexts/LocaleContext';

interface HeaderProps {
  scrolled: boolean;
  navigateTo: (view: ViewType) => void;
  currentView: ViewType;
  openBooking: () => void;
}

const Header: React.FC<HeaderProps> = ({ scrolled, navigateTo, currentView, openBooking }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { locale, toggleLocale } = useLocale();

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleNav = (view: ViewType) => {
    setIsMenuOpen(false);
    setTimeout(() => {
      navigateTo(view);
    }, 300);
  };

  const handleBooking = () => {
    setIsMenuOpen(false);
    setTimeout(() => {
      openBooking();
    }, 300);
  };

  const isTransparentView = currentView === 'home' || currentView === 'experiences';
  const isHeaderDark = scrolled || isMenuOpen || !isTransparentView;

  const navLinks: { label: string; view: ViewType }[] = [
    { label: locale === 'pt' ? 'Início' : 'Home', view: 'home' },
    { label: locale === 'pt' ? 'História' : 'History', view: 'history' },
    { label: 'Suites', view: 'suites' },
    { label: locale === 'pt' ? 'Parceiros' : 'Partners', view: 'experiences' },
    { label: locale === 'pt' ? 'Galeria' : 'Gallery', view: 'gallery' },
    { label: locale === 'pt' ? 'Sobre Nós' : 'About Us', view: 'about' },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-[120] transition-all duration-700 ease-in-out py-4 md:py-2 px-4 md:px-16 flex justify-between items-center ${
          scrolled || !isTransparentView
            ? 'bg-white/95 backdrop-blur-md border-b border-charcoal/5 shadow-lg' 
            : isMenuOpen ? 'bg-transparent' : 'bg-transparent'
        }`}
      >
        <div 
          onClick={() => handleNav('home')}
          className="z-[130] cursor-pointer transition-transform active:scale-95"
        >
          <Logo 
            className="h-14 md:h-20" 
            color={isHeaderDark ? 'gold' : 'white'} 
          />
        </div>
        
        <nav className={`hidden lg:flex items-center space-x-10 text-[10px] uppercase tracking-[0.3em] font-semibold transition-colors duration-500 ${
          isHeaderDark ? 'text-charcoal' : 'text-white'
        }`}>
          {navLinks.slice(1).map((link) => (
            <button 
              key={link.view}
              onClick={() => handleNav(link.view)} 
              className="hover:text-gold transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold transition-all group-hover:w-full"></span>
            </button>
          ))}

          <button
            onClick={toggleLocale}
            className="hover:text-gold transition-colors"
            aria-label={locale === 'pt' ? 'Mudar idioma' : 'Change language'}
          >
            {locale.toUpperCase()}
          </button>
          
          {/* Enhanced Booking Button */}
          <button 
            onClick={handleBooking}
            className={`
              relative overflow-hidden group px-9 py-3 rounded-sm transition-all duration-500 border
              ${isHeaderDark
                ? 'border-charcoal/10 text-charcoal hover:border-gold' 
                : 'border-white/30 text-white hover:border-gold'
              }
            `}
          >
            {/* Hover Fill Background */}
            <div className="absolute inset-0 bg-gold transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"></div>
            
            {/* Content */}
            <span className={`relative z-10 flex items-center justify-center font-bold transition-colors duration-300 group-hover:text-white`}>
              <span>{locale === 'pt' ? 'RESERVAR' : 'BOOK'}</span>
              <CalendarCheck className="w-0 h-3.5 opacity-0 group-hover:w-3.5 group-hover:ml-2 group-hover:opacity-100 transition-all duration-500 ease-out" />
            </span>
          </button>
        </nav>

        <div className="flex items-center gap-2 lg:hidden z-[130]">
          {(scrolled || !isTransparentView) && !isMenuOpen && (
            <button 
              onClick={handleBooking}
              className="bg-gold text-white px-5 py-2.5 rounded-sm text-[9px] uppercase tracking-[0.2em] font-bold shadow-lg shadow-gold/20 animate-fade-left active:scale-95 transition-transform flex items-center gap-2"
            >
              {locale === 'pt' ? 'Reservar' : 'Book'}
            </button>
          )}

          <button 
            onClick={toggleMenu}
            className={`p-2 transition-all duration-500 transform ${isMenuOpen ? 'rotate-90 text-charcoal' : 'rotate-0'} ${
              isHeaderDark ? 'text-charcoal' : 'text-white'
            }`}
            aria-label={isMenuOpen ? (locale === 'pt' ? 'Fechar menu' : 'Close menu') : (locale === 'pt' ? 'Abrir menu' : 'Open menu')}
          >
            {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-bone transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] z-[115] flex flex-col items-center justify-center lg:hidden overflow-y-auto ${
          isMenuOpen 
            ? 'opacity-100 visible translate-x-0' 
            : 'opacity-0 invisible translate-x-full'
        }`}
      >
        <nav className="w-full flex flex-col items-center space-y-8 px-6 py-20 text-center relative z-10">
          <div className="space-y-4 w-full">
            <button
              onClick={toggleLocale}
              style={{ transitionDelay: '50ms' }}
              className={`block w-full text-charcoal/80 text-base tracking-[0.3em] uppercase transition-all duration-500 ${
                isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
            >
              {locale.toUpperCase()}
            </button>

            {navLinks.map((link, index) => (
              <button 
                key={link.view}
                onClick={() => handleNav(link.view)} 
                style={{ transitionDelay: `${index * 50 + 100}ms` }}
                className={`block w-full text-charcoal font-serif text-4xl hover:text-gold transition-all duration-500 uppercase tracking-[0.05em] transform ${
                  isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
          
          <div 
            style={{ transitionDelay: '400ms' }}
            className={`w-12 h-[1px] bg-gold/40 my-6 transition-all duration-700 transform ${
              isMenuOpen ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
            }`}
          ></div>
          
          <button 
            onClick={handleBooking}
            style={{ transitionDelay: '500ms' }}
            className={`bg-gold text-white px-14 py-5 rounded-sm uppercase text-[11px] tracking-[0.4em] font-bold shadow-2xl shadow-gold/20 active:scale-95 transition-all duration-700 transform hover:bg-charcoal flex items-center gap-3 ${
              isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
          >
            <span>{locale === 'pt' ? 'Reservar Agora' : 'Book Now'}</span>
            <CalendarCheck className="w-4 h-4" />
          </button>
        </nav>

        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${isMenuOpen ? 'opacity-[0.03]' : 'opacity-0'} pointer-events-none`}>
          <Logo className="h-96 w-96" showText={false} color="charcoal" />
        </div>
      </div>
    </>
  );
};

export default Header;
