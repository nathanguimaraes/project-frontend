/**
 * Configuração de rotas da aplicação
 * Define todas as rotas e navegação do sistema
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from '../components/Layout/Layout';
import { Dashboard } from '../pages/Dashboard/Dashboard';
import { Reports } from '../pages/Reports/Reports';
import { ProjectShow } from '../pages/Projects/Show';
import { ProjectCreate } from '../pages/Projects/Create';
import { ProjectEdit } from '../pages/Projects/Edit';

/**
 * Configuração principal de rotas
 */
export const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Dashboard principal */}
          <Route path="/" element={<Dashboard />} />
          
          {/* Relatórios */}
          <Route path="/reports" element={<Reports />} />
          
          {/* Rotas de projetos */}
          <Route path="/projects/create" element={<ProjectCreate />} />
          <Route path="/projects/:id" element={<ProjectShow />} />
          <Route path="/projects/:id/edit" element={<ProjectEdit />} />
          
          {/* Rota 404 - redireciona para dashboard */}
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
};