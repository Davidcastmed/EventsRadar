import React, { useState } from 'react';
import { 
  Lock, 
  KeyRound, 
  User, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  ShieldCheck, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { username: string; role: string }) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

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
          setSuccess(false);
          onClose();
        }, 700);
      } else {
        setError(data.message || 'Ungültige Anmeldedaten. Benutzername oder Passwort ist falsch.');
      }
    } catch {
      // Fallback check in client if backend is briefly offline
      if (username.trim() === 'admin' && password.trim() === 'donquijote') {
        setSuccess(true);
        setTimeout(() => {
          onLoginSuccess({ username: 'admin', role: 'admin' });
          setSuccess(false);
          onClose();
        }, 700);
      } else {
        setError('Ungültige Anmeldedaten. Benutzername: admin | Passwort: donquijote');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAutoFill = () => {
    setUsername('admin');
    setPassword('donquijote');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div 
        className="relative w-full max-w-md bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl p-6 sm:p-8 font-mono text-neutral-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          aria-label="Schließen"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-lime-400/10 border border-lime-400/30 text-lime-400 flex items-center justify-center shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-wide">
                ADMINISTRATOR-LOGIN
              </h2>
              <span className="px-1.5 py-0.5 rounded bg-lime-400/20 text-lime-400 text-[10px] font-bold">
                SECURE
              </span>
            </div>
            <p className="text-xs text-neutral-400 font-sans mt-0.5">
              Zugang für Event-Management, Crawler-Steuerung & Zeitpläne
            </p>
          </div>
        </div>

        {/* Notification Status */}
        {error && (
          <div className="mb-5 p-3.5 bg-red-950/60 border border-red-500/50 rounded-xl text-red-300 text-xs flex items-start gap-2.5 animate-in shake">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1 font-sans">{error}</div>
          </div>
        )}

        {success && (
          <div className="mb-5 p-3.5 bg-lime-950/60 border border-lime-500/50 rounded-xl text-lime-300 text-xs flex items-center gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
            <div className="flex-1 font-sans font-semibold">
              Anmeldung erfolgreich! Administrator-Sitzung wird gestartet...
            </div>
          </div>
        )}

        {/* Quick Credentials Badge / Autofill Helper */}
        <div className="mb-5 p-3 bg-neutral-950 border border-neutral-800 rounded-xl flex items-center justify-between gap-3 text-xs">
          <div className="text-[11px] text-neutral-400 leading-tight">
            <span className="text-neutral-300 font-semibold block">Vorgegebene Zugangsdaten:</span>
            Benutzer: <span className="text-lime-400 font-bold">admin</span> • Passwort: <span className="text-lime-400 font-bold">donquijote</span>
          </div>
          <button
            type="button"
            onClick={handleAutoFill}
            className="px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-lime-400 text-[11px] font-bold rounded-lg border border-neutral-700 transition flex items-center gap-1 shrink-0"
          >
            <Sparkles className="w-3 h-3" />
            <span>Ausfüllen</span>
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5 uppercase tracking-wider">
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
                placeholder="z. B. admin"
                required
                autoFocus
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-lime-400 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5 uppercase tracking-wider">
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
                placeholder="••••••••••••"
                required
                className="w-full pl-10 pr-11 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-lime-400 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-500 hover:text-neutral-300 transition"
                aria-label={showPassword ? 'Passwort verbergen' : 'Passwort anzeigen'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || success}
              className="w-full py-3 px-4 bg-lime-400 hover:bg-lime-300 text-black font-bold font-mono text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-lime-400/20 disabled:opacity-50"
            >
              {loading ? (
                <span>Wird authentifiziert...</span>
              ) : success ? (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Erfolgreich autorisiert</span>
                </>
              ) : (
                <>
                  <span>Anmelden</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Security Footer Notice */}
        <div className="mt-6 pt-4 border-t border-neutral-800 text-[11px] text-neutral-500 font-sans text-center flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-lime-400" />
          <span>KRAFTWERK Sicherheits-Gateway • Hamburg & Berlin Techno Radar</span>
        </div>
      </div>
    </div>
  );
};
