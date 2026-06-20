import { useState, useCallback } from 'react';
import { getDonations, updateDonationStatus } from '../services/doacoesApi';
import { exportDonationsPDF } from '../../suporte/utils/pdfExport';

export function useDoacoes() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [donationFilterStart, setDonationFilterStart] = useState('');
  const [donationFilterEnd, setDonationFilterEnd] = useState('');

  const fetchDonations = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const { data } = await getDonations(filters);
      setDonations(data || []);
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUpdateDonationStatusItem = async (id, newStatus, callback) => {
    try {
      if (newStatus === 'Nao Recebido' || newStatus === 'Recusado') {
        if (confirm('Tem a certeza? Ao marcar como Nao Recebido, o registo de doacao sera eliminado permanentemente.')) {
          await updateDonationStatus(id, newStatus);
          if (callback) callback();
        }
        return;
      }
      await updateDonationStatus(id, newStatus);
      if (callback) callback();
    } catch (error) {
      console.error('Error updating donation status:', error);
    }
  };

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

  const handleExportDonationsPDFItem = () => {
    const filtered = getFilteredDonations();
    exportDonationsPDF(filtered, { filterStart: donationFilterStart, filterEnd: donationFilterEnd });
  };

  return {
    donations,
    setDonations,
    loading,
    fetchDonations,
    donationFilterStart,
    setDonationFilterStart,
    donationFilterEnd,
    setDonationFilterEnd,
    handleUpdateDonationStatusItem,
    getFilteredDonations,
    handleExportDonationsPDFItem
  };
}
