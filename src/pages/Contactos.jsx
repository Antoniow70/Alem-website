import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageSquare, Loader2, CheckCircle2, Heart, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '../lib/supabase';

const contactSchema = z.object({
  identifier: z.string().min(3, 'Nome ou Email deve ter pelo menos 3 caracteres'),
  phone: z.string().min(9, 'Contacto inválido'),
  subject: z.string().min(5, 'Assunto muito curto'),
  message: z.string().min(10, 'Mensagem muito curta'),
});

const volunteerSchema = z.object({
  fullName: z.string().min(3, 'Nome completo obrigatório'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(9, 'Telefone inválido'),
  projectId: z.string().min(1, 'Selecione um projeto social'),
  message: z.string().optional(),
});

export default function Contactos() {
  const [activeTab, setActiveTab] = useState('contact');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isConfigMissing, setIsConfigMissing] = useState(false);
  const [projects, setProjects] = useState([]);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(contactSchema)
  });

  const { register: regVol, handleSubmit: handleVol, formState: { errors: errVol }, reset: resetVol } = useForm({
    resolver: zodResolver(volunteerSchema)
  });

  useEffect(() => {
    checkConfig();
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  }

  async function checkConfig() {
    try {
      // Just a dummy call to check if supabase is configured
      await supabase.from('volunteers').select('id').limit(1);
      setIsConfigMissing(false);
    } catch (error) {
      if (error.message?.includes('Configuração do Supabase')) {
        setIsConfigMissing(true);
      }
    }
  }

  const onContactSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('messages').insert([{
        name: data.identifier,
        email: data.identifier.includes('@') ? data.identifier : '',
        phone: data.phone,
        subject: data.subject,
        message: data.message,
        status: 'Nova'
      }]);
      if (error) throw error;
      setSubmitted(true);
      reset();
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      if (error.message?.includes('Configuração do Supabase')) {
        setIsConfigMissing(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const onVolunteerSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('volunteers').insert([{
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        project_id: data.projectId,
        message: data.message
      }]);
      if (error) throw error;
      setSubmitted(true);
      resetVol();
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Error submitting volunteer form:', error);
      if (error.message?.includes('Configuração do Supabase')) {
        setIsConfigMissing(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Header */}
      <section className="bg-blue-600 text-white py-28 px-4">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <h1 className="text-5xl font-bold">Contactos</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Estamos aqui para ouvir. Seja para pedir apoio, tornar-se parceiro ou simplesmente dizer olá.
          </p>
        </div>
      </section>

      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Info Column */}
          <div className="space-y-12">
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-slate-900">Informação de Contacto</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Telefone</p>
                    <p className="text-slate-600">+258 84 000 0000</p>
                    <p className="text-slate-600">+258 87 000 0000</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Email</p>
                    <p className="text-slate-600">info@alem.mz</p>
                    <p className="text-slate-600">apoio@alem.mz</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Sede</p>
                    <p className="text-slate-600">Bairro de Macuti, Beira</p>
                    <p className="text-slate-600">Moçambique</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 text-white p-8 rounded-[32px] space-y-4">
              <h3 className="text-xl font-bold">Horário de Atendimento</h3>
              <div className="space-y-2 text-sm text-slate-400">
                <div className="flex justify-between">
                  <span>Segunda - Sexta</span>
                  <span>08:00 - 17:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Sábado</span>
                  <span>09:00 - 13:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Domingo</span>
                  <span className="text-red-400">Fechado</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden">
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab('contact')}
                  className={`flex-1 py-6 font-bold text-sm uppercase tracking-widest transition-all ${
                    activeTab === 'contact' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Enviar pedido de apoio
                </button>
                <button
                  onClick={() => setActiveTab('volunteer')}
                  className={`flex-1 py-6 font-bold text-sm uppercase tracking-widest transition-all ${
                    activeTab === 'volunteer' ? 'text-green-600 border-b-2 border-green-600' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Ser Voluntário
                </button>
              </div>

              <div className="p-10">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12 space-y-6"
                  >
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 size={48} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-slate-900">Mensagem Enviada!</h3>
                      <p className="text-slate-500">Obrigado pelo seu contacto. Responderemos o mais breve possível.</p>
                    </div>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="text-blue-600 font-bold hover:underline"
                    >
                      Enviar outra mensagem
                    </button>
                  </motion.div>
                ) : activeTab === 'contact' ? (
                  <form onSubmit={handleSubmit(onContactSubmit)} className="space-y-6">
                    {/* ... existing fields ... */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Nome ou Email</label>
                        <input
                          {...register('identifier')}
                          className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500"
                          placeholder="Seu nome ou endereço de email"
                        />
                        {errors.identifier && <p className="text-red-500 text-xs mt-1">{errors.identifier.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Contacto (Telefone)</label>
                        <input
                          {...register('phone')}
                          className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500"
                          placeholder="Ex: +258 84 000 0000"
                        />
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Assunto</label>
                      <input
                        {...register('subject')}
                        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500"
                        placeholder="Em que podemos ajudar?"
                      />
                      {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Mensagem</label>
                      <textarea
                        {...register('message')}
                        rows={5}
                        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500 resize-none"
                        placeholder="Escreva a sua mensagem aqui..."
                      />
                      {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                    </div>
                    <button
                      disabled={isSubmitting}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl disabled:opacity-50"
                    >
                      {isSubmitting ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                      Enviar pedido de apoio
                    </button>
                  </form>
                ) : (
                  <div className="space-y-8">
                    {isConfigMissing && (
                      <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl flex gap-4 items-start">
                        <AlertCircle className="text-amber-600 shrink-0" size={24} />
                        <div className="space-y-1">
                          <p className="text-amber-900 font-bold text-sm">Configuração Necessária</p>
                          <p className="text-amber-800 text-xs leading-relaxed">
                            O formulário de voluntariado requer a configuração do Supabase para guardar as candidaturas.
                          </p>
                        </div>
                      </div>
                    )}
                    <form onSubmit={handleVol(onVolunteerSubmit)} className={`space-y-6 ${isConfigMissing ? 'opacity-50 pointer-events-none' : ''}`}>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Nome Completo</label>
                      <input
                        {...regVol('fullName')}
                        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-green-500"
                        placeholder="Seu nome completo"
                      />
                      {errVol.fullName && <p className="text-red-500 text-xs mt-1">{errVol.fullName.message}</p>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email</label>
                        <input
                          {...regVol('email')}
                          className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-green-500"
                          placeholder="seu@email.com"
                        />
                        {errVol.email && <p className="text-red-500 text-xs mt-1">{errVol.email.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Telefone</label>
                        <input
                          {...regVol('phone')}
                          className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-green-500"
                          placeholder="+258..."
                        />
                        {errVol.phone && <p className="text-red-500 text-xs mt-1">{errVol.phone.message}</p>}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Projeto Social de Interesse</label>
                      <select
                        {...regVol('projectId')}
                        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-green-500 appearance-none"
                      >
                        <option value="">Selecionar Projeto...</option>
                        {projects.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                      {errVol.projectId && <p className="text-red-500 text-xs mt-1">{errVol.projectId.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Porquê quer ser voluntário? (Opcional)</label>
                      <textarea
                        {...regVol('message')}
                        rows={4}
                        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-green-500 resize-none"
                        placeholder="Conte-nos um pouco sobre si..."
                      />
                    </div>
                    <button
                      disabled={isSubmitting}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl disabled:opacity-50"
                    >
                      {isSubmitting ? <Loader2 className="animate-spin" /> : <Heart size={20} />}
                      Candidatar-me a Voluntário
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
