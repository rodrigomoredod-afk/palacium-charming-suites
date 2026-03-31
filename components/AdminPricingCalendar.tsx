import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import type { Suite, SuitePriceRule } from '../types';
import { buildMonthGrid, effectiveNightlyRate, orderIsoRange } from '../lib/suitePricing';
import { formatIsoDatePt, getTodayIsoLocal } from '../lib/reservationUtils';

const WEEKDAYS_PT = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

export interface AdminPricingCalendarProps {
  suites: Suite[];
  rules: SuitePriceRule[];
  canEdit: boolean;
  onAddRule: (r: Omit<SuitePriceRule, 'id' | 'updatedAt'>) => void;
  onDeleteRule: (id: string) => void;
}

export const AdminPricingCalendar: React.FC<AdminPricingCalendarProps> = ({
  suites,
  rules,
  canEdit,
  onAddRule,
  onDeleteRule,
}) => {
  const now = new Date();
  const [view, setView] = useState(() => ({ y: now.getFullYear(), m: now.getMonth() }));
  const [suiteId, setSuiteId] = useState(() => suites[0]?.id ?? '');
  const [rangeStart, setRangeStart] = useState<string | null>(null);
  const [rangeEnd, setRangeEnd] = useState<string | null>(null);
  const [periodPrice, setPeriodPrice] = useState('');
  const [periodNote, setPeriodNote] = useState('');
  /** Suites que recebem o mesmo período/preço ao guardar (edição em massa). */
  const [bulkTargetIds, setBulkTargetIds] = useState<string[]>([]);

  useEffect(() => {
    if (suites.length && !suites.some((s) => s.id === suiteId)) {
      setSuiteId(suites[0].id);
    }
  }, [suites, suiteId]);

  useEffect(() => {
    if (suiteId && suites.some((s) => s.id === suiteId)) {
      setBulkTargetIds([suiteId]);
    }
  }, [suiteId, suites]);

  const grid = useMemo(() => buildMonthGrid(view.y, view.m), [view.y, view.m]);
  const monthLabel = useMemo(
    () =>
      new Intl.DateTimeFormat('pt-PT', { month: 'long', year: 'numeric' }).format(
        new Date(view.y, view.m, 1),
      ),
    [view.y, view.m],
  );

  const orderedRange = useMemo(() => {
    if (!rangeStart || !rangeEnd) return null;
    const [a, b] = orderIsoRange(rangeStart, rangeEnd);
    return { start: a, end: b };
  }, [rangeStart, rangeEnd]);

  const todayIso = getTodayIsoLocal();

  const isInSelection = (iso: string | null) => {
    if (!iso || !orderedRange) return false;
    return iso >= orderedRange.start && iso <= orderedRange.end;
  };

  const handleCellClick = (iso: string | null) => {
    if (!canEdit || !iso) return;
    if (!rangeStart || rangeEnd) {
      setRangeStart(iso);
      setRangeEnd(null);
    } else {
      setRangeEnd(iso);
    }
  };

  const clearSelection = () => {
    setRangeStart(null);
    setRangeEnd(null);
    setPeriodPrice('');
    setPeriodNote('');
  };

  const toggleBulkSuite = (id: string) => {
    setBulkTargetIds((prev) => {
      const has = prev.includes(id);
      if (has && prev.length <= 1) return prev;
      if (has) return prev.filter((x) => x !== id);
      return [...prev, id];
    });
  };

  const selectAllSuites = () => {
    setBulkTargetIds(suites.map((s) => s.id));
  };

  const selectOnlyViewedSuite = () => {
    if (suiteId) setBulkTargetIds([suiteId]);
  };

  const applyPeriod = () => {
    if (!canEdit || !orderedRange) return;
    const targets = bulkTargetIds.filter((id) => suites.some((s) => s.id === id));
    if (targets.length === 0) return;
    const price = parseFloat(periodPrice.replace(',', '.'));
    if (Number.isNaN(price) || price < 0) return;
    const nightly = Math.round(price * 100) / 100;
    const note = periodNote.trim() ? periodNote.trim() : undefined;
    for (const suiteIdApply of targets) {
      onAddRule({
        suiteId: suiteIdApply,
        startDate: orderedRange.start,
        endDate: orderedRange.end,
        nightlyPrice: nightly,
        ...(note ? { note } : {}),
      });
    }
    clearSelection();
  };

  const suiteRules = useMemo(
    () =>
      [...rules].filter((r) => r.suiteId === suiteId).sort((a, b) => b.startDate.localeCompare(a.startDate)),
    [rules, suiteId],
  );

  const shiftMonth = (delta: number) => {
    setView((v) => {
      const d = new Date(v.y, v.m + delta, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });
    clearSelection();
  };

  if (!suites.length) return null;

  const suite = suites.find((s) => s.id === suiteId) ?? suites[0];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif text-2xl text-charcoal">Calendário de tarifas</h3>
        <p className="mt-1 text-sm text-charcoal/50">
          Veja o preço por noite aplicável a cada dia (tarifa base da suite ou período sazonal).{' '}
          {canEdit
            ? 'Clique em dois dias para definir um intervalo, indique o valor por noite e escolha em que quartos aplicar (pode selecionar vários).'
            : 'Apenas visualização para este perfil.'}
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div className="min-w-[200px]">
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-charcoal">
            Suite
          </label>
          <select
            value={suiteId}
            onChange={(e) => {
              setSuiteId(e.target.value);
              clearSelection();
            }}
            className="w-full border border-charcoal/10 bg-bone p-3 text-sm outline-none focus:border-gold sm:max-w-md"
          >
            {suites.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} — base €{s.price}/noite
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-1 border border-charcoal/10 bg-bone px-2 py-1">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            className="p-2 text-charcoal/50 hover:text-gold"
            aria-label="Mês anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="min-w-[10rem] text-center font-serif text-sm capitalize text-charcoal">
            {monthLabel}
          </span>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            className="p-2 text-charcoal/50 hover:text-gold"
            aria-label="Mês seguinte"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[320px]">
          <div className="mb-1 grid grid-cols-7 gap-1">
            {WEEKDAYS_PT.map((d) => (
              <div
                key={d}
                className="py-2 text-center text-[9px] font-bold uppercase tracking-wider text-charcoal/40"
              >
                {d}
              </div>
            ))}
          </div>
          {grid.map((row, ri) => (
            <div key={ri} className="grid grid-cols-7 gap-1">
              {row.map((iso, ci) => {
                if (!iso) {
                  return <div key={ci} className="aspect-square min-h-[3.25rem]" />;
                }
                const rate = effectiveNightlyRate(suiteId, iso, suites, rules);
                const base = suite.price;
                const overridden = rate !== base;
                const selected = isInSelection(iso);
                const isToday = iso === todayIso;
                return (
                  <button
                    key={iso}
                    type="button"
                    disabled={!canEdit}
                    onClick={() => handleCellClick(iso)}
                    className={`flex min-h-[3.25rem] flex-col items-center justify-center gap-0.5 border p-1 text-center transition-colors ${
                      !canEdit ? 'cursor-default' : 'cursor-pointer hover:border-gold/60'
                    } ${
                      selected
                        ? 'border-gold bg-gold/10'
                        : isToday
                          ? 'border-charcoal/25 bg-bone'
                          : 'border-charcoal/10 bg-white'
                    }`}
                  >
                    <span className="text-[11px] font-bold tabular-nums text-charcoal">
                      {parseInt(iso.slice(8, 10), 10)}
                    </span>
                    <span
                      className={`text-[10px] font-semibold tabular-nums ${overridden ? 'text-gold' : 'text-charcoal/45'}`}
                    >
                      €{rate}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {canEdit && orderedRange && (
        <div className="space-y-3 rounded-sm border border-gold/30 bg-gold/5 p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gold">
            Período selecionado: {formatIsoDatePt(orderedRange.start)} — {formatIsoDatePt(orderedRange.end)}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-charcoal">
                € / noite (este intervalo)
              </label>
              <input
                type="number"
                min={0}
                step={1}
                value={periodPrice}
                onChange={(e) => setPeriodPrice(e.target.value)}
                placeholder={String(suite.price)}
                className="w-full border border-charcoal/10 bg-white p-3 text-sm outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-charcoal">
                Nota (opcional)
              </label>
              <input
                value={periodNote}
                onChange={(e) => setPeriodNote(e.target.value)}
                placeholder="Ex.: Época alta, Festa local…"
                className="w-full border border-charcoal/10 bg-white p-3 text-sm outline-none focus:border-gold"
              />
            </div>
          </div>
          <div className="space-y-2 border-t border-gold/15 pt-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-charcoal">
                Aplicar a (edição em massa)
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={selectAllSuites}
                  className="text-[9px] font-bold uppercase tracking-wider text-gold hover:underline"
                >
                  Todas as suites
                </button>
                <span className="text-charcoal/20">|</span>
                <button
                  type="button"
                  onClick={selectOnlyViewedSuite}
                  className="text-[9px] font-bold uppercase tracking-wider text-charcoal/50 hover:text-gold"
                >
                  Só a suite em vista
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {suites.map((s) => (
                <label
                  key={s.id}
                  className="flex cursor-pointer items-center gap-2 text-xs text-charcoal"
                >
                  <input
                    type="checkbox"
                    checked={bulkTargetIds.includes(s.id)}
                    onChange={() => toggleBulkSuite(s.id)}
                    className="h-3.5 w-3.5 rounded border-charcoal/30 text-gold focus:ring-gold"
                  />
                  <span className="font-medium">
                    {s.id} · €{s.price}
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={applyPeriod}
              disabled={bulkTargetIds.length === 0}
              className="bg-charcoal px-6 py-2 text-[10px] font-black uppercase tracking-widest text-white hover:bg-gold disabled:cursor-not-allowed disabled:opacity-40"
            >
              Guardar período
              {bulkTargetIds.length > 1 ? ` (${bulkTargetIds.length} suites)` : ''}
            </button>
            <button
              type="button"
              onClick={clearSelection}
              className="border border-charcoal/15 px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-charcoal/60 hover:border-gold/40"
            >
              Limpar seleção
            </button>
          </div>
        </div>
      )}

      <div>
        <h4 className="mb-2 text-[10px] font-bold uppercase tracking-widest text-charcoal/40">
          Períodos guardados — {suite.name}
        </h4>
        {suiteRules.length === 0 ? (
          <p className="text-sm text-charcoal/40">Nenhum período específico; usa-se sempre a tarifa base (€{suite.price}).</p>
        ) : (
          <ul className="divide-y divide-charcoal/10 border border-charcoal/10">
            {suiteRules.map((r) => (
              <li
                key={r.id}
                className="flex flex-col gap-2 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-charcoal">
                    {formatIsoDatePt(r.startDate)} → {formatIsoDatePt(r.endDate)}
                  </p>
                  <p className="text-xs text-charcoal/50">
                    €{r.nightlyPrice}/noite
                    {r.note ? ` · ${r.note}` : ''}
                  </p>
                </div>
                {canEdit && (
                  <button
                    type="button"
                    onClick={() => onDeleteRule(r.id)}
                    className="self-start rounded-sm p-2 text-charcoal/30 hover:bg-red-50 hover:text-red-600 sm:self-center"
                    aria-label="Remover período"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
