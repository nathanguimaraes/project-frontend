/**
 * Componente SortableProjectCard - Card de projeto arrastável
 * Wrapper do ProjectCard com funcionalidade de drag & drop
 */

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Project } from '../../interfaces';
import { ProjectCard } from './ProjectCard';

interface SortableProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
}

/**
 * Card de projeto com funcionalidade de arrastar e soltar
 */
export const SortableProjectCard: React.FC<SortableProjectCardProps> = ({
  project,
  onEdit,
  onDelete
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: project.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing"
    >
      <ProjectCard
        project={project}
        onEdit={onEdit}
        onDelete={onDelete}
        isDragging={isDragging}
      />
    </div>
  );
};