/**
 * Componente LoadingSpinner - Indicador de carregamento
 * Spinner animado para estados de loading
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

/**
 * Spinner de carregamento com diferentes tamanhos
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600`} />
      {text && (
        <span className="text-sm text-gray-600">{text}</span>
      )}
    </div>
  );
};

/**
 * Spinner de página inteira
 */
export const PageLoadingSpinner: React.FC<{ text?: string }> = ({ text = 'Carregando...' }) => {
  return (
    <div className="flex items-center justify-center min-h-64">
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
};