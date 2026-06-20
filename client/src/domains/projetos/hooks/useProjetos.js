import { useState, useCallback } from 'react';
import { getProjects, saveProject, deleteProject, updateProjectStatus } from '../services/projetosApi';

export function useProjetos() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProjects = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const data = await getProjects(filters);
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSaveProject = async (payload, editingId) => {
    try {
      await saveProject(payload, editingId);
      await fetchProjects();
      return true;
    } catch (error) {
      console.error('Error saving project:', error);
      alert(`Erro ao guardar projeto: ${error?.message || 'Verifique a consola para detalhes.'}`);
      return false;
    }
  };

  const handleDeleteProjectItem = async (id) => {
    if (confirm('Tem a certeza que deseja eliminar este projeto?')) {
      try {
        await deleteProject(id);
        await fetchProjects();
        return true;
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
    return false;
  };

  const handleUpdateProjectStatusItem = async (id, newStatus) => {
    try {
      await updateProjectStatus(id, newStatus);
      await fetchProjects();
      return true;
    } catch (error) {
      console.error('Error updating project status:', error);
      return false;
    }
  };

  return {
    projects,
    setProjects,
    loading,
    fetchProjects,
    handleSaveProject,
    handleDeleteProjectItem,
    handleUpdateProjectStatusItem
  };
}
