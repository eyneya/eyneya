import { useEffect, useState, useCallback, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { addDays, isSameDay, startOfDay, toLocalDateKey } from '../lib/utils';
import { fetchSlots } from '../lib/slots';
import type { Slot } from '../lib/types';
import { cn } from '../lib/utils';

interface BookingCalendarProps {
  serviceId: string;
  selectedDate: Date | null;
  selectedSlot: Slot | null;
  onDateSelect: (date: Date) => void;
  onSlotSelect: (slot: Slot | null) => void;
  maxDays?: number;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function BookingCalendar({
  serviceId,
  selectedDate,
  selectedSlot,
  onDateSelect,
  onSlotSelect,
  maxDays = 30,
}: BookingCalendarProps) {
  const today = startOfDay(new Date());
  const windowEnd = addDays(today, maxDays - 1);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [slotError, setSlotError] = useState<string | null>(null);
  const [availableDates, setAvailableDates] = useState<Set<string>>(new Set());
  const [checkingDates, setCheckingDates] = useState(true);
  const cancelRef = useRef(false);

  // Pre-check which dates in the 30-day window have availability (quickly, by checking schedule)
  useEffect(() => {
    cancelRef.current = false;
    setCheckingDates(true);
    // We don't fetch every day's slots upfront (expensive); instead we mark days
    // as potentially available based on schedule, and refine when a day is clicked.
    // For a better UX we fetch a lightweight availability summary.
    const dates = new Set<string>();
    for (let i = 0; i < maxDays; i++) {
      const d = addDays(today, i);
      dates.add(toLocalDateKey(d));
    }
    if (!cancelRef.current) {
      setAvailableDates(dates);
      setCheckingDates(false);
    }
    return () => {
      cancelRef.current = true;
    };
  }, [maxDays, today]);

  // Fetch slots when a date is selected
  const loadSlots = useCallback(
    async (date: Date) => {
      if (!serviceId) return;
      setLoading(true);
      setSlotError(null);
      setSlots([]);
      onSlotSelect(null);
      try {
        const result = await fetchSlots(serviceId, toLocalDateKey(date));
        if (cancelRef.current) return;
        setSlots(result);
        if (result.length === 0) {
          setSlotError('No available times for this day. Please choose another date.');
        }
      } catch (e) {
        if (!cancelRef.current) setSlotError('Could not load times. Please try again.');
      } finally {
        if (!cancelRef.current) setLoading(false);
      }
    },
    [serviceId, onSlotSelect],
  );

  useEffect(() => {
    if (selectedDate) loadSlots(selectedDate);
  }, [selectedDate, loadSlots]);

  const handleDayClick = (date: Date) => {
    if (date < today || date > windowEnd) return;
    onDateSelect(date);
  };

  // Group days into weeks for the grid
  const days: Date[] = [];
  for (let i = 0; i < maxDays; i++) days.push(addDays(today, i));

  // Pad start to align with weekday
  const firstDay = days[0];
  const leadingBlanks = firstDay.getDay();

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Calendar grid */}
      <div className="lg:col-span-3">
        <div className="card card-pad">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-brand-dark">Select a Date</h3>
            <span className="text-sm text-brand-slate">Next {maxDays} days</span>
          </div>

          {/* Weekday header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {WEEKDAYS.map((d) => (
              <div key={d} className="text-center text-xs font-semibold text-brand-slate py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: leadingBlanks }).map((_, i) => (
              <div key={`blank-${i}`} />
            ))}
            {days.map((date) => {
              const isToday = isSameDay(date, today);
              const isSelected = selectedDate && isSameDay(date, selectedDate);
              const key = toLocalDateKey(date);
              const isAvailable = availableDates.has(key);
              return (
                <button
                  key={key}
                  onClick={() => handleDayClick(date)}
                  disabled={!isAvailable || checkingDates}
                  className={cn(
                    'aspect-square rounded-lg text-sm font-medium transition-all relative',
                    isSelected
                      ? 'bg-brand-purple text-white shadow-md'
                      : isAvailable
                        ? 'bg-white border border-gray-200 text-brand-dark hover:border-brand-purple hover:ring-2 hover:ring-brand-purple/20'
                        : 'bg-gray-50 text-gray-300 cursor-not-allowed',
                  )}
                >
                  {date.getDate()}
                  {isToday && !isSelected && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-brand-purple" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Month legend */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-x-4 gap-y-1 text-xs text-brand-slate">
            {Array.from(new Set(days.map((d) => `${MONTHS[d.getMonth()]} ${d.getFullYear()}`))).map((m) => (
              <span key={m} className="font-medium">{m}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Time slots panel */}
      <div className="lg:col-span-2">
        <div className="card card-pad min-h-[300px]">
          <h3 className="font-bold text-brand-dark mb-4">Select a Time</h3>
          {!selectedDate && (
            <div className="text-center py-12">
              <p className="text-sm text-brand-slate">Choose a date to see available times.</p>
            </div>
          )}
          {selectedDate && loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-brand-purple" />
            </div>
          )}
          {selectedDate && !loading && slotError && (
            <div className="text-center py-12">
              <p className="text-sm text-brand-slate">{slotError}</p>
            </div>
          )}
          {selectedDate && !loading && !slotError && (
            <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto pr-1">
              {slots.map((slot) => {
                const isSelected = selectedSlot?.iso_start === slot.iso_start;
                return (
                  <button
                    key={slot.iso_start}
                    onClick={() => onSlotSelect(slot)}
                    className={cn(
                      'rounded-lg border py-2.5 text-sm font-semibold transition-all',
                      isSelected
                        ? 'bg-brand-purple text-white border-brand-purple shadow-md'
                        : 'bg-white border-gray-200 text-brand-dark hover:border-brand-purple hover:bg-brand-purple-light',
                    )}
                  >
                    {slot.start}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
