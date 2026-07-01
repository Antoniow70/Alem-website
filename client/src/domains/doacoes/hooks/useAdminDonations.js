import { useState } from 'react';
import axiosClient from '../../../shared/lib/axiosClient';
import { 
  getDonations, 
  updateDonationStatus as updateDonationStatusService 
} from '../services/doacoesApi';

export function useAdminDonations(openConfirm, onRefreshAll) {
  const [donations, setDonations] = useState([]);
  const [donationFilterStart, setDonationFilterStart] = useState('');
  const [donationFilterEnd, setDonationFilterEnd] = useState('');

  const fetchDonations = async () => {
    try {
      const res = await getDonations();
      setDonations(res?.data || []);
    } catch (err) {
      console.error('Error fetching donations:', err);
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

  const triggerReportDownload = async (startDate, endDate, type, defaultFilename) => {
    try {
      const start = startDate || '2025-01-01';
      const end = endDate || new Date().toISOString().split('T')[0];
      
      const response = await axiosClient.get('/reports', {
        params: { startDate: start, endDate: end, type },
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', defaultFilename);
      document.body.appendChild(link);
      link.click();
      
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generating PDF report:', err);
      alert('Erro ao gerar relatorio em PDF no servidor.');
    }
  };

  const handleExportDonationsPDF = async () => {
    const start = donationFilterStart || '2025-01-01';
    const end = donationFilterEnd || new Date().toISOString().split('T')[0];
    await triggerReportDownload(start, end, 'donations', `relatorio_doacoes_${start}_a_${end}.pdf`);
  };

  const handleUpdateDonationStatus = async (id, newStatus) => {
    try {
      if (newStatus === 'Nao Recebido' || newStatus === 'Recusado') {
        openConfirm({
          title: 'Eliminar Registo de Doacao',
          message: 'Tem a certeza? Ao marcar como Nao Recebido, o registo de doacao sera eliminado permanentemente.',
          confirmText: 'Eliminar',
          cancelText: 'Cancelar',
          type: 'danger',
          onConfirm: async () => {
            try {
              await updateDonationStatusService(id, newStatus);
              await fetchDonations();
              if (onRefreshAll) onRefreshAll();
            } catch (error) {
              console.error('Error updating donation status:', error);
            }
          }
        });
        return;
      }
      await updateDonationStatusService(id, newStatus);
      await fetchDonations();
      if (onRefreshAll) onRefreshAll();
    } catch (error) {
      console.error('Error updating donation status:', error);
    }
  };

  return {
    donations,
    setDonations,
    donationFilterStart,
    setDonationFilterStart,
    donationFilterEnd,
    setDonationFilterEnd,
    fetchDonations,
    getFilteredDonations,
    handleExportDonationsPDF,
    handleUpdateDonationStatus
  };
}
