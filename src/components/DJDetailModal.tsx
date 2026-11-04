import React from 'react';
import { DJProfile } from '../types/index.ts';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Headphones, 
  Music, 
  Disc3, 
  Calendar, 
  MapPin, 
  ExternalLink, 
  Mail, 
  Sliders, 
  Radio, 
  Instagram,
  Sparkles
} from 'lucide-react';

interface DJDetailModalProps {
  dj: DJProfile | null;
  onClose: () => void;
  onSelectEventVenue?: (venue: string) => void;
}

export const DJDetailModal: React.FC<DJDetailModalProps> = ({
  dj,
  onClose,
  onSelectEventVenue,
}) => {
  if (!dj) return null;

  const cityLabel = dj.city ? dj.city.charAt(0).toUpperCase() + dj.city.slice(1) : 'Berlin';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl text-neutral-100 flex flex-col my-auto">
        
        {/* Banner image if available */}
        {dj.bannerUrl ? (
          <div className="relative w-full h-44 sm:h-56 bg-neutral-950 overflow-hidden border-b border-neutral-800">
            <img 
              src={dj.bannerUrl} 
              alt={dj.artistName} 
              className="w-full h-full object-cover object-center filter brightness-90"
              onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/50 to-transparent" />
          </div>
        ) : (
          <div className="w-full p-2 bg-rose-950/40 border-b border-rose-500/40 text-center text-xs font-mono text-rose-300">
            ⚠️ Kein offizielles Künstler-Banner im Web auffindbar (Kein Dummy-Bild erfunden)
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-xl bg-black/70 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 transition"
          aria-label="Schließen"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Header */}
        <div className="p-5 sm:p-7 border-b border-neutral-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Avatar */}
            <div className="relative shrink-0">
              <img 
                src={dj.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(dj.artistName)}`} 
                alt={dj.artistName}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-neutral-950 border-2 border-lime-400 object-cover shadow-xl"
              />
              {dj.isVerified && (
                <div 
                  className="absolute -bottom-1 -right-1 p-1 bg-lime-400 text-black rounded-full shadow"
                  title="Verifizierter Szene-Künstler"
                >
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}
            </div>

            {/* Title & Real Name */}
            <div className="space-y-1 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-lime-400 text-black text-[11px] font-mono font-bold uppercase">
                  {cityLabel}
                </span>
                <span className="px-2.5 py-0.5 rounded bg-neutral-800 text-neutral-300 text-[11px] font-mono uppercase font-semibold">
                  {dj.role.replace('_', ' ')}
                </span>
                {dj.isVerified && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 text-[10px] font-mono font-bold">
                    <Sparkles className="w-3 h-3" />
                    VERIFIZIERT
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {dj.artistName}
              </h2>

              <div className="text-xs font-mono text-neutral-300">
                <span className="text-neutral-500">Bürgerlicher Name: </span>
                {dj.realName ? (
                  <strong className="text-neutral-200">{dj.realName}</strong>
                ) : (
                  <span className="px-1.5 py-0.5 bg-rose-950/80 border border-rose-500/80 text-rose-300 text-[10px] rounded font-bold">
                    ⚠️ Nicht öffentlich verifiziert (Keine Erfindung)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Genres Tags */}
          <div className="flex flex-wrap gap-1.5 mt-4">
            {dj.genres.map((g, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-neutral-950 text-neutral-300 border border-neutral-700 text-xs font-mono font-semibold"
              >
                #{g}
              </span>
            ))}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 space-y-6">

          {/* ZERO-HALLUZINATION WARNING BANNER (HIGH VISIBILITY) */}
          {dj.missingAttributes && dj.missingAttributes.length > 0 && (
            <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-950/80 via-neutral-950 to-neutral-950 border-2 border-amber-500 rounded-xl space-y-3 shadow-lg shadow-amber-950/50">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm sm:text-base font-mono">
                <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400 animate-pulse" />
                <span>⚠️ ZERO-HALLUZINATION: {dj.missingAttributes.length} DJ-ATTRIBUTE FEHLEN IM WEB</span>
              </div>
              <p className="font-sans text-neutral-200 text-xs sm:text-sm leading-relaxed">
                Gemäß Vorgabe wurden <strong>keinerlei Daten fingiert oder erfunden</strong>. Folgende Attribute konnten für {dj.artistName} im Web nicht verifiziert werden und wurden leer gelassen:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1">
                {dj.missingAttributes.map((attr, idx) => (
                  <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-black/80 border border-rose-500/80 rounded-lg text-rose-300 font-mono text-xs shadow-sm">
                    <span className="text-rose-400 font-bold">❌</span>
                    <span className="font-bold">{attr}:</span>
                    <span className="text-neutral-400">Nicht ermittelt</span>
                  </div>
                ))}
              </div>
              {dj.searchSuggestions && dj.searchSuggestions.length > 0 && (
                <div className="mt-3 pt-3 border-t border-amber-900/60 font-sans text-neutral-300">
                  <span className="font-bold text-amber-300 block font-mono text-xs mb-1.5">
                    💡 Tipps zur Suchoptimierung:
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-neutral-300 text-xs">
                    {dj.searchSuggestions.map((sugg, sIdx) => (
                      <li key={sIdx} className="text-neutral-300 font-mono text-[11px]">{sugg}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Bio Section */}
          <div className="p-4 bg-neutral-950/80 border border-neutral-800 rounded-xl space-y-2">
            <h4 className="text-xs uppercase font-mono tracking-wider text-neutral-400 flex items-center gap-1.5">
              <Headphones className="w-3.5 h-3.5 text-lime-400" />
              Biografie & Soundkonzept
            </h4>
            <p className="text-sm text-neutral-200 leading-relaxed font-sans">
              {dj.bio || (
                <span className="text-rose-400 font-mono text-xs italic">
                  ⚠️ Keine Biografie im Web auffindbar (Nicht erfunden).
                </span>
              )}
            </p>
          </div>

          {/* Resident Clubs & Gear Equipment Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Resident Clubs */}
            <div className="p-4 bg-neutral-950/80 border border-neutral-800 rounded-xl space-y-2">
              <h4 className="text-xs uppercase font-mono tracking-wider text-neutral-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-lime-400" />
                Residency Clubs ({dj.residentClubs.length})
              </h4>
              {dj.residentClubs && dj.residentClubs.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {dj.residentClubs.map((club, idx) => (
                    <span 
                      key={idx}
                      className="px-2.5 py-1 bg-neutral-900 border border-neutral-700 text-neutral-200 text-xs font-mono font-bold rounded-lg"
                    >
                      {club}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="px-2 py-0.5 bg-rose-950/80 border border-rose-500/80 text-rose-300 text-xs font-mono font-bold rounded">
                  ⚠️ Keine Resident-Clubs verzeichnet
                </span>
              )}
            </div>

            {/* Gear & Hardware Equipment */}
            <div className="p-4 bg-neutral-950/80 border border-neutral-800 rounded-xl space-y-2">
              <h4 className="text-xs uppercase font-mono tracking-wider text-neutral-400 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                Live Setup / Studio Gear
              </h4>
              {dj.gearEquipment ? (
                <div className="p-2.5 bg-neutral-900 border border-neutral-700 rounded-lg text-xs font-mono text-cyan-200">
                  {dj.gearEquipment}
                </div>
              ) : (
                <span className="px-2 py-0.5 bg-rose-950/80 border border-rose-500/80 text-rose-300 text-xs font-mono font-bold rounded">
                  ⚠️ Kein Equipment im Web ermittelt (Nicht erfunden)
                </span>
              )}
            </div>

          </div>

          {/* Releases / Discography */}
          <div className="p-4 bg-neutral-950/80 border border-neutral-800 rounded-xl space-y-3">
            <h4 className="text-xs uppercase font-mono tracking-wider text-neutral-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Disc3 className="w-4 h-4 text-lime-400" />
                Wichtige Veröffentlichungen & EPs ({dj.releases.length})
              </span>
            </h4>
            {dj.releases && dj.releases.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {dj.releases.map((rel, idx) => (
                  <div key={idx} className="p-3 bg-neutral-900 border border-neutral-800 rounded-lg flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-white">{rel.title}</div>
                      <div className="text-xs text-neutral-400 font-mono">
                        {rel.label} • {rel.year}
                      </div>
                    </div>
                    {rel.link && (
                      <a 
                        href={rel.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-md transition"
                        title="Veröffentlichung ansehen"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-lime-400" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-2.5 bg-rose-950/40 border border-rose-500/40 rounded-lg text-xs font-mono text-rose-300 font-bold">
                ⚠️ Keine Diskografie-Einträge im Web auffindbar (Keine Erfindung)
              </div>
            )}
          </div>

          {/* Upcoming Gigs */}
          <div className="p-4 bg-neutral-950/80 border border-neutral-800 rounded-xl space-y-3">
            <h4 className="text-xs uppercase font-mono tracking-wider text-neutral-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-yellow-400" />
                Kommende Gigs & Festival-Dates ({dj.upcomingGigs.length})
              </span>
            </h4>
            {dj.upcomingGigs && dj.upcomingGigs.length > 0 ? (
              <div className="space-y-2">
                {dj.upcomingGigs.map((gig, idx) => (
                  <div key={idx} className="p-3 bg-neutral-900 border border-neutral-800 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="text-sm font-bold text-white">{gig.title}</div>
                      <div className="text-xs text-neutral-400 font-mono flex items-center gap-2 mt-0.5">
                        <span className="text-lime-300 font-semibold">{gig.date}</span>
                        <span>•</span>
                        <span className="text-neutral-200">{gig.venue} ({gig.city})</span>
                      </div>
                    </div>
                    {onSelectEventVenue && (
                      <button
                        onClick={() => {
                          onClose();
                          onSelectEventVenue(gig.venue);
                        }}
                        className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-lime-300 text-xs font-mono rounded border border-neutral-700 transition self-start sm:self-auto"
                      >
                        Club auf Karte
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-2.5 bg-rose-950/40 border border-rose-500/40 rounded-lg text-xs font-mono text-rose-300 font-bold">
                ⚠️ Keine anstehenden Tour-Daten im Web verzeichnet
              </div>
            )}
          </div>

          {/* Audio & Social Profiles */}
          <div className="p-4 bg-neutral-950/80 border border-neutral-800 rounded-xl space-y-3">
            <h4 className="text-xs uppercase font-mono tracking-wider text-neutral-400 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-lime-400" />
              Offizielle Kanäle & Hörproben
            </h4>
            <div className="flex flex-wrap gap-2">
              {dj.soundCloudUrl ? (
                <a
                  href={dj.soundCloudUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-orange-400 border border-orange-500/30 rounded-lg text-xs font-mono transition"
                >
                  <Music className="w-4 h-4" />
                  <span>SoundCloud</span>
                  <ExternalLink className="w-3 h-3 ml-1 text-neutral-400" />
                </a>
              ) : (
                <span className="px-2.5 py-2 bg-neutral-900/60 border border-neutral-800 text-neutral-500 text-xs font-mono rounded-lg">
                  Kein SoundCloud
                </span>
              )}

              {dj.spotifyUrl ? (
                <a
                  href={dj.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-mono transition"
                >
                  <Music className="w-4 h-4" />
                  <span>Spotify</span>
                  <ExternalLink className="w-3 h-3 ml-1 text-neutral-400" />
                </a>
              ) : (
                <span className="px-2.5 py-2 bg-neutral-900/60 border border-neutral-800 text-neutral-500 text-xs font-mono rounded-lg">
                  Kein Spotify
                </span>
              )}

              {dj.instagramUrl ? (
                <a
                  href={dj.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-pink-400 border border-pink-500/30 rounded-lg text-xs font-mono transition"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Instagram</span>
                  <ExternalLink className="w-3 h-3 ml-1 text-neutral-400" />
                </a>
              ) : (
                <span className="px-2.5 py-2 bg-neutral-900/60 border border-neutral-800 text-neutral-500 text-xs font-mono rounded-lg">
                  Kein Instagram
                </span>
              )}

              {dj.bookingEmail ? (
                <a
                  href={`mailto:${dj.bookingEmail}`}
                  className="flex items-center gap-1.5 px-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-lime-400 border border-lime-500/30 rounded-lg text-xs font-mono transition ml-auto"
                >
                  <Mail className="w-4 h-4" />
                  <span>Booking: {dj.bookingEmail}</span>
                </a>
              ) : (
                <span className="px-2.5 py-2 bg-rose-950/60 border border-rose-500/60 text-rose-300 text-xs font-mono rounded-lg font-bold ml-auto">
                  ⚠️ Keine Booking-Mail ermittelt
                </span>
              )}
            </div>
          </div>

          {/* Audit Footer */}
          <div className="pt-3 border-t border-neutral-800 flex flex-wrap items-center justify-between text-[11px] font-mono text-neutral-500">
            <span>ID: <strong className="text-neutral-300">{dj.id}</strong></span>
            <span>Erfasst von: <strong className="text-neutral-300">{dj.createdBy || 'System'}</strong></span>
            <span>Synchronisiert: <strong className="text-neutral-300">{new Date(dj.createdAt || Date.now()).toLocaleDateString('de-DE')}</strong></span>
          </div>

        </div>

      </div>
    </div>
  );
};
