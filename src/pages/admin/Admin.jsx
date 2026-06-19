import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Loader2, 
  Plus, 
  Download,
  FolderKanban,
  UserCheck,
  MessageSquare,
  BookOpen,
  Handshake,
  Users,
  Heart
} from 'lucide-react';

import { supabase } from '../../lib/supabase';

// Utilities
import { compressImage } from '../../utils/imageUtils';
import { exportDonationsPDF, exportVolunteersPDF, exportSupportPDF } from '../../utils/pdfExport';

// Services
import {
  fetchAllAdminData,
  addPartner as addPartnerService,
  deletePartner as deletePartnerService,
  addOrUpdateTeamMember as addOrUpdateTeamMemberService,
  deleteTeamMember as deleteTeamMemberService,
  saveProject,
  deleteProject as deleteProjectService,
  updateProjectStatus as updateProjectStatusService,
  deleteVolunteer as deleteVolunteerService,
  updateVolunteerStatus as updateVolunteerStatusService,
  updateVolunteerReadStatus as updateVolunteerReadStatusService,
  bulkUpdateVolunteerStatus as bulkUpdateVolunteerStatusService,
  deleteMessage as deleteMessageService,
  updateMessageStatus as updateMessageStatusService,
  updateMessageReadStatus as updateMessageReadStatusService,
  bulkUpdateMessageStatus as bulkUpdateMessageStatusService,
  saveBeneficiary as saveBeneficiaryService,
  deleteBeneficiary as deleteBeneficiaryService,
  uploadFileToStorage,
  updateDonationStatus as updateDonationStatusService
} from '../../services/adminService';

// Components
import AdminLogin from '../../components/admin/AdminLogin';
import AdminSidebar from '../../components/admin/AdminSidebar';
import ProjectsTab from '../../components/admin/ProjectsTab';
import ProjectModal from '../../components/admin/ProjectModal';
import VolunteersTab from '../../components/admin/VolunteersTab';
import VolunteerModal from '../../components/admin/VolunteerModal';
import SupportTab from '../../components/admin/SupportTab';
import MessageModal from '../../components/admin/MessageModal';
import BeneficiariesTab from '../../components/admin/BeneficiariesTab';
import BeneficiaryModal from '../../components/admin/BeneficiaryModal';
import PartnersTab from '../../components/admin/PartnersTab';
import PartnerModal from '../../components/admin/PartnerModal';
import TeamTab from '../../components/admin/TeamTab';
import TeamModal from '../../components/admin/TeamModal';
import DonationsTab from '../../components/admin/DonationsTab';

const projectSchema = z.object({
  name: z.string().min(3, 'Nome obrigatorio'),
  objetivos_especificos: z.string().min(5, 'Objetivos Especificos obrigatorios'),
  status: z.enum(['Planeamento', 'Em Curso', 'Concluido']),
  capa_url: z.string().optional(),
  gallery: z.array(z.object({
    type: z.enum(['image', 'video']),
    url: z.string().min(1, 'URL obrigatorio'),
    description: z.string().optional(),
  })).optional(),
  equipa_responsavel: z.array(z.string()).optional(),
});

const volunteerSchema = z.object({
  full_name: z.string().min(3, 'Nome obrigatorio'),
  email: z.string().email('Email invalido'),
  phone: z.string().min(9, 'Telefone invalido'),
  message: z.string().optional(),
  status: z.enum(['Pendente', 'Em Analise', 'Aprovado', 'Recusado']),
  project_id: z.string().min(1, 'Projeto obrigatorio'),
});

const beneficiarySchema = z.object({
  full_name: z.string().min(3, 'Nome obrigatorio'),
  story: z.string().min(10, 'Historia deve ter pelo menos 10 caracteres'),
  project_id: z.string().min(1, 'Projeto obrigatorio'),
  image_url: z.string().optional(),
  image_data: z.string().optional(),
});

const statusSelectClasses = (status) => {
  const base = "px-2.5 py-1 text-xs font-semibold rounded-lg border focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all outline-none appearance-none pr-7 bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_8px_center] bg-no-repeat";
  
  if (status === 'Pendente' || status === 'Planeamento') {
    return `${base} bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100`;
  }
  if (status === 'Em Analise' || status === 'Em Curso' || status === 'Novo') {
    return `${base} bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100`;
  }
  if (status === 'Aprovado' || status === 'Concluido' || status === 'Aceitado') {
    return `${base} bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100`;
  }
  return `${base} bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100`;
};

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return window.localStorage.getItem('alem_admin_logged_in') === 'true';
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isLoggedIn) {
      window.localStorage.setItem('alem_admin_logged_in', 'true');
    } else {
      window.localStorage.removeItem('alem_admin_logged_in');
    }
  }, [isLoggedIn]);
  
  const [projects, setProjects] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [partners, setPartners] = useState([]);
  const [donations, setDonations] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [team, setTeam] = useState([]);

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('projects');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Filters & Search
  const [donationFilterStart, setDonationFilterStart] = useState('');
  const [donationFilterEnd, setDonationFilterEnd] = useState('');
  const [supportFilterStart, setSupportFilterStart] = useState('');
  const [supportFilterEnd, setSupportFilterEnd] = useState('');
  const [supportSearch, setSupportSearch] = useState('');
  const [supportReadFilter, setSupportReadFilter] = useState('Todos');
  const [volunteerSearch, setVolunteerSearch] = useState('');
  const [volunteerFilterStart, setVolunteerFilterStart] = useState('');
  const [volunteerFilterEnd, setVolunteerFilterEnd] = useState('');
  const [volunteerReadFilter, setVolunteerReadFilter] = useState('Todos');

  // Modal open/close & editing states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isGalleryUploading, setIsGalleryUploading] = useState(false);

  const [isVolunteerModalOpen, setIsVolunteerModalOpen] = useState(false);
  const [editingVolunteer, setEditingVolunteer] = useState(null);

  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const [isBeneficiaryModalOpen, setIsBeneficiaryModalOpen] = useState(false);
  const [editingBeneficiary, setEditingBeneficiary] = useState(null);

  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [newPartner, setNewPartner] = useState({ name: '', logo_url: '', logo_data: '' });

  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [newTeamMember, setNewTeamMember] = useState({ name: '', role: '', bio: '', photo_data: '', photo_url: '' });
  const [editingTeamMember, setEditingTeamMember] = useState(null);

  // Forms
  const projectForm = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      status: 'Planeamento',
      gallery: [],
      equipa_responsavel: []
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

  const beneficiaryForm = useForm({
    resolver: zodResolver(beneficiarySchema),
    defaultValues: {
      full_name: '',
      story: '',
      project_id: '',
      image_url: '',
      image_data: ''
    }
  });

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();

      const handleStorageChange = (e) => {
        if (e.key === 'alem_donations_db' || e.key === null) {
          fetchData();
        }
      };
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (isLoggedIn && activeTab === 'donations') {
      fetchData();
    }
  }, [activeTab, isLoggedIn]);

  async function fetchData() {
    try {
      setLoading(true);
      const data = await fetchAllAdminData();
      setProjects(data.projects);
      setVolunteers(data.volunteers);
      setMessages(data.messages);
      setBeneficiaries(data.beneficiaries);
      setTeam(data.team);
      setPartners(data.partners);
      setDonations(data.donations);
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
      alert('Credenciais invalidas');
    }
  };

  // Partners CRUD
  const handleAddPartner = async () => {
    if (!newPartner.name.trim()) {
      alert('O nome do parceiro e obrigatorio.');
      return;
    }
    try {
      await addPartnerService(newPartner);
      setNewPartner({ name: '', logo_url: '', logo_data: '' });
      setIsPartnerModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Error adding partner:', err);
      alert('Erro ao guardar parceiro.');
    }
  };

  const handleDeletePartner = async (id) => {
    if (confirm('Remover este parceiro?')) {
      try {
        await deletePartnerService(id);
        fetchData();
      } catch (err) {
        console.error('Error deleting partner:', err);
      }
    }
  };

  // Team CRUD
  const handleAddOrUpdateTeamMember = async () => {
    const name = newTeamMember?.name || '';
    const role = newTeamMember?.role || '';

    if (!name.trim() || !role.trim()) {
      alert('Nome e cargo sao obrigatorios.');
      return;
    }

    try {
      await addOrUpdateTeamMemberService(newTeamMember, editingTeamMember?.id);
      setNewTeamMember({ name: '', role: '', bio: '', photo_data: '', photo_url: '' });
      setEditingTeamMember(null);
      setIsTeamModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Error saving team member:', err);
      alert('Erro ao guardar membro da equipa.');
    }
  };

  const handleDeleteTeamMember = async (id) => {
    if (confirm('Remover este membro da equipa?')) {
      try {
        await deleteTeamMemberService(id);
        fetchData();
      } catch (err) {
        console.error('Error deleting team member:', err);
      }
    }
  };

  const openEditTeamMember = (member) => {
    setEditingTeamMember(member);
    setNewTeamMember(member);
    setIsTeamModalOpen(true);
  };

  // Project Submit CRUD
  const handleProjectSubmit = async (data) => {
    try {
      let finalMediaUrl = data.capa_url || '';

      if (selectedFile) {
        setIsUploading(true);
        const { error, publicUrl } = await uploadFileToStorage(selectedFile, 'projects');
        if (error) {
          console.warn('Storage upload failed, falling back to base64:', error);
          finalMediaUrl = await compressImage(selectedFile, 1200, 0.6);
          if (!finalMediaUrl) {
            alert('Falha na conversao da imagem.');
            setIsUploading(false);
            return;
          }
        } else {
          finalMediaUrl = publicUrl;
        }
      }

      if (!finalMediaUrl) {
        alert('Por favor, carregue uma capa (imagem) ou forneca um link.');
        return;
      }

      const payload = {
        name: data.name,
        objetivos_especificos: data.objetivos_especificos,
        status: data.status,
        capa_url: finalMediaUrl,
        gallery: data.gallery || [],
        equipa_responsavel: data.equipa_responsavel || [],
      };

      await saveProject(payload, editingProject?.id);

      setIsModalOpen(false);
      setEditingProject(null);
      setSelectedFile(null);
      setUploadPreview(null);
      projectForm.reset();
      fetchData();
    } catch (error) {
      console.error('Error saving project:', error);
      alert(`Erro ao guardar projeto: ${error?.message || 'Verifique a consola para detalhes.'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteProject = async (id) => {
    if (confirm('Tem a certeza que deseja eliminar este projeto?')) {
      await deleteProjectService(id);
      fetchData();
    }
  };

  const handleUpdateProjectStatus = async (id, newStatus) => {
    try {
      await updateProjectStatusService(id, newStatus);
      fetchData();
    } catch (error) {
      console.error('Error updating project status:', error);
    }
  };

  const handleGalleryFiles = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsGalleryUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        let finalUrl = '';

        const { error, publicUrl } = await uploadFileToStorage(file, 'projects/gallery');
        if (error) {
          console.warn('Gallery upload failed, falling back to base64 for images:', error);
          if (file.type.startsWith('image/')) {
            finalUrl = await compressImage(file, 1200, 0.6);
            if (!finalUrl) throw new Error('Falha na conversao da imagem');
          } else {
            throw new Error('Falha ao enviar video. Verifique as permissoes do Supabase Storage.');
          }
        } else {
          finalUrl = publicUrl;
        }

        if (!projectForm.getValues('capa_url') && !selectedFile && file.type.startsWith('image/')) {
          projectForm.setValue('capa_url', finalUrl);
          setUploadPreview(finalUrl);
        }

        appendGallery({
          type: file.type.startsWith('video/') ? 'video' : 'image',
          url: finalUrl,
          description: file.name
        });
      }
    } catch (error) {
      console.error('Error uploading gallery files:', error);
      alert('Erro ao carregar ficheiros da galeria: ' + (error.message || 'Verifique as permissoes.'));
    } finally {
      setIsGalleryUploading(false);
      e.target.value = '';
    }
  };

  const openEdit = (project) => {
    setEditingProject(project);
    projectForm.setValue('name', project.name);
    projectForm.setValue('objetivos_especificos', project.objetivos_especificos || '');
    projectForm.setValue('status', project.status);
    projectForm.setValue('capa_url', project._original_capa_url || project.capa_url || '');
    projectForm.setValue('gallery', project.gallery?.map(g => ({ ...g, url: g._original_url || g.url })) || []);
    projectForm.setValue('equipa_responsavel', project.equipa_responsavel || []);
    setUploadPreview(project.capa_url || null);
    setIsModalOpen(true);
  };

  // Volunteers CRUD callbacks
  const handleUpdateVolunteerStatus = async (id, newStatus) => {
    try {
      if (newStatus === 'Recusado') {
        if (confirm('Tem a certeza? Ao marcar como Recusado, o registo sera eliminado permanentemente.')) {
          await deleteVolunteerService(id);
          fetchData();
          if (isVolunteerModalOpen) setIsVolunteerModalOpen(false);
        }
        return;
      }
      await updateVolunteerStatusService(id, newStatus);
      fetchData();
    } catch (error) {
      console.error('Error updating volunteer status:', error);
    }
  };

  const handleUpdateVolunteerReadStatus = async (id, newReadStatus) => {
    try {
      await updateVolunteerReadStatusService(id, newReadStatus);
      fetchData();
    } catch (error) {
      console.error('Error updating volunteer read status:', error);
    }
  };

  const openVolunteerEdit = (volunteer) => {
    setEditingVolunteer(volunteer);
    if (volunteer.read_status !== 'Lido') {
      handleUpdateVolunteerReadStatus(volunteer.id, 'Lido');
      volunteer.read_status = 'Lido';
    }
    setIsVolunteerModalOpen(true);
  };

  const handleDeleteVolunteer = async (id) => {
    if (confirm('Tem a certeza que deseja remover este voluntario?')) {
      await deleteVolunteerService(id);
      fetchData();
    }
  };

  const getFilteredVolunteers = () => {
    let filtered = volunteers;
    
    if (volunteerReadFilter === 'Lidos') {
      filtered = filtered.filter(v => v.read_status === 'Lido');
    } else if (volunteerReadFilter === 'Nao Lidos') {
      filtered = filtered.filter(v => v.read_status === 'Nao Lido');
    }

    if (volunteerFilterStart) {
      const start = new Date(volunteerFilterStart + 'T00:00:00');
      filtered = filtered.filter(v => new Date(v.created_at) >= start);
    }
    if (volunteerFilterEnd) {
      const end = new Date(volunteerFilterEnd + 'T23:59:59');
      filtered = filtered.filter(v => new Date(v.created_at) <= end);
    }

    if (volunteerSearch) {
      const search = volunteerSearch.toLowerCase();
      filtered = filtered.filter(v => 
        (v.full_name && v.full_name.toLowerCase().includes(search)) ||
        (v.email && v.email.toLowerCase().includes(search)) ||
        (v.created_at && new Date(v.created_at).toLocaleDateString('pt-PT').includes(search))
      );
    }

    return filtered;
  };

  const handleExportVolunteersPDF = async () => {
    const filtered = getFilteredVolunteers();
    exportVolunteersPDF(filtered, { readFilter: volunteerReadFilter, search: volunteerSearch });

    const pendingIds = filtered.filter(v => v.status === 'Pendente').map(v => v.id);
    if (pendingIds.length > 0) {
      try {
        await bulkUpdateVolunteerStatusService(pendingIds, 'Em Analise');
        fetchData();
      } catch (err) {
        console.error('Erro ao atualizar estado para Em Analise:', err);
      }
    }
  };

  // Support / Message Callbacks
  const handleUpdateMessageStatus = async (id, status) => {
    try {
      if (status === 'Recusado') {
        if (confirm('Tem a certeza? Ao marcar como Recusado, o registo sera eliminado permanentemente.')) {
          await deleteMessageService(id);
          fetchData();
          if (isMessageModalOpen) setIsMessageModalOpen(false);
        }
        return;
      }
      await updateMessageStatusService(id, status);
      fetchData();
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  };

  const handleUpdateMessageReadStatus = async (id, newReadStatus) => {
    try {
      await updateMessageReadStatusService(id, newReadStatus);
      fetchData();
    } catch (error) {
      console.error('Error updating message read status:', error);
    }
  };

  const handleRecuseAndRemove = async (id) => {
    await deleteMessageService(id);
    setIsMessageModalOpen(false);
    fetchData();
  };

  const handleRegisterAsBeneficiary = async (selectedMsg) => {
    setEditingBeneficiary(null);
    beneficiaryForm.reset({
      full_name: selectedMsg.name,
      story: `Fez um pedido de apoio com o assunto "${selectedMsg.subject}".\n\nMensagem:\n${selectedMsg.message}`,
      project_id: '',
      image_url: '',
      image_data: ''
    });
    setIsBeneficiaryModalOpen(true);
    await updateMessageStatusService(selectedMsg.id, 'Aceitado');
    fetchData();
  };

  const openMessage = (msg) => {
    setSelectedMessage(msg);
    if (msg.read_status !== 'Lido') {
      handleUpdateMessageReadStatus(msg.id, 'Lido');
      msg.read_status = 'Lido';
    }
    setIsMessageModalOpen(true);
  };

  const handleDeleteMessage = async (id) => {
    await deleteMessageService(id);
    fetchData();
  };

  const getFilteredMessages = () => {
    let filtered = messages;
    
    if (supportReadFilter === 'Lidos') {
      filtered = filtered.filter(m => m.read_status === 'Lido');
    } else if (supportReadFilter === 'Nao Lidos') {
      filtered = filtered.filter(m => m.read_status === 'Nao Lido');
    }

    if (supportFilterStart) {
      const start = new Date(supportFilterStart + 'T00:00:00');
      filtered = filtered.filter(m => new Date(m.created_at) >= start);
    }
    if (supportFilterEnd) {
      const end = new Date(supportFilterEnd + 'T23:59:59');
      filtered = filtered.filter(m => new Date(m.created_at) <= end);
    }

    if (supportSearch) {
      const search = supportSearch.toLowerCase();
      filtered = filtered.filter(m => 
        (m.name && m.name.toLowerCase().includes(search)) ||
        (m.email && m.email.toLowerCase().includes(search)) ||
        (m.created_at && new Date(m.created_at).toLocaleDateString('pt-PT').includes(search))
      );
    }

    return filtered;
  };

  const handleExportSupportPDF = async () => {
    const filtered = getFilteredMessages();
    exportSupportPDF(filtered, { readFilter: supportReadFilter, search: supportSearch });

    const pendingIds = filtered.filter(m => m.status === 'Pendente').map(m => m.id);
    if (pendingIds.length > 0) {
      try {
        await bulkUpdateMessageStatusService(pendingIds, 'Em Analise');
        fetchData();
      } catch (err) {
        console.error('Erro ao atualizar estado para Em Analise:', err);
      }
    }
  };

  // Beneficiary Stories Callbacks
  const handleBeneficiarySubmit = async (data) => {
    try {
      await saveBeneficiaryService(data, editingBeneficiary?.id);
      setIsBeneficiaryModalOpen(false);
      setEditingBeneficiary(null);
      beneficiaryForm.reset();
      fetchData();
    } catch (error) {
      console.error('Error saving beneficiary story:', error);
      alert('Erro ao guardar a historia do beneficiario.');
    }
  };

  const openBeneficiaryEdit = (story) => {
    setEditingBeneficiary(story);
    beneficiaryForm.setValue('full_name', story.full_name);
    beneficiaryForm.setValue('story', story.story);
    beneficiaryForm.setValue('project_id', story.project_id || '');
    beneficiaryForm.setValue('image_url', story._original_image_url || story.image_url || '');
    beneficiaryForm.setValue('image_data', story.image_data || '');
    setIsBeneficiaryModalOpen(true);
  };

  const handleDeleteBeneficiary = async (id) => {
    if (confirm('Tem a certeza que deseja eliminar esta historia de beneficiario?')) {
      await deleteBeneficiaryService(id);
      fetchData();
    }
  };

  // Donations filters & PDF
  const getFilteredDonations = () => {
    if (!donationFilterStart && !donationFilterEnd) return donations;
    return donations.filter(d => {
      if (!d.created_at) return true;
      const date = new Date(d.created_at);
      if (isNaN(date.getTime())) return true;
      const start = donationFilterStart ? new Date(donationFilterStart + 'T00:00:00') : null;
      const end = donationFilterEnd ? new Date(donationFilterEnd + 'T23:59:59') : null;
      if (start && date < start) return false;
      if (end && date > end) return false;
      return true;
    });
  };

  const handleExportDonationsPDF = () => {
    const filtered = getFilteredDonations();
    exportDonationsPDF(filtered, { filterStart: donationFilterStart, filterEnd: donationFilterEnd });
  };

  const handleUpdateDonationStatus = async (id, newStatus) => {
    try {
      if (newStatus === 'Nao Recebido' || newStatus === 'Recusado') {
        if (confirm('Tem a certeza? Ao marcar como Nao Recebido, o registo de doacao sera eliminado permanentemente.')) {
          await updateDonationStatusService(id, newStatus);
          fetchData();
        }
        return;
      }
      await updateDonationStatusService(id, newStatus);
      fetchData();
    } catch (error) {
      console.error('Error updating donation status:', error);
    }
  };

  if (!isLoggedIn) {
    return (
      <AdminLogin
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        handleLogin={handleLogin}
      />
    );
  }

  const menuItems = [
    { id: 'projects', label: 'Projetos', icon: <FolderKanban size={18} /> },
    { id: 'volunteers', label: 'Voluntarios', icon: <UserCheck size={18} /> },
    { id: 'support', label: 'Pedidos de Apoio', icon: <MessageSquare size={18} /> },
    { id: 'beneficiaries', label: 'Historias', icon: <BookOpen size={18} /> },
    { id: 'partners', label: 'Parceiros', icon: <Handshake size={18} /> },
    { id: 'team', label: 'Equipa', icon: <Users size={18} /> },
    { id: 'donations', label: 'Nossos Doadores', icon: <Heart size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      <AdminSidebar
        menuItems={menuItems}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setIsLoggedIn={setIsLoggedIn}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <main className="flex-grow lg:ml-64 p-4 md:p-8 min-h-screen">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {activeTab === 'projects' ? 'Gestao de Projetos' :
                activeTab === 'volunteers' ? 'Gestao de Voluntarios' :
                  activeTab === 'beneficiaries' ? 'Historias de Beneficiarios' :
                    activeTab === 'support' ? 'Pedidos de Apoio' :
                      activeTab === 'partners' ? 'Gestao de Parceiros' :
                        activeTab === 'team' ? 'Gestao da Equipa' :
                          activeTab === 'donations' ? 'Nossos Doadores' : ''}
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {activeTab === 'projects'
                ? `${projects.length} projetos registados`
                : activeTab === 'volunteers'
                  ? `${volunteers.filter(v => v.status === 'Pendente').length} pendentes, ${volunteers.filter(v => v.status === 'Em Analise').length} em analise, ${volunteers.filter(v => v.status === 'Aprovado').length} aprovados`
                  : activeTab === 'beneficiaries'
                    ? `${beneficiaries.length} historias registadas`
                    : activeTab === 'support'
                      ? `${messages.filter(m => m.status === 'Pendente').length} pendentes, ${messages.filter(m => m.status === 'Em Analise').length} em analise`
                      : activeTab === 'partners'
                        ? `${partners.length} parceiros registados`
                        : activeTab === 'team'
                          ? `${team.length} membros registados`
                          : activeTab === 'donations'
                            ? `${donations.length} doadores registados`
                            : ''
              }
            </p>
          </div>
          <div className="flex items-center gap-3 self-start sm:self-auto">
            {activeTab === 'volunteers' && (
              <button
                onClick={handleExportVolunteersPDF}
                className="btn-secondary flex items-center gap-1.5"
              >
                <Download size={18} /> Exportar PDF
              </button>
            )}
            {activeTab !== 'support' && activeTab !== 'donations' && activeTab !== 'beneficiaries' && activeTab !== 'volunteers' && (
              <button
                onClick={() => {
                  if (activeTab === 'projects') {
                    setEditingProject(null);
                    projectForm.reset({
                      status: 'Planeamento',
                      gallery: [],
                      equipa_responsavel: [],
                    });
                    setIsModalOpen(true);
                  } else if (activeTab === 'partners') {
                    setNewPartner({ name: '', logo_url: '', logo_data: '' });
                    setIsPartnerModalOpen(true);
                  } else if (activeTab === 'team') {
                    setEditingTeamMember(null);
                    setNewTeamMember({ name: '', role: '', bio: '', photo_data: '', photo_url: '' });
                    setIsTeamModalOpen(true);
                  }
                }}
                className="btn-primary flex items-center gap-1.5"
              >
                <Plus size={18} /> {activeTab === 'projects' ? 'Novo Projeto' : activeTab === 'partners' ? 'Novo Parceiro' : 'Novo Membro'}
              </button>
            )}
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center py-32">
            <Loader2 className="animate-spin text-blue-600" size={48} />
          </div>
        ) : activeTab === 'projects' ? (
          <ProjectsTab
            projects={projects}
            statusSelectClasses={statusSelectClasses}
            updateProjectStatus={handleUpdateProjectStatus}
            openEdit={openEdit}
            deleteProject={handleDeleteProject}
          />
        ) : activeTab === 'volunteers' ? (
          <VolunteersTab
            volunteers={volunteers}
            projects={projects}
            statusSelectClasses={statusSelectClasses}
            volunteerSearch={volunteerSearch}
            setVolunteerSearch={setVolunteerSearch}
            volunteerReadFilter={volunteerReadFilter}
            setVolunteerReadFilter={setVolunteerReadFilter}
            volunteerFilterStart={volunteerFilterStart}
            setVolunteerFilterStart={setVolunteerFilterStart}
            volunteerFilterEnd={volunteerFilterEnd}
            setVolunteerFilterEnd={setVolunteerFilterEnd}
            getFilteredVolunteers={getFilteredVolunteers}
            updateVolunteerStatus={handleUpdateVolunteerStatus}
            updateVolunteerReadStatus={handleUpdateVolunteerReadStatus}
            openVolunteerEdit={openVolunteerEdit}
            deleteVolunteer={handleDeleteVolunteer}
          />
        ) : activeTab === 'support' ? (
          <SupportTab
            messages={messages}
            statusSelectClasses={statusSelectClasses}
            supportSearch={supportSearch}
            setSupportSearch={setSupportSearch}
            supportReadFilter={supportReadFilter}
            setSupportReadFilter={setSupportReadFilter}
            supportFilterStart={supportFilterStart}
            setSupportFilterStart={setSupportFilterStart}
            supportFilterEnd={supportFilterEnd}
            setSupportFilterEnd={setSupportFilterEnd}
            getFilteredMessages={getFilteredMessages}
            updateMessageStatus={handleUpdateMessageStatus}
            updateMessageReadStatus={handleUpdateMessageReadStatus}
            openMessage={openMessage}
            deleteMessage={handleDeleteMessage}
            exportSupportPDF={handleExportSupportPDF}
          />
        ) : activeTab === 'partners' ? (
          <PartnersTab
            partners={partners}
            deletePartner={handleDeletePartner}
          />
        ) : activeTab === 'team' ? (
          <TeamTab
            team={team}
            openEditTeamMember={openEditTeamMember}
            deleteTeamMember={handleDeleteTeamMember}
          />
        ) : activeTab === 'donations' ? (
          <DonationsTab
            donations={donations}
            donationFilterStart={donationFilterStart}
            setDonationFilterStart={setDonationFilterStart}
            donationFilterEnd={donationFilterEnd}
            setDonationFilterEnd={setDonationFilterEnd}
            getFilteredDonations={getFilteredDonations}
            fetchData={fetchData}
            exportDonationsPDF={handleExportDonationsPDF}
            statusSelectClasses={statusSelectClasses}
            updateDonationStatus={handleUpdateDonationStatus}
          />
        ) : activeTab === 'beneficiaries' ? (
          <BeneficiariesTab
            beneficiaries={beneficiaries}
            projects={projects}
            openBeneficiaryEdit={openBeneficiaryEdit}
            deleteBeneficiary={handleDeleteBeneficiary}
            onCreateNew={() => {
              setEditingBeneficiary(null);
              beneficiaryForm.reset({
                full_name: '',
                story: '',
                project_id: '',
                image_url: '',
                image_data: ''
              });
              setIsBeneficiaryModalOpen(true);
            }}
          />
        ) : null}
      </main>

      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedFile(null); setUploadPreview(null); }}
        editingProject={editingProject}
        projectForm={projectForm}
        galleryFields={galleryFields}
        appendGallery={appendGallery}
        removeGallery={removeGallery}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        uploadPreview={uploadPreview}
        setUploadPreview={setUploadPreview}
        isUploading={isUploading}
        isGalleryUploading={isGalleryUploading}
        handleGalleryFiles={handleGalleryFiles}
        team={team}
        onSubmit={handleProjectSubmit}
      />

      <VolunteerModal
        isOpen={isVolunteerModalOpen}
        onClose={() => setIsVolunteerModalOpen(false)}
        editingVolunteer={editingVolunteer}
        setEditingVolunteer={setEditingVolunteer}
        updateVolunteerStatus={handleUpdateVolunteerStatus}
        updateVolunteerReadStatus={handleUpdateVolunteerReadStatus}
      />

      <MessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        selectedMessage={selectedMessage}
        setSelectedMessage={setSelectedMessage}
        updateMessageStatus={handleUpdateMessageStatus}
        updateMessageReadStatus={handleUpdateMessageReadStatus}
        onRegisterAsBeneficiary={handleRegisterAsBeneficiary}
        onRecuseAndRemove={handleRecuseAndRemove}
      />

      <BeneficiaryModal
        isOpen={isBeneficiaryModalOpen}
        onClose={() => setIsBeneficiaryModalOpen(false)}
        projects={projects}
        editingBeneficiary={editingBeneficiary}
        beneficiaryForm={beneficiaryForm}
        onBeneficiarySubmit={handleBeneficiarySubmit}
      />

      <PartnerModal
        isOpen={isPartnerModalOpen}
        onClose={() => setIsPartnerModalOpen(false)}
        newPartner={newPartner}
        setNewPartner={setNewPartner}
        addPartner={handleAddPartner}
      />

      <TeamModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        editingTeamMember={editingTeamMember}
        newTeamMember={newTeamMember}
        setNewTeamMember={setNewTeamMember}
        addOrUpdateTeamMember={handleAddOrUpdateTeamMember}
      />
    </div>
  );
}
