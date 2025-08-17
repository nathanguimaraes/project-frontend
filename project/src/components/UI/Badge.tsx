/**
 * Componente Badge - Etiquetas coloridas para status e categorias
 * Badges reutilizáveis com diferentes variantes e cores
 */

import React from 'react';
import { ProjectStatus, RiskLevel } from '../../interfaces';
import { STATUS_COLORS, RISK_CONFIG } from '../../interfaces';

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
    em_analise: 'Em Análise',
    analise_realizada: 'Análise Realizada',
    analise_aprovada: 'Análise Aprovada',
    iniciado: 'Iniciado',
    planejado: 'Planejado',
    em_andamento: 'Em Andamento',
    encerrado: 'Encerrado',
    cancelado: 'Cancelado'
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

/**
 * Badge específico para nível de risco
 */
interface RiskBadgeProps {
  risk: RiskLevel;
  size?: 'sm' | 'md';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ risk, size = 'sm' }) => {
  const config = RISK_CONFIG[risk];

  return (
    <span className={`
      inline-flex items-center font-medium rounded-full
      ${size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'}
      ${config.bgColor} ${config.color}
    `}>
      {config.label}
    </span>
  );
};