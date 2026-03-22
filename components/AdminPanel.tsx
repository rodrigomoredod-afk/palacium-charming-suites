
import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { Lock, Save, RotateCcw, DollarSign, ArrowLeft, MessageSquare, Tag, Trash2, Sparkles, Loader2, Plus, Globe, Star, AlertTriangle, CalendarDays, Phone, Mail } from 'lucide-react';
import { ViewType, Review, ReservationSource, ReservationStatus } from '../types';
import { RESERVATION_SOURCE_LABELS } from '../constants';
import { submitReservationRemote } from '../lib/submitReservationRemote';
import { GoogleGenAI, Type } from "@google/genai";

interface AdminPanelProps {
  navigateTo: (view: ViewType) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ navigateTo }) => {
  const {
    suites,
    reviews,
    reservations,
    bookingDisplayScore,
    updateSuitePrice,
    addReview,
    deleteReview,
    addReservation,
    updateReservation,
    deleteReservation,
    setBookingDisplayScore,
    resetData,
  } = useData();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'prices' | 'reviews' | 'reservations'>('prices');

  const [resForm, setResForm] = useState({
    source: 'phone' as ReservationSource,
    status: 'confirmed' as ReservationStatus,
    checkIn: '',
    checkOut: '',
    guestName: '',
    email: '',
    phone: '',
    adults: '2',
    children: '0',
    suiteIds: [] as string[],
    totalPrice: '',
    externalRef: '',
    notes: '',
  });
  const [deletingReservationId, setDeletingReservationId] = useState<string | null>(null);
  
  // AI Import State
  const [importText, setImportText] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState('');

  // Deletion State
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Password incorreta');
    }
  };

  const handlePriceChange = (id: string, val: string) => {
    const num = parseInt(val);
    if (!isNaN(num) && num >= 0) {
      updateSuitePrice(id, num);
    }
  };

  const handleDeleteClick = (id: string) => {
    if (deletingId === id) {
      deleteReview(id);
      setDeletingId(null);
    } else {
      setDeletingId(id);
      // Auto-cancel after 3 seconds if not clicked again
      setTimeout(() => {
        setDeletingId(prev => prev === id ? null : prev);
      }, 3000);
    }
  };

  const sortedReservations = useMemo(() => {
    return [...reservations].sort((a, b) => {
      const byStay = a.checkIn.localeCompare(b.checkIn);
      if (byStay !== 0) return byStay;
      return b.createdAt.localeCompare(a.createdAt);
    });
  }, [reservations]);

  const computeNights = (checkIn: string, checkOut: string) => {
    if (!checkIn || !checkOut) return 0;
    const [y1, m1, d1] = checkIn.split('-').map(Number);
    const [y2, m2, d2] = checkOut.split('-').map(Number);
    const start = new Date(y1, m1 - 1, d1);
    const end = new Date(y2, m2 - 1, d2);
    const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
    return diff > 0 ? diff : 0;
  };

  const handleSubmitManualReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resForm.checkIn || !resForm.checkOut || !resForm.guestName.trim() || resForm.suiteIds.length === 0) return;
    const nights = computeNights(resForm.checkIn, resForm.checkOut);
    if (nights <= 0) return;
    const adults = parseInt(resForm.adults, 10) || 1;
    const childrenCount = parseInt(resForm.children, 10) || 0;
    let total: number | undefined;
    if (resForm.totalPrice.trim()) {
      const t = parseFloat(resForm.totalPrice.replace(',', '.'));
      if (!Number.isNaN(t)) total = t;
    }
    const saved = addReservation({
      source: resForm.source,
      status: resForm.status,
      checkIn: resForm.checkIn,
      checkOut: resForm.checkOut,
      guestName: resForm.guestName.trim(),
      email: resForm.email.trim() || undefined,
      phone: resForm.phone.trim() || undefined,
      adults,
      childrenCount,
      suiteIds: [...resForm.suiteIds],
      suiteNames: suites.filter((s) => resForm.suiteIds.includes(s.id)).map((s) => s.name),
      nights,
      totalPrice: total,
      externalRef: resForm.externalRef.trim() || undefined,
      notes: resForm.notes.trim() || undefined,
    });
    void submitReservationRemote(saved);
    setResForm({
      source: 'phone',
      status: 'confirmed',
      checkIn: '',
      checkOut: '',
      guestName: '',
      email: '',
      phone: '',
      adults: '2',
      children: '0',
      suiteIds: [],
      totalPrice: '',
      externalRef: '',
      notes: '',
    });
  };

  const handleReservationDeleteClick = (id: string) => {
    if (deletingReservationId === id) {
      deleteReservation(id);
      setDeletingReservationId(null);
    } else {
      setDeletingReservationId(id);
      setTimeout(() => {
        setDeletingReservationId((prev) => (prev === id ? null : prev));
      }, 3000);
    }
  };

  const handleAiImport = async () => {
    if (!importText.trim()) return;
    setIsImporting(true);
    setImportError('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Extract reviews from the following text and return them in a JSON array. 
        Each review object must have: author (string), nationality (string, optional), rating (integer 1-5), comment (string, full content), date (string, e.g. "Julho 2025").
        Text: ${importText}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                author: { type: Type.STRING },
                nationality: { type: Type.STRING },
                rating: { type: Type.INTEGER },
                comment: { type: Type.STRING },
                date: { type: Type.STRING }
              },
              required: ["author", "rating", "comment", "date"]
            }
          }
        }
      });

      const jsonStr = response.text?.trim() || '[]';
      const parsedReviews = JSON.parse(jsonStr);
      if (Array.isArray(parsedReviews)) {
        parsedReviews.forEach(r => {
          const newReview: Review = {
            id: Math.random().toString(36).substr(2, 9),
            ...r
          };
          addReview(newReview);
        });
        setImportText('');
      }
    } catch (err) {
      console.error("AI Import failed:", err);
      setImportError("Falha ao processar o texto com AI.");
    } finally {
      setIsImporting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-bone flex flex-col items-center justify-center px-6 text-charcoal">
        <div className="max-w-md w-full bg-white p-8 md:p-12 shadow-2xl rounded-sm border-t-4 border-gold">
          <div className="text-center mb-8">
            <Lock className="w-12 h-12 text-gold mx-auto mb-4" />
            <h2 className="font-serif text-3xl">Área Reservada</h2>
            <p className="text-charcoal/50 text-sm mt-2">Gestão Palacium Charming Suites</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-bone border border-charcoal/10 p-4 focus:border-gold outline-none transition-colors font-serif"
                placeholder="admin123"
              />
            </div>
            {error && <p className="text-red-500 text-xs font-bold uppercase tracking-widest">{error}</p>}
            
            <button type="submit" className="w-full bg-gold text-white py-4 uppercase text-xs tracking-[0.3em] font-bold hover:bg-charcoal transition-colors">
              Entrar
            </button>
          </form>
          
          <button onClick={() => navigateTo('home')} className="w-full mt-6 text-center text-[10px] uppercase tracking-widest text-charcoal/40 hover:text-gold transition-colors">
            Voltar ao Site
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bone pt-32 pb-20 px-6 md:px-16 text-charcoal">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <button 
              onClick={() => navigateTo('home')}
              className="flex items-center gap-2 text-gold text-[10px] uppercase tracking-[0.3em] font-bold mb-4 hover:-translate-x-2 transition-transform"
            >
              <ArrowLeft className="w-4 h-4" /> Sair do Painel
            </button>
            <h1 className="font-serif text-4xl md:text-5xl tracking-tight">Painel de Gestão</h1>
          </div>

          <div className="flex flex-wrap bg-white p-1 border border-charcoal/5 rounded-sm shadow-sm gap-1">
             <button 
                type="button"
                onClick={() => setActiveTab('prices')}
                className={`flex items-center gap-2 px-4 md:px-6 py-2 text-[10px] uppercase tracking-widest font-bold transition-all ${activeTab === 'prices' ? 'bg-gold text-white' : 'text-charcoal/40 hover:text-charcoal'}`}
             >
                <Tag className="w-3 h-3" /> Tarifas
             </button>
             <button 
                type="button"
                onClick={() => setActiveTab('reservations')}
                className={`flex items-center gap-2 px-4 md:px-6 py-2 text-[10px] uppercase tracking-widest font-bold transition-all ${activeTab === 'reservations' ? 'bg-gold text-white' : 'text-charcoal/40 hover:text-charcoal'}`}
             >
                <CalendarDays className="w-3 h-3" /> Reservas
             </button>
             <button 
                type="button"
                onClick={() => setActiveTab('reviews')}
                className={`flex items-center gap-2 px-4 md:px-6 py-2 text-[10px] uppercase tracking-widest font-bold transition-all ${activeTab === 'reviews' ? 'bg-gold text-white' : 'text-charcoal/40 hover:text-charcoal'}`}
             >
                <MessageSquare className="w-3 h-3" /> Comentários
             </button>
          </div>
        </div>

        {activeTab === 'prices' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
               <h2 className="text-xs uppercase tracking-[0.3em] font-black text-charcoal/30">Atualização de Preços por Suite</h2>
               <button 
                onClick={() => confirm('Restaurar preços padrão?') && resetData()}
                className="text-[9px] uppercase tracking-widest font-bold text-red-400 hover:text-red-600 flex items-center gap-2"
              >
                <RotateCcw className="w-3 h-3" /> Restaurar Originais
              </button>
            </div>
            <div className="bg-white rounded-sm shadow-xl border border-charcoal/5 overflow-hidden">
              <div className="grid grid-cols-12 bg-charcoal text-white py-4 px-6 text-[10px] uppercase tracking-[0.2em] font-bold">
                <div className="col-span-6 md:col-span-5">Suite</div>
                <div className="col-span-2 hidden md:block text-center">Capacidade</div>
                <div className="col-span-3 md:col-span-4 text-right">Preço Noite</div>
                <div className="col-span-3 md:col-span-3 text-center">Estado</div>
              </div>
              <div className="divide-y divide-charcoal/5">
                {suites.map((suite) => (
                  <div key={suite.id} className="grid grid-cols-12 items-center py-6 px-6 hover:bg-bone/30 transition-colors group">
                    <div className="col-span-6 md:col-span-5 flex items-center gap-4">
                      <img src={suite.image} alt="" className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-sm" />
                      <div>
                        <h3 className="font-serif text-lg group-hover:text-gold">{suite.name}</h3>
                        <p className="text-[10px] text-charcoal/30 font-bold uppercase tracking-tighter">{suite.id} • {suite.area}</p>
                      </div>
                    </div>
                    <div className="col-span-2 hidden md:flex justify-center text-xs text-charcoal/50 font-medium">{suite.adults} Pax</div>
                    <div className="col-span-3 md:col-span-4 flex justify-end">
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/30" />
                        <input 
                          type="number" 
                          value={suite.price}
                          onChange={(e) => handlePriceChange(suite.id, e.target.value)}
                          className="w-24 md:w-32 py-2.5 pl-8 pr-4 border border-charcoal/10 rounded-sm font-serif text-xl text-right focus:border-gold outline-none"
                        />
                      </div>
                    </div>
                    <div className="col-span-3 md:col-span-3 flex justify-center">
                      <div className="flex items-center gap-2 text-green-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Save className="w-4 h-4" />
                        <span className="text-[9px] uppercase font-bold">Salvo</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reservations' && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-8 border border-charcoal/5 shadow-xl rounded-sm">
                <h2 className="text-xs uppercase tracking-[0.3em] font-black text-charcoal/30 mb-2">Pontuação no site (Booking)</h2>
                <p className="text-sm text-charcoal/50 mb-4">
                  Valor mostrado em Críticas e Comodidades. Atualize quando o extranet do Booking mudar; ligação API automática exige parceria Connectivity.
                </p>
                <div className="flex items-end gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">Score (0–10)</label>
                    <input
                      type="number"
                      step="0.1"
                      min={0}
                      max={10}
                      value={bookingDisplayScore}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value);
                        if (!Number.isNaN(v)) setBookingDisplayScore(v);
                      }}
                      className="w-28 py-2 px-3 border border-charcoal/10 rounded-sm font-serif text-2xl text-center focus:border-gold outline-none"
                    />
                  </div>
                </div>
              </div>
              <div className="bg-charcoal text-white p-8 rounded-sm border border-white/5">
                <h3 className="text-xs uppercase tracking-[0.3em] font-black text-gold mb-2">Reservas unificadas</h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  Pedidos feitos no <strong className="text-white">site</strong> entram aqui automaticamente. Registe telefone, e-mail, Booking.com ou outras origens manualmente para ver a ocupação num só sítio.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-sm shadow-xl border border-charcoal/5 overflow-hidden">
              <div className="grid grid-cols-12 bg-charcoal text-white py-4 px-4 md:px-6 text-[9px] md:text-[10px] uppercase tracking-[0.15em] font-bold gap-2">
                <div className="col-span-6 md:col-span-2">Estadia</div>
                <div className="col-span-6 md:col-span-2">Origem</div>
                <div className="col-span-8 md:col-span-3 hidden md:block">Hóspede</div>
                <div className="col-span-4 md:col-span-2 text-right">Total</div>
                <div className="col-span-12 md:col-span-2 text-center md:text-left">Estado</div>
                <div className="col-span-12 md:col-span-1 text-right"></div>
              </div>
              <div className="divide-y divide-charcoal/5 max-h-[420px] overflow-y-auto">
                {sortedReservations.length === 0 ? (
                  <p className="p-8 text-center text-charcoal/40 text-sm">Ainda não há reservas. Conclua uma reserva no site ou adicione uma abaixo.</p>
                ) : (
                  sortedReservations.map((r) => {
                    const isDel = deletingReservationId === r.id;
                    return (
                      <div
                        key={r.id}
                        className={`grid grid-cols-12 gap-2 px-4 md:px-6 py-4 items-center text-sm md:text-base ${isDel ? 'bg-red-50/50' : 'hover:bg-bone/30'}`}
                      >
                        <div className="col-span-6 md:col-span-2">
                          <p className="font-serif text-charcoal">{r.checkIn} → {r.checkOut}</p>
                          <p className="text-[10px] text-charcoal/40 uppercase tracking-wider">{r.nights} noite{r.nights !== 1 ? 's' : ''}</p>
                        </div>
                        <div className="col-span-6 md:col-span-2">
                          <span className="text-[10px] uppercase tracking-widest font-bold text-gold block">
                            {RESERVATION_SOURCE_LABELS[r.source]}
                          </span>
                          {r.externalRef && (
                            <span className="text-[9px] text-charcoal/40 uppercase">Ref. {r.externalRef}</span>
                          )}
                        </div>
                        <div className="col-span-12 md:col-span-3">
                          <p className="font-medium text-charcoal">{r.guestName}</p>
                          <div className="flex flex-wrap gap-4 text-[10px] text-charcoal/30 uppercase tracking-wider mt-1">
                            {r.email && (
                              <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {r.email}</span>
                            )}
                            {r.phone && (
                              <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {r.phone}</span>
                            )}
                          </div>
                          <p className="text-[10px] text-charcoal/40 mt-1">{r.suiteNames.join(', ')}</p>
                          {r.notes && (
                            <p className="text-[10px] text-charcoal/50 mt-2 italic border-l-2 border-gold/30 pl-2">{r.notes}</p>
                          )}
                        </div>
                        <div className="col-span-4 md:col-span-2 text-right font-serif text-gold">
                          {r.totalPrice != null ? `€${r.totalPrice}` : '—'}
                        </div>
                        <div className="col-span-8 md:col-span-2">
                          <select
                            value={r.status}
                            onChange={(e) => updateReservation(r.id, { status: e.target.value as ReservationStatus })}
                            className="w-full text-[10px] uppercase tracking-widest font-bold border border-charcoal/10 rounded-sm py-2 px-2 bg-bone focus:border-gold outline-none"
                          >
                            <option value="pending">Pendente</option>
                            <option value="confirmed">Confirmada</option>
                            <option value="cancelled">Cancelada</option>
                          </select>
                        </div>
                        <div className="col-span-4 md:col-span-1 flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleReservationDeleteClick(r.id)}
                            className={`p-2 rounded-sm transition-all ${isDel ? 'bg-red-500 text-white' : 'text-charcoal/20 hover:text-red-500'}`}
                            aria-label={isDel ? 'Confirmar eliminar' : 'Eliminar'}
                          >
                            {isDel ? <AlertTriangle className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <form onSubmit={handleSubmitManualReservation} className="bg-white p-8 border border-charcoal/5 shadow-xl rounded-sm space-y-6">
              <h2 className="font-serif text-2xl text-charcoal">Registar reserva (telefone, e-mail, Booking.com…)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">Origem</label>
                  <select
                    value={resForm.source}
                    onChange={(e) => setResForm((f) => ({ ...f, source: e.target.value as ReservationSource }))}
                    className="w-full bg-bone border border-charcoal/10 p-3 text-sm focus:border-gold outline-none"
                  >
                    {(Object.keys(RESERVATION_SOURCE_LABELS) as ReservationSource[]).map((k) => (
                      <option key={k} value={k}>{RESERVATION_SOURCE_LABELS[k]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">Estado inicial</label>
                  <select
                    value={resForm.status}
                    onChange={(e) => setResForm((f) => ({ ...f, status: e.target.value as ReservationStatus }))}
                    className="w-full bg-bone border border-charcoal/10 p-3 text-sm focus:border-gold outline-none"
                  >
                    <option value="pending">Pendente</option>
                    <option value="confirmed">Confirmada</option>
                    <option value="cancelled">Cancelada</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">Ref. externa (opcional)</label>
                  <input
                    value={resForm.externalRef}
                    onChange={(e) => setResForm((f) => ({ ...f, externalRef: e.target.value }))}
                    placeholder="Ex.: conf. Booking.com"
                    className="w-full bg-bone border border-charcoal/10 p-3 text-sm focus:border-gold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">Check-in</label>
                  <input
                    type="date"
                    required
                    value={resForm.checkIn}
                    onChange={(e) => setResForm((f) => ({ ...f, checkIn: e.target.value }))}
                    className="w-full bg-bone border border-charcoal/10 p-3 text-sm focus:border-gold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">Check-out</label>
                  <input
                    type="date"
                    required
                    value={resForm.checkOut}
                    onChange={(e) => setResForm((f) => ({ ...f, checkOut: e.target.value }))}
                    className="w-full bg-bone border border-charcoal/10 p-3 text-sm focus:border-gold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">Nome do hóspede</label>
                  <input
                    required
                    value={resForm.guestName}
                    onChange={(e) => setResForm((f) => ({ ...f, guestName: e.target.value }))}
                    className="w-full bg-bone border border-charcoal/10 p-3 text-sm focus:border-gold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">E-mail</label>
                  <input
                    type="email"
                    value={resForm.email}
                    onChange={(e) => setResForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full bg-bone border border-charcoal/10 p-3 text-sm focus:border-gold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">Telefone</label>
                  <input
                    value={resForm.phone}
                    onChange={(e) => setResForm((f) => ({ ...f, phone: e.target.value }))}
                    className="w-full bg-bone border border-charcoal/10 p-3 text-sm focus:border-gold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">Adultos</label>
                  <input
                    type="number"
                    min={1}
                    value={resForm.adults}
                    onChange={(e) => setResForm((f) => ({ ...f, adults: e.target.value }))}
                    className="w-full bg-bone border border-charcoal/10 p-3 text-sm focus:border-gold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">Crianças</label>
                  <input
                    type="number"
                    min={0}
                    value={resForm.children}
                    onChange={(e) => setResForm((f) => ({ ...f, children: e.target.value }))}
                    className="w-full bg-bone border border-charcoal/10 p-3 text-sm focus:border-gold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">Total (€)</label>
                  <input
                    value={resForm.totalPrice}
                    onChange={(e) => setResForm((f) => ({ ...f, totalPrice: e.target.value }))}
                    placeholder="Opcional"
                    className="w-full bg-bone border border-charcoal/10 p-3 text-sm focus:border-gold outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">Suites</label>
                <div className="flex flex-wrap gap-3">
                  {suites.map((s) => {
                    const on = resForm.suiteIds.includes(s.id);
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() =>
                          setResForm((f) => ({
                            ...f,
                            suiteIds: on ? f.suiteIds.filter((id) => id !== s.id) : [...f.suiteIds, s.id],
                          }))
                        }
                        className={`text-[10px] uppercase tracking-widest font-bold px-4 py-2 border rounded-sm transition-colors ${
                          on ? 'bg-gold text-white border-gold' : 'border-charcoal/10 text-charcoal/50 hover:border-gold/40'
                        }`}
                      >
                        {s.name}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">Notas internas</label>
                <textarea
                  value={resForm.notes}
                  onChange={(e) => setResForm((f) => ({ ...f, notes: e.target.value }))}
                  rows={3}
                  className="w-full bg-bone border border-charcoal/10 p-4 text-sm focus:border-gold outline-none resize-none"
                  placeholder="Ex.: pediu late check-out"
                />
              </div>
              <button
                type="submit"
                className="bg-charcoal text-white px-8 py-4 uppercase text-[10px] tracking-[0.3em] font-black hover:bg-gold transition-colors rounded-sm"
              >
                Adicionar reserva
              </button>
            </form>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5 space-y-8">
               <div className="bg-white p-8 border border-charcoal/5 shadow-xl rounded-sm">
                  <div className="flex items-center gap-3 mb-6">
                     <Sparkles className="w-5 h-5 text-gold" />
                     <h2 className="text-xs uppercase tracking-[0.3em] font-black">Importação Inteligente (AI)</h2>
                  </div>
                  <p className="text-sm text-charcoal/60 mb-6 leading-relaxed">
                     Copie e cole os comentários do Booking.com ou outras plataformas abaixo. A nossa AI irá extrair automaticamente os nomes, notas e textos.
                  </p>
                  <textarea 
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                    placeholder="Cole aqui o texto dos comentários..."
                    className="w-full h-48 bg-bone border border-charcoal/10 p-4 text-sm font-sans focus:border-gold outline-none resize-none mb-4"
                  />
                  {importError && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mb-4">{importError}</p>}
                  <button 
                    onClick={handleAiImport}
                    disabled={isImporting || !importText.trim()}
                    className="w-full bg-charcoal text-white py-4 flex items-center justify-center gap-3 uppercase text-[10px] tracking-[0.3em] font-black hover:bg-gold transition-all disabled:opacity-30"
                  >
                    {isImporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    Importar com AI
                  </button>
               </div>
               
               <div className="p-6 bg-gold/5 border border-gold/10 rounded-sm">
                  <p className="text-[10px] uppercase tracking-[0.4em] font-black text-gold mb-2">Dica Pro</p>
                  <p className="text-[10px] text-gold/70 leading-relaxed font-bold italic">
                    O sistema processa múltiplos comentários em segundos.
                  </p>
               </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
               <div className="flex justify-between items-center px-2">
                  <h2 className="text-xs uppercase tracking-[0.3em] font-black text-charcoal/30">Comentários Publicados ({reviews.length})</h2>
               </div>
               
               <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 scrollbar-hide pb-20">
                  {reviews.map((review) => {
                    const isConfirming = deletingId === review.id;
                    return (
                      <div key={review.id} className={`bg-white p-6 border transition-all duration-300 rounded-sm shadow-sm group flex justify-between gap-6 ${isConfirming ? 'border-red-500/50 bg-red-50/10' : 'border-charcoal/5 hover:border-gold/30'}`}>
                         <div className="space-y-3 flex-grow">
                            <div className="flex items-center gap-4">
                               <div className="flex gap-0.5">
                                  {[...Array(5)].map((_, i) => <Star key={i} className={`w-2.5 h-2.5 ${i < review.rating ? 'fill-gold text-gold' : 'text-charcoal/10'}`} />)}
                               </div>
                               <span className="text-[9px] uppercase tracking-widest font-black text-charcoal/40">{review.date}</span>
                            </div>
                            <h4 className="font-serif text-lg">{review.author} <span className="text-xs font-sans text-charcoal/30 font-bold ml-2">• {review.nationality || 'Portugal'}</span></h4>
                            <p className="text-sm text-charcoal/60 italic leading-relaxed line-clamp-2">"{review.comment}"</p>
                         </div>
                         <div className="flex flex-col justify-start shrink-0">
                            <button 
                              onClick={() => handleDeleteClick(review.id)}
                              className={`
                                flex items-center gap-2 p-3 rounded-sm transition-all duration-300
                                ${isConfirming 
                                  ? 'bg-red-500 text-white shadow-lg animate-pulse' 
                                  : 'text-charcoal/10 hover:text-red-500 hover:bg-red-50'
                                }
                              `}
                              aria-label={isConfirming ? "Confirmar remoção" : "Remover comentário"}
                            >
                               {isConfirming ? (
                                 <>
                                   <span className="text-[9px] uppercase font-black tracking-widest">Certeza?</span>
                                   <AlertTriangle className="w-4 h-4" />
                                 </>
                               ) : (
                                 <Trash2 className="w-5 h-5" />
                               )}
                            </button>
                         </div>
                      </div>
                    );
                  })}
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
