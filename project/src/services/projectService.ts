import api from './api';
import { Project, ProjectFormData, ProjectUpdateData, ProjectStatus } from '../interfaces';

/**
 * Serviço de projetos que se comunica com o backend Spring Boot
 * Implementa todos os endpoints definidos no ProjectController
 */

// Função para limpar valores nulos/undefined
const cleanData = (data: any): any => {
  const cleaned: any = {};
  Object.keys(data).forEach(key => {
    if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
      cleaned[key] = data[key];
    }
  });
  return cleaned;
};

export const projectService = {
  // Buscar todos os projetos com paginação e filtro por status
  async getAll(page: number = 0, size: number = 20, status?: string): Promise<{
    content: Project[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  }> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());
    if (status) {
      params.append('status', status);
    }

    const response = await api.get(`/projects?${params.toString()}`);
    return response.data;
  },

  // Buscar projeto por ID
  async getById(id: number): Promise<Project> {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  // Criar novo projeto
  async create(projectData: ProjectFormData): Promise<Project> {
    console.log('Criando projeto com dados:', projectData);
    
    // Garante que as datas estão no formato correto (YYYY-MM-DD)
    const formattedData = {
      ...projectData,
      dataInicio: projectData.dataInicio,
      previsaoTermino: projectData.previsaoTermino
    };
    
    const cleanedData = cleanData(formattedData);
    console.log('Dados limpos:', cleanedData);
    const response = await api.post('/projects', cleanedData);
    return response.data;
  },

  // Atualizar projeto existente
  async update(id: number, projectData: ProjectUpdateData): Promise<Project> {
    console.log('Atualizando projeto', id, 'com dados:', projectData);
    
    // Garante que as datas estão no formato correto (YYYY-MM-DD)
    const formattedData = {
      ...projectData,
      dataInicio: projectData.dataInicio,
      previsaoTermino: projectData.previsaoTermino,
      dataRealTermino: projectData.dataRealTermino
    };
    
    const cleanedData = cleanData(formattedData);
    console.log('Dados limpos:', cleanedData);
    const response = await api.put(`/projects/${id}`, cleanedData);
    return response.data;
  },

  // Excluir projeto
  async delete(id: number): Promise<void> {
    await api.delete(`/projects/${id}`);
  },

  // Alterar status do projeto
  async changeStatus(id: number, newStatus: ProjectStatus): Promise<Project> {
    const response = await api.patch(`/projects/${id}/status`, {
      status: newStatus
    });
    return response.data;
  },

  // Adicionar membro ao projeto
  async addMember(projectId: number, memberId: number): Promise<Project> {
    const response = await api.post(`/projects/${projectId}/members/${memberId}`);
    return response.data;
  },

  // Remover membro do projeto
  async removeMember(projectId: number, memberId: number): Promise<Project> {
    const response = await api.delete(`/projects/${projectId}/members/${memberId}`);
    return response.data;
  },

  // Gerar relatório do portfólio
  async getReport(): Promise<{
    quantidadePorStatus: Record<string, number>;
    totalOrcadoPorStatus: Record<string, number>;
    mediaDuracaoEncerrados: number;
    totalMembrosUnicos: number;
  }> {
    const response = await api.get('/projects/report');
    return response.data;
  }
};