import { useState, useCallback } from 'react';
import { getPartners, addPartner, deletePartner } from '../services/parceirosApi';

export function useParceiros() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPartners = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPartners();
      setPartners(data || []);
    } catch (error) {
      console.error('Error fetching partners:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddPartnerItem = async (newPartner) => {
    if (!newPartner.name.trim()) {
      alert('O nome do parceiro e obrigatorio.');
      return false;
    }
    try {
      await addPartner(newPartner);
      await fetchPartners();
      return true;
    } catch (err) {
      console.error('Error adding partner:', err);
      alert('Erro ao guardar parceiro.');
      return false;
    }
  };

  const handleDeletePartnerItem = async (id) => {
    if (confirm('Remover este parceiro?')) {
      try {
        await deletePartner(id);
        await fetchPartners();
        return true;
      } catch (err) {
        console.error('Error deleting partner:', err);
      }
    }
    return false;
  };

  return {
    partners,
    setPartners,
    loading,
    fetchPartners,
    handleAddPartnerItem,
    handleDeletePartnerItem
  };
}
