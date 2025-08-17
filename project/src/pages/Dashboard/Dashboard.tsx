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
    refreshProjects 
  } = useProjects();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  /**
   * Filtra projetos baseado na busca e filtros
   */
  const filteredProjects = React.useMemo(() => {
    let filtered = projects;

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

    return filtered;
  }, [projects, searchTerm, statusFilter]);

  /**
   * Navega para edição do projeto
   */
  const handleEditProject = (project: Project) => {
    navigate(`/projects/${project.id}/edit`);
  };

  /**
   * Confirma e exclui projeto
   */
  const handleDeleteProject = async (project: Project) => {
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir o projeto "${project.nome}"?`
    );
    
    if (confirmed) {
      await deleteProject(project.id);
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
        </div>

        {/* Estatísticas rápidas */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{projects.length}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {projects.filter(p => ['iniciado', 'planejado', 'em_andamento'].includes(p.status)).length}
              </p>
              <p className="text-sm text-gray-600">Ativos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {projects.filter(p => p.status === 'encerrado').length}
              </p>
              <p className="text-sm text-gray-600">Encerrados</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {projects.filter(p => p.status === 'cancelado').length}
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
          />
        )}
      </div>
    </div>
  );
};