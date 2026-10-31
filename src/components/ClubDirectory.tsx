import React, { useState } from 'react';
import { Club, TechnoEvent } from '../types';
import { 
  MapPin, 
  Volume2, 
  ShieldAlert, 
  Camera, 
  ExternalLink, 
  Navigation, 
  Search, 
  HeartHandshake,
  Download
} from 'lucide-react';

interface ClubDirectoryProps {
  clubs: Club[];
  events: TechnoEvent[];
  selectedCity?: string;
  onSelectEvent: (event: TechnoEvent) => void;
  onFilterByClub: (clubId: string) => void;
  onViewOnMap: (clubId: string) => void;
  onExportCSV?: () => void;
}

export const ClubDirectory: React.FC<ClubDirectoryProps> = ({
  clubs,
  events,
  selectedCity = 'Hamburg',
  onSelectEvent,
  onFilterByClub,
  onViewOnMap,
  onExportCSV,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStrictness, setSelectedStrictness] = useState<string>('all');

  // Count events per club
  const clubEventCounts = React.useMemo(() => {
    const map = new Map<string, number>();
    events.forEach((evt) => {
      map.set(evt.clubId, (map.get(evt.clubId) || 0) + 1);
    });
    return map;
  }, [events]);

  const filteredClubs = clubs.filter((c) => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = c.name.toLowerCase().includes(q);
      const matchNeigh = c.neighborhood.toLowerCase().includes(q);
      const matchSound = c.soundSystem.toLowerCase().includes(q);
      const matchVibe = c.vibe.toLowerCase().includes(q);
      if (!matchName && !matchNeigh && !matchSound && !matchVibe) return false;
    }
    if (selectedStrictness !== 'all') {
      const s = c.doorPolicy.strictness;
      if (selectedStrictness === 'Streng' && s !== 'Streng' && s !== 'Estricta') return false;
      if (selectedStrictness === 'Moderat' && s !== 'Moderat' && s !== 'Moderada') return false;
      if (selectedStrictness === 'Offen' && s !== 'Offen' && s !== 'Abierta') return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Search & Filter Header */}
      <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Clubs filtern nach Name (Südpol, Pudel, Uebel), Stadtteil (St. Pauli, Schanze) oder Soundsystem..."
              className="w-full pl-10 pr-4 py-2.5 bg-neutral-950 border border-neutral-700 rounded-lg text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-lime-400 font-mono transition"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedStrictness}
              onChange={(e) => setSelectedStrictness(e.target.value)}
              className="px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-xs font-mono text-neutral-200 focus:outline-none focus:border-lime-400"
            >
              <option value="all">Alle Einlassstufen</option>
              <option value="Streng">Strenge Türselektion</option>
              <option value="Moderat">Moderate Selektion</option>
              <option value="Offen">Offener Einlass</option>
            </select>

            {onExportCSV && (
              <button
                onClick={onExportCSV}
                title="Clubs als CSV herunterladen"
                className="flex items-center gap-1.5 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 text-xs font-mono rounded-lg transition"
              >
                <Download className="w-3.5 h-3.5 text-lime-400" />
                <span>Clubs .CSV</span>
              </button>
            )}
          </div>
        </div>

        <div className="text-xs text-neutral-400 font-mono flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-neutral-800/60">
          <span>Zeige {filteredClubs.length} von {clubs.length} {selectedCity === 'Alle' ? 'Clubs in Hamburg & Berlin' : `${selectedCity} Clubs`}</span>
          <span className="text-lime-400">Aktive Events im Radar: {events.length}</span>
        </div>
      </div>

      {/* Clubs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredClubs.map((club) => {
          const eventCount = clubEventCounts.get(club.id) || 0;
          const clubUpcomingEvents = events.filter((e) => e.clubId === club.id);
          const city = club.city || 'Hamburg';

          const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            club.name + ' ' + club.address + ' ' + city
          )}`;
          const transitUrl = city === 'Berlin'
            ? `https://www.bvg.de/de/verbindungen/verbindungssuche?to=${encodeURIComponent(club.transit.station)}`
            : `https://www.hvv.de/de/fahrplaene/abfahrt-ankunft?destination=${encodeURIComponent(club.transit.station)}`;

          const isStrict = club.doorPolicy.strictness === 'Streng' || club.doorPolicy.strictness === 'Estricta';
          const isModerate = club.doorPolicy.strictness === 'Moderat' || club.doorPolicy.strictness === 'Moderada';

          return (
            <div
              key={club.id}
              className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden hover:border-neutral-700 transition flex flex-col justify-between"
            >
              <div className="p-5 space-y-4">
                
                {/* Card Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-lime-400 text-black text-[10px] font-mono font-bold uppercase">
                        {city}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 text-[10px] font-mono font-bold uppercase">
                        {club.neighborhood}
                      </span>
                      <span className="text-xs font-mono text-neutral-400">
                        {club.district}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mt-1.5">
                      {club.name}
                    </h3>
                  </div>

                  <span className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase ${
                    isStrict
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : isModerate
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}>
                    Tür: {isStrict ? 'Streng' : isModerate ? 'Moderat' : 'Offen'}
                  </span>
                </div>

                {/* Address & Transit */}
                <div className="text-xs text-neutral-300 space-y-1 font-mono">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-lime-400 shrink-0 mt-0.5" />
                    <span>{club.address}, {club.postalCode} Hamburg</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-neutral-400 text-[11px]">
                    <Navigation className="w-3.5 h-3.5 text-yellow-400 shrink-0 mt-0.5" />
                    <span>
                      {club.transit.station} ({club.transit.lines.join(', ')}) • ~{club.transit.walkMinutes} Min. Fußweg
                    </span>
                  </div>
                </div>

                {/* Vibe & History */}
                <p className="text-xs text-neutral-300 leading-relaxed">
                  {club.history}
                </p>

                {/* MANDATORY AWARENESS & ZERO TOLERANCE CALLOUT */}
                <div className="p-3 bg-purple-950/30 border border-purple-500/30 rounded-lg text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 text-purple-300 font-mono font-bold text-[11px]">
                    <HeartHandshake className="w-3.5 h-3.5 text-purple-400" />
                    <span>Awareness-Team vor Ort & Nulltoleranz</span>
                  </div>
                  <p className="text-[11px] text-neutral-200 font-medium leading-snug">
                    Awareness-Team available, if you feel uncomfortable please ask our staff for help, Please note that we are place with zero tolerance for racism, fascism or any kind of discrimination.
                  </p>
                  <p className="text-[10px] text-neutral-400 leading-snug">
                    (Awareness-Team vor Ort verfügbar: Wenn du dich unwohl fühlst, wende dich bitte an unser Personal. Nulltoleranz für Rassismus, Faschismus oder jegliche Art von Diskriminierung).
                  </p>
                </div>

                {/* Sound System & Features */}
                <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800/80 space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <Volume2 className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-neutral-200">Soundsystem:</strong>{' '}
                      <span className="text-lime-300 font-mono text-[11px]">{club.soundSystem}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Camera className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-neutral-200">Fotopolitik:</strong>{' '}
                      <span className="text-neutral-300">{club.photoPolicy}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-neutral-200">Einlasstipp:</strong>{' '}
                      <span className="text-neutral-400 text-[11px]">{club.doorPolicy.tips}</span>
                    </div>
                  </div>
                </div>

                {/* Specifications Bar */}
                <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono text-[11px]">
                  <div className="p-1.5 bg-neutral-950/60 rounded border border-neutral-800">
                    <span className="text-neutral-500 block text-[10px]">ALTER</span>
                    <span className="text-white font-bold">{club.minimumAge}+ Jahre</span>
                  </div>
                  <div className="p-1.5 bg-neutral-950/60 rounded border border-neutral-800">
                    <span className="text-neutral-500 block text-[10px]">FLOORS</span>
                    <span className="text-white font-bold">{club.floorsCount} Floors</span>
                  </div>
                  <div className="p-1.5 bg-neutral-950/60 rounded border border-neutral-800">
                    <span className="text-neutral-500 block text-[10px]">BEZAHLUNG</span>
                    <span className="text-white font-bold truncate block">{club.paymentMethod}</span>
                  </div>
                </div>

                {/* Upcoming Events Mini-List */}
                {clubUpcomingEvents.length > 0 && (
                  <div className="pt-2 border-t border-neutral-800">
                    <div className="text-[11px] font-mono text-neutral-400 uppercase font-semibold mb-1.5 flex items-center justify-between">
                      <span>Nächste Events in {club.name}:</span>
                      <span className="text-lime-400 font-bold">{clubUpcomingEvents.length}</span>
                    </div>
                    <div className="space-y-1.5">
                      {clubUpcomingEvents.slice(0, 2).map((evt) => (
                        <div
                          key={evt.id}
                          onClick={() => onSelectEvent(evt)}
                          className="p-2 bg-neutral-950/70 hover:bg-neutral-800 rounded border border-neutral-800/80 cursor-pointer flex items-center justify-between text-xs transition"
                        >
                          <div className="truncate pr-2">
                            <span className="text-lime-300 font-mono text-[11px] mr-2">{evt.date}</span>
                            <span className="text-white font-semibold">{evt.title}</span>
                          </div>
                          <span className="text-[10px] font-mono text-neutral-400 shrink-0">
                            {evt.price.presale ? `${evt.price.presale} €` : (evt.price.door ? `${evt.price.door} €` : 'N/A')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Card Footer Actions */}
              <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-lg border border-neutral-700 transition"
                    title="In Google Maps öffnen"
                  >
                    <MapPin className="w-3.5 h-3.5 text-lime-400" />
                  </a>

                  <a
                    href={transitUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-lg border border-neutral-700 transition"
                    title={city === 'Berlin' ? 'BVG Fahrplanauskunft' : 'HVV Fahrplanauskunft'}
                  >
                    <Navigation className="w-3.5 h-3.5 text-yellow-400" />
                  </a>

                  {club.websiteUrl && (
                    <a
                      href={club.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-lg border border-neutral-700 transition"
                      title="Offizielle Website"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onViewOnMap(club.id)}
                    className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-mono rounded-lg border border-neutral-700 transition"
                  >
                    Auf Karte
                  </button>

                  <button
                    onClick={() => onFilterByClub(club.id)}
                    className="px-3 py-1.5 bg-lime-400 hover:bg-lime-300 text-black font-bold text-xs font-mono rounded-lg transition"
                  >
                    Events ansehen ({eventCount})
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
