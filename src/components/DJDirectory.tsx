import React, { useState, useMemo } from 'react';
import { DJProfile } from '../types/index.ts';
import { 
  Headphones, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Disc3, 
  Calendar, 
  Sliders, 
  MapPin, 
  Download, 
  ExternalLink,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { exportDJsToCSV } from '../utils/csvExport.ts';

interface DJDirectoryProps {
  djs: DJProfile[];
  selectedCity: string;
  onSelectCity: (city: string) => void;
  onSelectDJ: (dj: DJProfile) => void;
}

export const DJDirectory: React.FC<DJDirectoryProps> = ({
  djs,
  selectedCity,
  onSelectCity,
  onSelectDJ,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [onlyMissingFilter, setOnlyMissingFilter] = useState(false);

  // Available unique roles
  const roles = useMemo(() => {
    const set = new Set<string>();
    djs.forEach((dj) => {
      if (dj.role) set.add(dj.role);
    });
    return Array.from(set);
  }, [djs]);

  // Filtered DJs
  const filteredDJs = useMemo(() => {
    return djs.filter((dj) => {
      // City check
      if (selectedCity && selectedCity.toLowerCase() !== 'alle' && selectedCity.toLowerCase() !== 'all') {
        if (dj.city && dj.city.toLowerCase() !== selectedCity.toLowerCase()) {
          return false;
        }
      }

      // Role check
      if (selectedRole !== 'all' && dj.role !== selectedRole) {
        return false;
      }

      // Missing attributes only filter
      if (onlyMissingFilter) {
        if (!dj.missingAttributes || dj.missingAttributes.length === 0) {
          return false;
        }
      }

      // Search query check
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesArtist = dj.artistName.toLowerCase().includes(q);
        const matchesRealName = dj.realName ? dj.realName.toLowerCase().includes(q) : false;
        const matchesBio = dj.bio ? dj.bio.toLowerCase().includes(q) : false;
        const matchesGenres = dj.genres.some((g) => g.toLowerCase().includes(q));
        const matchesClubs = dj.residentClubs.some((c) => c.toLowerCase().includes(q));
        const matchesGear = dj.gearEquipment ? dj.gearEquipment.toLowerCase().includes(q) : false;

        if (!matchesArtist && !matchesRealName && !matchesBio && !matchesGenres && !matchesClubs && !matchesGear) {
          return false;
        }
      }

      return true;
    });
  }, [djs, selectedCity, selectedRole, onlyMissingFilter, searchQuery]);

  // Count unverified / incomplete entries
  const incompleteCount = useMemo(() => {
    return djs.filter((d) => d.missingAttributes && d.missingAttributes.length > 0).length;
  }, [djs]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded bg-lime-400 text-black text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Headphones className="w-3.5 h-3.5" />
                ARTIST RADAR
              </span>
              <span className="text-xs font-mono text-neutral-400">
                Echtes Standard-JSON & Zero-Halluzination
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              DJ & Live-Act Verzeichnis
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl font-sans">
              Reale Künstlerprofile aus Hamburg & Berlin mit Diskografie, Live-Equipment, Residencies und transparenter Kennzeichnung fehlender Web-Daten.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-center shrink-0">
            <button
              onClick={() => exportDJsToCSV(filteredDJs)}
              className="flex items-center gap-2 px-3.5 py-2.5 bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 text-neutral-200 border border-neutral-700 hover:border-neutral-500 rounded-xl text-xs font-mono transition shadow-sm touch-manipulation min-h-[44px]"
              title="Aktuelle DJ-Liste als CSV mit Zero-Halluzinations-Audit herunterladen"
            >
              <Download className="w-4 h-4 text-lime-400" />
              <span>DJs als CSV exportieren</span>
            </button>
          </div>
        </div>

        {/* Global Zero-Hallucination Policy Alert in Directory */}
        {incompleteCount > 0 && (
          <div className="mt-4 p-3.5 bg-amber-950/40 border border-amber-500/60 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start sm:items-center gap-2.5 text-amber-300">
              <ShieldAlert className="w-5 h-5 shrink-0 text-amber-400 mt-0.5 sm:mt-0" />
              <div>
                <strong className="font-mono text-amber-300">Zero-Halluzinations-Schutz aktiv:</strong>{' '}
                <span>
                  {incompleteCount} von {djs.length} DJs weisen unvollständige Web-Daten auf (z. B. Bürgerlicher Name, Studio-Gear, Booking-E-Mail). Diese wurden sauber leer gelassen und rot markiert statt fingiert.
                </span>
              </div>
            </div>
            <button
              onClick={() => setOnlyMissingFilter(!onlyMissingFilter)}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition whitespace-nowrap self-start sm:self-auto touch-manipulation min-h-[38px] ${
                onlyMissingFilter
                  ? 'bg-amber-400 text-black'
                  : 'bg-amber-900/60 hover:bg-amber-800 text-amber-200 border border-amber-500/50'
              }`}
            >
              {onlyMissingFilter ? '✓ Nur unvollständige DJs' : 'Filter: Fehlende Attribute'}
            </button>
          </div>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="DJ-Name, Genre, Resident-Club, Equipment suchen..."
              className="w-full pl-10 pr-4 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-lime-400 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs font-mono"
              >
                Löschen
              </button>
            )}
          </div>

          {/* City Toggle */}
          <div className="flex items-center gap-1.5 bg-neutral-950 p-1 rounded-xl border border-neutral-800 shrink-0 overflow-x-auto">
            {['Alle', 'Hamburg', 'Berlin', 'Wien', 'Köln'].map((c) => {
              const active =
                (c === 'Alle' && (!selectedCity || selectedCity.toLowerCase() === 'alle' || selectedCity.toLowerCase() === 'all')) ||
                selectedCity.toLowerCase() === c.toLowerCase();
              return (
                <button
                  key={c}
                  onClick={() => onSelectCity(c === 'Alle' ? 'Alle' : c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition touch-manipulation min-h-[36px] ${
                    active
                      ? 'bg-lime-400 text-black'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>

          {/* Role Filter */}
          <div className="shrink-0">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full md:w-auto px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs font-mono text-neutral-200 focus:outline-none focus:border-lime-400"
            >
              <option value="all">Alle Rollen ({djs.length})</option>
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r.replace('_', ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-neutral-400 pt-2 border-t border-neutral-800">
          <div>
            Gefiltert: <strong className="text-white">{filteredDJs.length}</strong> DJs
            {selectedCity && selectedCity !== 'Alle' && <span> in <strong className="text-lime-300">{selectedCity}</strong></span>}
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {djs.filter((d) => d.isVerified).length} Verifiziert
            </span>
            {incompleteCount > 0 && (
              <span className="flex items-center gap-1 text-amber-400">
                <AlertTriangle className="w-3.5 h-3.5" />
                {incompleteCount} mit fehlenden Web-Daten
              </span>
            )}
          </div>
        </div>
      </div>

      {/* DJ Card Grid */}
      {filteredDJs.length === 0 ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-12 text-center space-y-3">
          <Headphones className="w-12 h-12 text-neutral-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">Keine DJs gefunden</h3>
          <p className="text-neutral-400 text-xs max-w-md mx-auto">
            Passen Sie den Suchbegriff oder die Filter für Stadt und Rolle an.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedRole('all');
              setOnlyMissingFilter(false);
            }}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-lime-400 text-xs font-mono rounded-lg transition"
          >
            Filter zurücksetzen
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDJs.map((dj) => {
            const hasMissing = dj.missingAttributes && dj.missingAttributes.length > 0;
            const cityLabel = dj.city ? dj.city.charAt(0).toUpperCase() + dj.city.slice(1) : 'Berlin';

            return (
              <div
                key={dj.id}
                onClick={() => onSelectDJ(dj)}
                className="group relative bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-lime-400/60 rounded-2xl overflow-hidden transition duration-200 cursor-pointer flex flex-col shadow-lg"
              >
                {/* Banner / Header Top */}
                <div className="relative h-28 bg-neutral-950 overflow-hidden border-b border-neutral-800">
                  {dj.bannerUrl ? (
                    <img
                      src={dj.bannerUrl}
                      alt={dj.artistName}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300 filter brightness-75"
                      onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-3 text-center bg-neutral-950 text-neutral-600 font-mono text-[11px]">
                      Kein Banner im Web verzeichnet
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-black/40" />

                  {/* Top tags */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-lime-400 text-black text-[10px] font-mono font-bold uppercase">
                      {cityLabel}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-neutral-300 text-[10px] font-mono uppercase">
                      {dj.role.replace('_', ' ')}
                    </span>
                  </div>

                  {dj.isVerified && (
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/90 border border-emerald-500/80 text-emerald-300 text-[10px] font-mono font-bold">
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      <span>VERIFIZIERT</span>
                    </div>
                  )}
                </div>

                {/* Avatar and Main Info */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col space-y-3.5">
                  <div className="flex items-start gap-3 -mt-9 relative z-10">
                    <img
                      src={dj.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(dj.artistName)}`}
                      alt={dj.artistName}
                      className="w-14 h-14 rounded-xl bg-neutral-950 border-2 border-lime-400 object-cover shadow-md shrink-0"
                    />
                    <div className="space-y-0.5 flex-1 min-w-0 pt-4">
                      <h3 className="text-lg font-bold text-white group-hover:text-lime-300 transition truncate">
                        {dj.artistName}
                      </h3>
                      {dj.realName ? (
                        <div className="text-xs text-neutral-400 font-mono truncate">
                          {dj.realName}
                        </div>
                      ) : (
                        <div className="text-[10px] font-mono text-rose-300 bg-rose-950/60 border border-rose-500/50 px-1.5 py-0.5 rounded inline-block font-bold">
                          ❌ Bürgerl. Name: Nicht ermittelt
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Genres */}
                  <div className="flex flex-wrap gap-1">
                    {dj.genres.slice(0, 3).map((g, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-neutral-950 text-neutral-300 border border-neutral-800 text-[10px] font-mono font-medium"
                      >
                        #{g}
                      </span>
                    ))}
                    {dj.genres.length > 3 && (
                      <span className="px-1.5 py-0.5 rounded bg-neutral-950 text-neutral-500 text-[10px] font-mono">
                        +{dj.genres.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Bio Preview */}
                  <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed font-sans">
                    {dj.bio || 'Keine Biografie im Web auffindbar (Keine Erfindung).'}
                  </p>

                  {/* Resident Clubs & Gear Stats */}
                  <div className="space-y-1.5 text-xs font-mono text-neutral-400 pt-1 border-t border-neutral-800/80">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                      <span className="truncate">
                        Residencies:{' '}
                        {dj.residentClubs && dj.residentClubs.length > 0 ? (
                          <strong className="text-neutral-200">
                            {dj.residentClubs.slice(0, 2).join(', ')}
                            {dj.residentClubs.length > 2 && ` (+${dj.residentClubs.length - 2})`}
                          </strong>
                        ) : (
                          <span className="text-neutral-500">Keine</span>
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">
                        Gear:{' '}
                        {dj.gearEquipment ? (
                          <span className="text-cyan-200">{dj.gearEquipment}</span>
                        ) : (
                          <span className="text-rose-400 font-bold">❌ Nicht ermittelt</span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* HIGH-VISIBILITY ZERO-HALLUCINATION HIGHLIGHT BOX IF INCOMPLETE */}
                  {hasMissing && (
                    <div className="p-2.5 bg-amber-950/60 border border-amber-500/70 rounded-xl space-y-1.5 text-[11px] font-mono shadow-sm">
                      <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
                        <span>⚠️ {dj.missingAttributes?.length} fehlende Web-Attribute</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {dj.missingAttributes?.map((attr, aIdx) => (
                          <span
                            key={aIdx}
                            className="px-1.5 py-0.5 bg-black/70 border border-rose-500/80 rounded text-[10px] text-rose-300 font-bold"
                          >
                            ❌ {attr}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Releases & Gigs Badges */}
                  <div className="flex items-center justify-between pt-2 border-t border-neutral-800 text-[11px] font-mono text-neutral-400 mt-auto">
                    <span className="flex items-center gap-1">
                      <Disc3 className="w-3 h-3 text-lime-400" />
                      {dj.releases?.length || 0} Releases
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-yellow-400" />
                      {dj.upcomingGigs?.length || 0} Gigs
                    </span>
                    <span className="flex items-center gap-1 text-lime-400 font-bold group-hover:translate-x-0.5 transition">
                      Profil <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
