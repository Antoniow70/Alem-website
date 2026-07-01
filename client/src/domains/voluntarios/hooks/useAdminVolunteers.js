import { useState } from 'react';
import axiosClient from '../../../shared/lib/axiosClient';
import { 
  getVolunteers, 
  deleteVolunteer as deleteVolunteerService, 
  updateVolunteerStatus as updateVolunteerStatusService, 
  updateVolunteerReadStatus as updateVolunteerReadStatusService, 
  bulkUpdateVolunteerStatus as bulkUpdateVolunteerStatusService 
} from '../services/voluntariosApi';

export function useAdminVolunteers(openConfirm, onRefreshAll) {
  const [volunteers, setVolunteers] = useState([]);
  const [volunteerSearch, setVolunteerSearch] = useState('');
  const [volunteerFilterStart, setVolunteerFilterStart] = useState('');
  const [volunteerFilterEnd, setVolunteerFilterEnd] = useState('');
  const [volunteerReadFilter, setVolunteerReadFilter] = useState('Todos');
  const [isVolunteerModalOpen, setIsVolunteerModalOpen] = useState(false);
  const [editingVolunteer, setEditingVolunteer] = useState(null);

  const fetchVolunteers = async () => {
    try {
      const res = await getVolunteers();
      setVolunteers(res?.data || []);
    } catch (err) {
      console.error('Error fetching volunteers:', err);
    }
  };

  const handleUpdateVolunteerStatus = async (id, newStatus) => {
    try {
      if (newStatus === 'Recusado') {
        openConfirm({
          title: 'Recusar Voluntario',
          message: 'Tem a certeza? Ao marcar como Recusado, o registo sera eliminado permanentemente.',
          confirmText: 'Recusar e Eliminar',
          cancelText: 'Cancelar',
          type: 'danger',
          onConfirm: async () => {
            try {
              await deleteVolunteerService(id);
              await fetchVolunteers();
              if (onRefreshAll) onRefreshAll();
              if (isVolunteerModalOpen) setIsVolunteerModalOpen(false);
            } catch (error) {
              console.error('Error deleting volunteer:', error);
            }
          }
        });
        return;
      }
      await updateVolunteerStatusService(id, newStatus);
      await fetchVolunteers();
      if (onRefreshAll) onRefreshAll();
    } catch (error) {
      console.error('Error updating volunteer status:', error);
    }
  };

  const handleUpdateVolunteerReadStatus = async (id, newReadStatus) => {
    try {
      await updateVolunteerReadStatusService(id, newReadStatus);
      await fetchVolunteers();
      if (onRefreshAll) onRefreshAll();
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

  const handleDeleteVolunteer = (id) => {
    openConfirm({
      title: 'Remover Voluntario',
      message: 'Tem a certeza que deseja remover este voluntario? Esta acao e irreversivel.',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      type: 'danger',
      onConfirm: async () => {
        try {
          await deleteVolunteerService(id);
          await fetchVolunteers();
          if (onRefreshAll) onRefreshAll();
        } catch (error) {
          console.error('Error deleting volunteer:', error);
        }
      }
    });
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

  const handleExportVolunteersPDF = async () => {
    const start = volunteerFilterStart || '2025-01-01';
    const end = volunteerFilterEnd || new Date().toISOString().split('T')[0];
    await triggerReportDownload(start, end, 'volunteers', `relatorio_voluntarios_${start}_a_${end}.pdf`);

    const filtered = getFilteredVolunteers();
    const pendingIds = filtered.filter(v => v.status === 'Pendente').map(v => v.id);
    if (pendingIds.length > 0) {
      try {
        await bulkUpdateVolunteerStatusService(pendingIds, 'Em Analise');
        await fetchVolunteers();
        if (onRefreshAll) onRefreshAll();
      } catch (err) {
        console.error('Erro ao atualizar estado para Em Analise:', err);
      }
    }
  };

  return {
    volunteers,
    setVolunteers,
    volunteerSearch,
    setVolunteerSearch,
    volunteerFilterStart,
    setVolunteerFilterStart,
    volunteerFilterEnd,
    setVolunteerFilterEnd,
    volunteerReadFilter,
    setVolunteerReadFilter,
    isVolunteerModalOpen,
    setIsVolunteerModalOpen,
    editingVolunteer,
    setEditingVolunteer,
    fetchVolunteers,
    handleUpdateVolunteerStatus,
    handleUpdateVolunteerReadStatus,
    openVolunteerEdit,
    handleDeleteVolunteer,
    getFilteredVolunteers,
    handleExportVolunteersPDF
  };
}
