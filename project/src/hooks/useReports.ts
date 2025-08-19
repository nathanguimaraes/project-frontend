/**
 * Hook customizado para gerar relatórios e estatísticas dos projetos
 * Integrado com o backend Spring Boot que fornece os dados calculados
 */

import { useState, useEffect, useCallback } from 'react';
import { ReportData } from '../interfaces';
import { projectService } from '../services/projectService';

interface UseReportsReturn {
  reportData: ReportData | null;
  loading: boolean;
  error: string | null;
  chartData: {
    statusChart: Array<{ name: string; value: number; color: string }>;
    budgetChart: Array<{ name: string; value: number }>;
  };
  kpis: {
    totalProjetos: number;
    projetosAtivos: number;
    projetosEncerrados: number;
    orcamentoTotal: number;
    mediaDuracaoDias: number;
    totalMembrosUnicos: number;
  };
  refreshReports: () => Promise<void>;
}

/**
 * Hook principal para relatórios e estatísticas
 */
export const useReports = (): UseReportsReturn => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carrega o relatório do backend
   */
  const loadReport = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectService.getReport();
      setReportData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar relatório';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Dados formatados para gráficos baseados no relatório do backend
   */
  const chartData = useCallback(() => {
    if (!reportData) return { statusChart: [], budgetChart: [] };

    // Cores para status
    const statusColors: Record<string, string> = {
      'EM_ANALISE': '#6B7280',
      'ANALISE_REALIZADA': '#3B82F6',
      'ANALISE_APROVADA': '#6366F1',
      'INICIADO': '#8B5CF6',
      'PLANEJADO': '#06B6D4',
      'EM_ANDAMENTO': '#F59E0B',
      'ENCERRADO': '#10B981',
      'CANCELADO': '#EF4444'
    };

    // Gráfico de status
    const statusChart = Object.entries(reportData.quantidadePorStatus)
      .filter(([_, count]) => count > 0)
      .map(([status, count]) => ({
        name: status.replace('_', ' ').toUpperCase(),
        value: count,
        color: statusColors[status] || '#6B7280'
      }));

    // Gráfico de orçamento por status
    const budgetChart = Object.entries(reportData.totalOrcadoPorStatus)
      .filter(([_, value]) => value > 0)
      .map(([status, value]) => ({
        name: status.replace('_', ' ').toUpperCase(),
        value: Number(value) / 1000 // Converter para milhares
      }));

    return {
      statusChart,
      budgetChart
    };
  }, [reportData]);

  /**
   * KPIs principais calculados a partir do relatório
   */
  const kpis = useCallback(() => {
    if (!reportData) return {
      totalProjetos: 0,
      projetosAtivos: 0,
      projetosEncerrados: 0,
      orcamentoTotal: 0,
      mediaDuracaoDias: 0,
      totalMembrosUnicos: 0
    };

    const totalProjetos = Object.values(reportData.quantidadePorStatus)
      .reduce((acc, count) => acc + count, 0);
    
    const projetosAtivos = Object.entries(reportData.quantidadePorStatus)
      .filter(([status, _]) => !['ENCERRADO', 'CANCELADO'].includes(status))
      .reduce((acc, [_, count]) => acc + count, 0);
    
    const projetosEncerrados = reportData.quantidadePorStatus['ENCERRADO'] || 0;
    
    const orcamentoTotal = Object.values(reportData.totalOrcadoPorStatus)
      .reduce((acc, value) => acc + Number(value), 0);

    return {
      totalProjetos,
      projetosAtivos,
      projetosEncerrados,
      orcamentoTotal,
      mediaDuracaoDias: reportData.mediaDuracaoEncerrados,
      totalMembrosUnicos: reportData.totalMembrosUnicos
    };
  }, [reportData]);

  /**
   * Atualiza os relatórios
   */
  const refreshReports = useCallback(async () => {
    await loadReport();
  }, [loadReport]);

  // Carrega relatório na inicialização
  useEffect(() => {
    loadReport();
  }, [loadReport]);

  return {
    reportData,
    loading,
    error,
    chartData: chartData(),
    kpis: kpis(),
    refreshReports
  };
};