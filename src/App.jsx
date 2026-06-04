import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import ScrollToTop from './components/ScrollToTop';
import Inicio from './pages/Inicio';
import QuemSomos from './pages/QuemSomos';
import OQueFazemos from './pages/OQueFazemos';
import ProjetosSociais from './pages/ProjetosSociais';
import MeiosFinanciamento from './pages/MeiosFinanciamento';
import Contactos from './pages/Contactos';
import Localizacao from './pages/Localizacao';
import Admin from './pages/Admin';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
          <Navbar />
          <main className="flex-grow pt-16">
            <Routes>
              <Route path="/" element={<Navigate to="/inicio" replace />} />
              <Route path="/inicio" element={<Inicio />} />
              <Route path="/quem-somos" element={<QuemSomos />} />
              <Route path="/o-que-fazemos" element={<OQueFazemos />} />
              <Route path="/projetos-sociais" element={<ProjetosSociais />} />
              <Route path="/meios-financiamento" element={<MeiosFinanciamento />} />
              <Route path="/contactos" element={<Contactos />} />
              <Route path="/localizacao" element={<Localizacao />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          <Footer />
          <WhatsAppButton />
        </div>
      </Router>
    </ErrorBoundary>
  );
}
