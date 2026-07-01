import { useState, useEffect } from 'react';
import { 
  Loader2, 
  Plus, 
  Download,
  FolderKanban,
  UserCheck,
  MessageSquare,
  BookOpen,
  Handshake,
  Users,
  Heart,
  FileText,
  Newspaper
} from 'lucide-react';

// Authentication
import { loginAdmin, logoutAdmin, getCurrentSession } from '../../auth/services/authApi';

// Custom Hooks for Admin CRUD Modules
import { useAdminProjects } from '../../projetos/hooks/useAdminProjects';
import { useAdminVolunteers } from '../../voluntarios/hooks/useAdminVolunteers';
import { useAdminSupport } from '../../suporte/hooks/useAdminSupport';
import { useAdminBeneficiaries } from '../../beneficiarios/hooks/useAdminBeneficiaries';
import { useAdminPartners } from '../../parceiros/hooks/useAdminPartners';
import { useAdminTeam } from '../../equipa/hooks/useAdminTeam';
import { useAdminDocuments } from '../../equipa/hooks/useAdminDocuments';
import { useAdminDonations } from '../../doacoes/hooks/useAdminDonations';
import { useAdminNews } from '../../noticias/hooks/useAdminNews';

// Components
import AdminLogin from '../../auth/components/AdminLogin';
import AdminSidebar from '../components/AdminSidebar';
import ConfirmModal from '../components/ConfirmModal';
import ProjectsTab from '../../projetos/components/ProjectsTab';
import ProjectModal from '../../projetos/components/ProjectModal';
import VolunteersTab from '../../voluntarios/components/VolunteersTab';
import VolunteerModal from '../../voluntarios/components/VolunteerModal';
import SupportTab from '../../suporte/components/SupportTab';
import MessageModal from '../../suporte/components/MessageModal';
import BeneficiariesTab from '../../beneficiarios/components/BeneficiariesTab';
import BeneficiaryModal from '../../beneficiarios/components/BeneficiaryModal';
import PartnersTab from '../../parceiros/components/PartnersTab';
import PartnerModal from '../../parceiros/components/PartnerModal';
import TeamTab from '../../equipa/components/TeamTab';
import TeamModal from '../../equipa/components/TeamModal';
import DonationsTab from '../../doacoes/components/DonationsTab';
import DocumentTab from '../../equipa/components/DocumentTab';
import DocumentModal from '../../equipa/components/DocumentModal';
import NewsTab from '../../noticias/components/NewsTab';
import NewsModal from '../../noticias/components/NewsModal';

const statusSelectClasses = (status) => {
  const base = "px-2.5 py-1 text-xs font-semibold rounded-lg border focus:ring-2 focus:ring-brand-horizon cursor-pointer transition-all outline-none appearance-none pr-7 bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_8px_center] bg-no-repeat";
  
  if (status === 'Pendente' || status === 'Planeamento') {
    return `${base} bg-feedback-warningLight text-amber-700 border-amber-200 hover:bg-feedback-warningBorder`;
  }
  if (status === 'Em Analise' || status === 'Em Curso' || status === 'Novo') {
    return `${base} bg-brand-poloBlue/15 text-brand-eastBay border-brand-poloBlue/30 hover:bg-brand-poloBlue/20`;
  }
  if (status === 'Aprovado' || status === 'Concluido' || status === 'Aceitado') {
    return `${base} bg-feedback-successLight text-feedback-success border-emerald-200 hover:bg-feedback-successBorder`;
  }
  return `${base} bg-feedback-errorLight text-feedback-error border-feedback-errorBorder hover:bg-feedback-errorBorder`;
};

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Check auth session on mount
  useEffect(() => {
    getCurrentSession().then((session) => {
      setIsLoggedIn(!!session);
      setAuthChecked(true);
    }).catch(() => {
      setIsLoggedIn(false);
      setAuthChecked(true);
    });
  }, []);

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('projects');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Confirm Modal state and helper
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: '',
    cancelText: '',
    type: 'danger',
    onConfirm: () => {}
  });

  const openConfirm = ({ title, message, confirmText, cancelText, type = 'danger', onConfirm }) => {
    setConfirmConfig({
      isOpen: true,
      title,
      message,
      confirmText,
      cancelText,
      type,
      onConfirm
    });
  };

  // Shared refresh function
  const onRefreshAll = () => {
    projectsHook.fetchProjectsAndMeta();
    volunteersHook.fetchVolunteers();
    supportHook.fetchMessages();
    beneficiariesHook.fetchBeneficiaries();
    partnersHook.fetchPartners();
    teamHook.fetchTeam();
    documentsHook.fetchDocuments();
    donationsHook.fetchDonations();
    newsHook.fetchNews();
  };

  // Callback to convert Message to Beneficiary Story
  const onRegisterAsBeneficiaryCallback = (selectedMsg) => {
    beneficiariesHook.setEditingBeneficiary(null);
    beneficiariesHook.beneficiaryForm.reset({
      full_name: selectedMsg.name,
      story: `Fez um pedido de apoio com o assunto "${selectedMsg.subject}".\n\nMensagem:\n${selectedMsg.message}`,
      project_id: '',
      image_url: '',
      image_data: ''
    });
    beneficiariesHook.setIsBeneficiaryModalOpen(true);
  };

  // Initialize Hooks
  const projectsHook = useAdminProjects(openConfirm, onRefreshAll);
  const volunteersHook = useAdminVolunteers(openConfirm, onRefreshAll);
  const supportHook = useAdminSupport(openConfirm, onRefreshAll, onRegisterAsBeneficiaryCallback);
  const beneficiariesHook = useAdminBeneficiaries(openConfirm, onRefreshAll);
  const partnersHook = useAdminPartners(openConfirm, onRefreshAll);
  const teamHook = useAdminTeam(openConfirm, onRefreshAll);
  const documentsHook = useAdminDocuments(openConfirm, onRefreshAll);
  const donationsHook = useAdminDonations(openConfirm, onRefreshAll);
  const newsHook = useAdminNews(openConfirm, onRefreshAll);

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  async function fetchData() {
    try {
      setLoading(true);
      await Promise.all([
        projectsHook.fetchProjectsAndMeta(),
        volunteersHook.fetchVolunteers(),
        supportHook.fetchMessages(),
        beneficiariesHook.fetchBeneficiaries(),
        partnersHook.fetchPartners(),
        teamHook.fetchTeam(),
        documentsHook.fetchDocuments(),
        donationsHook.fetchDonations(),
        newsHook.fetchNews()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      await loginAdmin(email, password);
      setIsLoggedIn(true);
    } catch (error) {
      setLoginError(error.message || 'Credenciais invalidas. Tente novamente.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-poloBlue/15">
        <Loader2 className="animate-spin text-brand-horizon" size={48} />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <AdminLogin
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        handleLogin={handleLogin}
        loginError={loginError}
        loginLoading={loginLoading}
      />
    );
  }

  const menuItems = [
    { id: 'projects', label: 'Projetos', icon: <FolderKanban size={18} /> },
    { id: 'volunteers', label: 'Voluntarios', icon: <UserCheck size={18} /> },
    { id: 'support', label: 'Pedidos de Apoio', icon: <MessageSquare size={18} /> },
    { id: 'beneficiaries', label: 'Historias', icon: <BookOpen size={18} /> },
    { id: 'partners', label: 'Parceiros', icon: <Handshake size={18} /> },
    { id: 'team', label: 'Equipa', icon: <Users size={18} /> },
    { id: 'documents', label: 'Documentos', icon: <FileText size={18} /> },
    { id: 'donations', label: 'Nossos Doadores', icon: <Heart size={18} /> },
    { id: 'news', label: 'Noticias', icon: <Newspaper size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-brand-poloBlue/15 flex flex-col lg:flex-row">
      <AdminSidebar
        menuItems={menuItems}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleLogout={handleLogout}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <main className="flex-grow lg:ml-64 p-4 md:p-8 min-h-screen">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-brand-bigStone dark:text-dark-text">
              {activeTab === 'projects' ? 'Gestao de Projetos' :
                activeTab === 'volunteers' ? 'Gestao de Voluntarios' :
                  activeTab === 'beneficiaries' ? 'Historias de Beneficiarios' :
                    activeTab === 'support' ? 'Pedidos de Apoio' :
                      activeTab === 'partners' ? 'Gestao de Parceiros' :
                        activeTab === 'team' ? 'Gestao da Equipa' :
                          activeTab === 'documents' ? 'Gestao de Documentos' :
                            activeTab === 'donations' ? 'Nossos Doadores' :
                              activeTab === 'news' ? 'Gestao de Noticias' : ''}
            </h1>
            <p className="text-sm text-brand-eastBay dark:text-dark-muted mt-0.5">
              {activeTab === 'projects'
                ? `${projectsHook.projects.length} projetos registados`
                : activeTab === 'volunteers'
                  ? `${volunteersHook.volunteers.filter(v => v.status === 'Pendente').length} pendentes, ${volunteersHook.volunteers.filter(v => v.status === 'Em Analise').length} em analise, ${volunteersHook.volunteers.filter(v => v.status === 'Aprovado').length} aprovados`
                  : activeTab === 'beneficiaries'
                    ? `${beneficiariesHook.beneficiaries.length} historias registadas`
                    : activeTab === 'support'
                      ? `${supportHook.messages.filter(m => m.status === 'Pendente').length} pendentes, ${supportHook.messages.filter(m => m.status === 'Em Analise').length} em analise`
                      : activeTab === 'partners'
                        ? `${partnersHook.partners.length} parceiros registados`
                        : activeTab === 'team'
                          ? `${teamHook.team.length} membros registados`
                          : activeTab === 'documents'
                            ? `${documentsHook.documents.length} documentos registados`
                            : activeTab === 'donations'
                              ? `${donationsHook.donations.length} doadores registados`
                              : activeTab === 'news'
                                ? `${newsHook.newsList.length} noticias registadas`
                                : ''
              }
            </p>
          </div>
          <div className="flex items-center gap-3 self-start sm:self-auto">
            {activeTab === 'volunteers' && (
              <button
                onClick={volunteersHook.handleExportVolunteersPDF}
                className="btn-secondary flex items-center gap-1.5 cursor-pointer"
              >
                <Download size={18} /> Exportar PDF
              </button>
            )}
            {activeTab !== 'support' && activeTab !== 'donations' && activeTab !== 'beneficiaries' && activeTab !== 'volunteers' && activeTab !== 'news' && (
              <button
                onClick={() => {
                  if (activeTab === 'projects') {
                    projectsHook.openNewProject();
                  } else if (activeTab === 'partners') {
                    partnersHook.openNewPartner();
                  } else if (activeTab === 'team') {
                    teamHook.openNewTeamMember();
                  } else if (activeTab === 'documents') {
                    documentsHook.openNewDocument();
                  }
                }}
                className="btn-primary flex items-center gap-1.5 cursor-pointer"
              >
                <Plus size={18} /> {activeTab === 'projects' ? 'Novo Projeto' : activeTab === 'partners' ? 'Novo Parceiro' : activeTab === 'documents' ? 'Novo Documento' : 'Novo Membro'}
              </button>
            )}
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center py-32">
            <Loader2 className="animate-spin text-brand-horizon" size={48} />
          </div>
        ) : activeTab === 'projects' ? (
          <ProjectsTab
            projects={projectsHook.projects}
            statusSelectClasses={statusSelectClasses}
            updateProjectStatus={projectsHook.handleUpdateProjectStatus}
            openEdit={projectsHook.openEditProject}
            deleteProject={projectsHook.handleDeleteProject}
          />
        ) : activeTab === 'volunteers' ? (
          <VolunteersTab
            volunteers={volunteersHook.volunteers}
            projects={projectsHook.projects}
            statusSelectClasses={statusSelectClasses}
            volunteerSearch={volunteersHook.volunteerSearch}
            setVolunteerSearch={volunteersHook.setVolunteerSearch}
            volunteerReadFilter={volunteersHook.volunteerReadFilter}
            setVolunteerReadFilter={volunteersHook.setVolunteerReadFilter}
            volunteerFilterStart={volunteersHook.volunteerFilterStart}
            setVolunteerFilterStart={volunteersHook.setVolunteerFilterStart}
            volunteerFilterEnd={volunteersHook.volunteerFilterEnd}
            setVolunteerFilterEnd={volunteersHook.setVolunteerFilterEnd}
            getFilteredVolunteers={volunteersHook.getFilteredVolunteers}
            updateVolunteerStatus={volunteersHook.handleUpdateVolunteerStatus}
            updateVolunteerReadStatus={volunteersHook.handleUpdateVolunteerReadStatus}
            openVolunteerEdit={volunteersHook.openVolunteerEdit}
            deleteVolunteer={volunteersHook.handleDeleteVolunteer}
            exportVolunteersPDF={volunteersHook.handleExportVolunteersPDF}
          />
        ) : activeTab === 'support' ? (
          <SupportTab
            messages={supportHook.messages}
            statusSelectClasses={statusSelectClasses}
            supportSearch={supportHook.supportSearch}
            setSupportSearch={supportHook.setSupportSearch}
            supportReadFilter={supportHook.supportReadFilter}
            setSupportReadFilter={supportHook.setSupportReadFilter}
            supportFilterStart={supportHook.supportFilterStart}
            setSupportFilterStart={supportHook.setSupportFilterStart}
            supportFilterEnd={supportHook.supportFilterEnd}
            setSupportFilterEnd={supportHook.setSupportFilterEnd}
            getFilteredMessages={supportHook.getFilteredMessages}
            updateMessageStatus={supportHook.handleUpdateMessageStatus}
            updateMessageReadStatus={supportHook.handleUpdateMessageReadStatus}
            openMessage={supportHook.openMessage}
            deleteMessage={supportHook.handleDeleteMessage}
            exportSupportPDF={supportHook.handleExportSupportPDF}
          />
        ) : activeTab === 'partners' ? (
          <PartnersTab
            partners={partnersHook.partners}
            deletePartner={partnersHook.handleDeletePartner}
          />
        ) : activeTab === 'team' ? (
          <TeamTab
            team={teamHook.team}
            openEditTeamMember={teamHook.openEditTeamMember}
            deleteTeamMember={teamHook.handleDeleteTeamMember}
          />
        ) : activeTab === 'donations' ? (
          <DonationsTab
            donations={donationsHook.donations}
            donationFilterStart={donationsHook.donationFilterStart}
            setDonationFilterStart={donationsHook.setDonationFilterStart}
            donationFilterEnd={donationsHook.donationFilterEnd}
            setDonationFilterEnd={donationsHook.setDonationFilterEnd}
            getFilteredDonations={donationsHook.getFilteredDonations}
            fetchData={donationsHook.fetchDonations}
            exportDonationsPDF={donationsHook.handleExportDonationsPDF}
            statusSelectClasses={statusSelectClasses}
            updateDonationStatus={donationsHook.handleUpdateDonationStatus}
          />
        ) : activeTab === 'beneficiaries' ? (
          <BeneficiariesTab
            beneficiaries={beneficiariesHook.beneficiaries}
            projects={projectsHook.projects}
            openBeneficiaryEdit={beneficiariesHook.openBeneficiaryEdit}
            deleteBeneficiary={beneficiariesHook.handleDeleteBeneficiary}
            onCreateNew={beneficiariesHook.openNewBeneficiary}
          />
        ) : activeTab === 'documents' ? (
          <DocumentTab
            documents={documentsHook.documents}
            openEditDocument={documentsHook.openEditDocument}
            deleteDocument={documentsHook.handleDeleteDocument}
          />
        ) : activeTab === 'news' ? (
          <NewsTab
            newsList={newsHook.newsList}
            openNew={newsHook.openNewNews}
            openEdit={newsHook.openNewsEdit}
            handleDelete={newsHook.handleDeleteNews}
          />
        ) : null}
      </main>

      <ProjectModal
        isOpen={projectsHook.isModalOpen}
        onClose={() => { projectsHook.setIsModalOpen(false); projectsHook.setSelectedFile(null); projectsHook.setUploadPreview(null); }}
        editingProject={projectsHook.editingProject}
        projectForm={projectsHook.projectForm}
        galleryFields={projectsHook.galleryFields}
        appendGallery={projectsHook.appendGallery}
        removeGallery={projectsHook.removeGallery}
        selectedFile={projectsHook.selectedFile}
        setSelectedFile={projectsHook.setSelectedFile}
        uploadPreview={projectsHook.uploadPreview}
        setUploadPreview={projectsHook.setUploadPreview}
        isUploading={projectsHook.isUploading}
        isGalleryUploading={projectsHook.isGalleryUploading}
        handleGalleryFiles={projectsHook.handleGalleryFiles}
        team={teamHook.team}
        activities={projectsHook.activities}
        pillars={projectsHook.pillars}
        onSubmit={projectsHook.handleProjectSubmit}
      />

      <VolunteerModal
        isOpen={volunteersHook.isVolunteerModalOpen}
        onClose={() => volunteersHook.setIsVolunteerModalOpen(false)}
        editingVolunteer={volunteersHook.editingVolunteer}
        setEditingVolunteer={volunteersHook.setEditingVolunteer}
        updateVolunteerStatus={volunteersHook.handleUpdateVolunteerStatus}
        updateVolunteerReadStatus={volunteersHook.handleUpdateVolunteerReadStatus}
      />

      <MessageModal
        isOpen={supportHook.isMessageModalOpen}
        onClose={() => supportHook.setIsMessageModalOpen(false)}
        selectedMessage={supportHook.selectedMessage}
        setSelectedMessage={supportHook.setSelectedMessage}
        updateMessageStatus={supportHook.handleUpdateMessageStatus}
        updateMessageReadStatus={supportHook.handleUpdateMessageReadStatus}
        onRegisterAsBeneficiary={supportHook.handleRegisterAsBeneficiary}
        onRecuseAndRemove={supportHook.handleRecuseAndRemove}
      />

      <BeneficiaryModal
        isOpen={beneficiariesHook.isBeneficiaryModalOpen}
        onClose={() => beneficiariesHook.setIsBeneficiaryModalOpen(false)}
        projects={projectsHook.projects}
        editingBeneficiary={beneficiariesHook.editingBeneficiary}
        beneficiaryForm={beneficiariesHook.beneficiaryForm}
        onBeneficiarySubmit={beneficiariesHook.handleBeneficiarySubmit}
      />

      <PartnerModal
        isOpen={partnersHook.isPartnerModalOpen}
        onClose={() => partnersHook.setIsPartnerModalOpen(false)}
        newPartner={partnersHook.newPartner}
        setNewPartner={partnersHook.setNewPartner}
        addPartner={partnersHook.handleAddPartner}
      />

      <TeamModal
        isOpen={teamHook.isTeamModalOpen}
        onClose={() => teamHook.setIsTeamModalOpen(false)}
        editingTeamMember={teamHook.editingTeamMember}
        newTeamMember={teamHook.newTeamMember}
        setNewTeamMember={teamHook.setNewTeamMember}
        addOrUpdateTeamMember={teamHook.handleAddOrUpdateTeamMember}
      />

      <DocumentModal
        isOpen={documentsHook.isDocumentModalOpen}
        onClose={() => { documentsHook.setIsDocumentModalOpen(false); documentsHook.setSelectedDocumentFile(null); }}
        editingDocument={documentsHook.editingDocument}
        newDocument={documentsHook.newDocument}
        setNewDocument={documentsHook.setNewDocument}
        selectedFile={documentsHook.selectedDocumentFile}
        setSelectedFile={documentsHook.setSelectedDocumentFile}
        addOrUpdateDocument={documentsHook.handleAddOrUpdateDocument}
        isUploading={documentsHook.isDocumentUploading}
      />

      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmText={confirmConfig.confirmText}
        cancelText={confirmConfig.cancelText}
        type={confirmConfig.type}
      />

      <NewsModal
        isOpen={newsHook.isNewsModalOpen}
        onClose={() => {
          newsHook.setIsNewsModalOpen(false);
          newsHook.setEditingNews(null);
        }}
        newsItem={newsHook.editingNews}
        onSave={newsHook.handleNewsSave}
      />
    </div>
  );
}
