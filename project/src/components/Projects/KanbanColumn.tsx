/**
 * Componente KanbanColumn - Coluna do quadro Kanban
 * Representa uma coluna de status com projetos arrastáveis
 */

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Project, ProjectStatus } from '../../interfaces';
import { ProjectCard } from './ProjectCard';
import { SortableProjectCard } from './SortableProjectCard';
import { STATUS_LABELS } from '../../interfaces';

interface KanbanColumnProps {
  status: ProjectStatus;
  projects: Project[];
  onEditProject?: (project: Project) => void;
  onDeleteProject?: (project: Project) => void;
}

/**
 * Coluna do Kanban que aceita drop de projetos
 */
export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  status,
  projects,
  onEditProject,
  onDeleteProject
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  // Cores para diferentes status
  const getColumnColor = (status: ProjectStatus) => {
    const colors = {
      em_analise: 'border-gray-300 bg-gray-50',
      analise_realizada: 'border-blue-300 bg-blue-50',
      analise_aprovada: 'border-indigo-300 bg-indigo-50',
      iniciado: 'border-purple-300 bg-purple-50',
      planejado: 'border-cyan-300 bg-cyan-50',
      em_andamento: 'border-orange-300 bg-orange-50',
      encerrado: 'border-green-300 bg-green-50',
      cancelado: 'border-red-300 bg-red-50'
    };
    return colors[status] || 'border-gray-300 bg-gray-50';
  };

  return (
    <div className="flex-shrink-0 w-80">
      <div className={`
        rounded-lg border-2 transition-all duration-200 min-h-96
        ${getColumnColor(status)}
        ${isOver ? 'border-blue-400 bg-blue-100' : ''}
      `}>
        {/* Header da coluna */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">
              {STATUS_LABELS[status]}
            </h3>
            <span className="bg-white text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
              {projects.length}
            </span>
          </div>
        </div>

        {/* Lista de projetos */}
        <div
          ref={setNodeRef}
          className="p-4 space-y-3 min-h-80"
        >
          <SortableContext 
            items={projects.map(p => p.id)} 
            strategy={verticalListSortingStrategy}
          >
            {projects.map((project) => (
              <SortableProjectCard
                key={project.id}
                project={project}
                onEdit={onEditProject}
                onDelete={onDeleteProject}
              />
            ))}
          </SortableContext>

          {/* Placeholder quando vazio */}
          {projects.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <p className="text-sm">Nenhum projeto</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};