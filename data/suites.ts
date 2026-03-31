import { suiteImages } from '../images';
import type { Suite } from '../types';

/** Default suite catalog (overridable via MySQL when site data API is enabled). */
export const SUITES: Suite[] = [
  {
    id: '101',
    name: 'Suite 101 · Acessibilidade',
    image: suiteImages['101'],
    adults: 2,
    area: '24m²',
    description:
      'Piso Inferior. Desenhada para acessibilidade universal com WC adaptado e amplos raios de manobra, sem comprometer a elegância 1905.',
    price: 80,
  },
  {
    id: '102',
    name: 'Suite 102 · Régia',
    image: suiteImages['102'],
    adults: 2,
    area: '22m²',
    description:
      'Piso Inferior. Conforto clássico com a robustez da pedra original e vistas para o pátio de entrada.',
    price: 80,
  },
  {
    id: '103',
    name: 'Suite 103 · Régia',
    image: suiteImages['103'],
    adults: 2,
    area: '20m²',
    description:
      'Piso Inferior. Um refúgio intimista que preserva a alma do edifício centenário com climatização de última geração.',
    price: 80,
  },
  {
    id: '104',
    name: 'Suite 104 · Régia',
    image: suiteImages['104'],
    adults: 2,
    area: '18m²',
    description: 'Piso Inferior. Atmosfera acolhedora e design minimalista focado no descanso absoluto.',
    price: 80,
  },
  {
    id: '201',
    name: 'Suite 201/202 · Familiar',
    image: suiteImages['201'],
    adults: 4,
    area: '40m²',
    description:
      'Piso Superior. Espaço majestoso desenhado para comitivas ou famílias, oferecendo a máxima amplitude do palácio.',
    price: 180,
  },
  {
    id: '203',
    name: 'Suite 203/204 · Familiar',
    image: suiteImages['203'],
    adults: 4,
    area: '40m²',
    description:
      'Piso Superior. Suite imperial com 40m², onde a luz natural do segundo piso realça a herança arquitetónica.',
    price: 180,
  },
  {
    id: '205',
    name: 'Suite 205 · Deluxe',
    image: suiteImages['205'],
    adults: 2,
    area: '24m²',
    description:
      'Piso Superior. Vista privilegiada e design sofisticado com zona de estar integrada e acabamentos premium.',
    price: 100,
  },
  {
    id: '206',
    name: 'Suite 206 · Deluxe',
    image: suiteImages['206'],
    adults: 2,
    area: '28m²',
    description:
      'Piso Superior. O expoente da elegância Deluxe, oferecendo uma área de 28m² banhada por luz natural.',
    price: 100,
  },
];
