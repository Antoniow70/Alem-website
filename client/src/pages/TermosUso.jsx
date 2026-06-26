import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  FileText, 
  CheckSquare, 
  Copyright, 
  CreditCard, 
  AlertTriangle, 
  RefreshCw, 
  Globe, 
  ArrowLeft,
  Clock,
  ExternalLink,
  CheckCircle
} from 'lucide-react';

export default function TermosUso() {
  const [activeSection, setActiveSection] = useState('aceitacao');

  const sections = [
    { id: 'aceitacao', label: '1. Aceitacao dos Termos', icon: <CheckSquare size={16} /> },
    { id: 'uso-web', label: '2. Uso do Website', icon: <FileText size={16} /> },
    { id: 'propriedade-intelectual', label: '3. Propriedade Intelectual', icon: <Copyright size={16} /> },
    { id: 'doacoes', label: '4. Doacoes e Transacoes', icon: <CreditCard size={16} /> },
    { id: 'responsabilidade', label: '5. Responsabilidade', icon: <AlertTriangle size={16} /> },
    { id: 'alteracoes', label: '6. Alteracoes nos Termos', icon: <RefreshCw size={16} /> },
    { id: 'lei-aplicavel', label: '7. Lei Aplicavel', icon: <Globe size={16} /> },
  ];

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Account for fixed navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-brand-eastBay dark:text-dark-text">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-bigStone via-brand-eastBay to-brand-horizon py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(var(--color-white)_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 text-sm font-semibold transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Voltar para a pagina inicial
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-poloBlue backdrop-blur-sm border border-white/5">
                <FileText size={12} />
                Acordo Legal
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-4 tracking-tight">
                Termos de Uso
              </h1>
              <p className="text-slate-300 mt-2 text-sm max-w-xl">
                Leia atentamente as condicoes e termos que regem a navegacao e a utilizacao dos servicos disponibilizados no website da ALEM.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300 dark:text-dark-muted bg-brand-bigStone/60 dark:bg-dark-surface/60 border border-white/10 dark:border-dark-muted/15 p-3.5 rounded-xl self-start md:self-auto">
              <Clock size={14} className="text-brand-poloBlue" />
              <span>Ultima atualizacao: 19 de Junho de 2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto py-12 px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
          <div className="bg-white/40 dark:bg-dark-surface/40 backdrop-blur-sm border border-brand-poloBlue/20 dark:border-dark-muted/10 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-400 dark:text-dark-muted uppercase tracking-wider px-2">
              Indice do Documento
            </h3>
            <nav className="flex flex-col gap-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    activeSection === section.id
                      ? 'bg-brand-poloBlue/15 text-brand-horizon shadow-sm border-l-4 border-brand-horizon dark:bg-white/10 dark:text-white dark:border-white'
                      : 'text-brand-eastBay dark:text-dark-muted hover:bg-brand-poloBlue/15 dark:hover:bg-white/5 hover:text-brand-bigStone dark:hover:text-white'
                  }`}
                >
                  <span className={activeSection === section.id ? 'text-brand-horizon dark:text-white' : 'text-slate-400 dark:text-dark-muted'}>
                    {section.icon}
                  </span>
                  {section.label}
                </button>
              ))}
            </nav>
            <div className="pt-4 border-t border-brand-poloBlue/20 dark:border-dark-muted/10 mt-4 text-center">
              <p className="text-xs text-slate-400 dark:text-dark-muted">
                Necessita de suporte adicional?
              </p>
              <Link 
                to="/contactos"
                className="inline-flex items-center gap-1.5 text-xs text-brand-horizon dark:text-brand-poloBlue hover:text-brand-eastBay font-bold mt-2 hover:underline"
              >
                Formulario de Contacto <ExternalLink size={12} />
              </Link>
            </div>
          </div>
        </div>

        {/* Content Details */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white/40 dark:bg-dark-surface/40 backdrop-blur-sm border border-brand-poloBlue/20 dark:border-dark-muted/10 rounded-2xl p-8 md:p-10 shadow-sm space-y-12">
            
            {/* 1. Aceitacao dos Termos */}
            <section id="aceitacao" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-brand-poloBlue/20">
                <div className="w-9 h-9 rounded-lg bg-brand-poloBlue/15 flex items-center justify-center text-brand-horizon">
                  <CheckSquare size={18} />
                </div>
                <h2 className="text-xl font-bold text-brand-bigStone dark:text-dark-text">1. Aceitacao dos Termos</h2>
              </div>
              <p className="text-brand-eastBay dark:text-dark-muted leading-relaxed text-sm md:text-base">
                Ao aceder, navegar e utilizar o website da Associacao Lacos Especiais de Mocambique (ALEM), o utilizador reconhece que leu, compreendeu e concorda expressamente em cumprir todos os termos e condicoes descritos neste Acordo Legal. 
              </p>
              <p className="text-brand-eastBay dark:text-dark-muted leading-relaxed text-sm md:text-base">
                Se nao concordar com alguma das clausulas estipuladas nestes Termos de Uso, solicitamos que interrompa imediatamente a utilizacao do website e dos seus recursos associados.
              </p>
            </section>

            {/* 2. Uso do Website */}
            <section id="uso-web" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-brand-poloBlue/20">
                <div className="w-9 h-9 rounded-lg bg-feedback-successLight flex items-center justify-center text-feedback-success">
                  <FileText size={18} />
                </div>
                <h2 className="text-xl font-bold text-brand-bigStone dark:text-dark-text">2. Uso do Website</h2>
              </div>
              <p className="text-brand-eastBay dark:text-dark-muted leading-relaxed text-sm md:text-base">
                O utilizador compromete-se a fazer um uso responsavel, licito e etico do website da ALEM. E estritamente proibido:
              </p>
              <ul className="space-y-3 text-brand-eastBay dark:text-dark-muted text-sm md:text-base pt-2">
                <li className="flex items-start gap-2.5">
                  <CheckCircle size={16} className="text-feedback-success shrink-0 mt-1" />
                  <span>Utilizar o portal para divulgar, transmitir ou partilhar qualquer tipo de conteudo ofensivo, discriminatorio, calunioso ou ilegal.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle size={16} className="text-feedback-success shrink-0 mt-1" />
                  <span>Praticar atos que possam sobrecarregar, danificar ou inutilizar a infraestrutura tecnica e de servidores da ALEM.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle size={16} className="text-feedback-success shrink-0 mt-1" />
                  <span>Tentar obter acessos nao autorizados a area administrativa ("/admin") ou as bases de dados privadas por quaisquer meios.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle size={16} className="text-feedback-success shrink-0 mt-1" />
                  <span>Utilizar quaisquer robos, spiders ou ferramentas automaticas para monitorizar ou extrair conteudos do website sem autorizacao previa por escrito.</span>
                </li>
              </ul>
            </section>

            {/* 3. Propriedade Intelectual */}
            <section id="propriedade-intelectual" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-brand-poloBlue/20">
                <div className="w-9 h-9 rounded-lg bg-brand-poloBlue/15 flex items-center justify-center text-brand-eastBay">
                  <Copyright size={18} />
                </div>
                <h2 className="text-xl font-bold text-brand-bigStone dark:text-dark-text">3. Propriedade Intelectual</h2>
              </div>
              <p className="text-brand-eastBay dark:text-dark-muted leading-relaxed text-sm md:text-base">
                Todos os conteudos visuais e textuais presentes no website — incluindo marcas, logotipos, imagens, textos descritivos, fotografias de intervencoes e projetos, icones personalizados, layouts e codigo-fonte — pertencem em exclusividade a Associacao Lacos Especiais de Mocambique ou a terceiros que autorizaram a sua legitima divulgacao.
              </p>
              <p className="text-brand-eastBay dark:text-dark-muted leading-relaxed text-sm md:text-base">
                Nao e permitida a reproducao, copia, venda, modificacao ou exploracao comercial de quaisquer materiais do website sem o consentimento formal e escrito dos orgaos de lideranca da ALEM.
              </p>
            </section>

            {/* 4. Doacoes e Transacoes */}
            <section id="doacoes" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-brand-poloBlue/20">
                <div className="w-9 h-9 rounded-lg bg-feedback-errorLight flex items-center justify-center text-feedback-error">
                  <CreditCard size={18} />
                </div>
                <h2 className="text-xl font-bold text-brand-bigStone dark:text-dark-text">4. Doacoes e Transacoes</h2>
              </div>
              <p className="text-brand-eastBay dark:text-dark-muted leading-relaxed text-sm md:text-base">
                Ao efetuar uma doacao financeira a ALEM atraves dos metodos disponibilizados (como M-Pesa, e-Mola, transferencias bancarias ou cartoes de credito):
              </p>
              <ul className="space-y-3 text-brand-eastBay dark:text-dark-muted text-sm md:text-base pt-2">
                <li className="flex items-start gap-2.5">
                  <CheckCircle size={16} className="text-feedback-error shrink-0 mt-1" />
                  <span>Garante que possui plena capacidade juridica para efetuar a transacao e que os fundos tem proveniencia licita.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle size={16} className="text-feedback-error shrink-0 mt-1" />
                  <span>Reconhece que as doacoes sao contributos voluntarios nao reembolsaveis destinados as atividades de apoio social da associacao.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle size={16} className="text-feedback-error shrink-0 mt-1" />
                  <span>Aceita que a ALEM recorra a entidades financeiras e gateways de pagamento externas para a seguranca e o bom processamento da transacao.</span>
                </li>
              </ul>
            </section>

            {/* 5. Responsabilidade */}
            <section id="responsabilidade" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-brand-poloBlue/20">
                <div className="w-9 h-9 rounded-lg bg-feedback-warningLight flex items-center justify-center text-feedback-warning">
                  <AlertTriangle size={18} />
                </div>
                <h2 className="text-xl font-bold text-brand-bigStone dark:text-dark-text">5. Limitacao de Responsabilidade</h2>
              </div>
              <p className="text-brand-eastBay dark:text-dark-muted leading-relaxed text-sm md:text-base">
                Embora envidemos todos os esforcos tecnicos para manter a disponibilidade continua e a seguranca do website, a ALEM nao garante que o portal funcione de forma totalmente ininterrupta ou livre de erros pontuais, virus de rede ou outras vulnerabilidades resultantes de acoes de terceiros.
              </p>
              <p className="text-brand-eastBay dark:text-dark-muted leading-relaxed text-sm md:text-base">
                A ALEM nao sera responsavel por quaisquer danos diretos, indiretos ou acidentais resultantes do uso inadequado do website ou da incapacidade de aceder aos seus servicos.
              </p>
            </section>

            {/* 6. Alteracoes nos Termos */}
            <section id="alteracoes" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-brand-poloBlue/20">
                <div className="w-9 h-9 rounded-lg bg-brand-poloBlue/15 flex items-center justify-center text-brand-eastBay">
                  <RefreshCw size={18} />
                </div>
                <h2 className="text-xl font-bold text-brand-bigStone dark:text-dark-text">6. Alteracoes nos Termos</h2>
              </div>
              <p className="text-brand-eastBay dark:text-dark-muted leading-relaxed text-sm md:text-base">
                A ALEM reserva-se o direito unilateral de atualizar, modificar ou substituir qualquer parte destes Termos de Uso em qualquer altura. As alteracoes entram em vigor imediatamente apos a sua publicacao no website.
              </p>
              <p className="text-brand-eastBay dark:text-dark-muted leading-relaxed text-sm md:text-base">
                E da responsabilidade do utilizador consultar esta pagina periodicamente para se manter informado sobre as condicoes de utilizacao vigentes.
              </p>
            </section>

            {/* 7. Lei Aplicavel */}
            <section id="lei-aplicavel" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-brand-poloBlue/20">
                <div className="w-9 h-9 rounded-lg bg-brand-poloBlue/15 flex items-center justify-center text-brand-eastBay">
                  <Globe size={18} />
                </div>
                <h2 className="text-xl font-bold text-brand-bigStone dark:text-dark-text">7. Lei Aplicavel e Jurisdicao</h2>
              </div>
              <p className="text-brand-eastBay dark:text-dark-muted leading-relaxed text-sm md:text-base">
                Estes Termos de Uso sao regidos e interpretados de acordo com a legislacao em vigor na Republica de Mocambique. 
              </p>
              <p className="text-brand-eastBay dark:text-dark-muted leading-relaxed text-sm md:text-base">
                Para a resolucao de qualquer litigio emergente da interpretacao ou execucao do presente acordo, as partes submetem-se expressamente a competencia exclusiva dos tribunais da provincia de Sofala, Mocambique.
              </p>
            </section>

          </div>
        </div>

      </div>
    </div>
  );
}
