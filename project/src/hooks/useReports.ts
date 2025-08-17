/**
 * Hook customizado para gerar relatórios e estatísticas dos projetos
 * Calcula métricas, gráficos e dados para dashboard de relatórios
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Project, ReportData, ProjectStatus, RiskLevel } from '../interfaces';
import { useProjects } from './useProjects';
import { useMembers } from './useMembers';
import { calculateProjectDuration, isProjectDelayed } from '../utils';

interface UseReportsReturn {
  reportData: ReportData;
  loading: boolean;
  error: string | null;
  chartData: {
    statusChart: Array<{ name: string; value: number; color: string }>;
    budgetChart: Array<{ name: string; value: number }>;
    riskChart: Array<{ name: string; value: number; color: string }>;
    monthlyChart: Array<{ month: string; projetos: number; orcamento: number }>;
  };
  kpis: {
    totalProjetos: number;
    projetosAtivos: number;
    projetosEncerrados: number;
    projetosAtrasados: number;
    orcamentoTotal: number;
    orcamentoMedio: number;
    duracaoMediaDias: number;
    taxaSucesso: number;
  };
  refreshReports: () => void;
}

/**
 * Hook principal para relatórios e estatísticas
 */
export const useReports = (): UseReportsReturn => {
  const { projects, loading: projectsLoading, error: projectsError } = useProjects();
  const { members, loading: membersLoading } = useMembers();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Calcula dados básicos do relatório
   */
  const reportData = useMemo((): ReportData => {
    // Contagem de projetos por status
    const projetosPorStatus = projects.reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1;
      return acc;
    }, {} as Record<ProjectStatus, number>);

    // Orçamento total por status
    const orcamentoPorStatus = projects.reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + project.orcamento;
      return acc;
    }, {} as Record<ProjectStatus, number>);

    // Média de duração dos projetos encerrados
    const projetosEncerrados = projects.filter(p => p.status === 'encerrado' && p.dataRealTermino);
    const mediaDuracaoEncerrados = projetosEncerrados.length > 0
      ? projetosEncerrados.reduce((acc, project) => {
          return acc + calculateProjectDuration(project.dataInicio, project.dataRealTermino!);
        }, 0) / projetosEncerrados.length
      : 0;

    // Total de membros únicos envolvidos em projetos
    const membrosUnicos = new Set(
      projects.flatMap(project => [...project.membrosIds, project.gerenteId])
    );

    // Contagem de projetos por nível de risco
    const projetosRisco = projects.reduce((acc, project) => {
      acc[project.risco] = (acc[project.risco] || 0) + 1;
      return acc;
    }, {} as Record<RiskLevel, number>);

    return {
      projetosPorStatus,
      orcamentoPorStatus,
      mediaDuracaoEncerrados,
      totalMembrosUnicos: membrosUnicos.size,
      projetosRisco
    };
  }, [projects]);

  /**
   * Dados formatados para gráficos
   */
  const chartData = useMemo(() => {
    // Cores para status
    const statusColors: Record<ProjectStatus, string> = {
      em_analise: '#6B7280',
      analise_realizada: '#3B82F6',
      analise_aprovada: '#6366F1',
      iniciado: '#8B5CF6',
      planejado: '#06B6D4',
      em_andamento: '#F59E0B',
      encerrado: '#10B981',
      cancelado: '#EF4444'
    };

    // Gráfico de status
    const statusChart = Object.entries(reportData.projetosPorStatus)
      .filter(([_, count]) => count > 0)
      .map(([status, count]) => ({
        name: status.replace('_', ' ').toUpperCase(),
        value: count,
        color: statusColors[status as ProjectStatus]
      }));

    // Gráfico de orçamento por status
    const budgetChart = Object.entries(reportData.orcamentoPorStatus)
      .filter(([_, value]) => value > 0)
      .map(([status, value]) => ({
        name: status.replace('_', ' ').toUpperCase(),
        value: value / 1000 // Converter para milhares
      }));

    // Gráfico de risco
    const riskColors: Record<RiskLevel, string> = {
      baixo: '#10B981',
      medio: '#F59E0B',
      alto: '#EF4444'
    };

    const riskChart = Object.entries(reportData.projetosRisco)
      .filter(([_, count]) => count > 0)
      .map(([risk, count]) => ({
        name: risk.toUpperCase(),
        value: count,
        color: riskColors[risk as RiskLevel]
      }));

    // Gráfico mensal (últimos 6 meses)
    const monthlyChart = generateMonthlyData(projects);

    return {
      statusChart,
      budgetChart,
      riskChart,
      monthlyChart
    };
  }, [reportData, projects]);

  /**
   * KPIs principais
   */
  const kpis = useMemo(() => {
    const totalProjetos = projects.length;
    const projetosAtivos = projects.filter(p => 
      ['iniciado', 'planejado', 'em_andamento'].includes(p.status)
    ).length;
    const projetosEncerrados = projects.filter(p => p.status === 'encerrado').length;
    const projetosAtrasados = projects.filter(isProjectDelayed).length;
    
    const orcamentoTotal = projects.reduce((acc, p) => acc + p.orcamento, 0);
    const orcamentoMedio = totalProjetos > 0 ? orcamentoTotal / totalProjetos : 0;
    
    const duracaoMediaDias = reportData.mediaDuracaoEncerrados;
    
    const projetosConcluidos = projetosEncerrados + projects.filter(p => p.status === 'cancelado').length;
    const taxaSucesso = projetosConcluidos > 0 ? (projetosEncerrados / projetosConcluidos) * 100 : 0;

    return {
      totalProjetos,
      projetosAtivos,
      projetosEncerrados,
      projetosAtrasados,
      orcamentoTotal,
      orcamentoMedio,
      duracaoMediaDias,
      taxaSucesso
    };
  }, [projects, reportData.mediaDuracaoEncerrados]);

  /**
   * Atualiza os relatórios
   */
  const refreshReports = useCallback(() => {
    // Os dados são recalculados automaticamente quando projects muda
    console.log('Relatórios atualizados');
  }, []);

  // Controla o estado de loading
  useEffect(() => {
    setLoading(projectsLoading || membersLoading);
    setError(projectsError);
  }, [projectsLoading, membersLoading, projectsError]);

  return {
    reportData,
    loading,
    error,
    chartData,
    kpis,
    refreshReports
  };
};

/**
 * Gera dados mensais para gráfico temporal
 */
function generateMonthlyData(projects: Project[]) {
  const months = [];
  const now = new Date();
  
  // Gera últimos 6 meses
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = date.toLocaleDateString('pt-BR', { month: 'short' });
    
    // Conta projetos iniciados neste mês
    const projetosNoMes = projects.filter(project => {
      const projectDate = new Date(project.dataInicio);
      return projectDate.getMonth() === date.getMonth() && 
             projectDate.getFullYear() === date.getFullYear();
    });

    months.push({
      month: monthName,
      projetos: projetosNoMes.length,
      orcamento: projetosNoMes.reduce((acc, p) => acc + p.orcamento, 0) / 1000 // Em milhares
    });
  }
  
  return months;
}