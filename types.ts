
import React from 'react';

export type ViewType = 'home' | 'history' | 'suites' | 'experiences' | 'about' | 'gallery' | 'admin';

export interface InitialBookingData {
  checkIn?: string;
  checkOut?: string;
  guests?: string;
}

export interface Suite {
  id: string;
  name: string;
  image: string;
  adults: number;
  area: string;
  description: string;
  price: number;
}

export interface Review {
  id: string;
  author: string;
  nationality?: string;
  rating: number;
  comment: string;
  date: string;
}

export interface FeatureIcon {
  label: string;
  icon: React.ReactNode;
}
