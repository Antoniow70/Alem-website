import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  LogOut, 
  LayoutDashboard, 
  FolderKanban, 
  Users, 
  Loader2, 
  Image as ImageIcon, 
  Video, 
  Save, 
  X,
  Upload,
  Mail,
  Eye,
  CheckCircle,
  Download
} from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const projectSchema = z.object({
  name: z.string().min(3, 'Nome obrigatório'),
  description: z.string().min(10, 'Descrição obrigatória'),
  status: z.enum(['Planeamento', 'Em Curso', 'Concluído']),
  media_type: z.enum(['image', 'video']),
  media_url: z.string().optional(),
  media_desc: z.string().optional(),
  gallery: z.array(z.object({
    type: z.enum(['image', 'video']),
    url: z.string().min(1, 'URL obrigatório'),
    description: z.string().optional(),
  })).optional(),
});

const volunteerSchema = z.object({
  full_name: z.string().min(3, 'Nome obrigatório'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(9, 'Telefone inválido'),
  message: z.string().optional(),
  status: z.enum(['Pendente', 'Aprovado', 'Recusado']),
  project_id: z.string().min(1, 'Projeto obrigatório'),
});

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [projects, setProjects] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVolunteerModalOpen, setIsVolunteerModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [editingVolunteer, setEditingVolunteer] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('projects');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [isGalleryUploading, setIsGalleryUploading] = useState(false);

  const projectForm = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      gallery: []
    }
  });

  const { fields: galleryFields, append: appendGallery, remove: removeGallery } = useFieldArray({
    control: projectForm.control,
    name: 'gallery'
  });

  const volunteerForm = useForm({
    resolver: zodResolver(volunteerSchema),
    defaultValues: {
      status: 'Pendente'
    }
  });

  const mediaType = projectForm.watch('media_type');

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  async function fetchData() {
    try {
      setLoading(true);
      const { data: projData, error: projError } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      const { data: volData, error: volError } = await supabase.from('volunteers').select('*').order('created_at', { ascending: false });
      const { data: msgData, error: msgError } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
      
      if (projError) throw projError;
      if (volError) throw volError;
      if (msgError) throw msgError;
      
      setProjects(projData || []);
      setVolunteers(volData || []);
      setMessages(msgData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'admin@alem.mz' && password === 'admin123') {
      setIsLoggedIn(true);
    } else {
      alert('Credenciais inválidas');
    }
  };

  const onProjectSubmit = async (data) => {
    try {
      let finalMediaUrl = data.media_url;

      if (selectedFile) {
        setIsUploading(true);
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `projects/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('project-media')
          .upload(filePath, selectedFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('project-media')
          .getPublicUrl(filePath);
        
        finalMediaUrl = urlData.publicUrl;
      }

      if (!finalMediaUrl) {
        alert('Por favor, carregue um ficheiro ou forneça um link.');
        return;
      }

      const payload = { 
        ...data, 
        media_url: finalMediaUrl,
        gallery: data.gallery || []
      };

      if (editingProject) {
        const { error } = await supabase
          .from('projects')
          .update(payload)
          .eq('id', editingProject.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('projects')
          .insert([payload]);
        if (error) throw error;
      }
      setIsModalOpen(false);
      setEditingProject(null);
      setSelectedFile(null);
      setUploadPreview(null);
      projectForm.reset();
      fetchData();
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Erro ao guardar projeto. Verifique a consola para detalhes.');
    } finally {
      setIsUploading(false);
    }
  };

  const onVolunteerSubmit = async (data) => {
    try {
      if (editingVolunteer) {
        const { error } = await supabase
          .from('volunteers')
          .update(data)
          .eq('id', editingVolunteer.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('volunteers')
          .insert([data]);
        if (error) throw error;
      }
      setIsVolunteerModalOpen(false);
      setEditingVolunteer(null);
      volunteerForm.reset();
      fetchData();
    } catch (error) {
      console.error('Error saving volunteer:', error);
    }
  };

  const deleteProject = async (id) => {
    if (confirm('Tem a certeza que deseja eliminar este projeto?')) {
      await supabase.from('projects').delete().eq('id', id);
      fetchData();
    }
  };

  const deleteVolunteer = async (id) => {
    if (confirm('Tem a certeza que deseja remover este voluntário?')) {
      await supabase.from('volunteers').delete().eq('id', id);
      fetchData();
    }
  };

  const updateMessageStatus = async (id, status) => {
    try {
      const { error } = await supabase.from('messages').update({ status }).eq('id', id);
      if (error) throw error;
      fetchData();
      if (isMessageModalOpen) {
        setIsMessageModalOpen(false);
      }
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  };

  const deleteMessage = async (id) => {
    if (confirm('Tem a certeza que deseja eliminar esta mensagem?')) {
      try {
        const { error } = await supabase.from('messages').delete().eq('id', id);
        if (error) throw error;
        fetchData();
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    }
  };

  const openMessage = (msg) => {
    setSelectedMessage(msg);
    setIsMessageModalOpen(true);
    if (msg.status === 'Nova') {
      updateMessageStatus(msg.id, 'Lida');
    }
  };

  const updateProjectStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: newStatus })
        .eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Error updating project status:', error);
    }
  };

  const updateVolunteerStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('volunteers')
        .update({ status: newStatus })
        .eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Error updating volunteer status:', error);
    }
  };

  const openEdit = (project) => {
    setEditingProject(project);
    projectForm.setValue('name', project.name);
    projectForm.setValue('description', project.description);
    projectForm.setValue('status', project.status);
    projectForm.setValue('media_type', project.media_type);
    projectForm.setValue('media_url', project.media_url);
    projectForm.setValue('media_desc', project.media_desc || '');
    projectForm.setValue('gallery', project.gallery || []);
    setUploadPreview(project.media_url);
    setIsModalOpen(true);
  };

  const handleGalleryFiles = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsGalleryUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `projects/gallery/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('project-media')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('project-media')
          .getPublicUrl(filePath);
        
        // UX Improvement: if main media is not set, set the first uploaded file as main
        if (!projectForm.getValues('media_url') && !selectedFile) {
          projectForm.setValue('media_url', urlData.publicUrl);
          projectForm.setValue('media_type', file.type.startsWith('video/') ? 'video' : 'image');
          setUploadPreview(urlData.publicUrl);
        }
        
        appendGallery({
          type: file.type.startsWith('video/') ? 'video' : 'image',
          url: urlData.publicUrl,
          description: file.name
        });
      }
    } catch (error) {
      console.error('Error uploading gallery files:', error);
      alert('Erro ao carregar ficheiros da galeria.');
    } finally {
      setIsGalleryUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const openVolunteerEdit = (volunteer) => {
    setEditingVolunteer(volunteer);
    volunteerForm.setValue('full_name', volunteer.full_name);
    volunteerForm.setValue('email', volunteer.email);
    volunteerForm.setValue('phone', volunteer.phone);
    volunteerForm.setValue('message', volunteer.message || '');
    volunteerForm.setValue('status', volunteer.status);
    volunteerForm.setValue('project_id', volunteer.project_id || '');
    setIsVolunteerModalOpen(true);
  };

  const exportVolunteersPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Nome", "Email", "Telefone", "Projeto", "Estado", "Data"];
    const tableRows = [];

    const pendingVolunteers = volunteers.filter(v => v.status === 'Pendente');

    pendingVolunteers.forEach(vol => {
      const project = projects.find(p => p.id === vol.project_id)?.name || 'Nenhum';
      const volunteerData = [
        vol.full_name,
        vol.email,
        vol.phone,
        project,
        vol.status,
        new Date(vol.created_at).toLocaleDateString('pt-PT')
      ];
      tableRows.push(volunteerData);
    });

    doc.setFontSize(18);
    doc.text("Relatorio de Voluntarios Pendentes - ALEM", 14, 15);
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-PT')}`, 14, 22);
    
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 28,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [37, 99, 235] }
    });
    
    doc.save(`voluntarios_pendentes_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const exportSupportPDF = (isCompleted) => {
    const doc = new jsPDF();
    const tableColumn = ["Remetente", "Assunto", "Contacto", "Data", "Estado"];
    const tableRows = [];

    const filteredMessages = isCompleted 
      ? messages.filter(m => m.status === 'Arquivada')
      : messages.filter(m => m.status === 'Nova');

    filteredMessages.forEach(msg => {
      const messageData = [
        msg.name,
        msg.subject,
        msg.phone || 'N/A',
        new Date(msg.created_at).toLocaleDateString('pt-PT'),
        msg.status
      ];
      tableRows.push(messageData);
    });

    const title = isCompleted ? "Relatorio de Apoios Concedidos - ALEM" : "Relatorio de Novos Pedidos de Apoio - ALEM";
    
    doc.setFontSize(18);
    doc.text(title, 14, 15);
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-PT')}`, 14, 22);
    
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 28,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [37, 99, 235] }
    });
    
    doc.save(`${isCompleted ? 'apoios_concedidos' : 'novos_pedidos_apoio'}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-10 rounded-[40px] shadow-2xl w-full max-w-md space-y-8"
        >
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4">
              <LayoutDashboard size={32} />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Admin ALEM</h1>
            <p className="text-slate-500">Acesso restrito à equipa de gestão</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500"
                placeholder="admin@alem.mz"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Palavra-passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                required
              />
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-bold shadow-xl transition-all">
              Entrar no Painel
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white hidden lg:flex flex-col p-6 fixed h-full">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <LayoutDashboard size={20} />
          </div>
          <span className="font-bold text-xl">ALEM Admin</span>
        </div>

        <nav className="flex-grow space-y-2">
          <button
            onClick={() => setActiveTab('projects')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'projects' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FolderKanban size={18} /> Projetos
          </button>
          <button
            onClick={() => setActiveTab('volunteers')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'volunteers' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users size={18} /> Voluntários
          </button>
          <button
            onClick={() => setActiveTab('support')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'support' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Mail size={18} /> Pedidos de Apoio
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'completed' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <CheckCircle size={18} /> Apoios Concedidos
          </button>
        </nav>

        <button
          onClick={() => setIsLoggedIn(false)}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-400/10 transition-all mt-auto"
        >
          <LogOut size={18} /> Sair
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow lg:ml-64 p-8">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {activeTab === 'projects' ? 'Gestão de Projetos' : 
               activeTab === 'volunteers' ? 'Gestão de Voluntários' : 
               activeTab === 'support' ? 'Pedidos de Apoio' : 'Apoios Concedidos'}
            </h1>
            <p className="text-slate-500">
              {activeTab === 'projects' 
                ? `${projects.length} projetos registados` 
                : activeTab === 'volunteers'
                ? `${volunteers.filter(v => v.status === 'Pendente').length} pendentes, ${volunteers.filter(v => v.status === 'Aprovado').length} aprovados`
                : activeTab === 'support'
                ? `${messages.filter(m => m.status === 'Nova').length} novos pedidos`
                : `${messages.filter(m => m.status === 'Arquivada').length} apoios finalizados`
              }
            </p>
          </div>
          <div className="flex gap-3">
            {(activeTab === 'volunteers' || activeTab === 'support' || activeTab === 'completed') && (
              <button
                onClick={() => {
                  if (activeTab === 'volunteers') exportVolunteersPDF();
                  else if (activeTab === 'support') exportSupportPDF(false);
                  else if (activeTab === 'completed') exportSupportPDF(true);
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all"
              >
                <Download size={20} /> Exportar PDF
              </button>
            )}
            {activeTab !== 'support' && activeTab !== 'completed' && (
              <button
                onClick={() => { 
                  if (activeTab === 'projects') {
                    setEditingProject(null); 
                    projectForm.reset(); 
                    setIsModalOpen(true); 
                  } else {
                    setEditingVolunteer(null);
                    volunteerForm.reset();
                    setIsVolunteerModalOpen(true);
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg transition-all"
              >
                <Plus size={20} /> {activeTab === 'projects' ? 'Novo Projeto' : 'Novo Voluntário'}
              </button>
            )}
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center py-32">
            <Loader2 className="animate-spin text-blue-600" size={48} />
          </div>
        ) : activeTab === 'projects' ? (
          <div className="grid grid-cols-1 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-6 group">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                  <img
                    src={project.media_type === 'image' ? project.media_url : `https://img.youtube.com/vi/${project.media_url.split('v=')[1]}/default.jpg`}
                    alt=""
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-lg text-slate-900">{project.name}</h3>
                    <select
                      value={project.status}
                      onChange={(e) => updateProjectStatus(project.id, e.target.value)}
                      className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-md border-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all ${
                        project.status === 'Planeamento' ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' :
                        project.status === 'Em Curso' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' :
                        'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      <option value="Planeamento">Planeamento</option>
                      <option value="Em Curso">Em Curso</option>
                      <option value="Concluído">Concluído</option>
                    </select>
                  </div>
                  <p className="text-slate-500 text-sm line-clamp-1">{project.description}</p>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(project)}
                    className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : activeTab === 'volunteers' ? (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            {/* ... volunteers table code ... */}
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Nome</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Email</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Telefone</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Projeto</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Estado</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {volunteers.map((vol) => (
                  <tr key={vol.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 font-bold text-slate-900">{vol.full_name}</td>
                    <td className="px-6 py-4 text-slate-600">{vol.email}</td>
                    <td className="px-6 py-4 text-slate-600">{vol.phone}</td>
                    <td className="px-6 py-4 text-slate-600">
                      {projects.find(p => p.id === vol.project_id)?.name || 'Nenhum'}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={vol.status}
                        onChange={(e) => updateVolunteerStatus(vol.id, e.target.value)}
                        className={`px-2 py-1 text-[10px] font-bold uppercase rounded-md border-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all ${
                          vol.status === 'Pendente' ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' :
                          vol.status === 'Aprovado' ? 'bg-green-100 text-green-700 hover:bg-green-200' :
                          'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        <option value="Pendente">Pendente</option>
                        <option value="Aprovado">Aprovado</option>
                        <option value="Recusado">Recusado</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openVolunteerEdit(vol)}
                          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => deleteVolunteer(vol.id)}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : activeTab === 'support' ? (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Remetente</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Assunto</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Data</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Estado</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {messages.filter(m => m.status !== 'Arquivada').map((msg) => (
                  <tr key={msg.id} className={`hover:bg-slate-50 transition-colors group ${msg.status === 'Nova' ? 'bg-blue-50/30' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{msg.name}</div>
                      {msg.phone && <div className="text-[10px] text-slate-400 font-bold">{msg.phone}</div>}
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{msg.subject}</td>
                    <td className="px-6 py-4 text-slate-500 text-sm">
                      {new Date(msg.created_at).toLocaleDateString('pt-PT')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-md ${
                        msg.status === 'Nova' ? 'bg-blue-100 text-blue-700' :
                        msg.status === 'Lida' ? 'bg-slate-100 text-slate-600' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {msg.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openMessage(msg)}
                          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                          title="Ver Pedido"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => updateMessageStatus(msg.id, 'Arquivada')}
                          className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all"
                          title="Concluir Apoio"
                        >
                          <CheckCircle size={16} />
                        </button>
                        <button
                          onClick={() => deleteMessage(msg.id)}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Remetente</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Assunto</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Data de Conclusão</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {messages.filter(m => m.status === 'Arquivada').map((msg) => (
                  <tr key={msg.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{msg.name}</div>
                      {msg.phone && <div className="text-[10px] text-slate-400 font-bold">{msg.phone}</div>}
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{msg.subject}</td>
                    <td className="px-6 py-4 text-slate-500 text-sm">
                      {new Date(msg.created_at).toLocaleDateString('pt-PT')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openMessage(msg)}
                          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                          title="Ver Detalhes"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => deleteMessage(msg.id)}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Project Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900">
                  {editingProject ? 'Editar Projeto' : 'Novo Projeto'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={projectForm.handleSubmit(onProjectSubmit)} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Nome do Projeto</label>
                  <input
                    {...projectForm.register('name')}
                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Sala de Aula Inclusiva"
                  />
                  {projectForm.formState.errors.name && <p className="text-red-500 text-xs">{projectForm.formState.errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Descrição</label>
                  <textarea
                    {...projectForm.register('description')}
                    rows={4}
                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Detalhes sobre o projeto..."
                  />
                  {projectForm.formState.errors.description && <p className="text-red-500 text-xs">{projectForm.formState.errors.description.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Estado</label>
                    <select
                      {...projectForm.register('status')}
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500 appearance-none"
                    >
                      <option value="Planeamento">Planeamento</option>
                      <option value="Em Curso">Em Curso</option>
                      <option value="Concluído">Concluído</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tipo de Média</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => projectForm.setValue('media_type', 'image')}
                        className={`flex-1 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                          mediaType === 'image' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        <ImageIcon size={18} /> Imagem
                      </button>
                      <button
                        type="button"
                        onClick={() => projectForm.setValue('media_type', 'video')}
                        className={`flex-1 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                          mediaType === 'video' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        <Video size={18} /> Vídeo
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    {mediaType === 'image' ? 'Carregar Imagem ou Link' : 'Carregar Vídeo ou Link'}
                  </label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative group">
                      <input
                        type="file"
                        accept={mediaType === 'image' ? "image/*" : "video/*"}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setSelectedFile(file);
                            setUploadPreview(URL.createObjectURL(file));
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 group-hover:border-blue-400 transition-all">
                        <Upload className="text-slate-400 group-hover:text-blue-500" size={24} />
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                          {selectedFile ? selectedFile.name : 'Escolher Ficheiro'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <input
                        {...projectForm.register('media_url')}
                        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500"
                        placeholder="Ou cole o link aqui..."
                        onChange={(e) => {
                          if (e.target.value) {
                            setSelectedFile(null);
                            setUploadPreview(e.target.value);
                          }
                        }}
                      />
                    </div>
                  </div>

                  {uploadPreview && (
                    <div className="mt-4 rounded-2xl overflow-hidden border border-slate-100 aspect-video bg-slate-50 relative">
                      {mediaType === 'image' ? (
                        <img src={uploadPreview} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white">
                          <Video size={48} />
                        </div>
                      )}
                      <button 
                        type="button"
                        onClick={() => { setSelectedFile(null); setUploadPreview(null); projectForm.setValue('media_url', ''); }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-all"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Descrição da Média (Alt)</label>
                  <input
                    {...projectForm.register('media_desc')}
                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500"
                    placeholder="Breve descrição visual..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest text-blue-600">Galeria de Média Adicional</label>
                  <div className="space-y-4">
                    {galleryFields.map((field, index) => (
                      <div key={field.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-4 relative">
                        <button
                          type="button"
                          onClick={() => removeGallery(index)}
                          className="absolute top-2 right-2 text-red-400 hover:text-red-600 transition-colors"
                        >
                          <X size={16} />
                        </button>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Tipo</label>
                            <select
                              {...projectForm.register(`gallery.${index}.type`)}
                              className="w-full bg-white border-none rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="image">Imagem</option>
                              <option value="video">Vídeo</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">URL / Link</label>
                            <input
                              {...projectForm.register(`gallery.${index}.url`)}
                              className="w-full bg-white border-none rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                              placeholder="URL da imagem ou vídeo"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Descrição (Opcional)</label>
                          <input
                            {...projectForm.register(`gallery.${index}.description`)}
                            className="w-full bg-white border-none rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="Legenda da média..."
                          />
                        </div>
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      onClick={() => appendGallery({ type: 'image', url: '', description: '' })}
                      className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 hover:border-blue-400 transition-all flex items-center justify-center gap-2 font-bold text-sm"
                    >
                      <Plus size={18} /> Adicionar Item à Galeria
                    </button>

                    <div className="relative group">
                      <input
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleGalleryFiles}
                        disabled={isGalleryUploading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <button
                        type="button"
                        disabled={isGalleryUploading}
                        className="w-full py-3 bg-blue-50 text-blue-600 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-100 transition-all disabled:opacity-50"
                      >
                        {isGalleryUploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
                        Carregar Múltiplos Ficheiros (Imagens/Vídeos)
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button
                    type="button"
                    onClick={() => { setIsModalOpen(false); setSelectedFile(null); setUploadPreview(null); }}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-4 rounded-2xl font-bold transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl transition-all disabled:opacity-50"
                  >
                    {isUploading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                    {editingProject ? 'Guardar Alterações' : 'Criar Projeto'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Volunteer Modal */}
      <AnimatePresence>
        {isVolunteerModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsVolunteerModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900">
                  {editingVolunteer ? 'Editar Voluntário' : 'Novo Voluntário'}
                </h2>
                <button onClick={() => setIsVolunteerModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={volunteerForm.handleSubmit(onVolunteerSubmit)} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Nome Completo</label>
                  <input
                    {...volunteerForm.register('full_name')}
                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500"
                    placeholder="Nome do voluntário"
                  />
                  {volunteerForm.formState.errors.full_name && <p className="text-red-500 text-xs">{volunteerForm.formState.errors.full_name.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email</label>
                    <input
                      {...volunteerForm.register('email')}
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500"
                      placeholder="email@exemplo.com"
                    />
                    {volunteerForm.formState.errors.email && <p className="text-red-500 text-xs">{volunteerForm.formState.errors.email.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Telefone</label>
                    <input
                      {...volunteerForm.register('phone')}
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500"
                      placeholder="84xxxxxxx"
                    />
                    {volunteerForm.formState.errors.phone && <p className="text-red-500 text-xs">{volunteerForm.formState.errors.phone.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Projeto Social</label>
                    <select
                      {...volunteerForm.register('project_id')}
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500 appearance-none"
                    >
                      <option value="">Selecionar Projeto...</option>
                      {projects.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    {volunteerForm.formState.errors.project_id && <p className="text-red-500 text-xs">{volunteerForm.formState.errors.project_id.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Estado do Pedido</label>
                    <select
                      {...volunteerForm.register('status')}
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500 appearance-none"
                    >
                      <option value="Pendente">Pendente</option>
                      <option value="Aprovado">Aprovado</option>
                      <option value="Recusado">Recusado</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Mensagem/Observações</label>
                  <textarea
                    {...volunteerForm.register('message')}
                    rows={3}
                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Notas adicionais..."
                  />
                </div>

                <div className="pt-4 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsVolunteerModalOpen(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-4 rounded-2xl font-bold transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl transition-all"
                  >
                    <Save size={20} /> {editingVolunteer ? 'Guardar Alterações' : 'Adicionar Voluntário'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Message Modal */}
      <AnimatePresence>
        {isMessageModalOpen && selectedMessage && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMessageModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Detalhes da Mensagem</h2>
                    <div className="flex items-center gap-2">
                      <p className="text-slate-500 text-sm">Recebida em {new Date(selectedMessage.created_at).toLocaleString('pt-PT')}</p>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        selectedMessage.status === 'Nova' ? 'bg-blue-100 text-blue-600' :
                        selectedMessage.status === 'Lida' ? 'bg-amber-100 text-amber-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        {selectedMessage.status}
                      </span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setIsMessageModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Remetente (Nome ou Email)</label>
                    <p className="font-bold text-slate-900 text-lg">{selectedMessage.name}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contacto Telefónico</label>
                    <p className="text-slate-900 font-bold text-lg">{selectedMessage.phone || 'N/A'}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Assunto</label>
                  <p className="font-bold text-slate-900 text-xl">{selectedMessage.subject}</p>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mensagem</label>
                  <div className="bg-slate-50 p-6 rounded-3xl text-slate-700 leading-relaxed whitespace-pre-wrap border border-slate-100">
                    {selectedMessage.message}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  {selectedMessage.status !== 'Arquivada' && (
                    <button
                      onClick={() => updateMessageStatus(selectedMessage.id, 'Arquivada')}
                      className="flex-1 bg-green-50 text-green-600 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-green-100 transition-all"
                    >
                      <CheckCircle size={20} /> Concluir Apoio
                    </button>
                  )}
                  <button
                    onClick={() => {
                      deleteMessage(selectedMessage.id);
                      setIsMessageModalOpen(false);
                    }}
                    className="flex-1 bg-red-50 text-red-600 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition-all"
                  >
                    <Trash2 size={20} /> Eliminar Permanente
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
