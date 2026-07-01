import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  getProjects, 
  saveProject, 
  deleteProject as deleteProjectService, 
  updateProjectStatus as updateProjectStatusService, 
  uploadFileToStorage, 
  getAllActivities, 
  getPillars 
} from '../services/projetosApi';
import { compressImage } from '../../../shared/utils/imageUtils';

const projectSchema = z.object({
  name: z.string().min(3, 'Nome obrigatorio'),
  objetivos_especificos: z.string().min(5, 'Objetivos especificos obrigatorios'),
  status: z.enum(['Planeamento', 'Em Curso', 'Concluido']),
  capa_url: z.string().optional(),
  gallery: z.array(z.object({
    type: z.enum(['image', 'video']),
    url: z.string().min(1, 'URL obrigatorio'),
    description: z.string().optional(),
  })).optional(),
  equipa_responsavel: z.array(z.string()).optional(),
  pillar_id: z.string().min(1, 'Pilar obrigatorio'),
  associated_activities: z.array(z.string()).optional(),
  num_beneficiarios: z.preprocess((val) => {
    if (val === '' || val === undefined || val === null) return 0;
    const num = Number(val);
    return isNaN(num) ? 0 : num;
  }, z.number().int().nonnegative().optional().default(0)),
  objetivo_geral: z.string().optional(),
  principais_atividades: z.string().optional()
});

export function useAdminProjects(openConfirm, onRefreshAll) {
  const [projects, setProjects] = useState([]);
  const [activities, setActivities] = useState([]);
  const [pillars, setPillars] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isGalleryUploading, setIsGalleryUploading] = useState(false);

  const projectForm = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      status: 'Planeamento',
      gallery: [],
      equipa_responsavel: [],
      pillar_id: '',
      associated_activities: [],
      num_beneficiarios: 0,
      objetivo_geral: '',
      principais_atividades: ''
    }
  });

  const { fields: galleryFields, append: appendGallery, remove: removeGallery } = useFieldArray({
    control: projectForm.control,
    name: 'gallery'
  });

  const fetchProjectsAndMeta = async () => {
    setLoading(true);
    try {
      const safeFetch = async (promise, fallback) => {
        try {
          return await promise;
        } catch (err) {
          console.error('Projects metadata load failure:', err);
          return fallback;
        }
      };

      const [projList, actList, pillList] = await Promise.all([
        safeFetch(getProjects(), []),
        safeFetch(getAllActivities(), []),
        safeFetch(getPillars(), [])
      ]);

      setProjects(projList || []);
      setActivities(actList || []);
      setPillars(pillList || []);
    } catch (err) {
      console.error('Error fetching projects data:', err);
    } finally {
      setLoading(false);
    }
  };

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
        pillar_id: data.pillar_id || null,
        activities: data.associated_activities || [],
        num_beneficiarios: data.num_beneficiarios || 0,
        objetivo_geral: data.objetivo_geral || null,
        principais_atividades: data.principais_atividades || null
      };

      await saveProject(payload, editingProject?.id);

      setIsModalOpen(false);
      setEditingProject(null);
      setSelectedFile(null);
      setUploadPreview(null);
      projectForm.reset();
      await fetchProjectsAndMeta();
      if (onRefreshAll) onRefreshAll();
    } catch (error) {
      console.error('Error saving project:', error, error.response?.data);
      const errorDetails = error.response?.data ? JSON.stringify(error.response.data, null, 2) : error?.message;
      alert(`Erro ao guardar projeto:\n${errorDetails}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteProject = (id) => {
    openConfirm({
      title: 'Eliminar Projeto',
      message: 'Tem a certeza que deseja eliminar este projeto? Esta acao e irreversivel.',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      type: 'danger',
      onConfirm: async () => {
        try {
          await deleteProjectService(id);
          await fetchProjectsAndMeta();
          if (onRefreshAll) onRefreshAll();
        } catch (error) {
          console.error('Error deleting project:', error);
        }
      }
    });
  };

  const handleUpdateProjectStatus = async (id, newStatus) => {
    try {
      await updateProjectStatusService(id, newStatus);
      await fetchProjectsAndMeta();
      if (onRefreshAll) onRefreshAll();
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

  const openEditProject = (project) => {
    setEditingProject(project);
    projectForm.setValue('name', project.name);
    projectForm.setValue('objetivos_especificos', project.objetivos_especificos || '');
    projectForm.setValue('status', project.status);
    projectForm.setValue('capa_url', project._original_capa_url || project.capa_url || '');
    projectForm.setValue('gallery', project.gallery?.map(g => ({ ...g, url: g._original_url || g.url })) || []);
    projectForm.setValue('equipa_responsavel', project.equipa_responsavel || []);
    projectForm.setValue('pillar_id', project.pillar_id || '');
    projectForm.setValue('associated_activities', project.activities?.map(a => a.id) || []);
    projectForm.setValue('num_beneficiarios', project.num_beneficiarios || 0);
    projectForm.setValue('objetivo_geral', project.objetivo_geral || '');
    projectForm.setValue('principais_atividades', project.principais_atividades || '');
    setUploadPreview(project.capa_url || null);
    setIsModalOpen(true);
  };

  const openNewProject = () => {
    setEditingProject(null);
    setSelectedFile(null);
    setUploadPreview(null);
    projectForm.reset({
      status: 'Planeamento',
      gallery: [],
      equipa_responsavel: [],
      pillar_id: '',
      associated_activities: [],
      num_beneficiarios: 0,
      objetivo_geral: '',
      principais_atividades: ''
    });
    setIsModalOpen(true);
  };

  return {
    projects,
    activities,
    pillars,
    loading,
    isModalOpen,
    setIsModalOpen,
    editingProject,
    setEditingProject,
    selectedFile,
    setSelectedFile,
    uploadPreview,
    setUploadPreview,
    isUploading,
    isGalleryUploading,
    projectForm,
    galleryFields,
    appendGallery,
    removeGallery,
    fetchProjectsAndMeta,
    handleProjectSubmit,
    handleDeleteProject,
    handleUpdateProjectStatus,
    handleGalleryFiles,
    openEditProject,
    openNewProject
  };
}
