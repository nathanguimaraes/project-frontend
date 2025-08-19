/**
 * Interfaces e tipos TypeScript para o sistema Planejão
 * Define a estrutura de dados para projetos, membros e relatórios
 * Baseado nos DTOs do backend Spring Boot
 */

// Status possíveis dos projetos seguindo o fluxo de negócio do backend
export type ProjectStatus = 
  | 'EM_ANALISE'
  | 'ANALISE_REALIZADA' 
  | 'ANALISE_APROVADA'
  | 'INICIADO'
  | 'PLANEJADO'
  | 'EM_ANDAMENTO'
  | 'ENCERRADO'
  | 'CANCELADO';

// Interface principal do projeto baseada no ProjectDTO do backend
export interface Project {
  id: number;
  nome: string;
  dataInicio: string; // LocalDate do backend
  previsaoTermino: string; // LocalDate do backend
  dataRealTermino?: string; // LocalDate do backend - opcional
  orcamentoTotal: number; // BigDecimal do backend
  descricao: string;
  gerente: Member; // Objeto Member completo
  status: ProjectStatus;
  risco: string;
  membros: number[]; // Array de IDs dos membros
}

// Interface do membro baseada no MemberDTO do backend
export interface Member {
  id: number;
  nome: string;
  cargo: string;
}

// Interface para dados dos relatórios baseada no ReportDTO do backend
export interface ReportData {
  quantidadePorStatus: Record<string, number>;
  totalOrcadoPorStatus: Record<string, number>;
  mediaDuracaoEncerrados: number;
  totalMembrosUnicos: number;
}

// Interface para formulário de projeto baseada no ProjectRequestDTO
export interface ProjectFormData {
  nome: string;
  dataInicio: string;
  previsaoTermino: string;
  dataRealTermino?: string; // Opcional para criação
  orcamentoTotal: number;
  descricao: string;
  gerenteId: number;
  membros: number[];
}

// Interface para atualização de projeto baseada no ProjectUpdateDTO
export interface ProjectUpdateData {
  nome?: string;
  dataInicio?: string;
  previsaoTermino?: string;
  dataRealTermino?: string;
  orcamentoTotal?: number;
  descricao?: string;
  gerenteId?: number;
  // Nota: membros não está incluído no ProjectUpdateDTO do backend
}

// Interface para filtros e busca
export interface ProjectFilters {
  status?: ProjectStatus;
  search?: string;
}

// Mapeamento de status para labels em português
export const STATUS_LABELS: Record<ProjectStatus, string> = {
  EM_ANALISE: 'Em Análise',
  ANALISE_REALIZADA: 'Análise Realizada',
  ANALISE_APROVADA: 'Análise Aprovada',
  INICIADO: 'Iniciado',
  PLANEJADO: 'Planejado',
  EM_ANDAMENTO: 'Em Andamento',
  ENCERRADO: 'Encerrado',
  CANCELADO: 'Cancelado'
};

// Configuração de cores para status
export const STATUS_COLORS: Record<ProjectStatus, string> = {
  EM_ANALISE: 'bg-gray-100 text-gray-800',
  ANALISE_REALIZADA: 'bg-blue-100 text-blue-800',
  ANALISE_APROVADA: 'bg-indigo-100 text-indigo-800',
  INICIADO: 'bg-purple-100 text-purple-800',
  PLANEJADO: 'bg-cyan-100 text-cyan-800',
  EM_ANDAMENTO: 'bg-orange-100 text-orange-800',
  ENCERRADO: 'bg-green-100 text-green-800',
  CANCELADO: 'bg-red-100 text-red-800'
};

// Mapeamento de status para cores do Kanban
export const KANBAN_COLORS: Record<ProjectStatus, string> = {
  EM_ANALISE: 'bg-gray-50 border-gray-200',
  ANALISE_REALIZADA: 'bg-blue-50 border-blue-200',
  ANALISE_APROVADA: 'bg-indigo-50 border-indigo-200',
  INICIADO: 'bg-purple-50 border-purple-200',
  PLANEJADO: 'bg-cyan-50 border-cyan-200',
  EM_ANDAMENTO: 'bg-orange-50 border-orange-200',
  ENCERRADO: 'bg-green-50 border-green-200',
  CANCELADO: 'bg-red-50 border-red-200'
};