import api from './api';
import { Member } from '../interfaces';

/**
 * Serviço de membros que se comunica com o backend Spring Boot
 * Implementa os endpoints definidos no MemberController
 */

export const memberService = {
  // Criar novo membro
  async create(nome: string, cargo: string): Promise<Member> {
    const response = await api.post('/members', { nome, cargo });
    return response.data;
  },

  // Buscar membro por ID
  async getById(id: number): Promise<Member> {
    const response = await api.get(`/members/${id}`);
    return response.data;
  },

  // Buscar todos os membros
  async getAll(): Promise<Member[]> {
    const response = await api.get('/members');
    return response.data;
  },

  // Buscar apenas funcionários
  async getFuncionarios(): Promise<Member[]> {
    const response = await api.get('/members/cargo/funcionario');
    return response.data;
  },

  // Buscar apenas gerentes
  async getGerentes(): Promise<Member[]> {
    const response = await api.get('/members/cargo/gerente');
    return response.data;
  },

  // Buscar membros por termo de busca
  async search(term: string): Promise<Member[]> {
    const allMembers = await this.getAll();
    const searchTerm = term.toLowerCase();
    return allMembers.filter(member => 
      member.nome.toLowerCase().includes(searchTerm) ||
      member.cargo.toLowerCase().includes(searchTerm)
    );
  }
};
