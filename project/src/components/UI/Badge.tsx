/**
 * Componente Badge - Etiquetas coloridas para status e categorias
 * Badges reutilizáveis com diferentes variantes e cores
 * Integrado com o backend Spring Boot
 */

import React from 'react';
import { ProjectStatus, STATUS_COLORS } from '../../interfaces';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * Badge genérico
 */
export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'default',
  size = 'sm',
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  
  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm'
  };

  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800'
  };

  return (
    <span className={`
      ${baseClasses} 
      ${sizeClasses[size]} 
      ${variantClasses[variant]}
      ${className}
    `}>
      {children}
    </span>
  );
};

/**
 * Badge específico para status de projeto
 */
interface StatusBadgeProps {
  status: ProjectStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const statusLabels: Record<ProjectStatus, string> = {
    EM_ANALISE: 'Em Análise',
    ANALISE_REALIZADA: 'Análise Realizada',
    ANALISE_APROVADA: 'Análise Aprovada',
    INICIADO: 'Iniciado',
    PLANEJADO: 'Planejado',
    EM_ANDAMENTO: 'Em Andamento',
    ENCERRADO: 'Encerrado',
    CANCELADO: 'Cancelado'
  };

  return (
    <span className={`
      inline-flex items-center font-medium rounded-full
      ${size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'}
      ${STATUS_COLORS[status]}
    `}>
      {statusLabels[status]}
    </span>
  );
};