import React, { useState, useCallback, useEffect } from 'react';
import AvailabilityForm from './components/AvailabilityForm';
import AvailabilityList from './components/AvailabilityList';
import { type Submission } from './types';
import { addSubmission as apiAddSubmission, getSubmissions as apiGetSubmissions } from './services/api';

type View = 'form' | 'list';

const App: React.FC = () => {
  const [view, setView] = useState<View>('form');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await apiGetSubmissions();
        setSubmissions(data.sort((a, b) => a.lastName.localeCompare(b.lastName)));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Não foi possível carregar as disponibilidades. Tente novamente mais tarde.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubmissions();
  }, []);

  const addSubmission = useCallback(async (submission: Omit<Submission, 'id'>) => {
    try {
      const newSubmission = await apiAddSubmission(submission);
      setSubmissions(prev => 
        [...prev, newSubmission].sort((a, b) => a.lastName.localeCompare(b.lastName))
      );
      setView('list');
    } catch (err) {
       setError(err instanceof Error ? err.message : "Não foi possível salvar a disponibilidade. Verifique sua conexão e tente novamente.");
       console.error(err);
       // Re-throw to be caught in form component
       throw err;
    }
  }, []);
  
  const Header: React.FC = () => (
    <header className="bg-white dark:bg-slate-800 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
            Gestor de Escalas
          </h1>
          <nav className="flex items-center space-x-2 sm:space-x-4">
            <NavButton label="Formulário" currentView={view} targetView="form" setView={setView} />
            <NavButton label="Disponibilidades" currentView={view} targetView="list" setView={setView} />
          </nav>
        </div>
      </div>
    </header>
  );

  interface NavButtonProps {
    label: string;
    currentView: View;
    targetView: View;
    setView: (view: View) => void;
  }
  
  const NavButton: React.FC<NavButtonProps> = ({ label, currentView, targetView, setView }) => {
    const isActive = currentView === targetView;
    const baseClasses = "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500";
    const activeClasses = "bg-purple-600 text-white shadow";
    const inactiveClasses = "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700";

    return (
      <button onClick={() => setView(targetView)} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
        {label}
      </button>
    );
  };
  
  const renderContent = () => {
    if (isLoading) {
      return <div className="text-center py-16">Carregando disponibilidades...</div>;
    }

    if (error && view === 'list') {
       return <div className="text-center py-16 text-red-500 bg-red-50 dark:bg-red-900/20 p-6 rounded-lg"><strong>Erro:</strong> {error}</div>;
    }

    if (view === 'form') {
      return <AvailabilityForm onSubmit={addSubmission} />;
    }

    return <AvailabilityList submissions={submissions} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
      <footer className="text-center py-4 text-xs text-slate-500 dark:text-slate-400">
        <p>&copy; {new Date().getFullYear()} Gestor de Escalas. Todos os direitos reservados. V2</p>
      </footer>
    </div>
  );
};

export default App;