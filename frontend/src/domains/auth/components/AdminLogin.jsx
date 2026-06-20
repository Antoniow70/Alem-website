import { motion } from 'motion/react';
import { LayoutDashboard, Loader2 } from 'lucide-react';

/**
 * Admin login screen with Supabase auth integration.
 */
export default function AdminLogin({ email, setEmail, password, setPassword, handleLogin, loginError, loginLoading }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-200/30 w-full max-w-md space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 border border-blue-100">
            <LayoutDashboard size={24} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Admin ALEM</h1>
          <p className="text-sm text-slate-500">Acesso restrito a equipa de gestao</p>
        </div>

        {loginError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-3 rounded-xl"
          >
            {loginError}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="form-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="admin@alem.mz"
              required
              disabled={loginLoading}
            />
          </div>
          <div className="space-y-1">
            <label className="form-label">Palavra-passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="••••••••"
              required
              disabled={loginLoading}
            />
          </div>
          <button
            className="w-full btn-primary py-3 mt-2 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loginLoading}
          >
            {loginLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                A autenticar...
              </>
            ) : (
              'Entrar no Painel'
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
