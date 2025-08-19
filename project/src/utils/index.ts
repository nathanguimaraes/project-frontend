/**
 * Funções utilitárias para o sistema Planejão
 * Integrado com o backend Spring Boot
 */

import { differenceInMonths, differenceInDays, parseISO, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Project, ProjectStatus } from '../interfaces';

/**
 * Verifica se é possível alterar o status do projeto
 * Respeita a ordem: EM_ANALISE → ANALISE_REALIZADA → ANALISE_APROVADA → INICIADO → PLANEJADO → EM_ANDAMENTO → ENCERRADO
 * CANCELADO pode ocorrer a qualquer momento
 */
export const canChangeStatus = (currentStatus: ProjectStatus, newStatus: ProjectStatus): boolean => {
  // Cancelado pode ser definido a qualquer momento
  if (newStatus === 'CANCELADO') {
    return true;
  }

  // Se já está cancelado, não pode mudar para outro status
  if (currentStatus === 'CANCELADO') {
    return false;
  }

  // Ordem dos status
  const statusOrder: ProjectStatus[] = [
    'EM_ANALISE',
    'ANALISE_REALIZADA', 
    'ANALISE_APROVADA',
    'INICIADO',
    'PLANEJADO',
    'EM_ANDAMENTO',
    'ENCERRADO'
  ];

  const currentIndex = statusOrder.indexOf(currentStatus);
  const newIndex = statusOrder.indexOf(newStatus);

  // Pode avançar para o próximo status ou manter o atual
  return newIndex >= currentIndex;
};

/**
 * Verifica se o projeto pode ser excluído
 * Não pode excluir se status for INICIADO, EM_ANDAMENTO ou ENCERRADO
 */
export const canDeleteProject = (status: ProjectStatus): boolean => {
  const protectedStatuses: ProjectStatus[] = ['INICIADO', 'EM_ANDAMENTO', 'ENCERRADO'];
  return !protectedStatuses.includes(status);
};

/**
 * Valida se o número de membros está dentro do limite (1-10)
 */
export const validateMembersCount = (members: number[]): boolean => {
  return members.length >= 1 && members.length <= 10;
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
  if (project.status === 'ENCERRADO' && project.dataRealTermino) {
    return parseISO(project.dataRealTermino) > parseISO(project.previsaoTermino);
  }
  
  if (['INICIADO', 'PLANEJADO', 'EM_ANDAMENTO'].includes(project.status)) {
    return new Date() > parseISO(project.previsaoTermino);
  }
  
  return false;
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