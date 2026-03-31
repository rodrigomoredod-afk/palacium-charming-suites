
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Calendar, Users, ChevronDown, ImageIcon, Search, ArrowRight, Check } from 'lucide-react';
import { heroSlideshow } from '../images';
import { ViewType, InitialBookingData } from '../types';
import { useLocale } from '../contexts/LocaleContext';
import { useData } from '../contexts/DataContext';

interface HeroProps {
  navigateTo: (view: ViewType) => void;
  openBooking: (data?: InitialBookingData) => void;
}

// Standalone component to prevent unmounting issues on state changes
interface BookingBarContentProps {
  isStickyVersion?: boolean;
  locale: 'pt' | 'en';
  cInRef: React.RefObject<HTMLInputElement | null>;
  cOutRef: React.RefObject<HTMLInputElement | null>;
  dropdownOpen: boolean;
  setDropdownOpen: (open: boolean) => void;
  checkIn: string;
  checkOut: string;
  guests: string;
  setGuests: (val: string) => void;
  handleCheckInChange: (val: string) => void;
  setCheckOut: (val: string) => void;
  formatDateDisplay: (date: string) => string;
  getTodayStr: () => string;
  getTomorrowStr: (date: string) => string;
  handleSearch: (e: React.MouseEvent) => void;
}

const BookingBarContent: React.FC<BookingBarContentProps> = ({ 
  isStickyVersion = false,
  locale,
  cInRef,
  cOutRef,
  dropdownOpen,
  setDropdownOpen,
  checkIn,
  checkOut,
  guests,
  setGuests,
  handleCheckInChange,
  setCheckOut,
  formatDateDisplay,
  getTodayStr,
  getTomorrowStr,
  handleSearch
}) => {
  return (
    <div className={`flex flex-col md:flex-row items-stretch w-full ${isStickyVersion ? 'h-full' : 'gap-1 md:gap-0'}`}>
      
      {/* Check In */}
      <div 
        className={`relative flex-1 group cursor-pointer transition-all duration-300 ${isStickyVersion ? 'border-r border-white/5' : 'md:border-r border-white/10 hover:bg-white/5 rounded-t-sm md:rounded-none'}`}
        onClick={() => {
          setDropdownOpen(false);
          cInRef.current?.showPicker();
        }}
      >
        <div className={`px-6 py-4 md:px-8 md:py-5 flex items-center justify-between`}>
          <div className="space-y-1">
            <label className="block text-[8px] uppercase tracking-[0.24em] md:tracking-[0.4em] text-gold font-black">
              {locale === 'pt' ? 'Entrada' : 'Check-in'}
            </label>
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-gold/50" />
              <span className="text-sm md:text-base text-white font-medium [font-variant-numeric:lining-nums]">
                {formatDateDisplay(checkIn)}
              </span>
            </div>
          </div>
        </div>
        <input 
          ref={cInRef}
          type="date"
          min={getTodayStr()}
          value={checkIn}
          onChange={(e) => handleCheckInChange(e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
      </div>

      {/* Check Out */}
      <div 
        className={`relative flex-1 group cursor-pointer transition-all duration-300 ${isStickyVersion ? 'border-r border-white/5' : 'md:border-r border-white/10 hover:bg-white/5'}`}
        onClick={() => {
          setDropdownOpen(false);
          cOutRef.current?.showPicker();
        }}
      >
        <div className={`px-6 py-4 md:px-8 md:py-5 flex items-center justify-between`}>
          <div className="space-y-1">
            <label className="block text-[8px] uppercase tracking-[0.24em] md:tracking-[0.4em] text-gold font-black">
              {locale === 'pt' ? 'Saída' : 'Check-out'}
            </label>
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-gold/50" />
              <span className="text-sm md:text-base text-white font-medium [font-variant-numeric:lining-nums]">
                {formatDateDisplay(checkOut)}
              </span>
            </div>
          </div>
        </div>
        <input 
          ref={cOutRef}
          type="date"
          min={getTomorrowStr(checkIn)}
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
      </div>

      {/* Guests (Custom Dropdown) */}
      <div className={`relative flex-1 group transition-all duration-300 ${isStickyVersion ? 'border-r border-white/5 hidden lg:flex' : 'md:border-r border-white/10'}`}>
        <div 
          className={`px-6 py-4 md:px-8 md:py-5 flex items-center justify-between w-full h-full cursor-pointer hover:bg-white/5 transition-colors`}
          onClick={(e) => {
            e.stopPropagation();
            setDropdownOpen(!dropdownOpen);
          }}
        >
          <div className="space-y-1">
            <label className="block text-[8px] uppercase tracking-[0.24em] md:tracking-[0.4em] text-gold font-black">
              {locale === 'pt' ? 'Comitiva' : 'Guests'}
            </label>
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-gold/50" />
              <span className="text-sm md:text-base text-white font-medium">
                {guests}
              </span>
            </div>
          </div>
          <ChevronDown className={`w-4 h-4 text-white/20 group-hover:text-gold transition-all duration-300 ${dropdownOpen ? 'rotate-180 text-gold' : ''}`} />
        </div>

        {/* Floating Custom List */}
        {dropdownOpen && (
          <>
            {/* Backdrop with stopPropagation to avoid trigger conflict */}
            <div 
              className="fixed inset-0 z-[120]" 
              onClick={(e) => {
                e.stopPropagation();
                setDropdownOpen(false);
              }}
            ></div>
            
            <div 
              className={`absolute ${isStickyVersion ? 'top-[calc(100%+1px)]' : 'top-[calc(100%+8px)]'} right-0 left-0 md:left-auto md:w-64 bg-white border border-charcoal/10 shadow-2xl rounded-sm z-[130] overflow-hidden animate-fade-up`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-2 space-y-1">
                {[1, 2, 3, 4, 5, 6].map(n => {
                  const label = locale === 'pt' ? `${n} Adulto${n > 1 ? 's' : ''}` : `${n} Adult${n > 1 ? 's' : ''}`;
                  const isSelected = guests === label;
                  return (
                    <button 
                      key={n}
                      type="button"
                      onClick={() => {
                        setGuests(label);
                        setDropdownOpen(false);
                      }}
                      className={`
                        w-full flex items-center justify-between px-4 py-3 rounded-sm transition-all text-left
                        ${isSelected ? 'bg-gold/10 text-gold font-bold' : 'text-charcoal hover:bg-bone'}
                      `}
                    >
                      <span className="text-xs md:text-sm font-serif [font-variant-numeric:lining-nums]">{label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-gold" strokeWidth={3} />}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Action Button */}
      <div className={`${isStickyVersion ? 'md:w-64' : 'w-full md:w-56 p-2 md:p-3'}`}>
        <button 
          onClick={handleSearch}
          className={`
            w-full h-full flex items-center justify-center gap-3 transition-all duration-500 font-black uppercase rounded-sm
            ${isStickyVersion 
              ? 'bg-gold text-white hover:bg-white hover:text-charcoal' 
              : 'bg-gold text-white py-5 md:py-0 hover:bg-white hover:text-charcoal shadow-xl hover:shadow-gold/20'
            }
          `}
        >
          <span className="text-[10px] tracking-[0.18em] md:tracking-[0.3em] whitespace-nowrap">
            {isStickyVersion
              ? (locale === 'pt' ? 'Reservar' : 'Book')
              : (locale === 'pt' ? 'Consultar' : 'Search')}
          </span>
          <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isStickyVersion ? 'hidden xl:block' : ''}`} />
        </button>
      </div>
    </div>
  );
};

const Hero: React.FC<HeroProps> = ({ navigateTo, openBooking }) => {
  const { locale } = useLocale();
  const { siteContent } = useData();
  const slideshowImages = useMemo(() => {
    const o = siteContent.heroSlideshowOverride;
    if (o && o.length > 0) {
      const filtered = o.map((u) => u.trim()).filter(Boolean);
      if (filtered.length > 0) return filtered;
    }
    return heroSlideshow;
  }, [siteContent.heroSlideshowOverride]);
  const [scrollY, setScrollY] = useState(0);
  const [isSticky, setIsSticky] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  
  const getTodayStr = () => new Date().toISOString().split('T')[0];
  const getTomorrowStr = (dateStr: string) => {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const [checkIn, setCheckIn] = useState(getTodayStr());
  const [checkOut, setCheckOut] = useState(getTomorrowStr(getTodayStr()));
  const [guests, setGuests] = useState(locale === 'pt' ? '2 Adultos' : '2 Adults');
  const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false);
  const [isStickyGuestDropdownOpen, setIsStickyGuestDropdownOpen] = useState(false);

  const checkInRef = useRef<HTMLInputElement>(null);
  const checkOutRef = useRef<HTMLInputElement>(null);
  const stickyCheckInRef = useRef<HTMLInputElement>(null);
  const stickyCheckOutRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const match = guests.match(/^(\d+)\s/);
    if (!match) return;
    const n = Number(match[1]);
    if (Number.isNaN(n)) return;
    const ptLabel = `${n} Adulto${n > 1 ? 's' : ''}`;
    const enLabel = `${n} Adult${n > 1 ? 's' : ''}`;
    const next = locale === 'pt' ? ptLabel : enLabel;
    if (guests !== next) setGuests(next);
  }, [locale, guests]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setScrollY(currentScroll);
      if (heroRef.current) {
        const heroHeight = heroRef.current.offsetHeight;
        setIsSticky(currentScroll > heroHeight * 0.8);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (slideshowImages.length === 0) return;
    setCurrentImageIndex((prev) => prev % slideshowImages.length);
  }, [slideshowImages]);

  useEffect(() => {
    if (slideshowImages.length === 0) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % slideshowImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slideshowImages]);

  const handleCheckInChange = (val: string) => {
    setCheckIn(val);
    const selectedIn = new Date(val);
    const currentOut = new Date(checkOut);
    if (selectedIn >= currentOut) {
      setCheckOut(getTomorrowStr(val));
    }
  };

  const handleSearch = (e: React.MouseEvent) => {
    e.preventDefault();
    openBooking({ checkIn, checkOut, guests });
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return locale === 'pt' ? 'Data' : 'Date';
    try {
      const [y, m, d] = dateStr.split('-');
      const months = locale === 'pt'
        ? ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
        : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${d} ${months[parseInt(m) - 1]}`;
    } catch (e) {
      return dateStr;
    }
  };

  const parallaxOffset = scrollY * 0.4;
  const contentOpacity = Math.max(0, 1 - scrollY / 700);

  return (
    <>
      <section id="hero" ref={heroRef} className="relative h-screen min-h-[750px] flex flex-col items-center justify-start md:justify-center text-center px-4 overflow-hidden pt-32 md:pt-0">
        
        {/* Background Slider */}
        <div className="absolute inset-0 z-0 bg-charcoal">
          {slideshowImages.map((img, index) => (
            <div
              key={`${index}-${img}`}
              className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img 
                src={img} 
                alt="" 
                className="w-full h-full object-cover animate-ken-burns scale-110 will-change-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-charcoal/95 via-charcoal/30 to-charcoal/95"></div>
            </div>
          ))}
        </div>

        <div 
          className="relative z-10 max-w-5xl mx-auto space-y-6 md:space-y-10 flex flex-col items-center mb-8 md:mb-16 will-change-transform"
          style={{ 
            transform: `translate3d(0, ${parallaxOffset}px, 0) scale(${1 + scrollY * 0.0002})`,
            opacity: contentOpacity
          }}
        >
          <span className="inline-block text-gold uppercase tracking-[0.35em] md:tracking-[0.5em] text-[10px] md:text-xs font-bold animate-fade-up [animation-delay:200ms]">
            {locale === 'pt' ? 'Experiência Singular' : 'Singular Experience'}
          </span>
          
          <div className="space-y-4 md:space-y-6 overflow-hidden">
             <h1 className="font-serif text-3xl sm:text-6xl md:text-8xl text-white leading-[1.1] md:leading-[1] animate-fade-up [animation-delay:400ms] px-2 transform-gpu">
              {locale === 'pt' ? 'Onde o Tempo' : 'Where Time'} <br className="hidden sm:block" /> <span className="italic font-light">{locale === 'pt' ? 'Encontra a Alma.' : 'Meets the Soul.'}</span>
            </h1>
            <p className="text-white/70 text-xs md:text-xl font-light max-w-2xl mx-auto animate-fade-up [animation-delay:600ms] px-6 tracking-wide">
              {locale === 'pt'
                ? 'Descubra o encanto de um retiro exclusivo no coração de Figueiró dos Vinhos.'
                : 'Discover the charm of an exclusive retreat in the heart of Figueiró dos Vinhos.'}
            </p>
          </div>
          
          <div className="animate-fade-up [animation-delay:800ms] pt-2">
            <button 
              onClick={() => navigateTo('gallery')}
              className="group relative overflow-hidden px-10 py-4 border border-white/30 text-white rounded-sm transition-all duration-500 hover:border-gold hover:shadow-[0_0_40px_rgba(184,147,82,0.3)]"
            >
              <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
              <div className="relative z-10 flex items-center gap-3">
                <ImageIcon className="w-4 h-4 text-white/70 group-hover:text-white transition-colors duration-500" />
                <span className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] font-bold group-hover:text-white transition-colors duration-500">
                  {locale === 'pt' ? 'Ver Galeria' : 'View Gallery'}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Hero Booking Bar */}
        <div 
          className="relative z-20 w-full max-w-5xl px-2 md:px-4 mb-32 md:mb-0 animate-fade-up [animation-delay:1000ms]"
          style={{ transform: `translate3d(0, ${parallaxOffset * 0.2}px, 0)` }}
        >
          <div className="bg-charcoal/90 backdrop-blur-xl border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.6)] rounded-sm transform transition-all duration-700 hover:border-gold/30">
            <BookingBarContent 
              locale={locale}
              cInRef={checkInRef} 
              cOutRef={checkOutRef} 
              dropdownOpen={isGuestDropdownOpen}
              setDropdownOpen={setIsGuestDropdownOpen}
              checkIn={checkIn}
              checkOut={checkOut}
              guests={guests}
              setGuests={setGuests}
              handleCheckInChange={handleCheckInChange}
              setCheckOut={setCheckOut}
              formatDateDisplay={formatDateDisplay}
              getTodayStr={getTodayStr}
              getTomorrowStr={getTomorrowStr}
              handleSearch={handleSearch}
            />
          </div>
          <p className="mt-4 text-[9px] uppercase tracking-[0.4em] text-white/20 font-black hidden md:block">
            {locale === 'pt' ? 'Melhor Tarifa Garantida · Cancelamento Flexível' : 'Best Rate Guaranteed · Flexible Cancellation'}
          </p>
        </div>

        <div className="absolute bottom-12 md:bottom-10 left-1/2 -translate-x-1/2 z-30 pointer-events-none" style={{ opacity: contentOpacity }}>
          <button 
            className="flex flex-col items-center gap-2 animate-bounce pointer-events-auto group cursor-pointer" 
            onClick={() => document.getElementById('heritage')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span className="text-[7px] md:text-[8px] uppercase tracking-[0.3em] md:tracking-[0.45em] font-bold pl-[0.3em] md:pl-[0.45em] text-white/40 group-hover:text-gold transition-colors">
              {locale === 'pt' ? 'Descobrir' : 'Discover'}
            </span>
            <ChevronDown className="w-4 h-4 text-gold/40 group-hover:text-gold transition-colors" aria-hidden="true" />
          </button>
        </div>
      </section>

      {/* Sticky Fixed Bar */}
      <div 
        className={`hidden md:block fixed top-[88px] md:top-[85px] left-0 right-0 z-[110] bg-charcoal/95 backdrop-blur-md border-b border-white/5 shadow-2xl transition-all duration-500 transform ${
          isSticky ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-16">
          <BookingBarContent 
            isStickyVersion={true} 
            locale={locale}
            cInRef={stickyCheckInRef} 
            cOutRef={stickyCheckOutRef}
            dropdownOpen={isStickyGuestDropdownOpen}
            setDropdownOpen={setIsStickyGuestDropdownOpen}
            checkIn={checkIn}
            checkOut={checkOut}
            guests={guests}
            setGuests={setGuests}
            handleCheckInChange={handleCheckInChange}
            setCheckOut={setCheckOut}
            formatDateDisplay={formatDateDisplay}
            getTodayStr={getTodayStr}
            getTomorrowStr={getTomorrowStr}
            handleSearch={handleSearch}
          />
        </div>
      </div>
    </>
  );
};

export default Hero;
