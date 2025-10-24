import React, { useState } from 'react';
import {
  FiUsers,
  FiSend,
  FiClock,
  FiEdit2,
  FiTrash2,
  FiCheckCircle,
  FiBell,
  FiAlertTriangle
} from 'react-icons/fi';

// --- DADOS DE EXEMPLO (MOCK) ---
const activitiesBySection = {
  doadores: [
    { id: 'd1', type: 'Novo Doador', description: 'Carlos Silva (AB+)', time: '10 min atrás' },
    { id: 'd2', type: 'Doador Atualizado', description: 'Ana Carolina Silva (Tipo A-)', time: '2 horas atrás' },
    { id: 'd3', type: 'Doador Inativado', description: 'Fábio Nunes', time: '3 horas atrás' },
    { id: 'd4', type: 'Novo Doador', description: 'Maria Souza (A+)', time: 'Ontem, 14:20' },
  ],
  campanhas: [
    { id: 'c1', type: 'Campanha Criada', description: 'Urgência O-', time: '45 min atrás' },
    { id: 'c2', type: 'Campanha Concluída', description: 'Semana da Doação', time: 'Ontem, 17:00' },
    { id: 'c3', type: 'Alerta Enviado', description: 'Alerta para tipo A-', time: '20/10/2025' },
  ],
  agendamentos: [
    { id: 'a1', type: 'Novo Agendamento', description: 'Daniel Moreira (27/10, 14:00)', time: '1 hora atrás' },
    { id: 'a2', type: 'Agendamento Cancelado', description: 'Bruno Costa (26/10)', time: 'Ontem, 10:05' },
    { id: 'a3', type: 'Coleta Realizada', description: 'Carla Dias Souza', time: '19/10/2025' },
    { id: 'a4', type: 'Agendamento Remarcado', description: 'Eduarda Ferreira (para 31/10)', time: '19/10/2025' },
  ],
};

type ActivitySectionKey = keyof typeof activitiesBySection;

const ActivityItem: React.FC<{ activity: { type: string, description: string, time: string } }> = ({ activity }) => {
  let Icon;
  let iconBgColor;
  let iconColor;

  if (activity.type.includes('Doador')) {
    Icon = FiUsers;
    iconBgColor = 'bg-blue-100';
    iconColor = 'text-blue-600';
  } else if (activity.type.includes('Campanha')) {
    Icon = FiSend;
    iconBgColor = 'bg-green-100';
    iconColor = 'text-green-600';
  } else if (activity.type.includes('Agendamento') || activity.type.includes('Coleta')) {
    Icon = FiClock;
    iconBgColor = 'bg-purple-100';
    iconColor = 'text-purple-600';
  } else if (activity.type.includes('Alerta')) {
    Icon = FiAlertTriangle;
    iconBgColor = 'bg-yellow-100';
    iconColor = 'text-yellow-600';
  } else {
    Icon = FiBell;
    iconBgColor = 'bg-gray-100';
    iconColor = 'text-gray-600';
  }

  if (activity.type.includes('Cancelado') || activity.type.includes('Inativado')) {
    Icon = FiTrash2;
    iconBgColor = 'bg-red-100';
    iconColor = 'text-red-600';
  } else if (activity.type.includes('Atualizado') || activity.type.includes('Remarcado')) {
    Icon = FiEdit2;
    iconBgColor = 'bg-yellow-100';
    iconColor = 'text-yellow-600';
  } else if (activity.type.includes('Concluída') || activity.type.includes('Realizada')) {
    Icon = FiCheckCircle;
    iconBgColor = 'bg-green-100';
    iconColor = 'text-green-600';
  }

  return (
    <li className="flex items-center justify-between py-4">
      <div className="flex items-center gap-3">
        <span className={`flex-shrink-0 rounded-full p-2 ${iconBgColor}`}>
          <Icon className={iconColor} size={18} />
        </span>
        <div>
          <p className="font-medium text-gray-800">{activity.type}</p>
          <p className="text-sm text-gray-500">{activity.description}</p>
        </div>
      </div>
      <span className="flex-shrink-0 text-right text-xs text-gray-400">
        {activity.time}
      </span>
    </li>
  );
};


// --- COMPONENTE PRINCIPAL DA PÁGINA ---
export default function ActivitiesPage() {
  // Estado para controlar qual ABA está ativa.
  const [activeSection, setActiveSection] = useState<ActivitySectionKey>('doadores');

  const currentActivities = activitiesBySection[activeSection];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Atividades Recentes</h1>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-6" aria-label="Tabs">
          <button
            onClick={() => setActiveSection('doadores')}
            className={`
              shrink-0 border-b-2 px-1 py-3 text-sm font-semibold
              ${
                activeSection === 'doadores'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }
            `}
          >
            Doadores
          </button>
          
          <button
            onClick={() => setActiveSection('campanhas')}
            className={`
              shrink-0 border-b-2 px-1 py-3 text-sm font-semibold
              ${
                activeSection === 'campanhas'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }
            `}
          >
            Campanhas
          </button>

          <button
            onClick={() => setActiveSection('agendamentos')}
            className={`
              shrink-0 border-b-2 px-1 py-3 text-sm font-semibold
              ${
                activeSection === 'agendamentos'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }
            `}
          >
            Agendamentos
          </button>
        </nav>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
        {currentActivities.length > 0 ? (
          <ul className="divide-y divide-gray-200 px-6">
            {currentActivities.map(act => (
              <ActivityItem key={act.id} activity={act} />
            ))}
          </ul>
        ) : (
          <p className="p-6 text-center text-gray-500">
            Nenhuma atividade nesta seção.
          </p>
        )}
      </div>
    </div>
  );
}