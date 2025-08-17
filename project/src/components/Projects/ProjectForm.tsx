/**
 * Componente ProjectForm - Formulário para criar/editar projetos
 * Formulário completo com validações e regras de negócio
 */

import React, { useState, useEffect } from 'react';
import { Project, ProjectFormData } from '../../interfaces';
import { useMembers } from '../../hooks/useMembers';
import { useMemberValidation } from '../../hooks/useMembers';
import { LoadingSpinner } from '../UI/LoadingSpinner';
import { ErrorMessage } from '../UI/ErrorMessage';
import { formatCurrency } from '../../utils';
import toast from 'react-hot-toast';

interface ProjectFormProps {
  project?: Project;
  onSubmit: (data: ProjectFormData) => Promise<boolean>;
  onCancel: () => void;
  loading?: boolean;
}

/**
 * Formulário para criação e edição de projetos
 */
export const ProjectForm: React.FC<ProjectFormProps> = ({
  project,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const { funcionarios, gerentes, loading: membersLoading } = useMembers();
  const { validateProjectMembers } = useMemberValidation();

  // Estado do formulário
  const [formData, setFormData] = useState<ProjectFormData>({
    nome: project?.nome || '',
    dataInicio: project?.dataInicio || '',
    previsaoTermino: project?.previsaoTermino || '',
    dataRealTermino: project?.dataRealTermino || '',
    orcamento: project?.orcamento || 0,
    descricao: project?.descricao || '',
    gerenteId: project?.gerenteId || '',
    membrosIds: project?.membrosIds || []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Atualiza campo do formulário
   */
  const updateField = (field: keyof ProjectFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Remove erro do campo quando usuário começa a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  /**
   * Valida o formulário
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validações básicas
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.dataInicio) {
      newErrors.dataInicio = 'Data de início é obrigatória';
    }

    if (!formData.previsaoTermino) {
      newErrors.previsaoTermino = 'Previsão de término é obrigatória';
    }

    if (formData.orcamento <= 0) {
      newErrors.orcamento = 'Orçamento deve ser maior que zero';
    }

    if (!formData.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
    }

    if (!formData.gerenteId) {
      newErrors.gerenteId = 'Gerente é obrigatório';
    }

    // Validação de datas
    if (formData.dataInicio && formData.previsaoTermino) {
      const inicio = new Date(formData.dataInicio);
      const previsao = new Date(formData.previsaoTermino);
      
      if (previsao <= inicio) {
        newErrors.previsaoTermino = 'Data de término deve ser posterior à data de início';
      }
    }

    // Validação de data real de término
    if (formData.dataRealTermino && formData.dataInicio) {
      const inicio = new Date(formData.dataInicio);
      const realTermino = new Date(formData.dataRealTermino);
      
      if (realTermino <= inicio) {
        newErrors.dataRealTermino = 'Data real de término deve ser posterior à data de início';
      }
    }

    // Validação de membros
    const memberValidation = validateProjectMembers(formData.membrosIds, formData.gerenteId);
    if (!memberValidation.isValid) {
      memberValidation.errors.forEach((error, index) => {
        newErrors[`members_${index}`] = error;
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Submete o formulário
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Por favor, corrija os erros no formulário');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const success = await onSubmit(formData);
      if (success) {
        // Formulário será fechado pelo componente pai
      }
    } catch (error) {
      toast.error('Erro ao salvar projeto');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Toggle de seleção de membro
   */
  const toggleMember = (memberId: string) => {
    const isSelected = formData.membrosIds.includes(memberId);
    
    if (isSelected) {
      updateField('membrosIds', formData.membrosIds.filter(id => id !== memberId));
    } else {
      if (formData.membrosIds.length >= 10) {
        toast.error('Máximo de 10 membros por projeto');
        return;
      }
      updateField('membrosIds', [...formData.membrosIds, memberId]);
    }
  };

  if (membersLoading) {
    return <LoadingSpinner text="Carregando formulário..." />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nome do projeto */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nome do Projeto *
        </label>
        <input
          type="text"
          value={formData.nome}
          onChange={(e) => updateField('nome', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.nome ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Digite o nome do projeto"
        />
        {errors.nome && <p className="text-red-600 text-sm mt-1">{errors.nome}</p>}
      </div>

      {/* Datas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data de Início *
          </label>
          <input
            type="date"
            value={formData.dataInicio}
            onChange={(e) => updateField('dataInicio', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.dataInicio ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.dataInicio && <p className="text-red-600 text-sm mt-1">{errors.dataInicio}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Previsão de Término *
          </label>
          <input
            type="date"
            value={formData.previsaoTermino}
            onChange={(e) => updateField('previsaoTermino', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.previsaoTermino ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.previsaoTermino && <p className="text-red-600 text-sm mt-1">{errors.previsaoTermino}</p>}
        </div>
      </div>

      {/* Data real de término (apenas para edição) */}
      {project && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data Real de Término
          </label>
          <input
            type="date"
            value={formData.dataRealTermino}
            onChange={(e) => updateField('dataRealTermino', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.dataRealTermino ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.dataRealTermino && <p className="text-red-600 text-sm mt-1">{errors.dataRealTermino}</p>}
        </div>
      )}

      {/* Orçamento */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Orçamento *
        </label>
        <div className="relative">
          <span className="absolute left-3 top-2 text-gray-500">R$</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.orcamento}
            onChange={(e) => updateField('orcamento', parseFloat(e.target.value) || 0)}
            className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.orcamento ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="0,00"
          />
        </div>
        {formData.orcamento > 0 && (
          <p className="text-sm text-gray-600 mt-1">
            {formatCurrency(formData.orcamento)}
          </p>
        )}
        {errors.orcamento && <p className="text-red-600 text-sm mt-1">{errors.orcamento}</p>}
      </div>

      {/* Descrição */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descrição *
        </label>
        <textarea
          value={formData.descricao}
          onChange={(e) => updateField('descricao', e.target.value)}
          rows={4}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.descricao ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Descreva o projeto..."
        />
        {errors.descricao && <p className="text-red-600 text-sm mt-1">{errors.descricao}</p>}
      </div>

      {/* Gerente */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Gerente *
        </label>
        <select
          value={formData.gerenteId}
          onChange={(e) => updateField('gerenteId', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.gerenteId ? 'border-red-300' : 'border-gray-300'
          }`}
        >
          <option value="">Selecione um gerente</option>
          {gerentes.map((gerente) => (
            <option key={gerente.id} value={gerente.id}>
              {gerente.nome}
            </option>
          ))}
        </select>
        {errors.gerenteId && <p className="text-red-600 text-sm mt-1">{errors.gerenteId}</p>}
      </div>

      {/* Membros */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Membros da Equipe * (1-10 membros)
        </label>
        <div className="border border-gray-300 rounded-lg p-4 max-h-60 overflow-y-auto">
          {funcionarios.length === 0 ? (
            <p className="text-gray-500 text-sm">Nenhum funcionário disponível</p>
          ) : (
            <div className="space-y-2">
              {funcionarios.map((funcionario) => {
                const isSelected = formData.membrosIds.includes(funcionario.id);
                const isOverloaded = funcionario.projetosAtivos >= 3;
                
                return (
                  <label
                    key={funcionario.id}
                    className={`flex items-center space-x-3 p-2 rounded cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                    } ${isOverloaded && !isSelected ? 'opacity-50' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleMember(funcionario.id)}
                      disabled={isOverloaded && !isSelected}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex items-center space-x-2 flex-1">
                      {funcionario.avatar && (
                        <img
                          src={funcionario.avatar}
                          alt={funcionario.nome}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      )}
                      <span className="text-sm font-medium">{funcionario.nome}</span>
                      <span className="text-xs text-gray-500">
                        ({funcionario.projetosAtivos}/3 projetos)
                      </span>
                      {isOverloaded && (
                        <span className="text-xs text-red-600 font-medium">
                          Capacidade máxima
                        </span>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {formData.membrosIds.length} de 10 membros selecionados
        </p>
        
        {/* Exibe erros de validação de membros */}
        {Object.entries(errors)
          .filter(([key]) => key.startsWith('members_'))
          .map(([key, error]) => (
            <p key={key} className="text-red-600 text-sm mt-1">{error}</p>
          ))}
      </div>

      {/* Botões */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting || loading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
        >
          {(isSubmitting || loading) && <LoadingSpinner size="sm" />}
          <span>{project ? 'Atualizar' : 'Criar'} Projeto</span>
        </button>
      </div>
    </form>
  );
};