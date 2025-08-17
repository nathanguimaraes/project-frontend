/**
 * Funções utilitárias para o sistema Planejão
 * Inclui cálculos de risco, validações e formatações
 */

import { differenceInMonths, differenceInDays, parseISO, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Project, RiskLevel, ProjectStatus, Member } from '../interfaces';

/**
 * Calcula o nível de risco do projeto baseado em orçamento e prazo
 * Regras:
 * - Baixo: orçamento ≤ 100.000 e prazo ≤ 3 meses
 * - Médio: 100.001–500.000 ou prazo 3–6 meses  
 * - Alto: > 500.000 ou prazo > 6 meses
 */
export const calculateRisk = (orcamento: number, dataInicio: string, previsaoTermino: string): RiskLevel => {
  const inicio = parseISO(dataInicio);
  const termino = parseISO(previsaoTermino);
  const mesesPrazo = differenceInMonths(termino, inicio);

  // Risco alto: orçamento muito alto OU prazo muito longo
  if (orcamento > 500000 || mesesPrazo > 6) {
    return 'alto';
  }

  // Risco baixo: orçamento baixo E prazo curto
  if (orcamento <= 100000 && mesesPrazo <= 3) {
    return 'baixo';
  }

  // Caso contrário, risco médio
  return 'medio';
};

/**
 * Verifica se é possível alterar o status do projeto
 * Respeita a ordem: em_analise → analise_realizada → analise_aprovada → iniciado → planejado → em_andamento → encerrado
 * Cancelado pode ocorrer a qualquer momento
 */
export const canChangeStatus = (currentStatus: ProjectStatus, newStatus: ProjectStatus): boolean => {
  // Cancelado pode ser definido a qualquer momento
  if (newStatus === 'cancelado') {
    return true;
  }

  // Se já está cancelado, não pode mudar para outro status
  if (currentStatus === 'cancelado') {
    return false;
  }

  // Ordem dos status
  const statusOrder: ProjectStatus[] = [
    'em_analise',
    'analise_realizada', 
    'analise_aprovada',
    'iniciado',
    'planejado',
    'em_andamento',
    'encerrado'
  ];

  const currentIndex = statusOrder.indexOf(currentStatus);
  const newIndex = statusOrder.indexOf(newStatus);

  // Pode avançar para o próximo status ou manter o atual
  return newIndex >= currentIndex;
};

/**
 * Verifica se o projeto pode ser excluído
 * Não pode excluir se status for iniciado, em_andamento ou encerrado
 */
export const canDeleteProject = (status: ProjectStatus): boolean => {
  const protectedStatuses: ProjectStatus[] = ['iniciado', 'em_andamento', 'encerrado'];
  return !protectedStatuses.includes(status);
};

/**
 * Verifica se um membro pode ser associado a mais projetos
 * Máximo de 3 projetos ativos por membro
 */
export const canAssignMemberToProject = (member: Member): boolean => {
  return member.projetosAtivos < 3;
};

/**
 * Valida se o número de membros está dentro do limite (1-10)
 */
export const validateMembersCount = (membersIds: string[]): boolean => {
  return membersIds.length >= 1 && membersIds.length <= 10;
};

/**
 * Formata valor monetário para exibição
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

/**
 * Formata data para exibição
 */
export const formatDate = (dateString: string): string => {
  return format(parseISO(dateString), 'dd/MM/yyyy', { locale: ptBR });
};

/**
 * Calcula a duração do projeto em dias
 */
export const calculateProjectDuration = (dataInicio: string, dataTermino: string): number => {
  return differenceInDays(parseISO(dataTermino), parseISO(dataInicio));
};

/**
 * Verifica se o projeto está atrasado
 */
export const isProjectDelayed = (project: Project): boolean => {
  if (project.status === 'encerrado' && project.dataRealTermino) {
    return parseISO(project.dataRealTermino) > parseISO(project.previsaoTermino);
  }
  
  if (['iniciado', 'planejado', 'em_andamento'].includes(project.status)) {
    return new Date() > parseISO(project.previsaoTermino);
  }
  
  return false;
};

/**
 * Gera ID único para novos registros
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Valida email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Trunca texto para exibição
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};