
import React, { useEffect, useState } from 'react';
import Header from './components/Header.tsx';
import Hero from './components/Hero.tsx';
import Introduction from './components/Introduction.tsx';
import Amenities from './components/Amenities.tsx';
import SuitesGallery from './components/SuitesGallery.tsx';
import Testimonials from './components/Testimonials.tsx';
import Partners from './components/Partners.tsx';
import Map from './components/Map.tsx';
import FinalCTA from './components/FinalCTA.tsx';
import Footer from './components/Footer.tsx';
import History from './components/History.tsx';
import SuitesPage from './components/SuitesPage.tsx';
import Experiences from './components/Experiences.tsx';
import AboutUs from './components/AboutUs.tsx';
import Gallery from './components/Gallery.tsx';
import AdminPanel from './components/AdminPanel.tsx';
import BookingModal from './components/BookingModal.tsx';
import SuiteDetailsDrawer from './components/SuiteDetailsDrawer.tsx';
import VerticalProgressBar from './components/VerticalProgressBar.tsx';
import ScrollToTop from './components/ScrollToTop.tsx';
import { ViewType, InitialBookingData, Suite } from './types.ts';
import { useLocale } from './contexts/LocaleContext.tsx';
import { trackEvent } from './lib/analytics.ts';

const App: React.FC = () => {
  const { locale } = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [view, setView] = useState<ViewType>('home');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [initialBookingData, setInitialBookingData] = useState<InitialBookingData>({});
  const [suiteDetailsSuite, setSuiteDetailsSuite] = useState<Suite | null>(null);
  const [isSuiteDetailsOpen, setIsSuiteDetailsOpen] = useState(false);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const elements = document.querySelectorAll('.scroll-reveal');
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top <= window.innerHeight * 0.85;
        if (isVisible) el.classList.add('visible');
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [view]);

  const navigateTo = (newView: ViewType) => {
    setView(newView);
    trackEvent('page_view', { view: newView, locale });
    window.scrollTo(0, 0);
  };

  const openBooking = (data?: InitialBookingData) => {
    if (data) {
      setInitialBookingData(data);
    } else {
      setInitialBookingData({});
    }
    setIsBookingOpen(true);
  };
  
  const closeBooking = () => setIsBookingOpen(false);

  const openSuiteDetails = (suite: Suite) => {
    setSuiteDetailsSuite(suite);
    setIsSuiteDetailsOpen(true);
    trackEvent('suite_details_open', {
      suiteId: suite.id,
      locale,
      view,
    });
  };

  const closeSuiteDetails = () => setIsSuiteDetailsOpen(false);

  const renderView = () => {
    switch (view) {
      case 'home':
        return (
          <>
            <VerticalProgressBar />
            <Hero navigateTo={navigateTo} openBooking={openBooking} />
            <Introduction navigateTo={navigateTo} />
            <Amenities />
            <SuitesGallery
              navigateTo={navigateTo}
              openBooking={openBooking}
              openSuiteDetails={openSuiteDetails}
            />
            <Testimonials />
            <Partners />
            <Map />
            <FinalCTA navigateTo={navigateTo} openBooking={openBooking} />
          </>
        );
      case 'history':
        return <History navigateTo={navigateTo} />;
      case 'suites':
        return (
          <SuitesPage
            navigateTo={navigateTo}
            openBooking={openBooking}
            openSuiteDetails={openSuiteDetails}
          />
        );
      case 'experiences':
        return <Experiences navigateTo={navigateTo} />;
      case 'about':
        return <AboutUs navigateTo={navigateTo} />;
      case 'gallery':
        return <Gallery navigateTo={navigateTo} />;
      case 'admin':
        return <AdminPanel navigateTo={navigateTo} />;
      default:
        return <Hero navigateTo={navigateTo} openBooking={openBooking} />;
    }
  };

  return (
    <div className="min-h-screen selection:bg-gold/30 flex flex-col">
      <a href="#main-content" className="skip-link">
        {locale === 'pt' ? 'Pular para o conteúdo principal' : 'Skip to main content'}
      </a>
      {/* Hide Header on Admin Page */}
      {view !== 'admin' && (
        <Header 
          scrolled={scrolled} 
          navigateTo={navigateTo} 
          currentView={view} 
          openBooking={() => openBooking()} 
        />
      )}
      <main id="main-content" className="flex-grow outline-none" tabIndex={-1}>
        {renderView()}
      </main>
      {view !== 'admin' && <Footer navigateTo={navigateTo} />}
      
      <ScrollToTop />
      
      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={closeBooking} 
        initialData={initialBookingData}
      />

      {view !== 'admin' && (
        <SuiteDetailsDrawer
          suite={suiteDetailsSuite}
          locale={locale}
          isOpen={isSuiteDetailsOpen}
          onClose={closeSuiteDetails}
          onBook={() => {
            closeSuiteDetails();
            openBooking();
          }}
        />
      )}
    </div>
  );
};

export default App;
