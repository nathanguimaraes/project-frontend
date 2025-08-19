/**
 * Página de Relatórios - Dashboard com métricas e gráficos
 * Exibe estatísticas detalhadas do portfólio de projetos
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Users, Calendar, DollarSign, BarChart3 } from 'lucide-react';
import { LoadingSpinner, PageLoadingSpinner } from '../../components/UI/LoadingSpinner';
import { ErrorMessage, PageErrorMessage } from '../../components/UI/ErrorMessage';
import { useReports } from '../../hooks/useReports';
import { formatCurrency } from '../../utils';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

/**
 * Página principal de relatórios
 */
export const Reports: React.FC = () => {
  const navigate = useNavigate();
  const { reportData, loading, error, chartData, kpis, refreshReports } = useReports();

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

  if (!reportData) {
    return (
      <PageErrorMessage 
        message="Nenhum dado de relatório disponível" 
        onRetry={refreshReports}
      />
    );
  }

  // Cores para os gráficos
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B6B'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Relatórios do Portfólio
            </h1>
            <p className="text-gray-600 mt-1">
              Análise detalhada dos projetos e métricas de performance
            </p>
          </div>
        </div>

        <button
          onClick={refreshReports}
          className="inline-flex items-center space-x-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <BarChart3 className="w-4 h-4" />
          <span>Atualizar</span>
        </button>
      </div>

      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Projetos</p>
              <p className="text-2xl font-bold text-blue-600">{kpis.totalProjetos}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Projetos Ativos</p>
              <p className="text-2xl font-bold text-orange-600">{kpis.projetosAtivos}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Orçamento Total</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(kpis.orcamentoTotal)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Membros Únicos</p>
              <p className="text-2xl font-bold text-purple-600">{kpis.totalMembrosUnicos}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Status */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Distribuição por Status
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.statusChart}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.statusChart.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Orçamento */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Orçamento por Status
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.budgetChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [`R$ ${value.toLocaleString()}k`, 'Orçamento']}
              />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Métricas Detalhadas */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Métricas Detalhadas
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="p-4 bg-blue-50 rounded-lg">
              <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">
                {kpis.mediaDuracaoDias.toFixed(1)}
              </p>
              <p className="text-sm text-gray-600">Dias (média)</p>
              <p className="text-xs text-gray-500 mt-1">Duração dos projetos encerrados</p>
            </div>
          </div>

          <div className="text-center">
            <div className="p-4 bg-green-50 rounded-lg">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">
                {kpis.projetosEncerrados}
              </p>
              <p className="text-sm text-gray-600">Projetos</p>
              <p className="text-xs text-gray-500 mt-1">Total de projetos encerrados</p>
            </div>
          </div>

          <div className="text-center">
            <div className="p-4 bg-purple-50 rounded-lg">
              <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">
                {kpis.totalMembrosUnicos}
              </p>
              <p className="text-sm text-gray-600">Membros</p>
              <p className="text-xs text-gray-500 mt-1">Participando de projetos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de Status */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
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
              {Object.entries(reportData.quantidadePorStatus).map(([status, quantidade]) => {
                const orcamento = reportData.totalOrcadoPorStatus[status] || 0;
                const percentual = kpis.totalProjetos > 0 ? (quantidade / kpis.totalProjetos) * 100 : 0;
                
                return (
                  <tr key={status}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {status.replace('_', ' ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {quantidade}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(Number(orcamento))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {percentual.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};