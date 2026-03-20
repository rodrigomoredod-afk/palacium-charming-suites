
import React, { createContext, useContext, useState, useEffect } from 'react';
import { SUITES as INITIAL_SUITES, REVIEWS as INITIAL_REVIEWS } from '../constants';
import { Suite, Review } from '../types';

interface DataContextType {
  suites: Suite[];
  reviews: Review[];
  updateSuitePrice: (id: string, newPrice: number) => void;
  addReview: (review: Review) => void;
  deleteReview: (id: string) => void;
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

  useEffect(() => {
    localStorage.setItem('palacium_suites_data_v2', JSON.stringify(suites));
  }, [suites]);

  useEffect(() => {
    localStorage.setItem('palacium_reviews_data_v1', JSON.stringify(reviews));
  }, [reviews]);

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

  const resetData = () => {
    setSuites(INITIAL_SUITES);
    setReviews(INITIAL_REVIEWS);
    localStorage.removeItem('palacium_suites_data_v2');
    localStorage.removeItem('palacium_reviews_data_v1');
  };

  return (
    <DataContext.Provider value={{ suites, reviews, updateSuitePrice, addReview, deleteReview, resetData }}>
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
