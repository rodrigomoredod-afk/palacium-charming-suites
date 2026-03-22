
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

/** Where the reservation was created or recorded */
export type ReservationSource =
  | 'website'
  | 'phone'
  | 'email'
  | 'booking_com'
  | 'walk_in'
  | 'other';

export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Reservation {
  id: string;
  source: ReservationSource;
  status: ReservationStatus;
  checkIn: string;
  checkOut: string;
  guestName: string;
  email?: string;
  phone?: string;
  adults: number;
  childrenCount: number;
  suiteIds: string[];
  suiteNames: string[];
  nights: number;
  totalPrice?: number;
  nif?: string;
  notes?: string;
  /** e.g. Booking.com confirmation number when entered manually */
  externalRef?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface FeatureIcon {
  label: string;
  icon: React.ReactNode;
}
