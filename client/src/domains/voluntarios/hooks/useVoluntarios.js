import { useState, useCallback } from 'react';
import { 
  getVolunteers, 
  deleteVolunteer, 
  updateVolunteerStatus, 
  updateVolunteerReadStatus, 
  bulkUpdateVolunteerStatus 
} from '../services/voluntariosApi';
import { exportVolunteersPDF } from '../../suporte/utils/pdfExport';

export function useVoluntarios() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [volunteerSearch, setVolunteerSearch] = useState('');
  const [volunteerFilterStart, setVolunteerFilterStart] = useState('');
  const [volunteerFilterEnd, setVolunteerFilterEnd] = useState('');
  const [volunteerReadFilter, setVolunteerReadFilter] = useState('Todos');

  const fetchVolunteers = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const { data } = await getVolunteers(filters);
      setVolunteers(data || []);
    } catch (error) {
      console.error('Error fetching volunteers:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUpdateVolunteerStatusItem = async (id, newStatus, callback) => {
    try {
      if (newStatus === 'Recusado') {
        if (confirm('Tem a certeza? Ao marcar como Recusado, o registo sera eliminado permanentemente.')) {
          await deleteVolunteer(id);
          if (callback) callback();
        }
        return;
      }
      await updateVolunteerStatus(id, newStatus);
      if (callback) callback();
    } catch (error) {
      console.error('Error updating volunteer status:', error);
    }
  };

  const handleUpdateVolunteerReadStatusItem = async (id, newReadStatus, callback) => {
    try {
      await updateVolunteerReadStatus(id, newReadStatus);
      if (callback) callback();
    } catch (error) {
      console.error('Error updating volunteer read status:', error);
    }
  };

  const handleDeleteVolunteerItem = async (id, callback) => {
    if (confirm('Tem a certeza que deseja remover este voluntario?')) {
      try {
        await deleteVolunteer(id);
        if (callback) callback();
      } catch (error) {
        console.error('Error deleting volunteer:', error);
      }
    }
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

  const handleExportVolunteersPDFItem = async (callback) => {
    const filtered = getFilteredVolunteers();
    exportVolunteersPDF(filtered, { readFilter: volunteerReadFilter, search: volunteerSearch });

    const pendingIds = filtered.filter(v => v.status === 'Pendente').map(v => v.id);
    if (pendingIds.length > 0) {
      try {
        await bulkUpdateVolunteerStatus(pendingIds, 'Em Analise');
        if (callback) callback();
      } catch (err) {
        console.error('Erro ao atualizar estado para Em Analise:', err);
      }
    }
  };

  return {
    volunteers,
    setVolunteers,
    loading,
    fetchVolunteers,
    volunteerSearch,
    setVolunteerSearch,
    volunteerFilterStart,
    setVolunteerFilterStart,
    volunteerFilterEnd,
    setVolunteerFilterEnd,
    volunteerReadFilter,
    setVolunteerReadFilter,
    handleUpdateVolunteerStatusItem,
    handleUpdateVolunteerReadStatusItem,
    handleDeleteVolunteerItem,
    getFilteredVolunteers,
    handleExportVolunteersPDFItem
  };
}
