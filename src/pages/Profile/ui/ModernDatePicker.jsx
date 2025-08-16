import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

function pad(n) {
  return String(n).padStart(2, '0');
}

function toISO(date) {
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  return `${y}-${m}-${d}`;
}

function fromISO(iso) {
  if (!iso) return null;
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function formatDisplay(iso) {
  const d = fromISO(iso);
  if (!d) return '';
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

function clampISO(iso, min, max) {
  if (!iso) return iso;
  const t = iso;
  if (min && t < min) return min;
  if (max && t > max) return max;
  return t;
}

export default function ModernDatePicker({ value, onChange, min = '1900-01-01', max, placeholder = 'dd/mm/aaaa' }) {
  const todayISO = useMemo(() => toISO(new Date()), []);
  const maxISO = max || todayISO;
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(formatDisplay(value));
  const containerRef = useRef(null);

  const initialDate = fromISO(value) || new Date();
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth()); // 0..11

  useEffect(() => {
    setInputValue(formatDisplay(value));
    const d = fromISO(value);
    if (d) {
      setViewYear(d.getFullYear());
      setViewMonth(d.getMonth());
    }
  }, [value]);

  useEffect(() => {
    function onDocClick(e) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    if (open) {
      document.addEventListener('mousedown', onDocClick);
      document.addEventListener('keydown', onKey);
      return () => {
        document.removeEventListener('mousedown', onDocClick);
        document.removeEventListener('keydown', onKey);
      };
    }
  }, [open]);

  const startOfMonth = new Date(viewYear, viewMonth, 1);
  const endOfMonth = new Date(viewYear, viewMonth + 1, 0);
  const startWeekday = (startOfMonth.getDay() + 6) % 7; // Monday=0
  const days = endOfMonth.getDate();
  const weeks = [];
  let current = 1 - startWeekday;
  while (current <= days) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(viewYear, viewMonth, current);
      const inMonth = dayDate.getMonth() === viewMonth;
      const iso = toISO(dayDate);
      week.push({ inMonth, iso, date: dayDate });
      current++;
    }
    weeks.push(week);
  }

  function prevMonth() {
    const m = viewMonth - 1;
    if (m < 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth(m);
    }
  }
  function nextMonth() {
    const m = viewMonth + 1;
    if (m > 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth(m);
    }
  }

  function handlePick(iso) {
    const clamped = clampISO(iso, min, maxISO);
    onChange?.(clamped);
    setOpen(false);
  }

  function handleInputBlur() {
    // Accept dd/mm/yyyy or yyyy-mm-dd
    const raw = inputValue.trim();
    if (!raw) {
      onChange?.('');
      return;
    }
    let yy, mm, dd;
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(raw)) {
      const [d, m, y] = raw.split('/').map(Number);
      yy = y; mm = m; dd = d;
    } else if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
      const [y, m, d] = raw.split('-').map(Number);
      yy = y; mm = m; dd = d;
    } else {
      setInputValue(formatDisplay(value));
      return;
    }
    const date = new Date(yy, (mm || 1) - 1, dd || 1);
    if (isNaN(date.getTime())) {
      setInputValue(formatDisplay(value));
      return;
    }
    const iso = toISO(date);
    const clamped = clampISO(iso, min, maxISO);
    setInputValue(formatDisplay(clamped));
    onChange?.(clamped);
  }

  const selectedISO = value;
  const selected = fromISO(selectedISO);
  const isSelected = (iso) => selectedISO && iso === selectedISO;
  const isToday = (iso) => iso === todayISO;
  const isDisabled = (iso) => (min && iso < min) || (maxISO && iso > maxISO);

  const monthNames = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  const dow = ['S','T','Q','Q','S','S','D']; // Mon..Sun initials

  return (
    <div ref={containerRef} className="relative">
      <div className="mt-1 bg-gradient-to-r from-indigo-500/60 via-purple-500/60 to-pink-500/60 p-[2px] rounded-xl shadow-sm">
        <div
          role="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className="w-full relative flex items-center rounded-xl bg-white/90 backdrop-blur px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-200 hover:bg-white/95 cursor-text"
        >
          <CalendarIcon className="w-5 h-5 text-indigo-600 mr-2" />
          <input
            type="text"
            aria-label="Data de nascimento"
            value={inputValue}
            placeholder={placeholder}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleInputBlur}
            onFocus={() => setOpen(true)}
            className="flex-1 bg-transparent border-0 focus:ring-0 text-gray-900 placeholder-gray-400"
            readOnly={false}
          />
        </div>
      </div>

      {open && (
        <div className="absolute z-50 mt-2 w-80 bg-white/95 backdrop-blur rounded-2xl shadow-2xl border border-white/50 p-4">
          <div className="flex items-center justify-between mb-2">
            <button type="button" onClick={prevMonth} className="p-1 rounded hover:bg-gray-100">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="text-sm font-medium text-gray-800">
              {monthNames[viewMonth]} {viewYear}
            </div>
            <button type="button" onClick={nextMonth} className="p-1 rounded hover:bg-gray-100">
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-gray-500 mb-1">
            {dow.map((d) => (
              <div key={d} className="py-1">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {weeks.map((week, wi) => (
              <React.Fragment key={wi}>
                {week.map((cell) => {
                  const d = cell.date.getDate();
                  const iso = cell.iso;
                  const selectedCls = isSelected(iso) ? 'bg-indigo-600 text-white' : '';
                  const todayCls = isToday(iso) && !isSelected(iso) ? 'ring-1 ring-indigo-400' : '';
                  const inMonthCls = cell.inMonth ? 'text-gray-800' : 'text-gray-300';
                  const disabled = isDisabled(iso) || !cell.inMonth;
                  return (
                    <button
                      type="button"
                      key={iso}
                      disabled={disabled}
                      onClick={() => handlePick(iso)}
                      className={`h-9 rounded-lg text-sm ${inMonthCls} ${selectedCls} ${todayCls} hover:bg-indigo-50 disabled:opacity-40 disabled:cursor-not-allowed`}
                    >
                      {d}
                    </button>
                  );
                })}
              </React.Fragment>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
            <div>
              <span className="mr-2">Min: {formatDisplay(min)}</span>
              <span>Max: {formatDisplay(maxISO)}</span>
            </div>
            <button
              type="button"
              onClick={() => handlePick(todayISO)}
              className="px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 text-gray-700"
            >
              Hoje
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
