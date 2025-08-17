/**
 * Dados mockados para simular o backend do sistema Planejão
 * Inclui projetos, membros e funções para simular operações CRUD
 */

import { Project, Member, ProjectStatus, MemberRole } from '../interfaces';
import { generateId, calculateRisk } from '../utils';

// Membros mockados da empresa
export const mockMembers: Member[] = [
  {
    id: '1',
    nome: 'Ana Silva',
    atribuicao: 'funcionario',
    email: 'ana.silva@empresa.com',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    projetosAtivos: 2
  },
  {
    id: '2', 
    nome: 'Carlos Santos',
    atribuicao: 'gerente',
    email: 'carlos.santos@empresa.com',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    projetosAtivos: 1
  },
  {
    id: '3',
    nome: 'Maria Oliveira',
    atribuicao: 'funcionario', 
    email: 'maria.oliveira@empresa.com',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    projetosAtivos: 3
  },
  {
    id: '4',
    nome: 'João Costa',
    atribuicao: 'funcionario',
    email: 'joao.costa@empresa.com', 
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    projetosAtivos: 1
  },
  {
    id: '5',
    nome: 'Fernanda Lima',
    atribuicao: 'gerente',
    email: 'fernanda.lima@empresa.com',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    projetosAtivos: 2
  },
  {
    id: '6',
    nome: 'Roberto Alves',
    atribuicao: 'funcionario',
    email: 'roberto.alves@empresa.com',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    projetosAtivos: 0
  }
];

// Projetos mockados com diferentes status e características
export const mockProjects: Project[] = [
  {
    id: '1',
    nome: 'Sistema de Vendas Online',
    dataInicio: '2024-01-15',
    previsaoTermino: '2024-04-15',
    orcamento: 150000,
    descricao: 'Desenvolvimento de plataforma e-commerce completa com integração de pagamentos e gestão de estoque.',
    gerenteId: '2',
    status: 'em_andamento',
    membrosIds: ['1', '3', '4'],
    risco: calculateRisk(150000, '2024-01-15', '2024-04-15'),
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z'
  },
  {
    id: '2', 
    nome: 'App Mobile Corporativo',
    dataInicio: '2024-02-01',
    previsaoTermino: '2024-08-01',
    orcamento: 800000,
    descricao: 'Aplicativo mobile para gestão interna da empresa com funcionalidades de RH, financeiro e comunicação.',
    gerenteId: '5',
    status: 'planejado',
    membrosIds: ['1', '6'],
    risco: calculateRisk(800000, '2024-02-01', '2024-08-01'),
    createdAt: '2024-01-25T09:00:00Z',
    updatedAt: '2024-02-01T11:00:00Z'
  },
  {
    id: '3',
    nome: 'Migração de Banco de Dados',
    dataInicio: '2024-01-01',
    previsaoTermino: '2024-02-28',
    dataRealTermino: '2024-03-15',
    orcamento: 75000,
    descricao: 'Migração do sistema legado para nova arquitetura de banco de dados com melhor performance.',
    gerenteId: '2',
    status: 'encerrado',
    membrosIds: ['3', '4'],
    risco: calculateRisk(75000, '2024-01-01', '2024-02-28'),
    createdAt: '2023-12-20T14:00:00Z',
    updatedAt: '2024-03-15T16:45:00Z'
  },
  {
    id: '4',
    nome: 'Portal do Cliente',
    dataInicio: '2024-03-01',
    previsaoTermino: '2024-05-01',
    orcamento: 120000,
    descricao: 'Desenvolvimento de portal web para clientes acessarem informações de conta e suporte.',
    gerenteId: '5',
    status: 'iniciado',
    membrosIds: ['1', '6'],
    risco: calculateRisk(120000, '2024-03-01', '2024-05-01'),
    createdAt: '2024-02-15T08:30:00Z',
    updatedAt: '2024-03-01T10:00:00Z'
  },
  {
    id: '5',
    nome: 'Integração ERP',
    dataInicio: '2024-04-01',
    previsaoTermino: '2024-06-01',
    orcamento: 200000,
    descricao: 'Integração do sistema atual com ERP corporativo para automatizar processos financeiros.',
    gerenteId: '2',
    status: 'analise_aprovada',
    membrosIds: ['3', '4', '6'],
    risco: calculateRisk(200000, '2024-04-01', '2024-06-01'),
    createdAt: '2024-03-10T13:00:00Z',
    updatedAt: '2024-03-20T09:15:00Z'
  },
  {
    id: '6',
    nome: 'Dashboard Analytics',
    dataInicio: '2024-02-15',
    previsaoTermino: '2024-03-15',
    orcamento: 45000,
    descricao: 'Criação de dashboard para visualização de métricas e KPIs da empresa.',
    gerenteId: '5',
    status: 'em_analise',
    membrosIds: ['1'],
    risco: calculateRisk(45000, '2024-02-15', '2024-03-15'),
    createdAt: '2024-02-01T11:30:00Z',
    updatedAt: '2024-02-10T14:20:00Z'
  },
  {
    id: '7',
    nome: 'Sistema de Backup Automatizado',
    dataInicio: '2024-01-10',
    previsaoTermino: '2024-02-10',
    orcamento: 30000,
    descricao: 'Implementação de sistema automatizado de backup para todos os dados críticos.',
    gerenteId: '2',
    status: 'cancelado',
    membrosIds: ['4'],
    risco: calculateRisk(30000, '2024-01-10', '2024-02-10'),
    createdAt: '2024-01-05T16:00:00Z',
    updatedAt: '2024-01-25T12:00:00Z'
  }
];

// Simulação de delay de rede para tornar mais realista
const simulateNetworkDelay = (min: number = 500, max: number = 1500): Promise<void> => {
  const delay = Math.random() * (max - min) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
};

// Simulação de erro ocasional (10% de chance)
const simulateRandomError = (): boolean => {
  return Math.random() < 0.1;
};

/**
 * Serviços mockados para projetos
 */
export const projectService = {
  // Buscar todos os projetos
  async getAll(): Promise<Project[]> {
    await simulateNetworkDelay();
    
    if (simulateRandomError()) {
      throw new Error('Erro ao carregar projetos. Tente novamente.');
    }
    
    return [...mockProjects];
  },

  // Buscar projeto por ID
  async getById(id: string): Promise<Project | null> {
    await simulateNetworkDelay();
    
    if (simulateRandomError()) {
      throw new Error('Erro ao carregar projeto. Tente novamente.');
    }
    
    return mockProjects.find(project => project.id === id) || null;
  },

  // Criar novo projeto
  async create(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'risco'>): Promise<Project> {
    await simulateNetworkDelay();
    
    if (simulateRandomError()) {
      throw new Error('Erro ao criar projeto. Tente novamente.');
    }

    const newProject: Project = {
      ...projectData,
      id: generateId(),
      risco: calculateRisk(projectData.orcamento, projectData.dataInicio, projectData.previsaoTermino),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    mockProjects.push(newProject);
    return newProject;
  },

  // Atualizar projeto existente
  async update(id: string, projectData: Partial<Project>): Promise<Project> {
    await simulateNetworkDelay();
    
    if (simulateRandomError()) {
      throw new Error('Erro ao atualizar projeto. Tente novamente.');
    }

    const projectIndex = mockProjects.findIndex(project => project.id === id);
    if (projectIndex === -1) {
      throw new Error('Projeto não encontrado.');
    }

    const updatedProject = {
      ...mockProjects[projectIndex],
      ...projectData,
      updatedAt: new Date().toISOString()
    };

    // Recalcular risco se dados relevantes mudaram
    if (projectData.orcamento || projectData.dataInicio || projectData.previsaoTermino) {
      updatedProject.risco = calculateRisk(
        updatedProject.orcamento,
        updatedProject.dataInicio,
        updatedProject.previsaoTermino
      );
    }

    mockProjects[projectIndex] = updatedProject;
    return updatedProject;
  },

  // Excluir projeto
  async delete(id: string): Promise<void> {
    await simulateNetworkDelay();
    
    if (simulateRandomError()) {
      throw new Error('Erro ao excluir projeto. Tente novamente.');
    }

    const projectIndex = mockProjects.findIndex(project => project.id === id);
    if (projectIndex === -1) {
      throw new Error('Projeto não encontrado.');
    }

    mockProjects.splice(projectIndex, 1);
  },

  // Atualizar status do projeto (para drag & drop)
  async updateStatus(id: string, newStatus: ProjectStatus): Promise<Project> {
    return this.update(id, { status: newStatus });
  }
};

/**
 * Serviços mockados para membros
 */
export const memberService = {
  // Buscar todos os membros
  async getAll(): Promise<Member[]> {
    await simulateNetworkDelay();
    
    if (simulateRandomError()) {
      throw new Error('Erro ao carregar membros. Tente novamente.');
    }
    
    return [...mockMembers];
  },

  // Buscar apenas funcionários (para associação em projetos)
  async getFuncionarios(): Promise<Member[]> {
    await simulateNetworkDelay();
    return mockMembers.filter(member => member.atribuicao === 'funcionario');
  },

  // Buscar apenas gerentes
  async getGerentes(): Promise<Member[]> {
    await simulateNetworkDelay();
    return mockMembers.filter(member => member.atribuicao === 'gerente');
  },

  // Buscar membro por ID
  async getById(id: string): Promise<Member | null> {
    await simulateNetworkDelay();
    return mockMembers.find(member => member.id === id) || null;
  }
};

/**
 * Função para resetar dados mockados (útil para testes)
 */
export const resetMockData = (): void => {
  // Recarregar dados originais se necessário
  console.log('Dados mockados resetados');
};