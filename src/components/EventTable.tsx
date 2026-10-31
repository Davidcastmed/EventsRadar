import React, { useState, useMemo } from 'react';
import { TechnoEvent, Club } from '../types';
import { 
  Search, 
  MapPin, 
  ExternalLink, 
  Ticket, 
  ShieldAlert, 
  Sparkles, 
  Calendar, 
  ArrowUpDown, 
  Clock, 
  ChevronRight, 
  Info, 
  HeartHandshake,
  Download,
  Plus,
  Trash2,
  ShieldCheck,
  Navigation
} from 'lucide-react';

interface EventTableProps {
  events: TechnoEvent[];
  clubs: Club[];
  selectedCity?: string;
  onSelectEvent: (event: TechnoEvent) => void;
  onNavigateToMap: (clubId: string) => void;
  onTriggerScan: () => void;
  onExportCSV?: () => void;
  isScanning: boolean;
  currentUser?: { username: string; role: string } | null;
  onOpenAddEvent?: () => void;
  onDeleteEvent?: (id: string) => void;
}

export const EventTable: React.FC<EventTableProps> = ({
  events,
  clubs,
  selectedCity = 'Hamburg',
  onSelectEvent,
  onNavigateToMap,
  onTriggerScan,
  onExportCSV,
  isScanning,
  currentUser,
  onOpenAddEvent,
  onDeleteEvent,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClubId, setSelectedClubId] = useState<string>('all');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'twoweeks' | 'weekend' | 'agent'>('all');
  const [sortField, setSortField] = useState<'date' | 'price' | 'club'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Club lookup map
  const clubMap = useMemo(() => {
    const map = new Map<string, Club>();
    clubs.forEach((c) => map.set(c.id, c));
    return map;
  }, [clubs]);

  // Unique genres
  const allGenres = useMemo(() => {
    const set = new Set<string>();
    events.forEach((e) => e.genres.forEach((g) => set.add(g)));
    return Array.from(set).sort();
  }, [events]);

  // Today & 2-week counts
  const todayEventsCount = useMemo(() => {
    return events.filter((e) => e.date === '2026-10-31').length;
  }, [events]);

  const twoWeeksEventsCount = useMemo(() => {
    return events.filter((e) => e.date >= '2026-10-31' && e.date <= '2026-11-15').length;
  }, [events]);

  // Filtering & Sorting
  const filteredEvents = useMemo(() => {
    return events
      .filter((evt) => {
        // Search term filter (Artist, event title, club name, genre)
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchTitle = evt.title.toLowerCase().includes(q);
          const matchClub = evt.clubName.toLowerCase().includes(q);
          const matchGenre = evt.genres.some((g) => g.toLowerCase().includes(q));
          const matchArtist = evt.lineup.some((a) => a.name.toLowerCase().includes(q));
          if (!matchTitle && !matchClub && !matchGenre && !matchArtist) {
            return false;
          }
        }

        // Club filter
        if (selectedClubId !== 'all' && evt.clubId !== selectedClubId) {
          return false;
        }

        // Genre filter
        if (selectedGenre !== 'all' && !evt.genres.includes(selectedGenre)) {
          return false;
        }

        // Date Filter
        if (dateFilter === 'today') {
          if (evt.date !== '2026-10-31') return false;
        } else if (dateFilter === 'twoweeks') {
          if (evt.date < '2026-10-31' || evt.date > '2026-11-15') return false;
        } else if (dateFilter === 'weekend') {
          const day = new Date(evt.date + 'T12:00:00').getDay();
          // Friday = 5, Saturday = 6, Sunday = 0
          if (day !== 5 && day !== 6 && day !== 0) {
            return false;
          }
        } else if (dateFilter === 'agent') {
          if (!evt.isAgentDiscovered) return false;
        }

        return true;
      })
      .sort((a, b) => {
        let cmp = 0;
        if (sortField === 'date') {
          cmp = a.date.localeCompare(b.date);
        } else if (sortField === 'price') {
          const priceA = a.price.presale || a.price.door || 999;
          const priceB = b.price.presale || b.price.door || 999;
          cmp = priceA - priceB;
        } else if (sortField === 'club') {
          cmp = a.clubName.localeCompare(b.clubName);
        }
        return sortOrder === 'asc' ? cmp : -cmp;
      });
  }, [events, searchTerm, selectedClubId, selectedGenre, dateFilter, sortField, sortOrder]);

  const toggleSort = (field: 'date' | 'price' | 'club') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          
          {/* Main search input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Suche nach DJ (z.B. Helena Hauff, Kobosil), Club, Event oder Subgenre..."
              className="w-full pl-10 pr-4 py-2.5 bg-neutral-950 border border-neutral-700 rounded-lg text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-lime-400 font-mono transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-white"
              >
                Zurücksetzen
              </button>
            )}
          </div>

          {/* Quick Filter Selects */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Club select */}
            <select
              value={selectedClubId}
              onChange={(e) => setSelectedClubId(e.target.value)}
              className="px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-xs font-mono text-neutral-200 focus:outline-none focus:border-lime-400"
            >
              <option value="all">Alle Clubs ({clubs.length})</option>
              {clubs.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.neighborhood})
                </option>
              ))}
            </select>

            {/* Genre select */}
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-xs font-mono text-neutral-200 focus:outline-none focus:border-lime-400"
            >
              <option value="all">Alle Genres ({allGenres.length})</option>
              {allGenres.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Filter Pills & Status Counters */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-800/80 text-xs">
          <div className="flex flex-wrap items-center gap-1.5 font-mono">
            <span className="text-neutral-500 mr-1">Zeitfenster:</span>
            
            {/* HEUTE (31. Okt) */}
            <button
              onClick={() => setDateFilter('today')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg transition ${
                dateFilter === 'today'
                  ? 'bg-lime-400 text-black font-black shadow-lg shadow-lime-400/20'
                  : 'bg-lime-950/60 text-lime-400 border border-lime-500/40 hover:bg-lime-900/40'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-lime-400 animate-ping"></span>
              <span>HEUTE (31. Okt • {todayEventsCount} Events)</span>
            </button>

            {/* Nächste 2 Wochen */}
            <button
              onClick={() => setDateFilter('twoweeks')}
              className={`px-2.5 py-1 rounded transition ${
                dateFilter === 'twoweeks'
                  ? 'bg-lime-400 text-black font-bold'
                  : 'bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700'
              }`}
            >
              Nächste 2 Wochen ({twoWeeksEventsCount})
            </button>

            {/* Wochenende */}
            <button
              onClick={() => setDateFilter('weekend')}
              className={`px-2.5 py-1 rounded transition ${
                dateFilter === 'weekend'
                  ? 'bg-lime-400 text-black font-bold'
                  : 'bg-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              Wochenende
            </button>

            {/* Alle Events */}
            <button
              onClick={() => setDateFilter('all')}
              className={`px-2.5 py-1 rounded transition ${
                dateFilter === 'all'
                  ? 'bg-neutral-200 text-black font-bold'
                  : 'bg-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              Alle ({events.length})
            </button>

            {/* Vom Agenten entdeckt */}
            <button
              onClick={() => setDateFilter('agent')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded transition ${
                dateFilter === 'agent'
                  ? 'bg-cyan-400 text-black font-bold'
                  : 'bg-cyan-950/60 text-cyan-400 border border-cyan-800/60 hover:bg-cyan-900/40'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              KI-Agent
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-neutral-400 font-mono">
            <span>
              Zeige <strong className="text-lime-400">{filteredEvents.length}</strong> von {events.length} Events
            </span>
            {onExportCSV && (
              <button
                onClick={onExportCSV}
                title="Tabelle als CSV herunterladen"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 text-xs rounded-lg transition"
              >
                <Download className="w-3.5 h-3.5 text-lime-400" />
                <span>Events .CSV</span>
              </button>
            )}

            {currentUser && onOpenAddEvent && (
              <button
                onClick={onOpenAddEvent}
                title="Neues Event als Administrator hinzufügen"
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-lime-400 hover:bg-lime-300 text-black font-black text-xs rounded-lg transition shadow-sm font-mono"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>+ Event anlegen</span>
              </button>
            )}

            <button
              onClick={onTriggerScan}
              disabled={isScanning}
              className="inline-flex items-center gap-1.5 text-xs text-lime-400 hover:text-lime-300 font-semibold underline disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
              {isScanning ? 'Agent scannt...' : 'Jetzt scannen'}
            </button>
          </div>
        </div>

        {/* Awareness & Today Highlight Banner */}
        <div className="p-3 bg-gradient-to-r from-lime-950/40 via-neutral-950 to-purple-950/30 border border-lime-500/30 rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-neutral-200">
            <span className="px-2 py-0.5 rounded bg-lime-400 text-black font-bold text-[10px]">
              {todayEventsCount} HEUTE
            </span>
            <span>
              <strong>{selectedCity === 'Alle' ? 'Hamburg & Berlin' : selectedCity} Clubnächte:</strong> {todayEventsCount} Events heute aktiv. In ausnahmslos allen Locations gilt: <em>Awareness-Team vor Ort & Nulltoleranz für Diskriminierung.</em>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-purple-400 flex items-center gap-1 font-semibold">
              <HeartHandshake className="w-3 h-3" />
              Awareness-Team ansprechbar
            </span>
            {dateFilter !== 'today' && todayEventsCount > 0 && (
              <button
                onClick={() => setDateFilter('today')}
                className="text-lime-400 hover:underline text-[11px] font-bold ml-2"
              >
                {todayEventsCount} Events für heute anzeigen →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Responsive Table */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-950 border-b border-neutral-800 text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                
                {/* Spalte 1: Datum & Uhrzeit */}
                <th
                  onClick={() => toggleSort('date')}
                  className="py-3.5 px-4 font-semibold cursor-pointer hover:text-lime-400 transition"
                >
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Datum & Uhrzeit</span>
                    <ArrowUpDown className="w-3 h-3 text-neutral-600" />
                  </div>
                </th>

                {/* Spalte 2: Club & Stadtteil */}
                <th
                  onClick={() => toggleSort('club')}
                  className="py-3.5 px-4 font-semibold cursor-pointer hover:text-lime-400 transition"
                >
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Club & Stadtteil</span>
                    <ArrowUpDown className="w-3 h-3 text-neutral-600" />
                  </div>
                </th>

                {/* Spalte 3: Event & Subgenres */}
                <th className="py-3.5 px-4 font-semibold">
                  <span>Event & Subgenres</span>
                </th>

                {/* Spalte 4: Lineup / DJs */}
                <th className="py-3.5 px-4 font-semibold min-w-[200px]">
                  <span>Lineup / DJs</span>
                </th>

                {/* Spalte 5: Preise */}
                <th
                  onClick={() => toggleSort('price')}
                  className="py-3.5 px-4 font-semibold cursor-pointer hover:text-lime-400 transition"
                >
                  <div className="flex items-center gap-1.5">
                    <Ticket className="w-3.5 h-3.5" />
                    <span>Preise (VVK / AK)</span>
                    <ArrowUpDown className="w-3 h-3 text-neutral-600" />
                  </div>
                </th>

                {/* Spalte 6: Türpolitik & Awareness */}
                <th className="py-3.5 px-4 font-semibold">
                  <div className="flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Tür & Awareness</span>
                  </div>
                </th>

                {/* Spalte 7: Direkttickets */}
                <th className="py-3.5 px-4 font-semibold text-center">
                  <span>Direkttickets</span>
                </th>

                {/* Spalte 8: Standort & HVV */}
                <th className="py-3.5 px-4 font-semibold text-center">
                  <span>Standort & HVV</span>
                </th>

                {/* Spalte 9: Details */}
                <th className="py-3.5 px-4 font-semibold text-right">
                  <span>Details</span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-800/80 text-xs text-neutral-300">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-neutral-500">
                    <div className="max-w-md mx-auto space-y-2">
                      <p className="text-base text-neutral-400">Keine Events für die gewählten Filterkriterien gefunden.</p>
                      <p className="text-xs">Setze die Filter zurück oder starte den autonomen Web-Agenten für Hamburg.</p>
                      <button
                        onClick={onTriggerScan}
                        className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-lime-400 hover:bg-lime-300 text-black font-bold text-xs rounded-lg transition"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        Jetzt mit KI-Agenten nach Events suchen
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredEvents.map((evt) => {
                  const club = clubMap.get(evt.clubId);
                  const dateObj = new Date(evt.date + 'T12:00:00');
                  const dayName = dateObj.toLocaleDateString('de-DE', { weekday: 'short' });
                  const dateShort = dateObj.toLocaleDateString('de-DE', { day: '2-digit', month: 'short' });

                  const isToday = evt.date === '2026-10-31';

                  // Navigation links
                  const gmapsUrl = club 
                    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(club.name + ' ' + club.address + ' Hamburg')}`
                    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(evt.clubName + ' Hamburg')}`;

                  return (
                    <tr
                      key={evt.id}
                      className="hover:bg-neutral-800/50 transition duration-150 group"
                    >
                      {/* 1. Datum & Uhrzeit */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded font-mono font-bold capitalize text-[11px] ${
                            isToday
                              ? 'bg-lime-400 text-black border border-lime-300 shadow-sm shadow-lime-400/30'
                              : 'bg-neutral-800 border border-neutral-700 text-neutral-200'
                          }`}>
                            {isToday ? 'HEUTE' : dayName}
                          </span>
                          <div>
                            <div className="font-bold text-white text-xs flex items-center gap-1.5">
                              <span>{dateShort}</span>
                              {isToday && (
                                <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-lime-950 text-lime-400 border border-lime-600/60 font-black">
                                  HEUTE NACHT
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-neutral-400 font-mono flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3 text-lime-400" />
                              {evt.startTime} Uhr
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 2. Club & Stadtteil */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-neutral-100 flex items-center gap-1.5">
                          <span>{evt.clubName}</span>
                          {evt.isAgentDiscovered && (
                            <span title="Vom KI-Agenten entdeckt">
                              <Sparkles className="w-3 h-3 text-cyan-400" />
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 mt-0.5 text-[11px] text-neutral-400">
                          <span className="px-1.5 py-0.2 rounded bg-neutral-800 text-lime-400 font-mono text-[10px] font-bold">
                            {evt.city || club?.city || 'Hamburg'}
                          </span>
                          <span className="px-1.5 py-0.2 rounded bg-neutral-800 font-mono text-[10px]">
                            {club?.neighborhood || ''}
                          </span>
                          {club?.transit.station && (
                            <span className="text-neutral-500 truncate max-w-[100px] text-[10px]" title={club.transit.station}>
                              • {club.transit.station.split(' ')[0]}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 3. Event & Subgenres */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => onSelectEvent(evt)}
                          className="font-bold text-white hover:text-lime-400 transition text-left block"
                        >
                          {evt.title}
                        </button>
                        <div className="flex flex-wrap gap-1 mt-1 max-w-[260px]">
                          {evt.genres.slice(0, 2).map((g, i) => (
                            <span
                              key={i}
                              className="px-1.5 py-0.5 bg-neutral-950 text-neutral-400 border border-neutral-800 rounded text-[10px] font-mono"
                            >
                              {g}
                            </span>
                          ))}
                          {evt.genres.length > 2 && (
                            <span className="text-[10px] text-neutral-500 font-mono">
                              +{evt.genres.length - 2}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 4. Lineup / DJs */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <div className="font-semibold text-neutral-200 line-clamp-1">
                            {evt.lineup.slice(0, 3).map((artist, idx) => (
                              <span key={idx} className={artist.role === 'Headliner' ? 'text-lime-300 font-bold' : ''}>
                                {artist.name}
                                {idx < Math.min(evt.lineup.length - 1, 2) ? ', ' : ''}
                              </span>
                            ))}
                          </div>
                          {evt.lineup.length > 3 && (
                            <div className="text-[10px] text-neutral-400 font-mono">
                              + {evt.lineup.length - 3} weitere DJs
                            </div>
                          )}
                        </div>
                      </td>

                      {/* 5. Preise */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-mono font-bold text-lime-300">
                          {evt.price.presale ? `${evt.price.presale} €` : (evt.price.door ? `${evt.price.door} €` : 'N/A')}
                        </div>
                        <div className="text-[10px] text-neutral-400 font-mono">
                          {evt.price.presale && evt.price.door 
                            ? `AK: ${evt.price.door} €`
                            : (evt.price.presale ? 'VVK' : 'Nur Abendkasse')}
                        </div>
                      </td>

                      {/* 6. Tür & Awareness */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            (club?.doorPolicy.strictness || 'Moderat') === 'Streng' || (club?.doorPolicy.strictness || 'Moderat') === 'Estricta'
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : (club?.doorPolicy.strictness || 'Moderat') === 'Moderat' || (club?.doorPolicy.strictness || 'Moderat') === 'Moderada'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          }`}>
                            Tür {club?.doorPolicy.strictness || 'Moderat'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-[10px] text-purple-400 font-mono">
                          <HeartHandshake className="w-3 h-3 shrink-0" />
                          <span className="truncate max-w-[130px]" title="Awareness-Team vor Ort">Awareness aktiv</span>
                        </div>
                      </td>

                      {/* 7. Direkttickets */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <a
                          href={evt.ticketUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-lime-400 hover:bg-lime-300 text-black font-bold text-xs rounded-lg transition shadow-md shadow-lime-400/10"
                        >
                          <Ticket className="w-3.5 h-3.5" />
                          <span>Kaufen</span>
                          <ExternalLink className="w-3 h-3 ml-0.5" />
                        </a>
                        <div className="text-[10px] text-neutral-400 font-mono mt-1">
                          {evt.ticketProvider}
                        </div>
                      </td>

                      {/* 8. Standort & HVV */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <a
                            href={gmapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="In Google Maps öffnen"
                            className="p-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-neutral-300 hover:text-white border border-neutral-700 transition"
                          >
                            <MapPin className="w-3.5 h-3.5 text-lime-400" />
                          </a>
                          
                          {club && (
                            <button
                              onClick={() => onNavigateToMap(club.id)}
                              title="Auf Karte zentrieren"
                              className="p-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-neutral-300 hover:text-white border border-neutral-700 transition"
                            >
                              <Navigation className="w-3.5 h-3.5 text-yellow-400" />
                            </button>
                          )}
                        </div>
                        {club && (
                          <div className="text-[10px] text-neutral-400 font-mono mt-1">
                            ~{club.transit.walkMinutes} Min. Fußweg
                          </div>
                        )}
                      </td>

                      {/* 9. Details & Admin Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {currentUser && onDeleteEvent && (
                            <button
                              onClick={() => {
                                if (window.confirm(`Event "${evt.title}" wirklich löschen?`)) {
                                  onDeleteEvent(evt.id);
                                }
                              }}
                              title="Event als Administrator löschen"
                              className="p-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-200 border border-red-800/60 rounded-lg transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => onSelectEvent(evt)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs rounded-lg border border-neutral-700 transition"
                          >
                            <span>Fakten</span>
                            <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info banner */}
        <div className="p-3 bg-neutral-950 border-t border-neutral-800 flex flex-wrap items-center justify-between text-xs text-neutral-400 font-mono">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-lime-400" />
            <span>Preise, Einlasspolitik & Awareness-Regeln werden laufend durch den Such-Agenten abgeglichen.</span>
          </div>
          <div>
            Hamburg • Zeitzone: Mitteleuropäische Zeit (MEZ/CET)
          </div>
        </div>

      </div>
    </div>
  );
};
