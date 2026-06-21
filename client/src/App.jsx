import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './shared/layout/Navbar';
import Footer from './shared/layout/Footer';
import WhatsAppButton from './shared/common/WhatsAppButton';
import ScrollToTop from './shared/layout/ScrollToTop';
import Home from './pages/Home';
import Inicio from './pages/Inicio';
import QuemSomos from './domains/equipa/pages/QuemSomos';
import OQueFazemos from './domains/projetos/pages/OQueFazemos';
import ProjetosSociais from './domains/projetos/pages/Destaques';
import ProjetoDetalhes from './domains/projetos/pages/ProjetoDetalhes';
import Doar from './domains/doacoes/pages/Doar';
import Contactos from './pages/Contactos';
import Localizacao from './pages/Localizacao';
import { Admin } from './domains/admin';
import PoliticaPrivacidade from './pages/PoliticaPrivacidade';
import TermosUso from './pages/TermosUso';
import HistoriasBeneficiarios from './domains/beneficiarios/pages/HistoriasBeneficiarios';
import ErrorBoundary from './shared/common/ErrorBoundary';
import { getCurrentSession } from './domains/auth/services/authApi';

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    let active = true;
    getCurrentSession().then((activeSession) => {
      if (active) {
        setSession(activeSession);
        setLoading(false);
      }
    }).catch(() => {
      if (active) {
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-poloBlue/15">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-horizon"></div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

function AppLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-transparent font-sans text-brand-bigStone dark:text-dark-text">
      {!isAdmin && <Navbar />}
      <main className={`flex-grow ${isAdmin ? '' : 'pt-16'}`}>
        <Routes>
          <Route path="/" element={<Navigate to="/inicio" replace />} />
          <Route path="/inicio" element={<Home />} />
          <Route path="/quem-somos" element={<Navigate to="/inicio" replace />} />
          <Route path="/o-que-fazemos" element={<Navigate to="/inicio" replace />} />
          <Route path="/projetos-sociais" element={<Navigate to="/inicio" replace />} />
          <Route path="/contactos" element={<Navigate to="/inicio" replace />} />
          <Route path="/localizacao" element={<Navigate to="/inicio" replace />} />
          <Route path="/projetos-sociais/:id" element={<ProjetoDetalhes />} />
          <Route path="/doar" element={<Doar />} />
          <Route path="/politica-de-privacidade" element={<PoliticaPrivacidade />} />
          <Route path="/termos-de-uso" element={<TermosUso />} />
          <Route path="/historias-beneficiarios" element={<HistoriasBeneficiarios />} />
          
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/*" element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
      {!isAdmin && <WhatsAppButton />}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <AppLayout />
      </Router>
    </ErrorBoundary>
  );
}

