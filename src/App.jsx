import React, { useRef, useState, useEffect } from 'react';
import './styles/variables.css';
import './styles/reset.css';
import './styles/global.css';

import { useScrollFrameAnimation } from './hooks/useScrollFrameAnimation';
import { useScrollReveal } from './hooks/useScrollReveal';
import { useActiveNavObserver } from './hooks/useActiveNavObserver';
import { use3DTilt } from './hooks/use3DTilt';

import { Preloader } from './components/Preloader/Preloader';
import { FrameCanvas } from './components/FrameCanvas/FrameCanvas';
import { Header } from './components/Header/Header';
import { LegalModal } from './components/LegalModal/LegalModal';
import { BookingModal } from './components/BookingModal/BookingModal';

import { Hero } from './sections/Hero/Hero';
import { Services } from './sections/Services/Services';
import { Works } from './sections/Works/Works';
import { About } from './sections/About/About';
import { Contact } from './sections/Contact/Contact';
import { Footer } from './sections/Footer/Footer';

export function App() {
  const canvasRef = useRef(null);
  const { loadProgress, isLoaded } = useScrollFrameAnimation(canvasRef);
  const activeSection = useActiveNavObserver();
  const [activeLegalDoc, setActiveLegalDoc] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedBookingService, setSelectedBookingService] = useState('');

  useScrollReveal();
  use3DTilt();

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#terms-and-conditions') setActiveLegalDoc('terms');
      else if (hash === '#privacy-policy') setActiveLegalDoc('privacy');
      else if (hash === '#cookie-policy') setActiveLegalDoc('cookie');
      else if (hash === '#book') {
        setIsBookingOpen(true);
        setSelectedBookingService('');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleOpenBooking = (serviceName = '') => {
    setSelectedBookingService(serviceName);
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
  };

  return (
    <>
      <Preloader loadProgress={loadProgress} isLoaded={isLoaded} />

      <Header activeSection={activeSection} onOpenBooking={handleOpenBooking} />

      <main className="content-wrapper">
        <Hero onOpenBooking={handleOpenBooking} />
        <Services onOpenBooking={handleOpenBooking} />
        <Works />
        <About />
        <Contact />
        <Footer onOpenLegal={(type) => setActiveLegalDoc(type)} />
      </main>

      <BookingModal
        isOpen={isBookingOpen}
        initialService={selectedBookingService}
        onClose={handleCloseBooking}
        onOpenLegal={(type) => setActiveLegalDoc(type)}
      />

      <LegalModal activeDocType={activeLegalDoc} onClose={() => setActiveLegalDoc(null)} />

      <FrameCanvas ref={canvasRef} />
    </>
  );
}

export default App;

