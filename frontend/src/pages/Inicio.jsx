import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Users, Heart, BookOpen, CheckCircle, Target, Award, GraduationCap, Lightbulb, ShieldCheck, UserCircle, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getPillars, getProjects } from '../domains/projetos';
import { getTeam } from '../domains/equipa';
import ProjectCard from '../domains/projetos/cards/ProjectCard';
import TeamMemberCard from '../domains/equipa/cards/TeamMemberCard';
import Partners from '../domains/parceiros/components/Partners';

export default function Inicio({ isSection = false }) {
  const navigate = useNavigate();
  const [pillars, setPillars] = useState([]);
  const [team, setTeam] = useState([]);
  const [projects, setProjects] = useState([]);
  const [flippedId, setFlippedId] = useState(null);

  const handleScrollToSection = (e, id) => {
    e.preventDefault();
    if (isSection) {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      navigate('/', { state: { scrollToId: id } });
    }
  };

  useEffect(() => {
    async function loadData() {
      try {
        const [pillarsData, teamData, projectsData] = await Promise.all([
          getPillars(),
          getTeam(),
          getProjects()
        ]);
        setPillars(pillarsData || []);
        setTeam(teamData || []);
        
        const filteredProjects = (projectsData || [])
          .filter(p => p.status === 'Em Curso' || p.status === 'Concluido')
          .slice(0, 4); // Shows up to 4 projects
        setProjects(filteredProjects);
      } catch (err) {
        console.error('Error loading home data:', err);
      }
    }
    loadData();
  }, []);

  return (
    <div className="overflow-hidden bg-slate-50">

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center pt-20 px-6 md:px-12 lg:px-16">
        <div className="absolute inset-0 z-0 bg-slate-950">
          <img
            src="/images/Intervencao-social-imagem-principal.jpg"
            alt="Criancas em Mocambique"
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/20 z-10" />
        </div>

        <div className="max-w-4xl mx-auto w-full relative z-20 text-white text-center">
          <div className="space-y-6">
            <span className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
              Associacao Lacos Especiais Mocambique
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-white tracking-tight">
              Construindo <span className="text-blue-400 drop-shadow-sm">Lacos de Inclusao</span> em Mocambique
            </h1>
            <p className="text-base md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Promovemos a insercao das pessoas com necessidades especiais no acesso aos subsistemas de ensino e aprendizagem.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/contactos"
                onClick={(e) => handleScrollToSection(e, 'contactos')}
                className="btn-primary w-full sm:w-auto text-sm px-6 py-3.5 shadow-lg shadow-blue-500/20"
              >
                Tornar-me Voluntario <ArrowRight size={16} />
              </Link>
              <Link
                to="/contactos"
                onClick={(e) => handleScrollToSection(e, 'contactos')}
                className="btn-ghost w-full sm:w-auto text-sm px-6 py-3.5 !bg-transparent border-white/30 text-white hover:!bg-white/10 hover:text-white"
              >
                Solicitar Apoio <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-16 px-6 md:px-12 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm p-8 sm:p-12">
            <div className="space-y-6">
              <div className="space-y-3 max-w-3xl">
                <span className="inline-flex items-center rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-600">
                  Sobre Nos
                </span>
                <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
                  Trabalhamos por uma educacao inclusiva e um futuro mais justo para todos.
                </h3>
              </div>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base max-w-3xl">
                A ALEM e uma associacao dedicada a inclusao de pessoas com necessidades especiais em Mocambique, oferecendo apoio educacional, capacitacao de cuidadores e fortalecimento comunitarios.
              </p>
              <Link
                to="/quem-somos"
                onClick={(e) => handleScrollToSection(e, 'quem-somos')}
                className="inline-flex items-center gap-1.5 text-blue-600 font-bold text-sm hover:gap-2.5 transition-all"
              >
                Conheca a nossa historia <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      {!isSection && (
        <section className="py-12 px-6 md:px-12 lg:px-16 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Missao',
                desc: 'Assegurar a inclusao e qualidade de ensino das pessoas com necessidades especiais, assim como garantir a sua insercao laboral no mercado de trabalho, atraves de acoes de protecao e intervencao social, e advocacia dos seus direitos.',
                icon: <Target className="text-blue-600 w-8 h-8" />,
                color: 'bg-blue-50/50 border border-slate-100'
              },
              {
                title: 'Visao',
                desc: 'Estabelecer uma plataforma funcional e de referencia nacional, especializada em servicos sociais de rastreio, inclusao escolar e laboral para as pessoas com necessidades especiais.',
                icon: <Award className="text-emerald-600 w-8 h-8" />,
                color: 'bg-emerald-50/30 border border-slate-100'
              },
              {
                title: 'Valores',
                desc: 'Unidade, Respeito pelos Direitos Humanos, Compaixao, Comprometimento, Responsabilidade, Honestidade, Justica Social, Solidariedade, Transparencia, Equidade e Universalidade.',
                icon: <Users className="text-indigo-600 w-8 h-8" />,
                color: 'bg-indigo-50/30 border border-slate-100'
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4 }}
                className={`${item.color} p-8 rounded-2xl space-y-5 shadow-sm transition-all duration-300 bg-white`}
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-50">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {!isSection && (
        <>
          {/* Social Projects Section */}
          <section className="py-20 px-6 md:px-12 lg:px-16 bg-slate-50">
            <div className="max-w-7xl mx-auto space-y-12">
              <div className="space-y-3 text-left">
                <span className="inline-flex items-center rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-600">Iniciativas</span>
                <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                  Destaques
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {projects
                  .slice(0, 4)
                  .map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onClick={() => navigate('/projetos-sociais/' + project.id)}
                    />
                  ))}
                {projects.length === 0 && (
                  <div className="col-span-full text-center text-slate-400 py-12 text-sm font-medium">
                    A carregar iniciativas recentes...
                  </div>
                )}
              </div>

              <div className="text-center pt-4">
                <Link
                  to="/projetos-sociais"
                  className="btn-primary"
                >
                  Ver Todos os Projetos <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </section>

          {/* O Que Fazemos Section */}
          <section className="py-20 px-6 md:px-12 lg:px-16 bg-white">
            <div className="max-w-7xl mx-auto space-y-12">
              <div className="space-y-3 text-left max-w-3xl">
                <span className="inline-flex items-center rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-600">Programas</span>
                <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                  O Que Fazemos
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                  Desenvolvemos programas integrados que abrangem a crianca, a escola, a familia e a sociedade.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pillars.map((pillar, i) => {
                  const icons = [<GraduationCap size={24} />, <BookOpen size={24} />, <Users size={24} />];
                  const colors = [
                    'bg-blue-50 text-blue-600',
                    'bg-emerald-50 text-emerald-600',
                    'bg-amber-50 text-amber-600'
                  ];
                  return (
                    <motion.div
                      key={pillar.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow transition-all group"
                    >
                      <div className={`${colors[i % colors.length]} w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform`}>
                        {pillar.icon_url ? <img src={pillar.icon_url} alt="" className="w-6 h-6 object-contain" /> : icons[i % icons.length]}
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 mb-3">{pillar.name}</h4>
                      <p className="text-slate-500 leading-relaxed text-sm">{pillar.description}</p>
                    </motion.div>
                  );
                })}
              </div>

              <div className="text-center pt-4">
                <Link to="/o-que-fazemos" className="btn-primary">
                  Ver Todos os Programas <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Partners Section */}
      <section className="py-16 px-6 md:px-12 lg:px-16 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <Partners />
        </div>
      </section>

      {/* Equipa Section */}
      {!isSection && team.length > 0 && (
        <section className="py-20 px-6 md:px-12 lg:px-16 bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="text-left space-y-3">
              <span className="inline-flex items-center rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-600">A Nossa Equipa</span>
              <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900">Membros</h3>
              <p className="text-slate-500 text-sm">Clique em saber mais para conhecer o membro.</p>
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
          </div>
        </section>
      )}
    </div>
  );
}
