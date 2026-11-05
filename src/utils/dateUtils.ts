/**
 * Dynamic Date Window Utilities for KRAFTWERK.RADAR
 * Dynamisches gleitendes Zeitfenster: 'Heute' ist eine echte dynamische Variable.
 * Täglich rückt das Zeitfenster um 1 Tag vor (heute bis heute + 2 Monate).
 */

export interface DynamicDateWindow {
  todayStr: string;        // YYYY-MM-DD
  twoWeeksStr: string;     // YYYY-MM-DD (+14 Tage)
  twoMonthsStr: string;    // YYYY-MM-DD (+2 Monate)
  todayLabel: string;      // z.B. "5. Nov 2026"
  twoWeeksLabel: string;   // z.B. "19. Nov 2026"
  twoMonthsLabel: string;  // z.B. "5. Jan 2027"
  monthSpanLabel: string;  // z.B. "Nov 2026 – Jan 2027"
}

export function getDynamicDateWindow(referenceDate: Date = new Date()): DynamicDateWindow {
  // Format as YYYY-MM-DD in Europe/Berlin
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Berlin',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const todayStr = formatter.format(referenceDate);

  // +14 Tage
  const twoWeeksDate = new Date(referenceDate);
  twoWeeksDate.setDate(twoWeeksDate.getDate() + 14);
  const twoWeeksStr = formatter.format(twoWeeksDate);

  // +2 Monate (Gleitendes Fenster)
  const twoMonthsDate = new Date(referenceDate);
  twoMonthsDate.setMonth(twoMonthsDate.getMonth() + 2);
  const twoMonthsStr = formatter.format(twoMonthsDate);

  // Lokalisierte deutsche Bezeichnungen
  const deDayMonthYear = new Intl.DateTimeFormat('de-DE', {
    timeZone: 'Europe/Berlin',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const deMonthYear = new Intl.DateTimeFormat('de-DE', {
    timeZone: 'Europe/Berlin',
    month: 'short',
    year: 'numeric',
  });

  const todayLabel = deDayMonthYear.format(referenceDate);
  const twoWeeksLabel = deDayMonthYear.format(twoWeeksDate);
  const twoMonthsLabel = deDayMonthYear.format(twoMonthsDate);
  const monthSpanLabel = `${deMonthYear.format(referenceDate)} – ${deMonthYear.format(twoMonthsDate)}`;

  return {
    todayStr,
    twoWeeksStr,
    twoMonthsStr,
    todayLabel,
    twoWeeksLabel,
    twoMonthsLabel,
    monthSpanLabel,
  };
}

/**
 * Prüft, ob ein Event in der Vergangenheit liegt (vor dem heutigen Kalendertag).
 */
export function isEventPast(eventDate: string, todayStr?: string): boolean {
  const currentToday = todayStr || getDynamicDateWindow().todayStr;
  return eventDate < currentToday;
}

/**
 * Prüft, ob ein Event im gültigen dynamischen Zeitfenster [heute, heute + 2 Monate] liegt.
 */
export function isEventInCurrentWindow(eventDate: string, window?: DynamicDateWindow): boolean {
  const win = window || getDynamicDateWindow();
  return eventDate >= win.todayStr && eventDate <= win.twoMonthsStr;
}
