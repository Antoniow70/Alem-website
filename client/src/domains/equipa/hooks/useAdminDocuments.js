import { useState } from 'react';
import { 
  getDocuments, 
  saveDocument, 
  deleteDocument as deleteDocumentService, 
  uploadFileToStorage as uploadDocumentFileService 
} from '../services/documentosApi';

export function useAdminDocuments(openConfirm, onRefreshAll) {
  const [documents, setDocuments] = useState([]);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);
  const [newDocument, setNewDocument] = useState({ title: '', description: '', file_url: '', file_data: '' });
  const [selectedDocumentFile, setSelectedDocumentFile] = useState(null);
  const [isDocumentUploading, setIsDocumentUploading] = useState(false);

  const fetchDocuments = async () => {
    try {
      const data = await getDocuments();
      setDocuments(data || []);
    } catch (err) {
      console.error('Error fetching documents:', err);
    }
  };

  const handleAddOrUpdateDocument = async () => {
    if (!newDocument.title?.trim()) {
      alert('O titulo do documento e obrigatorio.');
      return;
    }
    setIsDocumentUploading(true);
    try {
      let finalFileUrl = newDocument.file_url || '';

      if (selectedDocumentFile) {
        const { error, publicUrl } = await uploadDocumentFileService(selectedDocumentFile, 'documents');
        if (error) {
          console.warn('Storage upload failed, fallback to base64:', error);
          const reader = new FileReader();
          const base64Promise = new Promise((res, rej) => {
            reader.onload = () => res(reader.result);
            reader.onerror = (e) => rej(e);
            reader.readAsDataURL(selectedDocumentFile);
          });
          finalFileUrl = await base64Promise;
        } else {
          finalFileUrl = publicUrl;
        }
      }

      const payload = {
        title: newDocument.title,
        description: newDocument.description || '',
        file_url: finalFileUrl,
        file_data: finalFileUrl.startsWith('data:') ? finalFileUrl : ''
      };

      await saveDocument(payload, editingDocument?.id);
      setNewDocument({ title: '', description: '', file_url: '', file_data: '' });
      setSelectedDocumentFile(null);
      setEditingDocument(null);
      setIsDocumentModalOpen(false);
      await fetchDocuments();
      if (onRefreshAll) onRefreshAll();
    } catch (err) {
      console.error('Error saving document:', err);
      alert('Erro ao guardar documento.');
    } finally {
      setIsDocumentUploading(false);
    }
  };

  const handleDeleteDocument = (id) => {
    openConfirm({
      title: 'Remover Documento',
      message: 'Tem a certeza que deseja eliminar este documento? Esta acao e irreversivel.',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      type: 'danger',
      onConfirm: async () => {
        try {
          await deleteDocumentService(id);
          await fetchDocuments();
          if (onRefreshAll) onRefreshAll();
        } catch (err) {
          console.error('Error deleting document:', err);
        }
      }
    });
  };

  const openEditDocument = (doc) => {
    setEditingDocument(doc);
    setNewDocument(doc);
    setSelectedDocumentFile(null);
    setIsDocumentModalOpen(true);
  };

  const openNewDocument = () => {
    setEditingDocument(null);
    setNewDocument({ title: '', description: '', file_url: '', file_data: '' });
    setSelectedDocumentFile(null);
    setIsDocumentModalOpen(true);
  };

  return {
    documents,
    setDocuments,
    isDocumentModalOpen,
    setIsDocumentModalOpen,
    editingDocument,
    setEditingDocument,
    newDocument,
    setNewDocument,
    selectedDocumentFile,
    setSelectedDocumentFile,
    isDocumentUploading,
    fetchDocuments,
    handleAddOrUpdateDocument,
    handleDeleteDocument,
    openEditDocument,
    openNewDocument
  };
}
