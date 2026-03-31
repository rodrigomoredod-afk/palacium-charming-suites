/**
 * All site images in one place.
 * Swap URLs here, or use paths like `/photos/hero-1.jpg` after adding files to `public/`.
 */

/** Palacium logo (SVG, transparent). File must be shared: “Anyone with the link can view”. */
export const logoImageUrl: string | null =
  '/logo.svg';

/** Hero background slideshow (home) */
export const heroSlideshow = [
  'https://palacium.pt/Imgs/L2o20PBZHHX399n4O197jE3IcEgL3jaY/AboutUs/QWD1bPRF7uZoEiF2dZvFrPCRg8oTtkRj.jpg',
  'https://palacium.pt/Imgs/L2o20PBZHHX399n4O197jE3IcEgL3jaY/AboutUs/RdlrSSDYtPfNFSYrOBHyYzHKFDetuUIh.jpg',
  'https://palacium.pt/Imgs/L2o20PBZHHX399n4O197jE3IcEgL3jaY/AboutUs/UowZvIPpaIiPg8gpCerBV3wKeAIINa5s.jpg',
];

/** Suite card / booking imagery — keys match `Suite.id` in constants */
export const suiteImages: Record<string, string> = {
  '101':
    'https://cf.bstatic.com/xdata/images/hotel/max1024x768/744008012.jpg?k=7b61432422c01ac3a0281eea8952ec221923582b5f9f27229c76414bc89ded50&o=',
  '102':
    'https://cf.bstatic.com/xdata/images/hotel/max1024x768/743983053.jpg?k=161ed5909f3f4155ac9f3dcf832e2495cf1cabe71ec1fa3597213c2f17551093&o=',
  '103':
    'https://cf.bstatic.com/xdata/images/hotel/max1024x768/743983064.jpg?k=29cf422a5f17157f091def41cbb27ce3e8f98a0fa8f7344aad3d3dcf2347df77&o=',
  '104':
    'https://cf.bstatic.com/xdata/images/hotel/max1024x768/744509758.jpg?k=fbf448525c4746bfa6b7f4e78c3e5cf8005aa29659e5efd6a47326f9a296ac17&o=',
  '201':
    'https://cf.bstatic.com/xdata/images/hotel/max1024x768/736443472.jpg?k=06d4ab286cc03bfa4284acc559895cf8de933763e7f22f682f9e494a91ef22ad&o=',
  '203':
    'https://cf.bstatic.com/xdata/images/hotel/max1024x768/745177467.jpg?k=7c3ae7e830a7a22cd84070bb7d27fb4c79fd53f192ad52e94134c86d0e0dac05&o=',
  '205':
    'https://cf.bstatic.com/xdata/images/hotel/max1024x768/743983059.jpg?k=858151c95ee7c29434d9bb7edc8e232c64093c97ac1bf610698dbce9f5ca16e3&o=',
  '206':
    'https://cf.bstatic.com/xdata/images/hotel/max1024x768/743983049.jpg?k=e4e2ac0e326008d0de124a2e446e153ebf10173abf361ce5217e26d71b688d8f&o=',
};

export type GalleryImage = { src: string; alt: string };

/** Full gallery page */
export const galleryImages: GalleryImage[] = [
  {
    src: 'https://palacium.pt/Imgs/L2o20PBZHHX399n4O197jE3IcEgL3jaY/AboutUs/RUDn7frltezngjknJFk8oafCqxNJmaaG.jpg',
    alt: 'Árvore de comentários dos hóspedes na receção',
  },
  {
    src: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/744509767.jpg?k=a633bc3c998f3cbadf643cf5beddc3c18494bea371af45301d915c9525cf1a3a&o=',
    alt: 'Casa de banho espaçosa da Suite Familiar',
  },
  {
    src: 'https://palacium.pt/Imgs/L2o20PBZHHX399n4O197jE3IcEgL3jaY/AboutUs/vHQIg6sBl0n0xKagz59hqz5JGLQd6cmC.jpg',
    alt: 'Lateral do edifício e piscina coberta',
  },
  {
    src: 'https://palacium.pt/Imgs/L2o20PBZHHX399n4O197jE3IcEgL3jaY/AboutUs/TPmBHEfVzvUvIh8grCr4o0XFXYFRI24o.jpg',
    alt: 'Acesso exterior às áreas comuns',
  },
  {
    src: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/745177471.jpg?k=c24dff0e6f8a5161a7d5f2c8dc1794f4a5e2f2958356bc1dade0b749143bacf3&o=',
    alt: 'Interiores luminosos das Suites',
  },
  {
    src: 'https://palacium.pt/Imgs/L2o20PBZHHX399n4O197jE3IcEgL3jaY/AboutUs/Q2Zd6YdLShYaXMeDZDwfMKl90qsYkNl6.jpg',
    alt: 'Placa em alumínio com o logótipo Palacium',
  },
  {
    src: 'https://palacium.pt/Imgs/L2o20PBZHHX399n4O197jE3IcEgL3jaY/AboutUs/OFvAUGIyeS9gNq3a1l9QRC7iSphQz1ZZ.jpg',
    alt: 'Estacionamento com carregador para veículos elétricos',
  },
  {
    src: 'https://palacium.pt/Imgs/L2o20PBZHHX399n4O197jE3IcEgL3jaY/AboutUs/xuPEoilWulnJ48ZjV23kGAC09UEbDn7Z.jpg',
    alt: 'Cozinha de apoio na área comum',
  },
  {
    src: 'https://palacium.pt/Imgs/L2o20PBZHHX399n4O197jE3IcEgL3jaY/AboutUs/fRqFOINaSiIXOmnjgyuoKDHGHB1s1Npp.jpg',
    alt: 'Bar de apoio perto da piscina',
  },
  {
    src: 'https://palacium.pt/Imgs/L2o20PBZHHX399n4O197jE3IcEgL3jaY/AboutUs/oRrKQVbo12p7CE5IfE8cil3ZgH8qzJJx.jpg',
    alt: 'Sala de estar e convívio comum',
  },
  {
    src: 'https://palacium.pt/Imgs/L2o20PBZHHX399n4O197jE3IcEgL3jaY/AboutUs/Gm07t0KClUs9cwKsFuIbcJJMcpImNRib.jpg',
    alt: 'Corredor das suites do primeiro andar',
  },
  {
    src: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/734586937.jpg?k=2c223cdecb570f33772fde1e5d981377f980aa294e079653d5f1ad0705bb5e90&o=',
    alt: 'Conforto e design nos quartos',
  },
  {
    src: 'https://palacium.pt/Imgs/L2o20PBZHHX399n4O197jE3IcEgL3jaY/AboutUs/PFdeDYljiydNBNSfsMoicUfYlOSbb0eO.jpg',
    alt: 'Perspetiva lateral da piscina aquecida',
  },
  {
    src: 'https://palacium.pt/Imgs/L2o20PBZHHX399n4O197jE3IcEgL3jaY/AboutUs/coZSh9JBdk9eUhhIFse3GCnvtZHCLktq.jpg',
    alt: 'Escadaria de acesso à receção',
  },
  {
    src: 'https://palacium.pt/Imgs/L2o20PBZHHX399n4O197jE3IcEgL3jaY/AboutUs/MewUPOsd8pccbf69vyVdY96qr4qgAOiu.jpg',
    alt: 'Detalhes da decoração clássica',
  },
];

/** Experiences / partners page */
export const experiencesImages = {
  sectionHero:
    'https://images.unsplash.com/photo-1505672678657-cc7037095e60?q=80&w=2400&auto=format&fit=crop',
  arte: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?q=80&w=1200&auto=format&fit=crop',
  aldeias: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop',
  gastronomia: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
};

/** Amenities — dietary / buffet highlight */
export const amenitiesImages = {
  dietaryHighlight:
    'https://palacium.pt/Imgs/L2o20PBZHHX399n4O197jE3IcEgL3jaY/AboutUs/UCjbfaA6a4d9CigrrfnXgqWKATpl3sb7.jpg',
};

/** Introduction (heritage) section on home */
export const introductionImages = {
  heritage:
    'https://palacium.pt/Imgs/L2o20PBZHHX399n4O197jE3IcEgL3jaY/AboutUs/raGqhRvMEjXqEQU4dVl94nrY92cf7lha.jpg',
};

/** About Us page */
export const aboutUsImages = {
  editorial: 'https://images.unsplash.com/photo-1544161515-4ad6ce6f8a4a?q=80&w=1200&auto=format&fit=crop',
};

/** History page */
export const historyImages = {
  hero: 'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?q=80&w=2000&auto=format&fit=crop',
  stone: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1000&auto=format&fit=crop',
  garden: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=1000&auto=format&fit=crop',
};
