
import React from 'react';
import { type Submission, ContractType, Position } from '../types';

interface AvailabilityListProps {
  submissions: Submission[];
}

const Tag: React.FC<{ text: string; colorClasses: string }> = ({ text, colorClasses }) => (
  <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${colorClasses}`}>
    {text}
  </span>
);

const PositionTag: React.FC<{ position: Position }> = ({ position }) => {
  const colors: Record<Position, string> = {
    [Position.Monitor]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    [Position.Recepcionista]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    [Position.Socorrista]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    [Position.Limpeza]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  };
  return <Tag text={position} colorClasses={colors[position]} />;
};

const ContractTag: React.FC<{ contract: ContractType }> = ({ contract }) => {
  const colors: Record<ContractType, string> = {
    [ContractType.Intermitente]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    [ContractType.Freelancer]: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
  };
  return <Tag text={contract} colorClasses={colors[contract]} />;
};


const AvailabilityList: React.FC<AvailabilityListProps> = ({ submissions }) => {

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { day: '2-digit' });
  };

  const formatWeekDay = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { weekday: 'short' }).slice(0, 3);
  }

  if (submissions.length === 0) {
    return (
      <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-lg shadow-md">
        <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2z" />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-slate-900 dark:text-white">Nenhuma disponibilidade registrada</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Quando alguém registrar, aparecerá aqui.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
       <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Disponibilidades Registradas</h2>
      {submissions.map(submission => (
        <div key={submission.id} className="bg-white dark:bg-slate-800 shadow-lg rounded-xl p-6 transition hover:shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between sm:items-start">
            <div>
              <p className="text-xl font-bold text-slate-800 dark:text-white">{submission.firstName} {submission.lastName}</p>
              <div className="flex items-center space-x-2 mt-2">
                <PositionTag position={submission.position} />
                <ContractTag contract={submission.contract} />
              </div>
            </div>
            <div className="mt-4 sm:mt-0 sm:text-right">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Datas Disponíveis (Nov)</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
             <div className="flex flex-wrap gap-2">
              {submission.dates.map(date => (
                <div key={date.toISOString()} className="flex flex-col items-center justify-center w-14 h-14 bg-slate-100 dark:bg-slate-700 rounded-lg text-center">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">{formatWeekDay(date)}</span>
                  <span className="text-lg font-bold text-slate-800 dark:text-slate-100">{formatDate(date)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AvailabilityList;
