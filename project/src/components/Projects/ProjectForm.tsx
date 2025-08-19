/**
 * Componente ProjectForm - Formulário para criar/editar projetos
 * Formulário completo com validações e regras de negócio
 * Integrado com o backend Spring Boot
 */

import React, { useState, useEffect } from 'react';
import { Project, ProjectFormData, ProjectUpdateData } from '../../interfaces';
import { useMembers } from '../../hooks/useMembers';
import { LoadingSpinner } from '../UI/LoadingSpinner';
import { ErrorMessage } from '../UI/ErrorMessage';
import { Autocomplete } from '../UI/Autocomplete';
import { formatCurrency, validateMembersCount } from '../../utils';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';
import { Member } from '../../interfaces';

interface ProjectFormProps {
  project?: Project;
  onSubmit: (data: ProjectFormData | ProjectUpdateData) => Promise<boolean>;
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

  // Estado do formulário
  const [formData, setFormData] = useState<ProjectFormData>({
    nome: project?.nome || '',
    dataInicio: project?.dataInicio || '',
    previsaoTermino: project?.previsaoTermino || '',
    orcamentoTotal: project?.orcamentoTotal || 0,
    descricao: project?.descricao || '',
    gerenteId: project?.gerente?.id || 0,
    membros: project?.membros || [],
    dataRealTermino: project?.dataRealTermino || ''
  });

  // Estado para autocomplete
  const [selectedGerente, setSelectedGerente] = useState<Member | null>(
    project?.gerente || null
  );
  const [selectedMembros, setSelectedMembros] = useState<Member[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Carrega membros selecionados quando o projeto é carregado
  useEffect(() => {
    if (project?.membros && funcionarios.length > 0) {
      const membrosSelecionados = funcionarios.filter(member => 
        project.membros.includes(member.id)
      );
      setSelectedMembros(membrosSelecionados);
    }
  }, [project, funcionarios]);

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
   * Manipula seleção de gerente
   */
  const handleGerenteSelect = (gerente: Member | null) => {
    setSelectedGerente(gerente);
    updateField('gerenteId', gerente?.id || 0);
    
    if (errors.gerenteId) {
      setErrors(prev => ({ ...prev, gerenteId: '' }));
    }
  };

  /**
   * Manipula seleção de membros
   */
  const handleMembroSelect = (membro: Member | null) => {
    if (!membro) return;

    const isAlreadySelected = selectedMembros.some(m => m.id === membro.id);
    if (isAlreadySelected) {
      toast.error('Este membro já foi selecionado');
      return;
    }

    if (selectedMembros.length >= 10) {
      toast.error('Máximo de 10 membros por projeto');
      return;
    }

    const newMembros = [...selectedMembros, membro];
    setSelectedMembros(newMembros);
    updateField('membros', newMembros.map(m => m.id));
    
    if (errors.membros) {
      setErrors(prev => ({ ...prev, membros: '' }));
    }
  };

  /**
   * Remove membro da seleção
   */
  const removeMembro = (membroId: number) => {
    const newMembros = selectedMembros.filter(m => m.id !== membroId);
    setSelectedMembros(newMembros);
    updateField('membros', newMembros.map(m => m.id));
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

    if (formData.orcamentoTotal <= 0) {
      newErrors.orcamentoTotal = 'Orçamento deve ser maior que zero';
    }

    if (!formData.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
    }

    if (!selectedGerente) {
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

    // Validação de membros
    if (selectedMembros.length === 0) {
      newErrors.membros = 'Pelo menos um membro deve ser selecionado';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Manipula o envio do formulário
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Por favor, corrija os erros no formulário');
      return;
    }

    setIsSubmitting(true);
    
    try {
      let success: boolean;
      
      if (project) {
        // Edição: usa ProjectUpdateData (sem membros)
        const updateData: ProjectUpdateData = {
          nome: formData.nome,
          dataInicio: formData.dataInicio,
          previsaoTermino: formData.previsaoTermino,
          orcamentoTotal: formData.orcamentoTotal,
          descricao: formData.descricao,
          gerenteId: formData.gerenteId,
          dataRealTermino: formData.dataRealTermino || null
        };
        success = await onSubmit(updateData);
      } else {
        // Criação: usa ProjectFormData (com membros)
        const createData: ProjectFormData = {
          ...formData,
          membros: selectedMembros.map(m => m.id)
        };
        success = await onSubmit(createData);
      }
      
      if (success) {
        // Formulário enviado com sucesso
        setFormData({
          nome: '',
          dataInicio: '',
          previsaoTermino: '',
          orcamentoTotal: 0,
          descricao: '',
          gerenteId: 0,
          membros: [],
          dataRealTermino: ''
        });
        setSelectedGerente(null);
        setSelectedMembros([]);
      }
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (membersLoading) {
    return <LoadingSpinner />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nome do Projeto */}
      <div>
        <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
          Nome do Projeto *
        </label>
        <input
          type="text"
          id="nome"
          value={formData.nome}
          onChange={(e) => updateField('nome', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.nome ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Digite o nome do projeto"
        />
        {errors.nome && <p className="mt-1 text-sm text-red-600">{errors.nome}</p>}
      </div>

      {/* Datas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="dataInicio" className="block text-sm font-medium text-gray-700 mb-2">
            Data de Início *
          </label>
          <input
            type="date"
            id="dataInicio"
            value={formData.dataInicio}
            onChange={(e) => updateField('dataInicio', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.dataInicio ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.dataInicio && <p className="mt-1 text-sm text-red-600">{errors.dataInicio}</p>}
        </div>

        <div>
          <label htmlFor="previsaoTermino" className="block text-sm font-medium text-gray-700 mb-2">
            Previsão de Término *
          </label>
          <input
            type="date"
            id="previsaoTermino"
            value={formData.previsaoTermino}
            onChange={(e) => updateField('previsaoTermino', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.previsaoTermino ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.previsaoTermino && <p className="mt-1 text-sm text-red-600">{errors.previsaoTermino}</p>}
        </div>
      </div>

      {/* Data Real de Término (apenas para edição) */}
      {project && (
        <div>
          <label htmlFor="dataRealTermino" className="block text-sm font-medium text-gray-700 mb-2">
            Data Real de Término
          </label>
          <input
            type="date"
            id="dataRealTermino"
            value={formData.dataRealTermino || ''}
            onChange={(e) => updateField('dataRealTermino', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            Deixe em branco se o projeto ainda não foi concluído
          </p>
        </div>
      )}

      {/* Orçamento */}
      <div>
        <label htmlFor="orcamentoTotal" className="block text-sm font-medium text-gray-700 mb-2">
          Orçamento Total (R$) *
        </label>
        <input
          type="number"
          id="orcamentoTotal"
          value={formData.orcamentoTotal}
          onChange={(e) => updateField('orcamentoTotal', parseFloat(e.target.value) || 0)}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.orcamentoTotal ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="0,00"
          min="0"
          step="0.01"
        />
        {errors.orcamentoTotal && <p className="mt-1 text-sm text-red-600">{errors.orcamentoTotal}</p>}
      </div>

      {/* Descrição */}
      <div>
        <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-2">
          Descrição *
        </label>
        <textarea
          id="descricao"
          value={formData.descricao}
          onChange={(e) => updateField('descricao', e.target.value)}
          rows={4}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.descricao ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Descreva o projeto..."
        />
        {errors.descricao && <p className="mt-1 text-sm text-red-600">{errors.descricao}</p>}
      </div>

      {/* Seleção de Gerente */}
      <Autocomplete
        label="Gerente do Projeto *"
        placeholder="Buscar gerente..."
        value={selectedGerente}
        onSelect={handleGerenteSelect}
        options={gerentes}
        loading={membersLoading}
        error={errors.gerenteId}
        required
      />

      {/* Seleção de Membros */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Membros da Equipe *
        </label>
        
        {/* Campo de busca de membros */}
        <Autocomplete
          label=""
          placeholder="Buscar funcionário..."
          value={null}
          onSelect={handleMembroSelect}
          options={funcionarios.filter(m => !selectedMembros.some(sm => sm.id === m.id))}
          loading={membersLoading}
          error={errors.membros}
        />

        {/* Lista de membros selecionados */}
        {selectedMembros.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Membros Selecionados ({selectedMembros.length}/10)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {selectedMembros.map((membro) => (
                <div key={membro.id} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div>
                    <div className="font-medium text-green-800">{membro.nome}</div>
                    <div className="text-sm text-green-600">{membro.cargo}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeMembro(membro.id)}
                    className="p-1 text-green-600 hover:text-green-800 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {errors.membros && <p className="mt-1 text-sm text-red-600">{errors.membros}</p>}
      </div>

      {/* Botões de Ação */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting || loading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting || loading ? 'Salvando...' : project ? 'Atualizar Projeto' : 'Criar Projeto'}
        </button>
      </div>
    </form>
  );
};