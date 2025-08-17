/**
 * Interfaces e tipos TypeScript para o sistema Planejão
 * Define a estrutura de dados para projetos, membros e relatórios
 */

// Status possíveis dos projetos seguindo o fluxo de negócio
export type ProjectStatus = 
  | 'em_analise'
  | 'analise_realizada' 
  | 'analise_aprovada'
  | 'iniciado'
  | 'planejado'
  | 'em_andamento'
  | 'encerrado'
  | 'cancelado';

// Níveis de risco baseados em orçamento e prazo
export type RiskLevel = 'baixo' | 'medio' | 'alto';

// Tipos de atribuição dos membros
export type MemberRole = 'funcionario' | 'gerente' | 'terceirizado';

// Interface principal do projeto
export interface Project {
  id: string;
  nome: string;
  dataInicio: string; // ISO date string
  previsaoTermino: string; // ISO date string
  dataRealTermino?: string; // ISO date string - opcional
  orcamento: number;
  descricao: string;
  gerenteId: string; // ID do membro gerente
  status: ProjectStatus;
  membrosIds: string[]; // Array de IDs dos membros
  risco: RiskLevel; // Calculado automaticamente
  createdAt: string;
  updatedAt: string;
}

// Interface do membro da equipe
export interface Member {
  id: string;
  nome: string;
  atribuicao: MemberRole;
  email?: string;
  avatar?: string;
  projetosAtivos: number; // Contador de projetos ativos
}

// Interface para dados dos relatórios
export interface ReportData {
  projetosPorStatus: Record<ProjectStatus, number>;
  orcamentoPorStatus: Record<ProjectStatus, number>;
  mediaDuracaoEncerrados: number; // em dias
  totalMembrosUnicos: number;
  projetosRisco: Record<RiskLevel, number>;
}

// Interface para formulário de projeto
export interface ProjectFormData {
  nome: string;
  dataInicio: string;
  previsaoTermino: string;
  dataRealTermino?: string;
  orcamento: number;
  descricao: string;
  gerenteId: string;
  membrosIds: string[];
}

// Interface para filtros e busca
export interface ProjectFilters {
  status?: ProjectStatus[];
  risco?: RiskLevel[];
  gerente?: string;
  search?: string;
}

// Mapeamento de status para labels em português
export const STATUS_LABELS: Record<ProjectStatus, string> = {
  em_analise: 'Em Análise',
  analise_realizada: 'Análise Realizada',
  analise_aprovada: 'Análise Aprovada',
  iniciado: 'Iniciado',
  planejado: 'Planejado',
  em_andamento: 'Em Andamento',
  encerrado: 'Encerrado',
  cancelado: 'Cancelado'
};

// Mapeamento de risco para labels e cores
export const RISK_CONFIG: Record<RiskLevel, { label: string; color: string; bgColor: string }> = {
  baixo: { label: 'Baixo', color: 'text-green-700', bgColor: 'bg-green-100' },
  medio: { label: 'Médio', color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
  alto: { label: 'Alto', color: 'text-red-700', bgColor: 'bg-red-100' }
};

// Configuração de cores para status
export const STATUS_COLORS: Record<ProjectStatus, string> = {
  em_analise: 'bg-gray-100 text-gray-800',
  analise_realizada: 'bg-blue-100 text-blue-800',
  analise_aprovada: 'bg-indigo-100 text-indigo-800',
  iniciado: 'bg-purple-100 text-purple-800',
  planejado: 'bg-cyan-100 text-cyan-800',
  em_andamento: 'bg-orange-100 text-orange-800',
  encerrado: 'bg-green-100 text-green-800',
  cancelado: 'bg-red-100 text-red-800'
};