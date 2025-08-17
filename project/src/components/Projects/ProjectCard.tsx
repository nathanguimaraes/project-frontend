/**
 * Componente ProjectCard - Card individual de projeto para o Kanban
 * Exibe informações resumidas do projeto com ações rápidas
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, DollarSign, Users, Edit, Trash2, Eye } from 'lucide-react';
import { Project } from '../../interfaces';
import { StatusBadge, RiskBadge } from '../UI/Badge';
import { formatCurrency, formatDate, canDeleteProject } from '../../utils';
import { useMembers } from '../../hooks/useMembers';

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
  isDragging?: boolean;
}

/**
 * Card de projeto para exibição no Kanban
 */
export const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  onEdit, 
  onDelete,
  isDragging = false
}) => {
  const { getMemberById } = useMembers();
  
  // Busca informações do gerente
  const gerente = getMemberById(project.gerenteId);
  
  // Verifica se pode excluir o projeto
  const canDelete = canDeleteProject(project.status);

  return (
    <div className={`
      bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-200
      ${isDragging ? 'opacity-50 rotate-2 scale-105' : ''}
    `}>
      {/* Header do card */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 truncate">
            {project.nome}
          </h3>
          <div className="flex items-center space-x-2 mt-1">
            <StatusBadge status={project.status} />
            <RiskBadge risk={project.risco} />
          </div>
        </div>
        
        {/* Menu de ações */}
        <div className="flex items-center space-x-1 ml-2">
          <Link
            to={`/projects/${project.id}`}
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Ver detalhes"
          >
            <Eye className="w-4 h-4" />
          </Link>
          
          {onEdit && (
            <button
              onClick={() => onEdit(project)}
              className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
              title="Editar projeto"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
          
          {onDelete && canDelete && (
            <button
              onClick={() => onDelete(project)}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Excluir projeto"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Descrição */}
      <p className="text-xs text-gray-600 mb-3 line-clamp-2">
        {project.descricao}
      </p>

      {/* Informações principais */}
      <div className="space-y-2">
        {/* Orçamento */}
        <div className="flex items-center text-xs text-gray-600">
          <DollarSign className="w-3 h-3 mr-1.5 text-green-500" />
          <span>{formatCurrency(project.orcamento)}</span>
        </div>

        {/* Datas */}
        <div className="flex items-center text-xs text-gray-600">
          <Calendar className="w-3 h-3 mr-1.5 text-blue-500" />
          <span>
            {formatDate(project.dataInicio)} - {formatDate(project.previsaoTermino)}
          </span>
        </div>

        {/* Membros */}
        <div className="flex items-center text-xs text-gray-600">
          <Users className="w-3 h-3 mr-1.5 text-purple-500" />
          <span>{project.membrosIds.length} membros</span>
        </div>

        {/* Gerente */}
        {gerente && (
          <div className="flex items-center mt-2">
            <div className="flex items-center space-x-2">
              {gerente.avatar && (
                <img
                  src={gerente.avatar}
                  alt={gerente.nome}
                  className="w-5 h-5 rounded-full object-cover"
                />
              )}
              <span className="text-xs text-gray-600 truncate">
                {gerente.nome}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Data real de término (se encerrado) */}
      {project.status === 'encerrado' && project.dataRealTermino && (
        <div className="mt-3 pt-2 border-t border-gray-100">
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="w-3 h-3 mr-1.5" />
            <span>Encerrado em: {formatDate(project.dataRealTermino)}</span>
          </div>
        </div>
      )}
    </div>
  );
};