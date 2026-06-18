import { motion } from 'motion/react';
import { BookOpen, Users, Lightbulb, Heart, ShieldCheck, GraduationCap } from 'lucide-react';

export default function OQueFazemos({ isSection = false }) {
  const programs = [
    {
      title: 'Apoio Psicopedagogico',
      desc: 'Sessoes individuais e em grupo focadas no desenvolvimento de estrategias de aprendizagem para criancas com dislexia e TDAH.',
      icon: <GraduationCap size={28} />,
      color: 'bg-blue-50 text-blue-600'
    },
    {
      title: 'Formacao de Professores',
      desc: 'Capacitacao de educadores para identificar sinais precoces e implementar metodologias inclusivas na sala de aula regular.',
      icon: <BookOpen size={28} />,
      color: 'bg-emerald-50 text-emerald-600'
    },
    {
      title: 'Aconselhamento Familiar',
      desc: 'Grupos de apoio e orientacao para pais e cuidadores, ajudando-os a compreender e apoiar melhor os seus filhos.',
      icon: <Users size={28} />,
      color: 'bg-amber-50 text-amber-600'
    },
    {
      title: 'Rastreio e Diagnostico',
      desc: 'Parcerias com especialistas para facilitar o acesso a avaliacoes diagnosticas precisas e acessiveis.',
      icon: <ShieldCheck size={28} />,
      color: 'bg-indigo-50 text-indigo-600'
    },
    {
      title: 'Advocacia e Direitos',
      desc: 'Trabalho junto de instituicoes governamentais para promover politicas publicas de educacao inclusiva em Mocambique.',
      icon: <Lightbulb size={28} />,
      color: 'bg-rose-50 text-rose-600'
    },
    {
      title: 'Atividades Ludicas',
      desc: 'Programas de ferias e oficinas criativas que estimulam a autoestima e as competencias sociais atraves da arte e do desporto.',
      icon: <Heart size={28} />,
      color: 'bg-sky-50 text-sky-600'
    }
  ];

  return (
    <div className={isSection ? "" : "bg-slate-50 min-h-screen"}>
      {!isSection && (
        /* Header */
        <section className="relative text-white pt-32 pb-16 px-6 overflow-hidden bg-slate-900">
          {/* Background Image and Overlays */}
          <div className="absolute inset-0 z-0">
            <img
              src="Imagem/O que fazemos.jpg"
              alt="O que fazemos"
              className="w-full h-full object-cover opacity-60"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/20" />
          </div>

          <div className="max-w-7xl mx-auto text-center space-y-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              <span className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                O Que Fazemos
              </span>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
                Nossos Programas
              </h1>
              <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Desenvolvemos programas integrados que abrangem a crianca, a escola, a familia e a sociedade.
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {/* Programs Grid */}
      <section className="py-20 px-6 md:px-12 lg:px-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto flex overflow-x-auto snap-x snap-mandatory gap-6 scroll-smooth scrollbar-none pb-6 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 md:pb-0">
          {programs.map((prog, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow transition-all group w-[85%] sm:w-[45%] md:w-full shrink-0 snap-center"
            >
              <div className={`${prog.color} w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform`}>
                {prog.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{prog.title}</h3>
              <p className="text-slate-500 leading-relaxed text-sm">
                {prog.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 px-6 md:px-12 lg:px-16 bg-slate-900 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center rounded-lg bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-400">
              O Nosso Impacto
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">
              O nosso impacto vai alem dos numeros. E sobre vidas transformadas.
            </h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              Cada crianca que aprende a ler apesar da dislexia, ou que consegue focar-se na aula com estrategias para TDAH, representa uma vitoria para toda a comunidade.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-4">
              <div>
                <p className="text-4xl font-black text-emerald-400">85%</p>
                <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider mt-1">Melhoria Escolar</p>
              </div>
              <div>
                <p className="text-4xl font-black text-blue-400">92%</p>
                <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider mt-1">Satisfacao Familiar</p>
              </div>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm p-8 md:p-10 rounded-2xl border border-white/10 shadow-lg">
            <blockquote className="text-base md:text-lg italic text-slate-300 leading-relaxed">
              "Antes da ALEM, o meu filho era visto como 'preguicoso'. Hoje, ele entende que apenas aprende de forma diferente e a sua autoestima mudou completamente. Ele agora sonha em ser engenheiro."
            </blockquote>
            <div className="mt-6 flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-850 rounded-full flex items-center justify-center border border-white/10 text-white font-bold text-xs uppercase">
                HM
              </div>
              <div>
                <p className="font-bold text-sm">Dra. Helena Matsinhe</p>
                <p className="text-xs text-slate-400">Mae e Beneficiaria</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Documentario Video Section */}
      <section className="py-20 px-6 md:px-12 lg:px-16 bg-slate-50 border-t border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-10"
          >
            <div className="text-center space-y-3">
              <span className="inline-flex items-center rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-600">Video</span>
              <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900">Documentario</h3>
              <p className="text-slate-500 text-sm md:text-base max-w-xl mx-auto">
                Conheca a historia da Associacao ALEM e o impacto que estamos a gerar na vida das criancas e familias em Mocambique.
              </p>
            </div>

            <div className="relative w-full rounded-2xl overflow-hidden shadow-lg bg-black border border-slate-200/20 max-w-4xl mx-auto">
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
    </div>
  );
}
