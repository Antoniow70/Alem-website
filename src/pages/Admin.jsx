import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase, resolveProjectMediaUrls, resolveMediaUrl } from '../lib/supabase';
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
  Download,
  Handshake,
  UserCircle,
  Briefcase,
  Heart,
  Calendar,
  Filter,
  TrendingUp,
  Menu
} from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [projects, setProjects] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [partners, setPartners] = useState([]);
  const [donations, setDonations] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [donationFilterStart, setDonationFilterStart] = useState('');
  const [donationFilterEnd, setDonationFilterEnd] = useState('');
  const [supportFilterStart, setSupportFilterStart] = useState('');
  const [supportFilterEnd, setSupportFilterEnd] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVolunteerModalOpen, setIsVolunteerModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isBeneficiaryModalOpen, setIsBeneficiaryModalOpen] = useState(false);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [editingVolunteer, setEditingVolunteer] = useState(null);
  const [editingBeneficiary, setEditingBeneficiary] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('projects');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [isGalleryUploading, setIsGalleryUploading] = useState(false);
  const [newPartner, setNewPartner] = useState({ name: '', logo_url: '', logo_data: '' });
  const [team, setTeam] = useState([]);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [newTeamMember, setNewTeamMember] = useState({ name: '', role: '', bio: '', photo_data: '', photo_url: '' });
  const [editingTeamMember, setEditingTeamMember] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [volunteerSearch, setVolunteerSearch] = useState('');
  const [volunteerFilterStart, setVolunteerFilterStart] = useState('');
  const [volunteerFilterEnd, setVolunteerFilterEnd] = useState('');
  const [volunteerReadFilter, setVolunteerReadFilter] = useState('Todos');

  const [supportSearch, setSupportSearch] = useState('');
  const [supportReadFilter, setSupportReadFilter] = useState('Todos');

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

  const mediaType = projectForm.watch('media_type');

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();

      // Listen for donations saved from the Doar form (same or different tab)
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
    // Re-fetch when tab is switched to donations
    if (isLoggedIn && activeTab === 'donations') {
      fetchData();
    }
  }, [activeTab, isLoggedIn]);

  async function fetchData() {
    try {
      setLoading(true);
      const { data: projData, error: projError } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      const { data: volData, error: volError } = await supabase.from('volunteers').select('*').order('created_at', { ascending: false });
      const { data: msgData, error: msgError } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
      const { data: benData, error: benError } = await supabase.from('beneficiary_stories').select('*').order('created_at', { ascending: false });
      const { data: teamData, error: teamError } = await supabase.from('team').select('*').order('created_at', { ascending: false });
      const { data: partnersData, error: partnersError } = await supabase.from('partners').select('*').order('created_at', { ascending: false });
      const { data: donationsData, error: donationsError } = await supabase.from('donations').select('*').order('created_at', { ascending: false });

      if (projError) throw projError;
      if (volError) throw volError;
      if (msgError) throw msgError;
      if (benError) throw benError;
      if (teamError) throw teamError;
      if (partnersError) throw partnersError;
      if (donationsError) throw donationsError;

      // Resolve idb:// URLs to blob:// URLs for display
      const resolvedProjects = await resolveProjectMediaUrls(projData || []);
      setProjects(resolvedProjects);
      setVolunteers(volData || []);
      setMessages(msgData || []);
      setTeam(teamData || []);
      setPartners(partnersData || []);
      setDonations(donationsData || []);

      const resolvedStories = await Promise.all((benData || []).map(async (story) => ({
        ...story,
        _original_image_url: story.image_url,
        image_url: await resolveMediaUrl(story.image_url)
      })));
      setBeneficiaries(resolvedStories);
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

  const addPartner = async () => {
    if (!newPartner.name.trim()) {
      alert('O nome do parceiro e obrigatorio.');
      return;
    }
    const payload = {
      name: newPartner.name,
      logo_url: newPartner.logo_data || newPartner.logo_url || ''
    };
    try {
      const { error } = await supabase.from('partners').insert([payload]);
      if (error) throw error;
      setNewPartner({ name: '', logo_url: '', logo_data: '' });
      setIsPartnerModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Error adding partner:', err);
      alert('Erro ao guardar parceiro.');
    }
  };

  const deletePartner = async (id) => {
    if (confirm('Remover este parceiro?')) {
      try {
        const { error } = await supabase.from('partners').delete().eq('id', id);
        if (error) throw error;
        fetchData();
      } catch (err) {
        console.error('Error deleting partner:', err);
      }
    }
  };

  const addOrUpdateTeamMember = async () => {
    const name = newTeamMember?.name || '';
    const role = newTeamMember?.role || '';

    if (!name.trim() || !role.trim()) {
      alert('Nome e cargo sao obrigatorios.');
      return;
    }

    const payload = {
      name,
      role,
      bio: newTeamMember.bio || '',
      photo_url: newTeamMember.photo_data || newTeamMember.photo_url || ''
    };

    try {
      if (editingTeamMember) {
        const { error } = await supabase.from('team').update(payload).eq('id', editingTeamMember.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('team').insert([payload]);
        if (error) throw error;
      }
      setNewTeamMember({ name: '', role: '', bio: '', photo_data: '', photo_url: '' });
      setEditingTeamMember(null);
      setIsTeamModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Error saving team member:', err);
      alert('Erro ao guardar membro da equipa.');
    }
  };

  const deleteTeamMember = async (id) => {
    if (confirm('Remover este membro da equipa?')) {
      try {
        const { error } = await supabase.from('team').delete().eq('id', id);
        if (error) throw error;
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

  const onProjectSubmit = async (data) => {
    try {
      let finalMediaUrl = data.capa_url || '';

      if (selectedFile) {
        setIsUploading(true);
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `projects/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('project-media')
          .upload(filePath, selectedFile);

        if (uploadError) {
          console.warn('Storage upload failed, falling back to base64:', uploadError);
          // Compress and convert to base64
          finalMediaUrl = await new Promise(resolve => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const maxWidth = 1200;
              const scale = Math.min(maxWidth / img.width, 1);
              canvas.width = img.width * scale;
              canvas.height = img.height * scale;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              resolve(canvas.toDataURL('image/jpeg', 0.6));
            };
            img.onerror = () => resolve('');
            img.src = URL.createObjectURL(selectedFile);
          });
          if (!finalMediaUrl) {
            alert('Falha na conversao da imagem.');
            setIsUploading(false);
            return;
          }
        } else {
          const { data: urlData } = supabase.storage
            .from('project-media')
            .getPublicUrl(filePath);
          finalMediaUrl = urlData.publicUrl;
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
      alert(`Erro ao guardar projeto: ${error?.message || 'Verifique a consola para detalhes.'}`);
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

  const onBeneficiarySubmit = async (data) => {
    try {
      const payload = {
        full_name: data.full_name,
        story: data.story,
        project_id: data.project_id,
        image_url: data.image_url || '',
        image_data: data.image_data || '',
      };

      if (editingBeneficiary) {
        const { error } = await supabase
          .from('beneficiary_stories')
          .update(payload)
          .eq('id', editingBeneficiary.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('beneficiary_stories')
          .insert([payload]);
        if (error) throw error;
      }
      setIsBeneficiaryModalOpen(false);
      setEditingBeneficiary(null);
      beneficiaryForm.reset();
      fetchData();
    } catch (error) {
      console.error('Error saving beneficiary story:', error);
      alert('Erro ao guardar a historia do beneficiario.');
    }
  };

  const deleteProject = async (id) => {
    if (confirm('Tem a certeza que deseja eliminar este projeto?')) {
      await supabase.from('projects').delete().eq('id', id);
      fetchData();
    }
  };

  const deleteVolunteer = async (id) => {
    if (confirm('Tem a certeza que deseja remover este voluntario?')) {
      await supabase.from('volunteers').delete().eq('id', id);
      fetchData();
    }
  };

  const deleteBeneficiary = async (id) => {
    if (confirm('Tem a certeza que deseja eliminar esta historia de beneficiario?')) {
      await supabase.from('beneficiary_stories').delete().eq('id', id);
      fetchData();
    }
  };

  const updateMessageStatus = async (id, status) => {
    try {
      if (status === 'Recusado') {
        if (confirm('Tem a certeza? Ao marcar como Recusado, o registo sera eliminado permanentemente.')) {
          const { error } = await supabase.from('messages').delete().eq('id', id);
          if (error) throw error;
          fetchData();
          if (isMessageModalOpen) setIsMessageModalOpen(false);
        }
        return; // exit early whether confirmed or cancelled
      }

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

  const updateMessageReadStatus = async (id, newReadStatus) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ read_status: newReadStatus })
        .eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Error updating message read status:', error);
    }
  };

  const openMessage = (msg) => {
    setSelectedMessage(msg);
    if (msg.read_status !== 'Lido') {
      updateMessageReadStatus(msg.id, 'Lido');
      msg.read_status = 'Lido';
    }
    setIsMessageModalOpen(true);
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
      if (newStatus === 'Recusado') {
        if (confirm('Tem a certeza? Ao marcar como Recusado, o registo sera eliminado permanentemente.')) {
          const { error } = await supabase.from('volunteers').delete().eq('id', id);
          if (error) throw error;
          fetchData();
          if (isVolunteerModalOpen) setIsVolunteerModalOpen(false);
        }
        return; // exit early whether confirmed or cancelled
      }

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

  const updateVolunteerReadStatus = async (id, newReadStatus) => {
    try {
      const { error } = await supabase
        .from('volunteers')
        .update({ read_status: newReadStatus })
        .eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Error updating volunteer read status:', error);
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

        let finalUrl = '';

        const { error: uploadError } = await supabase.storage
          .from('project-media')
          .upload(filePath, file);

        if (uploadError) {
          console.warn('Gallery upload failed, falling back to base64 for images:', uploadError);
          if (file.type.startsWith('image/')) {
            // Compress and convert to base64
            finalUrl = await new Promise(resolve => {
              const img = new Image();
              img.onload = () => {
                const canvas = document.createElement('canvas');
                const maxWidth = 1200;
                const scale = Math.min(maxWidth / img.width, 1);
                canvas.width = img.width * scale;
                canvas.height = img.height * scale;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL('image/jpeg', 0.6));
              };
              img.onerror = () => resolve('');
              img.src = URL.createObjectURL(file);
            });
            if (!finalUrl) throw new Error('Falha na conversao da imagem');
          } else {
            // Can't base64 video easily, just throw
            throw new Error('Falha ao enviar video. Verifique as permissoes do Supabase Storage.');
          }
        } else {
          const { data: urlData } = supabase.storage
            .from('project-media')
            .getPublicUrl(filePath);
          finalUrl = urlData.publicUrl;
        }

        // UX Improvement: if main media is not set, set the first uploaded file as main
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
      // Reset input
      e.target.value = '';
    }
  };

  const openVolunteerEdit = (volunteer) => {
    setEditingVolunteer(volunteer);
    if (volunteer.read_status !== 'Lido') {
      updateVolunteerReadStatus(volunteer.id, 'Lido');
      volunteer.read_status = 'Lido';
    }
    setIsVolunteerModalOpen(true);
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

  // ─── Donations helpers ───────────────────────────────────────────────────────
  const getFilteredDonations = () => {
    // If no filter is set, return all donations
    if (!donationFilterStart && !donationFilterEnd) return donations;
    return donations.filter(d => {
      if (!d.created_at) return true; // include donations without date when filtering
      const date = new Date(d.created_at);
      if (isNaN(date.getTime())) return true; // include invalid dates
      const start = donationFilterStart ? new Date(donationFilterStart + 'T00:00:00') : null;
      const end = donationFilterEnd ? new Date(donationFilterEnd + 'T23:59:59') : null;
      if (start && date < start) return false;
      if (end && date > end) return false;
      return true;
    });
  };

  const exportDonationsPDF = () => {
    const filtered = getFilteredDonations();
    const doc = new jsPDF({ orientation: 'landscape' });

    // Header
    doc.setFillColor(20, 33, 61);
    doc.rect(0, 0, 297, 38, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Relatorio de Doadores – ALEM', 14, 18);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const periodText = donationFilterStart || donationFilterEnd
      ? `Periodo: ${donationFilterStart ? new Date(donationFilterStart + 'T00:00:00').toLocaleDateString('pt-PT') : 'Inicio'} – ${donationFilterEnd ? new Date(donationFilterEnd + 'T00:00:00').toLocaleDateString('pt-PT') : 'Hoje'}`
      : 'Todos os registos';
    doc.text(periodText, 14, 27);
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-PT')}`, 14, 33);

    // Stats summary
    const totalAmount = filtered.reduce((sum, d) => sum + (parseFloat(d.valor) || 0), 0);
    doc.setTextColor(20, 33, 61);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(
      `Total de Doacoes: ${filtered.length}     |     Valor Total: MT ${totalAmount.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}`,
      14, 50
    );

    // Table with date+time and message
    const tableColumn = ['#', 'Nome Completo', 'Email', 'Telefone', 'Causa', 'Valor (MZN)', 'Pagamento', 'Data & Hora', 'Mensagem'];
    const tableRows = filtered.map((d, idx) => {
      const donDate = d.created_at ? new Date(d.created_at) : null;
      const isValidDate = donDate && !isNaN(donDate.getTime());
      const dateStr = isValidDate
        ? `${donDate.toLocaleDateString('pt-PT')} ${donDate.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}`
        : 'N/D';
      return [
        String(filtered.length - idx),
        d.nome || '',
        d.email || '',
        d.telefone || '',
        d.causa || '',
        `MT ${parseFloat(d.valor || 0).toLocaleString('pt-PT', { minimumFractionDigits: 2 })}`,
        d.metodo_pagamento === 'mpesa' ? 'M-Pesa' : d.metodo_pagamento === 'transferencia' ? 'Transferencia' : 'Cartao',
        dateStr,
        d.mensagem || '—',
      ];
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 56,
      styles: { fontSize: 7.5, cellPadding: 3, overflow: 'linebreak' },
      headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      columnStyles: {
        0: { halign: 'center', cellWidth: 8 },
        5: { halign: 'right', fontStyle: 'bold', cellWidth: 28 },
        6: { cellWidth: 22 },
        7: { cellWidth: 30 },
        8: { cellWidth: 40 },
      },
    });

    // Footer with page numbers
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        `ALEM – Alem das Barreiras  |  Pagina ${i} de ${pageCount}`,
        14,
        doc.internal.pageSize.height - 10
      );
    }

    const suffix = (donationFilterStart || donationFilterEnd)
      ? `_${donationFilterStart || 'inicio'}_a_${donationFilterEnd || 'hoje'}`
      : '_todos';
    doc.save(`doadores${suffix}.pdf`);
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

  const exportVolunteersPDF = async () => {
    const doc = new jsPDF({ orientation: 'landscape' });
    const tableColumn = ["Nome", "Genero", "Telefone", "Email", "Endereco", "Interesse", "Data", "Estado"];
    const tableRows = [];

    const filtered = getFilteredVolunteers();

    filtered.forEach(vol => {
      const volunteerData = [
        vol.full_name || '',
        vol.genero || '',
        vol.phone || '',
        vol.email || '',
        vol.endereco || '',
        vol.area_interesse || '',
        vol.created_at ? new Date(vol.created_at).toLocaleDateString('pt-PT') : '',
        vol.status || ''
      ];
      tableRows.push(volunteerData);
    });

    doc.setFillColor(20, 33, 61);
    doc.rect(0, 0, 297, 38, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text("Relatorio de Voluntarios - ALEM", 14, 18);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Filtros: ${volunteerReadFilter} | ${volunteerSearch ? 'Pesquisa: ' + volunteerSearch : ''}`, 14, 27);
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-PT')}`, 14, 33);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 45,
      styles: { fontSize: 7, cellPadding: 2, overflow: 'linebreak' },
      headStyles: { fillColor: [37, 99, 235] },
      columnStyles: { 5: { cellWidth: 30 } }
    });

    doc.save(`voluntarios_${new Date().toISOString().split('T')[0]}.pdf`);

    // Transicao automatica: Pendente -> Em Analise ao exportar PDF
    const pendingIds = filtered.filter(v => v.status === 'Pendente').map(v => v.id);
    if (pendingIds.length > 0) {
      try {
        for (const id of pendingIds) {
          await supabase.from('volunteers').update({ status: 'Em Analise' }).eq('id', id);
        }
        fetchData();
      } catch (err) {
        console.error('Erro ao atualizar estado para Em Analise:', err);
      }
    }
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

  const exportSupportPDF = async () => {
    const doc = new jsPDF({ orientation: 'landscape' });
    const tableColumn = ["Nome", "Genero", "Nascimento", "Contacto", "Email", "Endereco", "Apoio/Necessidade", "Data", "Estado"];
    const tableRows = [];

    const filtered = getFilteredMessages();

    filtered.forEach(msg => {
      const messageData = [
        msg.name || '',
        msg.genero || '',
        msg.data_nascimento ? new Date(msg.data_nascimento).toLocaleDateString('pt-PT') : '',
        msg.phone || '',
        msg.email || '',
        msg.endereco || '',
        msg.subject || '',
        msg.created_at ? new Date(msg.created_at).toLocaleDateString('pt-PT') : '',
        msg.status || ''
      ];
      tableRows.push(messageData);
    });

    doc.setFillColor(20, 33, 61);
    doc.rect(0, 0, 297, 38, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text("Relatorio de Pedidos de Apoio - ALEM", 14, 18);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Filtros: ${supportReadFilter} | ${supportSearch ? 'Pesquisa: ' + supportSearch : ''}`, 14, 27);
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-PT')}`, 14, 33);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 45,
      styles: { fontSize: 7, cellPadding: 2, overflow: 'linebreak' },
      headStyles: { fillColor: [37, 99, 235] },
      columnStyles: { 5: { cellWidth: 30 }, 6: { cellWidth: 30 } }
    });

    doc.save(`pedidos_apoio_${new Date().toISOString().split('T')[0]}.pdf`);

    // Transicao automatica: Pendente -> Em Analise ao exportar PDF
    const pendingIds = filtered.filter(m => m.status === 'Pendente').map(m => m.id);
    if (pendingIds.length > 0) {
      try {
        for (const id of pendingIds) {
          await supabase.from('messages').update({ status: 'Em Analise' }).eq('id', id);
        }
        fetchData();
      } catch (err) {
        console.error('Erro ao atualizar estado para Em Analise:', err);
      }
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-200/30 w-full max-w-md space-y-6"
        >
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 border border-blue-100">
              <LayoutDashboard size={24} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Admin ALEM</h1>
            <p className="text-sm text-slate-500">Acesso restrito a equipa de gestao</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="form-label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="admin@alem.mz"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="form-label">Palavra-passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="••••••••"
                required
              />
            </div>
            <button className="w-full btn-primary py-3 mt-2">
              Entrar no Painel
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const menuItems = [
    { id: 'projects', label: 'Projetos', icon: <FolderKanban size={18} /> },
    { id: 'volunteers', label: 'Voluntários', icon: <Users size={18} /> },
    { id: 'support', label: 'Pedidos de Apoio', icon: <Mail size={18} /> },
    { id: 'beneficiaries', label: 'Histórias', icon: <Heart size={18} /> },
    { id: 'partners', label: 'Parceiros', icon: <Handshake size={18} /> },
    { id: 'team', label: 'Equipa', icon: <UserCircle size={18} /> },
    { id: 'donations', label: 'Nossos Doadores', icon: <TrendingUp size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <div className="lg:hidden h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center border border-blue-100">
            <LayoutDashboard size={18} />
          </div>
          <span className="font-bold text-slate-900 text-base">ALEM Admin</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-slate-500 hover:text-slate-950 focus:outline-none"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer (Sidebar) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-white border-r border-slate-200 z-50 lg:hidden flex flex-col p-6 shadow-xl"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center border border-blue-100">
                    <LayoutDashboard size={18} />
                  </div>
                  <span className="font-bold text-slate-900 text-lg">ALEM Admin</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-500 hover:text-slate-950">
                  <X size={20} />
                </button>
              </div>
              <nav className="flex-grow space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      activeTab === item.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {item.icon} {item.label}
                  </button>
                ))}
              </nav>
              <button
                onClick={() => {
                  setIsLoggedIn(false);
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-all mt-auto"
              >
                <LogOut size={18} /> Sair
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col p-6 fixed h-full z-30">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center border border-blue-100">
            <LayoutDashboard size={18} />
          </div>
          <span className="font-bold text-lg text-slate-900">ALEM Admin</span>
        </div>

        <nav className="flex-grow space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === item.id
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        <button
          onClick={() => setIsLoggedIn(false)}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-all mt-auto"
        >
          <LogOut size={18} /> Sair
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow lg:ml-64 p-4 md:p-8 min-h-screen">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {activeTab === 'projects' ? 'Gestão de Projetos' :
                activeTab === 'volunteers' ? 'Gestão de Voluntários' :
                  activeTab === 'beneficiaries' ? 'Histórias de Beneficiários' :
                    activeTab === 'support' ? 'Pedidos de Apoio' :
                      activeTab === 'partners' ? 'Gestão de Parceiros' :
                        activeTab === 'team' ? 'Gestão da Equipa' :
                          activeTab === 'donations' ? 'Nossos Doadores' : ''}
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {activeTab === 'projects'
                ? `${projects.length} projetos registados`
                : activeTab === 'volunteers'
                  ? `${volunteers.filter(v => v.status === 'Pendente').length} pendentes, ${volunteers.filter(v => v.status === 'Em Analise').length} em análise, ${volunteers.filter(v => v.status === 'Aprovado').length} aprovados`
                  : activeTab === 'beneficiaries'
                    ? `${beneficiaries.length} histórias registadas`
                    : activeTab === 'support'
                      ? `${messages.filter(m => m.status === 'Pendente').length} pendentes, ${messages.filter(m => m.status === 'Em Analise').length} em análise`
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
                onClick={() => exportVolunteersPDF()}
                className="btn-secondary"
              >
                <Download size={18} /> Exportar PDF
              </button>
            )}
            {activeTab !== 'support' && activeTab !== 'donations' && activeTab !== 'beneficiaries' && activeTab !== 'volunteers' && (
              <button
                onClick={() => {
                  if (activeTab === 'projects') {
                    // Reset form for new project
                    setEditingProject(null);
                    projectForm.reset({
                      status: 'Planeamento',
                      media_type: 'image',
                      gallery: [],
                      equipa_responsavel: [],
                    });
                    setIsModalOpen(true);
                  } else if (activeTab === 'partners') {
                    setNewPartner({ name: '', logo_url: '' });
                    setIsPartnerModalOpen(true);
                  } else if (activeTab === 'team') {
                    setEditingTeamMember(null);
                    setNewTeamMember({ name: '', role: '', bio: '', photo_data: '', photo_url: '' });
                    setIsTeamModalOpen(true);
                  }
                }}
                className="btn-primary"
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
          <div className="grid grid-cols-1 gap-4">
            {projects.map((project) => (
              <div key={project.id} className="card-surface p-4 flex flex-col sm:flex-row sm:items-center gap-4 md:gap-6">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                  <img
                    src={project.capa_url || 'https://via.placeholder.com/150?text=Capa'}
                    alt=""
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-1.5">
                    <h3 className="font-bold text-base text-slate-900 truncate">{project.name}</h3>
                    <select
                      value={project.status}
                      onChange={(e) => updateProjectStatus(project.id, e.target.value)}
                      className={statusSelectClasses(project.status)}
                    >
                      <option value="Planeamento">Planeamento</option>
                      <option value="Em Curso">Em Curso</option>
                      <option value="Concluido">Concluido</option>
                    </select>
                  </div>
                  <p className="text-slate-500 text-sm line-clamp-1">{project.objetivos_especificos}</p>
                </div>
                <div className="flex gap-2 self-end sm:self-auto ml-auto">
                  <button
                    onClick={() => openEdit(project)}
                    className="p-2.5 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white rounded-lg transition-all"
                    title="Editar projeto"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="p-2.5 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded-lg transition-all"
                    title="Eliminar projeto"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : activeTab === 'volunteers' ? (
          <div className="space-y-6">
            <div className="card-surface p-5 bg-white">
              <div className="flex flex-wrap items-end gap-4">
                <div className="flex flex-col gap-1 w-full max-w-xs">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Pesquisar</label>
                  <input
                    type="text"
                    value={volunteerSearch}
                    onChange={e => setVolunteerSearch(e.target.value)}
                    placeholder="Nome, email ou data..."
                    className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all w-full"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Leitura</label>
                  <select
                    value={volunteerReadFilter}
                    onChange={e => setVolunteerReadFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all cursor-pointer"
                  >
                    <option value="Todos">Todos</option>
                    <option value="Lidos">Lidos</option>
                    <option value="Nao Lidos">Não Lidos</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Data Início</label>
                  <input
                    type="date"
                    value={volunteerFilterStart}
                    onChange={e => setVolunteerFilterStart(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Data Fim</label>
                  <input
                    type="date"
                    value={volunteerFilterEnd}
                    onChange={e => setVolunteerFilterEnd(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all"
                  />
                </div>
                {(volunteerSearch || volunteerFilterStart || volunteerFilterEnd || volunteerReadFilter !== 'Todos') && (
                  <button
                    onClick={() => { setVolunteerSearch(''); setVolunteerFilterStart(''); setVolunteerFilterEnd(''); setVolunteerReadFilter('Todos'); }}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all"
                  >
                    Limpar
                  </button>
                )}
              </div>
            </div>

            <div className="card-surface bg-white overflow-hidden">
              <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {getFilteredVolunteers().length} registo(s) encontrado(s)
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50/50 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider w-16">Leitura</th>
                      <th className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Nome / Info</th>
                      <th className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Projeto de Interesse</th>
                      <th className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Estado (Aprovação)</th>
                      <th className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Data</th>
                      <th className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right pr-8">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {getFilteredVolunteers().map((vol) => (
                      <tr key={vol.id} className={`hover:bg-slate-50/80 transition-colors group ${vol.read_status !== 'Lido' ? 'bg-blue-50/20' : ''}`}>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => updateVolunteerReadStatus(vol.id, vol.read_status === 'Lido' ? 'Nao Lido' : 'Lido')}
                            className={`p-1.5 rounded-lg transition-all ${vol.read_status === 'Lido' ? 'text-slate-400 hover:text-slate-600 hover:bg-slate-100' : 'text-blue-600 hover:text-blue-700 bg-blue-50/80'}`}
                            title={vol.read_status === 'Lido' ? 'Marcar como Não Lido' : 'Marcar como Lido'}
                          >
                            <Mail size={16} className={vol.read_status !== 'Lido' ? 'fill-current' : ''} />
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`font-semibold text-slate-900 ${vol.read_status !== 'Lido' ? 'font-bold' : ''}`}>{vol.full_name}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{vol.email} • {vol.phone}</div>
                        </td>
                        <td className="px-6 py-4 text-slate-600 text-sm font-medium">
                          {projects.find(p => p.id === vol.project_id)?.name || 'Nenhum'}
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={vol.status}
                            onChange={(e) => updateVolunteerStatus(vol.id, e.target.value)}
                            className={statusSelectClasses(vol.status)}
                          >
                            <option value="Pendente">Pendente</option>
                            <option value="Em Analise">Em Análise</option>
                            <option value="Aprovado">Aprovado</option>
                            <option value="Recusado">Recusado</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                          {vol.created_at ? new Date(vol.created_at).toLocaleDateString('pt-PT') : 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-right pr-8">
                          <div className="inline-flex gap-2">
                            <button
                              onClick={() => openVolunteerEdit(vol)}
                              className="p-2 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white rounded-lg transition-all"
                              title="Visualizar Candidatura"
                            >
                              <Eye size={15} />
                            </button>
                            <button
                              onClick={() => deleteVolunteer(vol.id)}
                              className="p-2 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded-lg transition-all"
                              title="Remover Candidatura"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : activeTab === 'support' ? (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="card-surface p-5 bg-white">
              <div className="flex flex-wrap items-end gap-4">
                <div className="flex flex-col gap-1 w-full max-w-xs">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Pesquisar</label>
                  <input
                    type="text"
                    value={supportSearch}
                    onChange={e => setSupportSearch(e.target.value)}
                    placeholder="Nome, email ou data..."
                    className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all w-full"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Leitura</label>
                  <select
                    value={supportReadFilter}
                    onChange={e => setSupportReadFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all cursor-pointer"
                  >
                    <option value="Todos">Todos</option>
                    <option value="Lidos">Lidos</option>
                    <option value="Nao Lidos">Não Lidos</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Data Início</label>
                  <input
                    type="date"
                    value={supportFilterStart}
                    onChange={e => setSupportFilterStart(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Data Fim</label>
                  <input
                    type="date"
                    value={supportFilterEnd}
                    onChange={e => setSupportFilterEnd(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all"
                  />
                </div>
                {(supportSearch || supportFilterStart || supportFilterEnd || supportReadFilter !== 'Todos') && (
                  <button
                    onClick={() => { setSupportSearch(''); setSupportFilterStart(''); setSupportFilterEnd(''); setSupportReadFilter('Todos'); }}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all"
                  >
                    Limpar
                  </button>
                )}
                <div className="flex gap-2 ml-auto">
                  <button
                    onClick={exportSupportPDF}
                    className="btn-primary py-2.5 px-4 text-xs"
                  >
                    <Download size={16} /> Exportar PDF
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            {(() => {
              const filtered = getFilteredMessages();
              const pendentes = filtered.filter(m => m.status === 'Pendente').length;
              const emAnalise = filtered.filter(m => m.status === 'Em Analise').length;
              const aprovados = filtered.filter(m => m.status === 'Aprovado').length;
              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Pedidos</p>
                      <p className="text-2xl font-bold text-slate-900 mt-1">{filtered.length}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center">
                      <Mail size={18} />
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pendentes</p>
                      <p className="text-2xl font-bold text-amber-600 mt-1">{pendentes}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Calendar size={18} />
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Em Análise</p>
                      <p className="text-2xl font-bold text-blue-600 mt-1">{emAnalise}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Eye size={18} />
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Aprovados</p>
                      <p className="text-2xl font-bold text-emerald-600 mt-1">{aprovados}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <CheckCircle size={18} />
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Table */}
            {(() => {
              const filtered = getFilteredMessages();
              return filtered.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-16 text-center">
                  <Mail size={48} className="text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium">Nenhum pedido de apoio encontrado.</p>
                  <p className="text-slate-400 text-sm mt-1">Os pedidos submetidos no formulário aparecem aqui automaticamente.</p>
                </div>
              ) : (
                <div className="card-surface bg-white overflow-hidden">
                  <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      {filtered.length} registo{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                      {filtered.filter(m => m.read_status !== 'Lido').length} não lido(s)
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr>
                          <th className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider w-16">Leitura</th>
                          <th className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Nome / Info</th>
                          <th className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Tipo de Apoio</th>
                          <th className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Estado</th>
                          <th className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Data Inscrição</th>
                          <th className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right pr-8">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filtered.map((msg, idx) => {
                          const msgDate = msg.created_at ? new Date(msg.created_at) : null;
                          const isValidDate = msgDate && !isNaN(msgDate.getTime());
                          const isUnread = msg.read_status !== 'Lido';
                          return (
                            <tr key={msg.id} className={`hover:bg-slate-50/80 transition-colors group ${isUnread ? 'bg-blue-50/20' : ''}`}>
                              <td className="px-6 py-4">
                                <button
                                  onClick={() => updateMessageReadStatus(msg.id, isUnread ? 'Lido' : 'Nao Lido')}
                                  className={`p-1.5 rounded-lg transition-all ${isUnread ? 'text-blue-600 hover:text-blue-700 bg-blue-50/80' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                                  title={isUnread ? 'Marcar como Lido' : 'Marcar como Não Lido'}
                                >
                                  <Mail size={16} className={isUnread ? 'fill-current' : ''} />
                                </button>
                              </td>
                              <td className="px-6 py-4">
                                <div className={`font-semibold text-slate-900 ${isUnread ? 'font-bold' : ''}`}>{msg.name}</div>
                                <div className="text-xs text-slate-500 mt-0.5">{msg.email} {msg.phone ? '• ' + msg.phone : ''}</div>
                              </td>
                              <td className="px-6 py-4 text-slate-700 font-medium text-sm">{msg.subject}</td>
                              <td className="px-6 py-4">
                                <select
                                  value={msg.status}
                                  onChange={(e) => updateMessageStatus(msg.id, e.target.value)}
                                  className={statusSelectClasses(msg.status)}
                                >
                                  <option value="Pendente">Pendente</option>
                                  <option value="Em Analise">Em Análise</option>
                                  <option value="Aprovado">Aprovado</option>
                                  <option value="Recusado">Recusado</option>
                                </select>
                              </td>
                              <td className="px-6 py-4 font-medium">
                                {isValidDate ? (
                                  <div>
                                    <div className="text-sm font-semibold text-slate-700">
                                      {msgDate.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                    </div>
                                    <div className="text-xs text-slate-400">
                                      {msgDate.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-xs text-slate-400 italic">N/A</span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-right pr-8">
                                <div className="inline-flex gap-2">
                                  <button
                                    onClick={() => openMessage(msg)}
                                    className="p-2 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white rounded-lg transition-all"
                                    title="Ver Detalhes"
                                  >
                                    <Eye size={15} />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm('Eliminar este pedido permanentemente?')) {
                                        deleteMessage(msg.id);
                                      }
                                    }}
                                    className="p-2 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded-lg transition-all"
                                    title="Eliminar Pedido"
                                  >
                                    <Trash2 size={15} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()}
          </div>
        ) : activeTab === 'partners' ? (
          <div className="space-y-6">
            {partners.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-16 text-center">
                <Handshake size={48} className="text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">Nenhum parceiro registado ainda.</p>
                <p className="text-slate-400 text-sm mt-1">Clique em "Novo Parceiro" para adicionar.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {partners.map((partner) => (
                  <div key={partner.id} className="card-surface p-4 flex items-center gap-4 group relative">
                    <div className="w-14 h-14 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 overflow-hidden border border-slate-100">
                      {partner.logo_url ? (
                        <img src={partner.logo_url} alt={partner.name} className="w-full h-full object-contain p-1 filter grayscale hover:grayscale-0 transition-all duration-300" referrerPolicy="no-referrer" />
                      ) : (
                        <Handshake size={20} className="text-slate-450" />
                      )}
                    </div>
                    <div className="flex-grow min-w-0">
                      <h3 className="font-bold text-slate-800 text-sm truncate">{partner.name}</h3>
                      {partner.logo_url && (
                        <p className="text-slate-400 text-[10px] truncate mt-0.5">{partner.logo_url}</p>
                      )}
                    </div>
                    <button
                      onClick={() => deletePartner(partner.id)}
                      className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-600 hover:text-white transition-all shrink-0 ml-auto"
                      title="Remover parceiro"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'team' ? (
          <div className="space-y-6">
            {team.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-16 text-center">
                <UserCircle size={48} className="text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">Nenhum membro da equipa registado ainda.</p>
                <p className="text-slate-400 text-sm mt-1">Clique em "Novo Membro" para adicionar.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {team.map((member) => (
                  <div key={member.id} className="card-surface p-5 flex flex-col items-center group relative text-center">
                    <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <button
                        onClick={() => openEditTeamMember(member)}
                        className="p-2 bg-white/95 text-slate-700 hover:text-white hover:bg-brand-primary rounded-lg transition-all shadow-sm border border-slate-100"
                        title="Editar"
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        onClick={() => deleteTeamMember(member.id)}
                        className="p-2 bg-white/95 text-slate-700 hover:text-white hover:bg-red-600 rounded-lg transition-all shadow-sm border border-slate-100"
                        title="Remover"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-50 mb-3 border-2 border-slate-200/60 shadow-sm flex items-center justify-center shrink-0">
                      {(member.photo_data || member.photo_url) ? (
                        <img src={member.photo_data || member.photo_url} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-350 bg-slate-100">
                          <UserCircle size={36} />
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 text-base mb-0.5">{member.name}</h3>
                    <p className="text-brand-primary font-medium text-xs mb-2.5">{member.role}</p>
                    <p className="text-slate-500 text-xs line-clamp-3 leading-relaxed">{member.bio}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'donations' ? (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="card-surface p-5 bg-white">
              <div className="flex flex-wrap items-end gap-4">
                <div className="flex items-center gap-2 text-slate-700 font-bold text-sm mb-1 sm:mb-0">
                  <Filter size={16} className="text-blue-600" />
                  <span>Filtrar por período</span>
                </div>
                <div className="flex flex-wrap gap-4 flex-1">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Data Início</label>
                    <input
                      type="date"
                      value={donationFilterStart}
                      onChange={e => setDonationFilterStart(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Data Fim</label>
                    <input
                      type="date"
                      value={donationFilterEnd}
                      onChange={e => setDonationFilterEnd(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all"
                    />
                  </div>
                  {(donationFilterStart || donationFilterEnd) && (
                    <button
                      onClick={() => { setDonationFilterStart(''); setDonationFilterEnd(''); }}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all self-end"
                    >
                      Limpar
                    </button>
                  )}
                </div>
                <div className="flex gap-2 ml-auto">
                  <button
                    onClick={fetchData}
                    className="btn-secondary py-2 px-3 text-xs"
                    title="Atualizar lista de doadores"
                  >
                    <TrendingUp size={14} /> Atualizar
                  </button>
                  <button
                    onClick={exportDonationsPDF}
                    className="btn-primary py-2 px-4 text-xs"
                  >
                    <Download size={14} /> Exportar PDF
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            {(() => {
              const filtered = getFilteredDonations();
              const total = filtered.reduce((s, d) => s + (parseFloat(d.valor) || 0), 0);
              const byMethod = { mpesa: 0, transferencia: 0, cartao: 0 };
              filtered.forEach(d => { if (byMethod[d.metodo_pagamento] !== undefined) byMethod[d.metodo_pagamento]++; });
              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Doadores</p>
                      <p className="text-2xl font-bold text-slate-900 mt-1">{filtered.length}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center">
                      <Users size={18} />
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Valor Arrecadado</p>
                      <p className="text-xl font-bold text-emerald-600 mt-1">MT {total.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <TrendingUp size={18} />
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Via M-Pesa</p>
                      <p className="text-2xl font-bold text-rose-600 mt-1">{byMethod.mpesa}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                      <Heart size={18} />
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Transferência</p>
                      <p className="text-2xl font-bold text-green-600 mt-1">{byMethod.transferencia}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                      <Handshake size={18} />
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Donations Table */}
            {(() => {
              const filtered = getFilteredDonations();
              return filtered.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-16 text-center">
                  <Heart size={48} className="text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium">Nenhuma doação encontrada para este período.</p>
                  <p className="text-slate-400 text-sm mt-1">As doações submetidas no formulário aparecem aqui automaticamente.</p>
                </div>
              ) : (
                <div className="card-surface bg-white overflow-hidden">
                  <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      {filtered.length} registo{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Total: <span className="font-bold text-emerald-700">MT {filtered.reduce((s, d) => s + (parseFloat(d.valor) || 0), 0).toLocaleString('pt-PT', { minimumFractionDigits: 2 })}</span>
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr>
                          <th className="px-4 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider w-10 text-center">#</th>
                          <th className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Doador</th>
                          <th className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Telefone</th>
                          <th className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Causa</th>
                          <th className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Valor</th>
                          <th className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Pagamento</th>
                          <th className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Data & Hora</th>
                          <th className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Mensagem</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filtered.map((d, idx) => {
                          const donDate = d.created_at ? new Date(d.created_at) : null;
                          const isValidDate = donDate && !isNaN(donDate.getTime());
                          return (
                            <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="px-4 py-4 text-xs text-slate-400 font-bold text-center">{filtered.length - idx}</td>
                              <td className="px-6 py-4">
                                <div className="font-semibold text-slate-900">{d.nome}</div>
                                <div className="text-xs text-slate-550 mt-0.5">{d.email}</div>
                              </td>
                              <td className="px-6 py-4 text-slate-600 text-sm font-medium">{d.telefone}</td>
                              <td className="px-6 py-4">
                                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded border border-blue-100 whitespace-nowrap">{d.causa}</span>
                              </td>
                              <td className="px-6 py-4 font-bold text-emerald-700 whitespace-nowrap">
                                MT {parseFloat(d.valor || 0).toLocaleString('pt-PT', { minimumFractionDigits: 2 })}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-0.5 text-[10px] font-semibold rounded whitespace-nowrap ${
                                  d.metodo_pagamento === 'mpesa' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                                  d.metodo_pagamento === 'transferencia' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                  'bg-slate-50 text-slate-600 border border-slate-200'
                                }`}>
                                  {d.metodo_pagamento === 'mpesa' ? 'M-Pesa' : d.metodo_pagamento === 'transferencia' ? 'Transferência' : 'Cartão'}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                {isValidDate ? (
                                  <div className="font-medium">
                                    <div className="text-sm text-slate-700">
                                      {donDate.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                    </div>
                                    <div className="text-xs text-slate-400">
                                      {donDate.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-xs text-slate-400 italic">Data não registada</span>
                                )}
                              </td>
                              <td className="px-6 py-4 max-w-[180px]">
                                {d.mensagem ? (
                                  <p className="text-xs text-slate-500 truncate" title={d.mensagem}>{d.mensagem}</p>
                                ) : (
                                  <span className="text-xs text-slate-300">—</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()}
          </div>
        ) : activeTab === 'beneficiaries' ? (
          <div className="space-y-6">
            <div className="card-surface p-4 bg-white flex justify-between items-center flex-wrap gap-4">
              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-xs font-semibold">Total: {beneficiaries.length} Histórias</span>
              </div>
              <button
                onClick={() => {
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
                className="btn-primary py-2.5 px-4 text-xs"
              >
                <Plus size={16} /> Criar História
              </button>
            </div>
            {beneficiaries.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-16 text-center">
                <Heart size={48} className="text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">Nenhuma história de beneficiário registada.</p>
                <p className="text-slate-400 text-sm mt-1">Adicione uma história de superação para inspirar outros doadores.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {beneficiaries.map(story => {
                  const project = projects.find(p => p.id === story.project_id);
                  const storyImage = story.image_data || story.image_url || 'https://via.placeholder.com/300x200?text=Sem+Imagem';
                  return (
                    <div key={story.id} className="card-surface flex flex-col overflow-hidden group">
                      <div className="h-44 w-full bg-slate-50 overflow-hidden relative shrink-0">
                        <img
                          src={storyImage}
                          alt={story.full_name}
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-bold text-blue-600 shadow-sm border border-slate-100">
                          {project ? project.name : 'Geral'}
                        </div>
                      </div>
                      <div className="p-5 flex flex-col flex-grow">
                        <h3 className="font-bold text-slate-800 text-base mb-2">{story.full_name}</h3>
                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-4 flex-grow whitespace-pre-wrap">{story.story}</p>
                        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-100 shrink-0">
                          <button
                            onClick={() => openBeneficiaryEdit(story)}
                            className="flex-grow btn-secondary py-2 text-xs font-bold"
                          >
                            <Pencil size={14} /> Editar
                          </button>
                          <button
                            onClick={() => deleteBeneficiary(story.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-red-100 hover:border-red-200"
                            title="Eliminar História"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : null}
      </main>

      {/* Partner Modal */}
      <AnimatePresence>
        {isPartnerModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsPartnerModalOpen(false); setNewPartner({ name: '', logo_url: '', logo_data: '' }); }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white w-full max-w-md rounded-xl border border-slate-200/60 shadow-xl relative z-10 overflow-hidden"
            >
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-900">Novo Parceiro</h2>
                <button onClick={() => { setIsPartnerModalOpen(false); setNewPartner({ name: '', logo_url: '', logo_data: '' }); }} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={18} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="form-label">Nome do Parceiro *</label>
                  <input
                    value={newPartner.name}
                    onChange={e => setNewPartner(p => ({ ...p, name: e.target.value }))}
                    className="form-input"
                    placeholder="Ex: UNICEF Moçambique"
                  />
                </div>

                <div className="space-y-2.5">
                  <label className="form-label">Logo do Parceiro</label>

                  {/* Upload local */}
                  <div className="relative group cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (file.size > 2 * 1024 * 1024) {
                          alert('Imagem demasiado grande (max 2MB). Use uma imagem menor ou insira apenas o URL.');
                          return;
                        }
                        const reader = new FileReader();
                        reader.onload = ev => setNewPartner(p => ({ ...p, logo_data: ev.target.result, logo_url: '' }));
                        reader.readAsDataURL(file);
                      }}
                    />
                    <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl px-4 py-2.5 flex items-center gap-2.5 hover:border-brand-primary transition-all">
                      <Upload size={16} className="text-slate-400 group-hover:text-brand-primary shrink-0" />
                      <span className="text-xs text-slate-500 font-semibold">
                        {newPartner.logo_data ? '✓ Ficheiro carregado' : 'Carregar do Computador'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <div className="flex-1 h-px bg-slate-100" />
                    <span>ou</span>
                    <div className="flex-1 h-px bg-slate-100" />
                  </div>

                  {/* URL externa */}
                  <input
                    value={newPartner.logo_url}
                    onChange={e => setNewPartner(p => ({ ...p, logo_url: e.target.value, logo_data: '' }))}
                    className="form-input text-xs"
                    placeholder="Colar URL da logo (https://...)"
                  />
                  <p className="text-[10px] text-slate-400">Se não tiver logo, o nome do parceiro será exibido no rodapé.</p>
                </div>

                {/* Preview */}
                {(newPartner.logo_data || newPartner.logo_url) && (
                  <div className="bg-slate-900 rounded-xl p-4 flex items-center gap-3">
                    <img
                      src={newPartner.logo_data || newPartner.logo_url}
                      alt="Preview"
                      className="h-8 max-w-[100px] object-contain filter grayscale brightness-200"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <p className="text-white text-xs font-semibold">{newPartner.name || 'Parceiro'}</p>
                      <p className="text-slate-400 text-[9px] mt-0.5">Pré-visualização no rodapé</p>
                    </div>
                    <button
                      onClick={() => setNewPartner(p => ({ ...p, logo_data: '', logo_url: '' }))}
                      className="ml-auto text-slate-400 hover:text-red-400 transition-colors"
                      title="Remover logo"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                <div className="flex gap-3 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => { setIsPartnerModalOpen(false); setNewPartner({ name: '', logo_url: '', logo_data: '' }); }}
                    className="flex-1 btn-secondary py-2.5 text-xs font-bold"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={addPartner}
                    className="flex-1 btn-primary py-2.5 text-xs font-bold"
                  >
                    <Save size={16} /> Adicionar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Team Modal */}
      <AnimatePresence>
        {isTeamModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTeamModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white w-full max-w-lg rounded-xl border border-slate-200/60 shadow-xl relative z-10 overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-20">
                <h2 className="text-lg font-bold text-slate-900">{editingTeamMember ? 'Editar Membro' : 'Novo Membro da Equipa'}</h2>
                <button onClick={() => setIsTeamModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={18} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="form-label">Nome Completo *</label>
                    <input
                      value={newTeamMember.name}
                      onChange={e => setNewTeamMember(p => ({ ...p, name: e.target.value }))}
                      className="form-input"
                      placeholder="Ex: João Silva"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="form-label">Cargo / Função *</label>
                    <input
                      value={newTeamMember.role}
                      onChange={e => setNewTeamMember(p => ({ ...p, role: e.target.value }))}
                      className="form-input"
                      placeholder="Ex: Psicólogo Clínico"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="form-label">Informações (Biografia)</label>
                  <textarea
                    value={newTeamMember.bio}
                    onChange={e => setNewTeamMember(p => ({ ...p, bio: e.target.value }))}
                    className="form-input min-h-[100px] resize-none leading-relaxed"
                    placeholder="Escreva um breve resumo..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="form-label">Fotografia</label>

                  <div className="flex gap-4 items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="w-16 h-16 rounded-full bg-white shrink-0 overflow-hidden border border-slate-200/80 flex items-center justify-center shadow-sm">
                      {(newTeamMember.photo_data || newTeamMember.photo_url) ? (
                        <img src={newTeamMember.photo_data || newTeamMember.photo_url} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <UserCircle size={28} className="text-slate-400" />
                      )}
                    </div>

                    <div className="flex-grow space-y-2">
                      {/* Upload local */}
                      <div className="relative group cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          onChange={async e => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            if (file.size > 5 * 1024 * 1024) {
                              alert('Imagem demasiado grande (max 5MB). Use uma menor ou insira apenas o URL.');
                              return;
                            }
                            const compressImage = file => new Promise(resolve => {
                              const img = new Image();
                              img.onload = () => {
                                const canvas = document.createElement('canvas');
                                const maxWidth = 800;
                                const scale = Math.min(maxWidth / img.width, 1);
                                canvas.width = img.width * scale;
                                canvas.height = img.height * scale;
                                const ctx = canvas.getContext('2d');
                                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                                resolve(canvas.toDataURL('image/jpeg', 0.6));
                              };
                              img.onerror = () => resolve(null);
                              img.src = URL.createObjectURL(file);
                            });
                            const compressed = await compressImage(file);
                            if (compressed) {
                              setNewTeamMember(p => ({ ...p, photo_data: compressed, photo_url: '' }));
                            } else {
                              const reader = new FileReader();
                              reader.onload = ev => setNewTeamMember(p => ({ ...p, photo_data: ev.target.result, photo_url: '' }));
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        <div className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 flex items-center gap-2 hover:border-brand-primary transition-all">
                          <Upload size={14} className="text-slate-400 group-hover:text-brand-primary shrink-0" />
                          <span className="text-xs text-slate-500 font-semibold">
                            {newTeamMember.photo_data ? '✓ Foto carregada' : 'Carregar do Computador'}
                          </span>
                        </div>
                      </div>

                      {/* URL externa */}
                      <input
                        value={newTeamMember.photo_url}
                        onChange={e => setNewTeamMember(p => ({ ...p, photo_url: e.target.value, photo_data: '' }))}
                        className="form-input text-xs py-1.5"
                        placeholder="Ou colar URL da foto"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => setIsTeamModalOpen(false)}
                    className="flex-grow btn-secondary py-2.5 text-xs font-bold"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={addOrUpdateTeamMember}
                    className="flex-grow btn-primary py-2.5 text-xs font-bold"
                  >
                    <Save size={16} /> Guardar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Message Detail Modal */}
      <AnimatePresence>
        {isMessageModalOpen && selectedMessage && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMessageModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white w-full max-w-2xl rounded-xl border border-slate-200/60 shadow-xl relative z-10 overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-20">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Detalhes do Pedido de Apoio</h2>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Submetido em {selectedMessage.created_at ? new Date(selectedMessage.created_at).toLocaleString('pt-PT') : 'N/A'}
                  </p>
                </div>
                <button onClick={() => setIsMessageModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 space-y-6 overflow-y-auto">
                {/* Status Badges */}
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${
                    selectedMessage.read_status === 'Lido'
                      ? 'bg-slate-100 text-slate-700 border-slate-200'
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}>
                    {selectedMessage.read_status === 'Lido' ? 'Lido' : 'Nao Lido'}
                  </span>
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${
                    selectedMessage.status === 'Aceitado'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : selectedMessage.status === 'Recusado'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    Estado: {selectedMessage.status}
                  </span>
                </div>

                {/* Identification */}
                <div className="bg-slate-50/50 border border-slate-200/60 rounded-xl p-5 space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Identificacao</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="form-label mb-1">Nome Completo</span>
                      <p className="text-sm font-semibold text-slate-900">{selectedMessage?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="form-label mb-1">Genero</span>
                      <p className="text-sm font-semibold text-slate-900">{selectedMessage?.genero || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="form-label mb-1">Data de Nascimento</span>
                      <p className="text-sm font-semibold text-slate-900">
                        {selectedMessage?.data_nascimento ? new Date(selectedMessage.data_nascimento).toLocaleDateString('pt-PT') : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="form-label mb-1">Contacto Telefonico</span>
                      <p className="text-sm font-semibold text-slate-900">{selectedMessage?.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="form-label mb-1">Email</span>
                      <p className="text-sm font-semibold text-slate-900 break-all">{selectedMessage?.email || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="form-label mb-1">Endereco</span>
                      <p className="text-sm font-semibold text-slate-900">{selectedMessage?.endereco || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Support Request */}
                <div className="bg-slate-50/50 border border-slate-200/60 rounded-xl p-5 space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pedido</h3>
                  <div>
                    <span className="form-label mb-1">Tipo de Necessidade / Apoio</span>
                    <p className="text-sm font-semibold text-slate-900">{selectedMessage?.subject || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="form-label mb-1">Mensagem / Descricao</span>
                    <div className="bg-white border border-slate-200/60 rounded-xl p-4 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap min-h-[100px]">
                      {selectedMessage?.message || 'N/A'}
                    </div>
                  </div>
                </div>

                {/* Status Controls */}
                <div className="bg-slate-50/50 border border-slate-200/60 rounded-xl p-5 space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gerir Estado</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label mb-1.5">Estado do Registo</label>
                      <select
                        value={selectedMessage.status}
                        onChange={(e) => {
                          updateMessageStatus(selectedMessage.id, e.target.value);
                          setSelectedMessage(m => ({ ...m, status: e.target.value }));
                        }}
                        className="form-input py-2 text-xs font-semibold"
                      >
                        <option value="Novo">Novo</option>
                        <option value="Aceitado">Aceitado</option>
                        <option value="Recusado">Recusado</option>
                      </select>
                    </div>
                    <div className="flex flex-col justify-end">
                      <label className="form-label mb-1.5">Marcar Leitura</label>
                      <button
                        onClick={() => {
                          const newStatus = selectedMessage.read_status === 'Lido' ? 'Nao Lido' : 'Lido';
                          updateMessageReadStatus(selectedMessage.id, newStatus);
                          setSelectedMessage(m => ({ ...m, read_status: newStatus }));
                        }}
                        className={`w-full py-2.5 rounded-xl font-semibold text-xs transition-all duration-200 ${
                          selectedMessage.read_status === 'Lido'
                            ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/60'
                            : 'bg-brand-primary text-white hover:bg-brand-primary-hover shadow-sm'
                        }`}
                      >
                        {selectedMessage.read_status === 'Lido' ? 'Marcar como Nao Lido' : 'Marcar como Lido'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setIsMessageModalOpen(false);
                    setEditingBeneficiary(null);
                    beneficiaryForm.reset({
                      full_name: selectedMessage.name,
                      story: `Fez um pedido de apoio com o assunto "${selectedMessage.subject}".\n\nMensagem:\n${selectedMessage.message}`,
                      project_id: '',
                      image_url: '',
                      image_data: ''
                    });
                    setIsBeneficiaryModalOpen(true);
                    updateMessageStatus(selectedMessage.id, 'Aceitado');
                  }}
                  className="flex-grow btn-primary py-2.5 text-xs font-bold"
                >
                  <Plus size={16} /> Registar como Beneficiario
                </button>
                <button
                  onClick={() => {
                    if (confirm('Tem a certeza que deseja recusar este pedido e remove-lo do sistema?')) {
                      deleteMessage(selectedMessage.id);
                      setIsMessageModalOpen(false);
                    }
                  }}
                  className="flex-grow btn-ghost border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 py-2.5 text-xs font-bold"
                >
                  <Trash2 size={16} /> Recusar e Remover
                </button>
                <button
                  onClick={() => setIsMessageModalOpen(false)}
                  className="sm:w-28 btn-secondary py-2.5 text-xs font-bold"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Project Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white w-full max-w-2xl rounded-xl border border-slate-200/60 shadow-xl relative z-10 overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-20">
                <h2 className="text-lg font-bold text-slate-900">
                  {editingProject ? 'Editar Projeto' : 'Novo Projeto'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={18} />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={projectForm.handleSubmit(onProjectSubmit)} className="p-6 space-y-5 overflow-y-auto flex-grow">
                <div className="space-y-1">
                  <label className="form-label">Nome do projeto</label>
                  <input
                    {...projectForm.register('name')}
                    className="form-input"
                    placeholder="Nome do projeto..."
                  />
                  {projectForm.formState.errors.name && <p className="text-red-500 text-xs mt-1">{projectForm.formState.errors.name.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="form-label">Objetivos Especificos</label>
                  <textarea
                    {...projectForm.register('objetivos_especificos')}
                    rows={4}
                    className="form-input resize-y min-h-[100px] leading-relaxed"
                    placeholder="Detalhes dos objetivos..."
                  />
                  {projectForm.formState.errors.objetivos_especificos && <p className="text-red-500 text-xs mt-1">{projectForm.formState.errors.objetivos_especificos.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="form-label">Equipa Responsavel</label>
                  <div className="relative group cursor-pointer border border-slate-200 rounded-xl bg-slate-50 max-h-32 overflow-y-auto p-3.5 custom-scrollbar">
                    {team.length === 0 ? (
                      <p className="text-xs text-slate-400">Nenhum membro registado. Adicione na aba Equipa.</p>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {team.map(member => (
                          <label key={member.id} className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              value={member.id}
                              {...projectForm.register('equipa_responsavel')}
                              className="w-4 h-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary cursor-pointer"
                            />
                            <span className="text-xs font-semibold text-slate-700">{member.name} ({member.role})</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                  {projectForm.formState.errors.equipa_responsavel && (
                    <p className="text-red-500 text-xs mt-1">{projectForm.formState.errors.equipa_responsavel.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="form-label">Estado</label>
                  <select
                    {...projectForm.register('status')}
                    className="form-input cursor-pointer font-semibold text-slate-900"
                  >
                    <option value="Planeamento">Planeamento</option>
                    <option value="Em Curso">Em Curso</option>
                    <option value="Concluido">Concluido</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="form-label">Capa do Projeto (Imagem)</label>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setSelectedFile(file);
                            setUploadPreview(URL.createObjectURL(file));
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-5 flex flex-col items-center justify-center gap-2 group-hover:border-brand-primary group-hover:bg-slate-100/50 transition-all">
                        <Upload className="text-slate-400 group-hover:text-brand-primary" size={20} />
                        <span className="text-xs font-semibold text-slate-500 text-center">
                          {selectedFile ? selectedFile.name : 'Escolher Ficheiro'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <input
                        {...projectForm.register('capa_url')}
                        className="form-input"
                        placeholder="Ou colar URL da imagem..."
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
                    <div className="mt-3 rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-50 relative max-w-sm mx-auto shadow-sm">
                      <img src={uploadPreview} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <button
                        type="button"
                        onClick={() => { setSelectedFile(null); setUploadPreview(null); projectForm.setValue('capa_url', ''); }}
                        className="absolute top-2 right-2 bg-rose-500 text-white p-1.5 rounded-full shadow hover:bg-rose-600 transition-all duration-200"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <label className="form-label text-brand-primary">Imagens ou videos do projeto</label>
                  <div className="space-y-3">
                    {galleryFields.map((field, index) => (
                      <div key={field.id} className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/60 space-y-3 relative">
                        <button
                          type="button"
                          onClick={() => removeGallery(index)}
                          className="absolute top-2 right-2 text-slate-400 hover:text-rose-500 transition-colors"
                        >
                          <X size={14} />
                        </button>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Tipo</label>
                            <select
                              {...projectForm.register(`gallery.${index}.type`)}
                              className="form-input py-1.5 px-3 text-xs font-semibold cursor-pointer"
                            >
                              <option value="image">Imagem</option>
                              <option value="video">Video</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">URL / Link</label>
                            <input
                              {...projectForm.register(`gallery.${index}.url`)}
                              className="form-input py-1.5 px-3 text-xs"
                              placeholder="URL da imagem ou video"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Descricao (Opcional)</label>
                          <input
                            {...projectForm.register(`gallery.${index}.description`)}
                            className="form-input py-1.5 px-3 text-xs"
                            placeholder="Legenda da media..."
                          />
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => appendGallery({ type: 'image', url: '', description: '' })}
                      className="w-full py-2.5 border border-dashed border-slate-300 rounded-xl text-slate-500 hover:text-brand-primary hover:border-brand-primary hover:bg-slate-50 transition-all flex items-center justify-center gap-2 font-semibold text-xs"
                    >
                      <Plus size={16} /> Adicionar imagem ou video do projeto
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
                        className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                      >
                        {isGalleryUploading ? <Loader2 className="animate-spin" size={14} /> : <Upload size={14} />}
                        Carregar Multiplos Ficheiros (Imagens/Videos)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 border-t border-slate-100 flex gap-3">
                  <button
                    type="button"
                    onClick={() => { setIsModalOpen(false); setSelectedFile(null); setUploadPreview(null); }}
                    className="flex-1 btn-secondary py-2.5 text-xs font-bold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="flex-1 btn-primary py-2.5 text-xs font-bold"
                  >
                    {isUploading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                    {editingProject ? 'Guardar Alteracoes' : 'Criar Projeto'}
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
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white w-full max-w-2xl rounded-xl border border-slate-200/60 shadow-xl relative z-10 overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-20">
                <h2 className="text-lg font-bold text-slate-900">
                  Detalhes da Candidatura
                </h2>
                <button onClick={() => setIsVolunteerModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 space-y-6 overflow-y-auto flex-grow">
                {/* Identification */}
                <div className="bg-slate-50/50 border border-slate-200/60 rounded-xl p-5 space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Identificacao do Voluntario</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="form-label mb-1">Nome Completo</span>
                      <p className="text-sm font-semibold text-slate-900">{editingVolunteer?.full_name}</p>
                    </div>
                    <div>
                      <span className="form-label mb-1">Genero</span>
                      <p className="text-sm font-semibold text-slate-900">{editingVolunteer?.genero || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="form-label mb-1">Email</span>
                      <p className="text-sm font-semibold text-slate-900 break-all">{editingVolunteer?.email}</p>
                    </div>
                    <div>
                      <span className="form-label mb-1">Telefone</span>
                      <p className="text-sm font-semibold text-slate-900">{editingVolunteer?.phone}</p>
                    </div>
                    <div className="md:col-span-2">
                      <span className="form-label mb-1">Endereco</span>
                      <p className="text-sm font-semibold text-slate-900">{editingVolunteer?.endereco || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Application Details */}
                <div className="bg-slate-50/50 border border-slate-200/60 rounded-xl p-5 space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Candidatura</h3>
                  <div>
                    <span className="form-label mb-1">Area de Interesse</span>
                    <p className="text-sm font-semibold text-slate-900">{editingVolunteer?.area_interesse || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="form-label mb-1">Mensagem/Observacoes do Voluntario</span>
                    <div className="bg-white border border-slate-200/60 rounded-xl p-4 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap min-h-[100px]">
                      {editingVolunteer?.message || 'Nenhuma mensagem.'}
                    </div>
                  </div>
                </div>

                {/* Manage Status */}
                <div className="bg-slate-50/50 border border-slate-200/60 rounded-xl p-5 space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gerir Estado</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label mb-1.5">Estado da Candidatura</label>
                      <select
                        value={editingVolunteer?.status}
                        onChange={(e) => {
                          updateVolunteerStatus(editingVolunteer.id, e.target.value);
                          setEditingVolunteer({ ...editingVolunteer, status: e.target.value });
                        }}
                        className="form-input py-2 text-xs font-semibold"
                      >
                        <option value="Pendente">Pendente</option>
                        <option value="Aprovado">Aprovado</option>
                        <option value="Recusado">Recusado</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label mb-1.5">Estado de Leitura</label>
                      <select
                        value={editingVolunteer?.read_status}
                        onChange={(e) => {
                          updateVolunteerReadStatus(editingVolunteer.id, e.target.value);
                          setEditingVolunteer({ ...editingVolunteer, read_status: e.target.value });
                        }}
                        className="form-input py-2 text-xs font-semibold"
                      >
                        <option value="Lido">Lido</option>
                        <option value="Nao Lido">Nao Lido</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setIsVolunteerModalOpen(false)}
                  className="sm:w-28 btn-secondary py-2.5 text-xs font-bold"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>



      {/* Beneficiary Modal */}
      <AnimatePresence>
        {isBeneficiaryModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBeneficiaryModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white w-full max-w-2xl rounded-xl border border-slate-200/60 shadow-xl relative z-10 overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-20">
                <h2 className="text-lg font-bold text-slate-900">
                  {editingBeneficiary ? 'Editar Historia de Beneficiario' : 'Registar Historia de Beneficiario'}
                </h2>
                <button onClick={() => setIsBeneficiaryModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={18} />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={beneficiaryForm.handleSubmit(onBeneficiarySubmit)} className="p-6 space-y-5 overflow-y-auto flex-grow">
                <div className="space-y-1">
                  <label className="form-label">Nome do Beneficiario *</label>
                  <input
                    {...beneficiaryForm.register('full_name')}
                    className="form-input"
                    placeholder="Nome completo do beneficiario"
                  />
                  {beneficiaryForm.formState.errors.full_name && <p className="text-red-500 text-xs mt-1">{beneficiaryForm.formState.errors.full_name.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="form-label">Projeto de Intervencao *</label>
                  <select
                    {...beneficiaryForm.register('project_id')}
                    className="form-input cursor-pointer font-semibold text-slate-900"
                  >
                    <option value="">Selecione um projeto...</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  {beneficiaryForm.formState.errors.project_id && <p className="text-red-500 text-xs mt-1">{beneficiaryForm.formState.errors.project_id.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="form-label">Historia de Superacao / Impacto *</label>
                  <textarea
                    {...beneficiaryForm.register('story')}
                    rows={6}
                    className="form-input resize-y min-h-[120px] leading-relaxed"
                    placeholder="Descreva a historia do beneficiario, o apoio recebido e o impacto gerado..."
                  />
                  {beneficiaryForm.formState.errors.story && <p className="text-red-500 text-xs mt-1">{beneficiaryForm.formState.errors.story.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="form-label">Imagem Ilustrativa</label>
                  <div className="flex items-center gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-200/60">
                    <div className="w-16 h-16 rounded-xl border border-slate-200 overflow-hidden bg-slate-100 shrink-0 flex items-center justify-center">
                      {(beneficiaryForm.watch('image_data') || beneficiaryForm.watch('image_url')) ? (
                        <img src={beneficiaryForm.watch('image_data') || beneficiaryForm.watch('image_url')} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon size={24} className="text-slate-400" />
                      )}
                    </div>

                    <div className="flex-grow space-y-2.5">
                      {/* Upload local */}
                      <div className="relative group cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          onChange={async e => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            if (file.size > 5 * 1024 * 1024) {
                              alert('Imagem demasiado grande (max 5MB). Use uma menor.');
                              return;
                            }
                            const compressImage = file => new Promise(resolve => {
                              const img = new Image();
                              img.onload = () => {
                                const canvas = document.createElement('canvas');
                                const maxWidth = 800;
                                const scale = Math.min(maxWidth / img.width, 1);
                                canvas.width = img.width * scale;
                                canvas.height = img.height * scale;
                                const ctx = canvas.getContext('2d');
                                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                                const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
                                resolve(dataUrl);
                              };
                              img.onerror = () => resolve(null);
                              img.src = URL.createObjectURL(file);
                            });
                            const compressed = await compressImage(file);
                            if (compressed) {
                              beneficiaryForm.setValue('image_data', compressed);
                              beneficiaryForm.setValue('image_url', '');
                            } else {
                              const reader = new FileReader();
                              reader.onload = ev => {
                                beneficiaryForm.setValue('image_data', ev.target.result);
                                beneficiaryForm.setValue('image_url', '');
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 flex items-center gap-2 group-hover:border-brand-primary transition-all">
                          <Upload size={14} className="text-slate-400 group-hover:text-brand-primary shrink-0" />
                          <span className="text-xs text-slate-500 font-semibold">
                            {beneficiaryForm.watch('image_data') ? '✓ Imagem carregada' : 'Carregar do Computador'}
                          </span>
                        </div>
                      </div>

                      {/* URL externa */}
                      <input
                        {...beneficiaryForm.register('image_url')}
                        className="form-input text-xs py-1.5"
                        placeholder="Ou colar URL externa da imagem"
                        onChange={e => {
                          if (e.target.value) {
                            beneficiaryForm.setValue('image_data', '');
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 border-t border-slate-100 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsBeneficiaryModalOpen(false)}
                    className="flex-1 btn-secondary py-2.5 text-xs font-bold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary py-2.5 text-xs font-bold"
                  >
                    <Save size={16} /> Guardar Historia
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
