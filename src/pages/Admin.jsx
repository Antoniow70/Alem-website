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
  TrendingUp
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
            <h1 className="text-3xl font-bold text-[#14213D]">Admin ALEM</h1>
            <p className="text-slate-500">Acesso restrito a equipa de gestao</p>
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
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'projects' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
          >
            <FolderKanban size={18} /> Projetos
          </button>
          <button
            onClick={() => setActiveTab('volunteers')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'volunteers' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
          >
            <Users size={18} /> Voluntarios
          </button>
          <button
            onClick={() => setActiveTab('support')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'support' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
          >
            <Mail size={18} /> Pedidos de Apoio
          </button>

          <button
            onClick={() => setActiveTab('beneficiaries')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'beneficiaries' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
          >
            <Heart size={18} /> Historias
          </button>

          <button
            onClick={() => setActiveTab('partners')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'partners' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
          >
            <Handshake size={18} /> Parceiros
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'team' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
          >
            <UserCircle size={18} /> Equipa
          </button>
          <button
            onClick={() => setActiveTab('donations')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'donations' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
          >
            <Heart size={18} /> Nossos Doadores
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
            <h1 className="text-3xl font-bold text-[#14213D]">
              {activeTab === 'projects' ? 'Gestao de Projetos' :
                activeTab === 'volunteers' ? 'Gestao de Voluntarios' :
                  activeTab === 'beneficiaries' ? 'Historias de Beneficiarios' :
                    activeTab === 'support' ? 'Pedidos de Apoio' :
                      activeTab === 'partners' ? 'Gestao de Parceiros' :
                        activeTab === 'team' ? 'Gestao da Equipa' :
                          activeTab === 'donations' ? 'Nossos Doadores' : ''}
            </h1>
            <p className="text-slate-500">
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
          <div className="flex gap-3">
            {activeTab === 'volunteers' && (
              <button
                onClick={() => exportVolunteersPDF()}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all"
              >
                <Download size={20} /> Exportar PDF
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
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg transition-all"
              >
                <Plus size={20} /> {activeTab === 'projects' ? 'Novo Projeto' : activeTab === 'partners' ? 'Novo Parceiro' : 'Novo Membro'}
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
                    src={project.capa_url || 'https://via.placeholder.com/150?text=Capa'}
                    alt=""
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-lg text-[#14213D]">{project.name}</h3>
                    <select
                      value={project.status}
                      onChange={(e) => updateProjectStatus(project.id, e.target.value)}
                      className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md border-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all bg-green-100 text-green-700 hover:bg-green-200"
                    >
                      <option value="Planeamento">Planeamento</option>
                      <option value="Em Curso">Em Curso</option>
                      <option value="Concluido">Concluido</option>
                    </select>
                  </div>
                  <p className="text-slate-500 text-sm line-clamp-1">{project.objetivos_especificos}</p>
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
          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
              <div className="flex flex-wrap items-end gap-4">
                <div className="flex flex-col gap-1 w-full max-w-xs">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Pesquisar</label>
                  <input
                    type="text"
                    value={volunteerSearch}
                    onChange={e => setVolunteerSearch(e.target.value)}
                    placeholder="Nome, email ou data..."
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Leitura</label>
                  <select
                    value={volunteerReadFilter}
                    onChange={e => setVolunteerReadFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Todos">Todos</option>
                    <option value="Lidos">Lidos</option>
                    <option value="Nao Lidos">Nao Lidos</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Data Inicio</label>
                  <input
                    type="date"
                    value={volunteerFilterStart}
                    onChange={e => setVolunteerFilterStart(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Data Fim</label>
                  <input
                    type="date"
                    value={volunteerFilterEnd}
                    onChange={e => setVolunteerFilterEnd(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {(volunteerSearch || volunteerFilterStart || volunteerFilterEnd || volunteerReadFilter !== 'Todos') && (
                  <button
                    onClick={() => { setVolunteerSearch(''); setVolunteerFilterStart(''); setVolunteerFilterEnd(''); setVolunteerReadFilter('Todos'); }}
                    className="px-4 py-2 text-sm text-slate-500 hover:text-slate-800 border border-slate-200 rounded-xl transition-all"
                  >
                    Limpar
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  {getFilteredVolunteers().length} registo(s) encontrado(s)
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Leitura</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Nome / Info</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Projeto de Interesse</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Estado (Aprovacao)</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Data</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Acoes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {getFilteredVolunteers().map((vol) => (
                      <tr key={vol.id} className={`hover:bg-slate-50 transition-colors group ${vol.read_status !== 'Lido' ? 'bg-blue-50/40' : ''}`}>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => updateVolunteerReadStatus(vol.id, vol.read_status === 'Lido' ? 'Nao Lido' : 'Lido')}
                            className={`p-2 rounded-full transition-all ${vol.read_status === 'Lido' ? 'text-slate-400 hover:text-slate-600' : 'text-blue-500 hover:text-blue-700 bg-blue-50'}`}
                            title={vol.read_status === 'Lido' ? 'Marcar como Nao Lido' : 'Marcar como Lido'}
                          >
                            <Mail size={16} className={vol.read_status !== 'Lido' ? 'fill-current' : ''} />
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`font-bold text-[#14213D] ${vol.read_status !== 'Lido' ? 'font-black' : ''}`}>{vol.full_name}</div>
                          <div className="text-xs text-slate-500">{vol.email} • {vol.phone}</div>
                        </td>
                        <td className="px-6 py-4 text-slate-600 text-sm">
                          {projects.find(p => p.id === vol.project_id)?.name || 'Nenhum'}
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={vol.status}
                            onChange={(e) => updateVolunteerStatus(vol.id, e.target.value)}
                            className={`px-2 py-1 text-[10px] font-bold uppercase rounded-md border-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all ${vol.status === 'Pendente' ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' :
                              vol.status === 'Em Analise' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' :
                              vol.status === 'Aprovado' ? 'bg-green-100 text-green-700 hover:bg-green-200' :
                                'bg-red-100 text-red-700 hover:bg-red-200'
                              }`}
                          >
                            <option value="Pendente">Pendente</option>
                            <option value="Em Analise">Em Analise</option>
                            <option value="Aprovado">Aprovado</option>
                            <option value="Recusado">Recusado</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500">
                          {vol.created_at ? new Date(vol.created_at).toLocaleDateString('pt-PT') : 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openVolunteerEdit(vol)}
                              className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                              title="Visualizar Candidatura"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => deleteVolunteer(vol.id)}
                              className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                              title="Remover Candidatura"
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
            </div>
          </div>
        ) : activeTab === 'support' ? (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
              <div className="flex flex-wrap items-end gap-4">
                <div className="flex flex-col gap-1 w-full max-w-xs">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Pesquisar</label>
                  <input
                    type="text"
                    value={supportSearch}
                    onChange={e => setSupportSearch(e.target.value)}
                    placeholder="Nome, email ou data..."
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Leitura</label>
                  <select
                    value={supportReadFilter}
                    onChange={e => setSupportReadFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Todos">Todos</option>
                    <option value="Lidos">Lidos</option>
                    <option value="Nao Lidos">Nao Lidos</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Data Inicio</label>
                  <input
                    type="date"
                    value={supportFilterStart}
                    onChange={e => setSupportFilterStart(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Data Fim</label>
                  <input
                    type="date"
                    value={supportFilterEnd}
                    onChange={e => setSupportFilterEnd(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {(supportSearch || supportFilterStart || supportFilterEnd || supportReadFilter !== 'Todos') && (
                  <button
                    onClick={() => { setSupportSearch(''); setSupportFilterStart(''); setSupportFilterEnd(''); setSupportReadFilter('Todos'); }}
                    className="self-end px-4 py-2 text-sm text-slate-500 hover:text-slate-800 border border-slate-200 rounded-xl transition-all"
                  >
                    Limpar
                  </button>
                )}
                <div className="flex gap-2 ml-auto">
                  <button
                    onClick={exportSupportPDF}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-2xl font-bold flex items-center gap-2 shadow-lg transition-all"
                  >
                    <Download size={18} /> Exportar PDF
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total Pedidos</p>
                    <p className="text-3xl font-bold text-[#14213D]">{filtered.length}</p>
                  </div>
                  <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl shadow-lg p-6">
                    <p className="text-xs font-bold text-amber-200 uppercase tracking-widest mb-2">Pendentes</p>
                    <p className="text-3xl font-bold text-white">{pendentes}</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl shadow-lg p-6">
                    <p className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-2">Em Analise</p>
                    <p className="text-3xl font-bold text-white">{emAnalise}</p>
                  </div>
                  <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Aprovados</p>
                    <p className="text-3xl font-bold text-green-600">{aprovados}</p>
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
                  <p className="text-slate-400 text-sm mt-1">Os pedidos submetidos no formulario aparecem aqui automaticamente.</p>
                </div>
              ) : (
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                      {filtered.length} registo{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
                    </span>
                    <span className="text-xs text-slate-400">
                      {filtered.filter(m => m.read_status !== 'Lido').length} nao lido(s)
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[900px]">
                      <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Leitura</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Nome / Info</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Tipo de Apoio</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Estado</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Data Inscricao</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Acoes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filtered.map((msg, idx) => {
                          const msgDate = msg.created_at ? new Date(msg.created_at) : null;
                          const isValidDate = msgDate && !isNaN(msgDate.getTime());
                          const isUnread = msg.read_status !== 'Lido';
                          return (
                            <tr key={msg.id} className={`hover:bg-slate-50/80 transition-colors group ${isUnread ? 'bg-blue-50/40' : ''}`}>
                              <td className="px-6 py-4">
                                <button
                                  onClick={() => updateMessageReadStatus(msg.id, isUnread ? 'Lido' : 'Nao Lido')}
                                  className={`p-2 rounded-full transition-all ${isUnread ? 'text-blue-500 hover:text-blue-700 bg-blue-50' : 'text-slate-400 hover:text-slate-600'}`}
                                  title={isUnread ? 'Marcar como Lido' : 'Marcar como Nao Lido'}
                                >
                                  <Mail size={16} className={isUnread ? 'fill-current' : ''} />
                                </button>
                              </td>
                              <td className="px-6 py-4">
                                <div className={`font-bold text-[#14213D] ${isUnread ? 'font-black' : ''}`}>{msg.name}</div>
                                <div className="text-xs text-slate-500">{msg.email} {msg.phone ? '• ' + msg.phone : ''}</div>
                              </td>
                              <td className="px-6 py-4 text-slate-700 font-medium text-sm">{msg.subject}</td>
                              <td className="px-6 py-4">
                                <select
                                  value={msg.status}
                                  onChange={(e) => updateMessageStatus(msg.id, e.target.value)}
                                  className={`px-2 py-1 text-[10px] font-bold uppercase rounded-md border-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all ${
                                    msg.status === 'Pendente' ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 
                                    msg.status === 'Em Analise' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' :
                                    msg.status === 'Aprovado' ? 'bg-green-100 text-green-700 hover:bg-green-200' :
                                    'bg-red-100 text-red-700 hover:bg-red-200'
                                  }`}
                                >
                                  <option value="Pendente">Pendente</option>
                                  <option value="Em Analise">Em Analise</option>
                                  <option value="Aprovado">Aprovado</option>
                                  <option value="Recusado">Recusado</option>
                                </select>
                              </td>
                              <td className="px-6 py-4">
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
                              <td className="px-6 py-4">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => openMessage(msg)}
                                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                                    title="Ver Detalhes"
                                  >
                                    <Eye size={16} />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm('Eliminar este pedido permanentemente?')) {
                                        deleteMessage(msg.id);
                                      }
                                    }}
                                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                                    title="Eliminar Pedido"
                                  >
                                    <Trash2 size={16} />
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
                  <div key={partner.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 group">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 overflow-hidden border border-slate-100">
                      {partner.logo_url ? (
                        <img src={partner.logo_url} alt={partner.name} className="w-full h-full object-contain p-1" referrerPolicy="no-referrer" />
                      ) : (
                        <Handshake size={24} className="text-slate-400" />
                      )}
                    </div>
                    <div className="flex-grow min-w-0">
                      <h3 className="font-bold text-[#14213D] truncate">{partner.name}</h3>
                      {partner.logo_url && (
                        <p className="text-slate-400 text-xs truncate mt-0.5">{partner.logo_url}</p>
                      )}
                    </div>
                    <button
                      onClick={() => deletePartner(partner.id)}
                      className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all opacity-0 group-hover:opacity-100 shrink-0"
                      title="Remover parceiro"
                    >
                      <Trash2 size={16} />
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {team.map((member) => (
                  <div key={member.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center group relative text-center">
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditTeamMember(member)}
                        className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                        title="Editar"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => deleteTeamMember(member.id)}
                        className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                        title="Remover"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-100 mb-4 border-4 border-white shadow-lg">
                      {(member.photo_data || member.photo_url) ? (
                        <img src={member.photo_data || member.photo_url} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <UserCircle size={48} />
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-[#14213D] text-lg mb-1">{member.name}</h3>
                    <p className="text-blue-600 font-medium text-sm mb-3">{member.role}</p>
                    <p className="text-slate-500 text-xs line-clamp-3">{member.bio}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'donations' ? (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
              <div className="flex flex-wrap items-end gap-4">
                <div className="flex items-center gap-2 text-slate-700 font-bold">
                  <Filter size={18} className="text-blue-600" />
                  <span>Filtrar por periodo</span>
                </div>
                <div className="flex flex-wrap gap-4 flex-1">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Data Inicio</label>
                    <input
                      type="date"
                      value={donationFilterStart}
                      onChange={e => setDonationFilterStart(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Data Fim</label>
                    <input
                      type="date"
                      value={donationFilterEnd}
                      onChange={e => setDonationFilterEnd(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {(donationFilterStart || donationFilterEnd) && (
                    <button
                      onClick={() => { setDonationFilterStart(''); setDonationFilterEnd(''); }}
                      className="self-end px-4 py-2 text-sm text-slate-500 hover:text-slate-800 border border-slate-200 rounded-xl transition-all"
                    >
                      Limpar
                    </button>
                  )}
                </div>
                <div className="flex gap-2 ml-auto">
                  <button
                    onClick={fetchDonations}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-2xl font-bold flex items-center gap-2 transition-all"
                    title="Atualizar lista de doadores"
                  >
                    <TrendingUp size={16} /> Atualizar
                  </button>
                  <button
                    onClick={exportDonationsPDF}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-2xl font-bold flex items-center gap-2 shadow-lg transition-all"
                  >
                    <Download size={18} /> Descarregar PDF
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
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total Doadores</p>
                    <p className="text-3xl font-bold text-[#14213D]">{filtered.length}</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl shadow-lg p-6">
                    <p className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-2">Valor Arrecadado</p>
                    <p className="text-2xl font-bold text-white">MT {total.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Via M-Pesa</p>
                    <p className="text-3xl font-bold text-red-500">{byMethod.mpesa}</p>
                  </div>
                  <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Transferencia</p>
                    <p className="text-3xl font-bold text-green-600">{byMethod.transferencia}</p>
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
                  <p className="text-slate-500 font-medium">Nenhuma doacao encontrada para este periodo.</p>
                  <p className="text-slate-400 text-sm mt-1">As doacoes submetidas no formulario aparecem aqui automaticamente. Clique em "Atualizar" apos uma nova doacao ser feita.</p>
                </div>
              ) : (
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                      {filtered.length} registo{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
                    </span>
                    <span className="text-xs text-slate-400">
                      Total: <span className="font-bold text-green-700">MT {filtered.reduce((s, d) => s + (parseFloat(d.valor) || 0), 0).toLocaleString('pt-PT', { minimumFractionDigits: 2 })}</span>
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                      <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                          <th className="px-4 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest w-10">#</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Doador</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Telefone</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Causa</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Valor</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Pagamento</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Data & Hora</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Mensagem</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filtered.map((d, idx) => {
                          const donDate = d.created_at ? new Date(d.created_at) : null;
                          const isValidDate = donDate && !isNaN(donDate.getTime());
                          return (
                            <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="px-4 py-4 text-xs text-slate-400 font-bold">{filtered.length - idx}</td>
                              <td className="px-6 py-4">
                                <div className="font-bold text-[#14213D]">{d.nome}</div>
                                <div className="text-xs text-slate-400">{d.email}</div>
                              </td>
                              <td className="px-6 py-4 text-slate-600 text-sm">{d.telefone}</td>
                              <td className="px-6 py-4">
                                <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg whitespace-nowrap">{d.causa}</span>
                              </td>
                              <td className="px-6 py-4 font-bold text-green-700 whitespace-nowrap">
                                MT {parseFloat(d.valor || 0).toLocaleString('pt-PT', { minimumFractionDigits: 2 })}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-md whitespace-nowrap ${d.metodo_pagamento === 'mpesa' ? 'bg-red-100 text-red-700' :
                                    d.metodo_pagamento === 'transferencia' ? 'bg-green-100 text-green-700' :
                                      'bg-slate-100 text-slate-700'
                                  }`}>
                                  {d.metodo_pagamento === 'mpesa' ? 'M-Pesa' : d.metodo_pagamento === 'transferencia' ? 'Transferencia' : 'Cartao'}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                {isValidDate ? (
                                  <div>
                                    <div className="text-sm font-semibold text-slate-700">
                                      {donDate.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                    </div>
                                    <div className="text-xs text-slate-400">
                                      {donDate.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-xs text-slate-400 italic">Data nao registada</span>
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
            <div className="flex justify-between items-center bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex-wrap gap-4">
              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-bold">Total: {beneficiaries.length} Historias</span>
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
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-2xl font-bold flex items-center gap-2 shadow-lg transition-all"
              >
                <Plus size={18} /> Criar Historia
              </button>
            </div>
            {beneficiaries.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-16 text-center">
                <Heart size={48} className="text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">Nenhuma historia de beneficiario registada.</p>
                <p className="text-slate-400 text-sm mt-1">Adicione uma historia de superacao para inspirar outros doadores.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {beneficiaries.map(story => {
                  const project = projects.find(p => p.id === story.project_id);
                  const storyImage = story.image_data || story.image_url || 'https://via.placeholder.com/300x200?text=Sem+Imagem';
                  return (
                    <div key={story.id} className="bg-white rounded-[32px] shadow-lg shadow-slate-200/50 border border-slate-100 flex flex-col overflow-hidden group">
                      <div className="h-48 w-full bg-slate-100 overflow-hidden relative shrink-0">
                        <img
                          src={storyImage}
                          alt={story.full_name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-blue-600 shadow-sm border border-slate-100">
                          {project ? project.name : 'Geral'}
                        </div>
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <h3 className="font-bold text-[#14213D] text-lg mb-2">{story.full_name}</h3>
                        <p className="text-sm text-slate-600 leading-relaxed line-clamp-4 flex-grow whitespace-pre-wrap">{story.story}</p>
                        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-100 shrink-0">
                          <button
                            onClick={() => openBeneficiaryEdit(story)}
                            className="flex-grow bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
                          >
                            <Pencil size={16} /> Editar
                          </button>
                          <button
                            onClick={() => deleteBeneficiary(story.id)}
                            className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors border border-red-100 hover:border-red-200"
                            title="Eliminar Historia"
                          >
                            <Trash2 size={18} />
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
              onClick={() => setIsPartnerModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[#14213D]">Novo Parceiro</h2>
                <button onClick={() => setIsPartnerModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Nome do Parceiro *</label>
                  <input
                    value={newPartner.name}
                    onChange={e => setNewPartner(p => ({ ...p, name: e.target.value }))}
                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: UNICEF Mocambique"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Logo do Parceiro</label>

                  {/* Upload local */}
                  <div className="relative group cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        // Limit size to ~2MB.
                        if (file.size > 2 * 1024 * 1024) {
                          alert('Imagem demasiado grande (max 2MB). Use uma imagem menor ou insira apenas o URL.');
                          return;
                        }
                        const reader = new FileReader();
                        reader.onload = ev => setNewPartner(p => ({ ...p, logo_data: ev.target.result, logo_url: '' }));
                        reader.readAsDataURL(file);
                      }}
                    />
                    <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl px-6 py-4 flex items-center gap-3 group-hover:border-blue-400 transition-all">
                      <Upload size={18} className="text-slate-400 group-hover:text-blue-500 shrink-0" />
                      <span className="text-sm text-slate-500 font-medium">
                        {newPartner.logo_data ? '✓ Ficheiro carregado' : 'Carregar do PC (PNG, JPG, SVG...)'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <div className="flex-1 h-px bg-slate-100" />
                    <span>ou</span>
                    <div className="flex-1 h-px bg-slate-100" />
                  </div>

                  {/* URL externa */}
                  <input
                    value={newPartner.logo_url}
                    onChange={e => setNewPartner(p => ({ ...p, logo_url: e.target.value, logo_data: '' }))}
                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Colar URL da logo (https://...)"
                  />
                  <p className="text-xs text-slate-400">Se nao tiver logo, o nome do parceiro sera exibido no rodape.</p>
                </div>

                {/* Preview */}
                {(newPartner.logo_data || newPartner.logo_url) && (
                  <div className="bg-slate-900 rounded-2xl p-5 flex items-center gap-4">
                    <img
                      src={newPartner.logo_data || newPartner.logo_url}
                      alt="Preview"
                      className="h-10 max-w-[120px] object-contain filter grayscale brightness-200"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <p className="text-white text-xs font-bold">{newPartner.name || 'Parceiro'}</p>
                      <p className="text-slate-500 text-[10px] mt-0.5">Previsualizacao no rodape</p>
                    </div>
                    <button
                      onClick={() => setNewPartner(p => ({ ...p, logo_data: '', logo_url: '' }))}
                      className="ml-auto text-slate-500 hover:text-red-400 transition-colors"
                      title="Remover logo"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}

                <div className="flex gap-4 pt-2">
                  <button
                    onClick={() => { setIsPartnerModalOpen(false); setNewPartner({ name: '', logo_url: '', logo_data: '' }); }}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-4 rounded-2xl font-bold transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={addPartner}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl transition-all"
                  >
                    <Save size={20} /> Adicionar Parceiro
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
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl relative z-10 overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-20">
                <h2 className="text-2xl font-bold text-[#14213D]">{editingTeamMember ? 'Editar Membro' : 'Novo Membro da Equipa'}</h2>
                <button onClick={() => setIsTeamModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Nome Completo *</label>
                    <input
                      value={newTeamMember.name}
                      onChange={e => setNewTeamMember(p => ({ ...p, name: e.target.value }))}
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: Joao Silva"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Cargo / Funcao *</label>
                    <input
                      value={newTeamMember.role}
                      onChange={e => setNewTeamMember(p => ({ ...p, role: e.target.value }))}
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: Psicologo Clinico"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Informacoes (Biografia)</label>
                  <textarea
                    value={newTeamMember.bio}
                    onChange={e => setNewTeamMember(p => ({ ...p, bio: e.target.value }))}
                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                    placeholder="Escreva um breve resumo sobre a formacao e experiencia do membro..."
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Fotografia</label>

                  <div className="flex gap-6 items-center">
                    <div className="w-20 h-20 rounded-full bg-slate-100 shrink-0 overflow-hidden border-2 border-slate-200 flex items-center justify-center">
                      {(newTeamMember.photo_data || newTeamMember.photo_url) ? (
                        <img src={newTeamMember.photo_data || newTeamMember.photo_url} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <UserCircle size={32} className="text-slate-400" />
                      )}
                    </div>

                    <div className="flex-grow space-y-3">
                      {/* Upload local */}
                      <div className="relative group cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          onChange={async e => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            // Limit size to ~5MB to avoid exceeding localStorage quota.
                            if (file.size > 5 * 1024 * 1024) {
                              alert('Imagem demasiado grande (max 5MB). Use uma imagem menor ou insira apenas o URL.');
                              return;
                            }
                            // Compress image to reduce size before converting to base64.
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
                              setNewTeamMember(p => ({ ...p, photo_data: compressed, photo_url: '' }));
                            } else {
                              // Fallback to original file if compression fails
                              const reader = new FileReader();
                              reader.onload = ev => setNewTeamMember(p => ({ ...p, photo_data: ev.target.result, photo_url: '' }));
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl px-4 py-3 flex items-center gap-3 group-hover:border-blue-400 transition-all">
                          <Upload size={18} className="text-slate-400 group-hover:text-blue-500 shrink-0" />
                          <span className="text-sm text-slate-500 font-medium">
                            {newTeamMember.photo_data ? '✓ Foto carregada' : 'Carregar do PC'}
                          </span>
                        </div>
                      </div>

                      {/* URL externa */}
                      <input
                        value={newTeamMember.photo_url}
                        onChange={e => setNewTeamMember(p => ({ ...p, photo_url: e.target.value, photo_data: '' }))}
                        className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="Ou colar URL da foto"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => setIsTeamModalOpen(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-4 rounded-2xl font-bold transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={addOrUpdateTeamMember}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl transition-all"
                  >
                    <Save size={20} /> Guardar Membro
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
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl relative z-10 overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-20">
                <div>
                  <h2 className="text-2xl font-bold text-[#14213D]">Detalhes do Pedido de Apoio</h2>
                  <p className="text-slate-400 text-sm mt-0.5">Apenas leitura – gerir o estado abaixo</p>
                </div>
                <button onClick={() => setIsMessageModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>
              <div className="p-8 space-y-6">
                {/* Read Status Badge */}
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1.5 text-xs font-bold uppercase rounded-full ${selectedMessage.read_status === 'Lido' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {selectedMessage.read_status === 'Lido' ? 'Lido' : 'Nao Lido'}
                  </span>
                  <span className={`px-3 py-1.5 text-xs font-bold uppercase rounded-full ${selectedMessage.status === 'Aceitado' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {selectedMessage.status}
                  </span>
                </div>

                {/* Identification */}
                <div className="bg-slate-50 rounded-3xl p-6 space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Identificacao</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nome Completo</label>
                      <p className="font-bold text-[#14213D] text-lg">{selectedMessage?.name || 'N/A'}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Genero</label>
                      <p className="font-semibold text-slate-700">{selectedMessage?.genero || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Data de Nascimento</label>
                      <p className="font-semibold text-slate-700">
                        {selectedMessage?.data_nascimento ? new Date(selectedMessage.data_nascimento).toLocaleDateString('pt-PT') : 'N/A'}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contacto (Telefone)</label>
                      <p className="font-semibold text-slate-700">{selectedMessage?.phone || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email</label>
                      <p className="font-semibold text-slate-700 break-all">{selectedMessage?.email || 'N/A'}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Endereco</label>
                      <p className="font-semibold text-slate-700">{selectedMessage?.endereco || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Support Request */}
                <div className="bg-slate-50 rounded-3xl p-6 space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pedido</h3>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tipo de Necessidade / Apoio</label>
                    <p className="font-bold text-[#14213D] text-lg">{selectedMessage?.subject || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mensagem / Descricao</label>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{selectedMessage?.message || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Data de Inscricao</label>
                    <p className="font-semibold text-slate-700">
                      {selectedMessage?.created_at ? new Date(selectedMessage.created_at).toLocaleString('pt-PT') : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Status Controls */}
                <div className="bg-slate-50 rounded-3xl p-6 space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Gerir Estado</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estado do Registo</label>
                      <select
                        value={selectedMessage.status}
                        onChange={(e) => {
                          updateMessageStatus(selectedMessage.id, e.target.value);
                          setSelectedMessage(m => ({ ...m, status: e.target.value }));
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Novo">Novo</option>
                        <option value="Aceitado">Aceitado</option>
                        <option value="Recusado">Recusado</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estado de Leitura</label>
                      <button
                        onClick={() => {
                          const newStatus = selectedMessage.read_status === 'Lido' ? 'Nao Lido' : 'Lido';
                          updateMessageReadStatus(selectedMessage.id, newStatus);
                          setSelectedMessage(m => ({ ...m, read_status: newStatus }));
                        }}
                        className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                          selectedMessage.read_status === 'Lido'
                            ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {selectedMessage.read_status === 'Lido' ? 'Marcar como Nao Lido' : 'Marcar como Lido'}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsMessageModalOpen(false)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-4 rounded-2xl font-bold transition-all"
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
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[#14213D]">
                  {editingProject ? 'Editar Projeto' : 'Novo Projeto'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={projectForm.handleSubmit(onProjectSubmit)} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Nome do projeto</label>
                  <input
                    {...projectForm.register('name')}
                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500"
                    placeholder="Nome do projeto..."
                  />
                  {projectForm.formState.errors.name && <p className="text-red-500 text-xs">{projectForm.formState.errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Objetivos Especificos</label>
                  <textarea
                    {...projectForm.register('objetivos_especificos')}
                    rows={4}
                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Detalhes dos objetivos..."
                  />
                  {projectForm.formState.errors.objetivos_especificos && <p className="text-red-500 text-xs">{projectForm.formState.errors.objetivos_especificos.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Equipa Responsavel</label>
                  <div className="relative group cursor-pointer border border-slate-100 rounded-2xl bg-slate-50 max-h-32 overflow-y-auto p-4 custom-scrollbar">
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
                              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                            <span className="text-sm font-medium text-slate-700">{member.name} ({member.role})</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                  {projectForm.formState.errors.equipa_responsavel && (
                    <p className="text-red-500 text-xs mt-1">{projectForm.formState.errors.equipa_responsavel.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Estado</label>
                    <select
                      {...projectForm.register('status')}
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500 appearance-none"
                    >
                      <option value="Planeamento">Planeamento</option>
                      <option value="Em Curso">Em Curso</option>
                      <option value="Concluido">Concluido</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Capa do Projeto (Imagem)
                  </label>

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
                      <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 group-hover:border-blue-400 transition-all">
                        <Upload className="text-slate-400 group-hover:text-blue-500" size={24} />
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center">
                          {selectedFile ? selectedFile.name : 'Escolher Ficheiro (Imagem)'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <input
                        {...projectForm.register('capa_url')}
                        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500"
                        placeholder="Ou cole o link da imagem aqui..."
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
                      <img src={uploadPreview} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <button
                        type="button"
                        onClick={() => { setSelectedFile(null); setUploadPreview(null); projectForm.setValue('capa_url', ''); }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-all"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest text-blue-600">Imagens ou videos do projeto</label>
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
                              <option value="video">Video</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">URL / Link</label>
                            <input
                              {...projectForm.register(`gallery.${index}.url`)}
                              className="w-full bg-white border-none rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                              placeholder="URL da imagem ou video"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Descricao (Opcional)</label>
                          <input
                            {...projectForm.register(`gallery.${index}.description`)}
                            className="w-full bg-white border-none rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="Legenda da media..."
                          />
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => appendGallery({ type: 'image', url: '', description: '' })}
                      className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 hover:border-blue-400 transition-all flex items-center justify-center gap-2 font-bold text-sm"
                    >
                      <Plus size={18} /> Adicionar imagens ou videos do projeto
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
                        Carregar Multiplos Ficheiros (Imagens/Videos)
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
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[#14213D]">
                  Detalhes da Candidatura
                </h2>
                <button onClick={() => setIsVolunteerModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto text-slate-700">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nome Completo</label>
                    <p className="font-bold text-[#14213D] text-lg">{editingVolunteer?.full_name}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Genero</label>
                    <p className="font-bold text-[#14213D] text-lg">{editingVolunteer?.genero || 'N/A'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email</label>
                    <p className="font-bold text-[#14213D] text-lg">{editingVolunteer?.email}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Telefone</label>
                    <p className="font-bold text-[#14213D] text-lg">{editingVolunteer?.phone}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Area de Interesse</label>
                  <p className="font-bold text-[#14213D] text-lg">{editingVolunteer?.area_interesse || 'N/A'}</p>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Endereco</label>
                  <p className="font-bold text-[#14213D] text-lg">{editingVolunteer?.endereco || 'N/A'}</p>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Estado da Candidatura</label>
                    <select
                      value={editingVolunteer?.status}
                      onChange={(e) => {
                        updateVolunteerStatus(editingVolunteer.id, e.target.value);
                        setEditingVolunteer({ ...editingVolunteer, status: e.target.value });
                      }}
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500 appearance-none font-bold text-[#14213D]"
                    >
                      <option value="Pendente">Pendente</option>
                      <option value="Aprovado">Aprovado</option>
                      <option value="Recusado">Recusado</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Estado de Leitura</label>
                    <select
                      value={editingVolunteer?.read_status}
                      onChange={(e) => {
                        updateVolunteerReadStatus(editingVolunteer.id, e.target.value);
                        setEditingVolunteer({ ...editingVolunteer, read_status: e.target.value });
                      }}
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500 appearance-none font-bold text-[#14213D]"
                    >
                      <option value="Lido">Lido</option>
                      <option value="Nao Lido">Nao Lido</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mensagem/Observacoes do Voluntario</label>
                  <div className="bg-slate-50 p-6 rounded-3xl text-slate-700 leading-relaxed whitespace-pre-wrap border border-slate-100 min-h-[100px]">
                    {editingVolunteer?.message || 'Nenhuma mensagem.'}
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsVolunteerModalOpen(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-4 rounded-2xl font-bold transition-all"
                  >
                    Fechar
                  </button>
                </div>
              </div>
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
                    <h2 className="text-2xl font-bold text-[#14213D]">Detalhes da Mensagem</h2>
                    <div className="flex items-center gap-2">
                      <p className="text-slate-500 text-sm">Recebida em {new Date(selectedMessage.created_at).toLocaleString('pt-PT')}</p>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${selectedMessage.status === 'Novo' ? 'bg-blue-100 text-blue-600' :
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
                    <p className="font-bold text-[#14213D] text-lg">{selectedMessage.name}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contacto Telefonico</label>
                    <p className="text-[#14213D] font-bold text-lg">{selectedMessage.phone || 'N/A'}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Assunto</label>
                  <p className="font-bold text-[#14213D] text-xl">{selectedMessage.subject}</p>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mensagem</label>
                  <div className="bg-slate-50 p-6 rounded-3xl text-slate-700 leading-relaxed whitespace-pre-wrap border border-slate-100">
                    {selectedMessage.message}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
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
                    className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 shadow-xl transition-all"
                  >
                    <Plus size={20} /> Registar como Beneficiario
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Tem a certeza que deseja recusar este pedido e remove-lo do sistema?')) {
                        deleteMessage(selectedMessage.id);
                        setIsMessageModalOpen(false);
                      }
                    }}
                    className="flex-1 bg-red-50 text-red-600 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition-all"
                  >
                    <Trash2 size={20} /> Recusar e Remover
                  </button>
                </div>

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
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h2 className="text-2xl font-bold text-[#14213D]">
                  {editingBeneficiary ? 'Editar Historia de Beneficiario' : 'Registar Historia de Beneficiario'}
                </h2>
                <button onClick={() => setIsBeneficiaryModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={beneficiaryForm.handleSubmit(onBeneficiarySubmit)} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Nome do Beneficiario *</label>
                  <input
                    {...beneficiaryForm.register('full_name')}
                    className="w-full bg-slate-50 border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Nome completo do beneficiario"
                  />
                  {beneficiaryForm.formState.errors.full_name && <p className="text-red-500 text-xs">{beneficiaryForm.formState.errors.full_name.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Projeto de Intervencao *</label>
                  <select
                    {...beneficiaryForm.register('project_id')}
                    className="w-full bg-slate-50 border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-blue-500 appearance-none focus:outline-none"
                  >
                    <option value="">Selecione um projeto...</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  {beneficiaryForm.formState.errors.project_id && <p className="text-red-500 text-xs">{beneficiaryForm.formState.errors.project_id.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Historia de Superacao / Impacto *</label>
                  <textarea
                    {...beneficiaryForm.register('story')}
                    rows={6}
                    className="w-full bg-slate-50 border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-blue-500 resize-none leading-relaxed focus:outline-none"
                    placeholder="Descreva a historia do beneficiario, o apoio recebido e o impacto gerado..."
                  />
                  {beneficiaryForm.formState.errors.story && <p className="text-red-500 text-xs">{beneficiaryForm.formState.errors.story.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Imagem Ilustrativa</label>
                  <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-200 shrink-0 flex items-center justify-center">
                      {(beneficiaryForm.watch('image_data') || beneficiaryForm.watch('image_url')) ? (
                        <img src={beneficiaryForm.watch('image_data') || beneficiaryForm.watch('image_url')} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon size={28} className="text-slate-400" />
                      )}
                    </div>

                    <div className="flex-grow space-y-3">
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
                        <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 flex items-center gap-2 group-hover:border-blue-400 transition-all">
                          <Upload size={16} className="text-slate-400 group-hover:text-blue-500 shrink-0" />
                          <span className="text-xs text-slate-500 font-medium">
                            {beneficiaryForm.watch('image_data') ? '✓ Imagem carregada' : 'Carregar do Computador'}
                          </span>
                        </div>
                      </div>

                      {/* URL externa */}
                      <input
                        {...beneficiaryForm.register('image_url')}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
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

                <div className="pt-6 flex gap-4 border-t border-slate-100 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsBeneficiaryModalOpen(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-4 rounded-2xl font-bold transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl transition-all"
                  >
                    <Save size={20} /> Guardar Historia
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
