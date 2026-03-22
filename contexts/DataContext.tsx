
import React, { createContext, useContext, useState, useEffect } from 'react';
import { SUITES as INITIAL_SUITES, REVIEWS as INITIAL_REVIEWS, GUEST_SCORE } from '../constants';
import { Suite, Review, Reservation } from '../types';

interface DataContextType {
  suites: Suite[];
  reviews: Review[];
  reservations: Reservation[];
  /** Shown on site as “official” Booking-style score; update manually or sync later from PMS/API */
  bookingDisplayScore: number;
  updateSuitePrice: (id: string, newPrice: number) => void;
  addReview: (review: Review) => void;
  deleteReview: (id: string) => void;
  addReservation: (
    r: Omit<Reservation, 'id' | 'createdAt'> & { id?: string; createdAt?: string }
  ) => Reservation;
  updateReservation: (id: string, patch: Partial<Reservation>) => void;
  deleteReservation: (id: string) => void;
  setBookingDisplayScore: (score: number) => void;
  resetData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [suites, setSuites] = useState<Suite[]>(() => {
    const saved = localStorage.getItem('palacium_suites_data_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing saved data", e);
      }
    }
    return INITIAL_SUITES;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('palacium_reviews_data_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing saved reviews", e);
      }
    }
    return INITIAL_REVIEWS;
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem('palacium_reservations_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing saved reservations", e);
      }
    }
    return [];
  });

  const [bookingDisplayScore, setBookingDisplayScoreState] = useState<number>(() => {
    const saved = localStorage.getItem('palacium_booking_score_v1');
    if (saved) {
      const n = parseFloat(saved);
      if (!Number.isNaN(n) && n >= 0 && n <= 10) return n;
    }
    return GUEST_SCORE;
  });

  useEffect(() => {
    localStorage.setItem('palacium_suites_data_v2', JSON.stringify(suites));
  }, [suites]);

  useEffect(() => {
    localStorage.setItem('palacium_reviews_data_v1', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('palacium_reservations_v1', JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem('palacium_booking_score_v1', String(bookingDisplayScore));
  }, [bookingDisplayScore]);

  const updateSuitePrice = (id: string, newPrice: number) => {
    setSuites(prev => prev.map(suite => 
      suite.id === id ? { ...suite, price: newPrice } : suite
    ));
  };

  const addReview = (review: Review) => {
    setReviews(prev => [review, ...prev]);
  };

  const deleteReview = (id: string) => {
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  const addReservation: DataContextType['addReservation'] = (incoming) => {
    const id =
      incoming.id ??
      (typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2));
    const createdAt = incoming.createdAt ?? new Date().toISOString();
    const row: Reservation = {
      ...incoming,
      id,
      createdAt,
      childrenCount: incoming.childrenCount ?? 0,
    };
    setReservations((prev) => [row, ...prev]);
    return row;
  };

  const updateReservation = (id: string, patch: Partial<Reservation>) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...patch, updatedAt: new Date().toISOString() } : r))
    );
  };

  const deleteReservation = (id: string) => {
    setReservations((prev) => prev.filter((r) => r.id !== id));
  };

  const setBookingDisplayScore = (score: number) => {
    const n = Math.min(10, Math.max(0, score));
    setBookingDisplayScoreState(Math.round(n * 10) / 10);
  };

  const resetData = () => {
    setSuites(INITIAL_SUITES);
    setReviews(INITIAL_REVIEWS);
    localStorage.removeItem('palacium_suites_data_v2');
    localStorage.removeItem('palacium_reviews_data_v1');
  };

  return (
    <DataContext.Provider
      value={{
        suites,
        reviews,
        reservations,
        bookingDisplayScore,
        updateSuitePrice,
        addReview,
        deleteReview,
        addReservation,
        updateReservation,
        deleteReservation,
        setBookingDisplayScore,
        resetData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
