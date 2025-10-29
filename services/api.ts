
import { type Submission } from '../types';

const STORAGE_KEY = 'submissions';

// Simula a latência da rede
const networkDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

/**
 * Busca todas as disponibilidades.
 * Simula uma chamada de API GET.
 */
export const getSubmissions = async (): Promise<Submission[]> => {
  await networkDelay(500); // Simula 0.5s de carregamento
  try {
    const savedSubmissions = window.localStorage.getItem(STORAGE_KEY);
    if (savedSubmissions) {
      return JSON.parse(savedSubmissions) as Submission[];
    }
    return [];
  } catch (error) {
    console.error("API Error (getSubmissions): Failed to parse submissions from localStorage", error);
    // Em uma API real, você poderia retornar um erro mais específico.
    throw new Error("Failed to fetch data.");
  }
};

/**
 * Adiciona uma nova disponibilidade.
 * Simula uma chamada de API POST.
 */
export const addSubmission = async (submission: Omit<Submission, 'id'>): Promise<Submission> => {
  await networkDelay(800); // Simula 0.8s para salvar

  try {
    const currentSubmissions = await getSubmissions();
    const newSubmission: Submission = { 
      ...submission, 
      id: new Date().toISOString() + Math.random().toString(36).substr(2, 9) 
    };

    const updatedSubmissions = [...currentSubmissions, newSubmission];
    
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSubmissions));
    
    return newSubmission;
  } catch (error) {
    console.error("API Error (addSubmission): Failed to save submission to localStorage", error);
    throw new Error("Failed to save data.");
  }
};
