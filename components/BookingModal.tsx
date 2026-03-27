
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { X, Check, Calendar as CalendarIcon, Users as UsersIcon, ArrowLeft, Baby, Plus, Minus, AlertCircle, Sparkles, Bed, Info, Award, Crown, ChevronDown, CreditCard, Smartphone, Building, Wallet, Lock, ReceiptText, Mail } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { submitReservationRemote } from '../lib/submitReservationRemote';
import { Suite, InitialBookingData } from '../types';
import { computeNights, getTodayIsoLocal, getTomorrowIsoFrom } from '../lib/reservationUtils';
import { trackEvent } from '../lib/analytics';
import { useLocale } from '../contexts/LocaleContext';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: InitialBookingData;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, initialData }) => {
  const { suites, addReservation } = useData();
  const { locale } = useLocale();
  const isPt = locale === 'pt';
  const [step, setStep] = useState(1);
  const [selectedRoomIds, setSelectedRoomIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [errorKey, setErrorKey] = useState(0); 
  
  const checkInInputRef = useRef<HTMLInputElement>(null);
  const checkOutInputRef = useRef<HTMLInputElement>(null);
  const scrollAnchorRef = useRef<HTMLDivElement>(null);

  // Booking Data
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adultCount, setAdultCount] = useState(2);
  const [childrenAges, setChildrenAges] = useState<number[]>([]);
  const [activeChildDropdown, setActiveChildDropdown] = useState<number | null>(null);

  // Payment & Billing Data (Simplified)
  const [billingDetails, setBillingDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nif: '' // Tax ID
  });

  // Use local time for 'today' to avoid timezone issues
  const todayStr = useMemo(() => {
    return getTodayIsoLocal();
  }, []);

  // Calculate 'tomorrow' for default checkout
  const tomorrowStr = useMemo(() => {
    return getTomorrowIsoFrom(todayStr);
  }, [todayStr]);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setCheckIn(initialData?.checkIn || todayStr);

      if (initialData?.checkOut) {
        setCheckOut(initialData.checkOut);
      } else if (initialData?.checkIn) {
        const d = new Date(initialData.checkIn);
        d.setDate(d.getDate() + 1);
        setCheckOut(d.toISOString().split('T')[0]);
      } else {
        setCheckOut(tomorrowStr);
      }

      if (initialData?.guests) {
        const num = parseInt(initialData.guests);
        if (!isNaN(num)) setAdultCount(num);
      } else {
        setAdultCount(2);
      }
      
      if (!initialData?.checkIn) {
        setChildrenAges([]);
        setSelectedRoomIds([]);
        setBillingDetails({ firstName: '', lastName: '', email: '', phone: '', nif: '' });
      }
      
      document.body.style.overflow = 'hidden';
      setError(null);
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, initialData, todayStr, tomorrowStr]);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    return computeNights(checkIn, checkOut);
  }, [checkIn, checkOut]);

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return isPt ? 'Selecionar' : 'Select';
    try {
      const parts = dateStr.split('-');
      if (parts.length !== 3) return dateStr;
      const [y, m, d] = parts;
      return `${d}/${m}/${y}`;
    } catch {
      return dateStr;
    }
  };

  const getChildPolicy = (age: number) => {
    if (age <= 3) return { label: isPt ? 'Berco Cortesia' : 'Complimentary Crib', cost: 0, icon: <Baby className="w-3 h-3" /> };
    if (age <= 8) return { label: isPt ? 'Cama Junior' : 'Junior Bed', cost: 20, icon: <Bed className="w-3 h-3" /> };
    return { label: isPt ? 'Cama Juvenil' : 'Youth Bed', cost: 40, icon: <Bed className="w-3 h-3" /> };
  };

  const selectedRooms = useMemo(() => 
    suites.filter(s => selectedRoomIds.includes(s.id)), 
  [selectedRoomIds, suites]);

  const sortedSuites = useMemo(() => {
    return [...suites].sort((a, b) => {
      if (a.id === '101') return 1;
      if (b.id === '101') return -1;
      return a.id.localeCompare(b.id);
    });
  }, [suites]);

  const totalCapacity = useMemo(() => {
    const adults = selectedRooms.reduce((acc, r) => acc + r.adults, 0);
    const maxExtraBeds = selectedRooms.length; 
    return { adults, maxExtraBeds };
  }, [selectedRooms]);

  const remainingAdults = Math.max(0, adultCount - totalCapacity.adults);
  const remainingChildren = Math.max(0, childrenAges.length - totalCapacity.maxExtraBeds);
  const isCapacitySufficient = remainingAdults === 0 && remainingChildren === 0;
  
  useEffect(() => {
    if (step === 2 && isCapacitySufficient && selectedRoomIds.length > 0) {
      setTimeout(() => {
        scrollAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 100);
    }
  }, [isCapacitySufficient, step, selectedRoomIds.length]);

  const isPrestigeGuest = useMemo(() => {
    return selectedRoomIds.length >= 2 || (totalCapacity.adults > adultCount + 1);
  }, [selectedRoomIds, totalCapacity.adults, adultCount]);

  const totalPrice = useMemo(() => {
    const roomBase = selectedRooms.reduce((acc, r) => acc + r.price, 0) * nights;
    const kidsBase = childrenAges.reduce((acc, age) => acc + getChildPolicy(age).cost, 0) * nights;
    return roomBase + kidsBase;
  }, [selectedRooms, childrenAges, nights]);

  const suggestOptimalRooms = () => {
    setError(null);
    let currentNeeded = adultCount;
    let suggested: string[] = [];
    
    const available = [...suites].sort((a, b) => {
      if (a.id === '101' && b.id !== '101') return 1;
      if (b.id === '101' && a.id !== '101') return -1;
      return b.adults - a.adults || a.price - b.price;
    });

    while (currentNeeded > 0) {
      let bestChoice: Suite | null = null;
      if (currentNeeded > 2) {
        bestChoice = available.find(s => !suggested.includes(s.id) && s.adults > 2) || null;
      }
      if (!bestChoice) {
        bestChoice = available
          .filter(s => !suggested.includes(s.id))
          .sort((a, b) => {
            if (a.id === '101' && b.id !== '101') return 1;
            if (b.id === '101' && a.id !== '101') return -1;
            return a.price - b.price;
          })
          .find(s => s.adults >= currentNeeded || currentNeeded > 0) || null;
      }
      if (bestChoice) {
        suggested.push(bestChoice.id);
        currentNeeded -= bestChoice.adults;
      } else {
        break; 
      }
    }
    setSelectedRoomIds(suggested);
  };

  const triggerError = (msg: string) => {
    setError(msg);
    setErrorKey(prev => prev + 1);
  };

  const handleNext = () => {
    setError(null);
    if (step === 1) {
      if (!checkIn) { triggerError(isPt ? 'Por favor, selecione a data de check-in.' : 'Please select a check-in date.'); return; }
      if (!checkOut) { triggerError(isPt ? 'Por favor, selecione a data de check-out.' : 'Please select a check-out date.'); return; }
      const [y1, m1, d1] = checkIn.split('-').map(Number);
      const [y2, m2, d2] = checkOut.split('-').map(Number);
      const start = new Date(y1, m1 - 1, d1);
      const end = new Date(y2, m2 - 1, d2);
      if (start >= end) { triggerError(isPt ? 'A data de check-in nao pode ser posterior ou igual a data de check-out.' : 'Check-in date cannot be the same as or after check-out date.'); return; }
      if (checkIn < todayStr) { triggerError(isPt ? 'A data de check-in nao pode ser no passado.' : 'Check-in date cannot be in the past.'); return; }
      setStep(2);
    } else if (step === 2) {
      if (selectedRoomIds.length === 0) { triggerError(isPt ? 'Selecione pelo menos uma suite para continuar.' : 'Select at least one suite to continue.'); return; }
      if (!isCapacitySufficient) {
        let msg = "";
        if (remainingAdults > 0 && remainingChildren > 0) {
          msg = isPt
            ? `Capacidade excedida: As suites selecionadas nao comportam ${remainingAdults} adultos e ${remainingChildren} criancas adicionais.`
            : `Capacity exceeded: selected suites cannot accommodate ${remainingAdults} additional adults and ${remainingChildren} additional children.`;
        } else if (remainingAdults > 0) {
          msg = isPt
            ? `Capacidade excedida: O numero de adultos excede a capacidade das suites selecionadas (faltam ${remainingAdults}).`
            : `Capacity exceeded: adult count exceeds selected suites capacity (${remainingAdults} missing).`;
        } else {
          msg = isPt
            ? `Capacidade excedida: Nao existem camas extra suficientes para ${remainingChildren} criancas nas suites selecionadas.`
            : `Capacity exceeded: not enough extra beds for ${remainingChildren} children in selected suites.`;
        }
        triggerError(msg);
        return;
      }
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    } else if (step === 4) {
      if (!billingDetails.firstName || !billingDetails.lastName || !billingDetails.email || !billingDetails.phone) {
        triggerError(isPt ? 'Por favor, preencha todos os dados de contacto obrigatorios.' : 'Please fill all required contact fields.');
        return;
      }
      if (!billingDetails.email.includes('@')) {
        triggerError(isPt ? 'Por favor, introduza um e-mail valido.' : 'Please enter a valid e-mail address.');
        return;
      }
      const saved = addReservation({
        source: 'website',
        status: 'pending',
        checkIn,
        checkOut,
        guestName: `${billingDetails.firstName} ${billingDetails.lastName}`.trim(),
        email: billingDetails.email,
        phone: billingDetails.phone,
        adults: adultCount,
        childrenCount: childrenAges.length,
        suiteIds: [...selectedRoomIds],
        suiteNames: selectedRooms.map((r) => r.name),
        nights,
        totalPrice,
        nif: billingDetails.nif.trim() || undefined,
      });
      void submitReservationRemote(saved);
      trackEvent('reservation_submit', {
        source: 'website',
        adults: adultCount,
        children: childrenAges.length,
        suites: selectedRoomIds.length,
        nights,
      });
      setStep(5);
    }
  };

  const updateChildAge = (index: number, newAge: number) => {
    const newAges = [...childrenAges];
    newAges[index] = newAge;
    setChildrenAges(newAges);
    setActiveChildDropdown(null);
  };

  const updateBilling = (field: keyof typeof billingDetails, value: string) => {
    setBillingDetails(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-6" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-charcoal/95 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative w-full max-w-5xl bg-bone h-full md:h-auto md:max-h-[95vh] overflow-hidden flex flex-col rounded-sm shadow-2xl animate-fade-up">
        
        <div className="bg-bone border-b border-charcoal/5 px-4 py-4 md:px-8 md:py-6 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4 md:gap-6">
            {step > 1 && step < 5 && (
              <button 
                type="button"
                onClick={() => {
                  setStep(step - 1);
                  setError(null);
                }} 
                className="group p-2 hover:bg-gold/10 rounded-sm transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gold group-hover:-translate-x-1 transition-transform" />
              </button>
            )}
            <h2 className="font-serif text-lg md:text-2xl text-charcoal tracking-tight">{isPt ? 'Reserva de Luxo' : 'Luxury Reservation'}</h2>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="p-2 hover:bg-charcoal/5 rounded-sm transition-colors"
          >
            <X className="w-6 h-6 text-charcoal/20 hover:text-charcoal" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-4 md:px-20 md:py-16">
          <nav className="flex justify-between mb-8 md:mb-20 max-w-md mx-auto relative">
             <div className="absolute top-1/2 left-0 w-full h-[1px] bg-charcoal/5 -z-0"></div>
             {[1,2,3,4,5].map(s => (
               <div key={s} className={`relative z-10 w-8 h-8 md:w-10 md:h-10 border rounded-full flex items-center justify-center text-[10px] md:text-[11px] font-bold transition-all duration-700 ${step >= s ? 'bg-gold border-gold text-white shadow-lg shadow-gold/20 scale-110' : 'bg-bone border-charcoal/10 text-charcoal/20'}`}>
                 {step > s ? <Check className="w-4 h-4 md:w-5 md:h-5" strokeWidth={3} /> : s}
               </div>
             ))}
          </nav>

          <div className="max-w-3xl mx-auto">
            {error && (
              <div 
                key={errorKey}
                className="mb-8 p-4 md:p-5 bg-gold/5 border border-gold/20 flex items-center gap-4 text-charcoal text-[10px] md:text-[11px] uppercase tracking-widest font-black rounded-sm animate-fade-up"
              >
                <AlertCircle className="w-5 h-5 shrink-0 text-gold" /> {error}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-8 md:space-y-16 animate-fade-up">
                <div className="text-center space-y-2 md:space-y-4">
                  <h3 className="font-serif text-3xl md:text-6xl text-charcoal">{isPt ? 'Datas & Hospedes' : 'Dates & Guests'}</h3>
                  <p className="text-charcoal/40 text-xs md:text-sm italic font-light">{isPt ? 'Defina o seu grupo para encontrarmos o melhor espaco.' : 'Set your group details so we can find the best fit.'}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 md:gap-20">
                  <div className="relative group border border-charcoal/5 hover:border-gold transition-colors p-4 md:p-6 rounded-sm bg-white">
                    <div className="pointer-events-none">
                      <span className="block text-[8px] md:text-[10px] uppercase tracking-[0.4em] font-black text-charcoal/30 mb-2 md:mb-4 group-hover:text-gold transition-colors">{isPt ? 'Entrada' : 'Check-in'}</span>
                      <span className={`block font-serif text-xl md:text-4xl [font-variant-numeric:lining-nums] ${checkIn ? 'text-charcoal' : 'text-charcoal/20'}`}>
                        {formatDateDisplay(checkIn)}
                      </span>
                    </div>
                    <input 
                      ref={checkInInputRef} 
                      type="date" 
                      min={todayStr} 
                      value={checkIn} 
                      onChange={e => { setCheckIn(e.target.value); setError(null); }} 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
                    />
                  </div>

                  <div className="relative group border border-charcoal/5 hover:border-gold transition-colors p-4 md:p-6 rounded-sm bg-white">
                    <div className="pointer-events-none">
                      <span className="block text-[8px] md:text-[10px] uppercase tracking-[0.4em] font-black text-charcoal/30 mb-2 md:mb-4 group-hover:text-gold transition-colors">{isPt ? 'Saida' : 'Check-out'}</span>
                      <span className={`block font-serif text-xl md:text-4xl [font-variant-numeric:lining-nums] ${checkOut ? 'text-charcoal' : 'text-charcoal/20'}`}>
                        {formatDateDisplay(checkOut)}
                      </span>
                    </div>
                    <input 
                      ref={checkOutInputRef} 
                      type="date" 
                      min={checkIn || todayStr} 
                      value={checkOut} 
                      onChange={e => { setCheckOut(e.target.value); setError(null); }} 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
                    />
                  </div>
                </div>

                <div className="space-y-4 md:space-y-6">
                  <div className="flex items-center justify-between p-4 md:p-8 bg-white shadow-sm border border-charcoal/5 rounded-sm transition-all hover:shadow-md hover:border-gold/20">
                    <div className="space-y-1">
                      <span className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] font-black text-charcoal/30 block">{isPt ? 'Adultos' : 'Adults'}</span>
                      <p className="hidden md:block text-[10px] text-gold font-bold uppercase tracking-widest">{isPt ? 'Acomodacao Principal' : 'Main Occupancy'}</p>
                    </div>
                    <div className="flex items-center gap-4 md:gap-6 relative z-30">
                      <button type="button" onClick={() => setAdultCount(Math.max(1, adultCount - 1))} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center border border-charcoal/10 rounded-sm hover:bg-gold hover:text-white hover:border-gold transition-all disabled:opacity-30" disabled={adultCount <= 1}><Minus className="w-3 h-3 md:w-4 md:h-4" /></button>
                      <span className="font-serif text-2xl md:text-4xl w-8 md:w-12 text-center text-charcoal [font-variant-numeric:lining-nums]">{adultCount}</span>
                      <button type="button" onClick={() => setAdultCount(adultCount + 1)} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center border border-charcoal/10 rounded-sm hover:bg-gold hover:text-white hover:border-gold transition-all"><Plus className="w-3 h-3 md:w-4 md:h-4" /></button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-2 pt-2 md:pt-4">
                    <span className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] font-black text-charcoal/30">{isPt ? 'Criancas (Extra/Berco)' : 'Children (Extra/Crib)'}</span>
                    <button type="button" onClick={() => childrenAges.length < 4 && setChildrenAges([...childrenAges, 5])} className={`text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] border-b pb-1 transition-all flex items-center gap-2 ${childrenAges.length >= 4 ? 'text-gray-300 border-transparent cursor-not-allowed' : 'text-gold border-gold/20 hover:border-gold'}`} disabled={childrenAges.length >= 4}><Plus className="w-3 h-3" /> <span className="hidden md:inline">{isPt ? 'Adicionar' : 'Add'}</span></button>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:gap-4">
                    {childrenAges.map((age, idx) => {
                      const isOpen = activeChildDropdown === idx;
                      return (
                        <div key={idx} className="relative flex items-center justify-between p-4 md:p-6 bg-white border border-charcoal/5 rounded-sm animate-fade-up shadow-sm hover:border-gold/20 transition-all">
                          <div className="flex items-center gap-3 md:gap-4">
                            <div className="p-1.5 md:p-2 bg-bone rounded-full"><Baby className="w-4 h-4 md:w-5 md:h-5 text-gold" /></div>
                            <span className="text-[8px] md:text-[10px] uppercase tracking-widest font-black text-charcoal/40">{isPt ? `Crianca ${idx + 1}` : `Child ${idx + 1}`}</span>
                          </div>
                          <div className="flex items-center gap-4 md:gap-6">
                            <div className="relative">
                              <button type="button" onClick={() => setActiveChildDropdown(isOpen ? null : idx)} className={`flex items-center gap-2 md:gap-3 px-3 py-1.5 md:px-4 md:py-2 border rounded-sm min-w-[80px] md:min-w-[100px] justify-between transition-all ${isOpen ? 'border-gold bg-gold/5 text-gold' : 'border-charcoal/10 text-charcoal hover:border-gold/30'}`}><span className="text-xs md:text-sm font-serif font-bold [font-variant-numeric:lining-nums]">{age} {isPt ? 'Anos' : 'Years'}</span><ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} /></button>
                              {isOpen && (
                                <div className="absolute top-full right-0 mt-2 w-56 md:w-64 bg-white border border-charcoal/10 shadow-2xl rounded-sm z-[60] p-2 grid grid-cols-4 gap-1 animate-fade-up duration-200">
                                  {[...Array(18)].map((_, i) => (<button key={i} type="button" onClick={() => updateChildAge(idx, i)} className={`p-2 text-center text-xs md:text-sm font-serif transition-colors rounded-sm hover:bg-gold hover:text-white ${age === i ? 'bg-gold/10 text-gold font-bold' : 'text-charcoal'}`}>{i}</button>))}
                                </div>
                              )}
                              {isOpen && <div className="fixed inset-0 z-[50]" onClick={() => setActiveChildDropdown(null)}></div>}
                            </div>
                            <button type="button" onClick={() => { setChildrenAges(childrenAges.filter((_, i) => i !== idx)); setActiveChildDropdown(null); }} className="text-charcoal/20 hover:text-red-500 transition-colors p-1 md:p-2 hover:bg-red-50 rounded-sm"><X className="w-4 h-4 md:w-5 md:h-5" /></button>
                          </div>
                        </div>
                      );
                    })}
                    {childrenAges.length === 0 && (<div className="p-6 md:p-8 border border-dashed border-charcoal/10 rounded-sm text-center"><p className="text-[9px] md:text-[10px] uppercase tracking-widest text-charcoal/30">{isPt ? 'Sem criancas adicionadas' : 'No children added'}</p></div>)}
                  </div>
                </div>

                <button type="button" onClick={handleNext} className="w-full bg-charcoal text-white py-6 md:py-8 uppercase text-[10px] md:text-[11px] tracking-[0.18em] md:tracking-[0.35em] font-black hover:bg-gold hover:shadow-2xl hover:shadow-gold/20 transition-all duration-500 rounded-sm">{isPt ? 'Procurar Disponibilidade' : 'Search Availability'}</button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8 md:space-y-12 animate-fade-up">
                <div className="text-center space-y-2 md:space-y-4">
                  <h3 className="font-serif text-3xl md:text-6xl text-charcoal">{isPt ? 'Selecao de Suites' : 'Suite Selection'}</h3>
                  <p className="text-charcoal/40 text-xs md:text-sm italic font-light">{isPt ? 'Selecione as suites para o seu grupo.' : 'Select suites for your group.'}</p>
                </div>
                {isPrestigeGuest && (
                  <div className="bg-gold/10 border border-gold/30 p-3 md:p-4 rounded-sm flex items-center gap-4 animate-fade-up">
                    <div className="p-2 bg-gold rounded-sm"><Crown className="w-3 h-3 md:w-4 md:h-4 text-white" /></div>
                    <span className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-black text-gold">{isPt ? 'Hospede de Prestigio: Conforto Superior Detetado' : 'Prestige Guest: Premium Comfort Detected'}</span>
                  </div>
                )}
                <div className={`p-4 md:p-8 border rounded-sm flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6 transition-all duration-700 ${isCapacitySufficient ? 'bg-white border-gold/20 shadow-md' : 'bg-gold/5 border-gold/10'}`}>
                  <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
                    <div className="p-3 bg-gold/10 rounded-full"><UsersIcon className="w-5 h-5 md:w-6 md:h-6 text-gold" /></div>
                    <div><p className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-black text-charcoal/40">{isPt ? 'Ocupacao da Comitiva' : 'Group Occupancy'}</p><p className="text-xs md:text-sm text-charcoal font-medium mt-1">{isCapacitySufficient ? (isPt ? 'Espaco ideal confirmado.' : 'Ideal fit confirmed.') : (isPt ? `Acomode mais ${remainingAdults} adultos ${remainingChildren > 0 ? `e ${remainingChildren} criancas` : ''}` : `Accommodate ${remainingAdults} more adults ${remainingChildren > 0 ? `and ${remainingChildren} children` : ''}`)}</p></div>
                  </div>
                  {!isCapacitySufficient && (<button type="button" onClick={suggestOptimalRooms} className="w-full md:w-auto flex justify-center items-center gap-3 bg-gold text-white px-6 py-3 rounded-sm text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] hover:bg-charcoal hover:shadow-xl transition-all"><Sparkles className="w-3 h-3 md:w-4 md:h-4" /> {isPt ? 'Sugestao de Curadoria' : 'Curated Suggestion'}</button>)}
                </div>
                <div className="grid grid-cols-1 gap-6 md:gap-8">
                  {sortedSuites.map(suite => {
                    const isSelected = selectedRoomIds.includes(suite.id);
                    return (
                      <div 
                        key={suite.id} 
                        onClick={() => { 
                          setSelectedRoomIds(prev => prev.includes(suite.id) ? prev.filter(id => id !== suite.id) : [...prev, suite.id]); 
                          setError(null); 
                        }} 
                        className={`
                          group relative flex flex-col md:flex-row gap-5 md:gap-8 p-0 md:p-6 border rounded-sm cursor-pointer 
                          transform-gpu transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] active:scale-[0.97]
                          ${isSelected 
                            ? 'border-gold bg-white shadow-2xl md:scale-[1.02] md:-translate-y-1' 
                            : 'border-charcoal/5 bg-white/50 hover:bg-white hover:border-gold/30 hover:shadow-lg translate-y-0 scale-100'
                          }
                        `}
                      >
                        <div className="w-full md:w-48 aspect-[16/9] md:aspect-square shrink-0 overflow-hidden rounded-t-sm md:rounded-sm"><img src={suite.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={suite.name} /></div>
                        <div className="flex-grow flex flex-col justify-between p-5 md:p-0 md:py-1">
                          <div className="flex justify-between items-start gap-4 mb-3"><h4 className="font-serif text-xl md:text-2xl group-hover:text-gold transition-colors leading-tight">{suite.name}</h4><div className="text-right shrink-0"><span className="block text-xl md:text-2xl font-serif text-gold [font-variant-numeric:lining-nums]">€{suite.price}</span><span className="text-[8px] md:text-[9px] uppercase tracking-widest text-charcoal/30 font-black">Por Noite</span></div></div>
                          <div className="flex flex-wrap gap-4 md:gap-6"><div className="flex items-center gap-2"><UsersIcon className="w-3 h-3 text-gold/40" /><span className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] font-black text-charcoal/60 [font-variant-numeric:lining-nums]">Base: {suite.adults} Pax</span></div><div className="flex items-center gap-2"><span className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] font-black text-charcoal/60 [font-variant-numeric:lining-nums]">{suite.area}</span></div></div>
                          {isSelected && (<div className="flex items-center gap-3 mt-5 pt-4 border-t border-gold/5 md:border-0 md:mt-4 md:pt-0 animate-fade-up"><div className="w-5 h-5 bg-gold rounded-full flex items-center justify-center shadow-lg shadow-gold/20"><Check className="w-3 h-3 text-white" strokeWidth={4} /></div><span className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] font-black text-gold">{isPt ? 'Suite Confirmada' : 'Suite Confirmed'}</span></div>)}
                        </div>
                        {isSelected && (<div className="absolute top-4 right-4 md:hidden w-8 h-8 bg-gold rounded-full flex items-center justify-center shadow-xl"><Check className="w-4 h-4 text-white" strokeWidth={3} /></div>)}
                      </div>
                    );
                  })}
                </div>
                <div ref={scrollAnchorRef} className="pt-4">
                  <button 
                    type="button" 
                    onClick={handleNext} 
                    className={`
                      w-full py-6 md:py-8 uppercase text-[10px] md:text-[11px] tracking-[0.18em] md:tracking-[0.35em] font-black rounded-sm transition-all duration-700 shadow-2xl
                      ${selectedRoomIds.length > 0 && isCapacitySufficient 
                        ? 'bg-gold text-white hover:bg-charcoal animate-pulse' 
                        : selectedRoomIds.length > 0 
                          ? 'bg-charcoal text-white/50 opacity-80' 
                          : 'bg-charcoal/5 text-charcoal/20 pointer-events-none'
                      }
                    `}
                  >
                    {isPt ? 'Gerar Resumo da Reserva' : 'Generate Booking Summary'}
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8 md:space-y-12 animate-fade-up text-charcoal pb-12">
                <div className="text-center space-y-2 md:space-y-4">
                  <h3 className="font-serif text-3xl md:text-6xl">{isPt ? 'O Seu Resumo' : 'Your Summary'}</h3>
                  <p className="text-charcoal/40 text-xs md:text-sm italic font-light">{isPt ? 'Revise os detalhes antes de concluir a sua experiencia real.' : 'Review details before finalizing your stay request.'}</p>
                </div>
                
                {isPrestigeGuest && (
                  <div className="bg-charcoal text-white p-6 md:p-8 border-l-4 border-gold rounded-sm shadow-xl flex justify-between items-center group overflow-hidden relative">
                    <Crown className="absolute -right-6 -bottom-6 w-32 h-32 text-white/5 -rotate-12 transition-transform pointer-events-none" />
                    <div className="relative z-10">
                      <span className="text-gold text-[9px] md:text-[10px] uppercase tracking-[0.5em] font-black block mb-2">{isPt ? 'Estatuto de Prestigio' : 'Prestige Status'}</span>
                      <h4 className="font-serif text-2xl md:text-3xl">{isPt ? 'Hospede Privilegiado' : 'Privileged Guest'}</h4>
                      <p className="text-white/50 text-[9px] md:text-[10px] uppercase tracking-[0.2em] mt-2 font-bold italic">{isPt ? 'Amenidades de Boas-Vindas & Upgrade de Experiencia Incluidos.' : 'Welcome Amenities & Experience Upgrade Included.'}</p>
                    </div>
                    <div className="hidden md:block relative z-10"><Award className="w-12 h-12 text-gold animate-fade-up" /></div>
                  </div>
                )}

                <div className="bg-white border border-charcoal/5 p-6 md:p-14 rounded-sm shadow-2xl space-y-10 md:space-y-16 relative">
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 border-b border-charcoal/5 pb-10 relative z-10">
                      <div>
                        <span className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-gold font-black block mb-2">Check-in</span>
                        <span className="text-sm md:text-lg font-serif [font-variant-numeric:lining-nums]">{formatDateDisplay(checkIn)}</span>
                      </div>
                      <div>
                        <span className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-gold font-black block mb-2">Check-out</span>
                        <span className="text-sm md:text-lg font-serif [font-variant-numeric:lining-nums]">{formatDateDisplay(checkOut)}</span>
                      </div>
                      <div>
                        <span className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-gold font-black block mb-2">{isPt ? 'Noites' : 'Nights'}</span>
                        <span className="text-sm md:text-lg font-serif [font-variant-numeric:lining-nums]">{nights} {isPt ? `Noite${nights !== 1 ? 's' : ''}` : `Night${nights !== 1 ? 's' : ''}`}</span>
                      </div>
                      <div>
                        <span className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-gold font-black block mb-2">{isPt ? 'Comitiva' : 'Guests'}</span>
                        <span className="text-sm md:text-lg font-serif [font-variant-numeric:lining-nums]">{adultCount} {isPt ? 'Ad.' : 'Ad.'} {childrenAges.length > 0 && `/ ${childrenAges.length} ${isPt ? 'Cri.' : 'Ch.'}`}</span>
                      </div>
                   </div>

                   <div className="space-y-8 relative z-10">
                      <div className="flex items-center gap-3 border-l-2 border-gold pl-4">
                        <ReceiptText className="w-4 h-4 text-gold" />
                        <h4 className="text-[10px] md:text-[11px] uppercase tracking-[0.5em] font-black text-charcoal/40">{isPt ? 'Detalhamento de Custos' : 'Cost Breakdown'}</h4>
                      </div>

                      <div className="space-y-6">
                        {selectedRooms.map(room => (
                          <div key={room.id} className="group flex justify-between items-start">
                            <div className="space-y-1">
                              <span className="text-base md:text-xl font-serif block group-hover:text-gold transition-colors">{room.name}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-charcoal/40 uppercase tracking-widest font-bold">{nights} {isPt ? 'Noites' : 'Nights'} × €{room.price}</span>
                              </div>
                            </div>
                            <span className="text-base md:text-xl text-charcoal font-serif [font-variant-numeric:lining-nums]">€{room.price * nights}</span>
                          </div>
                        ))}

                        {childrenAges.map((age, i) => {
                          const policy = getChildPolicy(age);
                          const itemTotal = policy.cost * nights;
                          if (itemTotal === 0 && age > 3) return null;
                          return (
                            <div key={`child-${i}`} className="flex justify-between items-start opacity-80 pt-2">
                              <div className="flex items-center gap-3">
                                <div className="p-1.5 bg-bone rounded-full">{policy.icon}</div>
                                <div>
                                  <span className="text-[9px] md:text-[11px] uppercase tracking-[0.2em] font-black text-charcoal/60 block">{isPt ? `Suplemento Crianca ${i+1} (${age} anos)` : `Child Supplement ${i+1} (${age} years)`}</span>
                                  <span className="text-[9px] text-charcoal/30 font-bold uppercase tracking-widest">{policy.label} {policy.cost > 0 && `(€${policy.cost}/noite)`}</span>
                                </div>
                              </div>
                              <span className="text-xs md:text-sm font-black text-gold [font-variant-numeric:lining-nums]">
                                {itemTotal > 0 ? `€${itemTotal}` : (isPt ? 'Cortesia' : 'Courtesy')}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                   </div>

                   <div className="pt-8 md:pt-12 flex flex-col md:flex-row justify-between items-center md:items-end border-t border-charcoal/10 relative z-10 gap-8">
                      <div className="text-center md:text-left space-y-2">
                        <span className="block text-[10px] md:text-[12px] uppercase tracking-[0.5em] font-black text-charcoal/20">{isPt ? 'Investimento na sua Tranquilidade' : 'Your Stay Investment'}</span>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                           <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                              <Check className="w-3 h-3" /> {isPt ? 'Cancelamento Flexivel' : 'Flexible Cancellation'}
                           </div>
                           <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold text-gold bg-gold/5 px-3 py-1 rounded-full">
                              <Check className="w-3 h-3" /> {isPt ? 'Pequeno-almoco Incluido' : 'Breakfast Included'}
                           </div>
                        </div>
                      </div>
                      <div className="text-center md:text-right shrink-0">
                        <span className="block text-[9px] md:text-[11px] uppercase tracking-[0.28em] md:tracking-[0.45em] font-black text-gold/40 mb-1">{isPt ? 'Total Final da Estadia' : 'Final Stay Total'}</span>
                        <div className="flex items-baseline justify-center md:justify-end gap-2">
                          <span className="font-serif text-5xl md:text-7xl text-gold [font-variant-numeric:lining-nums] drop-shadow-sm transition-all duration-700">
                            €{totalPrice}
                          </span>
                        </div>
                        <p className="text-[8px] text-charcoal/30 uppercase tracking-[0.4em] mt-2 font-black">{isPt ? 'IVA e Taxas Turisticas Incluidas' : 'VAT and Tourist Taxes Included'}</p>
                      </div>
                   </div>
                </div>

                <div className="pt-4">
                  <button 
                    type="button" 
                    onClick={handleNext} 
                    className="w-full bg-charcoal text-white py-6 md:py-9 uppercase text-[10px] md:text-[13px] tracking-[0.18em] md:tracking-[0.35em] font-black hover:bg-gold transition-all duration-700 shadow-2xl rounded-sm flex items-center justify-center gap-3 md:gap-4 group"
                  >
                    {isPt ? 'Prosseguir para Confirmacao' : 'Proceed to Confirmation'}
                    <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-8 md:space-y-12 animate-fade-up text-charcoal pb-12">
                <div className="text-center space-y-2 md:space-y-4">
                  <h3 className="font-serif text-3xl md:text-5xl">{isPt ? 'Confirmacao & Faturacao' : 'Confirmation & Billing'}</h3>
                  <div className="flex items-center justify-center gap-2 text-gold">
                    <Lock className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="text-[10px] uppercase tracking-widest font-bold">{isPt ? 'Portal de Reserva Seguro' : 'Secure Booking Portal'}</span>
                  </div>
                </div>

                <div className="bg-white p-6 md:p-8 rounded-sm shadow-lg border border-charcoal/5">
                  <h4 className="text-[10px] md:text-[11px] uppercase tracking-[0.4em] font-black text-gold mb-6 md:mb-8">{isPt ? 'Dados de Contacto' : 'Contact Details'}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-charcoal/60">{isPt ? 'Nome Proprio' : 'First Name'}</label>
                      <input 
                        type="text" 
                        value={billingDetails.firstName}
                        onChange={(e) => updateBilling('firstName', e.target.value)}
                        className="w-full bg-bone border border-charcoal/10 p-3 md:p-4 text-sm font-serif focus:border-gold outline-none transition-colors"
                        placeholder={isPt ? 'Primeiro Nome' : 'First Name'}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-charcoal/60">{isPt ? 'Apelido' : 'Last Name'}</label>
                      <input 
                        type="text" 
                        value={billingDetails.lastName}
                        onChange={(e) => updateBilling('lastName', e.target.value)}
                        className="w-full bg-bone border border-charcoal/10 p-3 md:p-4 text-sm font-serif focus:border-gold outline-none transition-colors"
                        placeholder={isPt ? 'Ultimo Nome' : 'Last Name'}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-charcoal/60">E-mail</label>
                      <input 
                        type="email" 
                        value={billingDetails.email}
                        onChange={(e) => updateBilling('email', e.target.value)}
                        className="w-full bg-bone border border-charcoal/10 p-3 md:p-4 text-sm font-serif focus:border-gold outline-none transition-colors"
                        placeholder="exemplo@email.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-charcoal/60">{isPt ? 'Telefone' : 'Phone'}</label>
                      <input 
                        type="tel" 
                        value={billingDetails.phone}
                        onChange={(e) => updateBilling('phone', e.target.value)}
                        className="w-full bg-bone border border-charcoal/10 p-3 md:p-4 text-sm font-serif focus:border-gold outline-none transition-colors"
                        placeholder="+351 900 000 000"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-charcoal/60">{isPt ? 'NIF (Opcional)' : 'Tax ID (Optional)'}</label>
                      <input 
                        type="text" 
                        value={billingDetails.nif}
                        onChange={(e) => updateBilling('nif', e.target.value)}
                        className="w-full bg-bone border border-charcoal/10 p-3 md:p-4 text-sm font-serif focus:border-gold outline-none transition-colors"
                        placeholder={isPt ? 'Numero de Identificacao Fiscal' : 'Tax Identification Number'}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-charcoal text-white p-8 md:p-12 rounded-sm shadow-2xl relative overflow-hidden group">
                  <Mail className="absolute -right-8 -bottom-8 w-48 h-48 text-white/5 -rotate-12 group-hover:scale-110 transition-transform duration-1000" />
                  <div className="relative z-10 text-center space-y-6">
                    <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Wallet className="w-8 h-8 text-gold" />
                    </div>
                    <h4 className="text-xs uppercase tracking-[0.4em] font-black text-gold">{isPt ? 'Pagamento no Hotel & Confirmacao via E-mail' : 'Pay at Hotel & Confirmation by E-mail'}</h4>
                    <p className="font-serif text-lg md:text-xl leading-relaxed italic text-white/80">
                      {isPt
                        ? '"A sua reserva sera validada pela nossa equipa de curadoria. Todos os detalhes para garantia da reserva e metodos de pagamento serao enviados por e-mail."'
                        : '"Your reservation will be validated by our curation team. Full guarantee and payment details will be sent directly by e-mail."'}
                    </p>
                    <div className="pt-4 flex flex-col items-center gap-3">
                       <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-white/40">
                          <Check className="w-3 h-3 text-gold" /> {isPt ? 'Pagamento final realizado no Check-in' : 'Final payment made at Check-in'}
                       </div>
                       <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-white/40">
                          <Check className="w-3 h-3 text-gold" /> {isPt ? 'Suporte personalizado via correio eletronico' : 'Personalized support via e-mail'}
                       </div>
                    </div>
                  </div>
                </div>
                
                <button 
                  type="button" 
                  onClick={handleNext} 
                  className="w-full bg-gold text-white py-6 md:py-8 uppercase text-[10px] md:text-[12px] tracking-[0.18em] md:tracking-[0.35em] font-black hover:bg-charcoal transition-all duration-700 shadow-2xl rounded-sm flex items-center justify-center gap-2 md:gap-3"
                >
                  <CalendarIcon className="w-4 h-4" />
                  {isPt ? `Confirmar Pre-Reserva de €${totalPrice}` : `Confirm Pre-Reservation of €${totalPrice}`}
                </button>
                <p className="text-center text-[10px] text-charcoal/30 uppercase tracking-[0.4em] font-black">{isPt ? 'Ao clicar, confirma a rececao de detalhes via email.' : 'By clicking, you confirm receiving details by e-mail.'}</p>
              </div>
            )}

            {step === 5 && (
              <div className="text-center py-16 md:py-24 space-y-8 md:space-y-12 animate-fade-up">
                <div className="w-16 h-16 md:w-24 md:h-24 bg-gold/10 rounded-full flex items-center justify-center mx-auto shadow-inner"><Check className="w-8 h-8 md:w-12 md:h-12 text-gold animate-fade-up" strokeWidth={3} /></div>
                <div className="space-y-4 md:space-y-6">
                  <h3 className="font-serif text-4xl md:text-5xl text-charcoal">{isPt ? 'Solicitacao Enviada' : 'Request Sent'}</h3>
                  <div className="bg-gold/5 p-6 rounded-sm border border-gold/10 max-w-sm mx-auto">
                    <p className="text-charcoal/60 leading-relaxed font-light text-sm md:text-base italic">
                      {isPt
                        ? 'Verifique a sua caixa de entrada. Recebera os detalhes para pagamento e confirmacao oficial em breve.'
                        : 'Check your inbox. You will receive payment details and official confirmation shortly.'}
                    </p>
                  </div>
                </div>
                <div className="pt-6 md:pt-10"><button type="button" onClick={onClose} className="bg-gold text-white px-10 py-4 md:px-16 md:py-6 uppercase text-[9px] md:text-[11px] tracking-[0.18em] md:tracking-[0.32em] font-black hover:bg-charcoal rounded-sm transition-all">{isPt ? 'Voltar ao Palacio' : 'Back to Palacium'}</button></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
