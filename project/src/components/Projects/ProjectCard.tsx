/**
 * Componente ProjectCard - Card individual de projeto para o Kanban
 * Exibe informações resumidas do projeto com ações rápidas
 * Integrado com o backend Spring Boot
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, DollarSign, Users, Edit, Trash2, Eye } from 'lucide-react';
import { Project } from '../../interfaces';
import { StatusBadge } from '../UI/Badge';
import { formatCurrency, formatDate, canDeleteProject } from '../../utils';

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
  // Verifica se pode excluir o projeto
  const canDelete = canDeleteProject(project.status);

  return (
    <div className={`
      bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md 
      transition-all duration-200 ease-in-out transform hover:scale-[1.02]
      ${isDragging ? 'opacity-50 rotate-2 scale-105 shadow-lg' : ''}
    `}>
      {/* Header do card */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 truncate">
            {project.nome}
          </h3>
          <div className="flex items-center space-x-2 mt-1">
            <StatusBadge status={project.status} />
            {/* Indicador de risco */}
            <div className={`
              w-2 h-2 rounded-full 
              ${project.risco === 'Baixo' ? 'bg-green-400' : 
                project.risco === 'Medio' ? 'bg-yellow-400' : 'bg-red-400'}
            `} />
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
          <span>{formatCurrency(project.orcamentoTotal)}</span>
        </div>

        {/* Datas */}
        <div className="flex items-center text-xs text-gray-600">
          <Calendar className="w-3 h-3 mr-1.5 text-blue-500" />
          <span>
            {formatDate(project.dataInicio)} - {formatDate(project.previsaoTermino)}
          </span>
        </div>

        {/* Gerente */}
        <div className="flex items-center text-xs text-gray-600">
          <Users className="w-3 h-3 mr-1.5 text-purple-500" />
          <span className="truncate">
            Gerente: {project.gerente?.nome || 'Não definido'}
          </span>
        </div>

        {/* Número de membros */}
        <div className="flex items-center text-xs text-gray-600">
          <Users className="w-3 h-3 mr-1.5 text-indigo-500" />
          <span>
            {project.membros?.length || 0} membro{project.membros?.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Risco */}
        {project.risco && (
          <div className="flex items-center text-xs text-gray-600">
            <span className="w-2 h-2 rounded-full bg-yellow-400 mr-1.5"></span>
            <span>Risco: {project.risco}</span>
          </div>
        )}
      </div>
    </div>
  );
};