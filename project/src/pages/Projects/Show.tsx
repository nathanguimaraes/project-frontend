/**
 * Página Show - Visualização detalhada de um projeto
 * Exibe todas as informações do projeto com opções de edição
 */

import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Calendar, 
  DollarSign, 
  Users, 
  User,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useProject } from '../../hooks/useProjects';
import { useMembers } from '../../hooks/useMembers';
import { useProjects } from '../../hooks/useProjects';
import { StatusBadge } from '../../components/UI/Badge';
import { PageLoadingSpinner } from '../../components/UI/LoadingSpinner';
import { PageErrorMessage } from '../../components/UI/ErrorMessage';
import { 
  formatCurrency, 
  formatDate, 
  calculateProjectDuration, 
  isProjectDelayed,
  canDeleteProject 
} from '../../utils';
import toast from 'react-hot-toast';

/**
 * Página de detalhes do projeto
 */
export const ProjectShow: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { project, loading, error } = useProject(Number(id));
  const { getMemberById } = useMembers();
  const { deleteProject } = useProjects();

  /**
   * Exclui o projeto após confirmação
   */
  const handleDelete = async () => {
    if (!project) return;

    const confirmed = window.confirm(
      `Tem certeza que deseja excluir o projeto "${project.nome}"?\n\nEsta ação não pode ser desfeita.`
    );

    if (confirmed) {
      const success = await deleteProject(project.id);
      if (success) {
        navigate('/');
      }
    }
  };

  // Estados de loading e erro
  if (loading) {
    return <PageLoadingSpinner text="Carregando projeto..." />;
  }

  if (error || !project) {
    return (
      <PageErrorMessage 
        message={error || 'Projeto não encontrado'} 
        onRetry={() => window.location.reload()}
      />
    );
  }

  // Busca informações dos membros
  const gerente = project.gerente;
  const membros = project.membros.map(id => getMemberById(id)).filter(Boolean);
  
  // Cálculos
  const duracaoPlanejada = calculateProjectDuration(project.dataInicio, project.previsaoTermino);
  const duracaoReal = project.dataRealTermino 
    ? calculateProjectDuration(project.dataInicio, project.dataRealTermino)
    : null;
  const isDelayed = isProjectDelayed(project);
  const canDelete = canDeleteProject(project.status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {project.nome}
            </h1>
            <div className="flex items-center space-x-3 mt-2">
              <StatusBadge status={project.status} size="md" />
              {isDelayed && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Atrasado</span>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to={`/projects/${project.id}/edit`}
            className="inline-flex items-center space-x-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>Editar</span>
          </Link>
          
          {canDelete && (
            <button
              onClick={handleDelete}
              className="inline-flex items-center space-x-2 px-4 py-2 text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Excluir</span>
            </button>
          )}
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações principais */}
        <div className="lg:col-span-2 space-y-6">
          {/* Descrição */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Descrição do Projeto
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {project.descricao}
            </p>
          </div>

          {/* Cronograma */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Cronograma
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Data de Início</p>
                    <p className="text-sm text-gray-600">{formatDate(project.dataInicio)}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-gray-900">Previsão de Término</p>
                    <p className="text-sm text-gray-600">{formatDate(project.previsaoTermino)}</p>
                  </div>
                </div>
              </div>

              {project.dataRealTermino && (
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">Data Real de Término</p>
                      <p className="text-sm text-gray-600">{formatDate(project.dataRealTermino)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Duração */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Duração Planejada</p>
                  <p className="text-lg font-semibold text-gray-900">{duracaoPlanejada} dias</p>
                </div>
                {duracaoReal && (
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Duração Real</p>
                    <p className="text-lg font-semibold text-gray-900">{duracaoReal} dias</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Equipe */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Equipe do Projeto
            </h2>
            
            <div className="space-y-4">
              {/* Gerente */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Gerente</h3>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-sm">
                      {gerente?.nome?.charAt(0)?.toUpperCase() || 'G'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{gerente?.nome || 'Não definido'}</p>
                    <p className="text-sm text-gray-600">{gerente?.cargo || 'Gerente'}</p>
                  </div>
                </div>
              </div>

              {/* Membros */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Membros da Equipe</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {membros.map((membro) => (
                    <div key={membro?.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-medium text-xs">
                          {membro?.nome?.charAt(0)?.toUpperCase() || 'M'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{membro?.nome || 'Membro'}</p>
                        <p className="text-sm text-gray-600">{membro?.cargo || 'Funcionário'}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {membros.length === 0 && (
                  <p className="text-gray-500 text-sm">Nenhum membro associado ao projeto</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Informações rápidas */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Informações do Projeto
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status</span>
                <StatusBadge status={project.status} />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Orçamento</span>
                <span className="font-medium">{formatCurrency(project.orcamentoTotal)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Nível de Risco</span>
                <span className="font-medium">{project.risco}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total de Membros</span>
                <span className="font-medium">{project.membros.length}</span>
              </div>
            </div>
          </div>

          {/* Ações rápidas */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Ações Rápidas
            </h2>
            
            <div className="space-y-3">
              <button
                onClick={() => navigate(`/projects/${project.id}/edit`)}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>Editar Projeto</span>
              </button>

              {canDelete && (
                <button
                  onClick={handleDelete}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Excluir Projeto</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};