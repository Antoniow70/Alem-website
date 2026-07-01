import { useState } from 'react';
import axiosClient from '../../../shared/lib/axiosClient';
import { 
  getMessages, 
  deleteMessage as deleteMessageService, 
  updateMessageStatus as updateMessageStatusService, 
  updateMessageReadStatus as updateMessageReadStatusService, 
  bulkUpdateMessageStatus as bulkUpdateMessageStatusService 
} from '../services/suporteApi';

export function useAdminSupport(openConfirm, onRefreshAll, onRegisterAsBeneficiaryCallback) {
  const [messages, setMessages] = useState([]);
  const [supportSearch, setSupportSearch] = useState('');
  const [supportFilterStart, setSupportFilterStart] = useState('');
  const [supportFilterEnd, setSupportFilterEnd] = useState('');
  const [supportReadFilter, setSupportReadFilter] = useState('Todos');
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const fetchMessages = async () => {
    try {
      const res = await getMessages();
      setMessages(res?.data || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const handleUpdateMessageStatus = async (id, status) => {
    try {
      if (status === 'Recusado') {
        openConfirm({
          title: 'Recusar Pedido de Apoio',
          message: 'Tem a certeza? Ao marcar como Recusado, o registo sera eliminado permanentemente.',
          confirmText: 'Recusar e Eliminar',
          cancelText: 'Cancelar',
          type: 'danger',
          onConfirm: async () => {
            try {
              await deleteMessageService(id);
              await fetchMessages();
              if (onRefreshAll) onRefreshAll();
              if (isMessageModalOpen) setIsMessageModalOpen(false);
            } catch (error) {
              console.error('Error deleting message:', error);
            }
          }
        });
        return;
      }
      await updateMessageStatusService(id, status);
      await fetchMessages();
      if (onRefreshAll) onRefreshAll();
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  };

  const handleUpdateMessageReadStatus = async (id, newReadStatus) => {
    try {
      await updateMessageReadStatusService(id, newReadStatus);
      await fetchMessages();
      if (onRefreshAll) onRefreshAll();
    } catch (error) {
      console.error('Error updating message read status:', error);
    }
  };

  const handleRecuseAndRemove = async (id) => {
    await deleteMessageService(id);
    setIsMessageModalOpen(false);
    await fetchMessages();
    if (onRefreshAll) onRefreshAll();
  };

  const handleRegisterAsBeneficiary = async (selectedMsg) => {
    if (onRegisterAsBeneficiaryCallback) {
      onRegisterAsBeneficiaryCallback(selectedMsg);
    }
    await updateMessageStatusService(selectedMsg.id, 'Aceitado');
    await fetchMessages();
    if (onRefreshAll) onRefreshAll();
  };

  const openMessage = (msg) => {
    setSelectedMessage(msg);
    if (msg.read_status !== 'Lido') {
      handleUpdateMessageReadStatus(msg.id, 'Lido');
      msg.read_status = 'Lido';
    }
    setIsMessageModalOpen(true);
  };

  const handleDeleteMessage = (id) => {
    openConfirm({
      title: 'Eliminar Pedido de Apoio',
      message: 'Tem a certeza que deseja eliminar este pedido permanentemente? Esta acao e irreversivel.',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      type: 'danger',
      onConfirm: async () => {
        try {
          await deleteMessageService(id);
          await fetchMessages();
          if (onRefreshAll) onRefreshAll();
        } catch (error) {
          console.error('Error deleting message:', error);
        }
      }
    });
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

  const handleExportSupportPDF = async () => {
    const start = supportFilterStart || '2025-01-01';
    const end = supportFilterEnd || new Date().toISOString().split('T')[0];
    await triggerReportDownload(start, end, 'support', `relatorio_pedidos_apoio_${start}_a_${end}.pdf`);

    const filtered = getFilteredMessages();
    const pendingIds = filtered.filter(m => m.status === 'Pendente').map(m => m.id);
    if (pendingIds.length > 0) {
      try {
        await bulkUpdateMessageStatusService(pendingIds, 'Em Analise');
        await fetchMessages();
        if (onRefreshAll) onRefreshAll();
      } catch (err) {
        console.error('Erro ao atualizar estado para Em Analise:', err);
      }
    }
  };

  return {
    messages,
    setMessages,
    supportSearch,
    setSupportSearch,
    supportFilterStart,
    setSupportFilterStart,
    supportFilterEnd,
    setSupportFilterEnd,
    supportReadFilter,
    setSupportReadFilter,
    isMessageModalOpen,
    setIsMessageModalOpen,
    selectedMessage,
    setSelectedMessage,
    fetchMessages,
    handleUpdateMessageStatus,
    handleUpdateMessageReadStatus,
    handleRecuseAndRemove,
    handleRegisterAsBeneficiary,
    openMessage,
    handleDeleteMessage,
    getFilteredMessages,
    handleExportSupportPDF
  };
}
