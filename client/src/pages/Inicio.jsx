import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Target, Award, Users, Calendar, ChevronRight, Newspaper, Heart, History, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { getProjects } from '../domains/projetos/services/projetosApi';
import { getNews } from '../domains/noticias/services/noticiasApi';
import { getTeam } from '../domains/equipa/services/equipaApi';
import TeamMemberCard from '../domains/equipa/cards/TeamMemberCard';
import ProjectCard from '../domains/projetos/cards/ProjectCard';
import Partners from '../domains/parceiros/components/Partners';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function Inicio() {
  const navigate = useNavigate();
  const [destaques, setDestaques] = useState([]);
  const [recentNews, setRecentNews] = useState([]);
  const [team, setTeam] = useState([]);
  const [flippedId, setFlippedId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [projectsData, newsData, teamData] = await Promise.all([
          getProjects({ status: 'Concluido' }).catch(() => []),
          getNews().catch(() => []),
          getTeam().catch(() => [])
        ]);
        
        // Filter concluded and take at most 4
        const concluded = (projectsData || [])
          .filter(p => p.status === 'Concluido')
          .slice(0, 4);
        setDestaques(concluded);

        // Take at most 4 recent news
        setRecentNews((newsData || []).slice(0, 4));

        // Get team members (sort by sort_order or slice at most 8 for homepage)
        const sortedTeam = (teamData || [])
          .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
          .slice(0, 8);
        setTeam(sortedTeam);
      } catch (err) {
        console.error('Error loading homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="overflow-hidden bg-white dark:bg-dark-bg space-y-24 pb-24">
      {/* 1. Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center pt-20 px-6 md:px-12 lg:px-16 bg-brand-bigStone text-white">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/ImagemDaTelaInicio.png"
            alt="Criancas em Mocambique"
            className="w-full h-full object-cover opacity-[0.58] dark:opacity-[0.80]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-bigStone/30 via-transparent to-brand-bigStone/95 dark:from-dark-bg/85 dark:via-dark-bg/70 dark:to-dark-bg z-10" />
        </div>

        <div className="max-w-4xl mx-auto w-full relative z-20 text-center space-y-6">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-lg bg-brand-poloBlue/15 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-white"
          >
            Associacao Lacos Especiais Mocambique
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black leading-tight tracking-tight text-white"
          >
            Construindo <span className="text-brand-horizon drop-shadow-md">Lacos de Inclusao</span> em Mocambique
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              to="/contactos?tab=volunteer"
              className="btn-primary w-full sm:w-auto text-sm px-6 py-3.5 shadow-lg shadow-brand-horizon/25"
            >
              Tornar-me Voluntario <ArrowRight size={16} />
            </Link>
            <Link
              to="/contactos?tab=contact"
              className="btn-ghost w-full sm:w-auto text-sm px-6 py-3.5 !bg-transparent border-brand-poloBlue/30 text-white hover:!bg-white/10"
            >
              Solicitar Apoio <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. Sobre Nos Section */}
      <section className="px-6 md:px-12 lg:px-16 max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-[36px] border border-brand-poloBlue/20 dark:border-dark-muted/10 bg-white dark:bg-dark-surface shadow-md p-8 sm:p-14">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-horizon/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8 space-y-6">
              <span className="inline-flex items-center rounded-lg bg-brand-poloBlue/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-brand-horizon">
                Sobre Nos
              </span>
              <h3 className="text-3xl md:text-4xl font-extrabold text-brand-bigStone dark:text-white leading-tight">
                Trabalhamos por uma educacao inclusiva e um futuro mais justo para todos
              </h3>
              <p className="text-brand-eastBay dark:text-dark-muted leading-relaxed text-sm md:text-base">
                A ALEM e uma associacao sem fins lucrativos dedicada a combater os desafios enfrentados por individuos com necessidades especiais em Mocambique. Atraves de metodologias inclusivas, capacitacao profissional e intervencao comunitaria, nossa missao e assegurar que todas as pessoas tenham pleno acesso ao ensino de qualidade e oportunidades reais no mercado de trabalho.
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
            <div className="lg:col-span-4 flex justify-center">
              <div className="w-48 h-48 rounded-[32px] overflow-hidden bg-brand-poloBlue/10 p-2 border border-brand-poloBlue/20">
                <img
                  src="/images/logo alem.jpg"
                  alt="ALEM Logo"
                  className="w-full h-full object-cover rounded-[24px]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. A Nossa Historia Section */}
      <section className="px-6 md:px-12 lg:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <img
              src="/images/membrosAlem.jpg"
              alt="Membros da ALEM reunidos"
              className="rounded-[32px] shadow-lg w-full aspect-[4/3] object-cover border border-brand-poloBlue/20"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-brand-horizon/10 rounded-full blur-2xl -z-10"></div>
          </div>
          <div className="space-y-6">
            <span className="inline-flex items-center rounded-lg bg-brand-poloBlue/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-brand-horizon">
              <History size={12} className="mr-1" /> A Nossa Historia
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-bigStone dark:text-white leading-tight">
              Como tudo comecou
            </h2>
            <p className="text-brand-eastBay dark:text-dark-muted leading-relaxed text-sm md:text-base">
              A ALEM surgiu em Julho de 2021 a partir de uma iniciativa inspiradora de estudantes da Universidade Zambeze, motivados a responder aos principais obstaculos vividos por alunos com necessidades educativas especiais na Faculdade de Ciencias Sociais e Humanidades. 
            </p>
            <p className="text-brand-eastBay dark:text-dark-muted leading-relaxed text-sm md:text-base">
              Ao partilharem suas dificuldades, os fundadores identificaram problemas graves: a falta de infraestruturas adequadas, carencia de suporte financeiro e humano nas salas de aula, e uma profunda ausencia de conscientizacao comunitaria. Elegendo a educacao como principal veiculo para transformacao social, formalizou-se a criacao da associacao para construir pontes de inclusao.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Missao, Visao e Valores */}
      <section className="px-6 md:px-12 lg:px-16 bg-white dark:bg-dark-bg py-16">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-bold text-brand-horizon uppercase tracking-[0.3em] block">
              Directrizes
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-brand-bigStone dark:text-white tracking-tight">
              Missao, Visao & Valores
            </h2>
            <div className="w-12 h-1 bg-brand-horizon mx-auto rounded-full mt-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Missao */}
            <div className="bg-white dark:bg-dark-surface border border-brand-poloBlue/15 dark:border-dark-muted/10 p-8 rounded-3xl space-y-5 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-brand-horizon/10 text-brand-horizon">
                <Target size={24} />
              </div>
              <h3 className="text-xl font-bold text-brand-bigStone dark:text-white">Missao</h3>
              <p className="text-brand-eastBay dark:text-dark-muted leading-relaxed text-xs sm:text-sm">
                Assegurar a inclusao e qualidade de ensino das pessoas com necessidades especiais, assim como garantir a sua insercao laboral no mercado de trabalho, atraves de acoes de protecao e intervencao social, e advocacia dos seus direitos.
              </p>
            </div>

            {/* Visao */}
            <div className="bg-white dark:bg-dark-surface border border-brand-poloBlue/15 dark:border-dark-muted/10 p-8 rounded-3xl space-y-5 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-brand-horizon/10 text-brand-horizon">
                <Award size={24} />
              </div>
              <h3 className="text-xl font-bold text-brand-bigStone dark:text-white">Visao</h3>
              <p className="text-brand-eastBay dark:text-dark-muted leading-relaxed text-xs sm:text-sm">
                Estabelecer uma plataforma funcional e de referencia nacional, especializada em servicos sociais de referencia, rastreio, inclusao escolar e laboral para as pessoas com necessidades especiais.
              </p>
            </div>

            {/* Valores */}
            <div className="bg-white dark:bg-dark-surface border border-brand-poloBlue/15 dark:border-dark-muted/10 p-8 rounded-3xl space-y-5 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-brand-horizon/10 text-brand-horizon">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold text-brand-bigStone dark:text-white">Valores</h3>
              <p className="text-brand-eastBay dark:text-dark-muted leading-relaxed text-xs sm:text-sm">
                Nossas acoes assentam nos pilares de Unidade, Respeito pelos Direitos Humanos, Compaixao, Comprometimento, Responsabilidade, Honestidade, Justica Social, Solidariedade, Transparencia, Equidade e Universalidade.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Destaques (Projetos Concluidos) */}
      <section className="px-6 md:px-12 lg:px-16 max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-3">
            <span className="inline-flex items-center rounded-lg bg-brand-horizon/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-horizon">
              Impacto Concretizado
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-bigStone dark:text-white tracking-tight leading-none">
              Projetos Concluidos
            </h2>
          </div>
          <Link
            to="/destaques"
            className="btn-primary inline-flex items-center gap-1.5 text-xs py-3 px-5 shrink-0 self-start sm:self-auto"
          >
            Ver todos destaques <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-horizon"></div>
          </div>
        ) : destaques.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-dark-surface rounded-3xl border border-dashed border-slate-200 p-6">
            <p className="text-sm text-brand-eastBay dark:text-dark-muted font-semibold">Sem projetos concluidos para exibicao no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {destaques.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => navigate('/projetos-sociais/' + project.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 6. Noticias Recentes */}
      {recentNews.length > 0 && (
        <section className="px-6 md:px-12 lg:px-16 max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="inline-flex items-center gap-2 rounded-lg bg-brand-horizon/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-horizon">
              <Newspaper size={12} /> Noticias Recentes
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-brand-bigStone dark:text-white tracking-tight">
              Noticias e Eventos
            </h2>
            <div className="w-12 h-1 bg-brand-horizon mx-auto rounded-full mt-2" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentNews.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.5 }}
                className="h-full"
              >
                <Link
                  to={`/noticias/${item.id}`}
                  className="group block bg-white dark:bg-dark-surface rounded-2xl border border-brand-poloBlue/10 dark:border-dark-muted/10 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col justify-between"
                >
                  <div>
                    {(item.capa_url || item.capa_data) && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={item.capa_data || item.capa_url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                    <div className="p-5 space-y-2">
                      <span className="text-[10px] font-bold text-brand-horizon uppercase tracking-wider flex items-center gap-1">
                        <Calendar size={10} />
                        {formatDate(item.news_date)}
                      </span>
                      <h3 className="text-xs sm:text-sm font-bold text-brand-bigStone dark:text-white line-clamp-2 group-hover:text-brand-horizon transition-colors leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-[11px] leading-relaxed text-brand-eastBay dark:text-dark-muted line-clamp-3">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <div className="p-5 pt-0">
                    <span className="text-[10px] font-bold text-brand-horizon flex items-center gap-1 border-t border-brand-poloBlue/15 pt-3">
                      Ler mais <ChevronRight size={10} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* 7. Membros da Equipa */}
      {team.length > 0 && (
        <section className="px-6 md:px-12 lg:px-16 max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="inline-flex items-center rounded-lg bg-brand-poloBlue/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-brand-horizon">
              A Nossa Equipa
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-brand-bigStone dark:text-white tracking-tight">
              Membros da Equipa
            </h2>
            <div className="w-12 h-1 bg-brand-horizon mx-auto rounded-full mt-2" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {team.map((person, i) => (
              <TeamMemberCard
                key={person.id}
                person={person}
                index={i}
                isFlipped={flippedId === person.id}
                onToggle={() => setFlippedId(flippedId === person.id ? null : person.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* 8. Parceiros Section */}
      <section className="py-12 border-t border-brand-poloBlue/20 dark:border-dark-muted/10 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <Partners />
        </div>
      </section>
    </div>
  );
}
