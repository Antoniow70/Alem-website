import { motion } from 'motion/react';
import { BookOpen, Users, Lightbulb, Heart, ShieldCheck, GraduationCap } from 'lucide-react';

export default function OQueFazemos() {
  const programs = [
    {
      title: 'Apoio Psicopedagógico',
      desc: 'Sessões individuais e em grupo focadas no desenvolvimento de estratégias de aprendizagem para crianças com dislexia e TDAH.',
      icon: <GraduationCap size={32} />,
      color: 'bg-blue-600'
    },
    {
      title: 'Formação de Professores',
      desc: 'Capacitação de educadores para identificar sinais precoces e implementar metodologias inclusivas na sala de aula regular.',
      icon: <BookOpen size={32} />,
      color: 'bg-green-600'
    },
    {
      title: 'Aconselhamento Familiar',
      desc: 'Grupos de apoio e orientação para pais e cuidadores, ajudando-os a compreender e apoiar melhor os seus filhos.',
      icon: <Users size={32} />,
      color: 'bg-orange-600'
    },
    {
      title: 'Rastreio e Diagnóstico',
      desc: 'Parcerias com especialistas para facilitar o acesso a avaliações diagnósticas precisas e acessíveis.',
      icon: <ShieldCheck size={32} />,
      color: 'bg-purple-600'
    },
    {
      title: 'Advocacia e Direitos',
      desc: 'Trabalho junto de instituições governamentais para promover políticas públicas de educação inclusiva em Moçambique.',
      icon: <Lightbulb size={32} />,
      color: 'bg-red-600'
    },
    {
      title: 'Atividades Lúdicas',
      desc: 'Programas de férias e oficinas criativas que estimulam a autoestima e as competências sociais através da arte e do desporto.',
      icon: <Heart size={32} />,
      color: 'bg-pink-600'
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <section className="bg-green-600 text-white py-28 px-4">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h1 className="text-5xl font-bold">O Que Fazemos</h1>
            <p className="text-xl text-green-50 max-w-2xl mx-auto hleading-relaxed">
              Desenvolvemos programas integrados que abrangem a criança, a escola, a família e a sociedade.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((prog, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-10 rounded-[40px] shadow-xl border border-slate-100 hover:shadow-2xl transition-all group"
            >
              <div className={`${prog.color} w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg group-hover:scale-110 transition-transform`}>
                {prog.icon}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{prog.title}</h3>
              <p className="text-slate-600 leading-relaxed">
                {prog.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-24 px-4 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 border-4 border-white rounded-full" />
          <div className="absolute bottom-10 right-10 w-96 h-96 border-4 border-white rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-10">
          <div className="space-y-8">
            <h2 className="text-4xl font-bold leading-tight">
              O nosso impacto vai além dos números. É sobre vidas transformadas.
            </h2>
            <p className="text-slate-400 text-lg">
              Cada criança que aprende a ler apesar da dislexia, ou que consegue focar-se na aula com estratégias para TDAH, representa uma vitória para toda a comunidade.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-4xl font-bold text-green-500">85%</p>
                <p className="text-sm text-slate-500 uppercase font-bold tracking-widest mt-2">Melhoria Escolar</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-blue-500">92%</p>
                <p className="text-sm text-slate-500 uppercase font-bold tracking-widest mt-2">Satisfação Familiar</p>
              </div>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-md p-10 rounded-[40px] border border-white/10">
            <blockquote className="text-xl italic text-slate-300 leading-relaxed">
              "Antes da ALEM, o meu filho era visto como 'preguiçoso'. Hoje, ele entende que apenas aprende de forma diferente e a sua autoestima mudou completamente. Ele agora sonha em ser engenheiro."
            </blockquote>
            <div className="mt-8 flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-700 rounded-full" />
              <div>
                <p className="font-bold">Dra. Helena Matsinhe</p>
                <p className="text-sm text-slate-500">Mãe e Beneficiária</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
