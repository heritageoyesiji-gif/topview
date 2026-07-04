"use client";

import { useState } from "react";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const TIME_SLOTS = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM",
];

interface BookingCalendarProps {
  selectedDate: Date | null;
  selectedTime: string | null;
  onSelectDate: (d: Date) => void;
  onSelectTime: (t: string) => void;
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function BookingCalendar({
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
}: BookingCalendarProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [view, setView] = useState<Date>(startOfMonth(selectedDate ?? today));

  const year = view.getFullYear();
  const month = view.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Monday-based offset for the 1st of the month
  const firstOffset = (new Date(year, month, 1).getDay() + 6) % 7;
  const canGoPrev = view > startOfMonth(today);

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="bcal">
      <div className="bcal-head">
        <button
          type="button"
          className="bcal-nav"
          disabled={!canGoPrev}
          onClick={() => setView(new Date(year, month - 1, 1))}
          aria-label="Previous month"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <span className="bcal-month">{MONTHS[month]} {year}</span>
        <button
          type="button"
          className="bcal-nav"
          onClick={() => setView(new Date(year, month + 1, 1))}
          aria-label="Next month"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <div className="bcal-grid bcal-weekdays">
        {WEEKDAYS.map((w) => (
          <span key={w} className="bcal-wd">{w}</span>
        ))}
      </div>

      <div className="bcal-grid">
        {cells.map((d, i) => {
          if (d === null) return <span key={`e${i}`} className="bcal-empty" />;
          const cellDate = new Date(year, month, d);
          const past = cellDate < today;
          const selected = selectedDate ? isSameDay(cellDate, selectedDate) : false;
          const isToday = isSameDay(cellDate, today);
          return (
            <button
              key={`d${d}`}
              type="button"
              disabled={past}
              className={`bcal-day${selected ? " selected" : ""}${isToday ? " today" : ""}`}
              onClick={() => onSelectDate(cellDate)}
            >
              {d}
            </button>
          );
        })}
      </div>

      {selectedDate && (
        <div className="bcal-times">
          <span className="bcal-times-label">Available times</span>
          <div className="bcal-slots">
            {TIME_SLOTS.map((t) => (
              <button
                key={t}
                type="button"
                className={`bcal-slot${selectedTime === t ? " selected" : ""}`}
                onClick={() => onSelectTime(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
