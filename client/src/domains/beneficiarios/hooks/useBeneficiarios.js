import { useState, useCallback } from 'react';
import { getBeneficiaryStories, saveBeneficiary, deleteBeneficiary } from '../services/beneficiariosApi';

export function useBeneficiarios() {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBeneficiaries = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getBeneficiaryStories();
      setBeneficiaries(data || []);
    } catch (error) {
      console.error('Error fetching beneficiary stories:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSaveBeneficiary = async (data, editingId) => {
    try {
      await saveBeneficiary(data, editingId);
      await fetchBeneficiaries();
      return true;
    } catch (error) {
      console.error('Error saving beneficiary story:', error);
      alert('Erro ao guardar a historia do beneficiario.');
      return false;
    }
  };

  const handleDeleteBeneficiaryStory = async (id) => {
    if (confirm('Tem a certeza que deseja eliminar esta historia de beneficiario?')) {
      try {
        await deleteBeneficiary(id);
        await fetchBeneficiaries();
        return true;
      } catch (error) {
        console.error('Error deleting beneficiary story:', error);
      }
    }
    return false;
  };

  return {
    beneficiaries,
    setBeneficiaries,
    loading,
    fetchBeneficiaries,
    handleSaveBeneficiary,
    handleDeleteBeneficiaryStory
  };
}
