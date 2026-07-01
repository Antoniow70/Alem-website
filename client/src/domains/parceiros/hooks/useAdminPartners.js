import { useState } from 'react';
import { 
  getPartners, 
  addPartner as addPartnerService, 
  deletePartner as deletePartnerService 
} from '../services/parceirosApi';

export function useAdminPartners(openConfirm, onRefreshAll) {
  const [partners, setPartners] = useState([]);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [newPartner, setNewPartner] = useState({ name: '', logo_url: '', logo_data: '' });

  const fetchPartners = async () => {
    try {
      const data = await getPartners();
      setPartners(data || []);
    } catch (err) {
      console.error('Error fetching partners:', err);
    }
  };

  const handleAddPartner = async () => {
    if (!newPartner.name.trim()) {
      alert('O nome do parceiro e obrigatorio.');
      return;
    }
    try {
      await addPartnerService(newPartner);
      setNewPartner({ name: '', logo_url: '', logo_data: '' });
      setIsPartnerModalOpen(false);
      await fetchPartners();
      if (onRefreshAll) onRefreshAll();
    } catch (err) {
      console.error('Error adding partner:', err);
      alert('Erro ao guardar parceiro.');
    }
  };

  const handleDeletePartner = (id) => {
    openConfirm({
      title: 'Remover Parceiro',
      message: 'Tem a certeza que deseja eliminar este parceiro? Esta acao e irreversivel.',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      type: 'danger',
      onConfirm: async () => {
        try {
          await deletePartnerService(id);
          await fetchPartners();
          if (onRefreshAll) onRefreshAll();
        } catch (err) {
          console.error('Error deleting partner:', err);
        }
      }
    });
  };

  const openNewPartner = () => {
    setNewPartner({ name: '', logo_url: '', logo_data: '' });
    setIsPartnerModalOpen(true);
  };

  return {
    partners,
    setPartners,
    isPartnerModalOpen,
    setIsPartnerModalOpen,
    newPartner,
    setNewPartner,
    fetchPartners,
    handleAddPartner,
    handleDeletePartner,
    openNewPartner
  };
}
