import { type Submission } from '../types';

// ===================================================================================
// NOTA IMPORTANTE PARA O DESENVOLVEDOR:
// Este arquivo SIMULA uma API de backend usando o localStorage do navegador.
// Isso foi feito para que o aplicativo funcione sem precisar de um servidor real.
// Os dados salvos aqui ficarão apenas no seu navegador.
// Quando um backend de verdade for desenvolvido, este arquivo deve ser substituído
// pela lógica de chamadas de rede (fetch/axios) para a API real.
// ===================================================================================

const LOCAL_STORAGE_KEY = 'submissions';
const API_DELAY = 500; // Simula a latência da rede em milissegundos

/**
 * Busca todas as disponibilidades do localStorage.
 */
export const getSubmissions = async (): Promise<Submission[]> => {
  console.log("Buscando disponibilidades do mock (localStorage)...");
  
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        const storedSubmissions = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (!storedSubmissions) {
          resolve([]);
          return;
        }
        const submissions = JSON.parse(storedSubmissions);
        // Converte strings de data de volta para objetos Date
        const submissionsWithDates = submissions.map((submission: any) => ({
          ...submission,
          dates: submission.dates.map((d: string) => new Date(d)),
        }));
        resolve(submissionsWithDates);
      } catch (error) {
        console.error("Erro ao buscar dados do localStorage:", error);
        resolve([]); // Retorna um array vazio em caso de erro
      }
    }, API_DELAY);
  });
};

/**
 * Adiciona uma nova disponibilidade no localStorage.
 */
export const addSubmission = async (submission: Omit<Submission, 'id'>): Promise<Submission> => {
  console.log("Enviando nova disponibilidade para o mock (localStorage)...");

  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const currentSubmissions = await getSubmissions();
        
        const newSubmission: Submission = {
          ...submission,
          id: new Date().toISOString() + Math.random(), // Cria um ID único
        };
        
        const updatedSubmissions = [...currentSubmissions, newSubmission];
        
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedSubmissions));
        
        resolve(newSubmission);
      } catch (error) {
        console.error("Erro ao salvar dados no localStorage:", error);
        reject(new Error("Não foi possível salvar a disponibilidade no armazenamento local."));
      }
    }, API_DELAY);
  });
};