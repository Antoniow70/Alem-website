import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageSquare, Loader2, CheckCircle2, Heart, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getAllActivities } from '../domains/projetos';
import { submitMessage } from '../domains/suporte';
import { submitVolunteer } from '../domains/voluntarios';

const contactSchema = z.object({
  name: z.string().min(3, 'Nome completo obrigatorio'),
  email: z.string().email('Email invalido'),
  phone: z.string().min(9, 'Contacto invalido'),
  gender: z.string().min(1, 'Genero obrigatorio'),
  birthDate: z.string().min(1, 'Data de nascimento obrigatoria'),
  address: z.string().min(5, 'Endereco muito curto'),
  subject: z.string().min(3, 'Tipo de apoio/assunto obrigatorio'),
  message: z.string().min(10, 'Mensagem muito curta'),
});

const volunteerSchema = z.object({
  fullName: z.string().min(3, 'Nome completo obrigatorio'),
  email: z.string().email('Email invalido'),
  phone: z.string().min(9, 'Telefone invalido'),
  gender: z.string().min(1, 'Genero obrigatorio'),
  address: z.string().min(5, 'Endereco muito curto'),
  interestArea: z.string().min(3, 'Area de interesse obrigatoria'),
  activityId: z.string().min(1, 'Selecione uma atividade de interesse'),
  message: z.string().optional(),
});

export default function Contactos({ isSection = false }) {
  const [activeTab, setActiveTab] = useState('contact');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isConfigMissing, setIsConfigMissing] = useState(false);
  const [activities, setActivities] = useState([]);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(contactSchema)
  });

  const { register: regVol, handleSubmit: handleVol, formState: { errors: errVol }, reset: resetVol } = useForm({
    resolver: zodResolver(volunteerSchema)
  });

  useEffect(() => {
    fetchActivities();
  }, []);

  async function fetchActivities() {
    try {
      const data = await getAllActivities();
      setActivities(data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  }

  const onContactSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await submitMessage({
        name: data.name,
        email: data.email,
        phone: data.phone,
        genero: data.gender,
        data_nascimento: data.birthDate,
        endereco: data.address,
        tipo_necessidade: data.subject, // note: maps to tipo_necessidade in database
        subject: data.subject,
        message: data.message
      });
      setSubmitted(true);
      reset();
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      alert('Erro ao submeter pedido de apoio. Tenta novamente mais tarde.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onVolunteerSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await submitVolunteer({
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        genero: data.gender,
        endereco: data.address,
        area_interesse: data.interestArea,
        activity_id: data.activityId,
        message: data.message
      });
      setSubmitted(true);
      resetVol();
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Error submitting volunteer form:', error);
      alert('Erro ao submeter candidatura. Tenta novamente mais tarde.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={isSection ? "" : "bg-transparent min-h-screen pb-24"}>
      {!isSection && (
        /* Header */
        <section className="relative text-white pt-32 pb-16 px-6 overflow-hidden bg-brand-bigStone dark:text-dark-text">
          {/* Background Image and Overlays */}
          <div className="absolute inset-0 z-0">
            <img
              src="/images/contactos.jpg"
              alt="Contactos"
              className="w-full h-full object-cover opacity-60"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/20" />
          </div>

          <div className="max-w-7xl mx-auto text-center space-y-4 relative z-10">
            <span className="inline-flex items-center rounded-lg bg-brand-horizon px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
              Fale Connosco
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">Contactos</h1>
            <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Estamos aqui para ouvir. Seja para pedir apoio, tornar-se parceiro ou simplesmente dizer ola.
            </p>
          </div>
        </section>
      )}

      <section className="py-16 px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Info Column */}
          <div className="space-y-8">
            <div className="bg-white dark:bg-dark-surface p-8 rounded-2xl border border-brand-poloBlue/20 dark:border-dark-muted/10 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-brand-bigStone dark:text-dark-text">Informacoes</h2>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-brand-poloBlue/15 text-brand-eastBay dark:text-dark-text rounded-xl flex items-center justify-center shrink-0 border border-brand-poloBlue/20 dark:border-dark-muted/10">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-brand-eastBay/50 dark:text-dark-muted uppercase tracking-wider">Telefone</p>
                    <p className="text-brand-eastBay dark:text-dark-text font-medium text-sm mt-0.5">+258 84 000 0000</p>
                    <p className="text-brand-eastBay dark:text-dark-text font-medium text-sm">+258 87 000 0000</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-brand-poloBlue/15 text-brand-eastBay dark:text-dark-text rounded-xl flex items-center justify-center shrink-0 border border-brand-poloBlue/20 dark:border-dark-muted/10">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-brand-eastBay/50 dark:text-dark-muted uppercase tracking-wider">Email</p>
                    <p className="text-brand-eastBay dark:text-dark-text font-medium text-sm mt-0.5">info@alem.mz</p>
                    <p className="text-brand-eastBay dark:text-dark-text font-medium text-sm">apoio@alem.mz</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-brand-poloBlue/15 text-brand-eastBay dark:text-dark-text rounded-xl flex items-center justify-center shrink-0 border border-brand-poloBlue/20 dark:border-dark-muted/10">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-brand-eastBay/50 dark:text-dark-muted uppercase tracking-wider">Sede</p>
                    <p className="text-brand-eastBay dark:text-dark-text font-medium text-sm mt-0.5">Bairro de Macuti, Beira</p>
                    <p className="text-brand-eastBay/70 dark:text-dark-muted text-xs mt-0.5">Mocambique</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-brand-bigStone dark:bg-dark-surface text-white p-8 rounded-2xl space-y-4">
              <h3 className="text-base font-bold tracking-tight">Horario de Atendimento</h3>
              <div className="space-y-2 text-xs text-slate-300 dark:text-dark-muted">
                <div className="flex justify-between border-b border-brand-eastBay dark:border-dark-muted/10 pb-2">
                  <span>Segunda - Sexta</span>
                  <span className="font-semibold text-white dark:text-dark-text">08:00 - 17:00</span>
                </div>
                <div className="flex justify-between border-b border-brand-eastBay dark:border-dark-muted/10 pb-2">
                  <span>Sabado</span>
                  <span className="font-semibold text-white dark:text-dark-text">09:00 - 13:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Domingo</span>
                  <span className="text-feedback-error font-semibold">Fechado</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-sm border border-brand-poloBlue/20 dark:border-dark-muted/10 overflow-hidden">
              <div className="flex border-b border-brand-poloBlue/20 dark:border-dark-muted/10 bg-brand-poloBlue/10 dark:bg-dark-bg/40 p-2 gap-2">
                <button
                  onClick={() => setActiveTab('contact')}
                  className={`flex-1 py-3 px-4 rounded-lg font-bold text-xs uppercase tracking-wider transition-all ${
                    activeTab === 'contact'
                      ? 'bg-white dark:bg-dark-surface text-brand-horizon dark:text-brand-poloBlue shadow-sm border border-brand-poloBlue/15 dark:border-dark-muted/20'
                      : 'text-brand-eastBay/50 hover:text-brand-eastBay dark:text-dark-muted dark:hover:text-dark-text'
                  }`}
                >
                  Solicitar Apoio
                </button>
                <button
                  onClick={() => setActiveTab('volunteer')}
                  className={`flex-1 py-3 px-4 rounded-lg font-bold text-xs uppercase tracking-wider transition-all ${
                    activeTab === 'volunteer'
                      ? 'bg-white dark:bg-dark-surface text-feedback-success shadow-sm border border-brand-poloBlue/15 dark:border-dark-muted/20'
                      : 'text-brand-eastBay/50 hover:text-brand-eastBay dark:text-dark-muted dark:hover:text-dark-text'
                  }`}
                >
                  Tornar-me Voluntario
                </button>
              </div>

              <div className="p-8 md:p-10">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12 space-y-6"
                  >
                    <div className="w-16 h-16 bg-feedback-successLight text-feedback-success rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 size={36} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold text-brand-bigStone dark:text-dark-text">Mensagem Enviada!</h3>
                      <p className="text-brand-eastBay dark:text-dark-muted text-sm">Obrigado pelo seu contacto. Responderemos o mais breve possivel.</p>
                    </div>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="text-brand-horizon text-sm font-bold hover:underline"
                    >
                      Enviar outra mensagem
                    </button>
                  </motion.div>
                ) : activeTab === 'contact' ? (
                  <div className="space-y-6">
                    {isConfigMissing && (
                      <div className="bg-feedback-warningLight border border-feedback-warningBorder p-5 rounded-xl flex gap-3 items-start">
                        <AlertCircle className="text-feedback-warning shrink-0 mt-0.5" size={20} />
                        <div className="space-y-0.5">
                          <p className="text-feedback-warningMuted font-bold text-sm">Configuracao Necessaria</p>
                          <p className="text-feedback-warningText text-xs leading-relaxed">
                            O formulario de apoio requer a configuracao do Supabase para guardar os pedidos.
                          </p>
                        </div>
                      </div>
                    )}
                    <form onSubmit={handleSubmit(onContactSubmit)} className={`space-y-4 ${isConfigMissing ? 'opacity-50 pointer-events-none' : ''}`}>
                      <div className="space-y-1">
                        <label className="form-label">Nome Completo *</label>
                        <input
                          {...register('name')}
                          className="form-input"
                          placeholder="Seu nome completo"
                        />
                        {errors.name && <p className="text-feedback-error text-[11px] mt-1">{errors.name.message}</p>}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="form-label">Email *</label>
                          <input
                            {...register('email')}
                            type="email"
                            className="form-input"
                            placeholder="seu@email.com"
                          />
                          {errors.email && <p className="text-feedback-error text-[11px] mt-1">{errors.email.message}</p>}
                        </div>
                        <div className="space-y-1">
                          <label className="form-label">Contacto (Telefone) *</label>
                          <input
                            {...register('phone')}
                            className="form-input"
                            placeholder="Ex: +258 84 000 0000"
                          />
                          {errors.phone && <p className="text-feedback-error text-[11px] mt-1">{errors.phone.message}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="form-label">Genero *</label>
                          <div className="relative">
                            <select
                              {...register('gender')}
                              className="form-input appearance-none cursor-pointer pr-10"
                            >
                              <option value="">Selecionar...</option>
                              <option value="Masculino">Masculino</option>
                              <option value="Feminino">Feminino</option>
                              <option value="Outro">Outro</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                            </div>
                          </div>
                          {errors.gender && <p className="text-feedback-error text-[11px] mt-1">{errors.gender.message}</p>}
                        </div>
                        <div className="space-y-1">
                          <label className="form-label">Data de Nascimento *</label>
                          <input
                            type="date"
                            {...register('birthDate')}
                            className="form-input"
                          />
                          {errors.birthDate && <p className="text-feedback-error text-[11px] mt-1">{errors.birthDate.message}</p>}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="form-label">Endereco Completo *</label>
                        <input
                          {...register('address')}
                          className="form-input"
                          placeholder="Bairro, Rua, Numero..."
                        />
                        {errors.address && <p className="text-feedback-error text-[11px] mt-1">{errors.address.message}</p>}
                      </div>

                      <div className="space-y-1">
                        <label className="form-label">Tipo de Necessidade / Apoio *</label>
                        <input
                          {...register('subject')}
                          className="form-input"
                          placeholder="Ex: Apoio Alimentar, Material Escolar, Saude..."
                        />
                        {errors.subject && <p className="text-feedback-error text-[11px] mt-1">{errors.subject.message}</p>}
                      </div>

                      <div className="space-y-1">
                        <label className="form-label">Descricao do Pedido *</label>
                        <textarea
                          {...register('message')}
                          rows={4}
                          className="form-input resize-none h-24"
                          placeholder="Descreva detalhadamente a sua situacao e o apoio de que necessita..."
                        />
                        {errors.message && <p className="text-feedback-error text-[11px] mt-1">{errors.message.message}</p>}
                      </div>

                      <button
                        disabled={isSubmitting}
                        className="btn-primary w-full text-sm py-3 mt-4 disabled:opacity-50"
                      >
                        {isSubmitting ? <Loader2 className="animate-spin" /> : <Send size={16} />}
                        Enviar Pedido de Apoio
                      </button>
                    </form>
                  </div>

                ) : (
                  <div className="space-y-6">
                    {isConfigMissing && (
                      <div className="bg-feedback-warningLight border border-feedback-warningBorder p-5 rounded-xl flex gap-3 items-start">
                        <AlertCircle className="text-feedback-warning shrink-0 mt-0.5" size={20} />
                        <div className="space-y-0.5">
                          <p className="text-feedback-warningMuted font-bold text-sm">Configuracao Necessaria</p>
                          <p className="text-feedback-warningText text-xs leading-relaxed">
                            O formulario de voluntariado requer a configuracao do Supabase para guardar as candidaturas.
                          </p>
                        </div>
                      </div>
                    )}
                    <form onSubmit={handleVol(onVolunteerSubmit)} className={`space-y-4 ${isConfigMissing ? 'opacity-50 pointer-events-none' : ''}`}>
                      <div className="space-y-1">
                        <label className="form-label">Nome Completo *</label>
                        <input
                          {...regVol('fullName')}
                          className="form-input"
                          placeholder="Seu nome completo"
                        />
                        {errVol.fullName && <p className="text-feedback-error text-[11px] mt-1">{errVol.fullName.message}</p>}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="form-label">Email *</label>
                          <input
                            {...regVol('email')}
                            className="form-input"
                            placeholder="seu@email.com"
                          />
                          {errVol.email && <p className="text-feedback-error text-[11px] mt-1">{errVol.email.message}</p>}
                        </div>
                        <div className="space-y-1">
                          <label className="form-label">Telefone *</label>
                          <input
                            {...regVol('phone')}
                            className="form-input"
                            placeholder="+258..."
                          />
                          {errVol.phone && <p className="text-feedback-error text-[11px] mt-1">{errVol.phone.message}</p>}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="form-label">Genero *</label>
                        <div className="relative">
                          <select
                            {...regVol('gender')}
                            className="form-input appearance-none cursor-pointer pr-10"
                          >
                            <option value="">Selecionar...</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Feminino">Feminino</option>
                            <option value="Outro">Outro</option>
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                          </div>
                        </div>
                        {errVol.gender && <p className="text-feedback-error text-[11px] mt-1">{errVol.gender.message}</p>}
                      </div>

                      <div className="space-y-1">
                        <label className="form-label">Endereco Completo *</label>
                        <input
                          {...regVol('address')}
                          className="form-input"
                          placeholder="Sua morada completa..."
                        />
                        {errVol.address && <p className="text-feedback-error text-[11px] mt-1">{errVol.address.message}</p>}
                      </div>

                      <div className="space-y-1">
                        <label className="form-label">Area de Interesse *</label>
                        <input
                          {...regVol('interestArea')}
                          className="form-input"
                          placeholder="Ex: Educacao, Saude, Apoio Social..."
                        />
                        {errVol.interestArea && <p className="text-feedback-error text-[11px] mt-1">{errVol.interestArea.message}</p>}
                      </div>
                      <div className="space-y-1">
                        <label className="form-label">Atividade de Interesse *</label>
                        <div className="relative">
                          <select
                            {...regVol('activityId')}
                            className="form-input appearance-none cursor-pointer pr-10"
                          >
                            <option value="">Selecionar Atividade...</option>
                            {activities.map(act => (
                              <option key={act.id} value={act.id}>{act.name}</option>
                            ))}
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                          </div>
                        </div>
                        {errVol.activityId && <p className="text-feedback-error text-[11px] mt-1">{errVol.activityId.message}</p>}
                      </div>
                      <div className="space-y-1">
                        <label className="form-label">Porque quer ser voluntario? (Opcional)</label>
                        <textarea
                          {...regVol('message')}
                          rows={4}
                          className="form-input resize-none h-24"
                          placeholder="Conte-nos um pouco sobre si..."
                        />
                      </div>
                      <button
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-feedback-success hover:bg-feedback-success/80 text-white px-5 py-3 text-[14px] font-semibold shadow-sm hover:shadow transition-all duration-200 w-full mt-4 disabled:opacity-50"
                      >
                        {isSubmitting ? <Loader2 className="animate-spin" /> : <Heart size={16} />}
                        Candidatar-me a Voluntario
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
