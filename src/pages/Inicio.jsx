import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Users, Heart, BookOpen, CheckCircle, Target, Award, GraduationCap, Lightbulb, ShieldCheck, UserCircle, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase, resolveProjectMediaUrls } from '../lib/supabase';
import ProjectCard from '../components/ProjectCard';

export default function Inicio() {
  const navigate = useNavigate();
  const [team, setTeam] = useState([]);
  const [projects, setProjects] = useState([]);
  const [flippedId, setFlippedId] = useState(null);

  useEffect(() => {
    const loadTeam = async () => {
      try {
        const { data, error } = await supabase.from('team').select('*').order('created_at', { ascending: false });
        if (!error && data) {
          setTeam(data);
        }
      } catch (err) {
        console.error('Error fetching team:', err);
      }
    };
    loadTeam();

    const fetchRecentProjects = async () => {
      try {
        const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false }).limit(3);
        const resolved = await resolveProjectMediaUrls(data || []);
        setProjects(resolved);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRecentProjects();

    const handleStorageChange = (e) => {
      if (e.key === 'alem_projects_db') fetchRecentProjects();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className="overflow-hidden">

      <section className="relative min-h-[75vh] flex items-center justify-center pt-16 px-6 md:px-12 lg:px-16">
        <div className="absolute inset-0 z-0 bg-slate-900">
          <img
            src="Imagem/Intervencao-social-imagem-principal.jpg"
            alt="Criancas em Mocambique"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-slate-950/45 to-slate-950/20 z-10" />
        </div>

        <div className="max-w-4xl mx-auto w-full relative z-20 text-white text-center">
          <div className="space-y-6">
            <span className="inline-flex items-center rounded-full bg-brand-primary px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] text-white">
              • Associacao Lacos Especiais Mocambique
            </span>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white">
              Construindo <span className="text-blue-400 drop-shadow-md">Lacos de Inclusao</span> em Mocambique
            </h1>
            <p className="text-base md:text-lg text-white/90 leading-relaxed opacity-90 max-w-2xl mx-auto">
              Promovemos a insercao das pessoas com necessidades especiais no acesso aos subsistemas de ensino e aprendizagem.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link
                to="/contactos"
                className="btn-primary"
              >
                Tornar-me Voluntario <ArrowRight size={18} />
              </Link>
              <Link
                to="/contactos"
                className="inline-flex items-center justify-center gap-2 text-white/85 hover:text-white text-sm font-bold border border-white/40 bg-transparent px-5 py-2 rounded-lg transition-all duration-200"
              >
                Solicitar Apoio <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-12 px-6 md:px-12 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl p-8 sm:p-10">
            <div className="space-y-6">
              <div className="space-y-4 max-w-3xl">
                <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] text-blue-600">
                  Sobre Nos
                </span>
                <h3 className="text-3xl md:text-4xl font-bold text-[#14213D] leading-tight">
                  Trabalhamos por uma educacao inclusiva e um futuro mais justo para todos.
                </h3>
              </div>
              <p className="text-slate-600 leading-relaxed text-base max-w-3xl">
                A ALEM e uma associacao dedicada a inclusao de pessoas com necessidades especiais em Mocambique, oferecendo apoio educacional, capacitacao de cuidadores e fortalecimento comunitario.
              </p>
              <Link
                to="/quem-somos"
                className="inline-flex items-center gap-2 text-brand-primary font-bold text-sm hover:gap-3 transition-all"
              >
                Conheca a nossa historia <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 px-6 md:px-12 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Missao',
              desc: 'Assegurar a inclusao e qualidade de ensino das pessoas com necessidades especiais, assim como garantir a sua insercao laboral no mercado de trabalho, atraves de acoes de protecao e intervencao social, e advocacia dos seus direitos.',
              icon: <Target className="text-blue-600" />,
              color: 'bg-white border border-slate-200'
            },
            {
              title: 'Visao',
              desc: 'Estabelecer uma plataforma funcional e de referencia nacional, especializada em servicos sociais de rastreio, inclusao escolar e laboral para as pessoas com necessidades especiais.',
              icon: <Award className="text-brand-primary" />,
              color: 'bg-white border border-slate-200'
            },
            {
              title: 'Valores',
              desc: 'Unidade, Respeito pelos Direitos Humanos, Compaixao, Comprometimento, Responsabilidade, Honestidade, Justica Social, Solidariedade, Transparencia, Equidade e Universalidade.',
              icon: <Users className="text-purple-600" />,
              color: 'bg-white border border-slate-200'
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className={`${item.color} p-10 rounded-[32px] space-y-6 shadow-lg transition-all duration-300`}
            >
              <div className="w-14 h-14 flex items-center justify-center">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold text-[#14213D]">{item.title}</h3>
              <p className="text-slate-600 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Social Projects Section */}
      <section className="section-lg bg-white">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="space-y-4 text-left">
            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] text-blue-600">Iniciativas</span>
            <h3 className="text-3xl md:text-4xl font-bold text-[#14213D]">
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
              <div className="col-span-full text-center text-slate-500 py-12">
                A carregar iniciativas recentes...
              </div>
            )}
          </div>

          <div className="text-center">
            <Link
              to="/projetos-sociais"
              className="btn-primary"
            >
              Ver Todos os Projetos <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* O Que Fazemos Section */}
      <section className="section-lg bg-slate-50">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="space-y-4 text-left max-w-3xl">
            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] text-blue-600">Programas</span>
            <h3 className="text-3xl md:text-4xl font-bold text-[#14213D]">
              O Que Fazemos
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Desenvolvemos programas integrados que abrangem a crianca, a escola, a familia e a sociedade.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Apoio Psicopedagogico',
                desc: 'Sessoes individuais e em grupo focadas no desenvolvimento de estrategias de aprendizagem para criancas com dislexia e TDAH.',
                icon: <GraduationCap size={28} />,
                color: 'bg-blue-600'
              },
              {
                title: 'Formacao de Professores',
                desc: 'Capacitacao de educadores para identificar sinais precoces e implementar metodologias inclusivas na sala de aula regular.',
                icon: <BookOpen size={28} />,
                color: 'bg-green-600'
              },
              {
                title: 'Aconselhamento Familiar',
                desc: 'Grupos de apoio e orientacao para pais e cuidadores, ajudando-os a compreender e apoiar melhor os seus filhos.',
                icon: <Users size={28} />,
                color: 'bg-orange-600'
              },
              {
                title: 'Rastreio e Diagnostico',
                desc: 'Parcerias com especialistas para facilitar o acesso a avaliacoes diagnosticas precisas e acessiveis.',
                icon: <ShieldCheck size={28} />,
                color: 'bg-purple-600'
              },
              {
                title: 'Advocacia e Direitos',
                desc: 'Trabalho junto de instituicoes governamentais para promover politicas publicas de educacao inclusiva em Mocambique.',
                icon: <Lightbulb size={28} />,
                color: 'bg-red-600'
              },
              {
                title: 'Atividades Ludicas',
                desc: 'Programas de ferias e oficinas criativas que estimulam a autoestima e as competencias sociais atraves da arte e do desporto.',
                icon: <Heart size={28} />,
                color: 'bg-pink-600'
              }
            ].map((prog, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="bg-white p-8 rounded-[32px] shadow-md border border-slate-100 hover:shadow-xl transition-all group"
              >
                <div className={`${prog.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  {prog.icon}
                </div>
                <h4 className="text-lg font-bold text-[#14213D] mb-3">{prog.title}</h4>
                <p className="text-slate-500 leading-relaxed text-sm">{prog.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/o-que-fazemos" className="btn-primary">
              Ver Todos os Programas <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Documentario Video Section */}
      <section className="py-32 px-6 md:px-12 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-12"
          >
            <div className="text-center space-y-4">
              <h3 className="text-4xl md:text-5xl font-bold text-[#14213D]">Documentario</h3>
              <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                Conheca a historia da Associacao ALEM e o impacto que estamos a gerar na vida das criancas e familias em Mocambique.
              </p>
            </div>

            <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl bg-black">
              <div className="relative pb-[56.25%] w-full">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/8qAz0MZgoA8"
                  title="Documentario ALEM"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Equipa Section */}
      {team.length > 0 && (
        <section className="py-24 px-6 md:px-12 lg:px-16 bg-slate-50">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-left space-y-4">
              <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] text-blue-600">A Nossa Equipa</span>
              <h3 className="text-4xl font-bold text-[#14213D]">Membros</h3>
              <p className="text-slate-500 text-base">Clique em saber mais para conhecer o membro.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {team.map((person, i) => (
                <motion.div
                  key={person.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="group cursor-pointer perspective-[1000px]"
                  onClick={() => setFlippedId(flippedId === person.id ? null : person.id)}
                >
                  <div className={`relative w-full aspect-[4/5] transition-transform duration-700 [transform-style:preserve-3d] ${flippedId === person.id ? '[transform:rotateY(180deg)]' : ''}`}>

                    {/* Front of card */}
                    <div className="absolute inset-0 [backface-visibility:hidden] overflow-hidden rounded-3xl shadow-lg group-hover:shadow-2xl transition-all duration-500">
                      <img
                        src={person.photo_data || person.photo_url || 'https://via.placeholder.com/300?text=Foto'}
                        alt={person.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent transition-all duration-500" />
                      <div className="absolute bottom-0 left-0 right-0 p-5 z-10 flex flex-col items-start">
                        <h4 className="text-xl font-bold text-white drop-shadow-lg mb-1">{person.name}</h4>
                        <p className="text-white/90 text-sm font-medium mb-3">{person.role}</p>
                        <button
                          onClick={(e) => { e.stopPropagation(); setFlippedId(person.id); }}
                          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-full transition-colors flex items-center gap-1 shadow-md"
                        >
                          Saber Mais <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Back of card */}
                    <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-blue-900 rounded-3xl shadow-2xl p-6 text-white overflow-hidden flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-full overflow-hidden mb-3 border-2 border-white/20 shrink-0">
                        <img
                          src={person.photo_data || person.photo_url || 'https://via.placeholder.com/300?text=Foto'}
                          alt={person.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className="text-lg font-bold mb-1 leading-tight">{person.name}</h4>
                      <p className="text-blue-300 text-[10px] font-bold uppercase tracking-widest mb-3 pb-3 border-b border-white/10 w-full leading-tight">{person.role}</p>
                      <div className="flex-grow w-full overflow-y-auto text-left text-xs text-slate-300 leading-relaxed whitespace-pre-wrap pr-1 custom-scrollbar">
                        {person.bio || 'Sem informacoes adicionais.'}
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); setFlippedId(null); }}
                        className="mt-3 w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1"
                      >
                        <X size={14} /> Voltar
                      </button>
                    </div>

                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
