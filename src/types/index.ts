export type DoorStrictness = 'Streng' | 'Moderat' | 'Offen' | 'Estricta' | 'Moderada' | 'Abierta';
export type PhotoPolicy = 'Kamera abgeklebt' | 'Strikt verboten' | 'Diskret / Erlaubt' | 'Cámaras con pegatinas' | 'Estrictamente Prohibido' | 'Discreto / Permitido';
export type PaymentMethod = 'Nur Barzahlung' | 'Nur Kartenzahlung' | 'Bar & Karte' | 'Solo Efectivo' | 'Solo Tarjeta' | 'Efectivo y Tarjeta';

export type City = 'Hamburg' | 'Berlin';

export interface Club {
  id: string;
  name: string;
  aka?: string;
  city?: City;
  address: string;
  neighborhood: string;
  district: string;
  postalCode: string;
  coordinates: {
    lat: number;
    lng: number;
  };
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

export interface DJArtist {
  name: string;
  role?: 'Headliner' | 'Resident' | 'Live Act' | 'Support' | 'Special Guest';
  stage?: string;
  origin?: string;
  genreFocus?: string;
  soundcloudUrl?: string;
}

export interface EventPrice {
  presale?: number; // VVK in EUR
  door?: number;    // AK (Abendkasse) in EUR
  earlyBird?: number;
  currency: 'EUR';
  notes?: string;
}

export interface TechnoEvent {
  id: string;
  title: string;
  subtitle?: string;
  city?: City;
  clubId: string;
  clubName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // e.g. "23:00"
  endTime: string;   // e.g. "08:00" or "14:00 (Open End)"
  genres: string[];
  lineup: DJArtist[];
  description: string;
  price: EventPrice;
  ticketUrl: string;
  ticketProvider: string; // e.g. "Resident Advisor", "TixforGigs", "Eventim Light", "Club Vorverkauf"
  ticketStatus: 'Verfügbar' | 'Letzte Tickets' | 'VVK Ausverkauft (Nur AK)' | 'Nur Abendkasse' | 'Disponible' | 'Últimas entradas' | 'Solo en Puerta';
  doorPolicyNotes: string;
  soundSystemNotes?: string;
  minimumAge: number;
  photoPolicy: PhotoPolicy;
  awarenessHighlights: string;
  source: string;
  sourceUrl?: string;
  discoveredAt: string;
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
}
