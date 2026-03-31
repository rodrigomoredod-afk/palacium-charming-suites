
import type { ReactNode } from 'react';

export type ViewType = 'home' | 'history' | 'suites' | 'experiences' | 'about' | 'gallery' | 'admin';

export interface InitialBookingData {
  checkIn?: string;
  checkOut?: string;
  guests?: string;
}

export type Locale = 'pt' | 'en';

export interface Suite {
  id: string;
  name: string;
  image: string;
  adults: number;
  area: string;
  description: string;
  price: number;
}

/** Inclusive date range overriding `Suite.price` for those nights (latest `updatedAt` wins if ranges overlap). */
export interface SuitePriceRule {
  id: string;
  suiteId: string;
  startDate: string;
  endDate: string;
  nightlyPrice: number;
  note?: string;
  updatedAt: string;
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

export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

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

export interface HeroContent {
  badge: string;
  title: string;
  subtitle: string;
  galleryCta: string;
  discoverLabel: string;
}

export interface SiteContent {
  hero: Record<Locale, HeroContent>;
  /** When non-null and non-empty after trim, replaces the home hero slideshow from `images.ts` */
  heroSlideshowOverride: string[] | null;
}

export interface FeatureIcon {
  label: string;
  icon: ReactNode;
}

export interface SuiteDetailSpec {
  label: string;
  value: string;
}

export interface SuiteDetailContent {
  idealFor: string;
  included: string[];
  specs: SuiteDetailSpec[];
  policies: string[];
}

export interface SuiteDetailEntry {
  suiteId: string;
  pt: SuiteDetailContent;
  en: SuiteDetailContent;
  gallery: string[];
}
