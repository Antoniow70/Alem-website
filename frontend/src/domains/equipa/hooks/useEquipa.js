import { useState, useCallback } from 'react';
import { getTeam, addOrUpdateTeamMember, deleteTeamMember } from '../services/equipaApi';

export function useEquipa() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTeam = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTeam();
      setTeam(data || []);
    } catch (error) {
      console.error('Error fetching team:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSaveTeamMember = async (memberData, editingId) => {
    try {
      await addOrUpdateTeamMember(memberData, editingId);
      await fetchTeam();
      return true;
    } catch (err) {
      console.error('Error saving team member:', err);
      alert('Erro ao guardar membro da equipa.');
      return false;
    }
  };

  const handleDeleteTeamMemberItem = async (id) => {
    if (confirm('Remover este membro da equipa?')) {
      try {
        await deleteTeamMember(id);
        await fetchTeam();
        return true;
      } catch (err) {
        console.error('Error deleting team member:', err);
      }
    }
    return false;
  };

  return {
    team,
    setTeam,
    loading,
    fetchTeam,
    handleSaveTeamMember,
    handleDeleteTeamMemberItem
  };
}
