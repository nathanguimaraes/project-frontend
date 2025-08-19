/**
 * Hook customizado para gerenciar estado e operações dos projetos
 * Centraliza toda a lógica de CRUD e validações de projetos
 * Integrado com o backend Spring Boot
 */

import { useState, useEffect, useCallback } from 'react';
import { Project, ProjectStatus, ProjectFormData, ProjectUpdateData } from '../interfaces';
import { projectService } from '../services/projectService';
import { canChangeStatus, canDeleteProject } from '../utils';
import toast from 'react-hot-toast';

interface UseProjectsReturn {
  projects: Project[];
  loading: boolean;
  error: string | null;
  createProject: (data: ProjectFormData) => Promise<boolean>;
  updateProject: (id: number, data: ProjectUpdateData) => Promise<boolean>;
  deleteProject: (id: number) => Promise<boolean>;
  updateProjectStatus: (id: number, newStatus: ProjectStatus) => Promise<boolean>;
  refreshProjects: () => Promise<void>;
  getProjectById: (id: number) => Project | undefined;
  changeStatus: (id: number, newStatus: ProjectStatus) => Promise<boolean>;
  addMember: (projectId: number, memberId: number) => Promise<boolean>;
  removeMember: (projectId: number, memberId: number) => Promise<boolean>;
  updateProjectInList: (updatedProject: Project) => void;
  removeProjectFromList: (projectId: number) => void;
  addProjectToList: (newProject: Project) => void;
}

/**
 * Hook principal para gerenciamento de projetos
 */
export const useProjects = (): UseProjectsReturn => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carrega todos os projetos do backend
   */
  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Carregando projetos...');
      const response = await projectService.getAll();
      console.log('Projetos carregados:', response.content.length);
      
      setProjects(response.content);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar projetos';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Cria um novo projeto
   */
  const createProject = useCallback(async (data: ProjectFormData): Promise<boolean> => {
    try {
      setError(null);
      
      // Validações básicas
      if (!data.nome.trim()) {
        toast.error('Nome do projeto é obrigatório');
        return false;
      }

      if (!data.gerenteId) {
        toast.error('Gerente é obrigatório');
        return false;
      }

      if (data.membros.length === 0) {
        toast.error('Pelo menos um membro deve ser selecionado');
        return false;
      }

      if (data.membros.length > 10) {
        toast.error('Máximo de 10 membros por projeto');
        return false;
      }

      if (data.orcamentoTotal <= 0) {
        toast.error('Orçamento deve ser maior que zero');
        return false;
      }

      // Validação de datas
      const dataInicio = new Date(data.dataInicio);
      const previsaoTermino = new Date(data.previsaoTermino);
      
      if (previsaoTermino <= dataInicio) {
        toast.error('Data de término deve ser posterior à data de início');
        return false;
      }

      const newProject = await projectService.create(data);
      setProjects(prev => [...prev, newProject]);
      toast.success('Projeto criado com sucesso!');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar projeto';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    }
  }, []);

  /**
   * Atualiza um projeto existente
   */
  const updateProject = useCallback(async (id: number, data: ProjectUpdateData): Promise<boolean> => {
    try {
      setError(null);
      
      const currentProject = projects.find(p => p.id === id);
      if (!currentProject) {
        toast.error('Projeto não encontrado');
        return false;
      }

      const updatedProject = await projectService.update(id, data);
      
      setProjects(prev => 
        prev.map(project => 
          project.id === id ? updatedProject : project
        )
      );

      toast.success('Projeto atualizado com sucesso!');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar projeto';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    }
  }, [projects]);

  /**
   * Exclui um projeto
   */
  const deleteProject = useCallback(async (id: number): Promise<boolean> => {
    try {
      setError(null);
      
      const project = projects.find(p => p.id === id);
      if (!project) {
        toast.error('Projeto não encontrado');
        return false;
      }

      // Validação de exclusão
      if (!canDeleteProject(project.status)) {
        toast.error('Não é possível excluir projetos iniciados, em andamento ou encerrados');
        return false;
      }

      await projectService.delete(id);
      
      setProjects(prev => prev.filter(project => project.id !== id));
      toast.success('Projeto excluído com sucesso!');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir projeto';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    }
  }, [projects]);

  /**
   * Atualiza apenas o status do projeto (usado no drag & drop)
   */
  const updateProjectStatus = useCallback(async (id: number, newStatus: ProjectStatus): Promise<boolean> => {
    try {
      setError(null);
      
      const currentProject = projects.find(p => p.id === id);
      if (!currentProject) {
        toast.error('Projeto não encontrado');
        return false;
      }

      // Validação de mudança de status
      if (!canChangeStatus(currentProject.status, newStatus)) {
        toast.error('Mudança de status não permitida');
        return false;
      }

      const updatedProject = await projectService.changeStatus(id, newStatus);
      
      // Atualiza o projeto na lista local de forma reativa
      setProjects(prev => 
        prev.map(project => 
          project.id === id ? updatedProject : project
        )
      );

      toast.success(`Status alterado para: ${newStatus.replace('_', ' ')}`);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar status';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    }
  }, [projects]);

  /**
   * Atualiza um projeto específico na lista local (para atualizações reativas)
   */
  const updateProjectInList = useCallback((updatedProject: Project) => {
    setProjects(prev => 
      prev.map(project => 
        project.id === updatedProject.id ? updatedProject : project
      )
    );
  }, []);

  /**
   * Remove um projeto da lista local (para exclusões reativas)
   */
  const removeProjectFromList = useCallback((projectId: number) => {
    setProjects(prev => prev.filter(project => project.id !== projectId));
  }, []);

  /**
   * Adiciona um projeto à lista local (para criações reativas)
   */
  const addProjectToList = useCallback((newProject: Project) => {
    setProjects(prev => [...prev, newProject]);
  }, []);

  /**
   * Altera o status do projeto usando o endpoint específico
   */
  const changeStatus = useCallback(async (id: number, newStatus: ProjectStatus): Promise<boolean> => {
    try {
      setError(null);
      
      const currentProject = projects.find(p => p.id === id);
      if (!currentProject) {
        toast.error('Projeto não encontrado');
        return false;
      }

      const updatedProject = await projectService.changeStatus(id, newStatus);
      
      setProjects(prev => 
        prev.map(project => 
          project.id === id ? updatedProject : project
        )
      );

      toast.success(`Status alterado para: ${newStatus.replace('_', ' ')}`);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao alterar status';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    }
  }, [projects]);

  /**
   * Adiciona um membro ao projeto
   */
  const addMember = useCallback(async (projectId: number, memberId: number): Promise<boolean> => {
    try {
      setError(null);
      
      const updatedProject = await projectService.addMember(projectId, memberId);
      
      setProjects(prev => 
        prev.map(project => 
          project.id === projectId ? updatedProject : project
        )
      );

      toast.success('Membro adicionado ao projeto com sucesso!');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar membro';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    }
  }, []);

  /**
   * Remove um membro do projeto
   */
  const removeMember = useCallback(async (projectId: number, memberId: number): Promise<boolean> => {
    try {
      setError(null);
      
      const updatedProject = await projectService.removeMember(projectId, memberId);
      
      setProjects(prev => 
        prev.map(project => 
          project.id === projectId ? updatedProject : project
        )
      );

      toast.success('Membro removido do projeto com sucesso!');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao remover membro';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    }
  }, []);

  /**
   * Recarrega a lista de projetos
   */
  const refreshProjects = useCallback(async () => {
    await loadProjects();
  }, [loadProjects]);

  /**
   * Busca um projeto por ID
   */
  const getProjectById = useCallback((id: number): Project | undefined => {
    return projects.find(project => project.id === id);
  }, [projects]);

  // Carrega projetos na inicialização
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    updateProjectStatus,
    refreshProjects,
    getProjectById,
    changeStatus,
    addMember,
    removeMember,
    updateProjectInList,
    removeProjectFromList,
    addProjectToList
  };
};

/**
 * Hook para buscar um projeto específico por ID
 */
export const useProject = (id: number) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await projectService.getById(id);
        setProject(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar projeto';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProject();
    }
  }, [id]);

  return { project, loading, error };
};