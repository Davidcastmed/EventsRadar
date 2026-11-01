import React from 'react';
import { TechnoEvent, Club } from '../types';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  ExternalLink, 
  Ticket, 
  ShieldAlert, 
  Camera, 
  Music2, 
  Volume2, 
  Navigation, 
  Sparkles,
  Download,
  CheckCircle2,
  AlertCircle,
  HeartHandshake
} from 'lucide-react';

interface EventDetailModalProps {
  event: TechnoEvent | null;
  club?: Club;
  onClose: () => void;
  onOpenMapToClub?: (clubId: string) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  club,
  onClose,
  onOpenMapToClub,
}) => {
  if (!event) return null;

  // Format readable German date
  const dateObj = new Date(event.date + 'T12:00:00');
  const dateFormatted = dateObj.toLocaleDateString('de-DE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Calendar .ics download generator
  const downloadIcs = () => {
    const startIso = event.date.replace(/-/g, '') + 'T' + event.startTime.replace(':', '') + '00';
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//KRAFTWERK Hamburg Techno Radar//DE',
      'BEGIN:VEVENT',
      `SUMMARY:${event.title} @ ${event.clubName}`,
      `DESCRIPTION:${event.description}\\nLineup: ${event.lineup.map((l) => l.name).join(', ')}\\nTickets: ${event.ticketUrl}`,
      `LOCATION:${club ? club.name + ', ' + club.address + ', Hamburg' : event.clubName + ', Hamburg'}`,
      `DTSTART:${startIso}`,
      `DTEND:${event.date.replace(/-/g, '')}T235959`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${event.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const city = event.city || club?.city || 'Hamburg';
  const mapsUrl = club
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(club.name + ' ' + club.address + ' ' + city)}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.clubName + ' ' + city)}`;

  const transitUrl = club
    ? (city === 'Berlin'
        ? `https://www.bvg.de/de/verbindungen/verbindungssuche?to=${encodeURIComponent(club.transit.station)}`
        : `https://www.hvv.de/de/fahrplaene/abfahrt-ankunft?destination=${encodeURIComponent(club.transit.station)}`)
    : (city === 'Berlin' ? 'https://www.bvg.de' : 'https://www.hvv.de');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl text-neutral-100 flex flex-col my-auto">
        
        {/* Header bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between p-4 sm:p-6 bg-neutral-900/95 backdrop-blur border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-mono font-bold uppercase rounded bg-lime-400 text-black">
              {event.clubName}
            </span>
            {event.isAgentDiscovered && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                <Sparkles className="w-3 h-3" />
                Vom KI-Agenten entdeckt
              </span>
            )}
            <span className="text-xs text-neutral-400 hidden sm:inline">
              {event.city || club?.city || 'Hamburg'}, Deutschland
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
            aria-label="Schließen"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hero Section */}
        <div className="p-4 sm:p-6 border-b border-neutral-800 bg-gradient-to-b from-neutral-800/40 to-transparent">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            {event.title}
          </h2>
          {event.subtitle && (
            <p className="text-sm sm:text-base text-neutral-400 font-mono mb-4">
              {event.subtitle}
            </p>
          )}

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs sm:text-sm">
            <div className="bg-neutral-950/70 p-3 rounded-lg border border-neutral-800 flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-lime-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-neutral-400 text-xs">Datum</div>
                <div className="font-semibold capitalize text-white">{dateFormatted}</div>
              </div>
            </div>

            <div className="bg-neutral-950/70 p-3 rounded-lg border border-neutral-800 flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-lime-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-neutral-400 text-xs">Uhrzeit</div>
                <div className="font-semibold text-white">{event.startTime} - {event.endTime} Uhr</div>
              </div>
            </div>

            <div className="bg-neutral-950/70 p-3 rounded-lg border border-neutral-800 flex items-start gap-2.5">
              <Ticket className="w-4 h-4 text-lime-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-neutral-400 text-xs">Eintritt</div>
                <div className="font-semibold text-lime-300">
                  {event.price.presale ? `VVK: ${event.price.presale} €` : ''} 
                  {event.price.door ? ` | AK: ${event.price.door} €` : ''}
                </div>
              </div>
            </div>

            <div className="bg-neutral-950/70 p-3 rounded-lg border border-neutral-800 flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-lime-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-neutral-400 text-xs">Stadtteil</div>
                <div className="font-semibold text-white truncate max-w-[140px]">
                  {club ? `${club.neighborhood}` : 'Hamburg'}
                </div>
              </div>
            </div>
          </div>

          {/* Genre tags */}
          <div className="flex flex-wrap gap-1.5 mt-4">
            {event.genres.map((g, i) => (
              <span
                key={i}
                className="px-2 py-0.5 text-xs font-mono rounded bg-neutral-800 text-neutral-300 border border-neutral-700"
              >
                #{g}
              </span>
            ))}
          </div>
        </div>

        {/* Main Body */}
        <div className="p-4 sm:p-6 space-y-6">
          
          {/* Action Callouts: Buy Tickets & Navigation */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between p-4 bg-lime-950/20 border border-lime-500/30 rounded-xl">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-lime-300">
                  Ticket-Status: {event.ticketStatus}
                </span>
                <span className="text-xs text-neutral-400 font-mono">
                  (via {event.ticketProvider})
                </span>
              </div>
              <p className="text-xs text-neutral-300 mt-0.5">
                {event.price.notes || 'Offizieller Vorverkauf. Gültigen Lichtbildausweis mitführen.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={event.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-lime-400 hover:bg-lime-300 text-black font-semibold text-sm rounded-lg transition shadow-lg shadow-lime-400/10"
              >
                <Ticket className="w-4 h-4" />
                Tickets kaufen
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={downloadIcs}
                title="Zum Kalender hinzufügen (.ics)"
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-sm rounded-lg border border-neutral-700 transition"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Kalender</span>
              </button>
            </div>
          </div>

          {/* MANDATORY AWARENESS & ZERO TOLERANCE STATEMENT (Prominent Banner) */}
          <div className="p-4 bg-gradient-to-r from-purple-950/40 via-neutral-950 to-neutral-950 border border-purple-500/40 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-purple-300 font-mono font-bold text-xs uppercase tracking-wider">
              <HeartHandshake className="w-4 h-4 text-purple-400" />
              <span>Awareness-Team vor Ort & Nulltoleranz-Erklärung</span>
            </div>
            <p className="text-xs text-neutral-100 font-medium leading-relaxed bg-neutral-900/80 p-2.5 rounded border border-purple-500/20">
              <strong>Awareness-Team available, if you feel uncomfortable please ask our staff for help, Please note that we are place with zero tolerance for racism, fascism or any kind of discrimination.</strong>
            </p>
            <p className="text-[11px] text-neutral-400 leading-relaxed pt-1 border-t border-neutral-800/80">
              Awareness-Team vor Ort verfügbar: Wenn du dich unwohl fühlst, wende dich bitte jederzeit an unser Personal oder die mobilen Awareness-Teams. Wir dulden keinerlei Rassismus, Faschismus, Sexismus, Queerfeindlichkeit oder Grenzverletzungen jeglicher Art.
            </p>
          </div>

          {/* Lineup Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold uppercase tracking-wider text-neutral-200 flex items-center gap-2 font-mono">
                <Music2 className="w-4 h-4 text-lime-400" />
                Lineup & DJs ({event.lineup.length})
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {event.lineup.map((artist, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-neutral-950/80 border border-neutral-800 rounded-lg flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="font-bold text-sm text-neutral-100">
                      {artist.name}
                    </span>
                    {artist.role && (
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded uppercase ${
                        artist.role === 'Headliner'
                          ? 'bg-lime-400/20 text-lime-300 border border-lime-400/30'
                          : artist.role === 'Live Act'
                          ? 'bg-fuchsia-950 text-fuchsia-400 border border-fuchsia-800'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}>
                        {artist.role}
                      </span>
                    )}
                  </div>
                  {(artist.origin || artist.genreFocus) && (
                    <div className="mt-2 text-xs text-neutral-400 font-mono flex items-center justify-between">
                      <span>{artist.origin || ''}</span>
                      <span className="text-neutral-500 italic truncate max-w-[120px]">{artist.genreFocus || ''}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="p-4 bg-neutral-950/60 border border-neutral-800 rounded-xl">
            <h4 className="text-xs uppercase font-mono tracking-wider text-neutral-400 mb-2">
              Über das Event & Klangkonzept
            </h4>
            <p className="text-sm text-neutral-300 leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Club Policies (Door, Camera, Awareness, Rules) */}
          <div>
            <h3 className="text-base font-bold uppercase tracking-wider text-neutral-200 mb-3 flex items-center gap-2 font-mono">
              <ShieldAlert className="w-4 h-4 text-lime-400" />
              Einlasskriterien & Club-Regularien
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              
              {/* Door Policy */}
              <div className="p-4 bg-neutral-950/90 border border-neutral-800 rounded-xl flex flex-col">
                <div className="flex items-center gap-2 mb-2 text-lime-400 text-sm font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Türselektion</span>
                </div>
                <div className="text-xs font-mono text-neutral-400 mb-2">
                  Strenge: <strong className="text-white">{club?.doorPolicy.strictness || 'Moderat'}</strong>
                </div>
                <p className="text-xs text-neutral-300 flex-1">
                  {club?.doorPolicy.tips || event.doorPolicyNotes}
                </p>
                <div className="mt-3 pt-2 border-t border-neutral-800/80 text-[11px] text-neutral-400">
                  <span className="text-neutral-500">Dresscode:</span>{' '}
                  <span className="text-neutral-300">{club?.doorPolicy.dressCode || 'Dunkel / Rave'}</span>
                </div>
              </div>

              {/* Photo & Privacy Policy */}
              <div className="p-4 bg-neutral-950/90 border border-neutral-800 rounded-xl flex flex-col">
                <div className="flex items-center gap-2 mb-2 text-cyan-400 text-sm font-semibold">
                  <Camera className="w-4 h-4 shrink-0" />
                  <span>Foto- & Videopolitik</span>
                </div>
                <div className="text-xs font-mono text-neutral-400 mb-2">
                  Regelung: <strong className="text-white">{event.photoPolicy}</strong>
                </div>
                <p className="text-xs text-neutral-300 flex-1">
                  {event.photoPolicy === 'Kamera abgeklebt' || event.photoPolicy === 'Cámaras con pegatinas'
                    ? 'Smartphone-Kameras werden am Einlass mit Aufklebern versiegelt. Entfernen auf dem Floor führt zum Verweis.'
                    : event.photoPolicy === 'Strikt verboten' || event.photoPolicy === 'Estrictamente Prohibido'
                    ? 'Strengstes Handyverbot auf der gesamten Tanzfläche zum Schutz der Privatsphäre aller Feiernden.'
                    : 'Diskrete Handynutzung gestattet. Kein Blitzlicht, kein Filmen fremder Gesichter.'}
                </p>
                <div className="mt-3 pt-2 border-t border-neutral-800/80 text-[11px] text-neutral-400">
                  <span className="text-neutral-500">Mindestalter:</span>{' '}
                  <span className="text-white font-mono font-bold">{club?.minimumAge || event.minimumAge}+ Jahre</span>
                </div>
              </div>

              {/* Awareness & Safe Space */}
              <div className="p-4 bg-neutral-950/90 border border-neutral-800 rounded-xl flex flex-col">
                <div className="flex items-center gap-2 mb-2 text-purple-400 text-sm font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Safe Space & Zahlungsart</span>
                </div>
                <div className="text-xs font-mono text-neutral-400 mb-2">
                  Status: <strong className="text-white">Awareness aktiv</strong>
                </div>
                <p className="text-xs text-neutral-300 flex-1">
                  {club?.awarenessPolicy || event.awarenessHighlights}
                </p>
                <div className="mt-3 pt-2 border-t border-neutral-800/80 text-[11px] text-neutral-400">
                  <span className="text-neutral-500">Bezahlung an Bar:</span>{' '}
                  <span className="text-white font-mono">{club?.paymentMethod || 'Bar & Karte'}</span>
                </div>
              </div>

            </div>
          </div>

          {/* Sound System & Club Details */}
          {club && (
            <div className="p-4 bg-neutral-950/80 border border-neutral-800 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-lime-400 shrink-0">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Soundsystem & Akustik</h4>
                  <p className="text-xs text-lime-300 font-mono mt-0.5">{club.soundSystem}</p>
                  <p className="text-xs text-neutral-400 mt-1 max-w-xl">{club.vibe}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-mono text-neutral-400">
                  {club.floorsCount} Floors / Kapazität ~{club.capacity || 'N/A'}
                </span>
              </div>
            </div>
          )}

          {/* Navigation & Geolocation Section */}
          <div className="p-4 sm:p-5 bg-neutral-950/90 border border-neutral-800 rounded-xl">
            <h3 className="text-base font-bold uppercase tracking-wider text-neutral-200 mb-3 flex items-center gap-2 font-mono">
              <Navigation className="w-4 h-4 text-lime-400" />
              Standort & Öffentlicher Nahverkehr (HVV Hamburg)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-mono text-neutral-400 mb-1">Adresse:</div>
                <div className="text-sm font-semibold text-white">
                  {club ? `${club.name} • ${club.address}, ${club.postalCode} Hamburg` : `${event.clubName}, Hamburg`}
                </div>
                {club && (
                  <div className="mt-2 text-xs text-neutral-300 space-y-1">
                    <p><strong className="text-neutral-400">Nächste Station:</strong> {club.transit.station}</p>
                    <p><strong className="text-neutral-400">Linien:</strong> {club.transit.lines.join(', ')}</p>
                    <p><strong className="text-neutral-400">Fußweg:</strong> ~{club.transit.walkMinutes} Minuten</p>
                    <p className="text-neutral-400 text-[11px] mt-1">{club.transit.directions}</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-center gap-2">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold rounded-lg text-white border border-neutral-700 transition"
                >
                  <MapPin className="w-3.5 h-3.5 text-lime-400" />
                  In Google Maps öffnen
                  <ExternalLink className="w-3 h-3 text-neutral-400 ml-auto" />
                </a>

                <a
                  href={transitUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold rounded-lg text-white border border-neutral-700 transition"
                >
                  <Navigation className="w-3.5 h-3.5 text-yellow-400" />
                  {city === 'Berlin' ? 'BVG' : 'HVV'} Fahrplanauskunft
                  <ExternalLink className="w-3 h-3 text-neutral-400 ml-auto" />
                </a>

                {onOpenMapToClub && club && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenMapToClub(club.id);
                    }}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-lime-400/10 hover:bg-lime-400/20 text-lime-300 border border-lime-400/30 text-xs font-semibold rounded-lg transition"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    Auf interaktiver Karte anzeigen
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Metadata & Source Audit */}
          <div className="pt-2 border-t border-neutral-800/80 flex flex-wrap items-center justify-between text-[11px] text-neutral-500 font-mono">
            <span>Quelle: {event.source}</span>
            <span>Erfasst am: {new Date(event.discoveredAt).toLocaleString('de-DE')}</span>
          </div>

        </div>

      </div>
    </div>
  );
};
