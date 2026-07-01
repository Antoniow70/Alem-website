import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  getBeneficiaryStories, 
  saveBeneficiary as saveBeneficiaryService, 
  deleteBeneficiary as deleteBeneficiaryService 
} from '../services/beneficiariosApi';

const beneficiarySchema = z.object({
  full_name: z.string().min(3, 'Nome obrigatorio'),
  story: z.string().min(10, 'Historia deve ter pelo menos 10 caracteres'),
  project_id: z.string().min(1, 'Projeto obrigatorio'),
  image_url: z.string().optional(),
  image_data: z.string().optional(),
});

export function useAdminBeneficiaries(openConfirm, onRefreshAll) {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [isBeneficiaryModalOpen, setIsBeneficiaryModalOpen] = useState(false);
  const [editingBeneficiary, setEditingBeneficiary] = useState(null);

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

  const fetchBeneficiaries = async () => {
    try {
      const data = await getBeneficiaryStories();
      setBeneficiaries(data || []);
    } catch (err) {
      console.error('Error fetching beneficiary stories:', err);
    }
  };

  const handleBeneficiarySubmit = async (data) => {
    try {
      await saveBeneficiaryService(data, editingBeneficiary?.id);
      setIsBeneficiaryModalOpen(false);
      setEditingBeneficiary(null);
      beneficiaryForm.reset();
      await fetchBeneficiaries();
      if (onRefreshAll) onRefreshAll();
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

  const handleDeleteBeneficiary = (id) => {
    openConfirm({
      title: 'Eliminar Historia de Beneficiario',
      message: 'Tem a certeza que deseja eliminar esta historia de beneficiario? Esta acao e irreversivel.',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      type: 'danger',
      onConfirm: async () => {
        try {
          await deleteBeneficiaryService(id);
          await fetchBeneficiaries();
          if (onRefreshAll) onRefreshAll();
        } catch (error) {
          console.error('Error deleting beneficiary story:', error);
        }
      }
    });
  };

  const openNewBeneficiary = () => {
    setEditingBeneficiary(null);
    beneficiaryForm.reset({
      full_name: '',
      story: '',
      project_id: '',
      image_url: '',
      image_data: ''
    });
    setIsBeneficiaryModalOpen(true);
  };

  return {
    beneficiaries,
    setBeneficiaries,
    isBeneficiaryModalOpen,
    setIsBeneficiaryModalOpen,
    editingBeneficiary,
    setEditingBeneficiary,
    beneficiaryForm,
    fetchBeneficiaries,
    handleBeneficiarySubmit,
    openBeneficiaryEdit,
    handleDeleteBeneficiary,
    openNewBeneficiary
  };
}
