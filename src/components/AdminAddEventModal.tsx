import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Tag, 
  Music2, 
  Ticket, 
  Building2, 
  ShieldCheck, 
  PlusCircle, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { Club, TechnoEvent, City } from '../types/index.ts';

interface AdminAddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  clubs: Club[];
  selectedCity: City | 'Alle';
  onEventCreated: (event: TechnoEvent) => void;
}

export const AdminAddEventModal: React.FC<AdminAddEventModalProps> = ({
  isOpen,
  onClose,
  clubs,
  selectedCity,
  onEventCreated,
}) => {
  const defaultCity: City = selectedCity === 'Berlin' ? 'Berlin' : 'Hamburg';
  
  const [title, setTitle] = useState('');
  const [clubId, setClubId] = useState(clubs.find(c => (c.city || 'Hamburg') === defaultCity)?.id || (clubs[0]?.id || ''));
  const [city, setCity] = useState<City>(defaultCity);
  const [date, setDate] = useState('2026-10-31');
  const [startTime, setStartTime] = useState('23:00');
  const [endTime, setEndTime] = useState('08:00');
  const [headlinersInput, setHeadlinersInput] = useState('');
  const [genresInput, setGenresInput] = useState('Techno, Industrial Techno, Dark Techno');
  const [priceTier, setPriceTier] = useState<'Kostenlos' | '10-15€' | '15-20€' | '20-25€' | '25€+'>('15-20€');
  const [priceValue, setPriceValue] = useState(18);
  const [ticketUrl, setTicketUrl] = useState('');
  const [isOfficialPreSale, setIsOfficialPreSale] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const filteredClubs = clubs.filter(c => (c.city || 'Hamburg') === city);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Bitte geben Sie einen Event-Titel an.');
      return;
    }
    if (!clubId) {
      setError('Bitte wählen Sie einen Club aus.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const club = clubs.find(c => c.id === clubId);
    const headliners = headlinersInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const genres = genresInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const djs = headliners.length > 0 
      ? headliners.map(name => ({ name, role: 'Headliner' as const }))
      : [{ name: 'Resident DJs', role: 'Resident' as const }];

    const newEvent: TechnoEvent = {
      id: `evt-admin-${Date.now()}`,
      title: title.trim(),
      clubId,
      clubName: club?.name || 'Techno Club',
      venue: club?.name || 'Techno Club',
      neighborhood: club?.neighborhood || '',
      venueAddress: club ? `${club.address}, ${club.postalCode || ''} ${city}` : '',
      city,
      date,
      dateLabel: new Date(date + 'T12:00:00').toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }),
      startTime,
      endTime,
      genres: genres.length > 0 ? genres : ['Techno'],
      lineup: djs,
      entryFee: priceValue > 0 ? `${priceValue} €` : 'Kostenlos',
      priceNumeric: priceValue > 0 ? priceValue : 0,
      isFree: priceValue === 0,
      isOpenAir: false,
      hasPresale: isOfficialPreSale,
      description: `Techno Clubnacht im ${club?.name || 'Club'} (${city}). Lineup: ${djs.map(d => d.name).join(', ')}.`,
      price: {
        presale: priceValue > 0 ? priceValue : undefined,
        door: priceValue > 0 ? priceValue + 3 : 0,
        currency: 'EUR',
        notes: priceTier,
      },
      ticketUrl: ticketUrl.trim() || club?.websiteUrl || 'https://ra.co',
      ticketProvider: 'Resident Advisor / Clubkasse',
      ticketStatus: 'Verfügbar',
      doorPolicyNotes: club?.doorPolicy.tips || 'Angemessene Kleidung, respektvolles Auftreten.',
      soundSystemNotes: club?.soundSystem || 'High-End Club Soundsystem',
      minimumAge: club?.minimumAge || 18,
      photoPolicy: club?.photoPolicy || 'Kamera abgeklebt',
      awarenessHighlights:
        'Awareness-Team available, if you feel uncomfortable please ask our staff for help, Please note that we are place with zero tolerance for racism, fascism or any kind of discrimination.',
      awarenessInfo: 'Awareness-Team vor Ort. Respektvoller Umgang ohne Diskriminierung.',
      source: 'Admin-Erfassung',
      sources: ['Admin-Erfassung'],
      createdBy: 'Administrator',
      createdAt: new Date().toISOString(),
      discoveredAt: new Date().toISOString(),
      isAgentDiscovered: false,
    };

    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent),
      });

      if (res.ok) {
        const savedEvent = await res.json();
        onEventCreated(savedEvent);
        onClose();
      } else {
        onEventCreated(newEvent);
        onClose();
      }
    } catch {
      onEventCreated(newEvent);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div 
        className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto font-mono text-neutral-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-lime-400 text-black flex items-center justify-center font-bold">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">NEUES EVENT ERFASSEN</h2>
            <p className="text-xs text-neutral-400 font-sans">
              Administrator-Modus: Direktes Anlegen im KRAFTWERK Techno Radar
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
          
          {/* City Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-300 font-mono font-semibold mb-1">
                METROPOLE / STADT
              </label>
              <select
                value={city}
                onChange={(e) => {
                  const newCity = e.target.value as City;
                  setCity(newCity);
                  const firstInCity = clubs.find(c => (c.city || 'Hamburg') === newCity);
                  if (firstInCity) setClubId(firstInCity.id);
                }}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-white font-mono focus:border-lime-400 focus:outline-none"
              >
                <option value="Hamburg">Hamburg (38 Clubs)</option>
                <option value="Berlin">Berlin (30 Clubs)</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-300 font-mono font-semibold mb-1">
                LOCATION / CLUB
              </label>
              <select
                value={clubId}
                onChange={(e) => setClubId(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-white font-mono focus:border-lime-400 focus:outline-none"
              >
                {filteredClubs.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.district})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Event Title */}
          <div>
            <label className="block text-neutral-300 font-mono font-semibold mb-1">
              EVENT-TITEL / RAVE NAME
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="z. B. KLANGRAUSCH Halloween Special"
              required
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-white font-sans focus:border-lime-400 focus:outline-none"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-neutral-300 font-mono font-semibold mb-1">
                DATUM (JJJJ-MM-TT)
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-white font-mono focus:border-lime-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-neutral-300 font-mono font-semibold mb-1">
                BEGINN
              </label>
              <input
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="23:00"
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-white font-mono focus:border-lime-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-neutral-300 font-mono font-semibold mb-1">
                ENDE
              </label>
              <input
                type="text"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="08:00"
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-white font-mono focus:border-lime-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Lineup & Genres */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-300 font-mono font-semibold mb-1">
                DJS / LINEUP (KOMMAGETRENNT)
              </label>
              <input
                type="text"
                value={headlinersInput}
                onChange={(e) => setHeadlinersInput(e.target.value)}
                placeholder="DVS1, Ben Klock, Ellen Allien"
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-white font-sans focus:border-lime-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-neutral-300 font-mono font-semibold mb-1">
                GENRES (KOMMAGETRENNT)
              </label>
              <input
                type="text"
                value={genresInput}
                onChange={(e) => setGenresInput(e.target.value)}
                placeholder="Techno, Peak Time, Industrial"
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-white font-sans focus:border-lime-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Price & Ticket Link */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-neutral-300 font-mono font-semibold mb-1">
                PREISKLASSE
              </label>
              <select
                value={priceTier}
                onChange={(e) => setPriceTier(e.target.value as any)}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-white font-mono focus:border-lime-400 focus:outline-none"
              >
                <option value="Kostenlos">Kostenlos</option>
                <option value="10-15€">10-15€</option>
                <option value="15-20€">15-20€</option>
                <option value="20-25€">20-25€</option>
                <option value="25€+">25€+</option>
              </select>
            </div>
            <div>
              <label className="block text-neutral-300 font-mono font-semibold mb-1">
                PREIS IN €
              </label>
              <input
                type="number"
                value={priceValue}
                onChange={(e) => setPriceValue(Number(e.target.value))}
                min={0}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-white font-mono focus:border-lime-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-neutral-300 font-mono font-semibold mb-1">
                TICKET-URL
              </label>
              <input
                type="url"
                value={ticketUrl}
                onChange={(e) => setTicketUrl(e.target.value)}
                placeholder="https://ra.co/events/..."
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-white font-sans focus:border-lime-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Mandatory Awareness Policy Notice */}
          <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl text-[11px] text-neutral-400">
            <span className="font-bold text-lime-400 block mb-1 font-mono">
              VERPFLICHTENDE AWARENESS-RICHTLINIE (WIRD AUTOMATISCH ANGEHÄNGT):
            </span>
            Awareness-Team available, if you feel uncomfortable please ask our staff for help, Please note that we are place with zero tolerance for racism, fascism or any kind of discrimination.
          </div>

          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl font-mono text-xs"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-lime-400 hover:bg-lime-300 text-black font-bold font-mono text-xs rounded-xl shadow-lg shadow-lime-400/20 disabled:opacity-50 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Event veröffentlichen</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
