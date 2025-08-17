/**
 * Componentes de gráficos para relatórios
 * Utiliza Recharts para visualização de dados
 */

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';

interface ChartData {
  name: string;
  value: number;
  color?: string;
}

interface MonthlyData {
  month: string;
  projetos: number;
  orcamento: number;
}

/**
 * Gráfico de barras para orçamentos por status
 */
interface BudgetChartProps {
  data: ChartData[];
}

export const BudgetChart: React.FC<BudgetChartProps> = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Orçamento por Status (em milhares)
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip 
            formatter={(value: number) => [`R$ ${value}k`, 'Orçamento']}
            labelStyle={{ color: '#374151' }}
          />
          <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * Gráfico de pizza para distribuição de projetos por status
 */
interface StatusPieChartProps {
  data: ChartData[];
}

export const StatusPieChart: React.FC<StatusPieChartProps> = ({ data }) => {
  const RADIAN = Math.PI / 180;
  
  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Distribuição de Projetos por Status
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || '#3B82F6'} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * Gráfico de pizza para níveis de risco
 */
interface RiskPieChartProps {
  data: ChartData[];
}

export const RiskPieChart: React.FC<RiskPieChartProps> = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Distribuição por Nível de Risco
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label={({ name, value }) => `${name}: ${value}`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || '#3B82F6'} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * Gráfico de linha para evolução mensal
 */
interface MonthlyChartProps {
  data: MonthlyData[];
}

export const MonthlyChart: React.FC<MonthlyChartProps> = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Evolução Mensal (Últimos 6 Meses)
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
          <Tooltip 
            formatter={(value: number, name: string) => [
              name === 'projetos' ? value : `R$ ${value}k`,
              name === 'projetos' ? 'Projetos' : 'Orçamento'
            ]}
          />
          <Legend />
          <Bar yAxisId="left" dataKey="projetos" fill="#3B82F6" name="Projetos" />
          <Line 
            yAxisId="right" 
            type="monotone" 
            dataKey="orcamento" 
            stroke="#10B981" 
            strokeWidth={3}
            name="Orçamento (k)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};