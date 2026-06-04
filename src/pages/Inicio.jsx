import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Heart, BookOpen, CheckCircle } from 'lucide-react';

export default function Inicio() {
  return (
    <div className="overflow-hidden">

      <section className="relative min-h-[90vh] flex items-center pt-16 px-4">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r " />
          <img
            src="IMG-20260323-WA0000.jpg"
            alt="Crianças em Moçambique"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-20 text-white">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <span className="inline-block px-4 py-1 bg-green-500 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
              Associação Laços Especiais Moçambique
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Construindo Laços de <span className="text-green-400">Inclusão</span> em Moçambique
            </h1>
            <p className="text-lg md:text-xl text-blue-50 mb-10 leading-relaxed opacity-90">
              Promovemos a inserção das pessoas com necessidades especias no acesso aos subsistemas  de ensino e apredizagem.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                to="/projetos-sociais"
                className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-500 text-slate-950 px-3 py-1 rounded-2xl font-bold flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-yellow-400/20 active:translate-y-0 active:scale-95 transition-all duration-300 shadow-lg"
              >
                Ver Projetos <ArrowRight size={20} />
              </Link>
              <Link
                to="/contactos"
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 backdrop-blur-sm px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:scale-95 transition-all duration-300"
              >
                Ser Voluntário <ArrowRight size={20} />
              </Link>
              <Link
                to="/contactos"
                className="text-white/90 hover:text-white border-b border-transparent hover:border-white px-4 py-2 font-bold flex items-center justify-center gap-1.5 transition-all duration-200"
              >
                Pedir Apoio <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sobre Nós Section */}
      <section className="py-32 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-12"
          >
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-sm font-bold text-blue-600 uppercase tracking-[0.2em]">Conhece-nos Melhor</h2>
              <h3 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                Sobre Nós
              </h3>
            </div>

            {/* Transparent Box Container */}
            <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-3xl p-12 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Missão */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <Users size={20} className="text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-slate-900">Missão</h4>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    Promover a inclusão e qualidade de ensino das pessoas com necessidades especiais, garantindo a sua inserção laboral no mercado de trabalho através de ações de proteção, intervenção social e advocacia dos seus direitos.
                  </p>
                </motion.div>

                {/* Visão */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <BookOpen size={20} className="text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-slate-900">Visão</h4>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    Uma Moçambique onde a educação é verdadeiramente inclusiva, e todas as pessoas com necessidades especiais têm oportunidades iguais de desenvolvimento pessoal, académico e profissional.
                  </p>
                </motion.div>

                {/* Valores */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Heart size={20} className="text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-slate-900">Valores</h4>
                  </div>
                  <ul className="space-y-2">
                    {['Inclusão', 'Dignidade', 'Justiça Social', 'Excelência'].map((value, i) => (
                      <li key={i} className="flex items-center gap-2 text-slate-700">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        {value}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </div>

            <div className="text-center pt-8">
              <Link
                to="/quem-somos"
                className="inline-flex items-center gap-2 text-blue-600 font-bold hover:gap-4 transition-all text-lg"
              >
                Conheça a nossa história completa <ArrowRight size={20} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Projects Section */}
      <section className="py-32 px-4 bg-white">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-[0.2em]">Iniciativas em Curso</h2>
            <h3 className="text-4xl font-bold text-slate-900">Projetos Sociais da Associação</h3>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
              Conheça as nossas principais frentes de atuação e como estamos a transformar a educação inclusiva em Moçambique.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Educação para Todos',
                desc: 'Apoio pedagógico especializado para crianças com dificuldades de aprendizagem em escolas públicas.',
                img: 'https://picsum.photos/seed/edu/800/600',
                status: 'Em Curso'
              },
              {
                title: 'Capacitação de Professores',
                desc: 'Formação contínua de educadores para identificação e suporte a alunos com neurodiversidade.',
                img: 'https://picsum.photos/seed/teacher/800/600',
                status: 'Em Curso'
              },
              {
                title: 'Inclusão Digital',
                desc: 'Uso de tecnologias assistivas para facilitar o processo de aprendizagem e comunicação.',
                img: 'https://picsum.photos/seed/digital/800/600',
                status: 'Planeamento'
              }
            ].map((project, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative rounded-[28px] overflow-hidden aspect-[4/5] shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
              >
                {/* Full-bleed image */}
                <img
                  src={project.img}
                  alt={project.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 transition-all duration-500" />

                {/* Status badge */}
                <div className="absolute top-5 left-5 z-10">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm shadow-lg ${project.status === 'Em Curso' ? 'bg-green-500/90 text-white' : 'bg-amber-500/90 text-white'
                    }`}>
                    {project.status}
                  </span>
                </div>

                {/* Text overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-7 z-10 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <h4 className="text-xl font-bold text-white mb-2 drop-shadow-lg">
                    {project.title}
                  </h4>
                  <p className="text-white/70 text-sm leading-relaxed mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    {project.desc}
                  </p>
                  <Link
                    to="/projetos-sociais"
                    className="inline-flex items-center gap-2 text-white text-sm font-bold group-hover:gap-3 transition-all"
                  >
                    Saber mais <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/projetos-sociais"
              className="inline-flex items-center gap-3 bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl"
            >
              Ver Todos os Projetos <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Quem Somos Section */}
      <section className="py-32 px-4 bg-yellow-400">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h3 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                Quem Somos
              </h3>
            </div>
            <p className="text-slate-800 text-lg leading-relaxed max-w-2xl mx-auto">
              {/* ESPAÇO PARA DESCRIÇÃO - Adicione aqui o texto sobre quem somos */}
              A Associação ALEM é uma organização sem fins lucrativos dedicada à promoção da educação inclusiva e ao apoio de pessoas com necessidades especiais em Moçambique. Nossa missão é transformar vidas através da educação de qualidade e da inclusão social.
            </p>
            <Link
              to="/quem-somos"
              className="inline-flex items-center gap-2 text-slate-900 font-bold hover:gap-4 transition-all text-lg"
            >
              Saiba Mais <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Documentário Vídeo Section */}
      <section className="py-32 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-12"
          >
            <div className="text-center space-y-4">
              <h3 className="text-4xl md:text-5xl font-bold text-slate-900">Documentário</h3>
              <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                Conheça a história da Associação ALEM e o impacto que estamos a gerar na vida das crianças e famílias em Moçambique.
              </p>
            </div>

            <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl bg-black">
              <div className="relative pb-[56.25%] w-full">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/8qAz0MZgoA8"
                  title="Documentário ALEM"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
