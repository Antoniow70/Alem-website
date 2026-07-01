import { useState } from 'react';
import { 
  getTeam, 
  addOrUpdateTeamMember as addOrUpdateTeamMemberService, 
  deleteTeamMember as deleteTeamMemberService 
} from '../services/equipaApi';

export function useAdminTeam(openConfirm, onRefreshAll) {
  const [team, setTeam] = useState([]);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [newTeamMember, setNewTeamMember] = useState({ name: '', role: '', bio: '', photo_data: '', photo_url: '' });
  const [editingTeamMember, setEditingTeamMember] = useState(null);

  const fetchTeam = async () => {
    try {
      const data = await getTeam();
      setTeam(data || []);
    } catch (err) {
      console.error('Error fetching team:', err);
    }
  };

  const handleAddOrUpdateTeamMember = async () => {
    const name = newTeamMember?.name || '';
    const role = newTeamMember?.role || '';

    if (!name.trim() || !role.trim()) {
      alert('Nome e cargo sao obrigatorios.');
      return;
    }

    try {
      await addOrUpdateTeamMemberService(newTeamMember, editingTeamMember?.id);
      setNewTeamMember({ name: '', role: '', bio: '', photo_data: '', photo_url: '' });
      setEditingTeamMember(null);
      setIsTeamModalOpen(false);
      await fetchTeam();
      if (onRefreshAll) onRefreshAll();
    } catch (err) {
      console.error('Error saving team member:', err);
      alert('Erro ao guardar membro da equipa.');
    }
  };

  const handleDeleteTeamMember = (id) => {
    openConfirm({
      title: 'Remover Membro da Equipa',
      message: 'Tem a certeza que deseja remover este membro da equipa? Esta acao e irreversivel.',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      type: 'danger',
      onConfirm: async () => {
        try {
          await deleteTeamMemberService(id);
          await fetchTeam();
          if (onRefreshAll) onRefreshAll();
        } catch (err) {
          console.error('Error deleting team member:', err);
        }
      }
    });
  };

  const openEditTeamMember = (member) => {
    setEditingTeamMember(member);
    setNewTeamMember(member);
    setIsTeamModalOpen(true);
  };

  const openNewTeamMember = () => {
    setEditingTeamMember(null);
    setNewTeamMember({ name: '', role: '', bio: '', photo_data: '', photo_url: '' });
    setIsTeamModalOpen(true);
  };

  return {
    team,
    setTeam,
    isTeamModalOpen,
    setIsTeamModalOpen,
    newTeamMember,
    setNewTeamMember,
    editingTeamMember,
    setEditingTeamMember,
    fetchTeam,
    handleAddOrUpdateTeamMember,
    handleDeleteTeamMember,
    openEditTeamMember,
    openNewTeamMember
  };
}
