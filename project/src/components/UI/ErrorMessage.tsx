/**
 * Componente ErrorMessage - Exibição de mensagens de erro
 * Componente para mostrar erros de forma consistente
 */

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

/**
 * Componente para exibir mensagens de erro
 */
export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  onRetry,
  className = ''
}) => {
  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-800">
            Erro
          </h3>
          <p className="text-sm text-red-700 mt-1">
            {message}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 inline-flex items-center space-x-2 text-sm text-red-800 hover:text-red-900 font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Tentar novamente</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Erro de página inteira
 */
export const PageErrorMessage: React.FC<ErrorMessageProps> = (props) => {
  return (
    <div className="flex items-center justify-center min-h-64">
      <div className="max-w-md w-full">
        <ErrorMessage {...props} />
      </div>
    </div>
  );
};