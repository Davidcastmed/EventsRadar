import React, { useState, useEffect } from 'react';
import { AgentLog, AgentScheduleConfig } from '../types';
import { 
  Settings, 
  Terminal, 
  Globe, 
  CheckCircle2, 
  ExternalLink, 
  Play, 
  RefreshCw, 
  Database
} from 'lucide-react';

interface AgentAutomationPanelProps {
  config: AgentScheduleConfig;
  logs: AgentLog[];
  onUpdateConfig: (newConfig: Partial<AgentScheduleConfig>) => Promise<void>;
  onTriggerScan: (customQuery?: string) => Promise<void>;
  isScanning: boolean;
  totalEvents: number;
}

export const AgentAutomationPanel: React.FC<AgentAutomationPanelProps> = ({
  config,
  logs,
  onUpdateConfig,
  onTriggerScan,
  isScanning,
  totalEvents,
}) => {
  const [scheduledTimesStr, setScheduledTimesStr] = useState(config.scheduledTimes.join(', '));
  const [scanFrequency, setScanFrequency] = useState(config.scanFrequencyHours);
  const [customPrompt, setCustomPrompt] = useState(config.customSearchPrompt);
  const [schedulerEnabled, setSchedulerEnabled] = useState(config.enabled);
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);
  const [timeUntilNextRun, setTimeUntilNextRun] = useState<string>('Berechne...');

  useEffect(() => {
    setScheduledTimesStr(config.scheduledTimes.join(', '));
    setScanFrequency(config.scanFrequencyHours);
    setCustomPrompt(config.customSearchPrompt);
    setSchedulerEnabled(config.enabled);
  }, [config]);

  // Real-time countdown to next run
  useEffect(() => {
    const updateCountdown = () => {
      if (!config.nextRunAt) {
        setTimeUntilNextRun('Nicht geplant');
        return;
      }
      const diff = new Date(config.nextRunAt).getTime() - Date.now();
      if (diff <= 0) {
        setTimeUntilNextRun('Wird im nächsten Zyklus ausgeführt...');
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeUntilNextRun(`${hours}h ${mins}m ${secs}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [config.nextRunAt]);

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingConfig(true);
    const times = scheduledTimesStr
      .split(',')
      .map((t) => t.trim())
      .filter((t) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(t));

    await onUpdateConfig({
      enabled: schedulerEnabled,
      scheduledTimes: times.length > 0 ? times : config.scheduledTimes,
      scanFrequencyHours: Number(scanFrequency),
      customSearchPrompt: customPrompt,
    });

    setIsSavingConfig(false);
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Hero Banner: Agent Status & Quick Action */}
      <div className="relative overflow-hidden p-6 bg-gradient-to-r from-neutral-900 via-neutral-900 to-lime-950/30 border border-lime-500/30 rounded-2xl shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-lime-500"></span>
              </span>
              <span className="text-xs font-mono uppercase tracking-wider text-lime-400 font-bold">
                Autonomer KI-Agent KRAFTWERK // Aktiv
              </span>
            </div>
            
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Automations-Zentrale & Web-Crawler
            </h2>
            <p className="text-sm text-neutral-300 max-w-2xl">
              Der Agent durchsucht das Internet kontinuierlich und dedupliziert intelligent (ohschonhell.de für Hamburg, Oazis.app für Berlin & Wien, Resident Advisor für Köln) nach Techno-Events von heute bis zu 2 Monaten im Voraus. Bereits erfasste Events werden erkannt und aktualisiert, neue Events automatisch hinzugefügt.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => onTriggerScan(customPrompt)}
              disabled={isScanning}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-lime-400 hover:bg-lime-300 disabled:opacity-50 text-black font-bold text-sm rounded-xl transition shadow-lg shadow-lime-400/20"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Durchsuche Hamburg, Berlin, Köln & Wien...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-black" />
                  <span>Agenten jetzt starten</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-neutral-800/80">
          <div className="bg-neutral-950/60 p-3 rounded-lg border border-neutral-800/80">
            <div className="text-[11px] font-mono text-neutral-500 uppercase">Scheduler-Status</div>
            <div className="text-sm font-bold text-white font-mono mt-0.5 flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${config.enabled ? 'bg-lime-400' : 'bg-neutral-600'}`}></span>
              {config.enabled ? 'AUTOMATISIERT' : 'PAUSIERT'}
            </div>
          </div>

          <div className="bg-neutral-950/60 p-3 rounded-lg border border-neutral-800/80">
            <div className="text-[11px] font-mono text-neutral-500 uppercase">Tägliche Uhrzeiten</div>
            <div className="text-sm font-bold text-lime-300 font-mono mt-0.5">
              {config.scheduledTimes.join(' • ')} Uhr
            </div>
          </div>

          <div className="bg-neutral-950/60 p-3 rounded-lg border border-neutral-800/80">
            <div className="text-[11px] font-mono text-neutral-500 uppercase">Nächster Scan in</div>
            <div className="text-sm font-bold text-cyan-400 font-mono mt-0.5">
              {timeUntilNextRun}
            </div>
          </div>

          <div className="bg-neutral-950/60 p-3 rounded-lg border border-neutral-800/80">
            <div className="text-[11px] font-mono text-neutral-500 uppercase">Events im Radar</div>
            <div className="text-sm font-bold text-white font-mono mt-0.5 flex items-center gap-1">
              <Database className="w-3.5 h-3.5 text-lime-400" />
              {totalEvents} gespeichert
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Schedule & Agent Configuration Form */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2 font-mono">
              <Settings className="w-4 h-4 text-lime-400" />
              Zeitplan & Suchparameter
            </h3>
            {saveSuccessMsg && (
              <span className="text-xs text-lime-400 font-mono flex items-center gap-1 animate-pulse">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Gespeichert
              </span>
            )}
          </div>

          <form onSubmit={handleSaveConfig} className="space-y-4 text-xs">
            
            {/* Enable/Disable Toggle */}
            <div className="flex items-center justify-between p-3 bg-neutral-950 rounded-lg border border-neutral-800">
              <div>
                <span className="font-semibold text-white block">Automatischer täglicher Scan</span>
                <span className="text-neutral-400 text-[11px]">
                  Der Agent startet automatisch zu den hinterlegten Zeiten und aktualisiert Hamburgs Eventdatenbank.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={schedulerEnabled}
                  onChange={(e) => setSchedulerEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lime-500"></div>
              </label>
            </div>

            {/* Scheduled Times */}
            <div>
              <label className="block font-mono text-neutral-300 font-semibold mb-1">
                Feste Uhrzeiten des Tages (Format HH:MM, kommagetrennt):
              </label>
              <input
                type="text"
                value={scheduledTimesStr}
                onChange={(e) => setScheduledTimesStr(e.target.value)}
                placeholder="08:00, 18:00, 22:00"
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-white font-mono focus:outline-none focus:border-lime-400"
              />
              <p className="text-[11px] text-neutral-500 mt-1">
                Beispiel: <code className="text-lime-300">08:00, 18:00, 22:00</code> (Mitteleuropäische Zeit - Hamburg)
              </p>
            </div>

            {/* Scan Frequency */}
            <div>
              <label className="block font-mono text-neutral-300 font-semibold mb-1">
                Maximale Scan-Frequenz:
              </label>
              <select
                value={scanFrequency}
                onChange={(e) => setScanFrequency(Number(e.target.value))}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-white font-mono focus:outline-none focus:border-lime-400"
              >
                <option value={3}>Alle 3 Stunden (Wochenend-Modus)</option>
                <option value={6}>Alle 6 Stunden (Empfohlen)</option>
                <option value={12}>Alle 12 Stunden</option>
                <option value={24}>Einmal täglich (24h)</option>
              </select>
            </div>

            {/* Custom Prompt / Criteria */}
            <div>
              <label className="block font-mono text-neutral-300 font-semibold mb-1">
                Suchdirektive des KI-Agenten:
              </label>
              <textarea
                rows={3}
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Suchanweisung an den Agenten..."
                className="w-full p-2.5 bg-neutral-950 border border-neutral-700 rounded-lg text-neutral-200 text-xs focus:outline-none focus:border-lime-400 font-mono"
              />
              <p className="text-[11px] text-neutral-500 mt-1">
                Spezifische Kriterien für das Modell (z.B. Fokus auf Südpol, Golden Pudel, Acid, Industrial oder Awareness-Teams).
              </p>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={isSavingConfig}
              className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-lg border border-neutral-600 transition"
            >
              {isSavingConfig ? 'Speichere...' : 'Parameter & Zeiten speichern'}
            </button>
          </form>

          {/* Tracked Sources Box */}
          <div className="pt-3 border-t border-neutral-800">
            <h4 className="text-xs font-mono font-bold text-neutral-300 uppercase mb-2 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-lime-400" />
              Überwachte Hamburger Webquellen
            </h4>
            <div className="grid grid-cols-1 gap-1.5 text-xs">
              {config.targetSources.map((source, idx) => (
                <div
                  key={idx}
                  className="px-2.5 py-1.5 bg-neutral-950/80 rounded border border-neutral-800/80 flex items-center justify-between text-neutral-300"
                >
                  <span className="font-mono text-[11px]">{source}</span>
                  <span className="text-[10px] text-lime-400 font-bold uppercase">Aktiv</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Real-Time Agent Logs & Web Grounding Feed */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2 font-mono">
                <Terminal className="w-4 h-4 text-lime-400" />
                Live-Protokoll & Scan-Terminal
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-400">
                {logs.length} Einträge
              </span>
            </div>

            {/* Terminal Window */}
            <div className="bg-black/90 p-3.5 rounded-lg border border-neutral-800 font-mono text-xs space-y-3 max-h-[460px] overflow-y-auto">
              {logs.map((log) => {
                const time = new Date(log.timestamp).toLocaleTimeString('de-DE', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                });

                return (
                  <div key={log.id} className="border-b border-neutral-900 pb-2.5 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="text-neutral-500">[{time}]</span>
                      <span className={`px-1.5 py-0.2 rounded uppercase font-bold text-[10px] ${
                        log.level === 'success'
                          ? 'bg-lime-950 text-lime-400 border border-lime-800'
                          : log.level === 'warn'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-neutral-800 text-neutral-300'
                      }`}>
                        {log.level}
                      </span>
                    </div>

                    <p className="text-neutral-200 mt-1 text-xs leading-relaxed">
                      {log.message}
                    </p>

                    {/* Sources Citations if present */}
                    {log.sources && log.sources.length > 0 && (
                      <div className="mt-2 space-y-1">
                        <span className="text-[10px] text-neutral-400 uppercase font-semibold">
                          Ermittelte Quellen:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {log.sources.map((src, sIdx) => (
                            <a
                              key={sIdx}
                              href={src.uri}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-neutral-900 text-cyan-300 hover:text-white border border-neutral-800 transition"
                            >
                              <span>{src.title}</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 text-[11px] text-neutral-500 font-mono flex items-center justify-between">
            <span>Engine: Gemini 3.8 Flash mit Google Search Grounding</span>
            <span>Zielstadt: Hamburg (Deutschland)</span>
          </div>

        </div>

      </div>

    </div>
  );
};
