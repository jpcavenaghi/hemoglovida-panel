import React, { useState, useEffect } from 'react';
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
import { db } from '../../services/firebase/config';
import { collection, onSnapshot, query, limit, orderBy } from 'firebase/firestore';

interface Activity {
  id: string;
  type: string;
  description: string;
  time: string;
  rawTimestamp?: any; 
}

type ActivitySectionKey = 'doadores' | 'campanhas' | 'agendamentos';

const ActivityItem: React.FC<{ activity: Activity }> = ({ activity }) => {
  let Icon = FiBell;
  let iconBgColor = 'bg-gray-100';
  let iconColor = 'text-gray-600';

  if (activity.type.includes('Doador') || activity.type.includes('Usuário')) {
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
  }

  if (activity.type.includes('Cancelado') || activity.type.includes('Inativado')) {
    Icon = FiTrash2;
    iconBgColor = 'bg-red-100';
    iconColor = 'text-red-600';
  } else if (activity.type.includes('Atualizado') || activity.type.includes('Remarcado')) {
    Icon = FiEdit2;
    iconBgColor = 'bg-yellow-100';
    iconColor = 'text-yellow-600';
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

export default function ActivitiesPage() {
  const [activeSection, setActiveSection] = useState<ActivitySectionKey>('doadores');
  
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Data desconhecida';
    if (dateString.includes('-')) {
      const parts = dateString.split('-');
      if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateString;
  };

  useEffect(() => {
    setIsLoading(true);
    let q;
    let collectionName = '';

    switch (activeSection) {
      case 'doadores':
        collectionName = 'users'; 
        break;
      case 'campanhas':
        collectionName = 'campaigns';
        break;
      case 'agendamentos':
        collectionName = 'appointments';
        break;
    }

    q = query(collection(db, collectionName), limit(20));

    const unsub = onSnapshot(q, (snapshot) => {
      const fetchedActivities: Activity[] = snapshot.docs.map(doc => {
        const data = doc.data();
        
        if (activeSection === 'doadores') {
          return {
            id: doc.id,
            type: 'Novo Doador',
            description: `${data.nome || 'Usuário'} (${data.tipoSanguineo || '?'})`,
            time: 'Cadastrado recentemente', 
          };
        } 
        else if (activeSection === 'campanhas') {
          return {
            id: doc.id,
            type: 'Campanha Criada',
            description: data.name || 'Campanha sem nome',
            time: formatDate(data.startDate),
          };
        } 
        else {
          return {
            id: doc.id,
            type: data.status === 'Cancelado' ? 'Agendamento Cancelado' : 'Novo Agendamento',
            description: `${data.patientName || 'Paciente'} (${formatDate(data.date)} às ${data.time})`,
            time: formatDate(data.date),
          };
        }
      });

      setActivities(fetchedActivities);
      setIsLoading(false);
    });

    return () => unsub();
  }, [activeSection]); 
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Atividades Recentes</h1>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-6" aria-label="Tabs">
          <button
            onClick={() => setActiveSection('doadores')}
            className={`
              shrink-0 border-b-2 px-1 py-3 text-sm font-semibold
              ${activeSection === 'doadores'
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
              ${activeSection === 'campanhas'
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
              ${activeSection === 'agendamentos'
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
        {isLoading ? (
          <p className="p-6 text-center text-gray-500">Carregando atividades...</p>
        ) : activities.length > 0 ? (
          <ul className="divide-y divide-gray-200 px-6">
            {activities.map(act => (
              <ActivityItem key={act.id} activity={act} />
            ))}
          </ul>
        ) : (
          <p className="p-6 text-center text-gray-500">
            Nenhuma atividade encontrada nesta seção.
          </p>
        )}
      </div>
    </div>
  );
}