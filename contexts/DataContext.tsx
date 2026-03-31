
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SUITES as INITIAL_SUITES,
  REVIEWS as INITIAL_REVIEWS,
  GUEST_SCORE,
  INITIAL_SITE_CONTENT,
} from '../constants';
import { mergeSiteContent } from '../lib/siteContentMerge';
import { readAuthToken } from '../lib/auth';
import {
  fetchSiteData,
  patchAdminSuite,
  postAdminReview,
  deleteAdminReview,
  putAdminSiteContent,
  putAdminBookingScore,
} from '../lib/siteDataApi';
import type { Suite, Review, Reservation, SiteContent, SuitePriceRule } from '../types';

const SITE_DATA_API =
  typeof import.meta.env !== 'undefined' && import.meta.env.VITE_ENABLE_SITE_DATA_API === 'true';

const SUITE_PRICE_RULES_KEY = 'palacium_suite_price_rules_v1';

function parseSuitePriceRules(raw: unknown): SuitePriceRule[] {
  if (!Array.isArray(raw)) return [];
  const out: SuitePriceRule[] = [];
  for (const x of raw) {
    if (!x || typeof x !== 'object') continue;
    const o = x as Record<string, unknown>;
    if (
      typeof o.id === 'string' &&
      typeof o.suiteId === 'string' &&
      typeof o.startDate === 'string' &&
      typeof o.endDate === 'string' &&
      typeof o.nightlyPrice === 'number' &&
      typeof o.updatedAt === 'string'
    ) {
      out.push({
        id: o.id,
        suiteId: o.suiteId,
        startDate: o.startDate,
        endDate: o.endDate,
        nightlyPrice: o.nightlyPrice,
        ...(typeof o.note === 'string' ? { note: o.note } : {}),
        updatedAt: o.updatedAt,
      });
    }
  }
  return out;
}

function syncSiteDataWrites(): boolean {
  return SITE_DATA_API && readAuthToken() !== null;
}

interface DataContextType {
  suites: Suite[];
  reviews: Review[];
  reservations: Reservation[];
  /** Shown on site as “official” Booking-style score; update manually or sync later from PMS/API */
  bookingDisplayScore: number;
  updateSuitePrice: (id: string, newPrice: number) => void;
  updateSuiteImage: (id: string, imageUrl: string) => void;
  addReview: (review: Review) => void;
  deleteReview: (id: string) => void;
  addReservation: (
    r: Omit<Reservation, 'id' | 'createdAt'> & { id?: string; createdAt?: string }
  ) => Reservation;
  updateReservation: (id: string, patch: Partial<Reservation>) => void;
  deleteReservation: (id: string) => void;
  setBookingDisplayScore: (score: number) => void;
  siteContent: SiteContent;
  updateHeroContent: (locale: 'pt' | 'en', patch: Partial<SiteContent['hero']['pt']>) => void;
  setHeroSlideshowOverride: (urls: string[] | null) => void;
  /** Sazonalidade: períodos com preço/noite por suite (localStorage). */
  suitePriceRules: SuitePriceRule[];
  addSuitePriceRule: (r: Omit<SuitePriceRule, 'id' | 'updatedAt'>) => void;
  deleteSuitePriceRule: (id: string) => void;
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

  const [siteContent, setSiteContent] = useState<SiteContent>(() => {
    const saved = localStorage.getItem('palacium_site_content_v1');
    if (saved) {
      try {
        return mergeSiteContent(JSON.parse(saved));
      } catch (e) {
        console.error('Error parsing saved site content', e);
      }
    }
    return INITIAL_SITE_CONTENT;
  });

  const [suitePriceRules, setSuitePriceRules] = useState<SuitePriceRule[]>(() => {
    const saved = localStorage.getItem(SUITE_PRICE_RULES_KEY);
    if (saved) {
      try {
        return parseSuitePriceRules(JSON.parse(saved));
      } catch (e) {
        console.error('Error parsing suite price rules', e);
      }
    }
    return [];
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

  useEffect(() => {
    localStorage.setItem('palacium_site_content_v1', JSON.stringify(siteContent));
  }, [siteContent]);

  useEffect(() => {
    localStorage.setItem(SUITE_PRICE_RULES_KEY, JSON.stringify(suitePriceRules));
  }, [suitePriceRules]);

  useEffect(() => {
    if (!SITE_DATA_API) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchSiteData();
        if (cancelled || !data) return;
        setSuites(data.suites);
        setReviews(data.reviews);
        setSiteContent(mergeSiteContent(data.siteContent));
        setBookingDisplayScoreState(data.bookingDisplayScore);
      } catch (e) {
        console.error('[DataContext] site-data', e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const updateSuitePrice = (id: string, newPrice: number) => {
    setSuites((prev) =>
      prev.map((suite) => (suite.id === id ? { ...suite, price: newPrice } : suite)),
    );
    if (syncSiteDataWrites()) {
      void patchAdminSuite(id, { price: newPrice }).catch((e) => console.error('[site-data]', e));
    }
  };

  const updateSuiteImage = (id: string, imageUrl: string) => {
    const trimmed = imageUrl.trim();
    setSuites((prev) =>
      prev.map((suite) => (suite.id === id ? { ...suite, image: trimmed } : suite)),
    );
    if (syncSiteDataWrites()) {
      void patchAdminSuite(id, { image: trimmed }).catch((e) => console.error('[site-data]', e));
    }
  };

  const setHeroSlideshowOverride: DataContextType['setHeroSlideshowOverride'] = (urls) => {
    setSiteContent((prev) => ({
      ...prev,
      heroSlideshowOverride: urls,
    }));
    if (syncSiteDataWrites()) {
      void putAdminSiteContent({ heroSlideshowOverride: urls }).catch((e) =>
        console.error('[site-data]', e),
      );
    }
  };

  const addReview = (review: Review) => {
    setReviews((prev) => [review, ...prev]);
    if (syncSiteDataWrites()) {
      void postAdminReview(review).catch((e) => console.error('[site-data]', e));
    }
  };

  const deleteReview = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    if (syncSiteDataWrites()) {
      void deleteAdminReview(id).catch((e) => console.error('[site-data]', e));
    }
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
    const rounded = Math.round(n * 10) / 10;
    setBookingDisplayScoreState(rounded);
    if (syncSiteDataWrites()) {
      void putAdminBookingScore(rounded).catch((e) => console.error('[site-data]', e));
    }
  };

  const addSuitePriceRule: DataContextType['addSuitePriceRule'] = (r) => {
    const id =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const updatedAt = new Date().toISOString();
    setSuitePriceRules((prev) => [...prev, { ...r, id, updatedAt }]);
  };

  const deleteSuitePriceRule: DataContextType['deleteSuitePriceRule'] = (id) => {
    setSuitePriceRules((prev) => prev.filter((x) => x.id !== id));
  };

  const updateHeroContent: DataContextType['updateHeroContent'] = (locale, patch) => {
    setSiteContent((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        [locale]: {
          ...prev.hero[locale],
          ...patch,
        },
      },
    }));
    if (syncSiteDataWrites()) {
      void putAdminSiteContent({ hero: { [locale]: patch } }).catch((e) =>
        console.error('[site-data]', e),
      );
    }
  };

  const resetData = () => {
    setSuites(INITIAL_SUITES);
    setReviews(INITIAL_REVIEWS);
    setSiteContent(INITIAL_SITE_CONTENT);
    setSuitePriceRules([]);
    localStorage.removeItem('palacium_suites_data_v2');
    localStorage.removeItem('palacium_reviews_data_v1');
    localStorage.removeItem('palacium_site_content_v1');
    localStorage.removeItem(SUITE_PRICE_RULES_KEY);
  };

  return (
    <DataContext.Provider
      value={{
        suites,
        reviews,
        reservations,
        bookingDisplayScore,
        siteContent,
        updateSuitePrice,
        updateSuiteImage,
        addReview,
        deleteReview,
        addReservation,
        updateReservation,
        deleteReservation,
        setBookingDisplayScore,
        updateHeroContent,
        setHeroSlideshowOverride,
        suitePriceRules,
        addSuitePriceRule,
        deleteSuitePriceRule,
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
