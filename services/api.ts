import { type Submission } from '../types';

// ===================================================================================
// NOTA IMPORTANTE PARA O DESENVOLVEDOR:
// Este arquivo foi atualizado para fazer chamadas a uma API backend.
// As funções agora usam `fetch` para se comunicar com endpoints como '/api/submissions'.
// Para que a aplicação funcione, é necessário um backend que responda a essas rotas.
// A lógica do localStorage foi removida.
// ===================================================================================

const API_BASE_URL = '/api'; // URL base para a API backend

/**
 * Busca todas as disponibilidades do backend.
 */
export const getSubmissions = async (): Promise<Submission[]> => {
  console.log("Buscando disponibilidades do backend...");
  
  try {
    const response = await fetch(`${API_BASE_URL}/submissions`);
    if (!response.ok) {
      // Tenta extrair uma mensagem de erro do corpo da resposta, se houver
      const errorBody = await response.text();
      throw new Error(`Erro de rede: ${response.status} ${response.statusText}. ${errorBody}`);
    }
    const submissions = await response.json();
    
    // Converte strings de data de volta para objetos Date, pois o JSON não armazena tipos Date.
    return submissions.map((submission: any) => ({
      ...submission,
      dates: submission.dates.map((d: string) => new Date(d)),
    }));
  } catch (error) {
    console.error("Erro ao buscar dados da API:", error);
    // Lança o erro para que o componente que chamou possa tratá-lo (e.g., mostrar uma mensagem de erro na UI).
    throw new Error("Não foi possível carregar as disponibilidades do servidor. Verifique a conexão ou contate o suporte.");
  }
};

/**
 * Adiciona uma nova disponibilidade via API.
 */
export const addSubmission = async (submission: Omit<Submission, 'id'>): Promise<Submission> => {
  console.log("Enviando nova disponibilidade para o backend...");

  try {
    const response = await fetch(`${API_BASE_URL}/submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submission),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Erro de rede: ${response.status} ${response.statusText}. ${errorBody}`);
    }

    const newSubmission = await response.json();

    // O backend deve retornar a submissão criada, incluindo o ID.
    // Também convertemos as datas, caso o backend as retorne como string.
    return {
        ...newSubmission,
        dates: newSubmission.dates.map((d: string) => new Date(d)),
    };
  } catch (error) {
    console.error("Erro ao salvar dados na API:", error);
    throw new Error("Não foi possível salvar a disponibilidade no servidor. Verifique a conexão ou contate o suporte.");
  }
};
