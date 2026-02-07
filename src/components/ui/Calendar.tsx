import React, { useState, useCallback, useMemo } from "react";
import {
  IconCalendarEvent,
  IconChevronLeft,
  IconChevronRight,
  IconPlus,
  IconTrash,
  IconClock,
  IconCalendarDue,
  IconX,
} from "@tabler/icons-react";

// --- Types ---
interface CalendarEvent {
  event: string;
  time?: string;
  color?: string;
}

type EventsMap = { [date: string]: CalendarEvent[] };

// --- Helpers ---
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function formatDateStr(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function getTodayStr() {
  const t = new Date();
  return formatDateStr(t.getFullYear(), t.getMonth(), t.getDate());
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const EVENT_COLORS = [
  { label: "Blue", value: "blue", dot: "bg-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20", border: "border-blue-200 dark:border-blue-800" },
  { label: "Green", value: "green", dot: "bg-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20", border: "border-emerald-200 dark:border-emerald-800" },
  { label: "Red", value: "red", dot: "bg-red-500", bg: "bg-red-50 dark:bg-red-900/20", border: "border-red-200 dark:border-red-800" },
  { label: "Purple", value: "purple", dot: "bg-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20", border: "border-purple-200 dark:border-purple-800" },
  { label: "Orange", value: "orange", dot: "bg-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20", border: "border-orange-200 dark:border-orange-800" },
  { label: "Teal", value: "teal", dot: "bg-teal-500", bg: "bg-teal-50 dark:bg-teal-900/20", border: "border-teal-200 dark:border-teal-800" },
];

function getColorConfig(color?: string) {
  return EVENT_COLORS.find((c) => c.value === color) || EVENT_COLORS[0];
}

// --- Component ---
const Calendar: React.FC = () => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string>(getTodayStr());
  const [events, setEvents] = useState<EventsMap>({});
  const [highlightDates, setHighlightDates] = useState<string[]>([]);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [newEventText, setNewEventText] = useState("");
  const [newEventTime, setNewEventTime] = useState("");
  const [newEventColor, setNewEventColor] = useState("blue");

  // --- Navigation ---
  const goToPrevMonth = useCallback(() => {
    setMonth((m) => {
      if (m === 0) {
        setYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
  }, []);

  const goToNextMonth = useCallback(() => {
    setMonth((m) => {
      if (m === 11) {
        setYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
  }, []);

  const goToToday = useCallback(() => {
    const t = new Date();
    setYear(t.getFullYear());
    setMonth(t.getMonth());
    setSelectedDate(getTodayStr());
  }, []);

  // --- Events ---
  const addEvent = useCallback(
    (date: string, event: string, time?: string, color?: string) => {
      if (!date || !event.trim()) return;
      setEvents((prev) => ({
        ...prev,
        [date]: [
          ...(prev[date] || []),
          { event: event.trim(), time: time || undefined, color: color || "blue" },
        ],
      }));
    },
    []
  );

  const removeEvent = useCallback((date: string, eventText: string) => {
    setEvents((prev) => {
      const updated = { ...prev };
      updated[date] = (updated[date] || []).filter((ev) => ev.event !== eventText);
      if (updated[date].length === 0) delete updated[date];
      return updated;
    });
  }, []);

  const handleAddEvent = useCallback(() => {
    if (!selectedDate || !newEventText.trim()) return;
    addEvent(selectedDate, newEventText, newEventTime, newEventColor);
    setNewEventText("");
    setNewEventTime("");
    setNewEventColor("blue");
    setShowModal(false);
  }, [selectedDate, newEventText, newEventTime, newEventColor, addEvent]);

  // --- Expose chat control ---
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    type ControlParams = {
      year?: number;
      month?: number;
      highlightDates?: string[];
      selectDate?: string;
      addEvent?: { date: string; event: string; time?: string; color?: string };
      removeEvent?: { date: string; event: string };
      navigateToToday?: boolean;
    };

    const win = window as Window &
      typeof globalThis & {
        handleCalendarControl?: (params: ControlParams) => void;
        getEventsForDate?: (date: string) => CalendarEvent[];
      };

    win.handleCalendarControl = (params: ControlParams) => {
      if (params.navigateToToday) {
        const t = new Date();
        setYear(t.getFullYear());
        setMonth(t.getMonth());
        setSelectedDate(getTodayStr());
        return;
      }
      if (typeof params.year === "number") setYear(params.year);
      if (typeof params.month === "number") setMonth(params.month);
      if (Array.isArray(params.highlightDates)) setHighlightDates(params.highlightDates);
      if (typeof params.selectDate === "string") setSelectedDate(params.selectDate);
      if (Array.isArray(params.highlightDates) && params.highlightDates.length === 1) {
        setSelectedDate(params.highlightDates[0]);
      }
      if (
        params.addEvent &&
        typeof params.addEvent.date === "string" &&
        typeof params.addEvent.event === "string" &&
        params.addEvent.event.trim()
      ) {
        const { date, event, time, color } = params.addEvent;
        setEvents((prev) => ({
          ...prev,
          [date]: [
            ...(prev[date] || []),
            { event: event.trim(), time: time || undefined, color: color || "blue" },
          ],
        }));
        setSelectedDate(date);
        // Navigate to the month/year of the event
        const parts = date.split("-");
        if (parts.length === 3) {
          setYear(parseInt(parts[0]));
          setMonth(parseInt(parts[1]) - 1);
        }
      }
      if (
        params.removeEvent &&
        typeof params.removeEvent.date === "string" &&
        typeof params.removeEvent.event === "string" &&
        params.removeEvent.event.trim()
      ) {
        const { date, event } = params.removeEvent;
        setEvents((prev) => {
          const updated = { ...prev };
          updated[date] = (updated[date] || []).filter((ev) => ev.event !== event.trim());
          if (updated[date].length === 0) delete updated[date];
          return updated;
        });
        setSelectedDate(date);
      }
    };

    win.getEventsForDate = (date: string) => {
      return events[date] || [];
    };

    return () => {
      delete win.handleCalendarControl;
      delete win.getEventsForDate;
    };
  }, [events]);

  // --- Computed ---
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const todayStr = getTodayStr();

  const selectedDateEvents = useMemo(
    () => (selectedDate ? events[selectedDate] || [] : []),
    [events, selectedDate]
  );

  // Count total events this month
  const monthEventCount = useMemo(() => {
    let count = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const ds = formatDateStr(year, month, d);
      if (events[ds]) count += events[ds].length;
    }
    return count;
  }, [events, year, month, daysInMonth]);

  // Format selected date for display
  const selectedDateDisplay = useMemo(() => {
    if (!selectedDate) return "";
    const d = new Date(selectedDate + "T00:00:00");
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [selectedDate]);

  return (
    <div className="h-full w-full flex flex-col bg-white dark:bg-gray-900 overflow-hidden">
      {/* ===== Header ===== */}
      <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="flex items-center justify-between px-6 py-3">
          {/* Left: Icon + Month/Year */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
              <IconCalendarEvent className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-gray-900 dark:text-white leading-tight">
                {MONTH_NAMES[month]} {year}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {monthEventCount} event{monthEventCount !== 1 ? "s" : ""} this month
              </p>
            </div>
          </div>

          {/* Right: Navigation */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={goToToday}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all duration-200 border border-blue-200 dark:border-blue-800"
            >
              Today
            </button>
            <button
              onClick={goToPrevMonth}
              className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 text-gray-600 dark:text-gray-300"
              aria-label="Previous month"
            >
              <IconChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goToNextMonth}
              className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 text-gray-600 dark:text-gray-300"
              aria-label="Next month"
            >
              <IconChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ===== Body ===== */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
        {/* Calendar Grid */}
        <div className="flex-1 flex flex-col p-4 overflow-auto min-w-0">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {DAY_LABELS.map((d, i) => (
              <div
                key={d}
                className={`text-center text-xs font-semibold py-1.5 rounded-md ${
                  i === 0 || i === 6
                    ? "text-red-400 dark:text-red-500"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-1 flex-1">
            {/* Empty cells for offset */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={"empty-" + i} className="min-h-[52px]" />
            ))}

            {/* Day buttons */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = formatDateStr(year, month, day);
              const isSelected = selectedDate === dateStr;
              const isHighlighted = highlightDates.includes(dateStr);
              const isToday = dateStr === todayStr;
              const dayOfWeek = (firstDay + i) % 7;
              const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
              const dayEvents = events[dateStr] || [];
              const hasEvents = dayEvents.length > 0;

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`
                    relative flex flex-col items-center justify-start pt-1.5 min-h-[52px] rounded-xl
                    transition-all duration-150 ease-out group
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400
                    ${
                      isSelected
                        ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25 scale-[1.02]"
                        : isHighlighted
                        ? "bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700"
                        : isToday
                        ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent"
                    }
                  `}
                >
                  <span
                    className={`
                      text-sm font-semibold leading-none
                      ${isSelected ? "text-white" : ""}
                      ${!isSelected && isToday ? "text-blue-600 dark:text-blue-400" : ""}
                      ${!isSelected && !isToday && isWeekend ? "text-red-400 dark:text-red-500" : ""}
                      ${!isSelected && !isToday && !isWeekend ? "text-gray-700 dark:text-gray-200" : ""}
                    `}
                  >
                    {day}
                  </span>

                  {/* Event dots */}
                  {hasEvents && (
                    <div className="flex items-center gap-0.5 mt-1">
                      {dayEvents.slice(0, 3).map((ev, idx) => {
                        const colorCfg = getColorConfig(ev.color);
                        return (
                          <span
                            key={idx}
                            className={`w-1.5 h-1.5 rounded-full ${
                              isSelected ? "bg-white/80" : colorCfg.dot
                            }`}
                          />
                        );
                      })}
                      {dayEvents.length > 3 && (
                        <span
                          className={`text-[9px] font-bold ${
                            isSelected ? "text-white/70" : "text-gray-400"
                          }`}
                        >
                          +{dayEvents.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ===== Events Sidebar ===== */}
        <div className="w-full lg:w-80 xl:w-96 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-800 flex flex-col bg-gray-50 dark:bg-gray-950 overflow-hidden">
          {selectedDate ? (
            <>
              {/* Sidebar header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {selectedDateDisplay}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {selectedDateEvents.length} event{selectedDateEvents.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-500 text-white shadow-sm hover:bg-blue-600 active:bg-blue-700 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                >
                  <IconPlus className="w-3.5 h-3.5" />
                  Add
                </button>
              </div>

              {/* Events list */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {selectedDateEvents.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-600">
                    <IconCalendarDue className="w-10 h-10 mb-2 opacity-50" />
                    <p className="text-sm font-medium">No events</p>
                    <p className="text-xs mt-1">Click &quot;Add&quot; to create one</p>
                  </div>
                ) : (
                  selectedDateEvents.map((ev, i) => {
                    const colorCfg = getColorConfig(ev.color);
                    return (
                      <div
                        key={i}
                        className={`
                          group/event flex items-start gap-3 px-4 py-3 rounded-xl border
                          ${colorCfg.bg} ${colorCfg.border}
                          transition-all duration-200 hover:shadow-md
                        `}
                      >
                        {/* Color indicator */}
                        <div className={`w-1 self-stretch rounded-full ${colorCfg.dot} mt-0.5 flex-shrink-0`} />

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-100 leading-snug">
                            {ev.event}
                          </p>
                          {ev.time && (
                            <div className="flex items-center gap-1 mt-1">
                              <IconClock className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {ev.time}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Delete button */}
                        <button
                          onClick={() => removeEvent(selectedDate, ev.event)}
                          className="opacity-0 group-hover/event:opacity-100 p-1 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 transition-all duration-200"
                          title="Remove event"
                        >
                          <IconTrash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-gray-600 p-6">
              <IconCalendarEvent className="w-10 h-10 mb-2 opacity-50" />
              <p className="text-sm font-medium">Select a date</p>
              <p className="text-xs mt-1">to view or add events</p>
            </div>
          )}
        </div>
      </div>

      {/* ===== Add Event Modal ===== */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
        >
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 border border-gray-200 dark:border-gray-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <div>
                <h3 className="font-bold text-base text-gray-900 dark:text-white">
                  New Event
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {selectedDateDisplay}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <IconX className="w-4 h-4" />
              </button>
            </div>

            {/* Modal body */}
            <div className="px-6 py-4 space-y-4">
              {/* Event name */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                  Event Name
                </label>
                <input
                  type="text"
                  value={newEventText}
                  onChange={(e) => setNewEventText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddEvent();
                  }}
                  placeholder="e.g., Team meeting, Patient follow-up..."
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                  autoFocus
                />
              </div>

              {/* Time */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                  Time (optional)
                </label>
                <input
                  type="time"
                  value={newEventTime}
                  onChange={(e) => setNewEventTime(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                />
              </div>

              {/* Color picker */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                  Color
                </label>
                <div className="flex items-center gap-2">
                  {EVENT_COLORS.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setNewEventColor(c.value)}
                      className={`
                        w-7 h-7 rounded-full ${c.dot} transition-all duration-150
                        ${
                          newEventColor === c.value
                            ? "ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 ring-gray-400 scale-110"
                            : "opacity-60 hover:opacity-100 hover:scale-105"
                        }
                      `}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-semibold rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEvent}
                disabled={!newEventText.trim()}
                className="px-5 py-2 text-sm font-semibold rounded-xl bg-blue-500 text-white shadow-sm hover:bg-blue-600 active:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                Add Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
