import * as React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    const { hasError, error } = this.state;

    if (hasError) {
      const isSupabaseError = error?.message.includes('VITE_SUPABASE_URL') || 
                             error?.message.includes('Supabase');

      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-10 text-center space-y-6 border border-slate-100">
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle size={40} />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">Algo correu mal</h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                {isSupabaseError 
                  ? 'A ligação à base de dados não está configurada. Por favor, adicione as chaves do Supabase nas Definições (Secrets).'
                  : 'Ocorreu um erro inesperado na aplicação.'}
              </p>
            </div>

            {isSupabaseError && (
              <div className="bg-blue-50 p-4 rounded-2xl text-left space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600">Variáveis Necessárias:</p>
                <code className="text-xs block bg-white p-2 rounded border border-blue-100 font-mono">
                  VITE_SUPABASE_URL<br />
                  VITE_SUPABASE_ANON_KEY
                </code>
              </div>
            )}

            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              <RefreshCw size={18} /> Tentar Novamente
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
