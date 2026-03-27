import React, { useEffect } from 'react';
import { X, Check, ArrowRight } from 'lucide-react';
import { Suite, Locale } from '../types';
import { getSuiteDetails } from '../suiteDetails';

interface SuiteDetailsDrawerProps {
  suite: Suite | null;
  locale: Locale;
  isOpen: boolean;
  onClose: () => void;
  onBook: () => void;
}

const SuiteDetailsDrawer: React.FC<SuiteDetailsDrawerProps> = ({
  suite,
  locale,
  isOpen,
  onClose,
  onBook,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen || !suite) return null;

  const details = getSuiteDetails(suite.id);
  const content = locale === 'pt' ? details?.pt : details?.en;
  const gallery = details?.gallery?.length ? details.gallery : [suite.image];

  return (
    <div className="fixed inset-0 z-[220]">
      <button
        type="button"
        aria-label={locale === 'pt' ? 'Fechar detalhes' : 'Close details'}
        onClick={onClose}
        className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm"
      />

      <aside className="absolute right-0 top-0 h-full w-full md:w-[640px] bg-bone shadow-2xl overflow-y-auto">
        <div className="sticky top-0 z-10 bg-bone/95 backdrop-blur-sm border-b border-charcoal/10 px-5 md:px-8 py-4 md:py-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-gold font-black">
              {locale === 'pt' ? 'Detalhes da Suíte' : 'Suite Details'}
            </p>
            <h3 className="font-serif text-xl md:text-3xl text-charcoal mt-1">{suite.name}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-sm hover:bg-charcoal/5 transition-colors"
            aria-label={locale === 'pt' ? 'Fechar' : 'Close'}
          >
            <X className="w-6 h-6 text-charcoal/60" />
          </button>
        </div>

        <div className="px-5 md:px-8 py-6 md:py-8 space-y-8">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-white border border-charcoal/10 p-3">
              <p className="text-[9px] uppercase tracking-widest text-charcoal/40 font-bold">
                {locale === 'pt' ? 'Desde' : 'From'}
              </p>
              <p className="font-serif text-2xl text-gold">€{suite.price}</p>
            </div>
            <div className="bg-white border border-charcoal/10 p-3">
              <p className="text-[9px] uppercase tracking-widest text-charcoal/40 font-bold">
                {locale === 'pt' ? 'Capacidade' : 'Guests'}
              </p>
              <p className="font-serif text-2xl text-charcoal">{suite.adults}</p>
            </div>
            <div className="bg-white border border-charcoal/10 p-3">
              <p className="text-[9px] uppercase tracking-widest text-charcoal/40 font-bold">
                {locale === 'pt' ? 'Área' : 'Area'}
              </p>
              <p className="font-serif text-2xl text-charcoal">{suite.area}</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.28em] text-gold font-black">
              {locale === 'pt' ? 'Ideal para' : 'Ideal for'}
            </p>
            <p className="text-charcoal/70 leading-relaxed">{content?.idealFor ?? suite.description}</p>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] uppercase tracking-[0.28em] text-gold font-black">
              {locale === 'pt' ? 'Incluído' : 'Included'}
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(content?.included ?? []).map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-charcoal/70">
                  <Check className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] uppercase tracking-[0.28em] text-gold font-black">
              {locale === 'pt' ? 'Especificações' : 'Specifications'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(content?.specs ?? []).map((spec) => (
                <div key={`${spec.label}-${spec.value}`} className="bg-white border border-charcoal/10 p-3">
                  <p className="text-[9px] uppercase tracking-widest text-charcoal/40 font-bold">{spec.label}</p>
                  <p className="text-charcoal mt-1">{spec.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] uppercase tracking-[0.28em] text-gold font-black">
              {locale === 'pt' ? 'Políticas' : 'Policies'}
            </p>
            <ul className="space-y-2">
              {(content?.policies ?? []).map((policy) => (
                <li key={policy} className="text-sm text-charcoal/70 leading-relaxed">
                  - {policy}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] uppercase tracking-[0.28em] text-gold font-black">
              {locale === 'pt' ? 'Galeria' : 'Gallery'}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {gallery.map((imageSrc, index) => (
                <div key={`${imageSrc}-${index}`} className="aspect-[4/3] overflow-hidden bg-charcoal/5">
                  <img
                    src={imageSrc}
                    alt={`${suite.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-bone/95 backdrop-blur-sm border-t border-charcoal/10 p-4 md:p-5 flex gap-3">
          <button
            type="button"
            onClick={onBook}
            className="flex-1 bg-gold text-white py-4 uppercase text-[10px] tracking-[0.2em] font-black hover:bg-charcoal transition-colors flex items-center justify-center gap-2"
          >
            {locale === 'pt' ? 'Reservar esta Suíte' : 'Book this Suite'}
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 border border-charcoal/20 text-charcoal uppercase text-[10px] tracking-[0.16em] font-bold hover:bg-charcoal hover:text-white transition-colors"
          >
            {locale === 'pt' ? 'Fechar' : 'Close'}
          </button>
        </div>
      </aside>
    </div>
  );
};

export default SuiteDetailsDrawer;
