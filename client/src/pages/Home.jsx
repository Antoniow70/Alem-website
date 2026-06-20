import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Inicio from './Inicio';
import QuemSomos from '../domains/equipa/pages/QuemSomos';
import OQueFazemos from '../domains/projetos/pages/OQueFazemos';
import ProjetosSociais from '../domains/projetos/pages/Destaques';
import Contactos from './Contactos';
import Localizacao from './Localizacao';
import Partners from '../domains/parceiros/components/Partners';

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
    <div className="bg-transparent space-y-0">
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
      <div id="parceiros">
        <section className="py-16 px-6 md:px-12 lg:px-16 bg-transparent border-t border-brand-poloBlue/20 dark:border-dark-muted/10">
          <div className="max-w-7xl mx-auto">
            <Partners />
          </div>
        </section>
      </div>
    </div>
  );
}
