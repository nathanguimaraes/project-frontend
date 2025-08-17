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
import { StatusBadge, RiskBadge } from '../../components/UI/Badge';
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
  const { project, loading, error } = useProject(id!);
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
  const gerente = getMemberById(project.gerenteId);
  const membros = project.membrosIds.map(id => getMemberById(id)).filter(Boolean);
  
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
              <RiskBadge risk={project.risco} size="md" />
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
                  <Clock className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-gray-900">Previsão de Término</p>
                    <p className="text-sm text-gray-600">{formatDate(project.previsaoTermino)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {duracaoPlanejada} dias
                  </p>
                  <p className="text-xs text-gray-500">Duração planejada</p>
                </div>
              </div>

              {project.dataRealTermino && (
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">Data Real de Término</p>
                      <p className="text-sm text-gray-600">{formatDate(project.dataRealTermino)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {duracaoReal} dias
                    </p>
                    <p className="text-xs text-gray-500">Duração real</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Equipe */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Equipe do Projeto
            </h2>

            {/* Gerente */}
            {gerente && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Gerente</h3>
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  {gerente.avatar && (
                    <img
                      src={gerente.avatar}
                      alt={gerente.nome}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{gerente.nome}</p>
                    <p className="text-sm text-gray-600">{gerente.email}</p>
                  </div>
                  <User className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            )}

            {/* Membros */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Membros ({membros.length})
              </h3>
              <div className="space-y-2">
                {membros.map((membro) => (
                  <div key={membro.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    {membro.avatar && (
                      <img
                        src={membro.avatar}
                        alt={membro.nome}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{membro.nome}</p>
                      <p className="text-sm text-gray-600">{membro.email}</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {membro.projetosAtivos}/3 projetos
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar com informações resumidas */}
        <div className="space-y-6">
          {/* Orçamento */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <DollarSign className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Orçamento</h3>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(project.orcamento)}
            </p>
          </div>

          {/* Estatísticas */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Estatísticas
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Duração Planejada</span>
                <span className="font-medium">{duracaoPlanejada} dias</span>
              </div>
              
              {duracaoReal && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Duração Real</span>
                  <span className="font-medium">{duracaoReal} dias</span>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Membros</span>
                <span className="font-medium">{project.membrosIds.length}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Nível de Risco</span>
                <RiskBadge risk={project.risco} />
              </div>
            </div>
          </div>

          {/* Histórico */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Histórico
            </h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Criado em:</span>
                <span className="font-medium">
                  {formatDate(project.createdAt.split('T')[0])}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Última atualização:</span>
                <span className="font-medium">
                  {formatDate(project.updatedAt.split('T')[0])}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};