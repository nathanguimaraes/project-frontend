/**
 * Componente Header - Cabeçalho principal da aplicação
 * Contém navegação, título e ações globais
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, FolderKanban, Plus, Menu } from 'lucide-react';

interface HeaderProps {
  onMenuToggle?: () => void;
}

/**
 * Header principal com navegação responsiva
 */
export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo e título */}
          <div className="flex items-center space-x-4">
            {/* Botão menu mobile */}
            <button
              onClick={onMenuToggle}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link to="/" className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <FolderKanban className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Planejão</h1>
                <p className="text-xs text-gray-500 hidden sm:block">
                  Gerenciamento de Portfólio
                </p>
              </div>
            </Link>
          </div>

          {/* Navegação principal - Desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-2">
                <FolderKanban className="w-4 h-4" />
                <span>Dashboard</span>
              </div>
            </Link>

            <Link
              to="/reports"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/reports')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>Relatórios</span>
              </div>
            </Link>
          </nav>

          {/* Ações */}
          <div className="flex items-center space-x-3">
            <Link
              to="/projects/create"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Novo Projeto</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Navegação mobile */}
      <nav className="md:hidden border-t border-gray-200 bg-gray-50">
        <div className="px-4 py-2 space-y-1">
          <Link
            to="/"
            className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive('/')
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center space-x-2">
              <FolderKanban className="w-4 h-4" />
              <span>Dashboard</span>
            </div>
          </Link>

          <Link
            to="/reports"
            className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive('/reports')
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Relatórios</span>
            </div>
          </Link>
        </div>
      </nav>
    </header>
  );
};