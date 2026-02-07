// Calendar control tool for Tambo AI integration
export async function calendarControlTool({
  year,
  month,
  highlightDates,
  addEvent,
  removeEvent,
  selectDate,
  navigateToToday,
}: {
  year?: number;
  month?: number;
  highlightDates?: string[];
  addEvent?: { date: string; event: string; time?: string; color?: string };
  removeEvent?: { date: string; event: string };
  selectDate?: string;
  navigateToToday?: boolean;
}) {
  type CalendarWindow = Window &
    typeof globalThis & {
      handleCalendarControl?: (params: {
        year?: number;
        month?: number;
        highlightDates?: string[];
        addEvent?: { date: string; event: string; time?: string; color?: string };
        removeEvent?: { date: string; event: string };
        selectDate?: string;
        navigateToToday?: boolean;
      }) => void;
    };
  const win = window as CalendarWindow;
  if (
    typeof window !== "undefined" &&
    typeof win.handleCalendarControl === "function"
  ) {
    win.handleCalendarControl({
      year,
      month,
      highlightDates,
      addEvent,
      removeEvent,
      selectDate,
      navigateToToday,
    });
    return { success: true };
  }
  return { success: false, error: "Calendar component not mounted." };
}
