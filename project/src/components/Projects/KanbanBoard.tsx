/**
 * Componente KanbanBoard - Quadro Kanban principal
 * Gerencia o drag & drop entre colunas e exibe todos os projetos
 */

import React, { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { Project, ProjectStatus } from '../../interfaces';
import { KanbanColumn } from './KanbanColumn';
import { ProjectCard } from './ProjectCard';
import { useProjects } from '../../hooks/useProjects';
import { canChangeStatus } from '../../utils';
import toast from 'react-hot-toast';

interface KanbanBoardProps {
  projects: Project[];
  onEditProject?: (project: Project) => void;
  onDeleteProject?: (project: Project) => void;
}

/**
 * Quadro Kanban com drag & drop entre colunas
 */
export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  projects,
  onEditProject,
  onDeleteProject
}) => {
  const { updateProjectStatus } = useProjects();
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  // Configuração dos sensores para drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Mínimo de 8px para iniciar o drag
      },
    })
  );

  // Status das colunas na ordem correta
  const columnOrder: ProjectStatus[] = [
    'em_analise',
    'analise_realizada',
    'analise_aprovada',
    'iniciado',
    'planejado',
    'em_andamento',
    'encerrado',
    'cancelado'
  ];

  /**
   * Agrupa projetos por status
   */
  const projectsByStatus = React.useMemo(() => {
    return columnOrder.reduce((acc, status) => {
      acc[status] = projects.filter(project => project.status === status);
      return acc;
    }, {} as Record<ProjectStatus, Project[]>);
  }, [projects]);

  /**
   * Inicia o drag de um projeto
   */
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const project = projects.find(p => p.id === active.id);
    setActiveProject(project || null);
  };

  /**
   * Finaliza o drag e atualiza o status se necessário
   */
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveProject(null);

    if (!over) return;

    const projectId = active.id as string;
    const newStatus = over.id as ProjectStatus;
    
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    // Verifica se o status mudou
    if (project.status === newStatus) return;

    // Valida se a mudança de status é permitida
    if (!canChangeStatus(project.status, newStatus)) {
      toast.error('Mudança de status não permitida pelas regras de negócio');
      return;
    }

    // Atualiza o status do projeto
    await updateProjectStatus(projectId, newStatus);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex space-x-6 overflow-x-auto pb-6">
        {columnOrder.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            projects={projectsByStatus[status]}
            onEditProject={onEditProject}
            onDeleteProject={onDeleteProject}
          />
        ))}
      </div>

      {/* Overlay durante o drag */}
      <DragOverlay>
        {activeProject ? (
          <ProjectCard
            project={activeProject}
            isDragging={true}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};