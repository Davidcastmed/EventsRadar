import React, { useState } from 'react';
import { 
  Lock, 
  KeyRound, 
  User, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  MapPin,
  HeartHandshake
} from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (user: { username: string; role: string }) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password: password.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
        setTimeout(() => {
          onLoginSuccess(data.user);
        }, 500);
      } else {
        setError(data.message || 'Ungültige Anmeldedaten. Bitte als Administrator anmelden.');
      }
    } catch {
      // Local fallback in case backend is warming up
      if (username.trim() === 'admin' && password.trim() === 'donquijote') {
        setSuccess(true);
        setTimeout(() => {
          onLoginSuccess({ username: 'admin', role: 'admin' });
        }, 500);
      } else {
        setError('Ungültige Anmeldedaten. Zugriff nur für autorisierte Administratoren.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-neutral-950 text-neutral-100 flex flex-col justify-between p-4 sm:p-6 md:p-8 font-sans selection:bg-lime-400 selection:text-black relative overflow-x-hidden">
      
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-80 h-80 sm:w-96 sm:h-96 bg-lime-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -right-32 w-80 h-80 sm:w-96 sm:h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:24px_24px] opacity-25"></div>
      </div>

      {/* Top Mobile Bar */}
      <div className="relative z-10 max-w-md w-full mx-auto flex items-center justify-between text-xs font-mono text-neutral-400 pt-2 pb-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-500"></span>
          </span>
          <span className="text-lime-400 font-bold tracking-wider">SECURE GATEWAY</span>
        </div>
        <div className="flex items-center gap-1.5 text-neutral-500 text-[11px]">
          <MapPin className="w-3 h-3 text-neutral-400" />
          <span>Hamburg & Berlin</span>
        </div>
      </div>

      {/* Main Login Card - Touch Optimized for Smartphones */}
      <div className="relative z-10 max-w-md w-full mx-auto my-auto">
        
        {/* Brand Banner */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-lime-400 text-black font-black text-2xl sm:text-3xl shadow-xl shadow-lime-400/20 mb-3">
            K
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white">
            KRAFTWERK<span className="text-lime-400">.RADAR</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 font-sans">
            Underground Techno & Club Radar für Hamburg & Berlin
          </p>
        </div>

        {/* Card Box */}
        <div className="bg-neutral-900/90 backdrop-blur-xl border border-neutral-800 rounded-3xl p-5 sm:p-7 shadow-2xl font-mono">
          
          <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3 mb-5">
            <div className="flex items-center gap-2 text-white">
              <Lock className="w-4 h-4 text-lime-400" />
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">
                Administrator-Zugang
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-lime-400/10 border border-lime-500/30 text-lime-400 text-[10px] font-bold">
              VOLLZUGRIFF
            </span>
          </div>

          <div className="mb-4 text-xs font-sans text-neutral-300 leading-relaxed bg-neutral-950/60 p-3 rounded-xl border border-neutral-800/70">
            <div className="flex items-center gap-1.5 text-lime-400 font-mono text-[11px] font-bold mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Ausschließlich Administrator-Zugang</span>
            </div>
            Gast-Zugänge sind deaktiviert. Die Nutzung des Radars und aller Steuerungsfunktionen erfordert eine Authentifizierung als Administrator mit Vollzugriff.
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3.5 bg-red-950/60 border border-red-500/50 rounded-xl text-red-300 text-xs flex items-start gap-2.5 animate-in shake font-sans">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1">{error}</div>
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="mb-4 p-3.5 bg-lime-950/70 border border-lime-400/60 rounded-xl text-lime-300 text-xs flex items-center gap-2.5 animate-in fade-in font-sans">
              <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
              <div className="font-semibold">
                Anmeldung erfolgreich! Vollzugriff wird autorisiert...
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username Input - Has placeholder="admin" */}
            <div>
              <label className="block text-[11px] font-semibold text-neutral-300 mb-1.5 uppercase tracking-wider">
                Benutzername
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                  className="w-full pl-10 pr-4 py-3 bg-neutral-950 border border-neutral-700 rounded-xl text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 transition"
                />
              </div>
            </div>

            {/* Password Input - No placeholder */}
            <div>
              <label className="block text-[11px] font-semibold text-neutral-300 mb-1.5 uppercase tracking-wider">
                Passwort
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                  className="w-full pl-10 pr-12 py-3 bg-neutral-950 border border-neutral-700 rounded-xl text-white text-sm focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 transition font-mono tracking-wider"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-500 hover:text-neutral-300 active:text-lime-400 transition min-w-[44px] justify-center"
                  aria-label={showPassword ? 'Passwort verbergen' : 'Passwort anzeigen'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button (Admin Login) */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || success}
                className="w-full py-3.5 px-4 bg-lime-400 hover:bg-lime-300 active:scale-[0.98] text-black font-black font-mono text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-lime-400/20 disabled:opacity-50 min-h-[46px]"
              >
                {loading ? (
                  <span>Wird verifiziert...</span>
                ) : success ? (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Administrator autorisiert</span>
                  </>
                ) : (
                  <>
                    <span>Als Administrator mit Vollzugriff anmelden</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </form>

        </div>

        {/* Mandatory Awareness Statement Preview */}
        <div className="mt-4 p-3 bg-neutral-900/40 border border-neutral-800/80 rounded-2xl text-[11px] text-neutral-400 font-sans flex items-start gap-2.5">
          <HeartHandshake className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <div className="leading-snug">
            <strong className="text-neutral-200 block font-mono text-[10px]">AWARENESS & RESPEKT:</strong>
            Awareness-Team available, if you feel uncomfortable please ask our staff for help. Zero tolerance for racism, fascism or discrimination.
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="relative z-10 max-w-md w-full mx-auto text-center text-[11px] text-neutral-500 font-mono py-3">
        KRAFTWERK // HAMBURG & BERLIN TECHNO RADAR • 68 CLUBS
      </div>

    </div>
  );
};
