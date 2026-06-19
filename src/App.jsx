import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import WhatsAppButton from './components/common/WhatsAppButton';
import ScrollToTop from './components/layout/ScrollToTop';
import Home from './pages/public/Home';
import Inicio from './pages/public/Inicio';
import QuemSomos from './pages/public/QuemSomos';
import OQueFazemos from './pages/public/OQueFazemos';
import ProjetosSociais from './pages/public/Destaques';
import ProjetoDetalhes from './pages/public/ProjetoDetalhes';
import Doar from './pages/public/Doar';
import Contactos from './pages/public/Contactos';
import Localizacao from './pages/public/Localizacao';
import Admin from './pages/admin/Admin';
import PoliticaPrivacidade from './pages/public/PoliticaPrivacidade';
import TermosUso from './pages/public/TermosUso';
import HistoriasBeneficiarios from './pages/public/HistoriasBeneficiarios';
import ErrorBoundary from './components/common/ErrorBoundary';

function AppLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-[#14213D]">
      {!isAdmin && <Navbar />}
      <main className={`flex-grow ${isAdmin ? '' : 'pt-16'}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/inicio" element={<Navigate to="/" replace />} />
          <Route path="/quem-somos" element={<Navigate to="/" replace />} />
          <Route path="/o-que-fazemos" element={<Navigate to="/" replace />} />
          <Route path="/projetos-sociais" element={<Navigate to="/" replace />} />
          <Route path="/contactos" element={<Navigate to="/" replace />} />
          <Route path="/localizacao" element={<Navigate to="/" replace />} />
          <Route path="/projetos-sociais/:id" element={<ProjetoDetalhes />} />
          <Route path="/doar" element={<Doar />} />
          <Route path="/politica-de-privacidade" element={<PoliticaPrivacidade />} />
          <Route path="/termos-de-uso" element={<TermosUso />} />
          <Route path="/historias-beneficiarios" element={<HistoriasBeneficiarios />} />
          <Route path="/admin" element={<Admin />} />
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
