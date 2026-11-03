import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Club, TechnoEvent } from '../types';
import { MapPin, Navigation, ExternalLink, Calendar, Volume2, ShieldAlert, Compass, HeartHandshake, AlertTriangle } from 'lucide-react';

interface ClubMapProps {
  clubs: Club[];
  events: TechnoEvent[];
  selectedClubId?: string | null;
  selectedCity?: string;
  onSelectEvent: (event: TechnoEvent) => void;
  onFilterByClub?: (clubId: string) => void;
}

export const ClubMap: React.FC<ClubMapProps> = ({
  clubs,
  events,
  selectedClubId,
  selectedCity = 'Hamburg',
  onSelectEvent,
  onFilterByClub,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locatingUser, setLocatingUser] = useState(false);
  const [activeClub, setActiveClub] = useState<Club | null>(null);

  // Group events by club
  const clubEventsMap = React.useMemo(() => {
    const map = new Map<string, TechnoEvent[]>();
    events.forEach((evt) => {
      const list = map.get(evt.clubId) || [];
      list.push(evt);
      map.set(evt.clubId, list);
    });
    return map;
  }, [events]);

  // Calculate distance in km
  const getDistanceFromUser = (lat: number, lng: number) => {
    if (!userLocation) return null;
    const R = 6371; // Earth radius in km
    const dLat = ((lat - userLocation.lat) * Math.PI) / 180;
    const dLon = ((lng - userLocation.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((userLocation.lat * Math.PI) / 180) *
        Math.cos((lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Center of Hamburg
    const map = L.map(mapContainerRef.current, {
      center: [53.5511, 9.9937],
      zoom: 13,
      zoomControl: true,
      attributionControl: false,
    });

    // Dark Matter tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Auto-center map when selectedCity changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    if (selectedCity === 'Berlin') {
      map.flyTo([52.5110, 13.4350], 12);
    } else if (selectedCity === 'Hamburg') {
      map.flyTo([53.5511, 9.9937], 13);
    } else if (selectedCity === 'Alle') {
      map.flyTo([53.05, 11.7], 7);
    }
  }, [selectedCity]);

  // Update club markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    clubs.forEach((club) => {
      const clubEvents = clubEventsMap.get(club.id) || [];
      const hasEvents = clubEvents.length > 0;

      // Custom neon SVG pin
      const iconHtml = `
        <div class="relative group cursor-pointer">
          <div class="w-8 h-8 rounded-full ${
            hasEvents ? 'bg-lime-400' : 'bg-neutral-800'
          } border-2 border-black flex items-center justify-center shadow-lg shadow-lime-400/20 transform transition group-hover:scale-125">
            <span class="text-xs font-mono font-bold ${hasEvents ? 'text-black' : 'text-neutral-400'}">
              ${clubEvents.length}
            </span>
          </div>
          <div class="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap px-1.5 py-0.5 rounded bg-black/90 text-[10px] font-mono text-neutral-200 border border-neutral-700 pointer-events-none opacity-80 group-hover:opacity-100">
            ${club.name}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-techno-pin',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([club.coordinates.lat, club.coordinates.lng], {
        icon: customIcon,
      }).addTo(map);

      marker.on('click', () => {
        setActiveClub(club);
      });

      markersRef.current.set(club.id, marker);
    });

    // If selectedClubId passed, center map on it
    if (selectedClubId && markersRef.current.has(selectedClubId)) {
      const targetClub = clubs.find((c) => c.id === selectedClubId);
      if (targetClub) {
        map.flyTo([targetClub.coordinates.lat, targetClub.coordinates.lng], 15, {
          duration: 1.2,
        });
        setActiveClub(targetClub);
      }
    }
  }, [clubs, clubEventsMap, selectedClubId]);

  // Request user location
  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      alert('Dein Browser unterstützt keine Standortbestimmung.');
      return;
    }
    setLocatingUser(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(coords);
        setLocatingUser(false);

        const map = mapInstanceRef.current;
        if (map) {
          map.flyTo([coords.lat, coords.lng], 14);

          // Add user pin
          const userIconHtml = `
            <div class="w-6 h-6 rounded-full bg-cyan-400 border-2 border-white animate-pulse flex items-center justify-center shadow-lg shadow-cyan-400/50">
              <div class="w-2 h-2 rounded-full bg-black"></div>
            </div>
          `;
          const userIcon = L.divIcon({
            html: userIconHtml,
            className: 'user-location-pin',
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          });
          L.marker([coords.lat, coords.lng], { icon: userIcon })
            .addTo(map)
            .bindPopup('<b>Dein aktueller Standort</b>')
            .openPopup();
        }
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setLocatingUser(false);
      },
      { timeout: 8000 }
    );
  };

  const activeClubEvents = activeClub ? clubEventsMap.get(activeClub.id) || [] : [];

  return (
    <div className="space-y-4">
      
      {/* Map Control Bar */}
      <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-lime-400 animate-pulse"></span>
          <span className="font-mono text-neutral-200 font-semibold">
            {selectedCity === 'Alle' ? 'Hamburg & Berlin' : selectedCity} Geolocation & Club-Radar
          </span>
          <span className="text-neutral-500 font-mono">
            ({clubs.length} Clubs registriert)
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleLocateUser}
            disabled={locatingUser}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs rounded-lg border border-neutral-700 transition"
          >
            <Compass className={`w-3.5 h-3.5 text-cyan-400 ${locatingUser ? 'animate-spin' : ''}`} />
            <span>{locatingUser ? 'Lokalisiere...' : 'Mein GPS'}</span>
          </button>

          <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-lg border border-neutral-800">
            <button
              onClick={() => mapInstanceRef.current?.flyTo([53.5511, 9.9937], 13)}
              className="px-2.5 py-1 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs rounded transition font-mono"
            >
              Hamburg
            </button>
            <button
              onClick={() => mapInstanceRef.current?.flyTo([52.5110, 13.4350], 12)}
              className="px-2.5 py-1 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs rounded transition font-mono"
            >
              Berlin
            </button>
            <button
              onClick={() => mapInstanceRef.current?.flyTo([53.05, 11.7], 7)}
              className="px-2 py-1 hover:bg-neutral-800 text-neutral-400 hover:text-white text-xs rounded transition font-mono"
            >
              Übersicht
            </button>
          </div>
        </div>
      </div>

      {/* Main Map & Selected Club Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Map View Container */}
        <div className="lg:col-span-2 relative h-[360px] sm:h-[450px] md:h-[520px] rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950">
          <div ref={mapContainerRef} className="w-full h-full" />
          
          {/* Overlay Map Legend */}
          <div className="absolute bottom-3 left-3 z-[1000] p-2 sm:p-2.5 bg-neutral-950/90 backdrop-blur border border-neutral-800 rounded-lg text-[10px] sm:text-[11px] font-mono space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-lime-400 border border-black inline-block"></span>
              <span className="text-neutral-300">Club mit Events</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 border border-black inline-block"></span>
              <span className="text-neutral-300">Dein Standort</span>
            </div>
          </div>
        </div>

        {/* Selected Club & Events Detail Sidebar */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-col justify-between max-h-[520px] overflow-y-auto">
          {activeClub ? (
            <div className="space-y-4">
              {/* Club Header */}
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded bg-lime-400 text-black text-[10px] font-mono font-bold uppercase">
                        {activeClub.city || 'Hamburg'} • {activeClub.neighborhood}
                      </span>
                      {activeClub.badge && (
                        <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700 text-[10px] font-mono font-bold uppercase">
                          ★ {activeClub.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
                      {activeClub.name}
                    </h3>
                  </div>
                  {getDistanceFromUser(activeClub.coordinates.lat, activeClub.coordinates.lng) && (
                    <div className="text-right">
                      <span className="text-xs font-mono text-cyan-400 font-bold">
                        {getDistanceFromUser(activeClub.coordinates.lat, activeClub.coordinates.lng)} km
                      </span>
                      <div className="text-[10px] text-neutral-500 font-mono">von dir</div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-neutral-400 mt-1 font-mono">
                  {activeClub.address || <span className="text-rose-400">Keine Adresse ermittelt</span>}, {activeClub.postalCode} {activeClub.city || 'Hamburg'}
                </p>
              </div>

              {/* ZERO-HALLUZINATION WARNING: MISSING ATTRIBUTES */}
              {activeClub.missingAttributes && activeClub.missingAttributes.length > 0 && (
                <div className="p-2.5 bg-amber-950/80 border-2 border-amber-500 rounded-xl text-amber-200 text-xs font-mono space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold uppercase text-[10px]">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
                    <span>⚠️ {activeClub.missingAttributes.length} Web-Attribute fehlen</span>
                  </div>
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {activeClub.missingAttributes.map((attr: string, idx: number) => (
                      <span key={idx} className="px-1.5 py-0.2 bg-black/80 border border-rose-500/70 text-rose-300 rounded text-[9px] font-bold">
                        ❌ {attr}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {activeClub.description && (
                <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                  {activeClub.description}
                </p>
              )}

              {/* Pricing & Outdoor badges */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="p-1.5 bg-neutral-950 rounded border border-neutral-800">
                  <span className="text-neutral-500 block text-[9px]">Ø EINTRITT</span>
                  <span className="text-lime-300 font-bold">{activeClub.entryAvg || <span className="text-rose-400 text-[10px]">Nicht ermittelt</span>}</span>
                </div>
                <div className="p-1.5 bg-neutral-950 rounded border border-neutral-800">
                  <span className="text-neutral-500 block text-[9px]">OUTDOOR</span>
                  <span className="text-emerald-300 font-bold">{activeClub.hasOutdoor ? 'Open Air / Garten' : 'Indoor'}</span>
                </div>
              </div>

              {/* Transit info */}
              <div className="p-2.5 bg-neutral-950 rounded-lg border border-neutral-800 text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-neutral-300 font-semibold">
                  <Navigation className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Öffentlicher Nahverkehr ({activeClub.city === 'Berlin' ? 'BVG' : 'HVV'})</span>
                </div>
                <div className="text-neutral-400 text-[11px]">
                  <strong>Station:</strong> {activeClub.publicTransit || activeClub.transit?.station || 'Nicht ermittelt'}
                  {activeClub.transit?.walkMinutes ? ` (~${activeClub.transit.walkMinutes} Min. Fußweg)` : ''}
                </div>
                {activeClub.transit?.lines && (
                  <div className="text-neutral-500 text-[11px]">
                    Linien: {activeClub.transit.lines.join(', ')}
                  </div>
                )}
              </div>

              {/* Sound System & Door */}
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <Volume2 className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-neutral-400">Soundsystem:</span>{' '}
                    <span className="text-neutral-200 font-mono text-[11px]">{activeClub.soundSystem || <span className="text-rose-400">Nicht ermittelt</span>}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-neutral-400">Türselektion:</span>{' '}
                    <span className="text-neutral-200 font-bold">{activeClub.doorPolicy?.strictness || 'Moderat'}</span>
                    {activeClub.doorPolicy?.tips && (
                      <p className="text-[11px] text-neutral-400 mt-0.5">{activeClub.doorPolicy.tips}</p>
                    )}
                  </div>
                </div>

                  <div className="flex items-start gap-2 pt-1 border-t border-neutral-800">
                    <HeartHandshake className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-purple-300 font-semibold text-[11px] block">Awareness-Team & Nulltoleranz:</span>
                      <p className="text-[10px] text-neutral-300 leading-snug mt-0.5">
                        Awareness-Team available, if you feel uncomfortable please ask our staff for help, Please note that we are place with zero tolerance for racism, fascism or any kind of discrimination.
                      </p>
                      <p className="text-[9px] text-neutral-400 leading-snug mt-1">
                        (Awareness-Team vor Ort verfügbar: Wenn du dich unwohl fühlst, wende dich bitte an unser Personal. Wir sind ein Ort mit Nulltoleranz für jegliche Diskriminierung).
                      </p>
                    </div>
                  </div>
              </div>

              {/* Direct Navigation Links */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    activeClub.name + ' ' + activeClub.address + ' Hamburg'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs rounded-lg border border-neutral-700 transition"
                >
                  <MapPin className="w-3.5 h-3.5 text-lime-400" />
                  <span>Google Maps</span>
                  <ExternalLink className="w-3 h-3 text-neutral-400" />
                </a>

                <a
                  href={`https://www.hvv.de/de/fahrplaene/abfahrt-ankunft?destination=${encodeURIComponent(
                    activeClub.transit.station
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs rounded-lg border border-neutral-700 transition"
                >
                  <Navigation className="w-3.5 h-3.5 text-yellow-400" />
                  <span>HVV Route</span>
                  <ExternalLink className="w-3 h-3 text-neutral-400" />
                </a>
              </div>

              {/* Upcoming Events in this Club */}
              <div className="border-t border-neutral-800 pt-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-mono font-bold uppercase text-neutral-300 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-lime-400" />
                    Anstehende Events ({activeClubEvents.length})
                  </h4>
                  {onFilterByClub && (
                    <button
                      onClick={() => onFilterByClub(activeClub.id)}
                      className="text-[11px] font-mono text-lime-400 hover:underline"
                    >
                      In Tabelle filtern
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {activeClubEvents.length === 0 ? (
                    <p className="text-xs text-neutral-500 font-mono py-2">
                      Keine Events aktuell im Radar für diesen Club hinterlegt.
                    </p>
                  ) : (
                    activeClubEvents.map((evt) => (
                      <div
                        key={evt.id}
                        onClick={() => onSelectEvent(evt)}
                        className="p-2.5 bg-neutral-950/80 hover:bg-neutral-800 rounded-lg border border-neutral-800 cursor-pointer transition"
                      >
                        <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 mb-1">
                          <span className="text-lime-300 font-bold">{evt.date}</span>
                          <span>{evt.startTime} Uhr</span>
                        </div>
                        <div className="text-xs font-bold text-white truncate">
                          {evt.title}
                        </div>
                        <div className="text-[10px] text-neutral-400 truncate mt-0.5">
                          {evt.lineup.map((l: any) => (typeof l === 'string' ? l : l.name)).join(', ')}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-500 space-y-3">
              <MapPin className="w-10 h-10 text-neutral-700 animate-bounce" />
              <div>
                <p className="text-sm font-semibold text-neutral-300">Wähle einen Club auf der Karte</p>
                <p className="text-xs text-neutral-500 mt-1 max-w-xs">
                  Klicke auf eine der Markierungen in Hamburg, um Soundsystem, Einlasspolitik, HVV-Anbindung und Events anzuzeigen.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
