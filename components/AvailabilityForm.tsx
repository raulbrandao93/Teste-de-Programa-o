
import React, { useState } from 'react';
import Calendar from './Calendar';
import { ContractType, Position, type Submission } from '../types';

interface AvailabilityFormProps {
  onSubmit: (submission: Omit<Submission, 'id'>) => void;
}

const AvailabilityForm: React.FC<AvailabilityFormProps> = ({ onSubmit }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contract, setContract] = useState<ContractType>(ContractType.Intermitente);
  const [position, setPosition] = useState<Position>(Position.Monitor);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleDateSelect = (date: Date) => {
    setSelectedDates(prevDates => {
      const dateExists = prevDates.some(d => d.getTime() === date.getTime());
      if (dateExists) {
        return prevDates.filter(d => d.getTime() !== date.getTime());
      } else {
        return [...prevDates, date].sort((a, b) => a.getTime() - b.getTime());
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName) {
      setError('Nome e sobrenome são obrigatórios.');
      return;
    }
    if (selectedDates.length === 0) {
      setError('Selecione ao menos uma data de disponibilidade.');
      return;
    }

    setError(null);
    onSubmit({ firstName, lastName, contract, position, dates: selectedDates });
    
    // Reset form
    setFirstName('');
    setLastName('');
    setContract(ContractType.Intermitente);
    setPosition(Position.Monitor);
    setSelectedDates([]);
  };
  
  const InputField: React.FC<{id: string, label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void}> = ({id, label, value, onChange}) => (
     <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
        <div className="mt-1">
          <input
            type="text"
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            className="block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm bg-white dark:bg-slate-700"
          />
        </div>
      </div>
  );

  const SelectField: React.FC<{id: string, label: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, options: string[]}> = ({id, label, value, onChange, options}) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            {label}
        </label>
        <select
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 py-2 pl-3 pr-10 text-base focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm bg-white dark:bg-slate-700"
        >
            {options.map(option => <option key={option}>{option}</option>)}
        </select>
    </div>
  );


  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Registrar Disponibilidade</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField id="firstName" label="Nome" value={firstName} onChange={e => setFirstName(e.target.value)} />
          <InputField id="lastName" label="Sobrenome" value={lastName} onChange={e => setLastName(e.target.value)} />
          <SelectField id="contract" label="Contrato" value={contract} onChange={e => setContract(e.target.value as ContractType)} options={Object.values(ContractType)} />
          <SelectField id="position" label="Posição" value={position} onChange={e => setPosition(e.target.value as Position)} options={Object.values(Position)} />
        </div>

        <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Datas de Disponibilidade (Novembro)
            </label>
            <Calendar selectedDates={selectedDates} onDateSelect={handleDateSelect} />
        </div>

        {error && (
            <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
        )}

        <div className="pt-4">
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
          >
            Salvar Disponibilidade
          </button>
        </div>
      </form>
    </div>
  );
};

export default AvailabilityForm;
