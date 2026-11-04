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
  HeartHandshake,
  AlertTriangle
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
    const lineupSummary = event.lineup.map((l) => typeof l === 'string' ? l : l.name).join(', ');
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//KRAFTWERK Hamburg Techno Radar//DE',
      'BEGIN:VEVENT',
      `SUMMARY:${event.title} @ ${event.venue || event.clubName}`,
      `DESCRIPTION:${event.description || ''}\\nLineup: ${lineupSummary}\\nTickets: ${event.ticketUrl || 'Abendkasse'}`,
      `LOCATION:${event.venueAddress || (club ? club.name + ', ' + club.address + ', ' + (club.city || 'Hamburg') : (event.venue || event.clubName) + ', ' + (event.city || 'Hamburg'))}`,
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
  const displayVenue = event.venue || event.clubName;
  const displayAddress = event.venueAddress || (club ? `${club.name} • ${club.address}, ${club.postalCode || ''} ${city}` : `${displayVenue}, ${city}`);
  
  const mapsUrl = event.coordinates?.lat && event.coordinates?.lng
    ? `https://www.google.com/maps/search/?api=1&query=${event.coordinates.lat},${event.coordinates.lng}`
    : club
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(club.name + ' ' + club.address + ' ' + city)}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(displayVenue + ' ' + (event.venueAddress || city))}`;

  const transitUrl = club
    ? (city.toLowerCase() === 'berlin'
        ? `https://www.bvg.de/de/verbindungen/verbindungssuche?to=${encodeURIComponent(club.transit.station)}`
        : `https://www.hvv.de/de/fahrplaene/abfahrt-ankunft?destination=${encodeURIComponent(club.transit.station)}`)
    : (city.toLowerCase() === 'berlin' ? 'https://www.bvg.de' : 'https://www.hvv.de');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl text-neutral-100 flex flex-col my-auto">
        
        {/* Flyer banner if available */}
        {event.flyerUrl && (
          <div className="relative w-full h-44 sm:h-56 bg-neutral-950 overflow-hidden border-b border-neutral-800">
            <img 
              src={event.flyerUrl} 
              alt={event.title} 
              className="w-full h-full object-cover object-center filter brightness-90 hover:scale-105 transition duration-700"
              onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent" />
            <div className="absolute bottom-3 left-4 sm:left-6 flex items-center gap-2">
              <span className="px-2 py-0.5 bg-black/80 backdrop-blur text-lime-400 font-mono text-[11px] rounded border border-lime-400/40">
                OFFIZIELLER FLYER
              </span>
              {event.fingerprint && (
                <span className="px-2 py-0.5 bg-neutral-900/90 text-neutral-400 font-mono text-[10px] rounded hidden sm:inline truncate max-w-xs">
                  ID: {event.id}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Header bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between p-4 sm:p-6 bg-neutral-900/95 backdrop-blur border-b border-neutral-800">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 text-xs font-mono font-bold uppercase rounded bg-lime-400 text-black">
              {displayVenue}
            </span>
            {event.isAgentDiscovered && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                <Sparkles className="w-3 h-3" />
                Vom KI-Agenten entdeckt
              </span>
            )}
            {event.isOpenAir && (
              <span className="px-2 py-0.5 text-xs font-mono rounded bg-cyan-950 text-cyan-300 border border-cyan-700">
                Open Air
              </span>
            )}
            {event.isFree && (
              <span className="px-2 py-0.5 text-xs font-mono rounded bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold">
                Eintritt Frei
              </span>
            )}
            <span className="text-xs text-neutral-400 hidden sm:inline">
              {event.neighborhood ? `${event.neighborhood}, ` : ''}{city}, Deutschland
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition shrink-0"
            aria-label="Schließen"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hero Section */}
        <div className="p-4 sm:p-6 border-b border-neutral-800 bg-gradient-to-b from-neutral-800/40 to-transparent">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {event.title}
              </h2>
              {event.subtitle && (
                <p className="text-sm sm:text-base text-neutral-400 font-mono mt-1">
                  {event.subtitle}
                </p>
              )}
            </div>
            {event.attendeesCount != null && event.attendeesCount > 0 && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-800/80 border border-cyan-500/30 rounded-lg text-cyan-300 font-mono text-xs shrink-0 self-start">
                <span className="text-base">👥</span>
                <div>
                  <span className="font-bold text-sm text-cyan-200">{event.attendeesCount}</span>
                  <span className="text-[11px] text-neutral-400 ml-1">Zusagen</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs sm:text-sm mt-4">
            <div className="bg-neutral-950/70 p-3 rounded-lg border border-neutral-800 flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-lime-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-neutral-400 text-xs">Datum</div>
                <div className="font-semibold capitalize text-white">
                  {event.dateLabel || dateFormatted}
                </div>
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
                  {event.isFree ? (
                    <span className="text-emerald-400 font-bold">Freier Eintritt</span>
                  ) : event.entryFee ? (
                    event.entryFee
                  ) : event.priceNumeric != null ? (
                    `${event.priceNumeric} €`
                  ) : event.price?.presale != null ? (
                    `VVK: ${event.price.presale} €${event.price?.door != null ? ` | AK: ${event.price.door} €` : ''}`
                  ) : event.price?.door != null ? (
                    `AK: ${event.price.door} €`
                  ) : (
                    'Keine Web-Angabe'
                  )}
                </div>
              </div>
            </div>

            <div className="bg-neutral-950/70 p-3 rounded-lg border border-neutral-800 flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-lime-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-neutral-400 text-xs">Location / Viertel</div>
                <div className="font-semibold text-white truncate max-w-[140px]" title={displayVenue}>
                  {event.neighborhood || club?.neighborhood || displayVenue}
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

          {/* MISSING ATTRIBUTES / ZERO-HALLUZINATION NOTIFICATION BANNER - HIGH VISIBILITY */}
          {event.missingAttributes && event.missingAttributes.length > 0 && (
            <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-950/80 via-neutral-950 to-neutral-950 border-2 border-amber-500 rounded-xl space-y-3 shadow-lg shadow-amber-950/50">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm sm:text-base font-mono">
                <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400 animate-pulse" />
                <span>⚠️ ZERO-HALLUZINATION: {event.missingAttributes.length} WEB-ATTRIBUTE FEHLEN (NICHT ERFUNDEN)</span>
              </div>
              <p className="font-sans text-neutral-200 text-xs sm:text-sm leading-relaxed">
                Gemäß strikter Vorgabe wurden für dieses Event <strong>keinerlei Daten erfunden oder fingiert</strong>. Folgende Attribute konnten in offiziellen Webquellen nicht verifiziert werden und wurden explizit leer gelassen:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1">
                {event.missingAttributes.map((attr, idx) => (
                  <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-black/80 border border-rose-500/80 rounded-lg text-rose-300 font-mono text-xs shadow-sm">
                    <span className="text-rose-400 font-bold">❌</span>
                    <span className="font-bold">{attr}:</span>
                    <span className="text-neutral-400">Nicht ermittelt</span>
                  </div>
                ))}
              </div>
              {event.searchSuggestions && event.searchSuggestions.length > 0 && (
                <div className="mt-3 pt-3 border-t border-amber-900/60 font-sans text-neutral-300">
                  <span className="font-bold text-amber-300 block font-mono text-xs mb-1.5">
                    💡 Tipps zur Suchverbesserung für den nächsten Scan:
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-neutral-300 text-xs">
                    {event.searchSuggestions.map((sugg, sIdx) => (
                      <li key={sIdx} className="text-neutral-300 font-mono text-[11px]">{sugg}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          
          {/* Action Callouts: Buy Tickets & Navigation */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between p-4 bg-lime-950/20 border border-lime-500/30 rounded-xl">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-lime-300">
                  Ticket-Status: {event.ticketStatus || (event.ticketUrl ? 'Verfügbar' : 'Nur Abendkasse')}
                </span>
                {event.ticketProvider && (
                  <span className="text-xs text-neutral-400 font-mono">
                    (via {event.ticketProvider})
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-300 mt-0.5">
                {event.price?.notes || 'Gültigen Lichtbildausweis mitführen.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {event.ticketUrl ? (
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
              ) : (
                <div className="px-3.5 py-2.5 bg-rose-950/60 border border-rose-600/70 text-rose-300 text-xs font-mono font-bold rounded-lg flex items-center gap-1.5">
                  <span>⚠️ Kein Ticketlink im Web (Nicht erfunden)</span>
                </div>
              )}

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
            {event.awarenessInfo && (
              <div className="p-2.5 bg-purple-950/30 rounded border border-purple-500/30 text-xs text-purple-200 font-mono">
                🛡️ <strong>Club Awareness-Notiz:</strong> {event.awarenessInfo}
              </div>
            )}
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
              {event.lineup.map((artist, idx) => {
                const artistName = typeof artist === 'string' ? artist : artist.name;
                const artistRole = typeof artist === 'object' ? artist.role : undefined;
                const artistOrigin = typeof artist === 'object' ? artist.origin : undefined;
                const artistGenre = typeof artist === 'object' ? artist.genreFocus : undefined;
                return (
                  <div
                    key={idx}
                    className="p-3 bg-neutral-950/80 border border-neutral-800 rounded-lg flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between gap-1">
                      <span className="font-bold text-sm text-neutral-100">
                        {artistName}
                      </span>
                      {artistRole && (
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded uppercase ${
                          artistRole === 'Headliner'
                            ? 'bg-lime-400/20 text-lime-300 border border-lime-400/30'
                            : artistRole === 'Live Act'
                            ? 'bg-fuchsia-950 text-fuchsia-400 border border-fuchsia-800'
                            : 'bg-neutral-800 text-neutral-400'
                        }`}>
                          {artistRole}
                        </span>
                      )}
                    </div>
                    {(artistOrigin || artistGenre) && (
                      <div className="mt-2 text-xs text-neutral-400 font-mono flex items-center justify-between">
                        <span>{artistOrigin || ''}</span>
                        <span className="text-neutral-500 italic truncate max-w-[120px]">{artistGenre || ''}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Attendees / Community list if present */}
          {((event.attendeeNames && event.attendeeNames.length > 0) || (event.attendeesCount != null && event.attendeesCount > 0)) && (
            <div className="p-4 bg-neutral-950/70 border border-neutral-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-neutral-300 flex items-center gap-2">
                  <span>👥 Zusagen & Community</span>
                  <span className="px-2 py-0.5 bg-neutral-800 text-cyan-300 rounded text-[11px]">
                    {event.attendeesCount ?? event.attendeeNames?.length} Vormerkungen
                  </span>
                </span>
              </div>
              {event.attendeeNames && event.attendeeNames.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {event.attendeeNames.map((name, i) => (
                    <span key={i} className="px-2.5 py-1 bg-neutral-900 border border-neutral-700 text-neutral-200 text-xs font-mono rounded-full flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      {name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

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
              Standort & Öffentlicher Nahverkehr ({city.toLowerCase() === 'berlin' ? 'BVG Berlin' : 'HVV Hamburg'})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-mono text-neutral-400 mb-1">Veranstaltungsort & Adresse:</div>
                <div className="text-sm font-semibold text-white">
                  {displayVenue}
                </div>
                <div className="text-xs text-neutral-300 font-mono mt-0.5">
                  {event.venueAddress || displayAddress}
                </div>
                {event.coordinates && event.coordinates.lat && event.coordinates.lng && (
                  <div className="mt-1 text-[11px] font-mono text-lime-400/90">
                    GPS-Koordinaten: {event.coordinates.lat.toFixed(5)}, {event.coordinates.lng.toFixed(5)}
                  </div>
                )}
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
                  {city.toLowerCase() === 'berlin' ? 'BVG' : 'HVV'} Fahrplanauskunft
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

          {/* Metadata & Source Audit (All 28 Attributes traceable) */}
          <div className="pt-3 border-t border-neutral-800/80 space-y-2 text-[11px] text-neutral-400 font-mono">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span>ID: <strong className="text-neutral-200">{event.id}</strong></span>
              <span>Erstellt von: <strong className="text-neutral-200">{event.createdBy || event.source}</strong></span>
              <span>Synchronisiert: <strong className="text-neutral-200">{new Date(event.createdAt || event.discoveredAt || Date.now()).toLocaleString('de-DE')}</strong></span>
            </div>
            {(event.sourceWebsite || event.sources || event.externalIds || event.fingerprint) && (
              <div className="p-2.5 bg-neutral-950/80 rounded border border-neutral-800/80 flex flex-col gap-1.5 text-[10px]">
                {event.sourceWebsite && (
                  <div className="flex items-center gap-1.5 text-xs text-lime-400 font-bold">
                    <span>🌐 Herkunfts-Webseite:</span>
                    <a
                      href={event.sourceWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-white flex items-center gap-1"
                    >
                      <span>{event.sourceWebsite}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
                {event.fingerprint && (
                  <div>Fingerprint: <span className="text-neutral-300 font-mono">{event.fingerprint}</span></div>
                )}
                {event.externalIds && Object.keys(event.externalIds).length > 0 && (
                  <div>Externe IDs: <span className="text-cyan-300 font-mono">{JSON.stringify(event.externalIds)}</span></div>
                )}
                {event.sources && event.sources.length > 0 && (
                  <div>Quellen-Historie: <span className="text-lime-300">{event.sources.join(', ')}</span></div>
                )}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
