/**
 * Página Dashboard - Página principal com Kanban Board
 * Exibe todos os projetos organizados por status em formato Kanban
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Filter, Search, RefreshCw } from 'lucide-react';
import { KanbanBoard } from '../../components/Projects/KanbanBoard';
import { LoadingSpinner, PageLoadingSpinner } from '../../components/UI/LoadingSpinner';
import { ErrorMessage, PageErrorMessage } from '../../components/UI/ErrorMessage';
import { useProjects } from '../../hooks/useProjects';
import { Project, ProjectStatus } from '../../interfaces';
import { STATUS_LABELS } from '../../interfaces';
import toast from 'react-hot-toast';

/**
 * Dashboard principal com Kanban Board
 */
export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { 
    projects, 
    loading, 
    error, 
    deleteProject, 
    refreshProjects,
    removeProjectFromList,
    addProjectToList
  } = useProjects();

  // Debug: Log dos projetos recebidos
  console.log('Dashboard - Projetos recebidos:', projects);
  console.log('Dashboard - Loading:', loading);
  console.log('Dashboard - Error:', error);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showEmptyColumns, setShowEmptyColumns] = useState(true);

  /**
   * Filtra projetos baseado na busca e filtros
   */
  const filteredProjects = React.useMemo(() => {
    let filtered = projects;

    // Debug: Log do filtro
    console.log('Filtro - Projetos originais:', projects.length);
    console.log('Filtro - Termo de busca:', searchTerm);
    console.log('Filtro - Status filtro:', statusFilter);

    // Filtro por termo de busca
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(project =>
        project.nome.toLowerCase().includes(term) ||
        project.descricao.toLowerCase().includes(term)
      );
    }

    // Filtro por status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => project.status === statusFilter);
    }

    console.log('Filtro - Projetos filtrados:', filtered.length);
    return filtered;
  }, [projects, searchTerm, statusFilter]);

  /**
   * Determina se deve mostrar colunas vazias
   */
  const shouldShowEmptyColumns = React.useMemo(() => {
    // Se há filtros ativos, não mostra colunas vazias
    if (searchTerm.trim() || statusFilter !== 'all') {
      return false;
    }
    return showEmptyColumns;
  }, [searchTerm, statusFilter, showEmptyColumns]);

  /**
   * Navega para edição do projeto
   */
  const handleEditProject = (project: Project) => {
    navigate(`/projects/${project.id}/edit`);
  };

  /**
   * Confirma e exclui projeto com atualização reativa
   */
  const handleDeleteProject = async (project: Project) => {
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir o projeto "${project.nome}"?`
    );
    
    if (confirmed) {
      // Remove otimisticamente da interface
      removeProjectFromList(project.id);
      
      try {
        await deleteProject(project.id);
        toast.success('Projeto excluído com sucesso!');
      } catch (error) {
        // Em caso de erro, adiciona de volta
        addProjectToList(project);
        toast.error('Erro ao excluir projeto. Tente novamente.');
      }
    }
  };

  /**
   * Atualiza a lista de projetos
   */
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshProjects();
    setIsRefreshing(false);
    toast.success('Projetos atualizados!');
  };

  // Estados de loading e erro
  if (loading) {
    return <PageLoadingSpinner text="Carregando projetos..." />;
  }

  if (error) {
    return (
      <PageErrorMessage 
        message={error} 
        onRetry={refreshProjects}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header da página */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard de Projetos
          </h1>
          <p className="text-gray-600 mt-1">
            Gerencie seus projetos através do quadro Kanban
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center space-x-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Atualizar</span>
          </button>

          <button
            onClick={() => navigate('/projects/create')}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Projeto</span>
          </button>
        </div>
      </div>

      {/* Filtros e busca */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Busca */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar projetos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Filtro por status */}
          <div className="sm:w-64">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | 'all')}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
              >
                <option value="all">Todos os Status</option>
                {Object.entries(STATUS_LABELS).map(([status, label]) => (
                  <option key={status} value={status}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Controle de visualização */}
          <div className="sm:w-auto">
            <label className="flex items-center space-x-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={showEmptyColumns}
                onChange={(e) => setShowEmptyColumns(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Mostrar colunas vazias</span>
            </label>
          </div>
        </div>

        {/* Indicador de filtros ativos */}
        {(searchTerm.trim() || statusFilter !== 'all') && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Filtros ativos:</span>
                {searchTerm.trim() && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Busca: "{searchTerm}"
                  </span>
                )}
                {statusFilter !== 'all' && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Status: {STATUS_LABELS[statusFilter]}
                  </span>
                )}
                <span className="text-gray-500">
                  • {filteredProjects.length} de {projects.length} projetos
                </span>
              </div>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                Limpar filtros
              </button>
            </div>
          </div>
        )}

        {/* Estatísticas rápidas */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{projects.length}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {projects.filter(p => ['INICIADO', 'PLANEJADO', 'EM_ANDAMENTO'].includes(p.status)).length}
              </p>
              <p className="text-sm text-gray-600">Ativos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {projects.filter(p => p.status === 'ENCERRADO').length}
              </p>
              <p className="text-sm text-gray-600">Encerrados</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {projects.filter(p => p.status === 'CANCELADO').length}
              </p>
              <p className="text-sm text-gray-600">Cancelados</p>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Plus className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || statusFilter !== 'all' 
                ? 'Nenhum projeto encontrado' 
                : 'Nenhum projeto cadastrado'
              }
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'all'
                ? 'Tente ajustar os filtros de busca'
                : 'Comece criando seu primeiro projeto'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <button
                onClick={() => navigate('/projects/create')}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Criar Primeiro Projeto</span>
              </button>
            )}
          </div>
        ) : (
          <KanbanBoard
            projects={filteredProjects}
            onEditProject={handleEditProject}
            onDeleteProject={handleDeleteProject}
            showEmptyColumns={shouldShowEmptyColumns}
          />
        )}
      </div>
    </div>
  );
};