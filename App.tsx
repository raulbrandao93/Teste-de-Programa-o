
import React, { useState, useCallback } from 'react';
import AvailabilityForm from './components/AvailabilityForm';
import AvailabilityList from './components/AvailabilityList';
import { type Submission } from './types';

type View = 'form' | 'list';

const App: React.FC = () => {
  const [view, setView] = useState<View>('form');
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  const addSubmission = useCallback((submission: Omit<Submission, 'id'>) => {
    const newSubmission: Submission = { ...submission, id: new Date().toISOString() + Math.random() };
    setSubmissions(prev => [...prev, newSubmission].sort((a, b) => a.lastName.localeCompare(b.lastName)));
    setView('list');
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
    const baseClasses = "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";
    const activeClasses = "bg-indigo-600 text-white shadow";
    const inactiveClasses = "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700";

    return (
      <button onClick={() => setView(targetView)} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
        {label}
      </button>
    );
  };
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'form' ? (
          <AvailabilityForm onSubmit={addSubmission} />
        ) : (
          <AvailabilityList submissions={submissions} />
        )}
      </main>
      <footer className="text-center py-4 text-xs text-slate-500 dark:text-slate-400">
        <p>&copy; {new Date().getFullYear()} Gestor de Escalas. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default App;
