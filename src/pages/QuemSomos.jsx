import { motion } from 'motion/react';
import { History, Target, Users, Award } from 'lucide-react';

export default function QuemSomos() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <section className="bg-blue-800 text-white py-28 px-4 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover opacity-60"
          style={{
            backgroundImage: "url('Inclusive Education_ Lesson Plans and Resources.jpg')",
          }}
        />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-800/30 skew-x-12 transform translate-x-1/4" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl font-bold mb-6">Quem Somos</h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Uma associação sem fins lucrativos comprometida com o futuro das crianças moçambicanas, focada na inclusão e no direito à educação de qualidade para todos.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-widest">
              <History size={18} /> A Nossa História
            </div>
            <h2 className="text-4xl font-bold text-slate-900 leading-tight">
              A Associação Laços Especiais de Moçambique (ALEM)
            </h2>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>
              É uma organização não governamental, que surgiu em uma iniciativa de estudantes da Universidade Zambeze em Julho de 2021, com a finalidade de responder aos principais desafios dos estudantes com necessidades especiais da Faculdade de Ciências Sociais e Humanidades (FCSH).
              </p>
              <p>
                Das dificuldades partilhadas pelos mesmos, os pontos comuns foram: falta de condições (financeiras, infraestruturas, humanas) para a educação inclusiva; falta de oportunidade no mercado laboral e ausência da sensibilização em relação aos direitos educacionais das pessoas com necessidades especiais. Em virtude das reflexões, surgiu a ideia da criação de sinergias para ajudar os indivíduos com qualquer tipo de “deficiência”. Para tal, optou-se por eleger a educação como veículo da mudança. 
              </p>
            </div>
          </div>
          <div className="relative">
            <img
              src="download.jpg"
              alt="Equipa ALEM"
              className="rounded-[40px] shadow-2xl"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-3xl shadow-xl border border-slate-100 hidden md:block">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white">
                  <Award size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">100%</p>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Compromisso Social</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission/Vision */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Missão',
              desc: 'Assegurar a inclusão e qualidade de ensino das pessoas com necessidades especiais, assim como garantir a sua inserção laboral no mercado de trabalho, através de ações de proteção e intervenção social, e advocacia dos seus direitos.',
              icon: <Target className="text-blue-600" />,
              color: 'bg-blue-50'
            },
            {
              title: 'Visão',
              desc: 'Estabelecer uma plataforma funcional e de referência nacional, especializada em serviços sociais de rastreio, inclusão escolar e laboral para as pessoas com necessidades especiais.',
              icon: <Award className="text-green-600" />,
              color: 'bg-green-50'
            },
            {
              title: 'Valores',
              desc: 'Unidade, Respeito pelos Direitos Humanos, Compaixão, Comprometimento, Responsabilidade, Honestidade, Justiça Social, Solidariedade, Transparência, Equidade e Universalidade.',
              icon: <Users className="text-purple-600" />,
              color: 'bg-purple-50'
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className={`${item.color} p-10 rounded-[32px] space-y-6`}
            >
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold text-slate-900">{item.title}</h3>
              <p className="text-slate-600 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-[0.2em]">A Nossa Equipa</h2>
            <h3 className="text-4xl font-bold text-slate-900">Pessoas que fazem acontecer</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: 'Dra. Ana Silva', role: 'Diretora Executiva', img: 'https://i.pravatar.cc/300?u=ana' },
              { name: 'Dr. João Mambo', role: 'Psicopedagogo', img: 'https://i.pravatar.cc/300?u=joao' },
              { name: 'Maria Santos', role: 'Coordenadora de Projetos', img: 'https://i.pravatar.cc/300?u=maria' },
              { name: 'Carlos Tembe', role: 'Relações Públicas', img: 'https://i.pravatar.cc/300?u=carlos' },
            ].map((person, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-3xl aspect-[4/5] shadow-lg group-hover:shadow-2xl transition-all duration-500">
                  {/* Full-bleed image */}
                  <img
                    src={person.img}
                    alt={person.name}
                    className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent group-hover:from-black/80 transition-all duration-500" />

                  {/* Text overlay at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 z-10 translate-y-1 group-hover:translate-y-0 transition-transform duration-500">
                    <h4 className="text-lg font-bold text-white drop-shadow-lg">{person.name}</h4>
                    <p className="text-white/70 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">{person.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
