/**
 * Página Reports - Relatórios e estatísticas dos projetos
 * Exibe KPIs, gráficos e métricas detalhadas
 */

import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar, 
  Target,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { ReportCard } from '../../components/Reports/ReportCard';
import { 
  BudgetChart, 
  StatusPieChart, 
  RiskPieChart, 
  MonthlyChart 
} from '../../components/Reports/Charts';
import { PageLoadingSpinner } from '../../components/UI/LoadingSpinner';
import { PageErrorMessage } from '../../components/UI/ErrorMessage';
import { useReports } from '../../hooks/useReports';
import { formatCurrency } from '../../utils';

/**
 * Página de relatórios com KPIs e gráficos
 */
export const Reports: React.FC = () => {
  const { 
    reportData, 
    chartData, 
    kpis, 
    loading, 
    error, 
    refreshReports 
  } = useReports();

  // Estados de loading e erro
  if (loading) {
    return <PageLoadingSpinner text="Carregando relatórios..." />;
  }

  if (error) {
    return (
      <PageErrorMessage 
        message={error} 
        onRetry={refreshReports}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header da página */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Relatórios e Estatísticas
        </h1>
        <p className="text-gray-600 mt-1">
          Acompanhe o desempenho do seu portfólio de projetos
        </p>
      </div>

      {/* KPIs principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ReportCard
          title="Total de Projetos"
          value={kpis.totalProjetos}
          icon={BarChart3}
          color="blue"
        />
        
        <ReportCard
          title="Projetos Ativos"
          value={kpis.projetosAtivos}
          subtitle="Em andamento"
          icon={TrendingUp}
          color="green"
        />
        
        <ReportCard
          title="Projetos Encerrados"
          value={kpis.projetosEncerrados}
          subtitle="Concluídos com sucesso"
          icon={CheckCircle}
          color="green"
        />
        
        <ReportCard
          title="Projetos Atrasados"
          value={kpis.projetosAtrasados}
          subtitle="Requerem atenção"
          icon={AlertTriangle}
          color="red"
        />
      </div>

      {/* KPIs financeiros e operacionais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ReportCard
          title="Orçamento Total"
          value={formatCurrency(kpis.orcamentoTotal)}
          subtitle="Todos os projetos"
          icon={DollarSign}
          color="purple"
        />
        
        <ReportCard
          title="Orçamento Médio"
          value={formatCurrency(kpis.orcamentoMedio)}
          subtitle="Por projeto"
          icon={Target}
          color="blue"
        />
        
        <ReportCard
          title="Duração Média"
          value={`${Math.round(kpis.duracaoMediaDias)} dias`}
          subtitle="Projetos encerrados"
          icon={Calendar}
          color="yellow"
        />
        
        <ReportCard
          title="Taxa de Sucesso"
          value={`${kpis.taxaSucesso.toFixed(1)}%`}
          subtitle="Projetos concluídos"
          icon={CheckCircle}
          color="green"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de pizza - Status */}
        {chartData.statusChart.length > 0 && (
          <StatusPieChart data={chartData.statusChart} />
        )}

        {/* Gráfico de pizza - Risco */}
        {chartData.riskChart.length > 0 && (
          <RiskPieChart data={chartData.riskChart} />
        )}
      </div>

      {/* Gráfico de barras - Orçamento */}
      {chartData.budgetChart.length > 0 && (
        <BudgetChart data={chartData.budgetChart} />
      )}

      {/* Gráfico de evolução mensal */}
      {chartData.monthlyChart.length > 0 && (
        <MonthlyChart data={chartData.monthlyChart} />
      )}

      {/* Detalhes por status */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Detalhamento por Status
        </h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantidade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orçamento Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  % do Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(reportData.projetosPorStatus)
                .filter(([_, count]) => count > 0)
                .map(([status, count]) => {
                  const orcamento = reportData.orcamentoPorStatus[status as keyof typeof reportData.orcamentoPorStatus] || 0;
                  const percentage = kpis.totalProjetos > 0 ? (count / kpis.totalProjetos * 100) : 0;
                  
                  return (
                    <tr key={status}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {status.replace('_', ' ').toUpperCase()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(orcamento)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {percentage.toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resumo de membros */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Users className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Resumo da Equipe
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">
              {reportData.totalMembrosUnicos}
            </p>
            <p className="text-sm text-gray-600">Membros Únicos</p>
            <p className="text-xs text-gray-500 mt-1">
              Envolvidos em projetos
            </p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {kpis.projetosAtivos > 0 ? Math.round(reportData.totalMembrosUnicos / kpis.projetosAtivos * 10) / 10 : 0}
            </p>
            <p className="text-sm text-gray-600">Média por Projeto</p>
            <p className="text-xs text-gray-500 mt-1">
              Membros por projeto ativo
            </p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">
              {reportData.totalMembrosUnicos > 0 ? Math.round(kpis.totalProjetos / reportData.totalMembrosUnicos * 10) / 10 : 0}
            </p>
            <p className="text-sm text-gray-600">Projetos por Membro</p>
            <p className="text-xs text-gray-500 mt-1">
              Média de envolvimento
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};