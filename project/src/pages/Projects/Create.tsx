/**
 * Página Create - Criação de novos projetos
 * Formulário para cadastrar um novo projeto
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ProjectForm } from '../../components/Projects/ProjectForm';
import { useProjects } from '../../hooks/useProjects';
import { ProjectFormData } from '../../interfaces';

/**
 * Página de criação de projeto
 */
export const ProjectCreate: React.FC = () => {
  const navigate = useNavigate();
  const { createProject } = useProjects();

  /**
   * Submete o formulário de criação
   */
  const handleSubmit = async (data: ProjectFormData): Promise<boolean> => {
    const success = await createProject(data);
    if (success) {
      navigate('/');
    }
    return success;
  };

  /**
   * Cancela a criação e volta para o dashboard
   */
  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={handleCancel}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Criar Novo Projeto
          </h1>
          <p className="text-gray-600 mt-1">
            Preencha as informações para criar um novo projeto
          </p>
        </div>
      </div>

      {/* Formulário */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <ProjectForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};