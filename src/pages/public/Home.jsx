import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Inicio from './Inicio';
import QuemSomos from './QuemSomos';
import OQueFazemos from './OQueFazemos';
import ProjetosSociais from './Destaques';
import Contactos from './Contactos';
import Localizacao from './Localizacao';

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    const scrollToId = location.state?.scrollToId || window.location.hash?.replace('#', '');
    if (scrollToId) {
      // Clear hash and state in the window history so refresh doesn't trigger scroll unexpectedly
      window.history.replaceState({}, document.title, window.location.pathname);
      
      const scrollWithRetry = (retryCount = 0) => {
        const element = document.getElementById(scrollToId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (retryCount < 10) {
          setTimeout(() => scrollWithRetry(retryCount + 1), 100);
        }
      };
      
      scrollWithRetry();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  return (
    <div className="bg-slate-50 space-y-0">
      <div id="inicio">
        <Inicio isSection={true} />
      </div>
      <div id="quem-somos">
        <QuemSomos isSection={true} />
      </div>
      <div id="o-que-fazemos">
        <OQueFazemos isSection={true} />
      </div>
      <div id="destaques">
        <ProjetosSociais isSection={true} />
      </div>
      <div id="contactos">
        <Contactos isSection={true} />
      </div>
      <div id="localizacao">
        <Localizacao isSection={true} />
      </div>
    </div>
  );
}
