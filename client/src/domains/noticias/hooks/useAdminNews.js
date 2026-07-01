import { useState } from 'react';
import { 
  getNews, 
  saveNews, 
  deleteNewsItem 
} from '../services/noticiasApi';

export function useAdminNews(openConfirm, onRefreshAll) {
  const [newsList, setNewsList] = useState([]);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);

  const fetchNews = async () => {
    try {
      const data = await getNews();
      setNewsList(data || []);
    } catch (err) {
      console.error('Error fetching news:', err);
    }
  };

  const handleNewsSave = async (payload) => {
    try {
      await saveNews(payload, editingNews?.id || null);
      await fetchNews();
      if (onRefreshAll) onRefreshAll();
    } catch (err) {
      console.error('Error saving news:', err);
      throw err;
    }
  };

  const handleDeleteNews = (item) => {
    openConfirm({
      title: 'Eliminar Noticia',
      message: `Deseja eliminar a noticia "${item.title}"?`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      type: 'danger',
      onConfirm: async () => {
        try {
          await deleteNewsItem(item.id);
          await fetchNews();
          if (onRefreshAll) onRefreshAll();
        } catch (err) {
          console.error('Error deleting news:', err);
        }
      }
    });
  };

  const openNewNews = () => {
    setEditingNews(null);
    setIsNewsModalOpen(true);
  };

  const openNewsEdit = (item) => {
    setEditingNews(item);
    setIsNewsModalOpen(true);
  };

  return {
    newsList,
    setNewsList,
    isNewsModalOpen,
    setIsNewsModalOpen,
    editingNews,
    setEditingNews,
    fetchNews,
    handleNewsSave,
    handleDeleteNews,
    openNewNews,
    openNewsEdit
  };
}
