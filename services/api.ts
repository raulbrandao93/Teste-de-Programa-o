import { type Submission } from '../types';

// ===================================================================================
// NOTA IMPORTANTE PARA O DESENVOLVEDOR:
// Este arquivo simula um backend usando o localStorage do navegador.
// Isso faz com que os dados persistam entre as sessões NO MESMO COMPUTADOR.
// Para um banco de dados real, acessível de qualquer lugar, esta lógica
// deve ser substituída por chamadas a uma API (como na versão anterior com 'fetch').
// ===================================================================================

const LOCAL_STORAGE_KEY = 'availabilitySubmissions';

// Helper para simular a demora de uma chamada de rede
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Busca todas as disponibilidades do localStorage.
 */
export const getSubmissions = async (): Promise<Submission[]> => {
  console.log("Buscando disponibilidades do armazenamento local...");
  await sleep(500); // Simula latência de rede

  try {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!storedData) {
      return [];
    }
    const submissions = JSON.parse(storedData);
    // Converte strings de data de volta para objetos Date, pois o JSON não armazena tipos Date.
    return submissions.map((submission: any) => ({
      ...submission,
      dates: submission.dates.map((d: string) => new Date(d)),
    }));
  } catch (error) {
    console.error("Erro ao buscar dados do localStorage:", error);
    // Retorna um array vazio se houver um erro de parsing ou outro problema.
    return [];
  }
};

/**
 * Adiciona uma nova disponibilidade no localStorage.
 */
export const addSubmission = async (submission: Omit<Submission, 'id'>): Promise<Submission> => {
  console.log("Salvando nova disponibilidade no armazenamento local...");
  await sleep(700); // Simula latência de rede

  try {
    // Usamos getSubmissions para garantir que estamos pegando a lista mais atual.
    const storedSubmissions = await getSubmissions();
    
    const newSubmission: Submission = {
      ...submission,
      id: new Date().toISOString() + Math.random(), // Cria um ID único para cada novo registro
    };

    const updatedSubmissions = [...storedSubmissions, newSubmission];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedSubmissions));
    
    return newSubmission;
  } catch (error) {
    console.error("Erro ao salvar dados no localStorage:", error);
    throw new Error("Não foi possível salvar a disponibilidade localmente.");
  }
};