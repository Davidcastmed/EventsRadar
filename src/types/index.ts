export type DoorStrictness = 'Streng' | 'Moderat' | 'Offen' | 'Estricta' | 'Moderada' | 'Abierta';
export type PhotoPolicy = 'Kamera abgeklebt' | 'Strikt verboten' | 'Diskret / Erlaubt' | 'Cámaras con pegatinas' | 'Estrictamente Prohibido' | 'Discreto / Permitido';
export type PaymentMethod = 'Nur Barzahlung' | 'Nur Kartenzahlung' | 'Bar & Karte' | 'Solo Efectivo' | 'Solo Tarjeta' | 'Efectivo y Tarjeta';

export type City = 'Hamburg' | 'Berlin' | 'Wien' | 'Köln';

export interface Club {
  id: string;
  name: string;
  aka?: string;
  city?: City | string;
  address: string;
  neighborhood: string;
  district?: string;
  postalCode?: string;
  coordinates: {
    lat: number;
    lng: number;
  };

  // Neues Standard-JSON Schema für Clubs
  description?: string;
  typicalGenres?: string[];
  website?: string;
  hasOutdoor?: boolean;
  publicTransit?: string;
  entryAvg?: string;
  badge?: string;
  createdBy?: string;
  createdAt?: string;

  // Zero-Halluzinations-Tracking für Clubs
  missingAttributes?: string[];
  missingNotice?: string;
  searchSuggestions?: string[];

  // Bestehende Felder für Abwärtskompatibilität (immer durch normalizeClub initialisiert)
  transit: {
    station: string;
    lines: string[];
    walkMinutes: number;
    directions: string;
  };
  soundSystem: string;
  vibe: string;
  history: string;
  doorPolicy: {
    strictness: DoorStrictness;
    dressCode: string;
    tips: string;
    rejectionRisk: string;
  };
  photoPolicy: PhotoPolicy;
  awarenessPolicy: string;
  minimumAge: number;
  paymentMethod: PaymentMethod;
  websiteUrl: string;
  residentAdvisorUrl?: string;
  instagramHandle?: string;
  capacity?: number;
  floorsCount: number;
}

export interface DJRelease {
  title: string;
  label: string;
  year: number;
  link?: string;
}

export interface DJGig {
  title: string;
  date: string;
  venue: string;
  city: string;
}

export interface DJProfile {
  id: string;
  artistName: string;
  realName?: string;
  role: string; // z. B. "dj_producer", "live_act", "resident"
  city: string; // z. B. "berlin" oder "hamburg"
  genres: string[];
  bio: string;
  avatarUrl?: string;
  bannerUrl?: string;
  soundCloudUrl?: string;
  spotifyUrl?: string;
  instagramUrl?: string;
  residentClubs: string[];
  gearEquipment?: string;
  bookingEmail?: string;
  isVerified: boolean;
  releases: DJRelease[];
  upcomingGigs: DJGig[];
  createdBy?: string;
  createdAt?: string;

  // Zero-Halluzinations-Tracking für DJs
  missingAttributes?: string[];
  missingNotice?: string;
  searchSuggestions?: string[];

  // Rückwärtskompatible Aliase
  name?: string;
}

export interface DJArtist {
  name: string;
  role?: 'Headliner' | 'Resident' | 'Live Act' | 'Support' | 'Special Guest';
  stage?: string;
  origin?: string;
  genreFocus?: string;
  soundcloudUrl?: string;
}

export interface EventPrice {
  presale?: number | null; // VVK in EUR (leer wenn nicht auffindbar)
  door?: number | null;    // AK in EUR (leer wenn nicht auffindbar)
  earlyBird?: number | null;
  currency: 'EUR';
  notes?: string;
  isFreeEntry?: boolean;
}

export interface TechnoEvent {
  // Primäre Attribute aus dem neuen JSON-Standard
  id: string;
  title: string;
  city?: string; // z. B. "hamburg" oder "berlin"
  clubId: string;
  venue?: string; // Veranstaltungsort / Clubname (z. B. "Schroedingers am Schanzenpark")
  neighborhood?: string; // Stadtteil (z. B. "Sternschanze")
  venueAddress?: string; // Vollständige Adresse
  coordinates?: {
    lat: number;
    lng: number;
  };
  date: string; // YYYY-MM-DD
  dateLabel?: string; // Formatiertes Datum z. B. "Mi, 11. Nov 2026"
  startTime: string; // e.g. "18:00"
  endTime: string;   // e.g. "Open End" oder "08:00"
  genres: string[];
  lineup: (string | DJArtist)[]; // Liste der DJs als Strings oder DJArtist-Objekte
  entryFee?: string; // e.g. "10 - 18 €" (oder "" wenn nicht ermittelt)
  priceNumeric?: number | null; // e.g. 15 (oder null)
  isFree?: boolean;
  isOpenAir?: boolean;
  hasPresale?: boolean;
  ticketUrl: string | null; // Kauflink oder null wenn nur Abendkasse oder Extraktions-Quelle
  flyerUrl?: string | null; // Event-Poster / Flyer-Bild-URL oder null
  description: string;
  awarenessInfo?: string; // Richtlinie gegen Rassismus, Sexismus, Diskriminierung
  createdBy?: string;
  createdAt?: string;
  source: string;
  sources?: string[];
  sourceWebsite?: string | null; // Herkunfts-Webseite (wird im JSON auf null gesetzt, dient nur der Extraktion)
  externalIds?: Record<string, string>;
  fingerprint?: string;
  attendeesCount?: number;
  attendeeNames?: string[];

  // Zero-Halluzinations-Tracking & Suchverbesserung
  missingAttributes?: string[]; // Liste im Web nicht auffindbarer Attribute
  missingNotice?: string;       // Benachrichtigung zur Suchoptimierung
  searchSuggestions?: string[]; // Tipps zur Suchverbesserung

  // Rückwärtskompatible Aliase
  clubName?: string; // Alias für venue
  subtitle?: string;
  price?: EventPrice;
  ticketProvider?: string;
  ticketStatus?: string;
  doorPolicyNotes?: string;
  soundSystemNotes?: string;
  minimumAge?: number | null;
  photoPolicy?: PhotoPolicy | string;
  awarenessHighlights?: string;
  sourceUrl?: string | null;
  discoveredAt?: string;
  isAgentDiscovered?: boolean;
}

export interface AgentLog {
  id: string;
  timestamp: string;
  level: 'info' | 'success' | 'warn' | 'error';
  message: string;
  query?: string;
  eventsFound?: number;
  sources?: { title: string; uri: string }[];
}

export interface AgentScheduleConfig {
  enabled: boolean;
  scheduledTimes: string[]; // e.g. ["08:00", "18:00", "22:00"]
  scanFrequencyHours: number;
  targetCity: string;
  customSearchPrompt: string;
  autoSyncWithDatabase: boolean;
  lastRunAt?: string;
  nextRunAt?: string;
  targetSources: string[];
  ruleDescription?: string;
  dateRangeRule?: string;
  deduplicationRule?: string;
}
