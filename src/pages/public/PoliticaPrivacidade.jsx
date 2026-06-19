import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Shield, 
  Lock, 
  Eye, 
  UserCheck, 
  Mail, 
  ArrowLeft, 
  BookOpen, 
  CheckCircle,
  Clock,
  ExternalLink
} from 'lucide-react';

export default function PoliticaPrivacidade() {
  const [activeSection, setActiveSection] = useState('introducao');

  const sections = [
    { id: 'introducao', label: '1. Introducao', icon: <BookOpen size={16} /> },
    { id: 'dados-recolhidos', label: '2. Dados Recolhidos', icon: <Eye size={16} /> },
    { id: 'uso-dados', label: '3. Utilizacao dos Dados', icon: <UserCheck size={16} /> },
    { id: 'seguranca', label: '4. Seguranca', icon: <Lock size={16} /> },
    { id: 'direitos', label: '5. Os Seus Direitos', icon: <Shield size={16} /> },
    { id: 'contacto', label: '6. Contacto', icon: <Mail size={16} /> },
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
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#14213D] via-[#1d2d44] to-[#2563eb] py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
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
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-300 backdrop-blur-sm border border-white/5">
                <Shield size={12} />
                Documento Oficial
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-4 tracking-tight">
                Politica de Privacidade
              </h1>
              <p className="text-slate-300 mt-2 text-sm max-w-xl">
                Saiba como a ALEM recolhe, utiliza e protege os seus dados pessoais, em conformidade com as melhores praticas de protecao de dados.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/40 backdrop-blur-md border border-white/5 p-3.5 rounded-xl self-start md:self-auto">
              <Clock size={14} className="text-blue-400" />
              <span>Ultima atualizacao: 19 de Junho de 2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto py-12 px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
              Indice do Documento
            </h3>
            <nav className="flex flex-col gap-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    activeSection === section.id
                      ? 'bg-blue-50 text-blue-600 shadow-sm border-l-4 border-blue-600'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className={activeSection === section.id ? 'text-blue-600' : 'text-slate-400'}>
                    {section.icon}
                  </span>
                  {section.label}
                </button>
              ))}
            </nav>
            <div className="pt-4 border-t border-slate-100 mt-4 text-center">
              <p className="text-xs text-slate-400">
                Tem duvidas sobre os seus dados?
              </p>
              <a 
                href="mailto:info@alem.mz"
                className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-bold mt-2 hover:underline"
              >
                Contacto com o Encarregado <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>

        {/* Content Details */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-slate-100 rounded-2xl p-8 md:p-10 shadow-sm space-y-12">
            
            {/* 1. Introducao */}
            <section id="introducao" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <BookOpen size={18} />
                </div>
                <h2 className="text-xl font-bold text-slate-900">1. Introducao</h2>
              </div>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                A Associacao Lacos Especiais de Mocambique (ALEM) esta profundamente empenhada em proteger a privacidade e a seguranca dos dados pessoais dos seus utilizadores, doadores, voluntarios e beneficiarios. 
              </p>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                Esta Politica de Privacidade descreve de que forma recolhemos, processamos, armazenamos e protegemos as informacoes fornecidas atraves do nosso website e de outros canais institucionais de comunicacao. Ao interagir com o nosso portal, concorda com as praticas descritas neste documento.
              </p>
            </section>

            {/* 2. Dados Recolhidos */}
            <section id="dados-recolhidos" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Eye size={18} />
                </div>
                <h2 className="text-xl font-bold text-slate-900">2. Dados Recolhidos</h2>
              </div>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                Dependendo da forma como interage connosco (por exemplo, ao fazer uma doacao, ao preencher o formulario de contacto ou ao inscrever-se na nossa newsletter), podemos recolher os seguintes tipos de informacoes:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-5 border border-slate-100 rounded-xl bg-slate-50/50">
                  <span className="font-bold text-slate-900 text-sm block mb-2">Dados de Identificacao</span>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Nome completo, endereco de correio eletronico, numero de telefone e dados de contacto para o envio de recibos ou correspondencia.
                  </p>
                </div>
                <div className="p-5 border border-slate-100 rounded-xl bg-slate-50/50">
                  <span className="font-bold text-slate-900 text-sm block mb-2">Dados de Transacoes</span>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Informacoes sobre as contribuicoes e doacoes efetuadas (montante, data e metodo de pagamento selecionado). Nao armazenamos detalhes diretos de cartoes ou contas bancarias.
                  </p>
                </div>
                <div className="p-5 border border-slate-100 rounded-xl bg-slate-50/50">
                  <span className="font-bold text-slate-900 text-sm block mb-2">Dados de Navegacao</span>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Endereco IP, tipo de navegador, paginas visitadas no nosso website e tempo de permanencia, recolhidos de forma agregada para melhorar o desempenho tecnico.
                  </p>
                </div>
                <div className="p-5 border border-slate-100 rounded-xl bg-slate-50/50">
                  <span className="font-bold text-slate-900 text-sm block mb-2">Comunicacoes Diretas</span>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Quaisquer mensagens, sugestoes ou pedidos de apoio enviados atraves do formulario de contactos ou e-mail corporativo.
                  </p>
                </div>
              </div>
            </section>

            {/* 3. Utilizacao dos Dados */}
            <section id="uso-dados" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <UserCheck size={18} />
                </div>
                <h2 className="text-xl font-bold text-slate-900">3. Utilizacao dos Dados</h2>
              </div>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                Os dados recolhidos destinam-se exclusivamente aos fins institucionais da ALEM, tais como:
              </p>
              <ul className="space-y-3 text-slate-600 text-sm md:text-base pt-2">
                <li className="flex items-start gap-2.5">
                  <CheckCircle size={16} className="text-emerald-500 shrink-0 mt-1" />
                  <span>Processar doacoes de forma segura e emitir os respetivos recibos de deducao fiscal, quando aplicavel.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle size={16} className="text-emerald-500 shrink-0 mt-1" />
                  <span>Responder a pedidos de esclarecimento, voluntariado ou assistencia social enviados pelos utilizadores.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle size={16} className="text-emerald-500 shrink-0 mt-1" />
                  <span>Enviar atualizacoes sobre os nossos projetos, campanhas de angariacao de fundos e relatorios de atividades, desde que tenha consentido explicitamente tal envio.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle size={16} className="text-emerald-500 shrink-0 mt-1" />
                  <span>Melhorar o design, usabilidade e seguranca do nosso website atraves de analise estatistica anonima.</span>
                </li>
              </ul>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base mt-2">
                A ALEM garante que nao comercializa, aluga ou cede os dados dos seus utilizadores a terceiros para fins publicitarios ou comerciais.
              </p>
            </section>

            {/* 4. Seguranca */}
            <section id="seguranca" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-9 h-9 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
                  <Lock size={18} />
                </div>
                <h2 className="text-xl font-bold text-slate-900">4. Seguranca</h2>
              </div>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                Implementamos rigorosas medidas tecnicas e organizativas de seguranca para proteger os seus dados pessoais contra perda, destruicao, acesso nao autorizado ou alteracao. 
              </p>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                Entre as medidas de seguranca aplicadas, destacam-se a encriptacao de dados em transito atraves de protocolo HTTPS/SSL, o controlo restrito de acessos internos as bases de dados e a utilizacao de fornecedores de servicos tecnologicos que cumprem elevados padroes internacionais de ciberseguranca.
              </p>
            </section>

            {/* 5. Direitos */}
            <section id="direitos" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                  <Shield size={18} />
                </div>
                <h2 className="text-xl font-bold text-slate-900">5. Os Seus Direitos</h2>
              </div>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                A qualquer momento, o utilizador pode exercer os seguintes direitos relativamente ao tratamento das suas informacoes pessoais:
              </p>
              <ul className="space-y-3 text-slate-600 text-sm md:text-base pt-2">
                <li className="flex items-start gap-2.5">
                  <CheckCircle size={16} className="text-blue-500 shrink-0 mt-1" />
                  <span><strong>Acesso e Retificacao:</strong> Solicitar uma copia dos dados que detemos e pedir a correcao de dados incompletos ou inexatos.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle size={16} className="text-blue-500 shrink-0 mt-1" />
                  <span><strong>Apagamento:</strong> Pedir a eliminacao definitiva dos seus dados pessoais das nossas bases de dados, desde que nao existam obrigacoes legais ou fiscais que exijam a sua retencao.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle size={16} className="text-blue-500 shrink-0 mt-1" />
                  <span><strong>Revogacao de Consentimento:</strong> Cancelar a subscricao de boletins informativos ou outras comunicacoes automaticas a qualquer momento, utilizando a hiperligacao de cancelamento presente nos e-mails.</span>
                </li>
              </ul>
            </section>

            {/* 6. Contacto */}
            <section id="contacto" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Mail size={18} />
                </div>
                <h2 className="text-xl font-bold text-slate-900">6. Contacto</h2>
              </div>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                Para exercer os seus direitos ou esclarecer qualquer questao relacionada com a presente Politica de Privacidade, podera contactar o nosso Encarregado de Protecao de Dados:
              </p>
              <div className="p-6 border border-slate-100 rounded-xl bg-slate-50/50 space-y-3 mt-4">
                <span className="font-bold text-slate-900 text-sm block">ALEM - Associacao Lacos Especiais de Mocambique</span>
                <div className="text-slate-600 text-xs space-y-2">
                  <p><strong>E-mail:</strong> info@alem.mz</p>
                  <p><strong>Telefone:</strong> +258 84 000 0000</p>
                  <p><strong>Endereco:</strong> Beira, Mocambique</p>
                </div>
              </div>
            </section>

          </div>
        </div>

      </div>
    </div>
  );
}
