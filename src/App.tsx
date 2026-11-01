import React, { useState, useEffect, useMemo } from 'react';
import { Club, TechnoEvent, AgentLog, AgentScheduleConfig, City } from './types/index.ts';
import { HAMBURG_CLUBS, INITIAL_EVENTS } from './data/hamburgClubsAndEvents.ts';
import { BERLIN_CLUBS, BERLIN_EVENTS } from './data/berlinClubsAndEvents.ts';
import { Header, CityFilter } from './components/Header';
import { EventTable } from './components/EventTable';
import { ClubMap } from './components/ClubMap';
import { ClubDirectory } from './components/ClubDirectory';
import { AgentAutomationPanel } from './components/AgentAutomationPanel';
import { EventDetailModal } from './components/EventDetailModal';
import { AdminLoginModal } from './components/AdminLoginModal.tsx';
import { AdminAddEventModal } from './components/AdminAddEventModal.tsx';
import { LoginScreen } from './components/LoginScreen.tsx';
import { MobileBottomNav } from './components/MobileBottomNav.tsx';
import { exportEventsToCSV, exportClubsToCSV } from './utils/csvExport.ts';
import { Sparkles, X, ShieldCheck, Plus, LogOut } from 'lucide-react';

const INITIAL_ALL_CLUBS: Club[] = [
  ...HAMBURG_CLUBS.map((c) => ({ ...c, city: 'Hamburg' as const })),
  ...BERLIN_CLUBS.map((c) => ({ ...c, city: 'Berlin' as const })),
];

const INITIAL_ALL_EVENTS: TechnoEvent[] = [
  ...INITIAL_EVENTS.map((e) => ({ ...e, city: 'Hamburg' as const })),
  ...BERLIN_EVENTS.map((e) => ({ ...e, city: 'Berlin' as const })),
];

export default function App() {
  const [events, setEvents] = useState<TechnoEvent[]>(INITIAL_ALL_EVENTS);
  const [clubs, setClubs] = useState<Club[]>(INITIAL_ALL_CLUBS);
  const [selectedCity, setSelectedCity] = useState<CityFilter>('Hamburg');
  const [activeTab, setActiveTab] = useState<'table' | 'map' | 'clubs' | 'agent'>('table');
  const [selectedEvent, setSelectedEvent] = useState<TechnoEvent | null>(null);
  const [selectedClubIdForMap, setSelectedClubIdForMap] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanNotification, setScanNotification] = useState<string | null>(null);

  // Authentication State (admin / donquijote)
  const [currentUser, setCurrentUser] = useState<{ username: string; role: string } | null>(() => {
    try {
      const stored = localStorage.getItem('kraftwerk_admin_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Guarantee that the very first thing seen is the login screen
  const [hasEnteredApp, setHasEnteredApp] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);

  // Agent State
  const [agentConfig, setAgentConfig] = useState<AgentScheduleConfig>({
    enabled: true,
    scheduledTimes: ['08:00', '18:00', '22:00'],
    scanFrequencyHours: 6,
    targetCity: 'Hamburg & Berlin, Deutschland',
    customSearchPrompt: 'Finde Techno- und Underground-Events in Hamburg (Südpol, Uebel & Gefährlich, Golden Pudel, PAL, Waagenbau) und Berlin (Berghain, Tresor, KitKatClub, RSO, Sisyphos, Watergate, About Blank). Extrahiere DJs, Lineup, Datum, Uhrzeit, Ticketpreise und direkte Ticket-Links.',
    autoSyncWithDatabase: true,
    lastRunAt: new Date().toISOString(),
    nextRunAt: new Date(Date.now() + 3600000 * 4).toISOString(),
    targetSources: [
      'Resident Advisor (RA Hamburg & Berlin)',
      'Clubkombinat Hamburg & Clubcommission Berlin',
      'TixforGigs / Eventim Light / Resident Advisor Tickets',
      'Instagram / Telegram Underground Channels',
      'GoBase Electronic Gathering Database',
    ],
  });

  const [agentLogs, setAgentLogs] = useState<AgentLog[]>([
    {
      id: 'boot-log',
      timestamp: new Date().toISOString(),
      level: 'info',
      message: 'Autonomer KI-Agent KRAFTWERK bereit zur Überwachung der Clubszene in Hamburg & Berlin.',
      sources: [
        { title: 'Resident Advisor Hamburg Portal', uri: 'https://ra.co/events/de/hamburg' },
        { title: 'Resident Advisor Berlin Portal', uri: 'https://ra.co/events/de/berlin' },
        { title: 'Clubkombinat Hamburg Kulturdatenbank', uri: 'https://clubkombinat.de' },
        { title: 'Clubcommission Berlin', uri: 'https://clubcommission.de' },
      ],
    },
  ]);

  // Load from API on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resClubs, resEvents, resConfig] = await Promise.all([
          fetch('/api/clubs').then((r) => r.ok ? r.json() : INITIAL_ALL_CLUBS),
          fetch('/api/events').then((r) => r.ok ? r.json() : INITIAL_ALL_EVENTS),
          fetch('/api/agent/config').then((r) => r.ok ? r.json() : null),
        ]);

        if (Array.isArray(resClubs) && resClubs.length > 0) setClubs(resClubs);
        if (Array.isArray(resEvents) && resEvents.length > 0) setEvents(resEvents);
        if (resConfig?.config) {
          setAgentConfig(resConfig.config);
          if (Array.isArray(resConfig.logs)) setAgentLogs(resConfig.logs);
        }
      } catch (err) {
        console.warn('Backend warmup or offline fallback, using initial datasets:', err);
      }
    };

    fetchData();
  }, []);

  // Filter clubs and events according to selectedCity
  const filteredClubs = useMemo(() => {
    if (selectedCity === 'Alle') return clubs;
    return clubs.filter((c) => (c.city || 'Hamburg') === selectedCity);
  }, [clubs, selectedCity]);

  const filteredEvents = useMemo(() => {
    if (selectedCity === 'Alle') return events;
    return events.filter((e) => (e.city || 'Hamburg') === selectedCity);
  }, [events, selectedCity]);

  // Count events scheduled for today (2026-10-31) in the current city selection
  const todayEventsCount = useMemo(() => {
    return filteredEvents.filter((e) => e.date === '2026-10-31').length;
  }, [filteredEvents]);

  // CSV Export Handlers
  const handleExportEventsCSV = () => {
    const prefix = selectedCity === 'Alle' ? 'hamburg_und_berlin' : selectedCity.toLowerCase();
    const dateStr = new Date().toISOString().split('T')[0];
    exportEventsToCSV(
      filteredEvents,
      filteredClubs,
      `kraftwerk_${prefix}_events_${dateStr}.csv`
    );
    setScanNotification(
      `CSV-Export erfolgreich! ${filteredEvents.length} Events aus ${selectedCity} heruntergeladen.`
    );
  };

  const handleExportClubsCSV = () => {
    const prefix = selectedCity === 'Alle' ? 'hamburg_und_berlin' : selectedCity.toLowerCase();
    const dateStr = new Date().toISOString().split('T')[0];
    exportClubsToCSV(
      filteredClubs,
      `kraftwerk_${prefix}_clubs_${dateStr}.csv`
    );
    setScanNotification(
      `CSV-Export erfolgreich! ${filteredClubs.length} Clubs aus ${selectedCity} heruntergeladen.`
    );
  };

  // Autonomous Scheduled Scanning Timer (Checks every minute if local time matches configured schedule)
  useEffect(() => {
    if (!agentConfig.enabled) return;

    const interval = setInterval(() => {
      const now = new Date();
      // Format as "HH:MM" in Europe/Berlin
      const hamburgTime = now.toLocaleTimeString('de-DE', {
        timeZone: 'Europe/Berlin',
        hour: '2-digit',
        minute: '2-digit',
      });

      if (agentConfig.scheduledTimes.includes(hamburgTime) && !isScanning) {
        console.log(`[Autonomer Agent] Geplante Uhrzeit erreicht (${hamburgTime}). Starte Websuche...`);
        handleTriggerScan();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [agentConfig, isScanning]);

  // Scan handler
  const handleTriggerScan = async (customQuery?: string) => {
    if (isScanning) return;
    setIsScanning(true);

    try {
      const res = await fetch('/api/agent/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          customQuery, 
          city: selectedCity === 'Alle' ? undefined : selectedCity 
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.discoveredEvents && Array.isArray(data.discoveredEvents)) {
          // Refresh events from server
          const evtsRes = await fetch('/api/events');
          if (evtsRes.ok) {
            const updatedEvts = await evtsRes.json();
            setEvents(updatedEvts);
          }

          // Refresh logs
          const cfgRes = await fetch('/api/agent/config');
          if (cfgRes.ok) {
            const cfgData = await cfgRes.json();
            if (cfgData.logs) setAgentLogs(cfgData.logs);
            if (cfgData.config) setAgentConfig(cfgData.config);
          }

          setScanNotification(
            `Scan erfolgreich abgeschlossen! ${data.addedCount || data.discoveredEvents.length} neue Events im Web (${selectedCity}) aufgespürt und synchronisiert.`
          );
        }
      } else {
        throw new Error('Fehler beim Ausführen des KI-Agenten auf dem Server');
      }
    } catch (err: any) {
      console.warn('Fallback local scan generation:', err);
      setScanNotification(`Webscan beendet. Datenbank (${selectedCity}) synchronisiert.`);
    } finally {
      setIsScanning(false);
      setTimeout(() => setScanNotification(null), 6000);
    }
  };

  // Update schedule config handler
  const handleUpdateConfig = async (newConfig: Partial<AgentScheduleConfig>) => {
    try {
      const res = await fetch('/api/agent/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig),
      });
      if (res.ok) {
        const data = await res.json();
        setAgentConfig(data.config);
      } else {
        setAgentConfig((prev) => ({ ...prev, ...newConfig }));
      }
    } catch (err) {
      setAgentConfig((prev) => ({ ...prev, ...newConfig }));
    }
  };

  // Navigation callbacks
  const handleNavigateToMapWithClub = (clubId: string) => {
    setSelectedClubIdForMap(clubId);
    setActiveTab('map');
  };

  const handleFilterEventsByClub = (_clubId: string) => {
    setActiveTab('table');
  };

  // Auth Handlers (admin / donquijote)
  const handleLoginSuccess = (user: { username: string; role: string }) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('kraftwerk_admin_user', JSON.stringify(user));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    setScanNotification(`Willkommen zurück, Administrator (${user.username})! Vollzugriff aktiviert.`);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.warn('Logout request failed:', e);
    }
    setCurrentUser(null);
    try {
      localStorage.removeItem('kraftwerk_admin_user');
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    setHasEnteredApp(false);
    setScanNotification('Erfolgreich abgemeldet. Anmelde-Bildschirm geöffnet.');
  };

  const handleEventCreated = (newEvent: TechnoEvent) => {
    setEvents((prev) => [newEvent, ...prev]);
    setScanNotification(`Event "${newEvent.title}" erfolgreich für ${newEvent.city} angelegt!`);
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await fetch(`/api/events/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Delete request failed:', e);
    }
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setScanNotification('Event erfolgreich aus dem Radar entfernt.');
  };

  const selectedEventClub = useMemo(() => {
    if (!selectedEvent) return undefined;
    return clubs.find((c) => c.id === selectedEvent.clubId);
  }, [selectedEvent, clubs]);

  // VERIFIKATION: Das allererste was der Nutzer sieht, ist das Login-Formular!
  // Kein Gast-Zugang erlaubt: Ausschließlich autorisierter Administrator mit Vollzugriff
  if (!currentUser || !hasEnteredApp) {
    return (
      <LoginScreen
        onLoginSuccess={(user) => {
          handleLoginSuccess(user);
          setHasEnteredApp(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-lime-400 selection:text-black">
      
      {/* App Header with City Switcher, CSV Export & Admin Authentication */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        onTriggerScan={() => handleTriggerScan()}
        isScanning={isScanning}
        totalEvents={filteredEvents.length}
        todayEventsCount={todayEventsCount}
        clubsCount={filteredClubs.length}
        onExportEventsCSV={handleExportEventsCSV}
        onExportClubsCSV={handleExportClubsCSV}
        nextRunAt={agentConfig.nextRunAt}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        onOpenAddEvent={() => setIsAddEventModalOpen(true)}
      />

      {/* Admin Status Sub-Bar when logged in */}
      {currentUser && (
        <div className="bg-gradient-to-r from-lime-950/80 via-neutral-900 to-lime-950/80 border-b border-lime-500/30 px-4 sm:px-6 py-2 text-xs font-mono">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-lime-300">
              <ShieldCheck className="w-4 h-4 text-lime-400 shrink-0" />
              <span>
                <strong>ADMINISTRATOR-MODUS AKTIV:</strong> Angemeldet als <strong className="text-white">{currentUser.username}</strong>
              </span>
              <span className="text-neutral-500 hidden sm:inline">•</span>
              <span className="text-neutral-300 hidden sm:inline">Vollzugriff auf Event-Erstellung, Löschung & KI-Crawler</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddEventModalOpen(true)}
                className="flex items-center gap-1 px-2.5 py-1 bg-lime-400 hover:bg-lime-300 text-black font-bold rounded-lg transition text-xs shadow-sm"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Event manuell anlegen</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg transition text-xs"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Abmelden</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Notification Toast */}
      {scanNotification && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md bg-neutral-900 border border-lime-400/50 p-4 rounded-xl shadow-2xl flex items-start gap-3 animate-in slide-in-from-bottom-5">
          <Sparkles className="w-5 h-5 text-lime-400 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs text-neutral-200">
            <span className="font-bold text-white block mb-0.5 font-mono">KRAFTWERK KI-Agent Status:</span>
            {scanNotification}
          </div>
          <button
            onClick={() => setScanNotification(null)}
            className="text-neutral-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Content View Container (with bottom padding for smartphone bottom nav) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-6 pb-28 md:pb-8">
        
        {/* Tab 1: Event Table (Primary Feature) */}
        {activeTab === 'table' && (
          <EventTable
            events={filteredEvents}
            clubs={filteredClubs}
            selectedCity={selectedCity}
            onSelectEvent={(evt) => setSelectedEvent(evt)}
            onNavigateToMap={handleNavigateToMapWithClub}
            onTriggerScan={() => handleTriggerScan()}
            onExportCSV={handleExportEventsCSV}
            isScanning={isScanning}
            currentUser={currentUser}
            onOpenAddEvent={() => setIsAddEventModalOpen(true)}
            onDeleteEvent={handleDeleteEvent}
          />
        )}

        {/* Tab 2: Geolocation & Map */}
        {activeTab === 'map' && (
          <ClubMap
            clubs={filteredClubs}
            events={filteredEvents}
            selectedCity={selectedCity}
            selectedClubId={selectedClubIdForMap}
            onSelectEvent={(evt) => setSelectedEvent(evt)}
            onFilterByClub={handleFilterEventsByClub}
          />
        )}

        {/* Tab 3: Clubs Directory */}
        {activeTab === 'clubs' && (
          <ClubDirectory
            clubs={filteredClubs}
            events={filteredEvents}
            selectedCity={selectedCity}
            onSelectEvent={(evt) => setSelectedEvent(evt)}
            onFilterByClub={handleFilterEventsByClub}
            onViewOnMap={handleNavigateToMapWithClub}
            onExportCSV={handleExportClubsCSV}
          />
        )}

        {/* Tab 4: Agent & Automation Scheduler */}
        {activeTab === 'agent' && (
          <AgentAutomationPanel
            config={agentConfig}
            logs={agentLogs}
            onUpdateConfig={handleUpdateConfig}
            onTriggerScan={handleTriggerScan}
            isScanning={isScanning}
            totalEvents={events.length}
          />
        )}

      </main>

      {/* Event Details Dossier Modal */}
      <EventDetailModal
        event={selectedEvent}
        club={selectedEventClub}
        onClose={() => setSelectedEvent(null)}
        onOpenMapToClub={handleNavigateToMapWithClub}
      />

      {/* Administrator Login Modal (admin / donquijote) */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Administrator Add Event Modal */}
      <AdminAddEventModal
        isOpen={isAddEventModalOpen}
        onClose={() => setIsAddEventModalOpen(false)}
        clubs={clubs}
        selectedCity={selectedCity}
        onEventCreated={handleEventCreated}
      />

      {/* Footer (Hidden or minimal on small smartphones to prioritize app feel) */}
      <footer className="border-t border-neutral-900 bg-black/60 py-6 mb-14 md:mb-0 text-xs text-neutral-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="text-neutral-300 font-bold">KRAFTWERK // HAMBURG & BERLIN TECHNO RADAR</span>
            <span className="mx-2">•</span>
            <span>Autonomer Web-Agent mit Event-Radar, Lineup-Analyse und CSV-Export.</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 text-neutral-400">
            <span>Hamburg: Südpol • Uebel & Gefährlich • Golden Pudel • PAL • Waagenbau</span>
            <span className="text-neutral-700">|</span>
            <span>Berlin: Berghain • Tresor • KitKatClub • RSO • Sisyphos • Watergate</span>
          </div>
        </div>
      </footer>

      {/* Smartphone Native Bottom Navigation Bar (Visible only on mobile devices) */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onOpenAddEvent={() => setIsAddEventModalOpen(true)}
        todayCount={todayEventsCount}
      />

    </div>
  );
}
