
import React from 'react';
import { suiteImages } from './images';
import { Suite, Review, ReservationSource } from './types';
import { Waves, Coffee, Wifi, Flower2, ShieldCheck, Accessibility, Utensils, MapPin, Tv, Car, Languages } from 'lucide-react';

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

export const SUITES: Suite[] = [
  {
    id: '101',
    name: 'Suite 101 · Acessibilidade',
    image: suiteImages['101'],
    adults: 2,
    area: '24m²',
    description: 'Piso Inferior. Desenhada para acessibilidade universal com WC adaptado e amplos raios de manobra, sem comprometer a elegância 1905.',
    price: 80
  },
  {
    id: '102',
    name: 'Suite 102 · Régia',
    image: suiteImages['102'],
    adults: 2,
    area: '22m²',
    description: 'Piso Inferior. Conforto clássico com a robustez da pedra original e vistas para o pátio de entrada.',
    price: 80
  },
  {
    id: '103',
    name: 'Suite 103 · Régia',
    image: suiteImages['103'],
    adults: 2,
    area: '20m²',
    description: 'Piso Inferior. Um refúgio intimista que preserva a alma do edifício centenário com climatização de última geração.',
    price: 80
  },
  {
    id: '104',
    name: 'Suite 104 · Régia',
    image: suiteImages['104'],
    adults: 2,
    area: '18m²',
    description: 'Piso Inferior. Atmosfera acolhedora e design minimalista focado no descanso absoluto.',
    price: 80
  },
  {
    id: '201',
    name: 'Suite 201/202 · Familiar',
    image: suiteImages['201'],
    adults: 4,
    area: '40m²',
    description: 'Piso Superior. Espaço majestoso desenhado para comitivas ou famílias, oferecendo a máxima amplitude do palácio.',
    price: 180
  },
  {
    id: '203',
    name: 'Suite 203/204 · Familiar',
    image: suiteImages['203'],
    adults: 4,
    area: '40m²',
    description: 'Piso Superior. Suite imperial com 40m², onde a luz natural do segundo piso realça a herança arquitetónica.',
    price: 180
  },
  {
    id: '205',
    name: 'Suite 205 · Deluxe',
    image: suiteImages['205'],
    adults: 2,
    area: '24m²',
    description: 'Piso Superior. Vista privilegiada e design sofisticado com zona de estar integrada e acabamentos premium.',
    price: 100
  },
  {
    id: '206',
    name: 'Suite 206 · Deluxe',
    image: suiteImages['206'],
    adults: 2,
    area: '28m²',
    description: 'Piso Superior. O expoente da elegância Deluxe, oferecendo uma área de 28m² banhada por luz natural.',
    price: 100
  }
];

export const REVIEWS: Review[] = [
  {
    id: '1',
    author: 'Elizabeth',
    nationality: 'Estados Unidos',
    rating: 5,
    comment: 'Everything! Will definitely go back and recommend to family and friends.',
    date: 'Dezembro 2025'
  },
  {
    id: '2',
    author: 'Susan',
    nationality: 'Reino Unido',
    rating: 5,
    comment: 'Everything was superb. Unbelievable for the money. Extremely impressed',
    date: 'Dezembro 2025'
  },
  {
    id: '3',
    author: 'Eyal',
    nationality: 'Israel',
    rating: 5,
    comment: 'The staff was both very professional and very attentive. We had a great time and will surely be back',
    date: 'Novembro 2025'
  },
  {
    id: '4',
    author: 'Margarida',
    nationality: 'Portugal',
    rating: 5,
    comment: 'We had a wonderful stay! The host was truly fantastic – very welcoming and kind. The facilities were excellent, and the breakfast was delicious and very complete. The common areas are beautiful and cozy, making it a great place to relax. Perfect for spending a night in comfort. Highly recommended!',
    date: 'Outubro 2025'
  },
  {
    id: '5',
    author: 'Cátia',
    nationality: 'Portugal',
    rating: 5,
    comment: 'Passámos uma noite no Palacium e gostámos muito. Bastante calmo, silencioso. Sem dúvida a repetir.',
    date: 'Outubro 2025'
  },
  {
    id: '6',
    author: 'João',
    nationality: 'Portugal',
    rating: 5,
    comment: 'A simpatia de quem nos recebeu um ambiente tranquilo e para voltar com toda a certeza. Bom pequeno almoço com a simpatia de todos.',
    date: 'Setembro 2025'
  },
  {
    id: '7',
    author: 'Raquel',
    nationality: 'Portugal',
    rating: 5,
    comment: 'O Palacium Charming Suites é um alojamento recente mas com um grande potencial. Oferece todas as comodidades aos seus hóspedes e os funcionários foram sempre muito prestáveis connosco. Ótimo para quem procura uma escapadinha de fim de semana ou umas férias mais longas bem no Centro de Portugal!',
    date: 'Setembro 2025'
  },
  {
    id: '8',
    author: 'Agostinho',
    nationality: 'Portugal',
    rating: 5,
    comment: 'Tudo em geral, desde as instalações, pequeno almoço, mas sobretudo da simpatia e disponibilidade do staff.',
    date: 'Agosto 2025'
  },
  {
    id: '9',
    author: 'Carla',
    nationality: 'Portugal',
    rating: 5,
    comment: 'Adorei tudo, desde a decoração, limpeza, simpatia dos anfitriões, tudo! Pequeno almoço excelente!',
    date: 'Agosto 2025'
  },
  {
    id: '10',
    author: 'Paula',
    nationality: 'Portugal',
    rating: 5,
    comment: 'O espaço exterior bem cuidado, excelente piscina, quarto amplo bem arejado com casa banho grande. Excelente pequeno almoço. Vista deslumbrante sobre o Vale e serras. Staff 5 estrelas, afáveis e muito profissionais. Recomendo 200%.',
    date: 'Julho 2025'
  },
  {
    id: '11',
    author: 'Faustino',
    nationality: 'Portugal',
    rating: 5,
    comment: 'Quarto excelente muito moderno bem decorado. Funcionários tanto nas mensagens como no pequeno almoço muito bom.',
    date: 'Julho 2025'
  },
  {
    id: '12',
    author: 'Vitor',
    nationality: 'Portugal',
    rating: 5,
    comment: 'Adorámos a nossa estadia. O quarto era muito confortável e o pequeno almoço excelente. Foram dias muito agradáveis que aproveitámos para conhecer a região. No final do dia aproveitámos a piscina para relaxar. Os funcionários foram muito simpáticos e sempre prestáveis.',
    date: 'Junho 2025'
  },
  {
    id: '13',
    author: 'Diogo',
    nationality: 'Portugal',
    rating: 5,
    comment: 'Óptimo pequeno almoço, quarto confortável e o staff muito simpático.',
    date: 'Maio 2025'
  },
  {
    id: '14',
    author: 'Sandra',
    nationality: 'Portugal',
    rating: 5,
    comment: 'Hotel fantástico! Atendimento impecável, quarto limpo e confortável, pequeno-almoço variado e delicioso. Localização excelente, perto do centro. Superou as expectativas — recomendo totalmente!',
    date: 'Abril 2025'
  }
];

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
