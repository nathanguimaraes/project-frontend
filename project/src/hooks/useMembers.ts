/**
 * Hook customizado para gerenciar estado e operações dos membros
 * Centraliza a lógica de busca e validações de membros da equipe
 * Integrado com o backend Spring Boot
 */

import { useState, useEffect, useCallback } from 'react';
import { Member } from '../interfaces';
import { memberService } from '../services/memberService';
import toast from 'react-hot-toast';

interface UseMembersReturn {
  members: Member[];
  funcionarios: Member[];
  gerentes: Member[];
  loading: boolean;
  error: string | null;
  getMemberById: (id: number) => Member | undefined;
  createMember: (nome: string, cargo: string) => Promise<boolean>;
  searchMembers: (term: string) => Promise<Member[]>;
  refreshMembers: () => Promise<void>;
}

/**
 * Hook principal para gerenciamento de membros
 */
export const useMembers = (): UseMembersReturn => {
  const [members, setMembers] = useState<Member[]>([]);
  const [funcionarios, setFuncionarios] = useState<Member[]>([]);
  const [gerentes, setGerentes] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carrega todos os membros e separa por categoria
   */
  const loadMembers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Carrega todos os dados em paralelo para melhor performance
      const [allMembers, funcionariosData, gerentesData] = await Promise.all([
        memberService.getAll(),
        memberService.getFuncionarios(),
        memberService.getGerentes()
      ]);

      setMembers(allMembers);
      setFuncionarios(funcionariosData);
      setGerentes(gerentesData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar membros';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Busca um membro por ID
   */
  const getMemberById = useCallback((id: number): Member | undefined => {
    return members.find(member => member.id === id);
  }, [members]);

  /**
   * Cria um novo membro
   */
  const createMember = useCallback(async (nome: string, cargo: string): Promise<boolean> => {
    try {
      setError(null);
      
      if (!nome.trim()) {
        toast.error('Nome do membro é obrigatório');
        return false;
      }

      if (!cargo.trim()) {
        toast.error('Cargo do membro é obrigatório');
        return false;
      }

      const newMember = await memberService.create(nome, cargo);
      setMembers(prev => [...prev, newMember]);
      
      // Atualiza as listas separadas
      if (cargo.toLowerCase().includes('gerente') || cargo.toLowerCase().includes('manager')) {
        setGerentes(prev => [...prev, newMember]);
      } else {
        setFuncionarios(prev => [...prev, newMember]);
      }
      
      toast.success('Membro criado com sucesso!');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar membro';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    }
  }, []);

  /**
   * Busca membros por termo
   */
  const searchMembers = useCallback(async (term: string): Promise<Member[]> => {
    try {
      return await memberService.search(term);
    } catch (err) {
      console.error('Erro ao buscar membros:', err);
      return [];
    }
  }, []);

  /**
   * Recarrega a lista de membros
   */
  const refreshMembers = useCallback(async () => {
    await loadMembers();
  }, [loadMembers]);

  // Carrega membros na inicialização
  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  return {
    members,
    funcionarios,
    gerentes,
    loading,
    error,
    getMemberById,
    createMember,
    searchMembers,
    refreshMembers
  };
};

/**
 * Hook específico para buscar um membro por ID
 */
export const useMember = (id: number) => {
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMember = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await memberService.getById(id);
        setMember(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar membro';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadMember();
    }
  }, [id]);

  return { member, loading, error };
};

/**
 * Hook para validações específicas de membros em projetos
 */
export const useMemberValidation = () => {
  const { members } = useMembers();

  /**
   * Valida se a seleção de membros para um projeto está correta
   */
  const validateProjectMembers = useCallback((
    membrosIds: string[],
    gerenteId: string
  ): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Validação básica de quantidade
    if (membrosIds.length === 0) {
      errors.push('Pelo menos um membro deve ser selecionado');
    }

    if (membrosIds.length > 10) {
      errors.push('Máximo de 10 membros por projeto');
    }

    // Validação de gerente
    const gerente = members.find(m => m.id === gerenteId);
    if (!gerente) {
      errors.push('Gerente não encontrado');
    } else if (gerente.atribuicao !== 'gerente') {
      errors.push('Apenas membros com atribuição "gerente" podem ser gerentes de projeto');
    }

    // Validação de membros
    const membrosInvalidos = membrosIds.filter(id => {
      const membro = members.find(m => m.id === id);
      return !membro || membro.atribuicao !== 'funcionario';
    });

    if (membrosInvalidos.length > 0) {
      errors.push('Apenas funcionários podem ser associados como membros do projeto');
    }

    // Validação de capacidade dos membros
    const membrosComCapacidadeExcedida = membrosIds.filter(id => {
      const membro = members.find(m => m.id === id);
      return membro && !canAssignMemberToProject(membro);
    });

    if (membrosComCapacidadeExcedida.length > 0) {
      const nomesMembros = membrosComCapacidadeExcedida
        .map(id => members.find(m => m.id === id)?.nome)
        .filter(Boolean)
        .join(', ');
      
      errors.push(`Os seguintes membros já possuem 3 projetos ativos: ${nomesMembros}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }, [members]);

  return {
    validateProjectMembers
  };
};