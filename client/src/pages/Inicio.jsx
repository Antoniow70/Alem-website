import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Partners from '../domains/parceiros/components/Partners';

export default function Inicio() {
  return (
    <div className="overflow-hidden bg-transparent">

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center pt-20 px-6 md:px-12 lg:px-16 bg-brand-bigStone text-white">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/ImagemDaTelaInicio.png"
            alt="Criancas em Mocambique"
            className="w-full h-full object-cover opacity-[0.62] dark:opacity-[0.84]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-bigStone/30 via-transparent to-brand-bigStone/90 dark:from-dark-bg/85 dark:via-dark-bg/70 dark:to-dark-bg z-10" />
        </div>

        <div className="max-w-4xl mx-auto w-full relative z-20 text-center">
          <div className="space-y-6">
            <span className="inline-flex items-center rounded-lg bg-brand-poloBlue/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
              Associacao Lacos Especiais Mocambique
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-white tracking-tight">
              Construindo <span className="text-brand-horizon drop-shadow-md">Lacos de Inclusao</span> em Mocambique
            </h1>
            <p className="text-base md:text-xl text-gray-200 leading-relaxed max-w-2xl mx-auto">
              Promovemos a insercao das pessoas com necessidades especiais no acesso aos subsistemas de ensino e aprendizagem.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/contactos?tab=volunteer"
                className="btn-primary w-full sm:w-auto text-sm px-6 py-3.5 shadow-lg shadow-brand-horizon/20"
              >
                Tornar-me Voluntario <ArrowRight size={16} />
              </Link>
              <Link
                to="/contactos?tab=contact"
                className="btn-ghost w-full sm:w-auto text-sm px-6 py-3.5 !bg-transparent border-brand-poloBlue/30 text-brand-eastBay hover:!bg-brand-poloBlue/10 dark:border-white/30 dark:text-white dark:hover:!bg-transparent/10"
              >
                Solicitar Apoio <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Intro Section - Sobre Nos */}
      <section className="py-16 px-6 md:px-12 lg:px-16 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl border border-brand-poloBlue/20 bg-transparent shadow-sm p-8 sm:p-12">
            <div className="space-y-6">
              <div className="space-y-3 max-w-3xl">
                <span className="inline-flex items-center rounded-lg bg-brand-poloBlue/15 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-horizon">
                  Sobre Nos
                </span>
                <h3 className="text-2xl md:text-3xl font-extrabold text-brand-bigStone dark:text-dark-text leading-tight">
                  Trabalhamos por uma educacao inclusiva e um futuro mais justo para todos.
                </h3>
              </div>
              <p className="text-brand-eastBay dark:text-dark-muted leading-relaxed text-sm md:text-base max-w-3xl">
                A ALEM e uma associacao dedicada a inclusao de pessoas com necessidades especiais em Mocambique, oferecendo apoio educacional, capacitacao de cuidadores e fortalecimento comunitario.
              </p>
              <div className="pt-2">
                <Link
                  to="/quem-somos"
                  className="btn-primary inline-flex items-center gap-2 text-sm px-6 py-3"
                >
                  Saber Mais <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 px-6 md:px-12 lg:px-16 bg-transparent border-t border-brand-poloBlue/20 dark:border-dark-muted/10">
        <div className="max-w-7xl mx-auto">
          <Partners />
        </div>
      </section>

    </div>
  );
}
