import { suiteImages } from './images';
import { SuiteDetailEntry } from './types';

// Phase A scaffold: centralized PT/EN suite-details content for all suites.
// Gallery arrays can be expanded with dedicated room photos later.
export const SUITE_DETAILS: Record<string, SuiteDetailEntry> = {
  '101': {
    suiteId: '101',
    pt: {
      idealFor: 'Ideal para hóspedes com mobilidade condicionada e para estadias com foco em conforto funcional.',
      included: ['Pequeno-almoço incluído', 'Wi-Fi gratuito', 'Climatização individual', 'Limpeza diária', 'Acesso facilitado'],
      specs: [
        { label: 'Área', value: '24m²' },
        { label: 'Capacidade base', value: '2 adultos' },
        { label: 'Piso', value: 'Piso inferior' },
        { label: 'Casa de banho', value: 'Adaptada para acessibilidade' },
        { label: 'Tipo de cama', value: 'Cama super king-size' },
        { label: 'Acessibilidade', value: 'Raios de manobra amplos' },
      ],
      policies: ['Check-in: 15:00-22:00', 'Check-out: até 11:00', 'Cancelamento flexível conforme tarifa', 'Confirmação por e-mail e pagamento no alojamento'],
    },
    en: {
      idealFor: 'Ideal for guests with reduced mobility and stays focused on practical comfort.',
      included: ['Breakfast included', 'Free Wi-Fi', 'Individual climate control', 'Daily housekeeping', 'Step-friendly access'],
      specs: [
        { label: 'Area', value: '24m²' },
        { label: 'Base occupancy', value: '2 adults' },
        { label: 'Floor', value: 'Ground floor' },
        { label: 'Bathroom', value: 'Accessibility-adapted layout' },
        { label: 'Bed type', value: 'Super king-size bed' },
        { label: 'Accessibility', value: 'Generous circulation radius' },
      ],
      policies: ['Check-in: 3:00 PM-10:00 PM', 'Check-out: until 11:00 AM', 'Flexible cancellation by selected rate', 'Email confirmation and pay-at-property flow'],
    },
    gallery: [suiteImages['101']],
  },
  '102': {
    suiteId: '102',
    pt: {
      idealFor: 'Ideal para casais que valorizam ambiente clássico e proximidade ao pátio histórico.',
      included: ['Pequeno-almoço incluído', 'Wi-Fi gratuito', 'Climatização individual', 'Amenidades de banho', 'Serviço de arrumação'],
      specs: [
        { label: 'Área', value: '22m²' },
        { label: 'Capacidade base', value: '2 adultos' },
        { label: 'Piso', value: 'Piso inferior' },
        { label: 'Casa de banho', value: 'Privativa, com duche' },
        { label: 'Tipo de cama', value: 'Cama super king-size' },
        { label: 'Vista', value: 'Pátio de entrada' },
      ],
      policies: ['Check-in: 15:00-22:00', 'Check-out: até 11:00', 'Cancelamento flexível conforme tarifa', 'Confirmação por e-mail e pagamento no alojamento'],
    },
    en: {
      idealFor: 'Ideal for couples seeking classic atmosphere and direct connection to the historic courtyard.',
      included: ['Breakfast included', 'Free Wi-Fi', 'Individual climate control', 'Bathroom amenities', 'Housekeeping service'],
      specs: [
        { label: 'Area', value: '22m²' },
        { label: 'Base occupancy', value: '2 adults' },
        { label: 'Floor', value: 'Ground floor' },
        { label: 'Bathroom', value: 'Private, with shower' },
        { label: 'Bed type', value: 'Super king-size bed' },
        { label: 'View', value: 'Entrance courtyard' },
      ],
      policies: ['Check-in: 3:00 PM-10:00 PM', 'Check-out: until 11:00 AM', 'Flexible cancellation by selected rate', 'Email confirmation and pay-at-property flow'],
    },
    gallery: [suiteImages['102']],
  },
  '103': {
    suiteId: '103',
    pt: {
      idealFor: 'Ideal para escapadinhas tranquilas com foco em silêncio e privacidade.',
      included: ['Pequeno-almoço incluído', 'Wi-Fi gratuito', 'Climatização individual', 'TV de ecrã plano', 'Limpeza diária'],
      specs: [
        { label: 'Área', value: '20m²' },
        { label: 'Capacidade base', value: '2 adultos' },
        { label: 'Piso', value: 'Piso inferior' },
        { label: 'Casa de banho', value: 'Privativa, com duche' },
        { label: 'Tipo de cama', value: 'Cama super king-size' },
        { label: 'Ambiente', value: 'Refúgio intimista' },
      ],
      policies: ['Check-in: 15:00-22:00', 'Check-out: até 11:00', 'Cancelamento flexível conforme tarifa', 'Confirmação por e-mail e pagamento no alojamento'],
    },
    en: {
      idealFor: 'Ideal for quiet getaways with emphasis on privacy and rest.',
      included: ['Breakfast included', 'Free Wi-Fi', 'Individual climate control', 'Flat-screen TV', 'Daily housekeeping'],
      specs: [
        { label: 'Area', value: '20m²' },
        { label: 'Base occupancy', value: '2 adults' },
        { label: 'Floor', value: 'Ground floor' },
        { label: 'Bathroom', value: 'Private, with shower' },
        { label: 'Bed type', value: 'Super king-size bed' },
        { label: 'Atmosphere', value: 'Intimate retreat' },
      ],
      policies: ['Check-in: 3:00 PM-10:00 PM', 'Check-out: until 11:00 AM', 'Flexible cancellation by selected rate', 'Email confirmation and pay-at-property flow'],
    },
    gallery: [suiteImages['103']],
  },
  '104': {
    suiteId: '104',
    pt: {
      idealFor: 'Ideal para estadias curtas com conforto essencial e ambiente acolhedor.',
      included: ['Pequeno-almoço incluído', 'Wi-Fi gratuito', 'Climatização individual', 'Amenidades de banho', 'Limpeza diária'],
      specs: [
        { label: 'Área', value: '18m²' },
        { label: 'Capacidade base', value: '2 adultos' },
        { label: 'Piso', value: 'Piso inferior' },
        { label: 'Casa de banho', value: 'Privativa, com duche' },
        { label: 'Tipo de cama', value: 'Cama super king-size' },
        { label: 'Estilo', value: 'Minimalista e acolhedor' },
      ],
      policies: ['Check-in: 15:00-22:00', 'Check-out: até 11:00', 'Cancelamento flexível conforme tarifa', 'Confirmação por e-mail e pagamento no alojamento'],
    },
    en: {
      idealFor: 'Ideal for short stays with essential comfort and a cozy mood.',
      included: ['Breakfast included', 'Free Wi-Fi', 'Individual climate control', 'Bathroom amenities', 'Daily housekeeping'],
      specs: [
        { label: 'Area', value: '18m²' },
        { label: 'Base occupancy', value: '2 adults' },
        { label: 'Floor', value: 'Ground floor' },
        { label: 'Bathroom', value: 'Private, with shower' },
        { label: 'Bed type', value: 'Super king-size bed' },
        { label: 'Style', value: 'Minimalist and cozy' },
      ],
      policies: ['Check-in: 3:00 PM-10:00 PM', 'Check-out: until 11:00 AM', 'Flexible cancellation by selected rate', 'Email confirmation and pay-at-property flow'],
    },
    gallery: [suiteImages['104']],
  },
  '201': {
    suiteId: '201',
    pt: {
      idealFor: 'Ideal para famílias e comitivas que procuram espaço amplo e conforto partilhado.',
      included: ['Pequeno-almoço incluído', 'Wi-Fi gratuito', 'Climatização individual', 'Zona de estar', 'Configuração familiar'],
      specs: [
        { label: 'Área', value: '40m²' },
        { label: 'Capacidade base', value: '4 adultos' },
        { label: 'Piso', value: 'Piso superior' },
        { label: 'Casa de banho', value: 'Privativa, com duche' },
        { label: 'Tipo de cama', value: 'Configuração dupla + extra' },
        { label: 'Perfil', value: 'Suite familiar' },
      ],
      policies: ['Check-in: 15:00-22:00', 'Check-out: até 11:00', 'Berços/camas extra sujeitos a disponibilidade', 'Confirmação por e-mail e pagamento no alojamento'],
    },
    en: {
      idealFor: 'Ideal for families and small groups needing generous shared space.',
      included: ['Breakfast included', 'Free Wi-Fi', 'Individual climate control', 'Lounge area', 'Family-ready setup'],
      specs: [
        { label: 'Area', value: '40m²' },
        { label: 'Base occupancy', value: '4 adults' },
        { label: 'Floor', value: 'Upper floor' },
        { label: 'Bathroom', value: 'Private, with shower' },
        { label: 'Bed type', value: 'Dual setup + extra option' },
        { label: 'Profile', value: 'Family suite' },
      ],
      policies: ['Check-in: 3:00 PM-10:00 PM', 'Check-out: until 11:00 AM', 'Cribs/extra beds subject to availability', 'Email confirmation and pay-at-property flow'],
    },
    gallery: [suiteImages['201']],
  },
  '203': {
    suiteId: '203',
    pt: {
      idealFor: 'Ideal para famílias que querem amplitude, luz natural e caráter arquitetónico.',
      included: ['Pequeno-almoço incluído', 'Wi-Fi gratuito', 'Climatização individual', 'Zona de estar', 'Limpeza diária'],
      specs: [
        { label: 'Área', value: '40m²' },
        { label: 'Capacidade base', value: '4 adultos' },
        { label: 'Piso', value: 'Piso superior' },
        { label: 'Casa de banho', value: 'Privativa, com duche' },
        { label: 'Tipo de cama', value: 'Configuração dupla + extra' },
        { label: 'Destaque', value: 'Luz natural abundante' },
      ],
      policies: ['Check-in: 15:00-22:00', 'Check-out: até 11:00', 'Berços/camas extra sujeitos a disponibilidade', 'Confirmação por e-mail e pagamento no alojamento'],
    },
    en: {
      idealFor: 'Ideal for families seeking spacious layout, natural light, and architectural character.',
      included: ['Breakfast included', 'Free Wi-Fi', 'Individual climate control', 'Lounge area', 'Daily housekeeping'],
      specs: [
        { label: 'Area', value: '40m²' },
        { label: 'Base occupancy', value: '4 adults' },
        { label: 'Floor', value: 'Upper floor' },
        { label: 'Bathroom', value: 'Private, with shower' },
        { label: 'Bed type', value: 'Dual setup + extra option' },
        { label: 'Highlight', value: 'Abundant natural light' },
      ],
      policies: ['Check-in: 3:00 PM-10:00 PM', 'Check-out: until 11:00 AM', 'Cribs/extra beds subject to availability', 'Email confirmation and pay-at-property flow'],
    },
    gallery: [suiteImages['203']],
  },
  '205': {
    suiteId: '205',
    pt: {
      idealFor: 'Ideal para casais que procuram um ambiente deluxe com vista privilegiada.',
      included: ['Pequeno-almoço incluído', 'Wi-Fi gratuito', 'Climatização individual', 'Zona de estar integrada', 'Amenidades premium'],
      specs: [
        { label: 'Área', value: '24m²' },
        { label: 'Capacidade base', value: '2 adultos' },
        { label: 'Piso', value: 'Piso superior' },
        { label: 'Casa de banho', value: 'Privativa, com duche' },
        { label: 'Tipo de cama', value: 'Cama super king-size' },
        { label: 'Vista', value: 'Perspetiva elevada da vila' },
      ],
      policies: ['Check-in: 15:00-22:00', 'Check-out: até 11:00', 'Cancelamento flexível conforme tarifa', 'Confirmação por e-mail e pagamento no alojamento'],
    },
    en: {
      idealFor: 'Ideal for couples looking for a deluxe feel with elevated views.',
      included: ['Breakfast included', 'Free Wi-Fi', 'Individual climate control', 'Integrated lounge area', 'Premium amenities'],
      specs: [
        { label: 'Area', value: '24m²' },
        { label: 'Base occupancy', value: '2 adults' },
        { label: 'Floor', value: 'Upper floor' },
        { label: 'Bathroom', value: 'Private, with shower' },
        { label: 'Bed type', value: 'Super king-size bed' },
        { label: 'View', value: 'Elevated town perspective' },
      ],
      policies: ['Check-in: 3:00 PM-10:00 PM', 'Check-out: until 11:00 AM', 'Flexible cancellation by selected rate', 'Email confirmation and pay-at-property flow'],
    },
    gallery: [suiteImages['205']],
  },
  '206': {
    suiteId: '206',
    pt: {
      idealFor: 'Ideal para quem valoriza amplitude extra, luz natural e uma estadia deluxe.',
      included: ['Pequeno-almoço incluído', 'Wi-Fi gratuito', 'Climatização individual', 'Amenidades premium', 'Limpeza diária'],
      specs: [
        { label: 'Área', value: '28m²' },
        { label: 'Capacidade base', value: '2 adultos' },
        { label: 'Piso', value: 'Piso superior' },
        { label: 'Casa de banho', value: 'Privativa, com duche' },
        { label: 'Tipo de cama', value: 'Cama super king-size' },
        { label: 'Destaque', value: 'Maior área da categoria Deluxe' },
      ],
      policies: ['Check-in: 15:00-22:00', 'Check-out: até 11:00', 'Cancelamento flexível conforme tarifa', 'Confirmação por e-mail e pagamento no alojamento'],
    },
    en: {
      idealFor: 'Ideal for guests who value extra space, natural light, and a deluxe stay profile.',
      included: ['Breakfast included', 'Free Wi-Fi', 'Individual climate control', 'Premium amenities', 'Daily housekeeping'],
      specs: [
        { label: 'Area', value: '28m²' },
        { label: 'Base occupancy', value: '2 adults' },
        { label: 'Floor', value: 'Upper floor' },
        { label: 'Bathroom', value: 'Private, with shower' },
        { label: 'Bed type', value: 'Super king-size bed' },
        { label: 'Highlight', value: 'Largest area in Deluxe category' },
      ],
      policies: ['Check-in: 3:00 PM-10:00 PM', 'Check-out: until 11:00 AM', 'Flexible cancellation by selected rate', 'Email confirmation and pay-at-property flow'],
    },
    gallery: [suiteImages['206']],
  },
};

export const getSuiteDetails = (suiteId: string) => SUITE_DETAILS[suiteId];
