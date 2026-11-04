import { 
  ListOrdered, 
  Compass, 
  Building2, 
  Terminal, 
  ShieldCheck, 
  Plus,
  Headphones
} from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'table' | 'map' | 'clubs' | 'djs' | 'agent';
  setActiveTab: (tab: 'table' | 'map' | 'clubs' | 'djs' | 'agent') => void;
  currentUser?: { username: string; role: string } | null;
  onOpenLogin?: () => void;
  onOpenAddEvent: () => void;
  todayCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddEvent,
  todayCount,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 backdrop-blur-xl border-t border-neutral-800 px-1 py-1.5 pb-safe flex items-center justify-around font-mono">
      
      {/* 1. Events Tab */}
      <button
        onClick={() => setActiveTab('table')}
        className={`relative flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition min-w-[48px] ${
          activeTab === 'table' ? 'text-lime-400 font-bold' : 'text-neutral-400 hover:text-neutral-200'
        }`}
      >
        <div className="relative">
          <ListOrdered className="w-4 h-4" />
          {todayCount > 0 && (
            <span className="absolute -top-1 -right-2 px-1 py-0.2 bg-lime-400 text-black text-[9px] font-black rounded-full leading-none">
              {todayCount}
            </span>
          )}
        </div>
        <span className="text-[9px] mt-0.5 tracking-tight">Events</span>
      </button>

      {/* 2. Map / Radar Tab */}
      <button
        onClick={() => setActiveTab('map')}
        className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition min-w-[48px] ${
          activeTab === 'map' ? 'text-lime-400 font-bold' : 'text-neutral-400 hover:text-neutral-200'
        }`}
      >
        <Compass className="w-4 h-4" />
        <span className="text-[9px] mt-0.5 tracking-tight">Radar</span>
      </button>

      {/* 3. DJs Tab */}
      <button
        onClick={() => setActiveTab('djs')}
        className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition min-w-[48px] ${
          activeTab === 'djs' ? 'text-lime-400 font-bold' : 'text-neutral-400 hover:text-neutral-200'
        }`}
      >
        <Headphones className="w-4 h-4" />
        <span className="text-[9px] mt-0.5 tracking-tight">DJs</span>
      </button>

      {/* 4. Fast Action button: + Event */}
      <button
        onClick={onOpenAddEvent}
        className="flex flex-col items-center justify-center -mt-3 bg-lime-400 text-black p-2 rounded-xl shadow-lg shadow-lime-400/30 active:scale-95 transition"
        title="Neues Event anlegen"
      >
        <Plus className="w-4 h-4 stroke-[3]" />
        <span className="text-[8px] font-black uppercase tracking-tighter mt-0.5">+ Event</span>
      </button>

      {/* 5. Clubs Tab */}
      <button
        onClick={() => setActiveTab('clubs')}
        className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition min-w-[48px] ${
          activeTab === 'clubs' ? 'text-lime-400 font-bold' : 'text-neutral-400 hover:text-neutral-200'
        }`}
      >
        <Building2 className="w-4 h-4" />
        <span className="text-[9px] mt-0.5 tracking-tight">Clubs</span>
      </button>

      {/* 6. KI-Agent Tab */}
      <button
        onClick={() => setActiveTab('agent')}
        className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition min-w-[48px] ${
          activeTab === 'agent' ? 'text-cyan-400 font-bold' : 'text-neutral-400 hover:text-neutral-200'
        }`}
      >
        <Terminal className="w-4 h-4" />
        <span className="text-[9px] mt-0.5 tracking-tight">Agent</span>
      </button>

    </nav>
  );
};
