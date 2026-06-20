import { useState, useCallback } from 'react';
import { 
  getMessages, 
  deleteMessage, 
  updateMessageStatus, 
  updateMessageReadStatus, 
  bulkUpdateMessageStatus 
} from '../services/suporteApi';
import { exportSupportPDF } from '../utils/pdfExport';

export function useSuporte() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [supportFilterStart, setSupportFilterStart] = useState('');
  const [supportFilterEnd, setSupportFilterEnd] = useState('');
  const [supportSearch, setSupportSearch] = useState('');
  const [supportReadFilter, setSupportReadFilter] = useState('Todos');

  const fetchMessages = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const { data } = await getMessages(filters);
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUpdateMessageStatusItem = async (id, status, callback) => {
    try {
      if (status === 'Recusado') {
        if (confirm('Tem a certeza? Ao marcar como Recusado, o registo sera eliminado permanentemente.')) {
          await deleteMessage(id);
          if (callback) callback();
        }
        return;
      }
      await updateMessageStatus(id, status);
      if (callback) callback();
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  };

  const handleUpdateMessageReadStatusItem = async (id, newReadStatus, callback) => {
    try {
      await updateMessageReadStatus(id, newReadStatus);
      if (callback) callback();
    } catch (error) {
      console.error('Error updating message read status:', error);
    }
  };

  const handleDeleteMessageItem = async (id, callback) => {
    if (confirm('Tem a certeza que deseja remover esta mensagem?')) {
      try {
        await deleteMessage(id);
        if (callback) callback();
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    }
  };

  const getFilteredMessages = () => {
    let filtered = messages;
    
    if (supportReadFilter === 'Lidos') {
      filtered = filtered.filter(m => m.read_status === 'Lido');
    } else if (supportReadFilter === 'Nao Lidos') {
      filtered = filtered.filter(m => m.read_status === 'Nao Lido');
    }

    if (supportFilterStart) {
      const start = new Date(supportFilterStart + 'T00:00:00');
      filtered = filtered.filter(m => new Date(m.created_at) >= start);
    }
    if (supportFilterEnd) {
      const end = new Date(supportFilterEnd + 'T23:59:59');
      filtered = filtered.filter(m => new Date(m.created_at) <= end);
    }

    if (supportSearch) {
      const search = supportSearch.toLowerCase();
      filtered = filtered.filter(m => 
        (m.name && m.name.toLowerCase().includes(search)) ||
        (m.email && m.email.toLowerCase().includes(search)) ||
        (m.created_at && new Date(m.created_at).toLocaleDateString('pt-PT').includes(search))
      );
    }

    return filtered;
  };

  const handleExportSupportPDFItem = async (callback) => {
    const filtered = getFilteredMessages();
    exportSupportPDF(filtered, { readFilter: supportReadFilter, search: supportSearch, filterStart: supportFilterStart, filterEnd: supportFilterEnd });

    const pendingIds = filtered.filter(m => m.status === 'Pendente').map(m => m.id);
    if (pendingIds.length > 0) {
      try {
        await bulkUpdateMessageStatus(pendingIds, 'Em Analise');
        if (callback) callback();
      } catch (err) {
        console.error('Erro ao atualizar estado para Em Analise:', err);
      }
    }
  };

  return {
    messages,
    setMessages,
    loading,
    fetchMessages,
    supportFilterStart,
    setSupportFilterStart,
    supportFilterEnd,
    setSupportFilterEnd,
    supportSearch,
    setSupportSearch,
    supportReadFilter,
    setSupportReadFilter,
    handleUpdateMessageStatusItem,
    handleUpdateMessageReadStatusItem,
    handleDeleteMessageItem,
    getFilteredMessages,
    handleExportSupportPDFItem
  };
}
