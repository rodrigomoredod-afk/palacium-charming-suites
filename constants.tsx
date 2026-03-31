
import React from 'react';
import { ReservationSource } from './types';
import { Waves, Coffee, Wifi, Flower2, ShieldCheck, Accessibility, Utensils, MapPin, Tv, Car, Languages } from 'lucide-react';

export { SUITES } from './data/suites';
export { REVIEWS } from './data/reviews';
export { INITIAL_SITE_CONTENT } from './data/siteContent';

const Wind = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4a2 2 0 1 0-1.4-3.4H2"/></svg>;

export const GUEST_SCORE = 9.6;

export const RESERVATION_SOURCE_LABELS: Record<ReservationSource, string> = {
  website: 'Site (direto)',
  phone: 'Telefone',
  email: 'E-mail',
  booking_com: 'Booking.com',
  walk_in: 'Presencial',
  other: 'Outro',
};

export const AMENITIES_GROUPS = [
  {
    title: "No Quarto",
    icon: <ShieldCheck className="w-5 h-5 text-gold" />,
    items: [
      "Climatização individualizada",
      "Isolamento acústico de excelência",
      "Camas extralongas (>2 metros)",
      "Tomada perto da cama e USB",
      "Secretária de trabalho e Roupeiro",
      "Produtos de higiene pessoal gratuitos"
    ]
  },
  {
    title: "Bem-estar & Lazer",
    icon: <Waves className="w-5 h-5 text-gold" />,
    items: [
      "Piscina exterior aquecida (todo o ano)",
      "Bar de piscina e espreguiçadeiras",
      "Jardim e terraço para banhos de sol",
      "Área para piquenique e mobiliário exterior",
      "Salão partilhado com área de TV",
      "Jogos de tabuleiro e puzzles"
    ]
  },
  {
    title: "Pequeno-Almoço Real",
    icon: <Utensils className="w-5 h-5 text-gold" />,
    items: [
      "Buffet mediterrânico (08h30 - 10h00)",
      "Opções Veg, Vegan e Sem Glúten",
      "Pães, pastelaria e frutas frescas",
      "Refeições quentes e cozinhadas",
      "Café, chocolate quente e sumos naturais",
      "Buffet adequado para crianças"
    ]
  },
  {
    title: "Tecnologia & Serviços",
    icon: <Wifi className="w-5 h-5 text-gold" />,
    items: [
      "Wi-Fi de alta velocidade gratuito",
      "TV de ecrã plano por satélite",
      "Estacionamento privado gratuito (EV charge)",
      "Check-in/Check-out privado",
      "Multibanco no local e Sala de bagagem",
      "Limpeza diária e lavandaria (extra)"
    ]
  }
];

export const NEARBY_LOCATIONS = {
  restaurants: [
    { name: "Paris", dist: "400m", time: "1 min car" },
    { name: "Pastelaria Renatos", dist: "600m", time: "1 min car" },
    { name: "Restaurante Tricana", dist: "850m", time: "1 min car" }
  ],
  cafes: [
    { name: "Bar do Jardim", dist: "650m", time: "8 min pé" },
    { name: "Café Avenida", dist: "13km", time: "10 min car" },
    { name: "Vintage Bar", dist: "14km", time: "11 min car" }
  ]
};

export const FEATURES = [
  { 
    label: 'Climatização Individual', 
    icon: <Wind className="w-8 h-8 stroke-1" />,
    description: 'Controlo de temperatura para o seu máximo conforto em qualquer estação.'
  },
  { 
    label: 'Momento de Pausa', 
    icon: <Coffee className="w-8 h-8 stroke-1" />,
    description: 'Chaleira elétrica em todos os quartos com seleção premium de chás e café.'
  },
  { 
    label: 'Conetividade Total', 
    icon: <Wifi className="w-8 h-8 stroke-1" />,
    description: 'Wi-Fi de alta velocidade gratuito em todo o edifício histórico.'
  },
  { 
    label: 'Jardim do Éden', 
    icon: <Flower2 className="w-8 h-8 stroke-1" />,
    description: 'Espaços exteriores e terraços desenhados para a serenidade absoluta.'
  }
];

