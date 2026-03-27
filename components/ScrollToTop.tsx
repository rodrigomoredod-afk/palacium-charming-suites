
import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { useLocale } from '../contexts/LocaleContext';

const ScrollToTop: React.FC = () => {
  const { locale } = useLocale();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down 400px
      if (window.pageYOffset > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label={locale === 'pt' ? 'Voltar ao topo' : 'Back to top'}
      className={`
        fixed bottom-6 right-6 z-[120]
        bg-gold text-white p-3 rounded-full shadow-2xl
        transition-all duration-500 ease-out transform
        active:scale-90
        ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-50 pointer-events-none'}
      `}
    >
      <ChevronUp className="w-6 h-6" />
    </button>
  );
};

export default ScrollToTop;
