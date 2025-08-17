/**
 * Página Edit - Edição de projetos existentes
 * Formulário para editar um projeto existente
 */

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ProjectForm } from '../../components/Projects/ProjectForm';
import { useProject, useProjects } from '../../hooks/useProjects';
import { PageLoadingSpinner } from '../../components/UI/LoadingSpinner';
import { PageErrorMessage } from '../../components/UI/ErrorMessage';
import { ProjectFormData } from '../../interfaces';

/**
 * Página de edição de projeto
 */
export const ProjectEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { project, loading, error } = useProject(id!);
  const { updateProject } = useProjects();

  /**
   * Submete o formulário de edição
   */
  const handleSubmit = async (data: ProjectFormData): Promise<boolean> => {
    if (!project) return false;
    
    const success = await updateProject(project.id, data);
    if (success) {
      navigate(`/projects/${project.id}`);
    }
    return success;
  };

  /**
   * Cancela a edição e volta para os detalhes
   */
  const handleCancel = () => {
    if (project) {
      navigate(`/projects/${project.id}`);
    } else {
      navigate('/');
    }
  };

  // Estados de loading e erro
  if (loading) {
    return <PageLoadingSpinner text="Carregando projeto..." />;
  }

  if (error || !project) {
    return (
      <PageErrorMessage 
        message={error || 'Projeto não encontrado'} 
        onRetry={() => window.location.reload()}
      />
    );
  }

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
            Editar Projeto
          </h1>
          <p className="text-gray-600 mt-1">
            {project.nome}
          </p>
        </div>
      </div>

      {/* Formulário */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <ProjectForm
          project={project}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};