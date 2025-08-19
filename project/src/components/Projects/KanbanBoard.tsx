/**
 * Componente KanbanBoard - Quadro Kanban principal
 * Gerencia o drag & drop entre colunas e exibe todos os projetos
 * Sistema reativo que atualiza em tempo real
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
  showEmptyColumns?: boolean;
}

/**
 * Quadro Kanban com drag & drop entre colunas
 */
export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  projects,
  onEditProject,
  onDeleteProject,
  showEmptyColumns = true
}) => {
  const { updateProjectStatus, updateProjectInList } = useProjects();
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [optimisticProjects, setOptimisticProjects] = useState<Project[]>(projects);

  // Atualiza o estado otimista quando os projetos mudam
  React.useEffect(() => {
    setOptimisticProjects(projects);
  }, [projects]);

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
    'EM_ANALISE',
    'ANALISE_REALIZADA',
    'ANALISE_APROVADA',
    'INICIADO',
    'PLANEJADO',
    'EM_ANDAMENTO',
    'ENCERRADO',
    'CANCELADO'
  ];

  /**
   * Agrupa projetos por status (usando estado otimista)
   */
  const projectsByStatus = React.useMemo(() => {
    return columnOrder.reduce((acc, status) => {
      acc[status] = optimisticProjects.filter(project => project.status === status);
      return acc;
    }, {} as Record<ProjectStatus, Project[]>);
  }, [optimisticProjects]);

  /**
   * Filtra colunas que devem ser exibidas
   */
  const visibleColumns = React.useMemo(() => {
    if (showEmptyColumns) {
      return columnOrder;
    }
    return columnOrder.filter(status => projectsByStatus[status].length > 0);
  }, [columnOrder, projectsByStatus, showEmptyColumns]);

  /**
   * Inicia o drag de um projeto
   */
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const project = optimisticProjects.find(p => p.id === active.id);
    setActiveProject(project || null);
  };

  /**
   * Finaliza o drag e atualiza o status se necessário
   */
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveProject(null);

    if (!over) return;

    const projectId = active.id as number;
    const newStatus = over.id as ProjectStatus;
    
    const project = optimisticProjects.find(p => p.id === projectId);
    if (!project) return;

    // Verifica se o status mudou
    if (project.status === newStatus) return;

    // Valida se a mudança de status é permitida
    if (!canChangeStatus(project.status, newStatus)) {
      toast.error('Mudança de status não permitida pelas regras de negócio');
      return;
    }

    // Atualização otimista - atualiza imediatamente na interface
    const optimisticProject = { ...project, status: newStatus };
    setOptimisticProjects(prev => 
      prev.map(p => p.id === projectId ? optimisticProject : p)
    );

    try {
      // Chama a API para persistir a mudança
      await updateProjectStatus(projectId, newStatus);
      
      // Atualiza o estado global com o projeto otimista
      updateProjectInList(optimisticProject);
      
      toast.success(`Projeto movido para: ${newStatus.replace('_', ' ')}`);
    } catch (error) {
      // Em caso de erro, reverte para o estado anterior
      setOptimisticProjects(prev => 
        prev.map(p => p.id === projectId ? project : p)
      );
      
      toast.error('Erro ao mover projeto. Tente novamente.');
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex space-x-6 overflow-x-auto pb-6">
        {visibleColumns.map((status) => (
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