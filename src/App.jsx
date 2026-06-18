import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Inicio from './pages/Inicio';
import QuemSomos from './pages/QuemSomos';
import OQueFazemos from './pages/OQueFazemos';
import ProjetosSociais from './pages/Destaques';
import ProjetoDetalhes from './pages/ProjetoDetalhes';
import Doar from './pages/Doar';
import Contactos from './pages/Contactos';
import Localizacao from './pages/Localizacao';
import Admin from './pages/Admin';
import HistoriasBeneficiarios from './pages/HistoriasBeneficiarios';
import ErrorBoundary from './components/ErrorBoundary';

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
