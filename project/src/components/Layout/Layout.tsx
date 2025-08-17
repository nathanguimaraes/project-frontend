/**
 * Componente Layout - Layout principal da aplicação
 * Estrutura base com header, sidebar e área de conteúdo
 */

import React, { useState } from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Layout principal da aplicação
 */
export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header onMenuToggle={toggleSidebar} />
      
      {/* Conteúdo principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};