import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Clock, 
  ListOrdered, 
  Building2, 
  Terminal, 
  Compass,
  Download,
  FileSpreadsheet,
  ChevronDown,
  MapPin,
  Check,
  Lock,
  LogOut,
  Plus,
  ShieldCheck,
  Headphones
} from 'lucide-react';
import { City } from '../types/index.ts';

export type CityFilter = City | 'Alle';

interface HeaderProps {
  activeTab: 'table' | 'map' | 'clubs' | 'djs' | 'agent';
  setActiveTab: (tab: 'table' | 'map' | 'clubs' | 'djs' | 'agent') => void;
  selectedCity: CityFilter;
  setSelectedCity: (city: CityFilter) => void;
  onTriggerScan: () => void;
  isScanning: boolean;
  totalEvents: number;
  todayEventsCount: number;
  clubsCount?: number;
  djsCount?: number;
  onExportEventsCSV: () => void;
  onExportEventsJSON: () => void;
  onExportClubsCSV: () => void;
  onExportClubsJSON: () => void;
  onExportDJsCSV?: () => void;
  onExportDJsJSON?: () => void;
  nextRunAt?: string;
  currentUser: { username: string; role: string } | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  onOpenAddEvent?: () => void;
  cityEventCounts?: Record<CityFilter, number>;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedCity,
  setSelectedCity,
  onTriggerScan,
  isScanning,
  totalEvents,
  todayEventsCount,
  clubsCount,
  djsCount,
  onExportEventsCSV,
  onExportEventsJSON,
  onExportClubsCSV,
  onExportClubsJSON,
  onExportDJsCSV,
  onExportDJsJSON,
  currentUser,
  onOpenLogin,
  onLogout,
  onOpenAddEvent,
  cityEventCounts,
}) => {
  const [currentTime, setCurrentTime] = useState('');
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  // Live CET/MEZ Clock (Europe/Berlin)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('de-DE', {
        timeZone: 'Europe/Berlin',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setCurrentTime(timeStr);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close export dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
        setIsExportMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800">
      
      {/* Top Meta Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 border-b border-neutral-900 flex flex-wrap items-center justify-between text-[11px] font-mono text-neutral-400 gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-lime-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-500"></span>
            </span>
            <span className="font-bold">TECHNO RADAR // {selectedCity.toUpperCase()} ONLINE</span>
          </div>
          <span className="text-neutral-700">|</span>
          <span className="hidden lg:inline text-neutral-400">
            {selectedCity === 'Berlin' 
              ? 'Friedrichshain • Kreuzberg • Mitte • Neukölln • Treptow' 
              : selectedCity === 'Hamburg'
              ? 'St. Pauli • Sternschanze • Hammerbrook • Wilhelmsburg • HafenCity'
              : 'Hamburg & Berlin Doppelmetropole'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-neutral-300">
            <Clock className="w-3 h-3 text-lime-400" />
            <span>MEZ / Berlin: <strong className="text-white font-mono">{currentTime || '--:--:--'}</strong></span>
          </div>
          <span className="text-neutral-700">|</span>
          <span className="text-neutral-400">
            Heute: <strong className="text-lime-400 font-bold">{todayEventsCount} Events</strong>
          </span>
          <span className="text-neutral-700">|</span>
          <span className="text-neutral-400">
            Im Radar: <strong className="text-white font-bold">{totalEvents}</strong>
          </span>
        </div>
      </div>

      {/* Main Brand, City Switcher & Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        
        {/* Brand & City Switcher */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 rounded-xl bg-lime-400 text-black flex items-center justify-center font-black text-xl shadow-lg shadow-lime-400/20 shrink-0">
            K
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white font-mono">
                KRAFTWERK<span className="text-lime-400">.RADAR</span>
              </h1>
            </div>
            <p className="text-xs text-neutral-400 hidden sm:block">
              Techno- & Underground-Events, Lineups, Direkttickets & Türpolitik
            </p>
          </div>

          {/* CITY SWITCHER: Hamburg / Berlin / Wien / Köln / Alle */}
          <div className="flex items-center p-1 bg-neutral-900 border border-neutral-800 rounded-xl font-mono text-xs ml-auto sm:ml-2 overflow-x-auto max-w-full">
            {(['Hamburg', 'Berlin', 'Wien', 'Köln', 'Alle'] as CityFilter[]).map((c) => {
              const active = selectedCity === c;
              const count = cityEventCounts ? cityEventCounts[c] : undefined;
              return (
                <button
                  key={c}
                  onClick={() => setSelectedCity(c)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition font-bold whitespace-nowrap touch-manipulation ${
                    active
                      ? c === 'Alle' ? 'bg-neutral-700 text-white shadow-md' : 'bg-lime-400 text-black shadow-md'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {c !== 'Alle' && <MapPin className="w-3 h-3" />}
                  <span>{c}</span>
                  {count !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold leading-none ${
                      active
                        ? c === 'Alle' ? 'bg-neutral-900 text-neutral-200' : 'bg-black text-lime-400'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation Tabs (Desktop only - Mobile uses MobileBottomNav), CSV Export & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          
          <nav className="hidden md:flex items-center p-1 bg-neutral-900 border border-neutral-800 rounded-xl overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono whitespace-nowrap transition ${
                activeTab === 'table'
                  ? 'bg-lime-400 text-black font-bold shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>Event-Tabelle</span>
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono whitespace-nowrap transition ${
                activeTab === 'map'
                  ? 'bg-lime-400 text-black font-bold shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Radar & Karte</span>
            </button>

            <button
              onClick={() => setActiveTab('clubs')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono whitespace-nowrap transition ${
                activeTab === 'clubs'
                  ? 'bg-lime-400 text-black font-bold shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Clubs ({clubsCount || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('djs')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono whitespace-nowrap transition ${
                activeTab === 'djs'
                  ? 'bg-lime-400 text-black font-bold shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>DJs ({djsCount || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('agent')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono whitespace-nowrap transition ${
                activeTab === 'agent'
                  ? 'bg-cyan-400 text-black font-bold shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>KI-Agent</span>
            </button>
          </nav>

          {/* CSV & JSON EXPORT DROPDOWN BUTTON */}
          <div className="relative" ref={exportMenuRef}>
            <button
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              title="Events, Clubs oder DJs als CSV oder JSON herunterladen"
              className="flex items-center gap-1.5 px-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 font-mono text-xs font-semibold rounded-xl transition"
            >
              <Download className="w-3.5 h-3.5 text-lime-400" />
              <span>Export (.CSV / .JSON)</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {isExportMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl z-50 p-2 animate-in fade-in-50 zoom-in-95 font-mono text-xs space-y-1.5">
                <div className="px-2.5 py-1 text-[10px] text-neutral-400 uppercase tracking-wider font-semibold border-b border-neutral-800 flex items-center justify-between">
                  <span>Export ({selectedCity})</span>
                  <span className="text-lime-400 font-bold">CSV & JSON</span>
                </div>
                
                {/* Events Section */}
                <div className="p-1.5 bg-neutral-950/70 border border-neutral-800 rounded-lg space-y-1">
                  <div className="text-[10px] text-neutral-400 font-bold uppercase flex items-center gap-1">
                    <FileSpreadsheet className="w-3 h-3 text-lime-400" />
                    <span>Techno Events ({totalEvents})</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 pt-0.5">
                    <button
                      onClick={() => {
                        onExportEventsCSV();
                        setIsExportMenuOpen(false);
                      }}
                      className="px-2 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-lime-300 rounded text-center transition font-bold"
                    >
                      .CSV
                    </button>
                    <button
                      onClick={() => {
                        onExportEventsJSON();
                        setIsExportMenuOpen(false);
                      }}
                      className="px-2 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-lime-300 rounded text-center transition font-bold"
                    >
                      .JSON
                    </button>
                  </div>
                </div>

                {/* Clubs Section */}
                <div className="p-1.5 bg-neutral-950/70 border border-neutral-800 rounded-lg space-y-1">
                  <div className="text-[10px] text-neutral-400 font-bold uppercase flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-cyan-400" />
                    <span>Clubs ({clubsCount || 0})</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 pt-0.5">
                    <button
                      onClick={() => {
                        onExportClubsCSV();
                        setIsExportMenuOpen(false);
                      }}
                      className="px-2 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-cyan-300 rounded text-center transition font-bold"
                    >
                      .CSV
                    </button>
                    <button
                      onClick={() => {
                        onExportClubsJSON();
                        setIsExportMenuOpen(false);
                      }}
                      className="px-2 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-cyan-300 rounded text-center transition font-bold"
                    >
                      .JSON
                    </button>
                  </div>
                </div>

                {/* DJs Section */}
                {onExportDJsCSV && onExportDJsJSON && (
                  <div className="p-1.5 bg-neutral-950/70 border border-neutral-800 rounded-lg space-y-1">
                    <div className="text-[10px] text-neutral-400 font-bold uppercase flex items-center gap-1">
                      <Headphones className="w-3 h-3 text-lime-400" />
                      <span>DJs & Artists ({djsCount || 0})</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1 pt-0.5">
                      <button
                        onClick={() => {
                          onExportDJsCSV();
                          setIsExportMenuOpen(false);
                        }}
                        className="px-2 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-lime-300 rounded text-center transition font-bold"
                      >
                        .CSV
                      </button>
                      <button
                        onClick={() => {
                          onExportDJsJSON();
                          setIsExportMenuOpen(false);
                        }}
                        className="px-2 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-lime-300 rounded text-center transition font-bold"
                      >
                        .JSON
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>


          {/* Quick Agent Trigger Button */}
          <button
            onClick={onTriggerScan}
            disabled={isScanning}
            title={`Websuche nach Techno-Events in ${selectedCity} starten`}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-lime-400 border border-lime-500/40 font-mono text-xs font-bold rounded-xl transition disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isScanning ? 'Scannt...' : 'Scan starten'}</span>
          </button>

          {/* ADMIN AUTHENTICATION CONTROLS */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 p-1 bg-neutral-900/90 border border-lime-500/40 rounded-xl">
              <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold text-lime-400 bg-lime-400/10 rounded-lg">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Admin:</span>
                <span className="text-white">{currentUser.username}</span>
              </div>

              {onOpenAddEvent && (
                <button
                  onClick={onOpenAddEvent}
                  title="Neues Event manuell anlegen"
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-bold text-black bg-lime-400 hover:bg-lime-300 rounded-lg transition shadow-sm"
                >
                  <Plus className="w-3 h-3 stroke-[3]" />
                  <span>Event</span>
                </button>
              )}

              <button
                onClick={onLogout}
                title="Als Administrator abmelden"
                className="flex items-center gap-1 px-2 py-1 text-xs font-mono text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded-lg transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Abmelden</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              title="Administrator-Login (admin / donquijote)"
              className="flex items-center gap-1.5 px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 hover:border-neutral-500 font-mono text-xs font-bold rounded-xl transition shadow-sm group"
            >
              <Lock className="w-3.5 h-3.5 text-neutral-400 group-hover:text-lime-400 transition" />
              <span>Admin Login</span>
            </button>
          )}

        </div>

      </div>

    </header>
  );
};
